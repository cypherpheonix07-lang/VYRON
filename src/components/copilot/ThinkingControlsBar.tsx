/**
 * VYRON — COPILOT THINKING CONTROLS BAR (GOD MODE vNEXT)
 * Directives: 63-92, 120-150, 151-179, 239-267, 1921-1929
 *
 * System-level control surface exposed above the message composer:
 * - THINK MODE toggle: OFF / ON / AUTO / DEEP / HIGH-STAKES
 * - DEPTH LEVEL badge & selector: Level 0 (Direct) to Level 5 (High-Stakes)
 * - RESPONSE DETAIL: Concise / Standard / Detailed / Engineering Deep Dive / Full Evidence Report
 * - ACTIVE SPECIALIST AGENT: with dynamic CAN vs CANNOT capability popover
 * - ACTIVE SKILLS & CONNECTORS counter pills
 *
 * Strictly ZERO SQL.
 */

import React, { useState } from "react";
import {
  Brain,
  Sliders,
  Cpu,
  Shield,
  Layers,
  Sparkles,
  ChevronDown,
  Plug,
  Wrench,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Zap,
} from "lucide-react";
import {
  ThinkingState,
  ThinkingDepthLevel,
  ResponseDetailLevel,
  EvidenceMode,
} from "@/state/copilot/copilotStore";
import { useCopilot } from "@/state/copilot/useCopilot";
import {
  copilotAgentOrchestrator,
  SpecialistAgentType,
} from "@/services/copilot/copilotAgentOrchestrator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThinkingControlsBarProps {
  onOpenSkillBuilder?: (() => void) | undefined;
  onOpenConnectorMarketplace?: (() => void) | undefined;
  className?: string | undefined;
}

