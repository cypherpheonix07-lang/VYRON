/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Master Interactive Control Plane Shell (Phase 08)
 * Persistent header, 14-stage navigation, central stage workspace,
 * live understanding visualizer, and contextual AI Copilot dock.
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import {
  Brain,
  Target,
  CheckSquare,
  Layers,
  Server,
  Cpu,
  Database,
  Shield,
  Activity,
  Terminal,
  FileText,
  Sparkles,
  Rocket,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  GitBranch,
  ShieldAlert,
  Sliders,
  Send,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useAiProject } from "@/state/aiProject/aiProjectStore";
import { ProjectLifecycleStage, CopilotMode } from "@/types/aiProjectControlPlane";

// Stage Components (14 Dedicated Workspaces)
import { Stage01IntentWorkspace } from "./stages/Stage01IntentWorkspace";
import { Stage02ProblemWorkspace } from "./stages/Stage02ProblemWorkspace";
import { Stage03RequirementsWorkspace } from "./stages/Stage03RequirementsWorkspace";
import { Stage04ScopeWorkspace } from "./stages/Stage04ScopeWorkspace";
import { Stage05CapabilityWorkspace } from "./stages/Stage05CapabilityWorkspace";
import { Stage06ArchitectureWorkspace } from "./stages/Stage06ArchitectureWorkspace";
import { Stage07TechnologyWorkspace } from "./stages/Stage07TechnologyWorkspace";
import { Stage08DataWorkspace } from "./stages/Stage08DataWorkspace";
import { Stage09AiDesignWorkspace } from "./stages/Stage09AiDesignWorkspace";
import { Stage10SecurityWorkspace } from "./stages/Stage10SecurityWorkspace";
import { Stage11ReliabilityWorkspace } from "./stages/Stage11ReliabilityWorkspace";
import { Stage12ImplementationWorkspace } from "./stages/Stage12ImplementationWorkspace";
import { Stage13TestingWorkspace } from "./stages/Stage13TestingWorkspace";
import { Stage14BlueprintWorkspace } from "./stages/Stage14BlueprintWorkspace";

interface ProjectControlPlaneShellProps {
  onSwitchToClassicWizard?: () => void;
}

const STAGES_CONFIG: Array<{
  id: ProjectLifecycleStage;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "01_INTENT", label: "01 Intent", icon: Brain },
  { id: "02_PROBLEM", label: "02 Problem", icon: Target },
  { id: "03_REQUIREMENTS", label: "03 Requirements", icon: CheckSquare },
  { id: "04_SCOPE", label: "04 Scope", icon: Layers },
  { id: "05_CAPABILITY", label: "05 Capability", icon: Layers },
  { id: "06_ARCHITECTURE", label: "06 Architecture", icon: Server },
  { id: "07_TECHNOLOGY", label: "07 Technology", icon: Cpu },
  { id: "08_DATA", label: "08 Data", icon: Database },
  { id: "09_AI_DESIGN", label: "09 AI/ML", icon: Brain },
  { id: "10_SECURITY", label: "10 Security", icon: Shield },
  { id: "11_RELIABILITY", label: "11 Reliability", icon: Activity },
  { id: "12_IMPLEMENTATION", label: "12 Implementation", icon: Terminal },
  { id: "13_TESTING", label: "13 Testing", icon: CheckSquare },
  { id: "14_BLUEPRINT", label: "14 Blueprint", icon: FileText },
];

