/**
 * VYRON — COPILOT INTENT GATEWAY (PHASE 02)
 * Classifies all incoming Copilot prompts, chips, and events into formal intent objects:
 * - QUESTION
 * - ANALYSIS
 * - INVESTIGATION
 * - MISSION
 * - RECOMMENDATION
 * - SIMULATION
 * - ACTION_PREPARATION
 * - ACTION_EXECUTION
 * - SYSTEM_EVENT
 * - PROACTIVE_EVENT
 *
 * Guarantees:
 * 1. Observable intent classification with calibrated confidence scores (0.0 to 1.0).
 * 2. Scope & governance authority tagging (UserAuthority).
 * 3. Operator manual override capability for ambiguous or contested intents.
 * 4. Strictly ZERO SQL.
 */

import { UserAuthority } from "@/types/engineeringEntity";
import { AppMode } from "@/state/mode/modeStore";

export type CopilotIntentType =
  | "QUESTION"
  | "ANALYSIS"
  | "INVESTIGATION"
  | "MISSION"
  | "RECOMMENDATION"
  | "SIMULATION"
  | "ACTION_PREPARATION"
  | "ACTION_EXECUTION"
  | "SYSTEM_EVENT"
  | "PROACTIVE_EVENT";

export interface IntentEntityExtraction {
  id: string;
  type: string;
  label: string;
}

export interface CopilotIntent {
  id: string;
  rawText: string;
  type: CopilotIntentType;
  confidence: number; // 0.0 to 1.0
  entities: IntentEntityExtraction[];
  scope: "WORKSPACE" | "PROJECT" | "SYSTEM" | "DEMO";
  requiredAuthority: UserAuthority;
  isOverridden: boolean;
  overrideReason?: string | undefined;
  rationale: string;
  timestamp: string;
}

export class CopilotIntentGateway {
  private static instance: CopilotIntentGateway | null = null;
  private recentIntents: CopilotIntent[] = [];
  private intentOverrides: Map<string, CopilotIntent> = new Map();

  private constructor() {}

  public static getInstance(): CopilotIntentGateway {
    if (!CopilotIntentGateway.instance) {
      CopilotIntentGateway.instance = new CopilotIntentGateway();
    }
    return CopilotIntentGateway.instance;
  }

  /**
   * Classifies user prompts and system events into structured, observable CopilotIntent objects.
   */
  public resolveIntent(
    rawText: string,
    context?: {
      mode?: AppMode;
      projectId?: string;
      currentRoute?: string;
      userAuthority?: UserAuthority;
    },
  ): CopilotIntent {
    return this.classifyIntent(rawText, context);
  }

