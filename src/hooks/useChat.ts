"use client";

import { useState } from "react";

import { streamChat } from "@/lib/api";
import type { ChatMessage, HistoryTurn } from "@/lib/types";

/** Estado del chat: la lista de mensajes y la función para enviar una pregunta. */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function updateMessage(id: string, changes: (message: ChatMessage) => Partial<ChatMessage>) {
    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, ...changes(message) } : message)),
    );
  }

  async function sendMessage(question: string) {
    const text = question.trim();
    if (!text || isLoading) return;

    // El historial son los mensajes completos anteriores (sin los que fallaron).
    const history: HistoryTurn[] = messages
      .filter((message) => message.status === "done")
      .map((message) => ({ role: message.role, content: message.content }));

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text, status: "done" };
    const assistantId = crypto.randomUUID();
    const assistantMessage: ChatMessage = { id: assistantId, role: "assistant", content: "", status: "streaming" };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      await streamChat({
        question: text,
        history,
        onDelta: (delta) => updateMessage(assistantId, (message) => ({ content: message.content + delta })),
        // Al final se reemplaza el texto por la versión limpia (sin la sección «Fuentes» del modelo)
        // y se agregan las fuentes verificadas.
        onAnswer: (answer) => updateMessage(assistantId, () => ({ content: answer.body, sources: answer.sources, status: "done" })),
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
  }

  /** Empieza una conversación nueva: el backend deja de recibir los mensajes anteriores como contexto. */
  function startNewChat() {
    if (!isLoading) setMessages([]);
  }

  return { messages, isLoading, sendMessage, startNewChat };
}
