import type { ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ComingSoonProps = {
  children: ReactNode;
};

/**
 * Envuelve un botón de una función que todavía no está disponible (etapa 2):
 * lo muestra atenuado, no responde al clic y al pasar el mouse dice "Próximamente".
 */
export function ComingSoon({ children }: ComingSoonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* El span recibe el mouse: un botón deshabilitado no dispara eventos. */}
        <span tabIndex={0} aria-disabled="true" className="inline-flex cursor-not-allowed">
          <span className="pointer-events-none opacity-50">{children}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>Próximamente</TooltipContent>
    </Tooltip>
  );
}
