/**
 * PROJECT BRAHMA — LAYERED COPILOT MEMORY STORE
 * Multi-tier memory architecture:
 * 1. Session Memory: Temporary conversation items.
 * 2. Task Memory: Active analytical task / plan steps.
 * 3. Project Memory: Long-lived project decisions, verified architecture facts.
 * 4. Workspace Memory: Workspace-level connector preferences.
 * 5. User Preferences Memory: Model, speed, notification preferences.
 * 6. Analysis Memory: Key findings, historical risk trends.
 * 7. Demo Scenario Memory: Strictly isolated benchmark observations.
 *
 * Guarantees:
 * - Demo mode memory NEVER leaks into production.
 * - Project memories are isolated by projectId.
 * - Supports memory inspection and granular memory reset.
 * Strictly ZERO SQL.
 */

import { AppMode } from "@/state/mode/modeStore";

export type MemoryLayer =
  | "SESSION"
  | "TASK"
  | "PROJECT"
  | "WORKSPACE"
  | "PREFERENCES"
  | "ANALYSIS"
  | "DEMO_SCENARIO";

export interface MemoryEntry {
  id: string;
  layer: MemoryLayer;
  key: string;
  value: string;
  projectId?: string;
  mode: AppMode;
  createdAt: string;
  updatedAt: string;
  confidence: number; // 0 to 1
  provenance: string; // E.g., "Stage 5 IQR Detector", "User Instruction", "Kaggle Connector"
}

export class CopilotMemory {
  private static instance: CopilotMemory | null = null;
  private entries: Map<string, MemoryEntry> = new Map();

  private constructor() {
    this.seedDefaultPreferences();
  }

  public static getInstance(): CopilotMemory {
    if (!CopilotMemory.instance) {
      CopilotMemory.instance = new CopilotMemory();
    }
    return CopilotMemory.instance;
  }

  private seedDefaultPreferences() {
    this.remember({
      layer: "PREFERENCES",
      key: "preferred_model",
      value: "CLAUDE_SONNET",
      mode: "NORMAL",
      confidence: 1.0,
      provenance: "System Defaults",
    });
    this.remember({
      layer: "PROJECT",
      key: "contract_enforcement",
      value: "Strict non-null contracts on monetary amounts and user identities",
      projectId: "prj-prod-brahma",
      mode: "NORMAL",
      confidence: 0.95,
      provenance: "Architecture Blueprint",
    });
    this.remember({
      layer: "DEMO_SCENARIO",
      key: "active_benchmark",
      value: "IEEE-CIS Credit Card Fraud Detection benchmark with 12,480 synthetic transactions",
      mode: "DEMO",
      confidence: 1.0,
      provenance: "Demo Engine Seed",
    });
  }

  public remember(entry: Omit<MemoryEntry, "id" | "createdAt" | "updatedAt">): MemoryEntry {
    const id = `mem_${entry.layer.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const fullEntry: MemoryEntry = {
      ...entry,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Use a deterministic composite key
    const compositeKey = `${entry.mode}:${entry.layer}:${entry.projectId || "global"}:${entry.key}`;
    this.entries.set(compositeKey, fullEntry);
    return fullEntry;
  }

  public recall(key: string, layer: MemoryLayer, mode: AppMode, projectId?: string): MemoryEntry | null {
    const compositeKey = `${mode}:${layer}:${projectId || "global"}:${key}`;
    return this.entries.get(compositeKey) || null;
  }

  public listMemories(mode: AppMode, projectId?: string): MemoryEntry[] {
    const results: MemoryEntry[] = [];
    for (const entry of this.entries.values()) {
      if (entry.mode === mode) {
        if (!entry.projectId || entry.projectId === projectId || entry.projectId === "global") {
          results.push(entry);
        }
      }
    }
    return results;
  }

  public clearLayer(layer: MemoryLayer, mode: AppMode, projectId?: string): void {
    for (const [k, v] of this.entries.entries()) {
      if (v.mode === mode && v.layer === layer) {
        if (!projectId || v.projectId === projectId) {
          this.entries.delete(k);
        }
      }
    }
  }

  public clearAll(mode?: AppMode): void {
    if (!mode) {
      this.entries.clear();
      this.seedDefaultPreferences();
    } else {
      for (const [k, v] of this.entries.entries()) {
        if (v.mode === mode) {
          this.entries.delete(k);
        }
      }
      if (mode === "NORMAL") {
        this.seedDefaultPreferences();
      }
    }
  }
}

export const copilotMemory = CopilotMemory.getInstance();
