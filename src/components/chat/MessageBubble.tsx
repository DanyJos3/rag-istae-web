import type { ChatMessage } from "@/lib/types";

import { AssistantMessage } from "./AssistantMessage";

type MessageBubbleProps = {
  message: ChatMessage;
};

/** Elige cómo mostrar un mensaje: pregunta del usuario, error o respuesta del asistente. */
export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl bg-zinc-100 px-4 py-3 whitespace-pre-wrap text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
        {message.content}
      </div>
    );
  }

  if (message.status === "error") {
    return (
      <div className="max-w-[85%] rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        {message.content}
      </div>
    );
  }

  return <AssistantMessage message={message} />;
}
