/**
 * VYRON — CONTEXTUAL COPILOT PARTNER (PHASE 14)
 * AI-augmented engineering intelligence inheriting the active dashboard context envelope:
 * Project, Environment, Mode, Selected Entity, Relevant ATLAS graph, Recent changes,
 * Known drift, Runtime signals, Release state, Evidence, Authority.
 * Capabilities: Explain, Investigate, Correlate, Summarize, Compare, Trace, Recommend, Simulate, Prepare Action.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { copilotDispatcher } from "@/services/copilot/copilotDispatcher";
import { EpistemicState } from "@/types/engineeringEntity";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  Compass,
  Fingerprint,
  Layers,
  Network,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

interface EpistemicInsight {
  id: string;
  state: EpistemicState;
  text: string;
  confidence: number;
}

const EPISTEMIC_INSIGHTS: EpistemicInsight[] = [
  {
    id: "ins-fact",
    state: "FACT",
    text: "AST parsing confirmed 0 raw SQL statements across all repositories.",
    confidence: 1.0,
  },
  {
    id: "ins-obs",
    state: "OBSERVATION",
    text: "P99 telemetry latency spike to 142ms detected during carding burst.",
    confidence: 0.99,
  },
  {
    id: "ins-inf",
    state: "INFERENCE",
    text: "AST drift in services/billing/query.ts is leaking transactional boundaries.",
    confidence: 0.94,
  },
  {
    id: "ins-hyp",
    state: "HYPOTHESIS",
    text: "Redis distributed idempotency lock will resolve settlement retry race conditions.",
    confidence: 0.88,
  },
  {
    id: "ins-rec",
    state: "RECOMMENDATION",
    text: "Enforce Circuit Breaker ADR-001 to isolate billing blast radius before release.",
    confidence: 0.95,
  },
];

export function CopilotPartnerCard() {
  const { selectedEntity, selectedProjectId, environment, userAuthority } = useCommandCenter();
  const [quickInput, setQuickInput] = useState("");
  const [selectedEpistemic, setSelectedEpistemic] = useState<string>("ALL");

  const handleDispatch = async (promptText: string) => {
    toast.info("Dispatching contextual reasoning to VYRON Copilot...");
    const entityContext = selectedEntity
      ? `[Entity Focus: ${selectedEntity.type.toUpperCase()} '${selectedEntity.name}' (${selectedEntity.id})] `
      : `[Project Focus: ${selectedProjectId} (${environment})] `;
    await copilotDispatcher.dispatch(`${entityContext}${promptText}`);
    setQuickInput("");
  };

  return (
    <div className="space-y-3">
      {/* CONTEXT ENVELOPE INSPECTOR */}
      <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" /> Active Copilot Context Envelope
          </span>
          <Badge variant="outline" className="text-[9px] font-mono text-primary bg-primary/10">
            SYNCED
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground pt-1">
          <div>Project: <span className="text-foreground font-semibold">{selectedProjectId}</span></div>
          <div>Env: <span className="text-foreground font-semibold">{environment}</span></div>
          <div>Authority: <span className="text-foreground font-semibold">{userAuthority}</span></div>
          <div>
            Entity:{" "}
            <span className="text-emerald-400 font-semibold truncate">
              {selectedEntity ? selectedEntity.name : "None (Global Scope)"}
            </span>
          </div>
        </div>
      </div>

      {/* 4 PRIMARY COMMAND CENTER ACTIONS */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Button
          asChild
          variant="outline"
          className="h-auto p-2.5 justify-start flex-col items-start border-border/30 bg-zinc-950/30 hover:bg-zinc-900"
        >
          <Link to="/app/analysis">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="size-3 text-primary" /> Run AST Scan
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Execute 12-stage analysis pipeline
            </span>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-2.5 justify-start flex-col items-start border-border/30 bg-zinc-950/30 hover:bg-zinc-900"
        >
          <Link to={"/app/release" as never}>
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3 text-emerald-400" /> Release Gates
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Evaluate production policies
            </span>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-2.5 justify-start flex-col items-start border-border/30 bg-zinc-950/30 hover:bg-zinc-900"
        >
          <Link to="/app/drift">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Compass className="size-3 text-amber-400" /> Drift Analysis
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Diff blueprint vs actual code
            </span>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-2.5 justify-start flex-col items-start border-border/30 bg-zinc-950/30 hover:bg-zinc-900"
        >
          <Link to={"/app/decisions" as never}>
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <CheckSquare className="size-3 text-blue-400" /> Record ADR
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Draft architectural decision
            </span>
          </Link>
        </Button>
      </div>

      {/* QUICK CONTEXTUAL REASONING CHIP ACTIONS */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-muted-foreground font-semibold">One-Click Engineering Reasoning</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDispatch("Audit current architecture drift findings and calculate cumulative risk")}
            className="h-7 px-2 text-[10px] font-mono justify-start truncate bg-zinc-900/40 border-border/40"
          >
            <Compass className="size-2.5 text-amber-400 mr-1.5 shrink-0" /> Audit Drift Findings
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDispatch("Evaluate production release blockers and recommend safe mitigation plan")}
            className="h-7 px-2 text-[10px] font-mono justify-start truncate bg-zinc-900/40 border-border/40"
          >
            <ShieldCheck className="size-2.5 text-emerald-400 mr-1.5 shrink-0" /> Evaluate Release Blockers
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDispatch("Explain blast radius of recent code changes across ATLAS graph")}
            className="h-7 px-2 text-[10px] font-mono justify-start truncate bg-zinc-900/40 border-border/40"
          >
            <Network className="size-2.5 text-indigo-400 mr-1.5 shrink-0" /> Explain Blast Radius
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDispatch("Verify cryptographic proof seals and generate executive summary")}
            className="h-7 px-2 text-[10px] font-mono justify-start truncate bg-zinc-900/40 border-border/40"
          >
            <Fingerprint className="size-2.5 text-primary mr-1.5 shrink-0" /> Verify Cryptographic Seals
          </Button>
        </div>
      </div>

      {/* 5 AI EPISTEMIC STATES (PHASE 15 & 18) */}
      <div className="space-y-1.5 p-2.5 rounded-lg border border-border/40 bg-zinc-950/40 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
            <Layers className="size-3 text-primary" /> Epistemic Reasoning Spectrum
          </span>
          <div className="flex items-center gap-1">
            {["ALL", "FACT", "OBSERVATION", "INFERENCE", "HYPOTHESIS", "RECOMMENDATION"].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={selectedEpistemic === st ? "default" : "ghost"}
                onClick={() => setSelectedEpistemic(st)}
                className="h-5 px-1 text-[9px] font-mono"
              >
                {st === "ALL" ? "All" : st.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1 pt-1 max-h-32 overflow-y-auto">
          {EPISTEMIC_INSIGHTS.filter(
            (ins) => selectedEpistemic === "ALL" || ins.state === selectedEpistemic,
          ).map((ins) => (
            <div
              key={ins.id}
              onClick={() => handleDispatch(`[Epistemic State: ${ins.state}] ${ins.text}`)}
              className="p-1.5 rounded bg-zinc-900/50 hover:bg-zinc-900 border border-border/20 cursor-pointer flex items-center justify-between gap-2 text-[11px] transition-colors"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[8px] font-mono shrink-0 px-1 py-0",
                    ins.state === "FACT" && "text-blue-400 border-blue-500/30 bg-blue-500/10",
                    ins.state === "OBSERVATION" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                    ins.state === "INFERENCE" && "text-purple-400 border-purple-500/30 bg-purple-500/10",
                    ins.state === "HYPOTHESIS" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                    ins.state === "RECOMMENDATION" && "text-primary border-primary/30 bg-primary/10",
                  )}
                >
                  {ins.state}
                </Badge>
                <span className="truncate text-foreground/90">{ins.text}</span>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground shrink-0">
                {Math.round(ins.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* INLINE QUERY INPUT */}
      <div className="flex gap-1.5 pt-1">
        <input
          type="text"
          placeholder="Ask Copilot with active dashboard context..."
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && quickInput && handleDispatch(quickInput)}
          className="flex-1 bg-zinc-900 border border-border/50 rounded-md px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button
          size="sm"
          onClick={() => quickInput && handleDispatch(quickInput)}
          className="h-7 px-2.5 bg-primary text-primary-foreground text-xs"
        >
          <Send className="size-3" />
        </Button>
      </div>
    </div>
  );
}
