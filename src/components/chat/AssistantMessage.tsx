"use client";

import Image from "next/image";
import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { CITATION_LINK_PREFIX, hideSourcesSection, linkCitations, numberCitations } from "@/lib/citations";
import type { ChatMessage } from "@/lib/types";

import { ArticleModal } from "./ArticleModal";
import { CitationBadge } from "./CitationBadge";
import { CopyButton } from "./CopyButton";
import { SourcesPanel } from "./SourcesPanel";
import { ThinkingIndicator } from "./ThinkingIndicator";

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

  return (
    <div className="flex gap-3">
      {/* Avatar del asistente: el escudo del ISTAE */}
      <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-border">
        <Image src="/logo-istae.jpg" alt="" width={28} height={29} className="object-contain" />
      </div>

      <div className="min-w-0 flex-1 space-y-4">
        {isStreaming && text === "" ? (
          <div className="pt-1.5">
            <ThinkingIndicator />
          </div>
        ) : (
          <div className="prose prose-slate max-w-none leading-relaxed dark:prose-invert prose-headings:tracking-tight prose-strong:text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {linkCitations(text, citationNumbers)}
            </ReactMarkdown>
          </div>
        )}

        {message.status === "done" && <CopyButton text={message.content} />}

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
    </div>
  );
}
