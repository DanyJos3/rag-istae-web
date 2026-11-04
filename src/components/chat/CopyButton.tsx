"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

/** Copia la respuesta al portapapeles y confirma con un ✓ durante dos segundos. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="ghost" size="xs" onClick={copy} className="text-muted-foreground">
      {copied ? <Check /> : <Copy />}
      {copied ? "Copiado" : "Copiar"}
    </Button>
  );
}
