import { ChevronDown, CircleAlert, CircleCheck, Scale } from "lucide-react";

import type { SourceDocument, SourceUnit } from "@/lib/types";

type SourcesPanelProps = {
  sources: SourceDocument[];
  citationNumbers: Map<string, number>;
  onOpenArticle: (unitId: string) => void;
};

/** Panel plegable al final de la respuesta: una tarjeta por artículo citado. */
export function SourcesPanel({ sources, citationNumbers, onOpenArticle }: SourcesPanelProps) {
  const articleCount = sources.reduce((total, document) => total + document.units.length, 0);

  return (
    <details className="group rounded-xl border border-sky-200 bg-sky-50/40 dark:border-sky-900 dark:bg-sky-950/20">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-sky-800 dark:text-sky-300">
        <Scale size={16} />
        FUENTES LEGALES
        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium dark:bg-sky-900">
          {articleCount} art.
        </span>
        <ChevronDown size={16} className="ml-auto transition-transform group-open:rotate-180" />
      </summary>

      <ul className="space-y-3 px-4 pb-4">
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
    </details>
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
    <li className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-2">
        {number && (
          <span className="mt-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 text-[11px] font-semibold text-white">
            {number}
          </span>
        )}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{documentName}</p>
          <p className="text-xs text-zinc-500">{unit.unit_id}</p>
          {unit.quote && <p className="text-sm text-zinc-700 italic dark:text-zinc-300">«{unit.quote}»</p>}
          <div className="flex items-center justify-between pt-1">
            <VerificationLabel verified={unit.quote_verified} />
            <button type="button" onClick={onOpen} className="text-xs font-medium text-sky-700 hover:underline dark:text-sky-400">
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
      <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
        <CircleCheck size={12} /> cita verificada
      </span>
    );
  }
  if (verified === false) {
    return (
      <span className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400">
        <CircleAlert size={12} /> revisar en la norma
      </span>
    );
  }
  return <span />;
}