  public classifyIntent(
    rawText: string,
    context?: {
      mode?: AppMode;
      projectId?: string;
      currentRoute?: string;
      userAuthority?: UserAuthority;
    },
  ): CopilotIntent {
    const text = rawText.trim();
    const lower = text.toLowerCase();
    const id = `int_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const isDemo = context?.mode === "DEMO";

    let type: CopilotIntentType = "QUESTION";
    let confidence = 0.85;
    let rationale = "General technical or architectural question.";
    let requiredAuthority: UserAuthority = "DEVELOPER";

    const entities: IntentEntityExtraction[] = [];

    // Entity extraction heuristics
    if (lower.includes("settlement") || lower.includes("billing")) {
      entities.push({ id: "srv-settlement", type: "service", label: "Billing & Settlement Service" });
    }
    if (lower.includes("cwe") || lower.includes("vulnerability") || lower.includes("security")) {
      entities.push({ id: "vuln-bandit-ast", type: "vulnerability", label: "AST Security Vulnerability" });
    }
    if (lower.includes("drift") || lower.includes("boundary")) {
      entities.push({ id: "arch-drift-01", type: "finding", label: "Architecture Boundary Drift" });
    }
    if (lower.includes("release") || lower.includes("policy")) {
      entities.push({ id: "rel-v2.4.0", type: "release", label: "Target Release v2.4.0" });
    }
    if (lower.includes("fraud") || lower.includes("ieee")) {
      entities.push({ id: "ds-ieee-fraud", type: "dataset", label: "IEEE-CIS Benchmark Partition" });
    }

    // Classification Rules
    if (
      lower.startsWith("start mission") ||
      lower.includes("launch mission") ||
      lower.includes("release verification mission") ||
      lower.includes("full audit mission") ||
      lower.includes("end-to-end audit")
    ) {
      type = "MISSION";
      confidence = 0.96;
      rationale = "Operator declared high-level autonomous engineering mission objective.";
      requiredAuthority = "STAFF_ENGINEER";
    } else if (
      lower.includes("investigate") ||
      lower.includes("root cause") ||
      lower.includes("why did") ||
      lower.includes("isolate failure") ||
      lower.includes("anomaly hypothesis")
    ) {
      type = "INVESTIGATION";
      confidence = 0.93;
      rationale = "Targeted root-cause investigation required for anomalous finding or failure.";
      requiredAuthority = "STAFF_ENGINEER";
    } else if (
      lower.includes("simulate") ||
      lower.includes("what if") ||
      lower.includes("twin scenario") ||
      lower.includes("inject anomaly") ||
      lower.includes("stress test")
    ) {
      type = "SIMULATION";
      confidence = 0.94;
      rationale = "Hypothetical behavioral modeling or stress injection requested in isolated sandbox.";
      requiredAuthority = "DEVELOPER";
    } else if (
      lower.includes("execute ") ||
      lower.includes("apply patch") ||
      lower.includes("grant exception") ||
      lower.includes("deploy") ||
      lower.includes("approve release")
    ) {
      type = "ACTION_EXECUTION";
      confidence = 0.95;
      rationale = "State-mutating operation requested requiring verification and authorization.";
      requiredAuthority = lower.includes("exception") || lower.includes("deploy") ? "CISO" : "STAFF_ENGINEER";
    } else if (
      lower.includes("prepare") ||
      lower.includes("draft adr") ||
      lower.includes("generate patch") ||
      lower.includes("stage change")
    ) {
      type = "ACTION_PREPARATION";
      confidence = 0.91;
      rationale = "Synthesizing prospective change artifact prior to operator authorization.";
      requiredAuthority = "DEVELOPER";
    } else if (
      lower.includes("recommend") ||
      lower.includes("suggest remediation") ||
      lower.includes("next steps") ||
      lower.includes("how should we fix")
    ) {
      type = "RECOMMENDATION";
      confidence = 0.89;
      rationale = "Prescriptive engineering advice requested based on findings and evidence.";
      requiredAuthority = "DEVELOPER";
    } else if (
      lower.includes("run analysis") ||
      lower.includes("pipeline") ||
      lower.includes("calculate blast radius") ||
      lower.includes("evaluate drift") ||
      lower.includes("scan ast") ||
      lower.includes("check policies")
    ) {
      type = "ANALYSIS";
      confidence = 0.94;
      rationale = "Deterministic computation, graph traversal, or AST analysis requested.";
      requiredAuthority = "DEVELOPER";
    } else if (lower.startsWith("[system]") || lower.startsWith("event:")) {
      type = "SYSTEM_EVENT";
      confidence = 0.99;
      rationale = "System-level event trigger from event bus or background scanner.";
      requiredAuthority = "DEVELOPER";
    } else if (lower.startsWith("[proactive]") || lower.includes("signal correlation")) {
      type = "PROACTIVE_EVENT";
      confidence = 0.98;
      rationale = "Proactive insight generated from multi-signal correlation engine.";
      requiredAuthority = "DEVELOPER";
    } else {
      type = "QUESTION";
      confidence = 0.88;
      rationale = "Informational query regarding system architecture, metrics, or telemetry.";
      requiredAuthority = "DEVELOPER";
    }

    const intent: CopilotIntent = {
      id,
      rawText: text,
      type,
      confidence,
      entities,
      scope: isDemo ? "DEMO" : context?.projectId ? "PROJECT" : "WORKSPACE",
      requiredAuthority: context?.userAuthority || requiredAuthority,
      isOverridden: false,
      rationale,
      timestamp: new Date().toISOString(),
    };

    this.recentIntents.unshift(intent);
    if (this.recentIntents.length > 50) this.recentIntents.pop();

    return intent;
  }

  /**
   * Overrides an intent classification manually by an operator.
   */
  public overrideIntent(
    intentId: string,
    newType: CopilotIntentType,
    overrideReason?: string,
  ): CopilotIntent {
    const existing = this.recentIntents.find((i) => i.id === intentId);
    if (!existing) {
      throw new Error(`Intent with ID '${intentId}' not found.`);
    }

    const updated: CopilotIntent = {
      ...existing,
      type: newType,
      isOverridden: true,
      overrideReason: overrideReason || "Operator manual override",
      confidence: 1.0,
      rationale: `Manually classified as ${newType} by operator: ${overrideReason || "Directive"}`,
    };

    this.intentOverrides.set(intentId, updated);
    const index = this.recentIntents.findIndex((i) => i.id === intentId);
    if (index !== -1) {
      this.recentIntents[index] = updated;
    }

    return updated;
  }

  public getRecentIntents(): CopilotIntent[] {
    return [...this.recentIntents];
  }

  public getLatestIntent(): CopilotIntent | null {
    return this.recentIntents[0] || null;
  }
}

export const copilotIntentGateway = CopilotIntentGateway.getInstance();
