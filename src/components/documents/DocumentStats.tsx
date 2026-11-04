import type { DocumentSummary } from "@/lib/types";

type DocumentStatsProps = {
  documents: DocumentSummary[];
};

/** Resumen del corpus: cuántas normas hay de cada tipo y cuántas unidades se pueden citar. */
export function DocumentStats({ documents }: DocumentStatsProps) {
  const stats = [
    { label: "Normas", value: documents.length },
    { label: "Internas", value: documents.filter((document) => document.doc_type === "Interno").length },
    { label: "Externas", value: documents.filter((document) => document.doc_type === "Externo").length },
    { label: "Unidades citables", value: documents.reduce((total, document) => total + document.units, 0) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <dt className="text-xs text-zinc-500">{label}</dt>
          <dd className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value.toLocaleString("es-EC")}</dd>
        </div>
      ))}
    </dl>
  );
}
