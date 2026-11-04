"use client";

import { useEffect, useRef } from "react";

import type { ChatMessage } from "@/lib/types";

import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Baja al último mensaje cada vez que llega texto nuevo.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
