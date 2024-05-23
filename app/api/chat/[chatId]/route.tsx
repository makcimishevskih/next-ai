import { NextResponse } from 'next/server';
import { LangChainAdapter, StreamingTextResponse } from 'ai';
import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";

import prismadb from '@/lib/prismadb';
import { rateLimit } from '@/lib/rate-limit';
import { CompanionKey, MemoryManager } from '@/lib/memory';
import { currentUser } from '@clerk/nextjs/server';

import { Replicate } from "@langchain/community/llms/replicate";

export const POST = async (
  req: Request,
  { params }: { params: { chatId: string } }
) => {
  try {
    const { prompt } = await req.json();
    const user = await currentUser();

    console.log(111, "prompt: ", prompt)

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("[ChatId POST] Unauthorizes", { status: 401 });
    }

    const indentifier = req.url + '-' + user.id;
    const { success } = await rateLimit(indentifier);

    if (!success) {
      return new NextResponse("[ChatId POST] Rate limit exceeded", { status: 429 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.chatId
      },
      data: {
        messages: {
          create: {
            role: 'user',
            content: prompt,
            userId: user.id
          }
        }
      }
    });

    if (!companion) {
      return new NextResponse("[ChatId POST] Companion not found", { status: 404 });
    }

    const name = companion.id;
    const companion_file_name = name + '.txt';

    const companionKey: CompanionKey = {
      companionName: name,
      userId: user.id,
      modelName: 'llama2-13b'
    };

    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(companionKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, '\n\n', companionKey);
    }

    await memoryManager.writeToHistory('User: ' + prompt + '\n', companionKey);

    const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      companion_file_name
    );

    let relevantHistory = '';

    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc: any) => doc.pageContent).join('\n');
    }
    console.log('SIMILAR--------------------------->', similarDocs);

    // @ts-ignore-next-line
    const { handlers } = LangChainAdapter();

    const model = new Replicate({
      model: "a16z-infra/llama-2-13b-chat:df7690f1994d93e96ad9d568aecf50684a0b25a41cc40061269e5",
      input: {
        max_length: 2048
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      // 5:02 --------------------------------->
      // callbacks: CallbackManager.fromHandlers(handlers)
      callbacks: [new ConsoleCallbackHandler(handlers)]
    });

    // const model = new OpenAI({
    //   modelName: "gpt-3.5-turbo-16k",
    //   openAIApiKey: process.env.OPENAI_API_KEY,
    // });


    model.verbose = true;

    const resp = String(
      await model.invoke(`
      ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix

      ${companion.instructions}
      
      Below are the relevant details about ${name}'s past and the converation you are in.

      ${recentChatHistory}\n${name}:
      `).catch(console.error)
    );

    const cleaned = resp.replaceAll(',', '');
    const chunks = cleaned.split('\n');
    const response = chunks[0];
    const trimedResponse = response.trim()

    await memoryManager.writeToHistory('' + trimedResponse, companionKey);

    var streamReadable = require('stream').Readable;

    streamReadable.push(response);
    streamReadable.push(null);

    if (!response !== undefined && response.length > 1) {
      memoryManager.writeToHistory('' + trimedResponse, companionKey);

      await prismadb.companion.update({
        where: {
          id: params.chatId
        },
        data: {
          messages: {
            create: {
              userId: user.id,
              role: 'system',
              content: trimedResponse
            }
          }
        }
      })
    }

    return new StreamingTextResponse(streamReadable)

  } catch (err) {
    console.log("[CHATID_POST]", err)
    return new NextResponse("[ChatId POST] Internal Error", { status: 500 });
  }
}