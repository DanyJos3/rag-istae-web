"use client";

import { FileUp, X } from "lucide-react";
import { useState, type DragEvent } from "react";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const MAX_SIZE_MB = 50; // límite por archivo del almacenamiento (Supabase, plan gratuito)

type FileDropzoneProps = {
  file: File | null;
  onChange: (file: File | null) => void;
};

/** Zona para arrastrar o elegir el archivo original de la norma (PDF o DOCX). */
export function FileDropzone({ file, onChange }: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(candidate: File | undefined) {
    if (!candidate) return;
    const extension = candidate.name.slice(candidate.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setError("Solo se aceptan archivos PDF o DOCX.");
      return;
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`El archivo supera los ${MAX_SIZE_MB} MB.`);
      return;
    }
    setError(null);
    onChange(candidate);
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-4">
        <FileUp size={20} className="text-brand" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
        </div>
        <button type="button" onClick={() => onChange(null)} aria-label="Quitar archivo" className="rounded-lg p-1 transition-colors hover:bg-muted">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragging ? "border-brand bg-brand-soft" : "border-input hover:border-brand/50 hover:bg-muted/40"
        }`}
      >
        <FileUp size={24} className="text-brand" />
        <span className="text-sm text-foreground/80">
          Arrastra el archivo aquí o <span className="font-medium text-brand">elígelo</span>
        </span>
        <span className="text-xs text-muted-foreground">PDF o DOCX · máximo {MAX_SIZE_MB} MB</span>
        <input
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={(event) => selectFile(event.target.files?.[0])}
          className="sr-only"
        />
      </label>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
