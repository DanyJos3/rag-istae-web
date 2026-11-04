import type { Metadata } from "next";

import { NewDocumentScreen } from "@/components/documents/NewDocumentScreen";

export const metadata: Metadata = {
  title: "Agregar documento · Consulta de normativa ISTAE",
};

export default function NewDocumentPage() {
  return <NewDocumentScreen />;
}
