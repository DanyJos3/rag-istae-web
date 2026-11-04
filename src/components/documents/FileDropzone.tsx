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
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <FileUp size={20} className="text-sky-700 dark:text-sky-400" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
          <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
        </div>
        <button type="button" onClick={() => onChange(null)} aria-label="Quitar archivo" className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
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
          isDragging ? "border-sky-500 bg-sky-50 dark:bg-sky-950/30" : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700"
        }`}
      >
        <FileUp size={24} className="text-zinc-400" />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          Arrastra el archivo aquí o <span className="font-medium text-sky-700 dark:text-sky-400">elígelo</span>
        </span>
        <span className="text-xs text-zinc-500">PDF o DOCX · máximo {MAX_SIZE_MB} MB</span>
        <input
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={(event) => selectFile(event.target.files?.[0])}
          className="sr-only"
        />
      </label>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
