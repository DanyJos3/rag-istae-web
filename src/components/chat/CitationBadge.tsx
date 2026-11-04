import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type CitationBadgeProps = {
  number: number | undefined;
  /** false si el artículo citado no existe en la normativa (identificador inventado). */
  isKnown: boolean;
  onOpen: () => void;
};

const BADGE_CLASS =
  "mx-0.5 inline-flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full px-1 align-text-top text-[10.5px] font-semibold not-prose";

/** Círculo numerado que reemplaza a [INT08-art12] dentro de la respuesta. */
export function CitationBadge({ number, isKnown, onOpen }: CitationBadgeProps) {
  if (!isKnown) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${BADGE_CLASS} bg-muted text-muted-foreground`}>?</span>
        </TooltipTrigger>
        <TooltipContent>Este artículo no se encontró en la normativa disponible.</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onOpen}
          className={`${BADGE_CLASS} bg-brand text-brand-foreground transition-transform hover:scale-110`}
        >
          {number}
        </button>
      </TooltipTrigger>
      <TooltipContent>Ver el artículo</TooltipContent>
    </Tooltip>
  );
}
