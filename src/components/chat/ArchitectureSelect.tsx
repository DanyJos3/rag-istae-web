"use client";

import { Layers, Lock } from "lucide-react";
import useSWRImmutable from "swr/immutable";

import { fetchArchitectures } from "@/lib/api";

type ArchitectureSelectProps = {
  value: string;
  onChange: (architecture: string) => void;
  /** true cuando el chat ya empezó: la arquitectura se muestra pero no se puede cambiar. */
  locked: boolean;
};

/** Selector de arquitectura del chat, como el selector de modelo de los chats comerciales. */
export function ArchitectureSelect({ value, onChange, locked }: ArchitectureSelectProps) {
  const { data: architectures } = useSWRImmutable("architectures", fetchArchitectures);
  const selected = architectures?.find((architecture) => architecture.id === value);

  if (!architectures) return null; // mientras carga (o si falla) el chat sigue con la arquitectura por defecto

  if (locked) {
    return (
      <span
        title="La arquitectura se elige al empezar el chat. Para usar otra, abre un chat nuevo."
        className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-300"
      >
        <Lock size={12} />
        {selected?.name ?? value}
      </span>
    );
  }

  return (
    <label className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
      <Layers size={12} />
      <span className="sr-only">Arquitectura</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        title={selected?.description}
        className="bg-transparent font-medium outline-none"
      >
        {architectures.map((architecture) => (
          <option key={architecture.id} value={architecture.id} disabled={!architecture.available}>
            {architecture.name}
            {!architecture.available && " · próximamente"}
          </option>
        ))}
      </select>
    </label>
  );
}
