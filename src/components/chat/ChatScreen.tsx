"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useChat } from "@/hooks/useChat";
import type { StoredChat } from "@/lib/chatStorage";

import { ArchitectureSelect } from "./ArchitectureSelect";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { WelcomeMessage } from "./WelcomeMessage";

type ChatScreenProps = {
  /** Chat guardado para continuarlo; sin él, la pantalla empieza un chat nuevo. */
  savedChat?: StoredChat;
};

/** Pantalla de chat: une el estado (useChat) con las piezas visuales. */
export function ChatScreen({ savedChat }: ChatScreenProps) {
  const { messages, isLoading, sendMessage, architecture, chooseArchitecture, isArchitectureLocked } = useChat(savedChat);
  const isEmpty = messages.length === 0;

  const chatInput = (
    <ChatInput
      onSend={sendMessage}
      disabled={isLoading}
      toolbar={<ArchitectureSelect value={architecture} onChange={chooseArchitecture} locked={isArchitectureLocked} />}
    />
  );

  return (
    <AppShell>
      {isEmpty ? (
        <WelcomeMessage onPickQuestion={sendMessage}>{chatInput}</WelcomeMessage>
      ) : (
        <>
          <main className="flex-1 overflow-y-auto">
            <MessageList messages={messages} />
          </main>
          <div className="px-4 pb-4">
            <div className="mx-auto max-w-3xl">{chatInput}</div>
          </div>
        </>
      )}
    </AppShell>
  );
}
