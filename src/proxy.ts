import { NextResponse, type NextRequest } from "next/server";

/**
 * Acceso con una contraseña compartida (autenticación básica del navegador).
 *
 * La clave se define en la variable ACCESS_PASSWORD (en Vercel, no en el código).
 * El usuario puede ser cualquiera; solo se revisa la contraseña. En desarrollo
 * (`npm run dev`) sin clave definida la web queda abierta; en producción sin
 * clave se bloquea, para no publicarla abierta por olvido.
 */
export function proxy(request: NextRequest) {
  const password = process.env.ACCESS_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return new NextResponse("Falta configurar ACCESS_PASSWORD.", { status: 503 });
  }

  const [scheme, encoded] = (request.headers.get("authorization") ?? "").split(" ");
  if (scheme === "Basic" && encoded) {
    const credentials = atob(encoded);
    if (credentials.slice(credentials.indexOf(":") + 1) === password) return NextResponse.next();
  }

  return new NextResponse("Acceso restringido.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Consulta normativa ISTAE", charset="UTF-8"' },
  });
}

export const config = {
  // Todo menos los archivos internos de Next y las imágenes públicas.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|png|svg|ico)$).*)"],
};
