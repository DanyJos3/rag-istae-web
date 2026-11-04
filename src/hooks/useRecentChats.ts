"use client";

import { useMemo, useSyncExternalStore } from "react";

import { chatsSnapshot, parseSummaries, subscribeToChats } from "@/lib/chatStorage";

/**
 * Lista de chats recientes, siempre actualizada: se vuelve a leer cuando se guarda
 * un chat (en esta u otra pestaña). En el servidor no hay localStorage: lista vacía.
 */
export function useRecentChats() {
  const snapshot = useSyncExternalStore(subscribeToChats, chatsSnapshot, () => "[]");
  return useMemo(() => parseSummaries(snapshot), [snapshot]);
}
