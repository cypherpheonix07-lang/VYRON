/**
 * PROJECT BRAHMA — DETERMINISTIC DEMO RESPONSE ENGINE (PHASE P, FL-03-C)
 * Pattern-matches user chat messages against classified intent pools.
 * Returns ground-truth responses with cryptographic citation markers and context isolation.
 */

import analysisIntents from "@/lib/chat-intents/analysis-intents.json";
import architectureIntents from "@/lib/chat-intents/architecture-intents.json";
import generalIntents from "@/lib/chat-intents/general-intents.json";

export interface DemoIntent {
  id: string;
  patterns: string[];
  response: string;
  category: string;
  citations?: { label: string; source: string; sha256: string }[] | undefined;
}

export interface DemoChatResponse {
  text: string;
  citations?: { label: string; source: string; sha256: string }[] | undefined;
  matchedIntentId?: string | undefined;
  confidence: number;
}

export class DemoResponseEngine {
  private intents: DemoIntent[];

  constructor() {
    this.intents = [
      ...(analysisIntents as DemoIntent[]),
      ...(architectureIntents as DemoIntent[]),
      ...(generalIntents as DemoIntent[]),
    ];
  }

  public match(message: string): DemoChatResponse {
    const cleanMsg = message.toLowerCase().trim();

    // Check for slash commands
    if (cleanMsg.startsWith("/")) {
      if (cleanMsg.includes("analyze") || cleanMsg.includes("scan")) {
        return this.getByIntentId("intent_security_failures");
      }
      if (cleanMsg.includes("gates")) {
        return this.getByIntentId("intent_gate_status");
      }
      if (cleanMsg.includes("blueprint") || cleanMsg.includes("architecture")) {
        return this.getByIntentId("intent_blueprint_topology");
      }
      if (cleanMsg.includes("dataset") || cleanMsg.includes("kaggle")) {
        return this.getByIntentId("intent_kaggle_dataset");
      }
      if (cleanMsg.includes("remediate") || cleanMsg.includes("fix")) {
        return this.getByIntentId("intent_remediation_plan");
      }
    }

    // Exact or partial pattern scoring
    let bestMatch: DemoIntent | null = null;
    let highestScore = 0;

    for (const intent of this.intents) {
      for (const pattern of intent.patterns) {
        const pat = pattern.toLowerCase();
        if (cleanMsg === pat) {
          return {
            text: intent.response,
            citations: intent.citations,
            matchedIntentId: intent.id,
            confidence: 1.0,
          };
        }

        if (cleanMsg.includes(pat)) {
          const score = pat.length / cleanMsg.length;
          if (score > highestScore) {
            highestScore = score;
            bestMatch = intent;
          }
        }
      }
    }

    if (bestMatch) {
      return {
        text: bestMatch.response,
        citations: bestMatch.citations,
        matchedIntentId: bestMatch.id,
        confidence: Math.max(0.7, highestScore),
      };
    }

    // Fallback contextual response maintaining immersion
    return {
      text: `In Demo Mode, I am focused on the **FinLedger Microservices Architecture** and its 7 architectural release gates [cite:FinLedger Benchmark:Telemetry Engine:fin009].\n\nYou can ask about our **8 HIGH security vulnerabilities**, **AST cyclomatic complexity hotspots**, or how to calibrate metrics using **Kaggle datasets**.`,
      citations: [
        { label: "FinLedger Benchmark", source: "Telemetry Engine", sha256: "fin009" },
      ],
      confidence: 0.5,
    };
  }

  private getByIntentId(id: string): DemoChatResponse {
    const found = this.intents.find((i) => i.id === id);
    if (found) {
      return {
        text: found.response,
        citations: found.citations,
        matchedIntentId: found.id,
        confidence: 0.95,
      };
    }
    return {
      text: "Processed request.",
      confidence: 0.5,
    };
  }
}

export const demoEngine = new DemoResponseEngine();
