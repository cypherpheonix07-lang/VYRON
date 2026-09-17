/**
 * PROJECT BRAHMA / VYRON — FULLSCREEN COPILOT INTELLIGENCE STUDIO (PHASE 20)
 * Dedicated command center for Vyron AI Copilot.
 * Integrates 8 Studio Experience Modes:
 * CHAT | INVESTIGATION | MISSION | ARCHITECTURE | RELEASE | SIMULATION | DECISION | EVIDENCE
 *
 * Cognitive Multi-Pane Layout:
 * - Top: Studio Experience Mode Bar & Intent Scope
 * - Left: Conversational Stream with Epistemic & Intent Badges
 * - Right: Cognitive Inspector (Plan, Reasoning Trace, Multi-Model Deliberation, Release Readiness, ADRs, Missions, Drift, Tools, Agents, Memory, Context, Actions)
 *
 * Strictly ZERO SQL.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Send,
  Trash2,
  Activity,
  Layers,
  Wrench,
  Users,
  Brain,
  Cpu,
  History,
  Shield,
  AlertTriangle,
  Play,
  Check,
  X,
  Target,
  Compass,
  Zap,
  GitPullRequest,
  BookOpen,
  FileCheck2,
  Scale,
  GitFork,
  ArrowRight,
  Plug,
} from "lucide-react";
import { useCopilot } from "@/state/copilot/useCopilot";
import { AIModelType, CopilotAction, copilotStore, StudioExperienceMode } from "@/state/copilot/copilotStore";
import { copilotContextEngine, CopilotLiveContext } from "@/services/copilot/copilotContextEngine";
import { copilotActionEngine, ActionInvocation, ActionType } from "@/services/copilot/copilotActionEngine";
import { copilotToolRegistry, CopilotToolDef } from "@/services/copilot/copilotToolRegistry";
import { copilotAgentOrchestrator, SpecialistAgentType, AgentDescriptor } from "@/services/copilot/copilotAgentOrchestrator";
import { copilotMemory, MemoryEntry } from "@/services/copilot/copilotMemory";
import { copilotPlanner, DynamicExecutionPlan } from "@/services/copilot/copilotPlanner";
import { copilotExecutionEngine } from "@/services/copilot/copilotExecutionEngine";
import { copilotDispatcher } from "@/services/copilot/copilotDispatcher";
import { copilotRealtimeListener } from "@/services/copilot/copilotRealtimeListener";
import { copilotReasoningGraph, UserVisibleReasoningTrace } from "@/services/copilot/copilotReasoningGraph";
import { copilotDecisionEngine, ArchitectureDecisionRecord } from "@/services/copilot/copilotDecisionEngine";
import { copilotReleaseIntelligence, ReleaseReadinessAudit } from "@/services/copilot/copilotReleaseIntelligence";
import { openRouterDynamicRegistry, MultiModelDeliberationResult } from "@/services/ai/openRouterDynamicRegistry";
import { ProactiveInsightsBanner } from "@/components/copilot/ProactiveInsightsBanner";
import { missionEngine, EngineeringMission } from "@/services/missions/missionEngine";
import { architectureDriftEngine, DriftFinding } from "@/services/intelligence/driftEngine";
import { ThinkingControlsBar } from "./ThinkingControlsBar";
import { ExactAnswerCard } from "./ExactAnswerCard";
import { SkillBuilderModal } from "./SkillBuilderModal";
import { ConnectorMarketplaceView } from "./ConnectorMarketplaceView";
import { ActionPreviewModal } from "./ActionPreviewModal";
import { ActionPreviewPayload } from "@/services/connectors/connectorFabric";
import { skillRegistry, GovernedSkill } from "@/services/skills";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CopilotFullScreenStudio() {
  const {
    mode,
    session,
    messages,
    isLoading,
    activeModel,
    activeSpecialist,
    setModel,
    addAssistantMessage,
    clearMessages,
  } = useCopilot();

  const [inputText, setInputText] = useState("");
  const [studioMode, setStudioModeState] = useState<StudioExperienceMode>("CHAT");
  const [activeInspectorTab, setActiveInspectorTab] = useState<
    | "plan"
    | "trace"
    | "deliberation"
    | "release"
    | "decisions"
    | "missions"
    | "drift"
    | "tools"
    | "agents"
    | "skills"
    | "connectors"
    | "memory"
    | "context"
    | "actions"
  >("plan");
  const [isSkillBuilderOpen, setIsSkillBuilderOpen] = useState(false);
  const [previewAction, setPreviewAction] = useState<ActionPreviewPayload | null>(null);

  const [liveContext, setLiveContext] = useState<CopilotLiveContext | null>(null);
  const [activePlan, setActivePlan] = useState<DynamicExecutionPlan | null>(() => session.activePlan || null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecutingPlan, setIsExecutingPlan] = useState(false);
  const [actionHistory, setActionHistory] = useState<ActionInvocation[]>([]);
  const [pendingApproval, setPendingApproval] = useState<ActionInvocation | null>(null);
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([]);
  const [delegatingAgent, setDelegatingAgent] = useState<SpecialistAgentType | null>(null);
  const [missionsList, setMissionsList] = useState<EngineeringMission[]>([]);
  const [driftFindings, setDriftFindings] = useState<DriftFinding[]>([]);
  const [driftSummary, setDriftSummary] = useState({
    overallDriftScore: 100,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
  });
  const [decisionsList, setDecisionsList] = useState<ArchitectureDecisionRecord[]>([]);
  const [releaseAudit, setReleaseAudit] = useState<ReleaseReadinessAudit | null>(null);
  const [activeDeliberation, setActiveDeliberation] = useState<MultiModelDeliberationResult | null>(null);
  const [latestReasoningTrace, setLatestReasoningTrace] = useState<UserVisibleReasoningTrace | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const refreshAllState = () => {
    setLiveContext(copilotContextEngine.assembleContext());
    setMemoryEntries(copilotMemory.listMemories(mode));
    setMissionsList(missionEngine.getMissions());
    const drift = architectureDriftEngine.evaluateDrift();
    setDriftFindings(drift.findings);
    setDriftSummary(drift.summary);
    setDecisionsList(copilotDecisionEngine.listDecisions());
    setReleaseAudit(copilotReleaseIntelligence.evaluateReleaseReadiness());
    const latestTrace = copilotReasoningGraph.getLatestTrace();
    if (latestTrace) setLatestReasoningTrace(latestTrace.userVisibleTrace);
  };

  useEffect(() => {
    copilotRealtimeListener.initialize();
    refreshAllState();
  }, [mode]);

  useEffect(() => {
    return copilotActionEngine.subscribe((actions) => {
      setActionHistory(actions);
      const pending = actions.find((a) => a.status === "PENDING_APPROVAL");
      setPendingApproval(pending || null);
    });
  }, []);

  useEffect(() => {
    return copilotRealtimeListener.subscribeToStream((event) => {
      if (event.type === "REASONING_SUMMARY") {
        setLatestReasoningTrace(event.payload as UserVisibleReasoningTrace);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleStudioModeSelect = (newMode: StudioExperienceMode) => {
    setStudioModeState(newMode);
    copilotStore.setStudioMode(newMode);

    // Auto-switch inspector tab to relevant domain
    if (newMode === "RELEASE") setActiveInspectorTab("release");
    else if (newMode === "DECISION") setActiveInspectorTab("decisions");
    else if (newMode === "ARCHITECTURE") setActiveInspectorTab("drift");
    else if (newMode === "MISSION") setActiveInspectorTab("missions");
    else if (newMode === "INVESTIGATION") setActiveInspectorTab("trace");
    else if (newMode === "EVIDENCE") setActiveInspectorTab("release");
    else if (newMode === "SIMULATION") setActiveInspectorTab("actions");
    else if (newMode === "SKILL_BUILDER") setIsSkillBuilderOpen(true);
    else if (newMode === "CONNECTOR_MANAGER") setActiveInspectorTab("connectors");
    else if (newMode === "THINK") setActiveInspectorTab("trace");
    else if (newMode === "SECURITY") setActiveInspectorTab("tools");
    else if (newMode === "REQUIREMENTS") setActiveInspectorTab("decisions");
    else if (newMode === "DATA") setActiveInspectorTab("tools");
    else setActiveInspectorTab("plan");
  };

  const handleSend = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const text = (promptOverride || inputText).trim();
    if (!text || isLoading) return;

    if (!promptOverride) setInputText("");

    await copilotDispatcher.dispatch(text, {
      mode,
      modelOverride: activeModel,
      onPlanCreated: (plan) => {
        setActivePlan(plan);
        setActiveInspectorTab("plan");
        setIsExecutingPlan(true);
      },
    });
    setIsExecutingPlan(false);
    refreshAllState();
  };

  const handleRunDeliberation = async () => {
    toast.loading("Running Multi-Model Consensus Deliberation...", { id: "delib" });
    try {
      const result = await openRouterDynamicRegistry.conductMultiModelDeliberation({
        objective: "Evaluate settlement dynamic query concatenation risk and remediation",
      });
      setActiveDeliberation(result);
      setActiveInspectorTab("deliberation");
      toast.dismiss("delib");
      toast.success(`Consensus achieved with ${result.agreementPercentage}% agreement`);
    } catch {
      toast.dismiss("delib");
      toast.error("Deliberation execution failed.");
    }
  };

  const handleGeneratePlan = async () => {
    setIsPlanning(true);
    try {
      const plan = copilotPlanner.formulatePlan(
        "Autonomous 12-stage validation and IQR anomaly audit",
        mode,
        liveContext?.dataset.name,
      );
      setActivePlan(plan);
      copilotStore.setActivePlan(mode, plan);
      toast.success("Synthesized dynamic 4-stage execution plan.");
    } catch {
      toast.error("Plan synthesis failed.");
    } finally {
      setIsPlanning(false);
    }
  };

  const handleExecuteActivePlan = async () => {
    if (!activePlan || isExecutingPlan) return;
    setIsExecutingPlan(true);
    try {
      await copilotExecutionEngine.executePlan(activePlan, mode);
      toast.success("Plan execution complete.");
    } catch (err: unknown) {
      toast.error(`Execution error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsExecutingPlan(false);
    }
  };

  const handleDelegateToAgent = async (agent: AgentDescriptor) => {
    setDelegatingAgent(agent.type);
    try {
      const taskObjective = `Perform bounded analysis on current dataset (${liveContext?.dataset.name || "active partition"})`;
      const res = await copilotAgentOrchestrator.delegateTask({
        agentType: agent.type,
        taskObjective,
        contextPayload: { dataset: liveContext?.dataset, runId: liveContext?.analysis.runId },
        mode,
      });

      addAssistantMessage(
        `**[Delegated to ${agent.name}]**\n\n${res.summary}\n\n• **Recommendations**:\n${res.recommendations.map((r) => `  - ${r}`).join("\n")}`,
        {
          citations: res.citations,
          verificationHash: res.verificationHash,
          reasoningDurationMs: res.durationMs,
        },
      );
      toast.success(`Received structured report from ${agent.name}`);
    } catch (err: unknown) {
      toast.error(`Delegation failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDelegatingAgent(null);
    }
  };

  const handleExecuteTool = async (tool: CopilotToolDef) => {
    try {
      const res = await copilotToolRegistry.executeTool(tool.id, {}, { mode });
      if (res.status === "SUCCESS") {
        toast.success(`Tool ${tool.name} executed.`);
        addAssistantMessage(
          `**Executed Tool:** \`${tool.name}\`\n\n\`\`\`json\n${JSON.stringify(res.output, null, 2)}\n\`\`\``,
          { verificationHash: res.verificationHash },
        );
      } else {
        toast.error(`Tool execution ${res.status}: ${res.errorMessage || "Unknown error"}`);
      }
    } catch (err: unknown) {
      toast.error(`Tool failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleExecuteSuggestedAction = async (action: { id: string; label: string; actionType: string }) => {
    toast.loading(`Executing action: ${action.label}...`, { id: "exec-action" });
    try {
      let type: ActionType = "RUN_ANALYSIS";
      let params: Record<string, unknown> = {};

      if (action.actionType === "DETECT_ARCHITECTURE_DRIFT") {
        type = "DETECT_ARCHITECTURE_DRIFT";
        params = { projectId: liveContext?.project.id || "proj-brahma", saveSnapshot: true };
      } else if (action.actionType === "ANALYZE_CHANGE_IMPACT") {
        type = "ANALYZE_CHANGE_IMPACT";
        params = { changedFile: "src/services/settlementEngine.ts" };
      } else if (action.actionType === "START_ENGINEERING_MISSION") {
        type = "START_ENGINEERING_MISSION";
        params = { title: "Pre-Release Verification Mission", objective: "Audit drift, security findings, and release gates" };
      } else if (action.actionType === "EVALUATE_ENGINEERING_POLICIES") {
        type = "EVALUATE_ENGINEERING_POLICIES";
        params = { releaseCandidate: "rc-2.0" };
      } else if (action.actionType === "COMPARE_TIME_MACHINE_SNAPSHOTS") {
        type = "COMPARE_TIME_MACHINE_SNAPSHOTS";
        params = { baseSnapshotId: "snap-baseline", targetSnapshotId: "snap-regression" };
      } else if (action.actionType === "RUN_SIMULATION_SCENARIO") {
        type = "RUN_SIMULATION_SCENARIO";
        params = { scenarioId: "SCENARIO_01_DRIFT" };
      } else if (action.actionType === "RESET_DEMO") {
        type = "RESET_DEMO";
      } else if (action.actionType === "VALIDATE_DATASET") {
        type = "VALIDATE_DATASET";
        params = { datasetId: liveContext?.dataset.id || "ieee_fraud_benchmark" };
      } else {
        type = "RUN_ANALYSIS";
        params = { speedMultiplier: 1.5 };
      }

      const res = await copilotActionEngine.dispatchAction(
        type,
        action.label,
        `Action dispatched from Copilot conversation`,
        params,
        mode,
        false,
      );

      toast.dismiss("exec-action");
      if (res.status === "CONFIRMED" || res.status === "EXECUTING") {
        toast.success(`Action executed: ${action.label}`);
        addAssistantMessage(
          `**Action Executed:** \`${action.label}\`\n\n\`\`\`json\n${JSON.stringify(res.result, null, 2)}\n\`\`\``,
          { verificationHash: res.verificationHash }
        );
      } else if (res.status === "PENDING_APPROVAL") {
        toast.info("Action requires operator authorization before execution.");
      } else {
        toast.error(`Action ${res.status}: ${res.errorMessage || "Execution halted"}`);
      }
    } catch (err: unknown) {
      toast.dismiss("exec-action");
      toast.error(`Action failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Tailored Suggested Prompts based on Studio Experience Mode
  const getSuggestedPrompts = () => {
    switch (studioMode) {
      case "RELEASE":
        return [
          "Evaluate 7 Core Release Questions",
          "What failed in the release policies?",
          "Calculate direct and transitive blast radius",
          "Check release blocking violations",
        ];
      case "ARCHITECTURE":
        return [
          "Run Architecture Drift Detection",
          "Inspect AST cyclomatic complexity (Lizard CCN)",
          "Audit microservice boundary conformity",
          "Get canonical ATLAS knowledge graph",
        ];
      case "INVESTIGATION":
        return [
          "Investigate root cause of settlement concatenation",
          "Isolate transaction velocity anomaly clusters",
          "Trace Bandit CWE-89 security evidence",
        ];
      case "DECISION":
        return [
          "Evaluate decaying architecture decisions",
          "Inspect ADR-001 Parameterized Query Abstraction",
          "Draft ADR for strict DAO boundary enforcement",
        ];
      case "SIMULATION":
        return [
          "Inject 2x transaction surge in simulation lab",
          "Simulate gateway failure with settlement isolated",
          "Reset demo simulation to pristine baseline",
        ];
      case "EVIDENCE":
        return [
          "Audit cryptographic evidence chain",
          "Check expiring SOC2 / PCI-DSS proofs",
          "Verify tamper-evident SHA-256 seals",
        ];
      case "MISSION":
        return [
          "Launch Release Verification Mission",
          "Execute end-to-end drift and security audit",
          "Track autonomous mission step progress",
        ];
      default:
        return mode === "NORMAL"
          ? [
              "Explain active pipeline risk factors",
              "Inspect contract schema conformity",
              "Review critical Bandit security findings",
              "Run Multi-Model Consensus Deliberation",
            ]
          : [
              "Explain the synthetic FinLedger scenario",
              "Inject 5 high-velocity anomaly deviations",
              "Analyze IQR outlier distribution",
              "Reset demo simulation to baseline",
            ];
    }
  };

  const experienceModes: Array<{ id: StudioExperienceMode; label: string; icon: React.ElementType }> = [
    { id: "CHAT", label: "Chat", icon: Bot },
    { id: "INVESTIGATION", label: "Investigation", icon: Compass },
    { id: "THINK", label: "Think", icon: Brain },
    { id: "MISSION", label: "Mission", icon: Target },
    { id: "ARCHITECTURE", label: "Architecture", icon: GitFork },
    { id: "REQUIREMENTS", label: "Requirements", icon: BookOpen },
    { id: "SECURITY", label: "Security", icon: Shield },
    { id: "DATA", label: "Data", icon: Layers },
    { id: "RELEASE", label: "Release", icon: GitPullRequest },
    { id: "SIMULATION", label: "Simulation", icon: Zap },
    { id: "DECISION", label: "Decision", icon: Scale },
    { id: "EVIDENCE", label: "Evidence", icon: FileCheck2 },
    { id: "SKILL_BUILDER", label: "Skills", icon: Wrench },
    { id: "CONNECTOR_MANAGER", label: "Connectors", icon: Plug },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Studio Header */}
      <div className="p-4 border-b border-border/50 bg-background/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2.5 rounded-xl border flex items-center justify-center",
                mode === "DEMO"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-primary/10 border-primary/30 text-primary",
              )}
            >
              {mode === "DEMO" ? <Sparkles className="size-5" /> : <Bot className="size-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-foreground">
                  {mode === "DEMO" ? "Vyron Demo Copilot Studio" : "Vyron Cognitive Engineering Studio"}
                </h2>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-mono px-2 py-0.5",
                    mode === "DEMO"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : "bg-primary/10 text-primary border-primary/30",
                  )}
                >
                  {mode === "DEMO" ? "DEMO SIMULATION" : "PRODUCTION GOVERNED"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Cognitive Operating Layer connecting Engineering Signals • ATLAS • Reasoning • Simulation • Action
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRunDeliberation}
              className="h-8 text-xs font-mono gap-1.5 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold"
            >
              <Scale className="size-3.5" />
              <span>Multi-Model Deliberation</span>
            </Button>

            {/* Model Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-mono">Engine:</span>
              <select
                value={activeModel}
                onChange={(e) => setModel(e.target.value as AIModelType)}
                className="text-xs rounded-lg bg-secondary/80 border border-border/60 text-foreground px-2 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="OPENROUTER_AUTO">OpenRouter (8 Dynamic Families)</option>
                <option value="OPENAI_GPT4O">OpenAI GPT-4o</option>
                <option value="CLAUDE_SONNET">Claude 3.7 Sonnet</option>
                <option value="KIMI_K3">Kimi K3 MoE</option>
                <option value="MOCK_DETERMINISTIC">Deterministic Mock</option>
              </select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              title="Clear conversation history"
              className="size-8 text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        {/* 8 Studio Experience Mode Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
          <span className="text-[11px] font-mono text-muted-foreground mr-1.5 uppercase font-bold">Modes:</span>
          {experienceModes.map((m) => {
            const Icon = m.icon;
            const isActive = studioMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleStudioModeSelect(m.id)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 border border-primary/40"
                    : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40",
                )}
              >
                <Icon className="size-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-border/50">
        {/* Left Column: Chat Conversation Stream (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden h-full">
          {/* Proactive Recommendation Strip */}
          <div className="p-3 border-b border-border/30 bg-background/40">
            <ProactiveInsightsBanner maxItems={1} />
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col space-y-1.5 max-w-[88%]",
                  msg.sender === "USER"
                    ? "ml-auto items-end"
                    : msg.sender === "SYSTEM"
                      ? "mx-auto items-center max-w-[95%]"
                      : "mr-auto items-start",
                )}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                  {msg.sender === "USER" ? (
                    <span>You</span>
                  ) : msg.sender === "SYSTEM" ? (
                    <span className="text-primary font-bold">System Event</span>
                  ) : (
                    <>
                      <Sparkles className="size-3 text-primary" />
                      <span>{msg.metadata?.model || "Vyron AI"}</span>
                    </>
                  )}
                  {msg.metadata?.intent && (
                    <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                      {msg.metadata.intent}
                    </Badge>
                  )}
                  <span>•</span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div
                  className={cn(
                    "p-4 rounded-2xl text-xs leading-relaxed transition-all",
                    msg.sender === "USER"
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/20"
                      : msg.sender === "SYSTEM"
                        ? "bg-primary/10 border border-primary/30 text-foreground text-center rounded-xl font-mono"
                        : "bg-secondary/70 text-foreground border border-border/50 rounded-tl-none shadow-sm",
                  )}
                >
                  {msg.sender === "ASSISTANT" && msg.metadata?.exactAnswer ? (
                    <ExactAnswerCard
                      exactAnswer={msg.metadata.exactAnswer}
                      fallbackText={msg.text}
                      agentName={msg.metadata.activeSpecialistAgent}
                      onExecuteAction={handleExecuteSuggestedAction}
                    />
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {msg.metadata?.citations && msg.metadata.citations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-border/30">
                          {msg.metadata.citations.map((c, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-background/60 text-muted-foreground border border-border/40 text-[10px] font-mono"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      {msg.metadata?.verificationHash && (
                        <div className="mt-2 text-[9px] font-mono text-muted-foreground/70 flex items-center gap-1">
                          <Shield className="size-2.5 text-emerald-400" />
                          <span>SHA-256: {msg.metadata.verificationHash.slice(0, 16)}...</span>
                        </div>
                      )}

                      {msg.metadata?.suggestedActions && msg.metadata.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-border/40">
                          {msg.metadata.suggestedActions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleExecuteSuggestedAction(action)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              <Zap className="size-3 text-primary animate-pulse" />
                              <span>{action.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {pendingApproval && (
              <div className="p-3.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <AlertTriangle className="size-4" />
                  <span>Approval Required: {pendingApproval.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{pendingApproval.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => copilotActionEngine.approveAction(pendingApproval.id)}
                    className="h-7 text-xs gap-1 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold"
                  >
                    <Check className="size-3" />
                    <span>Approve & Execute</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copilotActionEngine.rejectAction(pendingApproval.id)}
                    className="h-7 text-xs gap-1 border-border/60"
                  >
                    <X className="size-3" />
                    <span>Reject</span>
                  </Button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="mr-auto flex items-center gap-2.5 p-3.5 rounded-2xl bg-secondary/50 border border-border/40 text-xs text-muted-foreground">
                <Activity className="size-3.5 text-primary animate-spin" />
                <span>
                  {activeSpecialist ? `Delegating to ${activeSpecialist}...` : "Synthesizing intelligence response..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Mode-Specific Suggested Prompts */}
          <div className="p-2 border-t border-border/30 bg-background/50 flex flex-wrap gap-1.5">
            {getSuggestedPrompts().map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(undefined, prompt)}
                className="px-2.5 py-1 rounded-full text-[11px] bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40 transition-colors font-mono"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Thinking Controls Bar */}
          <div className="px-3 pt-2 border-t border-border/30 bg-background/50">
            <ThinkingControlsBar
              onOpenSkillBuilder={() => setIsSkillBuilderOpen(true)}
              onOpenConnectorMarketplace={() => handleStudioModeSelect("CONNECTOR_MANAGER")}
            />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-border/40 bg-card/70 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask Vyron Copilot in ${studioMode} mode...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputText.trim() || isLoading}
              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>

        {/* Right Column: Capabilities & Cognitive Inspector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col overflow-hidden h-full bg-background/40">
          {/* Inspector Tabs */}
          <div className="p-2 border-b border-border/40 flex items-center gap-1 text-xs font-semibold overflow-x-auto">
            {[
              { id: "plan", label: "Plan", icon: Layers },
              { id: "trace", label: "Trace", icon: Compass },
              { id: "deliberation", label: "Deliberation", icon: Scale },
              { id: "release", label: "Release", icon: GitPullRequest },
              { id: "decisions", label: "Decisions", icon: BookOpen },
              { id: "missions", label: "Missions", icon: Target },
              { id: "drift", label: "Drift", icon: Compass },
              { id: "skills", label: "Skills", icon: Wrench },
              { id: "connectors", label: "Connectors", icon: Plug },
              { id: "tools", label: "Tools", icon: Wrench },
              { id: "agents", label: "Agents", icon: Users },
              { id: "memory", label: "Memory", icon: Brain },
              { id: "context", label: "Context", icon: Cpu },
              { id: "actions", label: "Actions", icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveInspectorTab(tab.id as never)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 text-[11px] whitespace-nowrap font-mono",
                    activeInspectorTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Inspector Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 1. PLAN TAB */}
            {activeInspectorTab === "plan" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/30">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Dynamic Autonomous Execution Plan</h4>
                    <p className="text-[11px] text-muted-foreground">DAG task decomposition with assertions and agent bindings.</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {activePlan && (
                      <Button
                        size="sm"
                        disabled={isExecutingPlan}
                        onClick={handleExecuteActivePlan}
                        className="h-7 text-xs gap-1 bg-primary text-primary-foreground font-bold"
                      >
                        <Play className="size-3 fill-current" />
                        <span>{isExecutingPlan ? "Executing..." : "Run Plan"}</span>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={handleGeneratePlan} disabled={isPlanning || isExecutingPlan} className="h-7 text-xs">
                      <span>{isPlanning ? "Planning..." : "Synthesize Plan"}</span>
                    </Button>
                  </div>
                </div>

                {activePlan ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground truncate max-w-[240px]">{activePlan.goal}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-mono uppercase",
                            activePlan.status === "COMPLETED" && "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
                            activePlan.status === "EXECUTING" && "border-primary/40 text-primary bg-primary/10 animate-pulse",
                            activePlan.status === "FAILED" && "border-destructive/40 text-destructive bg-destructive/10",
                          )}
                        >
                          {activePlan.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                        <span>Est: {activePlan.totalEstimatedDurationMs}ms</span>
                        <span>Progress: {activePlan.completedStepsCount} / {activePlan.steps.length} steps</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {activePlan.steps.map((step) => (
                        <div
                          key={step.id}
                          className={cn(
                            "p-3 rounded-xl border space-y-1.5 transition-colors text-xs",
                            step.status === "COMPLETED" && "bg-emerald-500/5 border-emerald-500/30",
                            step.status === "RUNNING" && "bg-primary/10 border-primary/40",
                            step.status === "FAILED" && "bg-destructive/5 border-destructive/30",
                            step.status === "PENDING" && "bg-secondary/30 border-border/40",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "size-4 rounded-full text-[10px] flex items-center justify-center font-mono font-bold",
                                  step.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary",
                                )}
                              >
                                {step.status === "COMPLETED" ? "✓" : step.stepNumber}
                              </span>
                              <span>{step.title}</span>
                            </span>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-[9px] font-mono">
                                {step.agentType.replace("_", " ")}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[9px] font-mono",
                                  step.riskLevel === "HIGH_IMPACT" ? "border-amber-500 text-amber-400" : "text-muted-foreground",
                                )}
                              >
                                {step.riskLevel}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-[11px] text-muted-foreground">{step.objective}</p>

                          <div className="text-[10px] text-muted-foreground font-mono bg-background/50 p-1.5 rounded-lg border border-border/30">
                            <div>Assert: {step.postAssertions.join(" • ")}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-border/60 rounded-xl space-y-2">
                    <Layers className="size-8 text-muted-foreground mx-auto" />
                    <p className="text-xs text-muted-foreground">No active execution plan formulation.</p>
                    <Button size="sm" variant="outline" onClick={handleGeneratePlan} className="text-xs">
                      Formulate Plan
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* 2. REASONING TRACE TAB (Phase 08 & 19) */}
            {activeInspectorTab === "trace" && (
              <div className="space-y-3 text-xs">
                <div className="pb-1 border-b border-border/30">
                  <h4 className="font-bold text-foreground">User-Visible Reasoning Trace</h4>
                  <p className="text-[11px] text-muted-foreground">Structured 7-section engineering derivation with zero raw token leakage.</p>
                </div>

                {latestReasoningTrace ? (
                  <div className="space-y-2.5 font-mono">
                    <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                      <div className="text-[10px] font-bold text-primary flex items-center gap-1">
                        <span>🔍 1. WHAT I UNDERSTOOD</span>
                      </div>
                      <p className="text-[11px] text-foreground font-sans">{latestReasoningTrace.understood}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                      <div className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                        <span>🔎 2. WHAT I INSPECTED</span>
                      </div>
                      <ul className="text-[11px] list-disc list-inside text-muted-foreground">
                        {latestReasoningTrace.inspected.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                      <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <span>📊 3. WHAT I FOUND</span>
                      </div>
                      <ul className="text-[11px] list-disc list-inside text-foreground font-sans">
                        {latestReasoningTrace.findings.map((finding, idx) => (
                          <li key={idx}>{finding}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5">
                      <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <span>💡 4. WHAT I AM HYPOTHESIZING</span>
                      </div>
                      {latestReasoningTrace.hypotheses.map((h, idx) => (
                        <div key={idx} className="text-[11px] p-1.5 rounded bg-background/50 border border-border/30 flex items-start justify-between">
                          <span className="font-sans">{h.text}</span>
                          <Badge variant="outline" className={cn("text-[9px]", h.isLeading ? "text-amber-400 border-amber-400/40" : "text-muted-foreground")}>
                            {h.isLeading ? "LEADING" : "ALT"} ({Math.round(h.confidence * 100)}%)
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                      <div className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                        <span>🔗 5. EVIDENCE THAT SUPPORTS IT</span>
                      </div>
                      {latestReasoningTrace.evidence.map((ev, idx) => (
                        <div key={idx} className="text-[10px] text-muted-foreground flex items-center justify-between">
                          <span>[{ev.id}] {ev.claim}</span>
                          <span className="text-primary font-mono">{ev.source}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                      <div className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                        <span>❓ 6. WHAT REMAINS UNKNOWN</span>
                      </div>
                      <ul className="text-[11px] list-disc list-inside text-muted-foreground">
                        {latestReasoningTrace.unknowns.map((un, idx) => (
                          <li key={idx}>{un}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                      <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <span>🚀 7. WHAT I RECOMMEND</span>
                      </div>
                      <ul className="text-[11px] list-decimal list-inside text-foreground font-sans font-bold">
                        {latestReasoningTrace.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-border/60 rounded-xl space-y-2">
                    <Compass className="size-8 text-muted-foreground mx-auto" />
                    <p className="text-xs text-muted-foreground">Submit a query to generate an observable reasoning trace.</p>
                  </div>
                )}
              </div>
            )}

            {/* 3. MULTI-MODEL DELIBERATION TAB (Phase 18) */}
            {activeInspectorTab === "deliberation" && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-border/30">
                  <div>
                    <h4 className="font-bold text-foreground">Multi-Model Deliberation</h4>
                    <p className="text-[11px] text-muted-foreground">Cross-family consensus & contradiction analysis (OpenAI, Anthropic, Google).</p>
                  </div>
                  <Button size="sm" onClick={handleRunDeliberation} className="h-7 text-xs font-mono font-bold">
                    Run Deliberation
                  </Button>
                </div>

                {activeDeliberation ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 space-y-1.5">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-primary">Consensus Agreement</span>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-500/40">
                          {activeDeliberation.agreementPercentage}% AGREEMENT
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-foreground">{activeDeliberation.consensusVerdict}</p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-mono text-[11px] font-bold text-muted-foreground uppercase">Model Family Perspectives</h5>
                      {activeDeliberation.perspectives.map((p, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className="font-bold text-foreground">{p.family} ({p.modelId})</span>
                            <span className="text-primary font-bold">Confidence: {Math.round(p.confidence * 100)}%</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{p.assessment}</p>
                          <div className="text-[10px] text-emerald-400 font-mono">
                            Action: {p.recommendedAction}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                      <h5 className="font-mono text-[10px] font-bold text-amber-400 uppercase">Contradiction Resolutions</h5>
                      <ul className="text-[10px] font-mono text-muted-foreground list-disc list-inside">
                        {activeDeliberation.contradictionNotes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-border/60 rounded-xl space-y-2">
                    <Scale className="size-8 text-muted-foreground mx-auto" />
                    <p className="text-xs text-muted-foreground">No active deliberation session. Click 'Run Deliberation' to compare model families.</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. RELEASE INTELLIGENCE TAB (Phase 14) */}
            {activeInspectorTab === "release" && (
              <div className="space-y-3 text-xs font-mono">
                <div className="pb-1 border-b border-border/30">
                  <h4 className="font-bold text-foreground font-sans">Release Readiness Audit</h4>
                  <p className="text-[11px] text-muted-foreground">The 7 Core Engineering Questions & policy blocker audit.</p>
                </div>

                {releaseAudit && (
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Target Version: {releaseAudit.targetVersion}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-bold",
                            releaseAudit.verdict === "READY" && "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
                            releaseAudit.verdict === "BLOCKED" && "text-rose-400 border-rose-500/40 bg-rose-500/10",
                            releaseAudit.verdict === "REVIEW_REQUIRED" && "text-amber-400 border-amber-500/40 bg-amber-500/10",
                          )}
                        >
                          VERDICT: {releaseAudit.verdict}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Score: {releaseAudit.overallReadinessScore}/100 • Blockers: {releaseAudit.blockersCount} • Warnings: {releaseAudit.warningsCount}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="p-2 rounded bg-background/50 border border-border/30">
                        <span className="font-bold text-primary">1. What Changed:</span> {releaseAudit.answers.whatChanged}
                      </div>
                      <div className="p-2 rounded bg-background/50 border border-border/30">
                        <span className="font-bold text-cyan-400">2. What Is Affected:</span> {releaseAudit.answers.whatIsAffected}
                      </div>
                      <div className="p-2 rounded bg-background/50 border border-border/30">
                        <span className="font-bold text-rose-400">4. What Failed:</span>
                        <ul className="list-disc list-inside mt-0.5 text-muted-foreground">
                          {releaseAudit.answers.whatFailed.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. DECISIONS & ADR DECAY TAB (Phase 12) */}
            {activeInspectorTab === "decisions" && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-border/30">
                  <div>
                    <h4 className="font-bold text-foreground">Architecture Decision Records (ADRs)</h4>
                    <p className="text-[11px] text-muted-foreground">Decision ledger and AST-backed decision decay tracking.</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      copilotDecisionEngine.draftADR({
                        title: "Strict Microservice AST Boundary Enforcement",
                        context: "Recent AST scans detected undeclared circular coupling.",
                        decision: "Isolate service-to-service interfaces behind API schemas.",
                        rationale: "Prevents transitive cascade failure during deployments.",
                      });
                      setDecisionsList(copilotDecisionEngine.listDecisions());
                      toast.success("Synthesized draft ADR-003.");
                    }}
                    className="h-7 text-xs font-mono"
                  >
                    Draft ADR
                  </Button>
                </div>

                <div className="space-y-2">
                  {decisionsList.map((adr) => (
                    <div key={adr.id} className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">[{adr.id}] {adr.title}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px]",
                            adr.status === "DECAYING" && "text-rose-400 border-rose-500/40 bg-rose-500/10",
                            adr.status === "ACCEPTED" && "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
                            adr.status === "PROPOSED" && "text-amber-400 border-amber-500/40 bg-amber-500/10",
                          )}
                        >
                          {adr.status} ({Math.round(adr.validityScore * 100)}%)
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-sans">{adr.decision}</p>
                      {adr.decayIndicators.length > 0 && (
                        <div className="text-[10px] text-rose-400 p-1.5 rounded bg-rose-500/5 border border-rose-500/20">
                          ⚠️ Decay Indicator: {adr.decayIndicators[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. MISSIONS TAB */}
            {activeInspectorTab === "missions" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-border/30">
                  <h4 className="text-xs font-bold text-foreground">Engineering Missions</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const m = missionEngine.createMission({
                        title: "AST Cyclomatic Refactor Mission",
                        objective: "Decompose CCN > 15 functions in billing DAO",
                      });
                      setMissionsList(missionEngine.getMissions());
                      toast.success(`Mission created: ${m.title}`);
                    }}
                    className="h-7 text-xs"
                  >
                    New Mission
                  </Button>
                </div>
                {missionsList.map((msn) => (
                  <div key={msn.id} className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{msn.title}</span>
                      <Badge variant="outline" className="text-[9px] font-mono">{msn.status}</Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">{msn.objective}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-muted-foreground">{msn.steps.length} steps</span>
                      {msn.status !== "COMPLETED" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            missionEngine.executeNextStep(msn.id);
                            setMissionsList(missionEngine.getMissions());
                            toast.success("Executed mission step autonomously.");
                          }}
                          className="h-6 text-[10px] px-2 font-bold"
                        >
                          Step
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. DRIFT TAB */}
            {activeInspectorTab === "drift" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-border/30">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Architecture Drift</h4>
                    <p className="text-[11px] text-muted-foreground">AST complexity & boundary conformance.</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">Score: {driftSummary.overallDriftScore}/100</Badge>
                </div>
                <div className="space-y-2">
                  {driftFindings.map((f) => (
                    <div key={f.id} className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{f.title}</span>
                        <Badge variant="outline" className="text-[9px] font-mono text-rose-400">{f.severity}</Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">{f.remediation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. TOOLS TAB */}
            {activeInspectorTab === "tools" && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-foreground pb-1 border-b border-border/30">Typed Tool Registry</h4>
                {copilotToolRegistry.listTools({ mode }).map((tool) => (
                  <div key={tool.id} className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-foreground">{tool.name}</span>
                      <Badge variant="outline" className="text-[9px] font-mono">{tool.risk}</Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">{tool.description}</p>
                    <div className="flex justify-end pt-1">
                      <Button size="sm" variant="outline" onClick={() => handleExecuteTool(tool)} className="h-6 text-[10px] px-2 gap-1">
                        <Play className="size-2.5" /> Run
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 9. AGENTS TAB */}
            {activeInspectorTab === "agents" && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-foreground pb-1 border-b border-border/30">Specialist Agents</h4>
                {copilotAgentOrchestrator.getAgentDescriptors().map((agent) => (
                  <div key={agent.type} className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{agent.name}</span>
                      <Badge variant="outline" className="text-[9px] font-mono">{agent.type}</Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">{agent.roleDescription}</p>
                    <div className="flex justify-end pt-1">
                      <Button size="sm" onClick={() => handleDelegateToAgent(agent)} disabled={delegatingAgent !== null} className="h-6 text-[10px] px-2 gap-1 font-bold">
                        <ArrowRight className="size-2.5" /> Delegate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 10. MEMORY TAB */}
            {activeInspectorTab === "memory" && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-border/30">
                  <h4 className="text-xs font-bold text-foreground">7-Tier Memory Store</h4>
                  <Button size="sm" variant="outline" onClick={() => { copilotMemory.clearAll(mode); setMemoryEntries(copilotMemory.listMemories(mode)); }} className="h-6 text-[10px]">
                    Reset
                  </Button>
                </div>
                {memoryEntries.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <Badge variant="outline" className="font-mono">{m.layer}</Badge>
                      <span className="text-muted-foreground font-mono">Confidence: {(m.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="font-bold font-mono text-foreground">{m.key}</div>
                    <div className="text-muted-foreground text-[11px]">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 11. CONTEXT TAB */}
            {activeInspectorTab === "context" && (
              <div className="space-y-2 text-xs font-mono">
                <h4 className="text-xs font-bold text-foreground pb-1 border-b border-border/30 font-sans">Active Context</h4>
                {liveContext && (
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1 text-[11px]">
                    <div><span className="text-muted-foreground">Scope:</span> {liveContext.metadata.scope}</div>
                    <div><span className="text-muted-foreground">Project:</span> {liveContext.project.name}</div>
                    <div><span className="text-muted-foreground">Health Score:</span> {liveContext.project.healthScore}%</div>
                    <div><span className="text-muted-foreground">ATLAS Entities:</span> {liveContext.atlas.totalEntities} nodes, {liveContext.atlas.totalEdges} edges</div>
                    <div><span className="text-muted-foreground">Release Target:</span> {liveContext.release.targetVersion} [{liveContext.release.verdict}]</div>
                  </div>
                )}
              </div>
            )}

            {/* 12. ACTIONS TAB */}
            {activeInspectorTab === "actions" && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-foreground pb-1 border-b border-border/30">Action History</h4>
                {actionHistory.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3">No actions executed in this session.</p>
                ) : (
                  actionHistory.map((act) => (
                    <div key={act.id} className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span>{act.label}</span>
                        <Badge variant="outline" className="text-[9px] font-mono">{act.status}</Badge>
                      </div>
                      <p className="text-muted-foreground text-[11px]">{act.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 13. CONNECTORS TAB */}
            {activeInspectorTab === "connectors" && (
              <div className="space-y-3">
                <ConnectorMarketplaceView />
              </div>
            )}

            {/* 14. SKILLS TAB */}
            {activeInspectorTab === "skills" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/30">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Governed Skill Packages</h4>
                    <p className="text-[11px] text-muted-foreground">Installed capability packages with 14 test classes.</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsSkillBuilderOpen(true)}
                    className="h-7 text-xs font-mono font-bold bg-primary text-primary-foreground gap-1"
                  >
                    <Wrench className="size-3" />
                    <span>Skill Factory</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  {skillRegistry.listSkills().map((sk) => (
                    <div key={sk.skillId} className="p-3 rounded-xl bg-secondary/40 border border-border/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs">{sk.name}</span>
                        <Badge variant="outline" className="text-[9px] font-mono">{sk.status}</Badge>
                      </div>
                      <p className="text-muted-foreground text-[11px]">{sk.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SkillBuilderModal
        isOpen={isSkillBuilderOpen}
        onClose={() => setIsSkillBuilderOpen(false)}
      />
      <ActionPreviewModal
        preview={previewAction}
        onClose={() => setPreviewAction(null)}
      />
    </div>
  );
}
