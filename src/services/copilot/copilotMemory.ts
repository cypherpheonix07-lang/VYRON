/**
 * PROJECT BRAHMA / VYRON — LAYERED COPILOT MEMORY STORE (PHASE 06)
 * Multi-tier memory architecture with Epistemic Metadata:
 * 1. SESSION: Transient conversation items & working hypotheses.
 * 2. TASK: Active analytical task / plan steps & DAG states.
 * 3. PROJECT: Long-lived architectural decisions & verified ground-truth facts.
 * 4. WORKSPACE: Workspace-level connector preferences & team conventions.
 * 5. PREFERENCES: Model selection, response brevity, notifications.
 * 6. ANALYSIS: Key stage findings, historical risk trends, IQR thresholds.
 * 7. DEMO_SCENARIO: Strictly isolated benchmark observations & simulation states.
 *
 * Epistemic Metadata:
 * - epistemicType (FACT, OBSERVATION, INFERENCE, HYPOTHESIS, DECISION, RECOMMENDATION)
 * - source, authority, confidence, freshness, expiry, provenance, scope, sensitivity, status
 *
 * Guarantees:
 * - Demo mode memory NEVER leaks into production.
 * - Project memories are strictly isolated by projectId.
 * - Supports granular search, layer filtering, and layer reset.
 * Strictly ZERO SQL.
 */

import { AppMode } from "@/state/mode/modeStore";
import { UserAuthority } from "@/types/engineeringEntity";
import { EpistemicKnowledgeState } from "./copilotEpistemicEngine";

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
  epistemicType?: EpistemicKnowledgeState | undefined;
  source?: string | undefined;
  authority?: UserAuthority | undefined;
  freshness?: string | undefined;
  expiry?: string | undefined;
  scope?: "GLOBAL" | "PROJECT" | "WORKSPACE" | "DEMO" | undefined;
  sensitivity?: "PUBLIC" | "INTERNAL" | "RESTRICTED" | undefined;
  status?: "ACTIVE" | "STALE" | "SUPERSEDED" | "EXPIRED" | undefined;
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

  private seedDefaultPreferences(): void {
    this.remember({
      layer: "PREFERENCES",
      key: "preferred_model",
      value: "CLAUDE_SONNET",
      mode: "NORMAL",
      epistemicType: "FACT",
      authority: "DEVELOPER",
      scope: "WORKSPACE",
      sensitivity: "INTERNAL",
      status: "ACTIVE",
      confidence: 1.0,
      provenance: "System Defaults",
    });
    this.remember({
      layer: "PROJECT",
      key: "contract_enforcement",
      value: "Strict non-null contracts on monetary amounts and user identities",
      projectId: "prj-prod-brahma",
      mode: "NORMAL",
      epistemicType: "FACT",
      authority: "CHIEF_ARCHITECT",
      scope: "PROJECT",
      sensitivity: "INTERNAL",
      status: "ACTIVE",
      confidence: 0.95,
      provenance: "Architecture Blueprint",
    });
    this.remember({
      layer: "DEMO_SCENARIO",
      key: "active_benchmark",
      value: "IEEE-CIS Credit Card Fraud Detection benchmark with 12,480 synthetic transactions",
      mode: "DEMO",
      epistemicType: "SIMULATION_RESULT",
      authority: "DEVELOPER",
      scope: "DEMO",
      sensitivity: "PUBLIC",
      status: "ACTIVE",
      confidence: 1.0,
      provenance: "Demo Engine Seed",
    });
  }

  public remember(entry: Omit<MemoryEntry, "id" | "createdAt" | "updatedAt">): MemoryEntry {
    const id = `mem_${entry.layer.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const fullEntry: MemoryEntry = {
      ...entry,
      id,
      epistemicType: entry.epistemicType || (entry.mode === "DEMO" ? "SIMULATION_RESULT" : "FACT"),
      authority: entry.authority || "DEVELOPER",
      scope: entry.scope || (entry.mode === "DEMO" ? "DEMO" : entry.projectId ? "PROJECT" : "WORKSPACE"),
      sensitivity: entry.sensitivity || "INTERNAL",
      status: entry.status || "ACTIVE",
      freshness: now,
      createdAt: now,
      updatedAt: now,
    };

    // Deterministic composite key
    const compositeKey = `${entry.mode}:${entry.layer}:${entry.projectId || "global"}:${entry.key}`;
    this.entries.set(compositeKey, fullEntry);
    return fullEntry;
  }

  public recall(key: string, layer: MemoryLayer, mode: AppMode, projectId?: string): MemoryEntry | null {
    const compositeKey = `${mode}:${layer}:${projectId || "global"}:${key}`;
    return this.entries.get(compositeKey) || null;
  }

  public listMemories(
    mode: AppMode,
    projectId?: string,
    filter?: {
      layer?: MemoryLayer;
      epistemicType?: EpistemicKnowledgeState;
      searchQuery?: string;
    },
  ): MemoryEntry[] {
    const results: MemoryEntry[] = [];
    const query = filter?.searchQuery?.toLowerCase();

    for (const entry of this.entries.values()) {
      if (entry.mode === mode) {
        if (!entry.projectId || entry.projectId === projectId || entry.projectId === "global") {
          if (filter?.layer && entry.layer !== filter.layer) continue;
          if (filter?.epistemicType && entry.epistemicType !== filter.epistemicType) continue;
          if (query && !entry.key.toLowerCase().includes(query) && !entry.value.toLowerCase().includes(query)) {
            continue;
          }
          results.push(entry);
        }
      }
    }
    return results;
  }

  public queryRelevant(query: string, mode: AppMode, projectId?: string): MemoryEntry[] {
    const q = query.toLowerCase();
    const all = this.listMemories(mode, projectId);
    return all
      .filter((m) => m.key.toLowerCase().includes(q) || m.value.toLowerCase().includes(q))
      .slice(0, 8);
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
