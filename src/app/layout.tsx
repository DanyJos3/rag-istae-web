import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";

import { Providers } from "@/components/layout/Providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Tipografía con serifa para leer el texto de las normas (ventana del artículo y citas).
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consulta de normativa · ISTAE",
  description: "Asistente de consulta sobre la normativa del Instituto Superior Tecnológico Alberto Enríquez.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: next-themes agrega la clase del tema antes de que React cargue.
    <html lang="es" className={`${geistSans.variable} ${sourceSerif.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
