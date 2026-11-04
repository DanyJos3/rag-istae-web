import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const SUGGESTED_QUESTIONS = [
  { label: "Egresamiento", question: "¿Qué requisitos necesito para ser declarado egresado?" },
  { label: "Titulación", question: "¿Cuál es la nota mínima para aprobar el trabajo de integración curricular?" },
  { label: "Matrículas", question: "¿Qué pasa si repruebo por tercera vez la misma asignatura?" },
];

type WelcomeMessageProps = {
  onPickQuestion: (question: string) => void;
  /** La caja de texto (ChatInput), que en la bienvenida va al centro de la pantalla. */
  children: ReactNode;
};

/** Pantalla inicial, mientras no hay mensajes. */
export function WelcomeMessage({ onPickQuestion, children }: WelcomeMessageProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-10">
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <div className="rounded-2xl border border-zinc-200 p-3 text-sky-700 shadow-sm dark:border-zinc-800 dark:text-sky-400">
          <Sparkles size={22} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">Hola 👋</h1>
          <p className="text-zinc-600 dark:text-zinc-400">¿Qué quieres saber sobre la normativa del ISTAE?</p>
        </div>

        <div className="w-full">{children}</div>

        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_QUESTIONS.map(({ label, question }) => (
            <button
              key={label}
              type="button"
              onClick={() => onPickQuestion(question)}
              title={question}
              className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-zinc-500">
          Las respuestas son orientativas y no reemplazan el criterio de la autoridad competente. Verifica siempre el
          artículo citado.
        </p>
      </div>
    </main>
  );
}
