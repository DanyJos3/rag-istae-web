import Image from "next/image";

/** Escudo del ISTAE e identificación del sistema. */
export function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-white p-1 shadow-sm ring-1 ring-border">
        <Image
          src="/logo-istae.jpg"
          alt="Escudo del Instituto Superior Tecnológico Alberto Enríquez"
          width={36}
          height={37}
          className="object-contain"
          priority
        />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight text-foreground">Consulta normativa</p>
        <p className="text-xs text-muted-foreground">ISTAE · Alberto Enríquez</p>
      </div>
    </div>
  );
}
