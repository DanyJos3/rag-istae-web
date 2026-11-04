"use client";

import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import useSWRImmutable from "swr/immutable";

import { AppShell } from "@/components/layout/AppShell";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { fetchDocuments } from "@/lib/api";
import type { DocumentSummary } from "@/lib/types";

import { FileDropzone } from "./FileDropzone";

type DocumentType = "Interno" | "Externo";

type NewDocumentForm = {
  docType: DocumentType;
  name: string;
  issuer: string;
  domain: string;
  rank: number;
  /** Norma superior que esta norma desarrolla o reglamenta (opcional). */
  parentId: string;
  approvedOn: string;
};

// Nivel jerárquico sugerido: normativa interna del ISTAE (6) o reglamento nacional (3).
const DEFAULT_RANK: Record<DocumentType, number> = { Interno: 6, Externo: 3 };

const EMPTY_FORM: NewDocumentForm = {
  docType: "Interno",
  name: "",
  issuer: "",
  domain: "",
  rank: DEFAULT_RANK.Interno,
  parentId: "",
  approvedOn: "",
};

/** Siguiente código libre: INT34, EXT14, … */
function suggestCode(documents: DocumentSummary[], docType: DocumentType): string {
  const prefix = docType === "Interno" ? "INT" : "EXT";
  const numbers = documents
    .filter((document) => document.document_id.startsWith(prefix))
    .map((document) => Number(document.document_id.slice(3)));
  return `${prefix}${String(Math.max(0, ...numbers) + 1).padStart(2, "0")}`;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
}

/** Administración > Documentos > Agregar documento (vista previa: guardar llega en la etapa 2). */
export function NewDocumentScreen() {
  const { data: documents = [] } = useSWRImmutable("documents", fetchDocuments);
  const [form, setForm] = useState<NewDocumentForm>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);

  function update(changes: Partial<NewDocumentForm>) {
    setForm((current) => ({ ...current, ...changes }));
  }

  // Opciones sacadas de las normas que ya existen, para escribir igual que en el catálogo.
  const issuers = uniqueSorted(documents.map((document) => document.issuer));
  const domains = uniqueSorted(documents.map((document) => document.domain));
  const rankOptions = [...new Map(documents.map((document) => [document.rank, document.rank_label]))].sort(([a], [b]) => a - b);
  const code = suggestCode(documents, form.docType);

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
          <Link href="/documentos" className="flex w-fit items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            <ArrowLeft size={16} /> Documentos
          </Link>

          <header>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Agregar documento</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Sube una norma nueva para que el asistente pueda consultarla.</p>
          </header>

          <div className="flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
            <Info size={18} className="mt-0.5 shrink-0" />
            <p>
              <strong>Vista previa.</strong> La carga de documentos se habilitará en la siguiente etapa, junto con el
              inicio de sesión de administradores. Por ahora puedes revisar los datos que se pedirán.
            </p>
          </div>

          <FormSection step={1} title="Archivo original">
            <FileDropzone file={file} onChange={setFile} />
          </FormSection>

          <FormSection step={2} title="Datos de la norma">
            <Field label="Tipo" required>
              <div className="grid grid-cols-2 gap-2">
                {(["Interno", "Externo"] as const).map((docType) => (
                  <button
                    key={docType}
                    type="button"
                    onClick={() => update({ docType, rank: DEFAULT_RANK[docType] })}
                    className={`rounded-xl border px-4 py-3 text-left text-sm ${
                      form.docType === docType
                        ? "border-sky-600 bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200"
                        : "border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="block font-medium">{docType === "Interno" ? "Interno" : "Externo"}</span>
                    <span className="text-xs text-zinc-500">
                      {docType === "Interno" ? "Normativa propia del ISTAE" : "Leyes y reglamentos nacionales"}
                    </span>
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <Field label="Código" hint="Se asigna automáticamente.">
                <input value={code} readOnly className={`${INPUT_CLASS} bg-zinc-50 font-mono dark:bg-zinc-900`} />
              </Field>
              <Field label="Nombre oficial" required>
                <input
                  value={form.name}
                  onChange={(event) => update({ name: event.target.value })}
                  placeholder="Ej.: Reglamento de Becas y Ayudas Económicas"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Emisor" required>
                <input
                  value={form.issuer}
                  onChange={(event) => update({ issuer: event.target.value })}
                  list="issuers"
                  placeholder="Ej.: OCS ISTAE"
                  className={INPUT_CLASS}
                />
                <datalist id="issuers">
                  {issuers.map((issuer) => (
                    <option key={issuer} value={issuer} />
                  ))}
                </datalist>
              </Field>
              <Field label="Área temática">
                <input
                  value={form.domain}
                  onChange={(event) => update({ domain: event.target.value })}
                  list="domains"
                  placeholder="Ej.: Régimen académico"
                  className={INPUT_CLASS}
                />
                <datalist id="domains">
                  {domains.map((domain) => (
                    <option key={domain} value={domain} />
                  ))}
                </datalist>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nivel jerárquico" required hint="1 = mayor rango (art. 425 de la Constitución).">
                <select value={form.rank} onChange={(event) => update({ rank: Number(event.target.value) })} className={INPUT_CLASS}>
                  {rankOptions.map(([rank, label]) => (
                    <option key={rank} value={rank}>
                      {rank} · {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Fecha de aprobación">
                <input
                  type="date"
                  value={form.approvedOn}
                  onChange={(event) => update({ approvedOn: event.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection step={3} title="Relación con otras normas" optional>
            <Field label="Norma superior que desarrolla o reglamenta" hint="La usa la arquitectura con jerarquía para relacionar ambas normas.">
              <select value={form.parentId} onChange={(event) => update({ parentId: event.target.value })} className={INPUT_CLASS}>
                <option value="">Ninguna</option>
                {documents.map((document) => (
                  <option key={document.document_id} value={document.document_id}>
                    {document.document_id} · {document.name}
                  </option>
                ))}
              </select>
            </Field>
          </FormSection>

          <WhatHappensOnSave />

          <footer className="flex justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <Link href="/documentos" className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
              Cancelar
            </Link>
            <ComingSoon>
              <button type="button" disabled className="rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-medium text-white">
                Guardar documento
              </button>
            </ComingSoon>
          </footer>
        </div>
      </main>
    </AppShell>
  );
}

const INPUT_CLASS =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

function FormSection({ step, title, optional = false, children }: { step: number; title: string; optional?: boolean; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
          {step}
        </span>
        {title}
        {optional && <span className="text-xs font-normal text-zinc-500">(opcional)</span>}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, hint, required = false, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </p>
      {children}
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

/** Explica el proceso que hará el sistema con el documento (útil para la defensa). */
function WhatHappensOnSave() {
  const steps = [
    ["Extracción del texto", "Se convierte el PDF o DOCX a texto, con OCR si es un documento escaneado."],
    ["División en artículos", "Se detectan artículos, secciones y disposiciones, cada uno con su identificador (p. ej. INT34-art5)."],
    ["Revisión de estructura", "Se avisa si faltan artículos o hay numeración irregular, para revisarlo antes de publicar."],
    ["Actualización del corpus", "La norma queda disponible en el chat y en esta lista. La versión anterior se conserva."],
  ];
  return (
    <section className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-900">
      <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Qué pasará al guardar</h2>
      <ol className="space-y-3">
        {steps.map(([title, description], index) => (
          <li key={title} className="flex gap-3 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              {index + 1}
            </span>
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">{title}</p>
              <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
