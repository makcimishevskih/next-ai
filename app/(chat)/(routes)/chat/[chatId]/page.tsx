import { auth } from '@clerk/nextjs/server';

import prismadb from '@/lib/prismadb';
import { redirect } from 'next/navigation';
// @ts-ignore-next-line
import ChatClient from '@/(root)/(routes)/companion/[companionId]/components/chat-client';

type ChatIdPageProps = {
  params: {
    chatId: string
  }
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
  const { userId, redirectToSignIn } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc'
        },
        where: {
          userId
        }
      },
      _count: {
        select: {
          messages: true
        }
      }
    }
  });

  if (!companion) {
    return redirect('/');
  }

  return (
    <div className='h-full'>
      <ChatClient companion={companion} />
    </div>
  );
};

export default ChatIdPage;