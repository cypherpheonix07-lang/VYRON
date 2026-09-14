import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Send,
  Bot,
  Trash2,
  Activity,
  Zap,
  Shield,
  Layers,
  Wrench,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronRight,
  Database,
  Search,
  FileText,
  Clock,
  Check,
  X,
  Play,
  Users,
  Brain,
  History,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useCopilot } from "@/state/copilot/useCopilot";
import { aiRouter } from "@/services/ai/aiRouter";
import { AIModelType, CopilotAction, CopilotViewMode, CopilotTab, copilotStore } from "@/state/copilot/copilotStore";
import { analysisOrchestrator } from "@/services/orchestrator/analysisOrchestrator";
import { eventSimulator } from "@/services/demo/eventSimulator";
import { copilotContextEngine, CopilotLiveContext } from "@/services/copilot/copilotContextEngine";
import { copilotActionEngine, ActionInvocation, ActionType } from "@/services/copilot/copilotActionEngine";
import { copilotToolRegistry, CopilotToolDef, ToolCategory } from "@/services/copilot/copilotToolRegistry";
import { copilotAgentOrchestrator, SpecialistAgentType, AgentDescriptor } from "@/services/copilot/copilotAgentOrchestrator";
import { copilotMemory, MemoryLayer, MemoryEntry } from "@/services/copilot/copilotMemory";
import { copilotRealtimeListener } from "@/services/copilot/copilotRealtimeListener";
import { copilotPlanner, DynamicExecutionPlan, PlanStep } from "@/services/copilot/copilotPlanner";
import { copilotExecutionEngine } from "@/services/copilot/copilotExecutionEngine";
import { ProactiveInsightsBanner } from "@/components/copilot/ProactiveInsightsBanner";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CopilotDrawer() {
  const {
    mode,
    isDrawerOpen,
    viewMode,
    activeTab,
    session,
    messages,
    isLoading,
    activeModel,
    activeSpecialist,
    setDrawerOpen,
    setViewMode,
    setActiveTab,
    setModel,
    sendMessage,
    addAssistantMessage,
    setLoading,
    clearMessages,
  } = useCopilot();

  const [inputText, setInputText] = useState("");
  const [liveContext, setLiveContext] = useState<CopilotLiveContext | null>(null);
  const [activePlan, setActivePlan] = useState<DynamicExecutionPlan | null>(() => session.activePlan || null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecutingPlan, setIsExecutingPlan] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<ActionInvocation | null>(null);
  const [actionHistory, setActionHistory] = useState<ActionInvocation[]>([]);
  const [selectedToolCategory, setSelectedToolCategory] = useState<string>("ALL");
  const [selectedMemoryLayer, setSelectedMemoryLayer] = useState<string>("ALL");
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([]);
  const [delegatingAgent, setDelegatingAgent] = useState<SpecialistAgentType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize real-time event listener
  useEffect(() => {
    copilotRealtimeListener.initialize();
  }, []);

  // Update live context on open and route changes
  useEffect(() => {
    if (isDrawerOpen) {
      setLiveContext(copilotContextEngine.assembleContext());
      setMemoryEntries(copilotMemory.listMemories(mode));
    }
  }, [isDrawerOpen, activeTab, mode]);

  // Subscribe to action engine changes
  useEffect(() => {
    return copilotActionEngine.subscribe((actions) => {
      setActionHistory(actions);
      const pending = actions.find((a) => a.status === "PENDING_APPROVAL");
      setPendingApproval(pending || null);
    });
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const text = (promptOverride || inputText).trim();
    if (!text || isLoading) return;

    if (!promptOverride) setInputText("");

    // Check if goal is complex - autonomously formulate and execute plan
    if (copilotPlanner.isComplexGoal(text)) {
      sendMessage(text);
      setActiveTab("plan");
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
      addAssistantMessage(`I encountered an unexpected error completing your request: ${errMsg}`);
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
      toast.success("Synthesized dynamic execution plan with verified post-assertions.");
    } catch (err) {
      console.error("Failed to generate plan:", err);
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
      toast.success("Plan execution completed.");
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
      setActiveTab("chat");
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
        toast.success(`Tool ${tool.name} executed successfully.`);
        addAssistantMessage(
          `**Executed Tool:** \`${tool.name}\`\n\n\`\`\`json\n${JSON.stringify(res.output, null, 2)}\n\`\`\``,
          { verificationHash: res.verificationHash },
        );
        setActiveTab("chat");
      } else {
        toast.error(`Tool execution ${res.status}: ${res.errorMessage || "Unknown error"}`);
      }
    } catch (err: unknown) {
      toast.error(`Tool failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleExecuteSuggestedAction = async (action: { id: string; label: string; actionType: string }) => {
    toast.loading(`Executing action: ${action.label}...`, { id: "exec-action-drawer" });
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

      toast.dismiss("exec-action-drawer");
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
      toast.dismiss("exec-action-drawer");
      toast.error(`Action failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleClearMemoryLayer = (layer: MemoryLayer) => {
    copilotMemory.clearLayer(layer, mode);
    setMemoryEntries(copilotMemory.listMemories(mode));
    toast.info(`Cleared memory layer: ${layer}`);
  };

  const handleResetAllMemory = () => {
    copilotMemory.clearAll(mode);
    setMemoryEntries(copilotMemory.listMemories(mode));
    toast.info(`Reset memory store for ${mode} mode.`);
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

  const filteredTools = copilotToolRegistry.listTools({ mode }).filter((t) => {
    return selectedToolCategory === "ALL" || t.category === selectedToolCategory;
  });

  const filteredMemories = memoryEntries.filter((m) => {
    return selectedMemoryLayer === "ALL" || m.layer === selectedMemoryLayer;
  });

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent
        side="right"
        className={cn(
          "p-0 border-l border-border/60 bg-background/95 backdrop-blur-2xl transition-all duration-300 flex flex-col z-50",
          viewMode === "FULL_STUDIO"
            ? "w-screen sm:max-w-none max-w-none"
            : "w-full sm:max-w-[500px]",
        )}
      >
        <SheetTitle className="sr-only">Brahma AI Copilot</SheetTitle>

        {/* Drawer Header */}
        <SheetHeader className="p-4 border-b border-border/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "p-2 rounded-xl border flex items-center justify-center shadow-inner",
                  mode === "DEMO"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-primary/10 border-primary/30 text-primary",
                )}
              >
                {mode === "DEMO" ? <Sparkles className="size-4" /> : <Bot className="size-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight text-foreground">
                    {mode === "DEMO" ? "Brahma Demo Copilot" : "Brahma Intelligence Copilot"}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0",
                      mode === "DEMO"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        : "bg-primary/10 text-primary border-primary/30",
                    )}
                  >
                    {mode}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[260px]">
                  {mode === "DEMO" ? "Synthetic Benchmark Simulation" : liveContext?.project.name || "Production Architecture"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === "FULL_STUDIO" ? "DRAWER" : "FULL_STUDIO")}
                title={viewMode === "FULL_STUDIO" ? "Dock Drawer" : "Expand Fullscreen Studio"}
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                {viewMode === "FULL_STUDIO" ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearMessages}
                title="Clear conversation history"
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs (All 7 Tabs) */}
          <div className="grid grid-cols-7 gap-1 p-1 rounded-xl bg-background/60 border border-border/50 text-[10px] font-semibold">
            {[
              { id: "chat", label: "Chat", icon: Sparkles },
              { id: "plan", label: "Plan", icon: Layers },
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
                  onClick={() => setActiveTab(tab.id as CopilotTab)}
                  className={cn(
                    "py-1 px-1 rounded-lg transition-all flex flex-col items-center justify-center gap-0.5",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Model Engine Selector */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-muted-foreground text-[11px] flex items-center gap-1">
              <Cpu className="size-3" />
              <span>Engine:</span>
            </span>
            <select
              value={activeModel}
              onChange={(e) => setModel(e.target.value as AIModelType)}
              className="text-xs rounded-lg bg-background/80 border border-border/60 text-foreground px-2 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="OPENROUTER_AUTO">OpenRouter (Active Multi-Model)</option>
              <option value="OPENAI_GPT4O">OpenAI GPT-4o (Direct / Failover)</option>
              <option value="CLAUDE_SONNET">Claude 3.7 Sonnet</option>
              <option value="KIMI_K3">Kimi K3 MoE</option>
              <option value="MOCK_DETERMINISTIC">Deterministic Mock</option>
            </select>
          </div>
        </SheetHeader>

        {/* TAB 1: CHAT */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Proactive Recommendations Tray */}
            <div className="p-2 border-b border-border/30">
              <ProactiveInsightsBanner compact maxItems={1} />
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col space-y-1.5 max-w-[90%]",
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
                      "p-3.5 rounded-2xl text-xs leading-relaxed transition-all",
                      msg.sender === "USER"
                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/20"
                        : msg.sender === "SYSTEM"
                          ? "bg-primary/10 border border-primary/30 text-foreground text-center rounded-xl font-mono text-[11px]"
                          : "bg-secondary/75 text-foreground border border-border/50 rounded-tl-none shadow-sm",
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Citations / Provenance Badges */}
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

                    {/* Verification Seal */}
                    {msg.metadata?.verificationHash && (
                      <div className="mt-2 text-[9px] font-mono text-muted-foreground/70 flex items-center gap-1">
                        <Shield className="size-2.5 text-emerald-400" />
                        <span>SHA-256: {msg.metadata.verificationHash.slice(0, 16)}...</span>
                      </div>
                    )}

                    {/* Interactive Suggested Actions */}
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

              {/* Pending Approval Card */}
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

            {/* Suggested Prompts Tray */}
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

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-border/40 bg-card flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  mode === "NORMAL"
                    ? "Ask Brahma about live pipelines, contracts, or risk..."
                    : "Ask Demo Copilot to inject anomalies or explain IQR..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputText.trim() || isLoading}
                className="h-8 px-3.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
              >
                <Send className="size-3.5" />
              </Button>
            </form>
          </div>
        )}

        {/* TAB 2: PLAN */}
        {activeTab === "plan" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div>
                <h4 className="text-xs font-bold text-foreground">Dynamic Autonomous Execution Plan</h4>
                <p className="text-[11px] text-muted-foreground">DAG decomposition with specialist agents, tools, and assertions.</p>
              </div>
              <div className="flex items-center gap-1.5">
                {activePlan && (
                  <Button
                    size="sm"
                    disabled={isExecutingPlan}
                    onClick={handleExecuteActivePlan}
                    className="text-xs h-7 gap-1 bg-primary text-primary-foreground font-bold"
                  >
                    <Play className="size-3 fill-current" />
                    <span>{isExecutingPlan ? "Executing..." : "Run Plan"}</span>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPlanning || isExecutingPlan}
                  onClick={handleGeneratePlan}
                  className="text-xs h-7 gap-1"
                >
                  <Sparkles className="size-3 text-primary" />
                  <span>{isPlanning ? "Planning..." : "Regenerate"}</span>
                </Button>
              </div>
            </div>

            {activePlan ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground truncate max-w-[200px]">{activePlan.goal}</span>
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
                    <span>Completed: {activePlan.completedStepsCount} / {activePlan.steps.length} steps</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {activePlan.steps.map((step) => (
                    <div
                      key={step.id}
                      className={cn(
                        "p-3 rounded-xl border space-y-2 transition-colors",
                        step.status === "COMPLETED" && "bg-emerald-500/5 border-emerald-500/30",
                        step.status === "RUNNING" && "bg-primary/10 border-primary/40",
                        step.status === "FAILED" && "bg-destructive/5 border-destructive/30",
                        step.status === "PENDING" && "bg-secondary/30 border-border/40",
                      )}
                    >
                      <div className="flex items-center justify-between text-xs">
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
                          <div className="text-emerald-400/80 mt-0.5">Execution Time: {step.actualDurationMs}ms</div>
                        )}
                        {step.error && <div className="text-destructive mt-0.5">Error: {step.error}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-3 rounded-2xl bg-secondary/20 border border-border/30">
                <Layers className="size-8 mx-auto text-muted-foreground/60" />
                <p className="text-xs text-muted-foreground">No active plan generated yet for this session.</p>
                <Button size="sm" onClick={handleGeneratePlan} className="text-xs">
                  Synthesize Execution Plan
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TOOLS (13 Categories) */}
        {activeTab === "tools" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="pb-2 border-b border-border/40">
              <h4 className="text-xs font-bold text-foreground">Unified Typed Tool Registry</h4>
              <p className="text-[11px] text-muted-foreground">13 discoverable tool categories with risk limits and execution timeouts.</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
              {["ALL", "analysis", "dataset", "search", "connector", "reporting", "investigation", "diagnostics", "demo"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedToolCategory(cat)}
                  className={cn(
                    "px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors",
                    selectedToolCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-2 hover:border-border/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-foreground">{tool.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-secondary text-muted-foreground">
                        {tool.category}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-mono",
                        tool.risk === "SAFE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : tool.risk === "READ_ONLY"
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30",
                      )}
                    >
                      {tool.risk}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground font-mono">
                    <span>Timeout: {tool.timeoutMs}ms</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExecuteTool(tool)}
                      className="h-6 text-[11px] px-2.5 gap-1"
                    >
                      <Play className="size-2.5" />
                      <span>Run Tool</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AGENTS (7 Specialist Agents) */}
        {activeTab === "agents" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="pb-2 border-b border-border/40">
              <h4 className="text-xs font-bold text-foreground">7 Bounded Specialist Agents</h4>
              <p className="text-[11px] text-muted-foreground">Bounded tool access, recursion cap of 2, and verified structured output.</p>
            </div>

            <div className="space-y-3">
              {copilotAgentOrchestrator.getAgentDescriptors().map((agent) => (
                <div
                  key={agent.type}
                  className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 space-y-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">{agent.name}</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {agent.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.roleDescription}</p>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    <span className="text-foreground font-semibold">Directive:</span> {agent.systemDirective}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[10px]">
                    <span className="text-muted-foreground font-mono">Tools: {agent.allowedTools.join(", ")}</span>
                    <Button
                      size="sm"
                      disabled={delegatingAgent !== null}
                      onClick={() => handleDelegateToAgent(agent)}
                      className="h-6 text-[11px] px-2.5 font-bold bg-primary text-primary-foreground gap-1"
                    >
                      {delegatingAgent === agent.type ? (
                        <Activity className="size-3 animate-spin" />
                      ) : (
                        <ArrowRight className="size-3" />
                      )}
                      <span>Delegate Work</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MEMORY (7 Memory Tiers) */}
        {activeTab === "memory" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div>
                <h4 className="text-xs font-bold text-foreground">7-Tier Layered Copilot Memory</h4>
                <p className="text-[11px] text-muted-foreground">Strict demo isolation, confidence metrics, and provenance tracking.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetAllMemory}
                className="h-7 text-xs gap-1 border-border/60"
              >
                <RotateCcw className="size-3" />
                <span>Reset Memory</span>
              </Button>
            </div>

            {/* Layer Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
              {["ALL", "SESSION", "TASK", "PROJECT", "WORKSPACE", "PREFERENCES", "ANALYSIS", "DEMO_SCENARIO"].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setSelectedMemoryLayer(layer)}
                  className={cn(
                    "px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors",
                    selectedMemoryLayer === layer
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {layer}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredMemories.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground rounded-xl bg-secondary/20 border border-border/30">
                  No active memory entries in this tier.
                </div>
              ) : (
                filteredMemories.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] font-mono">
                        {entry.layer}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Confidence: {(entry.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="font-bold text-foreground font-mono">{entry.key}</div>
                    <div className="text-muted-foreground leading-relaxed">{entry.value}</div>
                    <div className="flex items-center justify-between pt-1 text-[9px] text-muted-foreground/80 font-mono border-t border-border/20">
                      <span>Source: {entry.provenance}</span>
                      <button
                        onClick={() => handleClearMemoryLayer(entry.layer)}
                        className="text-rose-400 hover:underline"
                      >
                        Clear Layer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CONTEXT */}
        {activeTab === "context" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="pb-2 border-b border-border/40">
              <h4 className="text-xs font-bold text-foreground">Live Dynamic Application Context</h4>
              <p className="text-[11px] text-muted-foreground">Real-time parameters grounded in active application stores.</p>
            </div>

            {liveContext && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Active Project & Route
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-muted-foreground">Project:</span> {liveContext.project.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Health:</span> {liveContext.project.healthScore}%
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mode:</span> {liveContext.mode}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Section:</span> {liveContext.route.section}
                    </div>
                    <div className="col-span-2 truncate">
                      <span className="text-muted-foreground">Path:</span> {liveContext.route.pathname}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Active Dataset & Ingestion
                  </span>
                  <div className="space-y-1 font-mono text-xs">
                    <div>{liveContext.dataset.name}</div>
                    <div className="text-muted-foreground text-[11px]">
                      Records: {liveContext.dataset.totalRecords.toLocaleString()} | Benchmark: {liveContext.dataset.isBenchmark ? "YES" : "NO"}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Analysis Telemetry
                  </span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div>Status: {liveContext.analysis.status}</div>
                    <div>Risk Score: {liveContext.analysis.overallRiskScore}/100</div>
                    <div>Anomalies: {liveContext.analysis.anomaliesDetected}</div>
                    <div>Critical: {liveContext.analysis.criticalFindingsCount}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Connectors & Plugins
                  </span>
                  <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                    <div>Connectors: {liveContext.connectors.map((c) => `${c.name} (${c.status})`).join(", ")}</div>
                    <div>Plugins: {liveContext.plugins.map((p) => p.name).join(", ")}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: ACTIONS (History & Approvals) */}
        {activeTab === "actions" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="pb-2 border-b border-border/40">
              <h4 className="text-xs font-bold text-foreground">Copilot Action Engine Audit Stream</h4>
              <p className="text-[11px] text-muted-foreground">Traceable history of actions, operator approvals, and SHA-256 seals.</p>
            </div>

            <div className="space-y-2.5">
              {actionHistory.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground rounded-xl bg-secondary/20 border border-border/30">
                  No actions executed in this session yet.
                </div>
              ) : (
                actionHistory.map((action) => (
                  <div
                    key={action.id}
                    className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{action.label}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-mono",
                          action.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : action.status === "PENDING_APPROVAL"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30",
                        )}
                      >
                        {action.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">{action.description}</p>
                    {action.verificationHash && (
                      <div className="text-[9px] font-mono text-muted-foreground/70 flex items-center gap-1">
                        <Shield className="size-2.5 text-emerald-400" />
                        <span>SHA-256: {action.verificationHash.slice(0, 20)}...</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
