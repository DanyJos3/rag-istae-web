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
          <Link href="/documentos" className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft size={16} /> Documentos
          </Link>

          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Agregar documento</h1>
            <p className="text-sm text-muted-foreground">Sube una norma nueva para que el asistente pueda consultarla.</p>
          </header>

          <div className="flex gap-3 rounded-xl border border-brand/20 bg-brand-soft p-4 text-sm text-foreground [&_svg]:text-brand">
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
                        ? "border-brand bg-brand-soft text-foreground ring-2 ring-brand/15"
                        : "border-border text-foreground/80 hover:border-brand/40"
                    }`}
                  >
                    <span className="block font-medium">{docType === "Interno" ? "Interno" : "Externo"}</span>
                    <span className="text-xs text-muted-foreground">
                      {docType === "Interno" ? "Normativa propia del ISTAE" : "Leyes y reglamentos nacionales"}
                    </span>
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <Field label="Código" hint="Se asigna automáticamente.">
                <input value={code} readOnly className={`${INPUT_CLASS} bg-muted font-mono`} />
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

          <footer className="flex justify-end gap-2 border-t pt-5">
            <Link href="/documentos" className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted">
              Cancelar
            </Link>
            <ComingSoon>
              <button type="button" disabled className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
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
  "w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-shadow focus:border-brand/50 focus:ring-4 focus:ring-brand/10";

function FormSection({ step, title, optional = false, children }: { step: number; title: string; optional?: boolean; children: ReactNode }) {
  return (
    <section className="space-y-5 rounded-2xl border bg-card p-6 shadow-xs">
      <h2 className="flex items-center gap-2.5 font-semibold text-foreground">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {step}
        </span>
        {title}
        {optional && <span className="text-xs font-normal text-muted-foreground">(opcional)</span>}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, hint, required = false, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </p>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
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
    <section className="rounded-2xl border border-dashed bg-muted/40 p-6">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Qué pasará al guardar</h2>
      <ol className="space-y-3">
        {steps.map(([title, description], index) => (
          <li key={title} className="flex gap-3 text-sm">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-medium text-brand">
              {index + 1}
            </span>
            <div>
              <p className="font-medium text-foreground">{title}</p>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
