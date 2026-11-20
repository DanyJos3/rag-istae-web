"use client";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Formulario de la pantalla de acceso. Se envía a /api/acceso sin JavaScript adicional. */
export function AccessForm() {
  const params = useSearchParams();
  const failed = params.get("error") === "1";

  return (
    <form method="post" action="/api/acceso" className="flex w-full flex-col gap-3 text-left">
      <input type="hidden" name="next" value={params.get("next") ?? "/"} />
      <label htmlFor="password" className="text-sm font-medium text-foreground">
        Contraseña
      </label>
      <Input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        aria-invalid={failed || undefined}
        className="h-10"
      />
      {failed && <p className="text-sm text-destructive">Contraseña incorrecta. Intenta nuevamente.</p>}
      <Button type="submit" className="h-10">
        Ingresar
      </Button>
    </form>
  );
}
