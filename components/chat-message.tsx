"use client";

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useToast } from '@/components/ui/use-toast';

import { Copy } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import { Button } from '@/components/ui/button';
import BotAvatar from '@/components/bot-avatar';
import UserAvatar from '@/components/user-avatar';

export type ChatMessageProps = {
  src?: string
  content?: string,
  isLoading?: boolean,
  role: 'system' | 'user',
}

const ChatMessage = ({
  role,
  content,
  src,
  isLoading
}: ChatMessageProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();

  const onCopy = () => {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content);
    toast({
      description: 'Message copied to clipboard'
    });
  }

  return (
    <div className={cn(
      'group flex items-start gap-x-3 py-4 w-full',
      role === "user" && "justify-end"
    )}>
      {role !== 'user' && src && <BotAvatar src={src} />}

      <div className='rounded px-4 py-2 max-w-sm text-sm bg-primary/10'>
        {isLoading ?
          <BeatLoader
            size={5}
            color={theme === 'light' ? 'black' : 'white'}
          />
          : content
        }
      </div>
      {role === 'user'
        && <UserAvatar />
      }

      {role !== 'user' && !isLoading && (
        <Button
          size='icon'
          onClick={onCopy}
          className='opacity-0 group-hover:opacity-100 transition'
          variant='ghost'
        >
          <Copy />
        </Button>
      )}
    </div >
  )
};

export default ChatMessage;