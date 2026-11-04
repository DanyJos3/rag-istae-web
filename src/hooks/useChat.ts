"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import { streamChat } from "@/lib/api";
import { chatTitle, saveChat, type StoredChat } from "@/lib/chatStorage";
import { DEFAULT_ARCHITECTURE, type ChatMessage, type HistoryTurn } from "@/lib/types";

/**
 * Estado del chat: la lista de mensajes, la arquitectura elegida y la función para enviar una pregunta.
 * Recibe un chat guardado para continuarlo, o nada para empezar uno nuevo.
 */
export function useChat(savedChat?: StoredChat) {
  const router = useRouter();
  const [chatId, setChatId] = useState<string | null>(savedChat?.id ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>(savedChat?.messages ?? []);
  const [architecture, setArchitecture] = useState(savedChat?.architecture ?? DEFAULT_ARCHITECTURE);
  const [isLoading, setIsLoading] = useState(false);
  const isVisibleRef = useRef(true);

  // Next 16 (Cache Components) no desmonta las páginas al navegar: las oculta con <Activity>
  // y conserva su estado. Un chat nuevo ("/") tiene que volver vacío, así que se limpia
  // cuando la pantalla se oculta. Los chats guardados sí conservan su estado.
  useLayoutEffect(() => {
    if (savedChat) return;
    isVisibleRef.current = true;
    return () => {
      isVisibleRef.current = false;
      setMessages([]);
      setChatId(null);
    };
  }, [savedChat]);

  // La arquitectura se elige al empezar: una vez enviada la primera pregunta queda fija,
  // para no mezclar en un mismo chat respuestas de arquitecturas distintas.
  const isArchitectureLocked = messages.length > 0;

  function chooseArchitecture(id: string) {
    if (!isArchitectureLocked) setArchitecture(id);
  }

  function updateMessage(id: string, changes: (message: ChatMessage) => Partial<ChatMessage>) {
    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, ...changes(message) } : message)),
    );
  }

  async function sendMessage(question: string) {
    const text = question.trim();
    if (!text || isLoading) return;

    // Mensajes completos anteriores (sin los que fallaron): son el historial que recibe el backend.
    const previousMessages = messages.filter((message) => message.status === "done");
    const history: HistoryTurn[] = previousMessages.map((message) => ({ role: message.role, content: message.content }));

    // La primera pregunta crea el chat.
    const isNewChat = chatId === null;
    const id = chatId ?? crypto.randomUUID();
    if (isNewChat) setChatId(id);

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text, status: "done" };
    const assistantId = crypto.randomUUID();
    const assistantMessage: ChatMessage = { id: assistantId, role: "assistant", content: "", status: "streaming" };
    let finalAnswer: ChatMessage | null = null;

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      await streamChat({
        question: text,
        history,
        architecture,
        onDelta: (delta) => updateMessage(assistantId, (message) => ({ content: message.content + delta })),
        // Al final se reemplaza el texto por la versión limpia (sin la sección «Fuentes» del modelo)
        // y se agregan las fuentes verificadas.
        onAnswer: (answer) => {
          finalAnswer = { ...assistantMessage, content: answer.body, sources: answer.sources, status: "done" };
          updateMessage(assistantId, () => ({ content: answer.body, sources: answer.sources, status: "done" }));
        },
        onError: (error) => updateMessage(assistantId, () => ({ content: error.message, status: "error" })),
      });
    } catch {
      updateMessage(assistantId, () => ({
        content: "No hay conexión con el servidor. Verifique su conexión e intente nuevamente.",
        status: "error",
      }));
    } finally {
      // Si la conexión se cortó sin evento final, el mensaje no debe quedar "escribiendo" para siempre.
      updateMessage(assistantId, (message) =>
        message.status === "streaming"
          ? { content: "La respuesta se interrumpió. Intente nuevamente.", status: "error" }
          : {},
      );
      setIsLoading(false);
    }

    // Solo se guardan las preguntas que obtuvieron respuesta.
    if (finalAnswer) {
      const firstQuestion = previousMessages.find((message) => message.role === "user")?.content ?? text;
      saveChat({
        id,
        title: chatTitle(firstQuestion),
        updatedAt: Date.now(),
        architecture,
        messages: [...previousMessages, userMessage, finalAnswer],
      });
      // Un chat nuevo pasa a su propia dirección (/chat/<id>) recién cuando ya está guardado:
      // así la respuesta no se interrumpe y el chat se puede recargar o abrir desde Recientes.
      // Si mientras tanto el usuario se fue a otra pantalla, no se lo saca de ahí.
      if (isNewChat && isVisibleRef.current) router.replace(`/chat/${id}`);
    }
  }

  return { messages, isLoading, sendMessage, architecture, chooseArchitecture, isArchitectureLocked };
}
