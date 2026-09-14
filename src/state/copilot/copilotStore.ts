/**
 * PROJECT BRAHMA — DUAL-MODE COPILOT STATE STORE
 * Enforces strict isolation between NORMAL mode context (production architecture, live data)
 * and DEMO mode context (synthetic datasets, simulated event streams).
 * Supports multi-mode viewports (Drawer, Pinned Side-Panel, Fullscreen Studio) and multi-tab workflows.
 */

import { AppMode } from "../mode/modeStore";
import type { DynamicExecutionPlan, PlanStep } from "@/services/copilot/copilotPlanner";

export type AIModelType = "CLAUDE_SONNET" | "KIMI_K3" | "OPENAI_GPT4O" | "OPENROUTER_AUTO" | "MOCK_DETERMINISTIC";
export type CopilotViewMode = "DRAWER" | "SIDE_PANEL" | "FULL_STUDIO";
export type CopilotTab = "chat" | "plan" | "tools" | "agents" | "memory" | "context" | "actions";

export type ActionType =
  | "RUN_ANALYSIS"
  | "CANCEL_ANALYSIS"
  | "FILTER_SEVERITY"
  | "APPLY_REMEDIATION"
  | "INJECT_ANOMALY"
  | "INJECT_DEMO_ANOMALY"
  | "VIEW_STAGE"
  | "INSPECT_STAGE"
  | "VALIDATE_DATASET"
  | "SEARCH_DATASETS"
  | "INSPECT_DATASET_SCHEMA"
  | "SELECT_DATASET"
  | "TEST_CONNECTOR"
  | "REVOKE_CONNECTOR"
  | "TOGGLE_PLUGIN"
  | "SWITCH_DEMO_SCENARIO"
  | "RESET_DEMO"
  | "GENERATE_REPORT"
  | "INVESTIGATE_ANOMALY"
  | "GET_ARCHITECTURE_GRAPH"
  | "GET_PROJECT_HEALTH"
  | "GET_SYSTEM_HEALTH"
  | "SIMULATE_PIPELINE"
  | "EXPORT_DATASET_SUMMARY"
  | "DETECT_ARCHITECTURE_DRIFT"
  | "ANALYZE_CHANGE_IMPACT"
  | "START_ENGINEERING_MISSION"
  | "RECORD_ARCHITECTURE_DECISION"
  | "COMPARE_TIME_MACHINE_SNAPSHOTS"
  | "RUN_SIMULATION_SCENARIO"
  | "EVALUATE_ENGINEERING_POLICIES";

export interface CopilotAction {
  id: string;
  label: string;
  actionType: ActionType;
  payload?: Record<string, unknown> | undefined;
  isHighImpact?: boolean;
}

export interface CopilotMessage {
  id: string;
  sender: "USER" | "ASSISTANT" | "SYSTEM";
  text: string;
  timestamp: string;
  mode: AppMode;
  metadata?:
    | {
        model?: AIModelType | undefined;
        citations?: string[] | undefined;
        suggestedActions?: CopilotAction[] | undefined;
        reasoningDurationMs?: number | undefined;
        verificationHash?: string | undefined;
        evidence?: Record<string, unknown> | undefined;
        planId?: string | undefined;
      }
    | undefined;
}

export interface CopilotModeSession {
  messages: CopilotMessage[];
  isLoading: boolean;
  activeModel: AIModelType;
  activeSpecialist?: string | undefined;
  pendingApproval?: CopilotAction | null | undefined;
  activePlan?: DynamicExecutionPlan | null | undefined;
  executionStatus?: "IDLE" | "PLANNING" | "EXECUTING" | "PAUSED" | "COMPLETED" | "FAILED" | undefined;
  context: {
    datasetId?: string | undefined;
    lastRunId?: string | undefined;
    selectedEntityId?: string | undefined;
  };
}

export interface CopilotState {
  isDrawerOpen: boolean;
  viewMode: CopilotViewMode;
  activeTab: CopilotTab;
  normalSession: CopilotModeSession;
  demoSession: CopilotModeSession;
}

type CopilotListener = (state: CopilotState) => void;

