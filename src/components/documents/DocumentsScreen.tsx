"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-wider text-brand uppercase">Administración</p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Documentos</h1>
              <p className="text-sm text-muted-foreground">Normativa institucional y nacional con la que responde el asistente.</p>
            </div>
            <Button asChild size="lg" className="gap-2 rounded-xl px-4 shadow-sm">
              <Link href="/documentos/nuevo">
                <Plus />
                Agregar documento
              </Link>
            </Button>
          </header>

          {documents && <DocumentStats documents={documents} />}

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-60 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, código, emisor o área…"
                className="h-10 rounded-xl pl-9"
              />
            </div>
            <div className="flex rounded-xl bg-muted p-1">
              {TYPE_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTypeFilter(value)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
                    typeFilter === value ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {isLoading && (
            <p className="text-sm text-muted-foreground">Cargando documentos… (si el servidor estaba inactivo puede tardar un minuto)</p>
          )}
          {error && <p className="text-sm text-destructive">No se pudo cargar la lista de documentos. Intente nuevamente.</p>}
          {documents && <DocumentsTable documents={visibleDocuments} />}
        </div>
      </main>
    </AppShell>
  );
}
