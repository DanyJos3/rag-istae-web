// Chats guardados en el navegador (localStorage).
//
// Es la única parte de la app que sabe DÓNDE se guardan los chats. Cuando haya
// login, estas funciones pasarán a leer y escribir en la base de datos (Supabase)
// y los componentes no tendrán que cambiar.

import type { ChatMessage } from "./types";

export type StoredChat = {
  id: string;
  title: string;
  updatedAt: number;
  /** Arquitectura con la que se respondió (los chats guardados antes de existir el selector no la tienen). */
  architecture?: string;
  messages: ChatMessage[];
};

export type ChatSummary = Pick<StoredChat, "id" | "title" | "updatedAt">;

const STORAGE_KEY = "istae.chats.v1";
const MAX_CHATS = 30;
/** Evento propio para avisar a la barra lateral que la lista cambió (en esta misma pestaña). */
const CHANGE_EVENT = "istae-chats-changed";

function readAll(): StoredChat[] {
  return parseSnapshot(chatsSnapshot());
}

/** Guarda o actualiza un chat. Solo se conservan los 30 más recientes. */
export function saveChat(chat: StoredChat) {
  const others = readAll().filter((stored) => stored.id !== chat.id);
  const chats = [chat, ...others].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CHATS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Sin espacio o sin permiso: el chat sigue funcionando, solo no queda guardado.
  }
}

/** Título del chat: la primera pregunta, recortada. */
export function chatTitle(firstQuestion: string): string {
  const text = firstQuestion.replace(/\s+/g, " ").trim();
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
}

// --- Para useRecentChats (useSyncExternalStore) --------------------------------

export function subscribeToChats(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // cambios hechos en otra pestaña
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Texto guardado tal cual: React lo compara para saber si la lista cambió. */
export function chatsSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parseSnapshot(snapshot: string): StoredChat[] {
  try {
    return JSON.parse(snapshot);
  } catch {
    return [];
  }
}

export function parseSummaries(snapshot: string): ChatSummary[] {
  return parseSnapshot(snapshot).map(({ id, title, updatedAt }) => ({ id, title, updatedAt }));
}

export function findChat(snapshot: string, id: string): StoredChat | null {
  return parseSnapshot(snapshot).find((chat) => chat.id === id) ?? null;
}
