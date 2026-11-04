// Convierte las citas del modelo ([INT08-art12]) en enlaces numerados que la
// interfaz muestra como círculos (ver CitationBadge).

const CITATION = /\[((?:INT|EXT)\d{2}-[A-Za-z0-9.-]+)\]/g;

/** Prefijo de los enlaces de cita: [1](#cita-INT08-art12) */
export const CITATION_LINK_PREFIX = "#cita-";

/** Asigna un número a cada artículo según el orden en que aparece por primera vez en el texto. */
export function numberCitations(text: string): Map<string, number> {
  const numbers = new Map<string, number>();
  for (const match of text.matchAll(CITATION)) {
    const unitId = match[1];
    if (!numbers.has(unitId)) numbers.set(unitId, numbers.size + 1);
  }
  return numbers;
}

/** Reemplaza cada [INT08-art12] por un enlace Markdown [1](#cita-INT08-art12). */
export function linkCitations(text: string, numbers: Map<string, number>): string {
  return text.replace(CITATION, (_, unitId: string) => `[${numbers.get(unitId)}](${CITATION_LINK_PREFIX}${unitId})`);
}

/**
 * Mientras llega la respuesta, el modelo escribe al final su propia sección «Fuentes:».
 * No se muestra: al terminar se reemplaza por el panel de fuentes verificadas.
 */
export function hideSourcesSection(text: string): string {
  const header = text.search(/^\s*(?:\*\*)?\s*fuentes\s*:/im);
  return header === -1 ? text : text.slice(0, header).trimEnd();
}
