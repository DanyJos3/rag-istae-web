type CitationBadgeProps = {
  number: number | undefined;
  /** false si el artículo citado no existe en la normativa (identificador inventado). */
  isKnown: boolean;
  onOpen: () => void;
};

/** Círculo numerado que reemplaza a [INT08-art12] dentro de la respuesta. */
export function CitationBadge({ number, isKnown, onOpen }: CitationBadgeProps) {
  if (!isKnown) {
    return (
      <span
        title="Este artículo no se encontró en la normativa disponible"
        className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-300 px-1 align-text-top text-[11px] font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
      >
        ?
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      title="Ver el artículo"
      className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1 align-text-top text-[11px] font-semibold text-white hover:bg-sky-700"
    >
      {number}
    </button>
  );
}
