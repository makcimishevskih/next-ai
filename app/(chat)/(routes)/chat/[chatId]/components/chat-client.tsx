import { Companion, Message } from '@prisma/client';
import ChatHeader from './chat-header';

type ChatClientProps = {
  companion: (Companion & {
    messages: Message[]
    _count: {
      messages: number
    }
  })
}

const ChatClient = ({ companion }: ChatClientProps) => {
  return (
    <div className='flex flex-col h-full p-4 space-y-2'>
      <ChatHeader companion={companion} />
    </div>
  );
};

export default ChatClient;