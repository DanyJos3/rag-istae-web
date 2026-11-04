"use client";

import { BookOpenCheck, GraduationCap, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";

const SUGGESTED_QUESTIONS = [
  { icon: GraduationCap, label: "Egresamiento", question: "¿Qué requisitos necesito para ser declarado egresado?" },
  { icon: BookOpenCheck, label: "Titulación", question: "¿Cuál es la nota mínima para aprobar el trabajo de integración curricular?" },
  { icon: RefreshCcw, label: "Matrículas", question: "¿Qué pasa si repruebo por tercera vez la misma asignatura?" },
];

type WelcomeMessageProps = {
  onPickQuestion: (question: string) => void;
  /** La caja de texto (ChatInput), que en la bienvenida va al centro de la pantalla. */
  children: ReactNode;
};

/** Pantalla inicial, mientras no hay mensajes. */
export function WelcomeMessage({ onPickQuestion, children }: WelcomeMessageProps) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-10">
      {/* Halo suave detrás del escudo */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex w-full max-w-2xl flex-col items-center gap-7 text-center"
      >
        <div className="rounded-2xl bg-white p-2 shadow-md ring-1 ring-border">
          <Image src="/logo-istae.jpg" alt="" width={56} height={58} className="object-contain" priority />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">¿Qué quieres saber?</h1>
          <p className="text-muted-foreground">
            Consulta la normativa del ISTAE y la normativa nacional de educación superior.
            <br className="hidden sm:block" /> Cada respuesta indica los artículos en los que se basa.
          </p>
        </div>

        <div className="w-full">{children}</div>

        <div className="grid w-full gap-3 sm:grid-cols-3">
          {SUGGESTED_QUESTIONS.map(({ icon: Icon, label, question }) => (
            <button
              key={label}
              type="button"
              onClick={() => onPickQuestion(question)}
              className="group flex flex-col gap-2 rounded-xl border bg-card p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon className="size-4 text-brand" />
                {label}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">{question}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Las respuestas son orientativas y no reemplazan el criterio de la autoridad competente. Verifica siempre el
          artículo citado.
        </p>
      </motion.div>
    </main>
  );
}
