"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import useSWRImmutable from "swr/immutable";

import { fetchUnit } from "@/lib/api";

type ArticleModalProps = {
  unitId: string;
  number: number | undefined;
  onClose: () => void;
};

/** Ventana con el texto completo del artículo citado, tal como figura en la norma. */
export function ArticleModal({ unitId, number, onClose }: ArticleModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // El texto de un artículo no cambia: SWR lo guarda y no lo vuelve a pedir.
  const { data: unit, error, isLoading } = useSWRImmutable(unitId, fetchUnit);

  // <dialog> nativo: oscurece el fondo, se cierra con Escape y maneja el foco.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className="m-auto w-[min(42rem,calc(100%-2rem))] rounded-2xl bg-white p-0 shadow-xl backdrop:bg-black/40 dark:bg-zinc-900"
    >
      <header className="flex items-start gap-3 border-b border-zinc-200 p-5 dark:border-zinc-800">
        {number && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
            {number}
          </span>
        )}
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-400">
            {unit ? unit.label : unitId}
          </p>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">{unit?.document_name ?? "Cargando…"}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <X size={18} />
        </button>
      </header>

      <div className="max-h-[65vh] overflow-y-auto p-5 text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
        {isLoading && <p className="text-zinc-500">Cargando el artículo…</p>}
        {error && <p className="text-red-700">No se pudo cargar el artículo. Intente nuevamente.</p>}
        {unit?.text.replaceAll("**", "")}
      </div>
    </dialog>
  );
}
