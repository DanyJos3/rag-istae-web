"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { BrandLogo } from "./BrandLogo";
import { NewChatButton } from "./NewChatButton";
import { Sidebar } from "./Sidebar";

/** Estructura común de todas las pantallas: barra lateral (o encabezado en celulares) y contenido. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh bg-white dark:bg-zinc-950">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* En celulares no hay barra lateral: logo y accesos van arriba. */}
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 md:hidden dark:border-zinc-800">
          <BrandLogo />
          <div className="flex items-center gap-1">
            <Link href="/documentos" aria-label="Documentos" className="p-2">
              <FileText size={20} />
            </Link>
            <NewChatButton compact />
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
