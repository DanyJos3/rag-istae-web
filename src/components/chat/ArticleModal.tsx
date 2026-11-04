"use client";

import useSWRImmutable from "swr/immutable";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchUnit } from "@/lib/api";

type ArticleModalProps = {
  unitId: string;
  number: number | undefined;
  onClose: () => void;
};

/** Ventana con el texto completo del artículo citado, tal como figura en la norma. */
export function ArticleModal({ unitId, number, onClose }: ArticleModalProps) {
  // El texto de un artículo no cambia: SWR lo guarda y no lo vuelve a pedir.
  const { data: unit, error, isLoading } = useSWRImmutable(unitId, fetchUnit);

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
            {unit ? `${unit.label}${unit.title ? ` · ${unit.title}` : ""}` : unitId}
          </DialogDescription>
          <DialogTitle className="text-lg leading-snug font-semibold">{unit?.document_name ?? "Cargando…"}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5 font-serif text-[15px] leading-7 whitespace-pre-wrap text-foreground/90">
          {isLoading && <p className="font-sans text-sm text-muted-foreground">Cargando el artículo…</p>}
          {error && <p className="font-sans text-sm text-destructive">No se pudo cargar el artículo. Intente nuevamente.</p>}
          {unit?.text.replaceAll("**", "")}
        </div>
      </DialogContent>
    </Dialog>
  );
}
