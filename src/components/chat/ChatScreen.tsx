"use client";

import { SquarePen } from "lucide-react";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { Sidebar } from "@/components/layout/Sidebar";
import { useChat } from "@/hooks/useChat";

import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { WelcomeMessage } from "./WelcomeMessage";

/** Pantalla de chat: une el estado (useChat) con las piezas visuales. */
export function ChatScreen() {
  const { messages, isLoading, sendMessage, startNewChat } = useChat();
  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-dvh bg-white dark:bg-zinc-950">
      <Sidebar onNewChat={startNewChat} disabled={isLoading} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* En celulares no hay barra lateral: logo y "Nuevo chat" van arriba. */}
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 md:hidden dark:border-zinc-800">
          <BrandLogo />
          <button type="button" onClick={startNewChat} disabled={isLoading} aria-label="Nuevo chat" className="p-2 disabled:opacity-50">
            <SquarePen size={20} />
          </button>
        </header>

        {isEmpty ? (
          <WelcomeMessage onPickQuestion={sendMessage}>
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </WelcomeMessage>
        ) : (
          <>
            <main className="flex-1 overflow-y-auto">
              <MessageList messages={messages} />
            </main>
            <div className="px-4 pb-4">
              <div className="mx-auto max-w-3xl">
                <ChatInput onSend={sendMessage} disabled={isLoading} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
