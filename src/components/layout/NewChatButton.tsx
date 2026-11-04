import { SquarePen } from "lucide-react";
import Link from "next/link";

type NewChatButtonProps = {
  /** Versión solo con ícono, para el encabezado en celulares. */
  compact?: boolean;
};

/** Lleva a "/", que siempre es un chat nuevo. */
export function NewChatButton({ compact = false }: NewChatButtonProps) {
  if (compact) {
    return (
      <Link href="/" aria-label="Nuevo chat" className="p-2">
        <SquarePen size={20} />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
    >
      <SquarePen size={16} />
      Nuevo chat
    </Link>
  );
}
