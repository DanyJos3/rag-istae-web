import { RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComingSoon } from "@/components/ui/ComingSoon";
import type { DocumentSummary } from "@/lib/types";

type DocumentsTableProps = {
  documents: DocumentSummary[];
};

export function DocumentsTable({ documents }: DocumentsTableProps) {
  if (documents.length === 0) {
    return <p className="py-16 text-center text-sm text-muted-foreground">No hay documentos que coincidan con la búsqueda.</p>;
  }

  return (
    <div className="max-h-[70vh] overflow-auto rounded-2xl border bg-card shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 z-10 bg-muted/90 text-xs text-muted-foreground backdrop-blur">
          <tr>
            <th className="px-5 py-3 font-medium">Código</th>
            <th className="px-5 py-3 font-medium">Norma</th>
            <th className="hidden px-5 py-3 font-medium lg:table-cell">Emisor</th>
            <th className="hidden px-5 py-3 font-medium md:table-cell">Jerarquía</th>
            <th className="px-5 py-3 text-right font-medium">Contenido</th>
            <th className="px-5 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {documents.map((document) => (
            <DocumentRow key={document.document_id} document={document} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentRow({ document }: { document: DocumentSummary }) {
  const fileType = document.source_file.split(".").pop()?.toUpperCase() ?? "";
  const isInternal = document.doc_type === "Interno";

  return (
    <tr className="transition-colors hover:bg-muted/40">
      <td className="px-5 py-4 align-top">
        <p className="font-mono text-xs font-semibold text-foreground">{document.document_id}</p>
        <Badge variant="outline" className={`mt-1.5 ${isInternal ? "border-brand/30 text-brand" : "border-warning/30 text-warning"}`}>
          {isInternal ? "Interno" : "Externo"}
        </Badge>
      </td>
      <td className="px-5 py-4 align-top">
        <p className="leading-snug font-medium text-foreground">{document.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {document.domain}
          {fileType && ` · ${fileType}`}
        </p>
      </td>
      <td className="hidden px-5 py-4 align-top text-muted-foreground lg:table-cell">{document.issuer}</td>
      <td className="hidden px-5 py-4 align-top md:table-cell">
        <p className="text-foreground/80">Nivel {document.rank}</p>
        <p className="text-xs text-muted-foreground">{document.rank_label}</p>
      </td>
      <td className="px-5 py-4 text-right align-top whitespace-nowrap text-foreground/80 tabular-nums">
        {document.articles > 0 ? `${document.articles} artículos` : `${document.units} secciones`}
      </td>
      <td className="px-5 py-4 text-right align-top">
        <ComingSoon>
          <Button variant="outline" size="sm" disabled className="gap-1.5">
            <RefreshCw />
            Reemplazar
          </Button>
        </ComingSoon>
      </td>
    </tr>
  );
}
