import { SquarePen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type NewChatButtonProps = {
  /** Versión solo con ícono, para el encabezado en celulares. */
  compact?: boolean;
};

/** Lleva a "/", que siempre es un chat nuevo. */
export function NewChatButton({ compact = false }: NewChatButtonProps) {
  if (compact) {
    return (
      <Button asChild variant="ghost" size="icon-sm">
        <Link href="/" aria-label="Nuevo chat">
          <SquarePen />
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" className="w-full justify-start gap-2 rounded-xl shadow-sm">
      <Link href="/">
        <SquarePen />
        Nuevo chat
      </Link>
    </Button>
  );
}
