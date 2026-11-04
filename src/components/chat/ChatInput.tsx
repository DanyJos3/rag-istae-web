"use client";

import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";

type ChatInputProps = {
  onSend: (question: string) => void;
  disabled: boolean;
  /** Controles que van abajo a la izquierda (el selector de arquitectura). */
  toolbar?: ReactNode;
};

export function ChatInput({ onSend, disabled, toolbar }: ChatInputProps) {
  const [question, setQuestion] = useState("");
  const canSend = !disabled && question.trim() !== "";

  function send() {
    if (!canSend) return;
    onSend(question);
    setQuestion("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    send();
  }

  // Enter envía; Shift + Enter agrega una línea nueva.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-card p-3 text-left shadow-lg shadow-primary/5 transition-shadow focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10"
    >
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu pregunta sobre la normativa…"
        rows={2}
        maxLength={2000}
        className="max-h-40 w-full resize-none bg-transparent px-1.5 pt-1 text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center justify-between gap-2">
        <div>{toolbar}</div>
        <Button type="submit" disabled={!canSend} size="icon" aria-label="Enviar pregunta" className="rounded-full disabled:opacity-30">
          <ArrowUp />
        </Button>
      </div>
    </form>
  );
}
