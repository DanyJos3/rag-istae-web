"use client";

import { motion } from "motion/react";
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
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
      {messages.map((message) => (
        // Cada mensaje aparece con un leve desplazamiento hacia arriba.
        <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <MessageBubble message={message} />
        </motion.div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
