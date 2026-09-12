/**
 * PROJECT BRAHMA — STREAMING TOKEN RENDERER (PHASE C.1, E.2, S.4)
 * Renders characters via requestAnimationFrame with cyan block cursor.
 * Parses markdown blocks and inline [cite:sha256:hash] tokens into CitationAnchor.
 */

import React, { useState, useEffect, useRef } from "react";
import { CitationAnchor } from "./CitationAnchor";

export interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  speed?: number; // ms per character (default: 15ms in demo)
  onComplete?: () => void;
  className?: string;
}

export function StreamingText({
  text,
  isStreaming,
  speed = 15,
  onComplete,
  className = "",
}: StreamingTextProps) {
  const [displayedLength, setDisplayedLength] = useState<number>(() =>
    isStreaming ? 0 : text.length
  );
  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const onCompleteCalledRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedLength(text.length);
      if (!onCompleteCalledRef.current) {
        onCompleteCalledRef.current = true;
        onComplete?.();
      }
      return;
    }

    onCompleteCalledRef.current = false;
    let currentLen = 0;
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - lastTickRef.current;
      const charsToAdd = Math.max(1, Math.floor(elapsed / speed));

      if (elapsed >= speed) {
        currentLen = Math.min(text.length, currentLen + charsToAdd);
        setDisplayedLength(currentLen);
        lastTickRef.current = now;
      }

      if (currentLen < text.length) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        if (!onCompleteCalledRef.current) {
          onCompleteCalledRef.current = true;
          onComplete?.();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [text, isStreaming, speed, onComplete]);

  const visibleText = text.slice(0, displayedLength);
  const isCurrentlyStreaming = isStreaming && displayedLength < text.length;

  // Render markdown paragraphs, code blocks, and citations
  const renderFormattedContent = (content: string) => {
    // Check if whole content is code block
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeBuffer: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lineIdx) => {
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <pre
              key={`code-${lineIdx}`}
              className="my-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs overflow-x-auto selection:bg-cyan-500/20"
            >
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          );
          codeBuffer = [];
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Handle blockquotes
      if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={`bq-${lineIdx}`}
            className="border-l-2 border-cyan-500/50 pl-3 my-1.5 text-zinc-400 italic text-sm"
          >
            {renderInlineSpans(line.slice(2), lineIdx)}
          </blockquote>
        );
        return;
      }

      // Handle Headings
      if (line.startsWith("### ")) {
        elements.push(
          <h4 key={`h4-${lineIdx}`} className="text-sm font-semibold text-zinc-100 mt-3 mb-1">
            {renderInlineSpans(line.slice(4), lineIdx)}
          </h4>
        );
        return;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h3 key={`h3-${lineIdx}`} className="text-base font-bold text-zinc-100 mt-3 mb-1.5">
            {renderInlineSpans(line.slice(3), lineIdx)}
          </h3>
        );
        return;
      }
      if (line.startsWith("# ")) {
        elements.push(
          <h2 key={`h2-${lineIdx}`} className="text-lg font-bold text-zinc-100 mt-4 mb-2">
            {renderInlineSpans(line.slice(2), lineIdx)}
          </h2>
        );
        return;
      }

      // Regular prose paragraph or list item
      if (line.trim() === "") {
        elements.push(<div key={`empty-${lineIdx}`} className="h-1.5" />);
        return;
      }

      elements.push(
        <p key={`p-${lineIdx}`} className="my-1 leading-relaxed text-sm text-zinc-200 font-sans">
          {renderInlineSpans(line, lineIdx)}
        </p>
      );
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <pre
          key="code-trailing"
          className="my-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs overflow-x-auto"
        >
          <code>{codeBuffer.join("\n")}</code>
        </pre>
      );
    }

    return elements;
  };

  // Helper for inline styles: **bold**, *italic*, `code`, and [cite:sha256:xxx]
  const renderInlineSpans = (textSegment: string, parentKey: number) => {
    // Regex for citation marker: [cite:sha256:abc12345] or [cite:label:source:hash]
    const parts = textSegment.split(/(\[cite:[^\]]+\]|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

    let citationCounter = 1;

    return parts.map((part, idx) => {
      if (!part) return null;

      // Citation match
      if (part.startsWith("[cite:") && part.endsWith("]")) {
        const raw = part.slice(6, -1);
        const tokens = raw.split(":");
        const hash = tokens[tokens.length - 1] || "verified";
        const label = (tokens.length > 2 && tokens[0]) ? tokens[0] : "Verified Fact";
        const source = (tokens.length > 2 && tokens[1]) ? tokens[1] : "Brahma Intelligence Engine";
        const currentIndex = citationCounter++;

        return (
          <CitationAnchor
            key={`cite-${parentKey}-${idx}`}
            sha256={hash}
            label={label}
            source={source}
            citationIndex={currentIndex}
          />
        );
      }

      // Bold match
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`bold-${parentKey}-${idx}`} className="font-semibold text-zinc-100">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic match
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={`italic-${parentKey}-${idx}`} className="italic text-zinc-300">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Inline code
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={`inline-code-${parentKey}-${idx}`}
            className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 font-mono text-xs text-cyan-300 mx-0.5"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return <React.Fragment key={`text-${parentKey}-${idx}`}>{part}</React.Fragment>;
    });
  };

  return (
    <div
      className={`relative inline-block w-full ${className}`}
      aria-busy={isCurrentlyStreaming}
      aria-live={isCurrentlyStreaming ? "polite" : "off"}
    >
      <div className="prose prose-invert max-w-none">
        {renderFormattedContent(visibleText)}
        {isCurrentlyStreaming && (
          <span
            className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle rounded-[1px] shadow-[0_0_8px_rgba(34,211,238,0.7)]"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
