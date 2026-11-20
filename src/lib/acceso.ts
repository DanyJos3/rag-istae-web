/** Cookie que recuerda que el navegador ya ingresó la contraseña de acceso. */
export const ACCESS_COOKIE = "istae_acceso";
export const ACCESS_DAYS = 7;

/**
 * Valor que se guarda en la cookie: un resumen (SHA-256) de la contraseña, no la
 * contraseña. Si ACCESS_PASSWORD cambia, las cookies anteriores dejan de valer.
 */
export async function accessToken(password: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`istae-acceso:${password}`));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Solo se vuelve a rutas internas de la web (evita redirigir a otro sitio). */
export function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
