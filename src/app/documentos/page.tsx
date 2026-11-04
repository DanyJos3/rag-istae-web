import type { Metadata } from "next";

import { DocumentsScreen } from "@/components/documents/DocumentsScreen";

export const metadata: Metadata = {
  title: "Documentos · Consulta de normativa ISTAE",
};

export default function DocumentsPage() {
  return <DocumentsScreen />;
}
