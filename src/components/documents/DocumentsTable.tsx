import { RefreshCw } from "lucide-react";

import { ComingSoon } from "@/components/ui/ComingSoon";
import type { DocumentSummary } from "@/lib/types";

type DocumentsTableProps = {
  documents: DocumentSummary[];
};

export function DocumentsTable({ documents }: DocumentsTableProps) {
  if (documents.length === 0) {
    return <p className="py-10 text-center text-sm text-zinc-500">No hay documentos que coincidan con la búsqueda.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 font-medium">Código</th>
            <th className="px-4 py-3 font-medium">Norma</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Emisor</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Jerarquía</th>
            <th className="px-4 py-3 text-right font-medium">Contenido</th>
            <th className="px-4 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
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

  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
      <td className="px-4 py-3 align-top">
        <p className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">{document.document_id}</p>
        <TypeBadge docType={document.doc_type} />
      </td>
      <td className="px-4 py-3 align-top">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">{document.name}</p>
        <p className="text-xs text-zinc-500">
          {document.domain}
          {fileType && ` · ${fileType}`}
        </p>
      </td>
      <td className="hidden px-4 py-3 align-top text-zinc-600 lg:table-cell dark:text-zinc-400">{document.issuer}</td>
      <td className="hidden px-4 py-3 align-top md:table-cell">
        <p className="text-zinc-700 dark:text-zinc-300">Nivel {document.rank}</p>
        <p className="text-xs text-zinc-500">{document.rank_label}</p>
      </td>
      <td className="px-4 py-3 text-right align-top whitespace-nowrap text-zinc-700 dark:text-zinc-300">
        {document.articles > 0 ? `${document.articles} artículos` : `${document.units} secciones`}
      </td>
      <td className="px-4 py-3 text-right align-top">
        <ComingSoon>
          <button type="button" disabled className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            <RefreshCw size={12} />
            Reemplazar
          </button>
        </ComingSoon>
      </td>
    </tr>
  );
}

function TypeBadge({ docType }: { docType: string }) {
  const isInternal = docType === "Interno";
  return (
    <span
      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
        isInternal
          ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
      }`}
    >
      {isInternal ? "Interno" : "Externo"}
    </span>
  );
}
