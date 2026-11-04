"use client";

import { motion } from "motion/react";

/** Se muestra mientras el modelo lee la normativa y todavía no escribió nada. */
export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <div className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="size-1.5 rounded-full bg-brand"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15 }}
          />
        ))}
      </div>
      Consultando la normativa… puede tardar entre 1 y 3 minutos.
    </div>
  );
}
