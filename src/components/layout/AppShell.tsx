"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { BrandLogo } from "./BrandLogo";
import { NewChatButton } from "./NewChatButton";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

/** Estructura común de todas las pantallas: barra lateral (o encabezado en celulares) y contenido. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* En celulares no hay barra lateral: logo y accesos van arriba. */}
        <header className="flex items-center justify-between border-b px-4 py-3 md:hidden">
          <BrandLogo />
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon-sm">
              <Link href="/documentos" aria-label="Documentos">
                <FileText />
              </Link>
            </Button>
            <NewChatButton compact />
            <ThemeToggle />
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
