/**
 * PROJECT BRAHMA — STAGE 7 MULTI-FACTOR RISK SCORER
 * Zero SQL. Computes composite weighted risk index combining statistical, structural, and behavioral factors.
 */

export interface RiskEntity {
  entityId: string;
  compositeRiskScore: number; // 0 to 100
  tier: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  factors: {
    anomalyContribution: number;
    centralityContribution: number;
    velocityContribution: number;
    contractDeviationContribution: number;
  };
}

export interface RiskScoringResult {
  overallRiskScore: number;
  entityCount: number;
  tierDistribution: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  topRiskEntities: RiskEntity[];
}

export class RiskScorer {
  public static calculateCompositeRisk(
    entities: Array<{
      id: string;
      anomalyScore: number;
      centralityScore: number;
      velocityScore: number;
      contractDeviationScore: number;
    }>,
    weights: {
      anomaly: number;
      centrality: number;
      velocity: number;
      contractDeviation: number;
    } = { anomaly: 0.4, centrality: 0.25, velocity: 0.25, contractDeviation: 0.1 },
  ): RiskScoringResult {
    if (entities.length === 0) {
      return {
        overallRiskScore: 0,
        entityCount: 0,
        tierDistribution: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
        topRiskEntities: [],
      };
    }

    const scored: RiskEntity[] = [];
    let sumScore = 0;
    const tierDistribution = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

    for (const e of entities) {
      const aContrib = e.anomalyScore * weights.anomaly;
      const cContrib = e.centralityScore * 100 * weights.centrality;
      const vContrib = e.velocityScore * weights.velocity;
      const dContrib = e.contractDeviationScore * weights.contractDeviation;

      const totalScore = Math.min(
        100,
        Math.max(0, Math.round(aContrib + cContrib + vContrib + dContrib)),
      );
      sumScore += totalScore;

      let tier: RiskEntity["tier"] = "LOW";
      if (totalScore >= 80) {
        tier = "CRITICAL";
        tierDistribution.CRITICAL++;
      } else if (totalScore >= 60) {
        tier = "HIGH";
        tierDistribution.HIGH++;
      } else if (totalScore >= 35) {
        tier = "MEDIUM";
        tierDistribution.MEDIUM++;
      } else {
        tierDistribution.LOW++;
      }

      scored.push({
        entityId: e.id,
        compositeRiskScore: totalScore,
        tier,
        factors: {
          anomalyContribution: Math.round(aContrib),
          centralityContribution: Math.round(cContrib),
          velocityContribution: Math.round(vContrib),
          contractDeviationContribution: Math.round(dContrib),
        },
      });
    }

    scored.sort((a, b) => b.compositeRiskScore - a.compositeRiskScore);

    return {
      overallRiskScore: Math.round(sumScore / entities.length),
      entityCount: entities.length,
      tierDistribution,
      topRiskEntities: scored.slice(0, 20),
    };
  }
}
