import { CircleAlert } from "lucide-react";

import type { ChatMessage } from "@/lib/types";

import { AssistantMessage } from "./AssistantMessage";

type MessageBubbleProps = {
  message: ChatMessage;
};

/** Elige cómo mostrar un mensaje: pregunta del usuario, error o respuesta del asistente. */
export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 whitespace-pre-wrap text-primary-foreground shadow-sm">
        {message.content}
      </div>
    );
  }

  if (message.status === "error") {
    return (
      <div className="flex max-w-[85%] items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
        {message.content}
      </div>
    );
  }

  return <AssistantMessage message={message} />;
}
