"use client";

import { FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useRecentChats } from "@/hooks/useRecentChats";
import { cn } from "@/lib/utils";

import { BrandLogo } from "./BrandLogo";
import { NewChatButton } from "./NewChatButton";
import { ThemeToggle } from "./ThemeToggle";

/** Barra lateral (solo en pantallas medianas o grandes): Administración arriba y Chat abajo. */
export function Sidebar() {
  const pathname = usePathname();
  const recentChats = useRecentChats();

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-5 md:flex">
      <BrandLogo />

      <SidebarSection title="Administración">
        <SidebarLink href="/documentos" isActive={pathname.startsWith("/documentos")} icon={<FileText />}>
          Documentos
        </SidebarLink>
      </SidebarSection>

      <SidebarSection title="Chat" className="min-h-0 flex-1">
        <NewChatButton />
        <p className="px-3 pt-4 pb-1 text-xs font-medium text-muted-foreground">Recientes</p>
        {recentChats.length === 0 ? (
          <p className="px-3 text-xs text-muted-foreground/70">Tus conversaciones aparecerán aquí.</p>
        ) : (
          <ul className="-mx-1 space-y-0.5 overflow-y-auto px-1">
            {recentChats.map((chat) => (
              <li key={chat.id}>
                <SidebarLink href={`/chat/${chat.id}`} isActive={pathname === `/chat/${chat.id}`} icon={<MessageSquare />}>
                  <span className="truncate">{chat.title}</span>
                </SidebarLink>
              </li>
            ))}
          </ul>
        )}
      </SidebarSection>

      <footer className="flex items-center justify-between gap-2 border-t border-sidebar-border pt-4">
        <p className="text-xs leading-snug text-muted-foreground">Los chats se guardan en este navegador.</p>
        <ThemeToggle />
      </footer>
    </aside>
  );
}

function SidebarSection({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <section className={cn("flex flex-col gap-1", className)}>
      <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{title}</p>
      {children}
    </section>
  );
}

type SidebarLinkProps = {
  href: string;
  isActive: boolean;
  icon: ReactNode;
  children: ReactNode;
};

function SidebarLink({ href, isActive, icon, children }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
        isActive
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground [&_svg]:text-brand"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground [&_svg]:text-muted-foreground",
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
