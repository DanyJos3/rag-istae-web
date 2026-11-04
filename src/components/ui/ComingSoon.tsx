import type { ReactNode } from "react";

type ComingSoonProps = {
  children: ReactNode;
};

/**
 * Envuelve un botón de una función que todavía no está disponible (etapa 2):
 * lo muestra atenuado, no responde al clic y al pasar el mouse dice "Próximamente".
 */
export function ComingSoon({ children }: ComingSoonProps) {
  return (
    <span className="group relative inline-flex">
      <span aria-disabled="true" className="pointer-events-none opacity-50">
        {children}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md bg-zinc-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Próximamente
      </span>
    </span>
  );
}
