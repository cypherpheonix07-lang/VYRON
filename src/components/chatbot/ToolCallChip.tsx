/**
 * PROJECT BRAHMA — TOOL CALL CHIP (PHASE Q.1, Q.2)
 * Expandable chip rendering MCP tool executions with live pulse, execution state, and input params.
 */

import React, { useState } from "react";
import { Wrench, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ToolCallChipProps {
  toolName: string;
  status: "running" | "success" | "error";
  durationMs?: number;
  args?: Record<string, unknown>;
  resultSummary?: string;
  className?: string;
}

export function ToolCallChip({
  toolName,
  status,
  durationMs,
  args,
  resultSummary,
  className = "",
}: ToolCallChipProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`inline-flex flex-col rounded-lg border text-xs font-mono transition-all my-1.5 ${
        status === "running"
          ? "bg-violet-950/20 border-violet-500/50 shadow-[0_0_8px_rgba(139,92,246,0.3)] animate-pulse"
          : status === "success"
          ? "bg-zinc-900/80 border-zinc-800 text-zinc-300"
          : "bg-rose-950/20 border-rose-800/60 text-rose-300"
      } ${className}`}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer select-none hover:bg-zinc-800/50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-1.5">
          {status === "running" ? (
            <Loader2 className="size-3 text-violet-400 animate-spin" />
          ) : status === "success" ? (
            <CheckCircle className="size-3 text-emerald-400" />
          ) : (
            <AlertCircle className="size-3 text-rose-400" />
          )}
          <span className="font-semibold text-zinc-200">{toolName}</span>
        </div>

        {durationMs !== undefined && (
          <span className="text-[10px] text-zinc-500 font-mono">({durationMs}ms)</span>
        )}

        <div className="ml-auto flex items-center gap-1 text-zinc-500">
          {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </div>
      </div>

      {expanded && (
        <div className="px-2.5 pb-2.5 pt-1 border-t border-zinc-800/80 space-y-1.5 text-[11px]">
          {args && (
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Arguments:</span>
              <pre className="p-1.5 rounded bg-zinc-950 border border-zinc-800/60 overflow-x-auto text-zinc-300 text-[10px]">
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
          )}
          {resultSummary && (
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Result:</span>
              <p className="text-zinc-300">{resultSummary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