export const ProjectControlPlaneShell: React.FC<ProjectControlPlaneShellProps> = ({
  onSwitchToClassicWizard,
}) => {
  const {
    state,
    copilotMode,
    isExecuting,
    executionStatus,
    providerPreference,
    setProviderPreference,
    setActiveStage,
    setCopilotMode,
    executeStage,
    executeFullPipeline,
    approveProposal,
    rejectProposal,
    updateIntent,
    nextBestAction,
  } = useAiProject();

  const [copilotInput, setCopilotInput] = useState("");
  const [isCopilotDockOpen, setIsCopilotDockOpen] = useState(true);

  const handleApplyTemplate = (type: "saas" | "fintech" | "health" | "ai") => {
    switch (type) {
      case "saas":
        updateIntent({
          projectName: "Apex Enterprise SaaS",
          slug: "apex-enterprise-saas",
          domain: "Software Engineering",
          naturalLanguageIntent:
            "A high-availability multi-tenant enterprise workflow and analytics platform with strict role-based access control, SOC2 audit logging, and automated tenant partitioning.",
        });
        break;
      case "fintech":
        updateIntent({
          projectName: "Vanguard Payment Gateway",
          slug: "vanguard-payment-gateway",
          domain: "Fintech",
          naturalLanguageIntent:
            "A PCI-DSS compliant payment processing mesh with distributed ledger reconciliation, sub-100ms authorization latency, and idempotent retry semantics.",
        });
        break;
      case "health":
        updateIntent({
          projectName: "Vitalis Telemetry Hub",
          slug: "vitalis-telemetry-hub",
          domain: "Healthcare",
          naturalLanguageIntent:
            "A HIPAA-compliant real-time medical device telemetry processor with end-to-end payload encryption, immutable audit lineage, and FHIR API interoperability.",
        });
        break;
      case "ai":
        updateIntent({
          projectName: "Cortex Agent Mesh",
          slug: "cortex-agent-mesh",
          domain: "AI / ML",
          naturalLanguageIntent:
            "An autonomous multi-agent cognitive control plane coordinating specialized LLM agents with dual-provider routing, anti-prompt injection barriers, and deterministic state validation.",
        });
        break;
    }
  };

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    const text = copilotInput.trim();
    setCopilotInput("");

    if (text.startsWith("/requirements")) {
      setActiveStage("03_REQUIREMENTS");
      executeStage("03_REQUIREMENTS");
    } else if (text.startsWith("/architecture")) {
      setActiveStage("06_ARCHITECTURE");
      executeStage("06_ARCHITECTURE");
    } else if (text.startsWith("/security")) {
      setActiveStage("10_SECURITY");
      executeStage("10_SECURITY");
    } else if (text.startsWith("/validate") || text.startsWith("/challenge")) {
      setActiveStage("14_BLUEPRINT");
      executeStage("14_BLUEPRINT");
    } else {
      executeStage(state.activeStage, text);
    }
  };

  const renderActiveStageComponent = () => {
    switch (state.activeStage) {
      case "01_INTENT":
        return <Stage01IntentWorkspace />;
      case "02_PROBLEM":
        return <Stage02ProblemWorkspace />;
      case "03_REQUIREMENTS":
        return <Stage03RequirementsWorkspace />;
      case "04_SCOPE":
        return <Stage04ScopeWorkspace />;
      case "05_CAPABILITY":
        return <Stage05CapabilityWorkspace />;
      case "06_ARCHITECTURE":
        return <Stage06ArchitectureWorkspace />;
      case "07_TECHNOLOGY":
        return <Stage07TechnologyWorkspace />;
      case "08_DATA":
        return <Stage08DataWorkspace />;
      case "09_AI_DESIGN":
        return <Stage09AiDesignWorkspace />;
      case "10_SECURITY":
        return <Stage10SecurityWorkspace />;
      case "11_RELIABILITY":
        return <Stage11ReliabilityWorkspace />;
      case "12_IMPLEMENTATION":
        return <Stage12ImplementationWorkspace />;
      case "13_TESTING":
        return <Stage13TestingWorkspace />;
      case "14_BLUEPRINT":
        return <Stage14BlueprintWorkspace />;
      default:
        return <Stage01IntentWorkspace />;
    }
  };

  const getStageStatusBadge = (stageId: ProjectLifecycleStage) => {
    const status = state.stageStatuses[stageId] || "not_started";
    switch (status) {
      case "complete":
        return <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" title="Complete" />;
      case "in_progress":
        return <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" title="In Progress" />;
      case "stale":
        return <span className="h-2 w-2 rounded-full bg-orange-400 shrink-0" title="Stale" />;
      case "blocked":
        return <span className="h-2 w-2 rounded-full bg-rose-400 shrink-0" title="Blocked" />;
      default:
        return <span className="h-2 w-2 rounded-full bg-muted-foreground/30 shrink-0" title="Not Started" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Persistent Control Plane Header */}
      <div className="p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                CONTROL PLANE v2
              </span>
              <h1 className="text-xl font-bold tracking-tight text-foreground">{state.name}</h1>
              <Badge variant="outline" className="text-xs font-mono border-border/60">
                {state.slug}
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-bold">
                MATURITY: {state.maturity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Autonomous AI Engineering Environment • 14 Lifecycle Stages • Deterministic Control Plane Governance
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Next Best Action Chip */}
            {nextBestAction && (
              <button
                type="button"
                onClick={() => {
                  setActiveStage(nextBestAction.stage);
                  executeStage(nextBestAction.stage);
                }}
                className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-medium flex items-center gap-1.5 hover:bg-cyan-500/20 transition-all shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                <span>Next: {nextBestAction.title}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}

            {/* Run Full Pipeline CTA */}
            <Button
              size="sm"
              onClick={executeFullPipeline}
              disabled={isExecuting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs gap-1.5 shadow-lg shadow-cyan-500/25"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
              Run Full AI Pipeline
            </Button>

            {/* Switch to Classic Wizard (Backward Compatibility) */}
            {onSwitchToClassicWizard && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSwitchToClassicWizard}
                className="text-xs border-border/60 text-muted-foreground hover:text-foreground"
              >
                <Sliders className="h-3.5 w-3.5 mr-1" />
                Classic Wizard
              </Button>
            )}
          </div>
        </div>

        {/* Live Gauges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2 border-t border-border/40 text-xs">
          <div>
            <div className="flex justify-between text-muted-foreground text-[11px] mb-1">
              <span>Completeness</span>
              <span className="font-bold text-foreground">{state.understanding.completeness}%</span>
            </div>
            <Progress value={state.understanding.completeness} className="h-1.5 bg-background/50" />
          </div>

          <div>
            <div className="flex justify-between text-muted-foreground text-[11px] mb-1">
              <span>Confidence</span>
              <span className="font-bold text-foreground">{state.understanding.confidence}%</span>
            </div>
            <Progress value={state.understanding.confidence} className="h-1.5 bg-background/50" />
          </div>

          <div>
            <div className="flex justify-between text-muted-foreground text-[11px] mb-1">
              <span>Readiness</span>
              <span className="font-bold text-emerald-400">{state.understanding.readiness}%</span>
            </div>
            <Progress value={state.understanding.readiness} className="h-1.5 bg-background/50" />
          </div>

          <div className="flex items-center gap-2 pl-2">
            <span className="font-bold text-emerald-400 font-mono text-sm">{state.understanding.knownCount}</span>
            <span className="text-[11px] text-muted-foreground">Knowns</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400 font-mono text-sm">{state.understanding.assumptionsCount}</span>
            <span className="text-[11px] text-muted-foreground">Assumptions</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-rose-400 font-mono text-sm">{state.understanding.conflictsCount}</span>
            <span className="text-[11px] text-muted-foreground">Conflicts</span>
          </div>
        </div>

        {/* AI Provider Controls & Health Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/40 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              Provider Fabric:
            </span>
            <select
              value={providerPreference}
              onChange={(e) =>
                setProviderPreference(
                  e.target.value as "auto" | "openrouter" | "openai" | "deterministic",
                )
              }
              className="bg-background/80 border border-border/80 rounded-lg px-2.5 py-1 text-xs text-foreground font-medium cursor-pointer hover:border-border transition-colors"
            >
              <option value="auto">Auto Router (Task-Taxonomy Dynamic)</option>
              <option value="openrouter">OpenRouter Hub (Claude 3.5 Sonnet / Multi-Model)</option>
              <option value="openai">OpenAI Direct (GPT-4o / Structured Output)</option>
              <option value="deterministic">Offline Deterministic Engine (Zero API Outage)</option>
            </select>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-emerald-500/40 text-emerald-400 bg-emerald-500/10 flex items-center gap-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected (12ms)
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
            <div>
              Active Model:{" "}
              <span className="text-foreground font-semibold">
                {providerPreference === "openai"
                  ? "gpt-4o-mini"
                  : providerPreference === "deterministic"
                  ? "vyron-compiler-v2"
                  : "anthropic/claude-3.5-sonnet"}
              </span>
            </div>
            <div className="border-l border-border/60 pl-3">
              Daily Spend: <span className="text-emerald-400 font-bold">$0.0005</span> / $5.00 limit
            </div>
          </div>
        </div>

        {/* Quick Baseline Templates */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/30 text-[11px]">
          <span className="text-muted-foreground font-medium shrink-0">Quick Baseline:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleApplyTemplate("saas")}
              className="px-2 py-0.5 rounded bg-background/50 border border-border/60 text-muted-foreground hover:text-cyan-300 hover:border-cyan-500/40 transition-all text-[10px]"
            >
              Enterprise SaaS
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate("fintech")}
              className="px-2 py-0.5 rounded bg-background/50 border border-border/60 text-muted-foreground hover:text-cyan-300 hover:border-cyan-500/40 transition-all text-[10px]"
            >
              Fintech Gateway
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate("health")}
              className="px-2 py-0.5 rounded bg-background/50 border border-border/60 text-muted-foreground hover:text-cyan-300 hover:border-cyan-500/40 transition-all text-[10px]"
            >
              Healthcare HIPAA
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate("ai")}
              className="px-2 py-0.5 rounded bg-background/50 border border-border/60 text-muted-foreground hover:text-cyan-300 hover:border-cyan-500/40 transition-all text-[10px]"
            >
              AI Agent Mesh
            </button>
          </div>
        </div>
      </div>

      {/* Execution status toast-like banner */}
      {isExecuting && (
        <div className="p-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-xs text-cyan-300 flex items-center gap-2.5 animate-pulse">
          <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
          <span className="font-medium">{executionStatus || "Executing specialized engineering agent..."}</span>
        </div>
      )}

      {/* 2. Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: 14 Stage Navigation */}
        <div className="lg:col-span-3 space-y-2 p-3 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md">
          <div className="px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Engineering Lifecycle Stages
          </div>

          <nav className="space-y-1">
            {STAGES_CONFIG.map((stage) => {
              const Icon = stage.icon;
              const isActive = state.activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/80 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-muted-foreground"}`} />
                    <span>{stage.label}</span>
                  </div>
                  {getStageStatusBadge(stage.id)}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center: Stage Workspace Canvas */}
        <div className="lg:col-span-6 space-y-6">{renderActiveStageComponent()}</div>

        {/* Right Sidebar: Contextual AI Copilot & Understanding Dock */}
        <div className="lg:col-span-3 space-y-4">
          {/* AI Copilot Card */}
          <div className="p-4 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-bold text-foreground">Contextual AI Copilot</span>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-mono border-purple-500/40 text-purple-300">
                {copilotMode}
              </Badge>
            </div>

            {/* 6 Copilot Modes */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-medium">
              {(["GUIDE", "ANALYZE", "BUILD", "CHALLENGE", "EXPLAIN", "VALIDATE"] as CopilotMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCopilotMode(mode)}
                  className={`py-1 rounded text-center transition-all ${
                    copilotMode === mode
                      ? "bg-purple-600 text-white font-bold"
                      : "bg-background/40 text-muted-foreground hover:text-foreground border border-border/40"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Pending Proposals Queue */}
            {state.pendingProposals.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                  <span>Pending Architecture Proposals</span>
                  <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
                    {state.pendingProposals.length}
                  </Badge>
                </div>

                {state.pendingProposals.map((prop) => (
                  <div key={prop.id} className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-2 text-xs">
                    <div className="font-semibold text-foreground">{prop.title}</div>
                    <p className="text-[11px] text-muted-foreground">{prop.description}</p>

                    {/* Diff Preview */}
                    <div className="p-2 rounded bg-background/60 border border-border/50 text-[10px] font-mono space-y-0.5">
                      {prop.diffSummary.added.map((a, i) => (
                        <div key={i} className="text-emerald-400">+ {a}</div>
                      ))}
                      {prop.diffSummary.modified.map((m, i) => (
                        <div key={i} className="text-amber-400">~ {m}</div>
                      ))}
                      {prop.diffSummary.stale.map((s, i) => (
                        <div key={i} className="text-rose-400">! Stale: {s}</div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => approveProposal(prop.id)}
                        className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex-1"
                      >
                        Approve Diff
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectProposal(prop.id)}
                        className="h-6 text-[10px] text-muted-foreground hover:text-foreground flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Slash Command Input */}
            <form onSubmit={handleCopilotSubmit} className="space-y-2 pt-2 border-t border-border/40">
              <div className="relative">
                <Input
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  placeholder="Ask copilot or type /requirements, /architecture..."
                  className="bg-background/60 border-border/70 text-xs pr-8 h-8"
                />
                <button
                  type="submit"
                  disabled={!copilotInput.trim() || isExecuting}
                  className="absolute right-1.5 top-1.5 p-1 text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5 text-purple-400" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground font-mono">
                <span className="cursor-pointer hover:text-cyan-300" onClick={() => setCopilotInput("/requirements ")}>/requirements</span>
                <span className="cursor-pointer hover:text-cyan-300" onClick={() => setCopilotInput("/architecture ")}>/architecture</span>
                <span className="cursor-pointer hover:text-cyan-300" onClick={() => setCopilotInput("/validate ")}>/validate</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
