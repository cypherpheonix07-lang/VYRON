/**
 * PROJECT BRAHMA — CITATION ANCHOR COMPONENT (PHASE E.1, E.2)
 * Renders cryptographic provenance superscripts linking directly to verified findings.
 */

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShieldCheck, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface CitationAnchorProps {
  sha256: string;
  label: string;
  source: string;
  citationIndex?: number;
  className?: string;
}

export function CitationAnchor({
  sha256,
  label,
  source,
  citationIndex = 1,
  className = "",
}: CitationAnchorProps) {
  const [copied, setCopied] = useState(false);
  const shortHash = sha256 ? `${sha256.substring(0, 8)}...` : "verified";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sha256) {
      navigator.clipboard.writeText(sha256);
      setCopied(true);
      toast.success("SHA-256 hash copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <span className={`inline-flex items-center align-super text-[10px] font-mono mx-0.5 ${className}`}>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded px-1 py-0.2 transition-colors cursor-pointer font-bold focus:outline-none focus:ring-1 focus:ring-violet-400"
                aria-label={`Citation [${citationIndex}]: Source ${source}`}
              >
                [{citationIndex}]
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs font-mono bg-zinc-900 border-zinc-700 text-zinc-200">
            <p className="font-semibold text-violet-300">{label}</p>
            <p className="text-[11px] text-zinc-400">
              Source: <span className="text-zinc-200">{source}</span>
            </p>
            <p className="text-[10px] text-zinc-500">Hash: {shortHash}</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent
          align="start"
          side="top"
          className="w-72 p-3 bg-zinc-950 border-zinc-800 text-zinc-200 shadow-xl rounded-lg text-xs space-y-2"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-violet-400" />
              <span className="font-semibold text-zinc-100">Cryptographic Provenance</span>
            </div>
            <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-300 border-violet-500/30">
              Verified
            </Badge>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div>
              <span className="text-zinc-400">Claim: </span>
              <span className="text-zinc-200">{label}</span>
            </div>
            <div>
              <span className="text-zinc-400">Source: </span>
              <span className="text-zinc-200">{source}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-zinc-500 truncate mr-2" title={sha256}>
                SHA: {shortHash}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Copy full SHA-256 hash"
              >
                {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </span>
  );
}
