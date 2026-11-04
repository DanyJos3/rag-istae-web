"use client";

import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { CITATION_LINK_PREFIX, hideSourcesSection, linkCitations, numberCitations } from "@/lib/citations";
import type { ChatMessage } from "@/lib/types";

import { ArticleModal } from "./ArticleModal";
import { CitationBadge } from "./CitationBadge";
import { SourcesPanel } from "./SourcesPanel";

type AssistantMessageProps = {
  message: ChatMessage;
};

export function AssistantMessage({ message }: AssistantMessageProps) {
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);

  const isStreaming = message.status === "streaming";
  const text = isStreaming ? hideSourcesSection(message.content) : message.content;
  const citationNumbers = numberCitations(text);
  // Artículos que existen en la normativa (solo se sabe cuando llega la respuesta final).
  const knownUnitIds = new Set(message.sources?.flatMap((document) => document.units.map((unit) => unit.unit_id)));

  // Los enlaces #cita-… se muestran como círculos numerados; el resto, como enlaces normales.
  const markdownComponents: Components = {
    a: ({ href, children }) => {
      if (href?.startsWith(CITATION_LINK_PREFIX)) {
        const unitId = href.slice(CITATION_LINK_PREFIX.length);
        return (
          <CitationBadge
            number={citationNumbers.get(unitId)}
            isKnown={isStreaming || knownUnitIds.has(unitId)}
            onOpen={() => setOpenUnitId(unitId)}
          />
        );
      }
      return (
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    },
  };

  if (isStreaming && text === "") {
    return (
      <p className="animate-pulse text-sm text-zinc-500">
        Consultando la normativa… la respuesta puede tardar entre 1 y 3 minutos.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {linkCitations(text, citationNumbers)}
        </ReactMarkdown>
      </div>

      {message.sources && message.sources.length > 0 && (
        <SourcesPanel sources={message.sources} citationNumbers={citationNumbers} onOpenArticle={setOpenUnitId} />
      )}

      {openUnitId && (
        <ArticleModal
          key={openUnitId}
          unitId={openUnitId}
          number={citationNumbers.get(openUnitId)}
          onClose={() => setOpenUnitId(null)}
        />
      )}
    </div>
  );
}
