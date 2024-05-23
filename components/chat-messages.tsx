"use client";

// import { useUser } from '@clerk/nextjs';
// import { auth } from '@clerk/nextjs/server';
import { Companion } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

import ChatMessage, { ChatMessageProps } from './chat-message';

type ChatMessagesProps = {
  messages: ChatMessageProps[],
  companion: Companion,
  isLoading: boolean
}

const ChatMessages = ({
  companion,
  isLoading,
  messages = []
}: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [fakeLoading, setFakeLoading] = useState(messages.length ? true : false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [])

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length])

  return (
    <div className='flex-1 overflow-y-auto pr-4'>
      <ChatMessage
        role="system"
        key={companion.id}
        isLoading={fakeLoading}
        src={companion.src}
        content={`Hello, Iam ${companion.name} ${companion.description}`}
      />
      {messages.map((message) => (
        <ChatMessage
          role={message.role}
          key={message.content}
          isLoading={fakeLoading}
          content={message.content}
          src={message.src}
        />
      ))}
      {isLoading && (
        <ChatMessage
          role='system'
          src={companion.src}
          isLoading
        />
      )}

      <div ref={scrollRef}></div>
    </div>
  )
};

export default ChatMessages;