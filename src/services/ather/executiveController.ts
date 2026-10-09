/**
 * PROJECT VYRON / ATHER — EXECUTIVE CONTROLLER (BRAIN 1)
 * Owns goals, task contracts, priorities, budgets, and stopping rules.
 *
 * Guarantees:
 * 1. Never invents hidden user objectives or overrides explicit instructions.
 * 2. Distinguishes ordinary conversation vs multi-step goals.
 * 3. Enforces execution budgets and deterministic stopping rules.
 * 4. Integrates request parsing with injection resistance (Scenario 3) and critique-separation (Scenario 2).
 */

import type {
  ParsedRequestContract,
  RequestIntent,
  ExecutionDepth,
  ResponseDetail,
} from "./types.ts";
import { atherCriticSystem } from "./criticSystem.ts";
import { atherWorldModel } from "./worldModel.ts";

export interface ExecutionBudget {
  timeBudgetMs: number;
  maxToolCalls: number;
  maxTokens: number;
  maxAgentHops: number;
}

export class AtherExecutiveController {
  private static instance: AtherExecutiveController | null = null;

  private constructor() {}

  public static getInstance(): AtherExecutiveController {
    if (!AtherExecutiveController.instance) {
      AtherExecutiveController.instance = new AtherExecutiveController();
    }
    return AtherExecutiveController.instance;
  }

  /**
   * Decomposes and parses user prompt into a formal request contract.
   * Disentangles critique requests from execution requests (Scenario 2).
   * Neutralizes prompt injections before downstream handling (Scenario 3).
   */
  public parseRequest(rawText: string): ParsedRequestContract {
    const text = rawText.trim();
    const activeProject = atherWorldModel.getActiveProject();

    // 1. Sanitize & detect embedded commands / injections (Scenario 3)
    const { sanitized, blockedCommands } =
      atherCriticSystem.sanitizeAndDetectInjections(text);

    const lower = text.toLowerCase();

    // 2. Determine Intent & Critique vs Execution Separation (Scenario 2)
    let intent: RequestIntent = "QUESTION";
    let isCritiqueOnly = false;

    const critiqueTriggers = [
      "critique this prompt",
      "critique the following",
      "review this prompt",
      "evaluate this prompt",
      "critique:",
      "critique the prompt",
      "critique my prompt",
      "review the wording",
      "give feedback on this prompt",
      "analyze this prompt without running",
    ];

    const hasCritiqueTrigger = critiqueTriggers.some((ct) => lower.includes(ct));

    if (hasCritiqueTrigger) {
      intent = "CRITIQUE";
      isCritiqueOnly = true;
    } else if (
      lower.startsWith("execute ") ||
      lower.startsWith("apply ") ||
      lower.startsWith("deploy ") ||
      lower.startsWith("run mutation") ||
      lower.includes("apply patch")
    ) {
      intent = "EXECUTION";
    } else if (lower.includes("analyze dataset") || lower.includes("dataset analysis") || lower.includes("csv")) {
      intent = "ANALYSIS";
    } else if (lower.includes("investigate") || lower.includes("root cause")) {
      intent = "INVESTIGATION";
    } else if (lower.startsWith("start mission") || lower.includes("launch mission")) {
      intent = "MISSION";
    } else if (lower.includes("simulate") || lower.includes("rehearsal")) {
      intent = "SIMULATION";
    } else {
      intent = "QUESTION";
    }

    // 3. Format detection
    let requestedFormat: ParsedRequestContract["requestedFormat"] = "natural";
    if (lower.includes("in one sentence") || lower.includes("briefly") || lower.includes("concise") || lower.includes("short answer")) {
      requestedFormat = "concise";
    } else if (lower.includes("as a table") || lower.includes("markdown table") || lower.includes("tabular format")) {
      requestedFormat = "table";
    } else if (lower.includes("bullet points") || lower.includes("bulleted list")) {
      requestedFormat = "bulleted";
    } else if (lower.includes("json format") || lower.includes("as json")) {
      requestedFormat = "json";
    } else if (lower.includes("comprehensive report") || lower.includes("detailed breakdown")) {
      requestedFormat = "detailed_report";
    }

    // 4. Subtasks extraction (e.g. numbered questions, commas, multiple sentences)
    const subtasks: string[] = [];
    const numberedMatches = text.match(/\d+[\.)]\s*([^\n\r]+)/g);
    if (numberedMatches && numberedMatches.length > 0) {
      for (const m of numberedMatches) {
        subtasks.push(m.replace(/^\d+[\.)]\s*/, "").trim());
      }
    } else if (text.includes("?") && text.split("?").length > 2) {
      const parts = text.split("?").map((p) => p.trim()).filter((p) => p.length > 5);
      for (const p of parts) subtasks.push(`${p}?`);
    } else {
      subtasks.push(text);
    }

    return {
      rawText: text,
      objective: isCritiqueOnly ? `Critique and evaluate prompt: "${text}"` : text,
      intent,
      isCritiqueOnly,
      subtasks,
      requestedFormat,
      explicitConstraints: [
        "Do not invent fabricated telemetry or nonexistent endpoints",
        "Preserve active project isolation bounds",
      ],
      evidenceNeeds: ["Active project telemetry", "Verified architecture model"],
      completionConditions: ["Direct answer produced", "Critic checks satisfied"],
      sanitizedContent: sanitized,
      embeddedCommandsBlocked: blockedCommands,
      targetProjectId: activeProject.id,
    };
  }

  /**
   * Evaluates task execution budget from requested execution depth
   */
  public computeBudget(depth: ExecutionDepth): ExecutionBudget {
    switch (depth) {
      case "QUICK":
        return { timeBudgetMs: 5000, maxToolCalls: 1, maxTokens: 800, maxAgentHops: 1 };
      case "STANDARD":
        return { timeBudgetMs: 15000, maxToolCalls: 3, maxTokens: 2000, maxAgentHops: 2 };
      case "DEEP":
        return { timeBudgetMs: 45000, maxToolCalls: 8, maxTokens: 6000, maxAgentHops: 4 };
      case "INVESTIGATE":
        return { timeBudgetMs: 90000, maxToolCalls: 15, maxTokens: 12000, maxAgentHops: 6 };
      case "HIGH_ASSURANCE":
        return { timeBudgetMs: 180000, maxToolCalls: 25, maxTokens: 20000, maxAgentHops: 8 };
      case "AUTO":
      default:
        return { timeBudgetMs: 15000, maxToolCalls: 3, maxTokens: 2500, maxAgentHops: 2 };
    }
  }

  /**
   * Determines if a task requires multi-step autonomous DAG planning.
   * Invariant: Normal conversational questions and prompt critiques MUST NOT trigger planning!
   */
  public requiresAutonomousPlanning(contract: ParsedRequestContract, depth: ExecutionDepth): boolean {
    if (contract.isCritiqueOnly) return false;
    if (contract.intent === "QUESTION") return false;
    if (depth === "QUICK") return false;

    return (
      contract.intent === "MISSION" ||
      contract.intent === "INVESTIGATION" ||
      (contract.intent === "EXECUTION" && contract.subtasks.length > 2)
    );
  }
}

export const atherExecutiveController = AtherExecutiveController.getInstance();
