import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { AccessForm } from "@/components/layout/AccessForm";

export const metadata: Metadata = { title: "Acceso · Consulta de normativa ISTAE" };

/** Pantalla de acceso con la contraseña compartida (ver src/proxy.ts). */
export default function AccessPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div className="rounded-2xl bg-white p-2 shadow-md ring-1 ring-border">
          <Image src="/logo-istae.jpg" alt="Escudo del ISTAE" width={56} height={58} className="object-contain" priority />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Consulta normativa ISTAE</h1>
          <p className="text-sm text-muted-foreground">Sistema de acceso restringido. Ingresa la contraseña para continuar.</p>
        </div>
        <Suspense>
          <AccessForm />
        </Suspense>
      </div>
    </main>
  );
}
