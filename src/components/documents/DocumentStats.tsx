import { Building2, FileText, Landmark, ListTree } from "lucide-react";

import type { DocumentSummary } from "@/lib/types";

type DocumentStatsProps = {
  documents: DocumentSummary[];
};

/** Resumen del corpus: cuántas normas hay de cada tipo y cuántas unidades se pueden citar. */
export function DocumentStats({ documents }: DocumentStatsProps) {
  const stats = [
    { icon: FileText, label: "Normas", value: documents.length },
    { icon: Building2, label: "Internas", value: documents.filter((document) => document.doc_type === "Interno").length },
    { icon: Landmark, label: "Externas", value: documents.filter((document) => document.doc_type === "Externo").length },
    { icon: ListTree, label: "Unidades citables", value: documents.reduce((total, document) => total + document.units, 0) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-xs">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Icon className="size-5" />
          </span>
          <div>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-2xl font-semibold tracking-tight text-foreground">{value.toLocaleString("es-EC")}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
