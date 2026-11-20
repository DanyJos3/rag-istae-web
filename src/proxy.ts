import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE, accessToken } from "@/lib/acceso";

/**
 * Acceso con una contraseña compartida (variable ACCESS_PASSWORD, definida en Vercel).
 *
 * Sin la cookie de acceso válida, cualquier página lleva a /acceso, donde se ingresa
 * la contraseña (la revisa src/app/api/acceso/route.ts). En desarrollo (`npm run dev`)
 * sin clave definida la web queda abierta; en producción sin clave se bloquea, para
 * no publicarla abierta por olvido.
 */
export async function proxy(request: NextRequest) {
  const password = process.env.ACCESS_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return new NextResponse("Falta configurar ACCESS_PASSWORD.", { status: 503 });
  }

  const { pathname, search } = request.nextUrl;
  if (pathname === "/acceso" || pathname === "/api/acceso") return NextResponse.next();
  if (request.cookies.get(ACCESS_COOKIE)?.value === (await accessToken(password))) return NextResponse.next();

  const login = new URL("/acceso", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  // Todo menos los archivos internos de Next y las imágenes públicas.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|png|svg|ico)$).*)"],
};
