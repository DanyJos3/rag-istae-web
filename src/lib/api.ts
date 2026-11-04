import { createParser } from "eventsource-parser";

import type { ArchitectureOption, ChatAnswer, ChatError, DocumentSummary, HistoryTurn, UnitDetail } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type StreamChatOptions = {
  question: string;
  history: HistoryTurn[];
  /** Id de la arquitectura que responde (A, AJ, …). */
  architecture: string;
  onDelta: (text: string) => void;
  onAnswer: (answer: ChatAnswer) => void;
  onError: (error: ChatError) => void;
};

/**
 * Envía una pregunta a POST /chat y va avisando a medida que llega la respuesta.
 *
 * El backend responde con Server-Sent Events:
 *   - `delta`  → un fragmento de texto (puede llegar muchas veces)
 *   - `answer` → la respuesta final con las fuentes verificadas (una vez, al final)
 *   - `error`  → un mensaje legible si el modelo falló
 *
 * No se usa `EventSource` del navegador porque solo admite GET; aquí se lee el
 * cuerpo de un `fetch` POST y `eventsource-parser` separa los eventos.
 */
export async function streamChat({ question, history, architecture, onDelta, onAnswer, onError }: StreamChatOptions) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, history, architecture }),
  });

  if (!response.ok || !response.body) {
    onError({ message: "No se pudo enviar la pregunta. Intente nuevamente.", status: response.status });
    return;
  }

  const parser = createParser({
    onEvent(event) {
      const data = JSON.parse(event.data);
      if (event.event === "delta") onDelta(data.text);
      if (event.event === "answer") onAnswer(data);
      if (event.event === "error") onError(data);
    },
  });

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    parser.feed(value);
  }
}

/** Trae el texto completo de un artículo citado (se usa al abrir la ventana del artículo). */
export async function fetchUnit(unitId: string): Promise<UnitDetail> {
  const response = await fetch(`${API_URL}/units/${encodeURIComponent(unitId)}`);
  if (!response.ok) throw new Error("No se pudo cargar el artículo.");
  return response.json();
}

/** Lista de normas con las que trabaja el sistema (pantalla Documentos). */
export async function fetchDocuments(): Promise<DocumentSummary[]> {
  const response = await fetch(`${API_URL}/documents`);
  if (!response.ok) throw new Error("No se pudo cargar la lista de documentos.");
  return response.json();
}

/** Arquitecturas que se pueden elegir en el chat (las no disponibles se muestran como "próximamente"). */
export async function fetchArchitectures(): Promise<ArchitectureOption[]> {
  const response = await fetch(`${API_URL}/architectures`);
  if (!response.ok) throw new Error("No se pudo cargar la lista de arquitecturas.");
  return response.json();
}
