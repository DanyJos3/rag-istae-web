"use client";

import useSWRImmutable from "swr/immutable";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchUnit } from "@/lib/api";
import type { SourceUnit } from "@/lib/types";

type ArticleModalProps = {
  unitId: string;
  /** Fuente citada; en B/C trae el artículo tal como se envió al modelo. */
  source?: SourceUnit & { document_id: string; document_name: string };
  number: number | undefined;
  onClose: () => void;
};

/** Ventana con el texto del artículo citado. */
export function ArticleModal({ unitId, source, number, onClose }: ArticleModalProps) {
  const embedded = source?.text ? source : undefined;
  // Solo se pide al backend si la fuente no trae el texto (chats anteriores al cambio).
  const { data: fetched, error, isLoading } = useSWRImmutable(embedded ? null : unitId, fetchUnit);
  const unit = embedded ?? fetched;

  return (
    // Está montada solo mientras se muestra: al cerrarla (Escape, X o clic afuera) avisa al padre.
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b bg-muted/40 px-6 py-5 text-left">
          <DialogDescription className="flex items-center gap-2 text-xs font-semibold tracking-wider text-brand uppercase">
            {number && (
              <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[10.5px] text-brand-foreground">
                {number}
              </span>
            )}
            {unit?.label ? `${unit.label}${unit.title ? ` · ${unit.title}` : ""}` : unitId}
          </DialogDescription>
          <DialogTitle className="text-lg leading-snug font-semibold">{unit?.document_name ?? "Cargando…"}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5 font-serif text-[15px] leading-7 whitespace-pre-wrap text-foreground/90">
          {isLoading && <p className="font-sans text-sm text-muted-foreground">Cargando el artículo…</p>}
          {error && <p className="font-sans text-sm text-destructive">No se pudo cargar el artículo. Intente nuevamente.</p>}
          {embedded?.partial && <p className="mb-3 font-sans text-xs text-muted-foreground">Fragmento del artículo enviado al modelo.</p>}
          {embedded?.origin === "hierarchy" && <p className="mb-3 font-sans text-xs text-muted-foreground">Incluido por jerarquía normativa.</p>}
          {unit?.text?.replaceAll("**", "")}
        </div>
      </DialogContent>
    </Dialog>
  );
}
