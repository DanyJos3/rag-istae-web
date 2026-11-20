import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE, ACCESS_DAYS, accessToken, safeNext } from "@/lib/acceso";

/** Recibe el formulario de /acceso: si la contraseña es correcta, guarda la cookie y vuelve a la página pedida. */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const next = safeNext(form.get("next")?.toString() ?? null);
  const password = process.env.ACCESS_PASSWORD;

  if (!password || form.get("password")?.toString() !== password) {
    const retry = new URL("/acceso", request.url);
    retry.searchParams.set("error", "1");
    retry.searchParams.set("next", next);
    return NextResponse.redirect(retry, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(ACCESS_COOKIE, await accessToken(password), {
    httpOnly: true, // el JavaScript de la página no puede leerla
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_DAYS * 24 * 60 * 60,
  });
  return response;
}
