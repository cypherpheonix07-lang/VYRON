/**
 * VYRON — P35: PREDICTIVE RECOMMENDATION ENGINE & IMPACT FORECASTING
 * Multi-dimensional impact forecasting, latency change modeling,
 * technical debt reduction ROI, and ranking of refactoring proposals.
 * Strictly ZERO operational raw SQL.
 */

export interface ChangeProposal {
  id: string;
  title: string;
  category: "REFACTORING" | "INDEX_OPTIMIZATION" | "CACHE_INVERSION" | "DECOUPLING";
  estimatedEffortDays: number;
}

export interface ImpactForecast {
  proposalId: string;
  predictedLatencyDeltaPercent: number; // e.g. -25 for 25% improvement
  predictedErrorRateDeltaPercent: number;
  monthlyCostDeltaUsd: number;
  overallRoiScore: number; // 0 to 100
  evaluatedAt: string;
}

export class PredictiveRecommendationEngine {
  public static forecastImpact(proposal: ChangeProposal): ImpactForecast {
    let latencyDelta = 0;
    let errorDelta = 0;
    let costDelta = 0;

    switch (proposal.category) {
      case "CACHE_INVERSION":
        latencyDelta = -35; // 35% faster
        errorDelta = -5;
        costDelta = 15; // slightly higher Redis cost
        break;
      case "INDEX_OPTIMIZATION":
        latencyDelta = -50;
        errorDelta = -10;
        costDelta = 0;
        break;
      case "DECOUPLING":
        latencyDelta = -10;
        errorDelta = -30;
        costDelta = -50;
        break;
      case "REFACTORING":
      default:
        latencyDelta = -15;
        errorDelta = -20;
        costDelta = 0;
        break;
    }

    // ROI formula: (abs(latencyDelta) * 1.5 + abs(errorDelta) * 2) / (proposal.estimatedEffortDays || 1)
    const roi = Math.min(100, Math.round(((Math.abs(latencyDelta) * 1.5) + (Math.abs(errorDelta) * 2)) / (proposal.estimatedEffortDays || 1)));

    return {
      proposalId: proposal.id,
      predictedLatencyDeltaPercent: latencyDelta,
      predictedErrorRateDeltaPercent: errorDelta,
      monthlyCostDeltaUsd: costDelta,
      overallRoiScore: roi,
      evaluatedAt: new Date().toISOString()
    };
  }

  public static rankRecommendations(proposals: ChangeProposal[]): Array<{ proposal: ChangeProposal; forecast: ImpactForecast }> {
    return proposals
      .map((p) => ({ proposal: p, forecast: this.forecastImpact(p) }))
      .sort((a, b) => b.forecast.overallRoiScore - a.forecast.overallRoiScore);
  }
}
