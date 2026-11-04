import Image from "next/image";

/** Escudo del ISTAE e identificación del sistema. */
export function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo-istae.jpg"
        alt="Escudo del Instituto Superior Tecnológico Alberto Enríquez"
        width={44}
        height={46}
        className="rounded-md object-contain"
        priority
      />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Consulta normativa</p>
        <p className="text-xs text-zinc-500">ISTAE · Alberto Enríquez</p>
      </div>
    </div>
  );
}
