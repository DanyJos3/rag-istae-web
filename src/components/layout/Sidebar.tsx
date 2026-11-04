import { SquarePen } from "lucide-react";

import { BrandLogo } from "./BrandLogo";

type SidebarProps = {
  onNewChat: () => void;
  disabled: boolean;
};

/** Barra lateral (solo en pantallas medianas o grandes). */
export function Sidebar({ onNewChat, disabled }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-zinc-200 bg-zinc-50 p-4 md:flex dark:border-zinc-800 dark:bg-zinc-900">
      <BrandLogo />

      <button
        type="button"
        onClick={onNewChat}
        disabled={disabled}
        className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        <SquarePen size={16} />
        Nuevo chat
      </button>

      <p className="mt-auto text-xs leading-relaxed text-zinc-500">
        Respuestas basadas en la normativa institucional y nacional de educación superior.
      </p>
    </aside>
  );
}
