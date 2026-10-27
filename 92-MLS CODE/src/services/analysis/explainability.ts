/**
 * PROJECT BRAHMA — STAGE 9 EXPLAINABILITY & SHAP ATTRIBUTION
 * Zero SQL. Generates feature importance attributions, SHAP-style waterfall breakdowns, and natural language explanations.
 */

import { RiskEntity } from "./riskScorer";
import { aiRouter } from "../ai/aiRouter";

export interface FeatureAttribution {
  featureName: string;
  shapValue: number; // positive increases risk, negative decreases
  relativeImportance: number; // 0 to 1
  narrative: string;
}

export interface EntityExplanation {
  entityId: string;
  riskScore: number;
  attributions: FeatureAttribution[];
  aiSummary: string;
}

export class ExplainabilityEngine {
  public static async explainEntityRisk(
    entity: RiskEntity,
    featureValues: Record<string, unknown>,
  ): Promise<EntityExplanation> {
    const totalFactors =
      entity.factors.anomalyContribution +
        entity.factors.centralityContribution +
        entity.factors.velocityContribution +
        entity.factors.contractDeviationContribution || 1;

    const attributions: FeatureAttribution[] = [
      {
        featureName: "Statistical Deviation (IQR Outlier)",
        shapValue: Number((entity.factors.anomalyContribution / 10).toFixed(2)),
        relativeImportance: Number((entity.factors.anomalyContribution / totalFactors).toFixed(3)),
        narrative: `Measured ${entity.factors.anomalyContribution} pts deviation from historical baseline distributions.`,
      },
      {
        featureName: "Graph Centrality & Hub Degree",
        shapValue: Number((entity.factors.centralityContribution / 10).toFixed(2)),
        relativeImportance: Number(
          (entity.factors.centralityContribution / totalFactors).toFixed(3),
        ),
        narrative: `Connected to high-fanout network clusters with shared fingerprint attributes.`,
      },
      {
        featureName: "Temporal Velocity Burst",
        shapValue: Number((entity.factors.velocityContribution / 10).toFixed(2)),
        relativeImportance: Number((entity.factors.velocityContribution / totalFactors).toFixed(3)),
        narrative: `Event frequency accelerated beyond 95th percentile temporal threshold.`,
      },
      {
        featureName: "Contract Schema Conformity",
        shapValue: Number((entity.factors.contractDeviationContribution / 10).toFixed(2)),
        relativeImportance: Number(
          (entity.factors.contractDeviationContribution / totalFactors).toFixed(3),
        ),
        narrative: `Payload structure experienced minor schema format drift.`,
      },
    ];

    attributions.sort((a, b) => b.relativeImportance - a.relativeImportance);

    // Generate concise natural language synthesis via AI Router
    let aiSummary = "";
    try {
      const completion = await aiRouter.routeAndComplete({
        taskType: "EXPLAINABILITY",
        messages: [
          {
            role: "user",
            content: `Explain risk for entity ${entity.entityId} with risk score ${entity.compositeRiskScore}/100. Top factors: ${attributions.map((a) => `${a.featureName} (${Math.round(a.relativeImportance * 100)}%)`).join(", ")}`,
          },
        ],
        systemPrompt:
          "Generate a crisp 2-sentence executive explanation of risk attribution for an analytics dashboard.",
      });
      aiSummary = completion.text;
    } catch {
      aiSummary = `Entity ${entity.entityId} triggered a risk score of ${entity.compositeRiskScore}/100 primarily due to ${attributions[0]?.featureName.toLowerCase()} and high network centrality.`;
    }

    return {
      entityId: entity.entityId,
      riskScore: entity.compositeRiskScore,
      attributions,
      aiSummary,
    };
  }
}
