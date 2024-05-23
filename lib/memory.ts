import { Redis } from '@upstash/redis';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

// import { HttpsProxyAgent } from 'https-proxy-agent';
// import http from 'http';
// import { HttpsProxyAgent } from 'https-proxy-agent';
// // Configure the default for all requests:
// const openai = new OpenAI({
//   httpAgent: new HttpsProxyAgent('http://168.63.76.32:3128'),
// });


export type CompanionKey = {
  userId: string;
  modelName: string;
  companionName: string;
}

export class MemoryManager{
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new Pinecone(
    //   {
    //   apiKey: process.env.PINECONE_API_KEY!,
    // }
    );
  }

  public async init() {
    if (this.vectorDBClient instanceof Pinecone) {
      // await this.vectorDBClient.index(process.env.PINECONE_INDEX!)
      await this.vectorDBClient.index(process.env.PINECONE_API_KEY!)
    }
  }

  public async vectorSearch(recentChatHistory: string, companionFileName: string): Promise<any> {
    const pineconeClient = this.vectorDBClient;

    const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX!);
    
    const vectorStore = await PineconeStore.fromExistingIndex(
     new OpenAIEmbeddings({
       openAIApiKey: process.env.OPENAI_API_KEY,
       configuration:{
         baseURL: 'http://127.0.0.1:3000'
        } 
      }),
       { pineconeIndex },
    );

    const similarDocs = await vectorStore.similaritySearch(
      recentChatHistory,
      3, 
      { filename: companionFileName }
      ).catch((err:Error) => {
        console.log(err instanceof Error);
      console.log("Failed to get vector search results", err.name, err.message);
    });

    return similarDocs;
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }

    return MemoryManager.instance;
  }

  private generateRedisCompanionKey(companionKey: CompanionKey): string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`
  }

  public async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == 'undefined') {
      console.log('Companion key set incorrectly');
      return '';
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });
    
    return result;
  }
  
  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    if (!companionKey || typeof companionKey.userId == 'undefined') {
      console.log('Companion key set incorrectly');
      return '';
    }
    
    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true
    });

    result = result.slice(-30).reverse();

    const recentChats = result.reverse().join('\n');

    return recentChats;
  }

  public async seedChatHistory(
    seedContent: string,
    delimiter: string = '\n',
    companionKey: CompanionKey
    ) {
      const key = this.generateRedisCompanionKey(companionKey);

      if (await this.history.exists(key)) {
        console.log('User already chat history')
      }

      const content = seedContent.split(delimiter);
      let counter = 0;

      for (const line of content) {
        await this.history.zadd(key, {
          score: counter,
          member: line
        });
        counter++;
      }
  }
}