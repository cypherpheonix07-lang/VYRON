/**
 * PROJECT BRAHMA — APPLICATION MODE STORE
 * Governs NORMAL vs DEMO mode with strict boundaries.
 *
 * Strict Guarantees:
 * 1. Data Boundary: Demo mutations never write to production database.
 * 2. Context Boundary: Normal AI Copilot and Demo AI Copilot maintain strictly isolated state.
 * 3. Connector Boundary: Demo mode locks external write operations.
 */

export type AppMode = "NORMAL" | "DEMO";

export interface ModeState {
  mode: AppMode;
  isTransitioning: boolean;
  lastSwitchedAt: string;
  demoScenario: string;
}

type ModeListener = (state: ModeState) => void;

const STORAGE_KEY = "brahma_app_mode";
const SCENARIO_KEY = "brahma_demo_scenario";

class ModeStore {
  private state: ModeState;
  private listeners: Set<ModeListener> = new Set();

  constructor() {
    let initialMode: AppMode = "NORMAL";
    let initialScenario = "credit_card_fraud";

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "DEMO" || stored === "NORMAL") {
          initialMode = stored;
        }
        const storedScenario = localStorage.getItem(SCENARIO_KEY);
        if (storedScenario) {
          initialScenario = storedScenario;
        }
      } catch {
        // LocalStorage blocked
      }
    }

    this.state = {
      mode: initialMode,
      isTransitioning: false,
      lastSwitchedAt: new Date().toISOString(),
      demoScenario: initialScenario,
    };
  }

  public getState(): ModeState {
    return this.state;
  }

  public setMode(newMode: AppMode) {
    if (this.state.mode === newMode) return;

    this.state = {
      ...this.state,
      isTransitioning: true,
    };
    this.notify();

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, newMode);
        // Synchronize legacy key for backward compatibility
        localStorage.setItem("brahma_demo_mode_active", newMode === "DEMO" ? "true" : "false");
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      this.state = {
        ...this.state,
        mode: newMode,
        isTransitioning: false,
        lastSwitchedAt: new Date().toISOString(),
      };
      this.notify();
    }, 150);
  }

  public setDemoScenario(scenarioId: string) {
    this.state = {
      ...this.state,
      demoScenario: scenarioId,
    };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SCENARIO_KEY, scenarioId);
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public toggleMode() {
    this.setMode(this.state.mode === "NORMAL" ? "DEMO" : "NORMAL");
  }

  public subscribe(listener: ModeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const modeStore = new ModeStore();