function createInitialSession(mode: AppMode): CopilotModeSession {
  const initialGreeting: CopilotMessage = {
    id: `msg_init_${mode}`,
    sender: "ASSISTANT",
    text:
      mode === "NORMAL"
        ? "Welcome to Vyron AI Copilot (Production Mode). I am the application-native intelligence layer across your workspace. I can coordinate live 12-stage analysis, enforce schema quality contracts, inspect AST code health, and govern MCP connectors with verifiable cryptographic provenance."
        : "Welcome to Vyron AI Copilot (Demo Simulation Mode). I am your technical demonstration narrator and reviewer co-pilot, actively monitoring the isolated IEEE-CIS benchmark and synthetic domain event streams. All actions run in a safe sandbox with zero live production write risks.",
    timestamp: new Date().toISOString(),
    mode,
    metadata: {
      model: "CLAUDE_SONNET",
      suggestedActions:
        mode === "NORMAL"
          ? [
              { id: "act_1", label: "Run Full 12-Stage Analysis", actionType: "RUN_ANALYSIS" },
              {
                id: "act_2",
                label: "Inspect Data Contracts",
                actionType: "VIEW_STAGE",
                payload: { stageId: 2 },
              },
              { id: "act_drift", label: "Detect Architecture Drift", actionType: "DETECT_ARCHITECTURE_DRIFT" },
              { id: "act_mission", label: "Start Verification Mission", actionType: "START_ENGINEERING_MISSION" },
            ]
          : [
              {
                id: "act_demo_1",
                label: "Trigger High-Velocity Anomaly Wave",
                actionType: "INJECT_ANOMALY",
              },
              {
                id: "act_demo_2",
                label: "Explain IQR Threshold Deviations",
                actionType: "VIEW_STAGE",
                payload: { stageId: 5 },
              },
              { id: "act_sim", label: "Run Simulation Scenario", actionType: "RUN_SIMULATION_SCENARIO" },
              { id: "act_rst", label: "Reset Demo Baseline", actionType: "RESET_DEMO" },
            ],
    },
  };

  return {
    messages: [initialGreeting],
    isLoading: false,
    activeModel: "CLAUDE_SONNET",
    pendingApproval: null,
    activePlan: null,
    executionStatus: "IDLE",
    context: {},
  };
}

class CopilotStore {
  private state: CopilotState;
  private listeners: Set<CopilotListener> = new Set();

  constructor() {
    this.state = {
      isDrawerOpen: false,
      viewMode: "DRAWER",
      activeTab: "chat",
      normalSession: createInitialSession("NORMAL"),
      demoSession: createInitialSession("DEMO"),
    };
  }

  public getState(): CopilotState {
    return this.state;
  }

  public getSession(mode: AppMode): CopilotModeSession {
    return mode === "NORMAL" ? this.state.normalSession : this.state.demoSession;
  }

  public subscribe(listener: CopilotListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  public setDrawerOpen(isOpen: boolean) {
    this.state.isDrawerOpen = isOpen;
    this.emit();
  }

  public toggleDrawer() {
    this.setDrawerOpen(!this.state.isDrawerOpen);
  }

  public setViewMode(mode: CopilotViewMode) {
    this.state.viewMode = mode;
    this.emit();
  }

  public setActiveTab(tab: CopilotTab) {
    this.state.activeTab = tab;
    this.emit();
  }

  public setModel(mode: AppMode, model: AIModelType) {
    if (mode === "NORMAL") {
      this.state.normalSession.activeModel = model;
    } else {
      this.state.demoSession.activeModel = model;
    }
    this.emit();
  }

  public setLoading(mode: AppMode, isLoading: boolean) {
    if (mode === "NORMAL") {
      this.state.normalSession.isLoading = isLoading;
    } else {
      this.state.demoSession.isLoading = isLoading;
    }
    this.emit();
  }

  public setPendingApproval(mode: AppMode, action: CopilotAction | null) {
    if (mode === "NORMAL") {
      this.state.normalSession.pendingApproval = action;
    } else {
      this.state.demoSession.pendingApproval = action;
    }
    this.emit();
  }

  public setActiveSpecialist(mode: AppMode, specialistName?: string) {
    if (mode === "NORMAL") {
      this.state.normalSession.activeSpecialist = specialistName;
    } else {
      this.state.demoSession.activeSpecialist = specialistName;
    }
    this.emit();
  }

  public addMessage(
    mode: AppMode,
    message: Omit<CopilotMessage, "id" | "timestamp" | "mode">,
  ): CopilotMessage {
    const fullMsg: CopilotMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      mode,
    };

    if (mode === "NORMAL") {
      this.state.normalSession.messages.push(fullMsg);
    } else {
      this.state.demoSession.messages.push(fullMsg);
    }

    this.emit();
    return fullMsg;
  }

  public clearMessages(mode: AppMode) {
    if (mode === "NORMAL") {
      this.state.normalSession = createInitialSession("NORMAL");
    } else {
      this.state.demoSession = createInitialSession("DEMO");
    }
    this.emit();
  }

  public updateContext(mode: AppMode, contextUpdates: Partial<CopilotModeSession["context"]>) {
    const session = mode === "NORMAL" ? this.state.normalSession : this.state.demoSession;
    Object.assign(session.context, contextUpdates);
    this.emit();
  }

  public setActivePlan(mode: AppMode, plan: DynamicExecutionPlan | null) {
    const session = mode === "NORMAL" ? this.state.normalSession : this.state.demoSession;
    session.activePlan = plan;
    this.emit();
  }

  public updatePlanStep(mode: AppMode, stepId: string, updates: Partial<PlanStep>) {
    const session = mode === "NORMAL" ? this.state.normalSession : this.state.demoSession;
    if (session.activePlan) {
      session.activePlan.steps = session.activePlan.steps.map((s) =>
        s.id === stepId ? { ...s, ...updates } : s,
      );
      this.emit();
    }
  }

  public setExecutionStatus(mode: AppMode, status: CopilotModeSession["executionStatus"]) {
    const session = mode === "NORMAL" ? this.state.normalSession : this.state.demoSession;
    session.executionStatus = status;
    this.emit();
  }
}

export const copilotStore = new CopilotStore();
