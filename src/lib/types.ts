// Tipos del contrato con el backend (rag-istae-api) y del estado del chat.

export type ChatRole = "user" | "assistant";

/** Turno anterior de la conversación que se envía al backend como contexto. */
export type HistoryTurn = {
  role: ChatRole;
  content: string;
};

/** Artículo o sección citada, con la frase textual que usó el modelo. */
export type SourceUnit = {
  unit_id: string;
  quote: string | null;
  /** true: la cita aparece en la norma · false: no aparece · null: sin cita textual */
  quote_verified: boolean | null;
};

/** Citas agrupadas por norma, con el nombre oficial del catálogo. */
export type SourceDocument = {
  document_id: string;
  document_name: string;
  units: SourceUnit[];
};

/**
 * Evento `answer` de POST /chat: la respuesta final ya verificada.
 * El backend envía más campos (tokens, modelo, latencia); aquí solo los que usa la interfaz.
 */
export type ChatAnswer = {
  body: string;
  sources: SourceDocument[];
};

/** Evento `error` de POST /chat. */
export type ChatError = {
  message: string;
  status: number | null;
};

/** GET /units/{unit_id}: texto completo de un artículo o sección. */
export type UnitDetail = {
  unit_id: string;
  document_id: string;
  document_name: string;
  label: string;
  title: string;
  text: string;
};

/** Mensaje tal como se muestra en pantalla. */
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  status: "streaming" | "done" | "error";
  sources?: SourceDocument[];
};