export function ThinkingControlsBar({
  onOpenSkillBuilder,
  onOpenConnectorMarketplace,
  className,
}: ThinkingControlsBarProps) {
  const {
    session,
    thinkingMode,
    thinkingDepth,
    responseDetail,
    evidenceMode,
    activeSpecialist,
    activeSkills,
    activeConnectors,
    setThinkingMode,
    setThinkingDepth,
    setResponseDetail,
    setEvidenceMode,
  } = useCopilot();

  const [isAgentPopoverOpen, setIsAgentPopoverOpen] = useState(false);
  const [isDepthPopoverOpen, setIsDepthPopoverOpen] = useState(false);

  const currentSpecialist = (activeSpecialist as SpecialistAgentType) || "DATA_ANALYST";
  const agentBoundary = copilotAgentOrchestrator.getAgentCapabilityBoundary(currentSpecialist);

  const getThinkingModeBadge = () => {
    switch (thinkingMode) {
      case "THINK_DISABLED":
        return { label: "THINK OFF", color: "text-muted-foreground border-border/50 bg-secondary/40" };
      case "THINK_ENABLED":
        return { label: "THINK ON", color: "text-primary border-primary/40 bg-primary/10 font-bold" };
      case "THINK_AUTO":
        return { label: "THINK AUTO", color: "text-blue-400 border-blue-500/40 bg-blue-500/10 font-bold" };
      case "THINK_DEEP":
        return { label: "THINK DEEP", color: "text-violet-400 border-violet-500/40 bg-violet-500/10 font-bold" };
      case "THINK_HIGH_STAKES":
        return { label: "HIGH-STAKES", color: "text-amber-400 border-amber-500/40 bg-amber-500/10 font-black animate-pulse" };
    }
  };

  const depthLabels: Record<ThinkingDepthLevel, { title: string; desc: string }> = {
    0: { title: "Level 0 — Direct", desc: "Fast answer from trusted local memory. Zero delay." },
    1: { title: "Level 1 — Analyze", desc: "Project state inspection, AST conformity & schema check." },
    2: { title: "Level 2 — Investigate", desc: "Targeted retrieval, single specialist routing & evidence." },
    3: { title: "Level 3 — Deep Investigation", desc: "Multi-specialist consensus & contradiction analysis." },
    4: { title: "Level 4 — Engineering Mission", desc: "Multi-step DAG plan, tools, skills, dry runs & approval." },
    5: { title: "Level 5 — High-Stakes", desc: "Strongest cryptographic proof, policy gates & manual sign-off." },
  };

  const modeBadge = getThinkingModeBadge();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-1.5 p-2 rounded-xl bg-background/60 border border-border/40 backdrop-blur-md text-[11px] font-mono",
        className,
      )}
    >
      {/* Left: Think Mode Toggle & Depth Level */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Think Mode Cycler */}
        <button
          onClick={() => {
            const nextMode: Record<ThinkingState, ThinkingState> = {
              THINK_DISABLED: "THINK_ENABLED",
              THINK_ENABLED: "THINK_AUTO",
              THINK_AUTO: "THINK_DEEP",
              THINK_DEEP: "THINK_HIGH_STAKES",
              THINK_HIGH_STAKES: "THINK_DISABLED",
            };
            setThinkingMode(nextMode[thinkingMode]);
          }}
          className={cn(
            "px-2 py-1 rounded-lg border text-[10px] flex items-center gap-1 transition-all cursor-pointer select-none",
            modeBadge.color,
          )}
          title="Toggle Thinking State (OFF -> ON -> AUTO -> DEEP -> HIGH-STAKES)"
        >
          <Brain className="size-3" />
          <span>{modeBadge.label}</span>
        </button>

        {/* Depth Selector Popover */}
        <Popover open={isDepthPopoverOpen} onOpenChange={setIsDepthPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="px-2 py-1 rounded-lg border border-border/50 bg-secondary/50 hover:bg-secondary text-foreground text-[10px] flex items-center gap-1 cursor-pointer"
              title="Select Thinking Depth (Level 0-5)"
            >
              <Sliders className="size-2.5 text-primary" />
              <span className="font-bold">L{thinkingDepth}</span>
              <span className="text-muted-foreground hidden sm:inline">
                {depthLabels[thinkingDepth].title.split("—")[1]?.trim()}
              </span>
              <ChevronDown className="size-2.5 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-72 p-2.5 bg-card/95 backdrop-blur-xl border border-border/80 shadow-xl rounded-xl space-y-1 text-xs"
          >
            <div className="px-2 py-1 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase">
              Thinking Execution Depth (0–5)
            </div>
            {([0, 1, 2, 3, 4, 5] as ThinkingDepthLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setThinkingDepth(lvl);
                  setIsDepthPopoverOpen(false);
                }}
                className={cn(
                  "w-full text-left p-2 rounded-lg transition-all flex flex-col font-mono",
                  thinkingDepth === lvl
                    ? "bg-primary text-primary-foreground font-bold"
                    : "hover:bg-secondary/70 text-foreground",
                )}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span>{depthLabels[lvl].title}</span>
                  {thinkingDepth === lvl && <CheckCircle2 className="size-3" />}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-0.5",
                    thinkingDepth === lvl ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {depthLabels[lvl].desc}
                </span>
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Response Detail Selector */}
        <select
          value={responseDetail}
          onChange={(e) => setResponseDetail(e.target.value as ResponseDetailLevel)}
          className="px-2 py-1 rounded-lg border border-border/50 bg-secondary/50 text-[10px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          title="Response Detail Level"
        >
          <option value="CONCISE">Concise</option>
          <option value="STANDARD">Standard</option>
          <option value="DETAILED">Detailed</option>
          <option value="ENGINEERING_DEEP_DIVE">Deep Dive</option>
          <option value="FULL_EVIDENCE_REPORT">Evidence Report</option>
        </select>
      </div>

      {/* Right: Active Specialist Agent & Capability Preview */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Active Specialist Pill with CAN/CANNOT Popover */}
        <Popover open={isAgentPopoverOpen} onOpenChange={setIsAgentPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="px-2 py-1 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              title="Active Specialist Agent & Capability Boundaries"
            >
              <Cpu className="size-3" />
              <span>{agentBoundary.name.split(" ")[0]}</span>
              <Eye className="size-2.5 opacity-70" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 p-3 bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-xl space-y-2.5 text-xs font-mono"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <div>
                <h4 className="font-bold text-foreground text-xs">{agentBoundary.name}</h4>
                <p className="text-[10px] text-muted-foreground">Authority: {agentBoundary.authority}</p>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                SPECIALIST
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                <CheckCircle2 className="size-2.5" />
                <span>CAN:</span>
              </span>
              <ul className="text-[10px] text-foreground/80 space-y-0.5 list-disc list-inside">
                {agentBoundary.can.slice(0, 3).map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 pt-1 border-t border-border/30">
              <span className="text-[10px] font-bold text-destructive uppercase flex items-center gap-1">
                <XCircle className="size-2.5" />
                <span>CANNOT (Protected Bounds):</span>
              </span>
              <ul className="text-[10px] text-muted-foreground space-y-0.5 list-disc list-inside">
                {agentBoundary.cannot.slice(0, 3).map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </PopoverContent>
        </Popover>

        {/* Skills Counter Button */}
        <button
          onClick={onOpenSkillBuilder}
          className="px-2 py-1 rounded-lg border border-border/50 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1 cursor-pointer"
          title="Manage Active Skills"
        >
          <Layers className="size-2.5 text-indigo-400" />
          <span>{activeSkills.length} Skills</span>
        </button>

        {/* Connectors Counter Button */}
        <button
          onClick={onOpenConnectorMarketplace}
          className="px-2 py-1 rounded-lg border border-border/50 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1 cursor-pointer"
          title="Open Connector Marketplace"
        >
          <Plug className="size-2.5 text-emerald-400" />
          <span>{activeConnectors.length} Connected</span>
        </button>
      </div>
    </div>
  );
}
