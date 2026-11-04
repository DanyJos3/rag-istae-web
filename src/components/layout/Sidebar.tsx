"use client";

import { FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useRecentChats } from "@/hooks/useRecentChats";

import { BrandLogo } from "./BrandLogo";
import { NewChatButton } from "./NewChatButton";

/** Barra lateral (solo en pantallas medianas o grandes): Administración arriba y Chat abajo. */
export function Sidebar() {
  const pathname = usePathname();
  const recentChats = useRecentChats();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-zinc-200 bg-zinc-50 p-4 md:flex dark:border-zinc-800 dark:bg-zinc-900">
      <BrandLogo />

      <SidebarSection title="Administración">
        <SidebarLink href="/documentos" isActive={pathname.startsWith("/documentos")} icon={<FileText size={16} />}>
          Documentos
        </SidebarLink>
      </SidebarSection>

      <SidebarSection title="Chat">
        <NewChatButton />
        <p className="px-3 pt-3 text-xs text-zinc-500">Recientes</p>
        {recentChats.length === 0 ? (
          <p className="px-3 text-xs text-zinc-400">Aún no hay conversaciones.</p>
        ) : (
          <ul className="space-y-0.5 overflow-y-auto">
            {recentChats.map((chat) => (
              <li key={chat.id}>
                <SidebarLink href={`/chat/${chat.id}`} isActive={pathname === `/chat/${chat.id}`} icon={<MessageSquare size={14} />}>
                  <span className="truncate">{chat.title}</span>
                </SidebarLink>
              </li>
            ))}
          </ul>
        )}
      </SidebarSection>

      <p className="mt-auto text-xs leading-relaxed text-zinc-500">
        Los chats se guardan solo en este navegador.
      </p>
    </aside>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex min-h-0 flex-col gap-1">
      <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-zinc-500 uppercase">{title}</p>
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
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
        isActive
          ? "bg-sky-100 font-medium text-sky-900 dark:bg-sky-950 dark:text-sky-200"
          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {children}
    </Link>
  );
}
