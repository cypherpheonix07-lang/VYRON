/**
 * PROJECT BRAHMA — FULLSCREEN COPILOT INTELLIGENCE STUDIO
 * Dedicated command center for Brahma AI Copilot.
 * Integrates dual-column workspace: real-time conversational intelligence + capabilities inspector.
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
  RotateCcw,
  ArrowRight,
  Play,
  Check,
  X,
  FileText,
  Search,
  Target,
  Compass,
  Zap,
} from "lucide-react";
import { useCopilot } from "@/state/copilot/useCopilot";
import { aiRouter } from "@/services/ai/aiRouter";
import { AIModelType, CopilotTab, CopilotAction, copilotStore } from "@/state/copilot/copilotStore";
import { copilotContextEngine, CopilotLiveContext } from "@/services/copilot/copilotContextEngine";
import { copilotActionEngine, ActionInvocation, ActionType } from "@/services/copilot/copilotActionEngine";
import { copilotToolRegistry, CopilotToolDef } from "@/services/copilot/copilotToolRegistry";
import { copilotAgentOrchestrator, SpecialistAgentType, AgentDescriptor } from "@/services/copilot/copilotAgentOrchestrator";
import { copilotMemory, MemoryLayer, MemoryEntry } from "@/services/copilot/copilotMemory";
import { copilotPlanner, DynamicExecutionPlan, PlanStep } from "@/services/copilot/copilotPlanner";
import { copilotExecutionEngine } from "@/services/copilot/copilotExecutionEngine";
import { ProactiveInsightsBanner } from "@/components/copilot/ProactiveInsightsBanner";
import { missionEngine, EngineeringMission } from "@/services/missions/missionEngine";
import { architectureDriftEngine, DriftFinding } from "@/services/intelligence/driftEngine";
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
    sendMessage,
    addAssistantMessage,
    setLoading,
    clearMessages,
  } = useCopilot();

  const [inputText, setInputText] = useState("");
  const [activeInspectorTab, setActiveInspectorTab] = useState<
    "plan" | "missions" | "drift" | "tools" | "agents" | "memory" | "context" | "actions"
  >("plan");
  const [liveContext, setLiveContext] = useState<CopilotLiveContext | null>(null);
  const [activePlan, setActivePlan] = useState<DynamicExecutionPlan | null>(() => session.activePlan || null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecutingPlan, setIsExecutingPlan] = useState(false);
  const [actionHistory, setActionHistory] = useState<ActionInvocation[]>([]);
  const [pendingApproval, setPendingApproval] = useState<ActionInvocation | null>(null);
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([]);
  const [selectedMemoryLayer, setSelectedMemoryLayer] = useState<string>("ALL");
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLiveContext(copilotContextEngine.assembleContext());
    setMemoryEntries(copilotMemory.listMemories(mode));
    setMissionsList(missionEngine.getMissions());
    const drift = architectureDriftEngine.evaluateDrift();
    setDriftFindings(drift.findings);
    setDriftSummary(drift.summary);
  }, [mode]);

  useEffect(() => {
    return copilotActionEngine.subscribe((actions) => {
      setActionHistory(actions);
      const pending = actions.find((a) => a.status === "PENDING_APPROVAL");
      setPendingApproval(pending || null);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const text = (promptOverride || inputText).trim();
    if (!text || isLoading) return;

    if (!promptOverride) setInputText("");

    // Autonomous goal execution check
    if (copilotPlanner.isComplexGoal(text)) {
      sendMessage(text);
      setActiveInspectorTab("plan");
      const plan = copilotPlanner.formulatePlan(text, mode, liveContext?.dataset.name);
      setActivePlan(plan);
      copilotStore.setActivePlan(mode, plan);
      toast.success(`Formulated dynamic plan: ${plan.goal}`);
      setIsExecutingPlan(true);
      try {
        await copilotExecutionEngine.executePlan(plan, mode);
      } catch (err: unknown) {
        toast.error(`Execution error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsExecutingPlan(false);
      }
      return;
    }

    sendMessage(text);
    setLoading(true);

    try {
      const systemPrompt = copilotContextEngine.generateSystemPrompt();

      const response = await aiRouter.routeAndComplete({
        taskType: mode === "DEMO" ? "DEMO_SIMULATION" : "REASONING",
        modelOverride: activeModel,
        messages: [
          ...messages.slice(-6).map((m) => ({
            role: (m.sender === "USER"
              ? "user"
              : m.sender === "ASSISTANT"
                ? "assistant"
                : "system") as "user" | "assistant" | "system",
            content: m.text,
          })),
          { role: "user", content: text },
        ],
        systemPrompt,
      });

      const citations = [
        `Mode: ${mode}`,
        `Model: ${response.model}`,
        liveContext?.analysis.currentStageName ? `Stage: ${liveContext.analysis.currentStageName}` : "System: Governed",
      ];

      let dynamicSuggestedActions: CopilotAction[] = [];
      const lower = text.toLowerCase();
      if (lower.includes("drift") || lower.includes("ast") || lower.includes("boundary")) {
        dynamicSuggestedActions = [
          { id: "act_drift", label: "Run Architecture Drift Detection", actionType: "DETECT_ARCHITECTURE_DRIFT" },
          { id: "act_impact", label: "Analyze Change Impact", actionType: "ANALYZE_CHANGE_IMPACT" },
        ];
      } else if (lower.includes("impact") || lower.includes("blast radius") || lower.includes("transitive")) {
        dynamicSuggestedActions = [
          { id: "act_impact", label: "Analyze Change Impact", actionType: "ANALYZE_CHANGE_IMPACT" },
          { id: "act_mission", label: "Start Verification Mission", actionType: "START_ENGINEERING_MISSION" },
        ];
      } else if (lower.includes("mission") || lower.includes("review project") || lower.includes("objective")) {
        dynamicSuggestedActions = [
          { id: "act_mission", label: "Launch Release Verification Mission", actionType: "START_ENGINEERING_MISSION" },
          { id: "act_pol", label: "Evaluate Release Policies", actionType: "EVALUATE_ENGINEERING_POLICIES" },
        ];
      } else if (lower.includes("time machine") || lower.includes("health drop") || lower.includes("why did health") || lower.includes("regression")) {
        dynamicSuggestedActions = [
          { id: "act_tm", label: "Compare Historical Snapshots", actionType: "COMPARE_TIME_MACHINE_SNAPSHOTS" },
          { id: "act_drift", label: "Detect Current Drift", actionType: "DETECT_ARCHITECTURE_DRIFT" },
        ];
      } else if (lower.includes("policy") || lower.includes("release gate") || lower.includes("blocking")) {
        dynamicSuggestedActions = [
          { id: "act_pol", label: "Evaluate Release Policies", actionType: "EVALUATE_ENGINEERING_POLICIES" },
          { id: "act_mission", label: "Start Mission for Gate Blockers", actionType: "START_ENGINEERING_MISSION" },
        ];
      } else if (lower.includes("simulation") || lower.includes("scenario") || lower.includes("lab")) {
        dynamicSuggestedActions = [
          { id: "act_sim", label: "Run Drift Anomaly Scenario", actionType: "RUN_SIMULATION_SCENARIO" },
          { id: "act_rst", label: "Reset Demo Baseline", actionType: "RESET_DEMO" },
        ];
      } else {
        dynamicSuggestedActions =
          mode === "NORMAL"
            ? [
                { id: "act_1", label: "Run Full 12-Stage Pipeline", actionType: "RUN_ANALYSIS" },
                { id: "act_drift", label: "Detect Architecture Drift", actionType: "DETECT_ARCHITECTURE_DRIFT" },
              ]
            : [
                { id: "act_inj", label: "Inject Anomaly Surge", actionType: "INJECT_DEMO_ANOMALY" },
                { id: "act_rst", label: "Reset Demo Baseline", actionType: "RESET_DEMO" },
              ];
      }

      addAssistantMessage(response.text, {
        model: response.model,
        verificationHash: response.verificationHash,
        reasoningDurationMs: response.durationMs,
        citations,
        suggestedActions: dynamicSuggestedActions,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      addAssistantMessage(`Execution encountered an error: ${errMsg}`);
    } finally {
      setLoading(false);
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

  const suggestedPrompts =
    mode === "NORMAL"
      ? [
          "Explain active pipeline risk factors",
          "Inspect contract schema conformity",
          "Review critical Bandit security findings",
          "Test all external MCP connectors",
        ]
      : [
          "Explain the synthetic FinLedger scenario",
          "Inject 5 high-velocity anomaly deviations",
          "Analyze IQR outlier distribution",
          "Reset demo simulation to baseline",
        ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Studio Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80">
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
                {mode === "DEMO" ? "Brahma Demo Copilot Studio" : "Brahma Intelligence Copilot Studio"}
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
              Dual-column command center integrating conversational reasoning with active capability inspection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-mono">Engine:</span>
            <select
              value={activeModel}
              onChange={(e) => setModel(e.target.value as AIModelType)}
              className="text-xs rounded-lg bg-secondary/80 border border-border/60 text-foreground px-2 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="OPENROUTER_AUTO">OpenRouter (Active Multi-Model)</option>
              <option value="OPENAI_GPT4O">OpenAI GPT-4o (Direct / Failover)</option>
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
                      <span>{msg.metadata?.model || "Brahma AI"}</span>
                    </>
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all shadow-sm active:scale-95"
                        >
                          <Zap className="size-3 text-primary animate-pulse" />
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
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

          {/* Suggested Prompts */}
          <div className="p-2 border-t border-border/30 bg-background/50 flex flex-wrap gap-1.5">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(undefined, prompt)}
                className="px-2.5 py-1 rounded-full text-[11px] bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-border/40 bg-card/70 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Brahma Copilot about architecture, security, datasets, or 12-stage runs..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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

        {/* Right Column: Capabilities & Inspection Inspector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col overflow-hidden h-full bg-background/40">
          {/* Inspector Tabs */}
          <div className="p-2 border-b border-border/40 flex items-center gap-1 text-xs font-semibold overflow-x-auto">
            {[
              { id: "plan", label: "Plan", icon: Layers },
              { id: "missions", label: "Missions", icon: Target },
              { id: "drift", label: "Drift", icon: Compass },
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
                    "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs whitespace-nowrap",
                    activeInspectorTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Inspector Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                            {step.actualDurationMs && (
                              <div className="text-emerald-400/80 mt-0.5">Execution: {step.actualDurationMs}ms</div>
                            )}
                            {step.error && <div className="text-destructive mt-0.5">Error: {step.error}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-muted-foreground">Click &ldquo;Synthesize Plan&rdquo; to decompose current analytical task.</div>
                )}
              </div>
            )}

            {activeInspectorTab === "missions" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/30">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Engineering Missions</h4>
                    <p className="text-[11px] text-muted-foreground">Autonomous goal execution units.</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const m = missionEngine.createMission({
                        title: "Autonomous Architecture Audit",
                        objective: "Scan AST divergence, enforce contracts, and reconcile boundary crossings.",
                        priority: "HIGH",
                        creator: "Copilot Studio",
                      });
                      setMissionsList(missionEngine.getMissions());
                      toast.success(`Mission started: ${m.title}`);
                    }}
                    className="h-7 text-xs gap-1"
                  >
                    <Target className="size-3" /> New Mission
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {missionsList.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{m.title}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-mono",
                            m.status === "IN_PROGRESS"
                              ? "bg-primary/20 text-primary border-primary/40"
                              : m.status === "COMPLETED"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {m.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{m.objective}</p>
                      
                      {/* Step list summary */}
                      <div className="space-y-1 pt-1">
                        {m.steps.map((st, sIdx) => (
                          <div
                            key={st.id}
                            className={cn(
                              "p-1.5 rounded-lg flex items-center justify-between text-[10px] font-mono",
                              sIdx === m.currentStepIndex && m.status === "IN_PROGRESS"
                                ? "bg-primary/15 border border-primary/30 text-primary font-bold"
                                : st.status === "COMPLETED"
                                  ? "text-emerald-400 bg-background/40"
                                  : "text-muted-foreground bg-background/20",
                            )}
                          >
                            <span className="truncate max-w-[200px]">{sIdx + 1}. {st.title}</span>
                            <span>{st.status}</span>
                          </div>
                        ))}
                      </div>

                      {m.status === "IN_PROGRESS" && (
                        <div className="flex justify-end pt-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              const updated = missionEngine.executeNextStep(m.id);
                              if (updated) {
                                setMissionsList(missionEngine.getMissions());
                                toast.success(`Executed step: ${updated.steps[updated.currentStepIndex - 1]?.title || "Done"}`);
                              }
                            }}
                            className="h-6 text-[10px] gap-1"
                          >
                            <Play className="size-2.5" /> Execute Next Step
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeInspectorTab === "drift" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/30">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Architecture Drift</h4>
                    <p className="text-[11px] text-muted-foreground">Blueprint vs AST divergence.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-mono font-bold px-2 py-0.5 rounded-md border",
                        driftSummary.overallDriftScore >= 80
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40",
                      )}
                    >
                      {driftSummary.overallDriftScore}/100
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const snap = architectureDriftEngine.takeSnapshot();
                        toast.success(`Snapshot captured: ${snap.id}`);
                      }}
                      className="h-7 text-xs"
                    >
                      Snapshot
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {driftFindings.map((f) => (
                    <div key={f.id} className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{f.title}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-mono",
                            f.severity === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/40",
                          )}
                        >
                          {f.severity}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground space-y-0.5 font-mono">
                        <div><span className="text-foreground font-bold">Observed:</span> {f.observedState}</div>
                        <div><span className="text-foreground font-bold">Remediation:</span> {f.remediation}</div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            architectureDriftEngine.resolveDriftFinding(f.id);
                            const updated = architectureDriftEngine.evaluateDrift();
                            setDriftFindings(updated.findings);
                            setDriftSummary(updated.summary);
                            toast.success("Drift finding resolved.");
                          }}
                          className="h-6 text-[10px] text-emerald-400 hover:text-emerald-300 gap-1"
                        >
                          <Check className="size-2.5" /> Mark Resolved
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeInspectorTab === "tools" && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-foreground pb-1 border-b border-border/30">Typed Tool Registry</h4>
                {copilotToolRegistry.listTools({ mode }).map((tool) => (
                  <div key={tool.id} className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-foreground">{tool.name}</span>
                      <Badge variant="outline" className="text-[9px] font-mono">
                        {tool.risk}
                      </Badge>
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

            {activeInspectorTab === "memory" && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-border/30">
                  <h4 className="text-xs font-bold text-foreground">Memory Store</h4>
                  <Button size="sm" variant="outline" onClick={() => { copilotMemory.clearAll(mode); setMemoryEntries(copilotMemory.listMemories(mode)); }} className="h-6 text-[10px]">
                    Reset
                  </Button>
                </div>
                {memoryEntries.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <Badge variant="outline" className="font-mono">{m.layer}</Badge>
                      <span className="text-muted-foreground">Confidence: {(m.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="font-bold font-mono text-foreground">{m.key}</div>
                    <div className="text-muted-foreground text-[11px]">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeInspectorTab === "context" && (
              <div className="space-y-2 text-xs font-mono">
                <h4 className="text-xs font-bold text-foreground pb-1 border-b border-border/30 font-sans">Active Context</h4>
                {liveContext && (
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1 text-[11px]">
                    <div><span className="text-muted-foreground">Project:</span> {liveContext.project.name}</div>
                    <div><span className="text-muted-foreground">Health Score:</span> {liveContext.project.healthScore}%</div>
                    <div><span className="text-muted-foreground">Dataset:</span> {liveContext.dataset.name}</div>
                    <div><span className="text-muted-foreground">Pipeline:</span> {liveContext.analysis.status}</div>
                    <div><span className="text-muted-foreground">Risk Index:</span> {liveContext.analysis.overallRiskScore}/100</div>
                  </div>
                )}
              </div>
            )}

            {activeInspectorTab === "actions" && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-foreground pb-1 border-b border-border/30">Action History</h4>
                {actionHistory.map((act) => (
                  <div key={act.id} className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{act.label}</span>
                      <Badge variant="outline" className="text-[9px] font-mono">{act.status}</Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">{act.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
