/**
 * PROJECT BRAHMA — FINDING STREAM (FL-01-E STEP 3)
 * Real-time streaming feed of static analysis and security vulnerabilities as they are flagged.
 */

import React, { useRef, useEffect } from "react";
import { CodeFinding } from "@/data/demo/demoScanResults";
import { ShieldAlert, AlertTriangle, Bug, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FindingStreamProps {
  findings: CodeFinding[];
  className?: string;
  maxHeight?: number;
}

export function FindingStream({
  findings,
  className = "",
  maxHeight = 360,
}: FindingStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [findings.length]);

  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3 flex flex-col ${className}`}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <Bug className="size-4 text-violet-400" />
          <h4 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
            Live Finding Stream ({findings.length})
          </h4>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">Realtime Detection</span>
      </div>

      <div
        style={{ maxHeight }}
        className="space-y-2 overflow-y-auto pr-1 flex-1 font-mono text-xs"
      >
        {findings.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            Awaiting analysis pipeline output...
          </div>
        ) : (
          findings.map((f) => (
            <div
              key={f.id}
              className="p-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900 transition-colors space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${
                      f.severity === "HIGH" || f.severity === "CRITICAL"
                        ? "bg-rose-500/15 text-rose-300 border-rose-500/40"
                        : "bg-amber-500/15 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {f.severity}
                  </Badge>
                  <span className="text-[11px] font-bold text-zinc-200">{f.ruleId}</span>
                </div>
                <span className="text-[10px] text-zinc-500 shrink-0">
                  {f.file}:{f.line}
                </span>
              </div>

              <p className="text-[11px] text-zinc-300 line-clamp-2">{f.message}</p>

              {f.remediation && (
                <div className="flex items-start gap-1 text-[10px] text-emerald-400/90 pt-0.5">
                  <ArrowRight className="size-2.5 mt-0.5 shrink-0" />
                  <span className="truncate">{f.remediation}</span>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
