"use client";

import { ChevronDown, CircleAlert, CircleCheck, Scale } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import type { SourceDocument, SourceUnit } from "@/lib/types";

type SourcesPanelProps = {
  sources: SourceDocument[];
  citationNumbers: Map<string, number>;
  onOpenArticle: (unitId: string) => void;
};

/** Panel plegable al final de la respuesta: una tarjeta por artículo citado. */
export function SourcesPanel({ sources, citationNumbers, onOpenArticle }: SourcesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const articleCount = sources.reduce((total, document) => total + document.units.length, 0);

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Scale className="size-4" />
        </span>
        <span className="text-sm font-semibold text-foreground">Fuentes legales</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {articleCount} {articleCount === 1 ? "artículo" : "artículos"} · {sources.length}{" "}
          {sources.length === 1 ? "norma" : "normas"}
        </span>
        <ChevronDown className={`ml-auto size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="space-y-2 border-t bg-muted/30 p-3">
              {sources.flatMap((document) =>
                document.units.map((unit) => (
                  <SourceCard
                    key={unit.unit_id}
                    documentName={document.document_name}
                    unit={unit}
                    number={citationNumbers.get(unit.unit_id)}
                    onOpen={() => onOpenArticle(unit.unit_id)}
                  />
                )),
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

type SourceCardProps = {
  documentName: string;
  unit: SourceUnit;
  number: number | undefined;
  onOpen: () => void;
};

function SourceCard({ documentName, unit, number, onOpen }: SourceCardProps) {
  return (
    <li className="rounded-lg border bg-card p-3.5">
      <div className="flex items-start gap-3">
        {number && (
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10.5px] font-semibold text-brand-foreground">
            {number}
          </span>
        )}
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm leading-snug font-semibold text-foreground">{documentName}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{unit.unit_id}</p>
          {unit.quote && <p className="font-serif text-sm leading-relaxed text-foreground/80 italic">«{unit.quote}»</p>}
          <div className="flex items-center justify-between pt-1">
            <VerificationLabel verified={unit.quote_verified} />
            <button type="button" onClick={onOpen} className="text-xs font-medium text-brand hover:underline">
              Ver artículo completo
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Indica si la cita textual se encontró en el texto de la norma. */
function VerificationLabel({ verified }: { verified: boolean | null }) {
  if (verified === true) {
    return (
      <span className="flex items-center gap-1 text-xs text-success">
        <CircleCheck className="size-3.5" /> Cita verificada
      </span>
    );
  }
  if (verified === false) {
    return (
      <span className="flex items-center gap-1 text-xs text-warning">
        <CircleAlert className="size-3.5" /> Revisar en la norma
      </span>
    );
  }
  return <span />;
}
