"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";

import { AppShell } from "@/components/layout/AppShell";
import { fetchDocuments } from "@/lib/api";
import type { DocumentSummary } from "@/lib/types";

import { DocumentStats } from "./DocumentStats";
import { DocumentsTable } from "./DocumentsTable";

type TypeFilter = "Todos" | "Interno" | "Externo";
const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "Todos", label: "Todos" },
  { value: "Interno", label: "Internos" },
  { value: "Externo", label: "Externos" },
];

/** Busca por código, nombre, emisor o área, sin distinguir mayúsculas ni tildes. */
function matchesSearch(document: DocumentSummary, search: string): boolean {
  const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const haystack = normalize(`${document.document_id} ${document.name} ${document.issuer} ${document.domain}`);
  return haystack.includes(normalize(search.trim()));
}

/** Administración > Documentos: normas con las que trabaja el sistema. */
export function DocumentsScreen() {
  const { data: documents, error, isLoading } = useSWRImmutable("documents", fetchDocuments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("Todos");

  const visibleDocuments = (documents ?? []).filter(
    (document) => (typeFilter === "Todos" || document.doc_type === typeFilter) && matchesSearch(document, search),
  );

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-zinc-500">Administración</p>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Documentos</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Normativa institucional y nacional con la que responde el asistente.
              </p>
            </div>
            <Link
              href="/documentos/nuevo"
              className="flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-800"
            >
              <Plus size={16} />
              Agregar documento
            </Link>
          </header>

          {documents && <DocumentStats documents={documents} />}

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex min-w-60 flex-1 items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 focus-within:border-zinc-400 dark:border-zinc-700">
              <Search size={16} className="text-zinc-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, código, emisor o área…"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <div className="flex rounded-xl border border-zinc-200 p-1 dark:border-zinc-700">
              {TYPE_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTypeFilter(value)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    typeFilter === value
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {isLoading && <p className="text-sm text-zinc-500">Cargando documentos… (si el servidor estaba inactivo puede tardar un minuto)</p>}
          {error && <p className="text-sm text-red-700">No se pudo cargar la lista de documentos. Intente nuevamente.</p>}
          {documents && <DocumentsTable documents={visibleDocuments} />}
        </div>
      </main>
    </AppShell>
  );
}
