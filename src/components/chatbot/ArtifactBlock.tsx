/**
 * PROJECT BRAHMA — ARTIFACT RENDERING SYSTEM (PHASE D.1, D.2, D.3)
 * Isolated rendering for code, markdown, sandboxed HTML/SVG, JSON trees, and blueprints.
 * Strictly sandboxed (zero arbitrary eval outside iframe sandbox).
 */

import React, { useState, useEffect } from "react";
import {
  Code,
  FileText,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Box,
  Layers,
  Sparkles,
} from "lucide-react";
import Markdown from "react-markdown";
import { MiniArchitectureCanvas } from "./MiniArchitectureCanvas";
import { toast } from "sonner";

export interface ArtifactBlockProps {
  type: "code" | "markdown" | "html" | "svg" | "json" | "blueprint";
  content: string;
  title?: string;
  language?: string;
  className?: string;
}

export function ArtifactBlock({
  type,
  content,
  title,
  language = "typescript",
  className = "",
}: ArtifactBlockProps) {
  const storageKey = `brahma_artifact_${title || type}_expanded`;
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(storageKey);
      return saved !== null ? saved === "true" : true; // expanded by default in preview
    }
    return true;
  });
  const [copied, setCopied] = useState(false);

  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, String(next));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Artifact copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "code":
        return <Code className="size-4 text-cyan-400" />;
      case "html":
      case "svg":
        return <Sparkles className="size-4 text-amber-400" />;
      case "json":
        return <Box className="size-4 text-emerald-400" />;
      case "blueprint":
        return <Layers className="size-4 text-violet-400" />;
      default:
        return <FileText className="size-4 text-blue-400" />;
    }
  };

  // Render the body based on type
  const renderContent = () => {
    switch (type) {
      case "code":
        return (
          <div className="relative">
            <pre className="p-4 bg-zinc-950 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed max-h-96">
              <code>{content}</code>
            </pre>
          </div>
        );

      case "markdown":
        return (
          <div className="p-4 bg-zinc-950 text-sm text-zinc-200 leading-relaxed font-sans max-h-96 overflow-y-auto prose prose-invert max-w-none">
            <Markdown>{content}</Markdown>
          </div>
        );

      case "html":
      case "svg":
        return (
          <div className="p-2 bg-zinc-950">
            {/* Strictly sandboxed iframe (no parent JS execution) */}
            <iframe
              title={title || "HTML Artifact"}
              srcDoc={content}
              sandbox="allow-scripts"
              className="w-full h-80 border-0 rounded bg-white text-zinc-900"
            />
          </div>
        );

      case "json": {
        let parsed: unknown = null;
        let isJsonValid = false;
        try {
          parsed = JSON.parse(content);
          isJsonValid = true;
        } catch {
          isJsonValid = false;
        }

        return (
          <div className="p-3 bg-zinc-950 font-mono text-xs text-emerald-300 max-h-96 overflow-y-auto">
            <pre className="overflow-x-auto">
              <code>{isJsonValid ? JSON.stringify(parsed, null, 2) : content}</code>
            </pre>
          </div>
        );
      }

      case "blueprint": {
        let nodes: any[] = [];
        let edges: any[] = [];
        try {
          const parsed = JSON.parse(content);
          nodes = parsed.nodes || parsed.blueprintNodes || [];
          edges = parsed.edges || parsed.blueprintEdges || [];
        } catch {
          nodes = [];
          edges = [];
        }

        return <MiniArchitectureCanvas nodes={nodes} edges={edges} />;
      }

      default:
        return <div className="p-4 text-xs text-zinc-300 font-mono whitespace-pre-wrap">{content}</div>;
    }
  };

  return (
    <div
      className={`my-3 rounded-xl border border-zinc-800/90 bg-zinc-900/90 shadow-xl overflow-hidden transition-all ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-950/80 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded bg-zinc-800/80">{getTypeIcon()}</div>
          <span className="text-xs font-semibold text-zinc-100 truncate">
            {title || `${type.toUpperCase()} Artifact`}
          </span>
          {language && type === "code" && (
            <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Copy content"
            aria-label="Copy artifact content"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          </button>

          <button
            type="button"
            onClick={toggleExpand}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
            aria-label={isExpanded ? "Collapse artifact" : "Expand artifact"}
          >
            {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && <div className="border-t border-zinc-800/40">{renderContent()}</div>}
    </div>
  );
}
