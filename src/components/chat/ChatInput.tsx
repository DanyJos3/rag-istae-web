"use client";

import { ArrowUp } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";

type ChatInputProps = {
  onSend: (question: string) => void;
  disabled: boolean;
};

export function ChatInput({ onSend, disabled }: ChatInputProps) {
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
      className="rounded-2xl border border-zinc-200 bg-white p-3 text-left shadow-sm focus-within:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu pregunta sobre la normativa…"
        rows={2}
        maxLength={2000}
        className="max-h-40 w-full resize-none bg-transparent px-1 text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Enviar pregunta"
          className="rounded-full bg-zinc-900 p-2 text-white disabled:opacity-30 dark:bg-zinc-100 dark:text-zinc-900"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </form>
  );
}
