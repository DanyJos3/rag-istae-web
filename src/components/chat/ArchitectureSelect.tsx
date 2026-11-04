"use client";

import { Layers, Lock } from "lucide-react";
import useSWRImmutable from "swr/immutable";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
            <Lock className="size-3" />
            {selected?.name ?? value}
          </span>
        </TooltipTrigger>
        <TooltipContent>La arquitectura se elige al empezar. Para usar otra, abre un chat nuevo.</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" aria-label="Arquitectura" className="h-7 gap-1.5 rounded-full border-border px-3 text-xs shadow-none">
        <Layers className="size-3.5 text-brand" />
        {/* En el botón se muestra solo el nombre (las opciones también traen la descripción). */}
        <SelectValue>{selected?.name}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="start" className="w-80">
        {architectures.map((architecture) => (
          <SelectItem key={architecture.id} value={architecture.id} disabled={!architecture.available} className="py-2">
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 font-medium">
                {architecture.name}
                {!architecture.available && (
                  <span className="rounded-full bg-muted px-1.5 py-px text-[10px] font-normal text-muted-foreground">
                    próximamente
                  </span>
                )}
              </span>
              <span className="text-xs whitespace-normal text-muted-foreground">{architecture.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
