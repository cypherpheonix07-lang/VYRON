/**
 * PROJECT BRAHMA — DUAL-MODE COPILOT STATE STORE
 * Enforces strict isolation between NORMAL mode context (production architecture, live data)
 * and DEMO mode context (synthetic datasets, simulated event streams).
 */

import { AppMode } from "../mode/modeStore";

export type AIModelType = "CLAUDE_SONNET" | "KIMI_K3" | "OPENAI_GPT4O" | "MOCK_DETERMINISTIC";

export interface CopilotAction {
  id: string;
  label: string;
  actionType:
    "RUN_ANALYSIS" | "FILTER_SEVERITY" | "APPLY_REMEDIATION" | "INJECT_ANOMALY" | "VIEW_STAGE";
  payload?: Record<string, unknown> | undefined;
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
      }
    | undefined;
}

export interface CopilotModeSession {
  messages: CopilotMessage[];
  isLoading: boolean;
  activeModel: AIModelType;
  context: {
    datasetId?: string | undefined;
    lastRunId?: string | undefined;
    selectedEntityId?: string | undefined;
  };
}

export interface CopilotState {
  isDrawerOpen: boolean;
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
        ? "Welcome to Brahma AI Copilot (Production Mode). I can assist you with running live 12-stage analysis, validating data contracts, inspecting repository architecture, and configuring MCP connectors."
        : "Welcome to Brahma AI Copilot (Demo Mode). I am connected to the isolated IEEE-CIS benchmark dataset and the real-time event simulator. Ask me to trigger anomalies, explain fraud scoring, or simulate traffic surges.",
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
            ]
          : [
              {
                id: "act_demo_1",
                label: "Trigger High-Velocity Fraud Wave",
                actionType: "INJECT_ANOMALY",
              },
              {
                id: "act_demo_2",
                label: "Explain IQR Threshold Deviations",
                actionType: "VIEW_STAGE",
                payload: { stageId: 5 },
              },
            ],
    },
  };

  return {
    messages: [initialGreeting],
    isLoading: false,
    activeModel: "CLAUDE_SONNET",
    context: {},
  };
}

class CopilotStore {
  private state: CopilotState;
  private listeners: Set<CopilotListener> = new Set();

  constructor() {
    this.state = {
      isDrawerOpen: false,
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
}

export const copilotStore = new CopilotStore();
