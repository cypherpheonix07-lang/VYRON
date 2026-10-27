import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";
import { Finding, FindingSeverity } from "@/state/analysis/analysisStore";
import { cn } from "@/lib/utils";

interface LiveFindingsPanelProps {
  findings: Finding[];
  className?: string;
}

export function LiveFindingsPanel({ findings, className }: LiveFindingsPanelProps) {
  const [filterSeverity, setFilterSeverity] = useState<FindingSeverity | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = findings.filter((f) => {
    if (filterSeverity !== "ALL" && f.severity !== filterSeverity) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        (f.entityId && f.entityId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getSeverityBadge = (severity: FindingSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <ShieldAlert className="size-3" /> CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="size-3" /> HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
            <AlertCircle className="size-3" /> MEDIUM
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Info className="size-3" /> LOW
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-500/20 text-zinc-300 border border-zinc-500/30">
            <CheckCircle className="size-3" /> INFO
          </span>
        );
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-4 space-y-3",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/30">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span>Live Analysis Findings</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-primary/20 text-primary border border-primary/30">
              {findings.length}
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Real-time anomalies, centrality hubs, and risk attributions
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search findings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs rounded-md bg-secondary/50 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as FindingSeverity | "ALL")}
            className="text-xs rounded-md bg-secondary/50 border border-border/60 text-foreground px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Severity</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            {findings.length === 0
              ? "No findings emitted yet. Trigger 'Run Analysis' to evaluate pipeline."
              : "No findings match the current filter criteria."}
          </div>
        ) : (
          filtered.map((finding) => (
            <div
              key={finding.id}
              className="p-3 rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(finding.severity)}
                  <span className="text-xs font-mono text-muted-foreground">
                    Stage {finding.stageId}
                  </span>
                  {finding.entityId && (
                    <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-secondary text-primary">
                      {finding.entityId}
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono font-medium text-foreground">
                  Score:{" "}
                  <span
                    className={finding.score > 75 ? "text-rose-400 font-bold" : "text-amber-400"}
                  >
                    {finding.score}/100
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-foreground">{finding.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{finding.description}</p>
              </div>

              {finding.remediation && (
                <div className="p-2 rounded bg-primary/5 border border-primary/15 text-[11px] text-foreground flex items-start gap-2">
                  <span className="font-semibold text-primary">Recommendation:</span>
                  <span className="text-muted-foreground">{finding.remediation}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
