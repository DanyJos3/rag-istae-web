"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { chatsSnapshot, findChat, subscribeToChats } from "@/lib/chatStorage";

import { ChatScreen } from "./ChatScreen";

type SavedChatScreenProps = {
  chatId: string;
};

/** Abre un chat guardado en el navegador (/chat/<id>). */
export function SavedChatScreen({ chatId }: SavedChatScreenProps) {
  // En el servidor no existe localStorage (null): se espera a que el navegador lo lea.
  const snapshot = useSyncExternalStore(subscribeToChats, chatsSnapshot, () => null);
  if (snapshot === null) return null;

  const chat = findChat(snapshot, chatId);
  if (!chat) {
    return (
      <AppShell>
        <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-foreground/80">No encontramos este chat en este navegador.</p>
          <Link href="/" className="text-sm font-medium text-brand hover:underline">
            Empezar un chat nuevo
          </Link>
        </main>
      </AppShell>
    );
  }

  // key: si se abre otro chat, la pantalla empieza de cero con sus mensajes.
  return <ChatScreen key={chat.id} savedChat={chat} />;
}
