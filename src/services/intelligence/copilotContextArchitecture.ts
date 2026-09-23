/**
 * VYRON — P24: GROUNDED COPILOT CONTEXT ARCHITECTURE
 * Structured context anchoring, chain-of-thought scratchpad sanitization,
 * and empirical truth grounding for conversational copilot sessions.
 * Strictly ZERO operational raw SQL.
 */

import { SYSTEM_TRUTH_MANIFEST } from "@/config/truthManifest";

export interface GroundedContextPackage {
  userPrompt: string;
  sanitizedPrompt: string;
  systemTruthSummary: string;
  truthAnchors: string[];
  builtAt: string;
}

export class CopilotContextArchitecture {
  /**
   * Sanitizes <think> and <scratchpad> tags from model output.
   */
  public static sanitizeModelOutput(rawOutput: string): string {
    return rawOutput
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/<scratchpad>[\s\S]*?<\/scratchpad>/gi, "")
      .trim();
  }

  public static buildGroundedContext(userPrompt: string): GroundedContextPackage {
    const sanitizedPrompt = userPrompt.trim();
    const manifest = SYSTEM_TRUTH_MANIFEST;

    const truthAnchors = [
      `Internally Verified Capabilities: ${manifest.summary.internallyVerified}`,
      `Quarantined External Blockers: ${manifest.summary.externallyBlockedQuarantined} (Supabase Cloud HTTP 401, Kaggle Gateway)`,
      "Operational Raw SQL: 0 (Strict typed store invariant)"
    ];

    const systemTruthSummary = `VYRON ENGINEERING INTELLIGENCE PLATFORM (Truth Lock Active: ${manifest.summary.internallyVerified} Verified, ${manifest.summary.externallyBlockedQuarantined} Quarantined)`;

    return {
      userPrompt,
      sanitizedPrompt,
      systemTruthSummary,
      truthAnchors,
      builtAt: new Date().toISOString()
    };
  }
}
