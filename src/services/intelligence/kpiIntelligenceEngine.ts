/**
 * VYRON — P21: ENGINEERING HEALTH & PERFORMANCE KPI INTELLIGENCE
 * Multi-pillar engineering health index, DORA velocity integration,
 * technical debt quantification, and automated degradation alerts.
 * Strictly ZERO operational raw SQL.
 */

export interface HealthPillarScores {
  codeHealth: number;       // 0 to 100 (CCN, coverage, dead code)
  architectureHealth: number; // 0 to 100 (drift, modularity, cycles)
  operationalHealth: number;  // 0 to 100 (DORA, latency, error rate)
  securityHealth: number;     // 0 to 100 (STRIDE threats, zero raw SQL)
}

export interface SystemHealthIndex {
  compositeScore: number; // 0 to 100
  pillars: HealthPillarScores;
  rating: "OPTIMAL" | "NOMINAL" | "DEGRADED" | "CRITICAL";
  alerts: string[];
  calculatedAt: string;
}

export class KpiIntelligenceEngine {
  private static readonly WEIGHTS = {
    code: 0.25,
    architecture: 0.25,
    operational: 0.25,
    security: 0.25
  };

  public static calculateHealthIndex(scores: HealthPillarScores): SystemHealthIndex {
    const compositeScore = Math.round(
      scores.codeHealth * this.WEIGHTS.code +
      scores.architectureHealth * this.WEIGHTS.architecture +
      scores.operationalHealth * this.WEIGHTS.operational +
      scores.securityHealth * this.WEIGHTS.security
    );

    const alerts: string[] = [];
    if (scores.codeHealth < 70) alerts.push("High code complexity / technical debt detected.");
    if (scores.architectureHealth < 70) alerts.push("Architectural drift or cyclic dependencies present.");
    if (scores.operationalHealth < 70) alerts.push("Operational SLO / DORA metrics degraded.");
    if (scores.securityHealth < 90) alerts.push("Security policy violations or unmitigated STRIDE threats.");

    let rating: "OPTIMAL" | "NOMINAL" | "DEGRADED" | "CRITICAL" = "OPTIMAL";
    if (compositeScore < 50 || scores.securityHealth < 50) {
      rating = "CRITICAL";
    } else if (compositeScore < 75) {
      rating = "DEGRADED";
    } else if (compositeScore < 90) {
      rating = "NOMINAL";
    }

    return {
      compositeScore,
      pillars: scores,
      rating,
      alerts,
      calculatedAt: new Date().toISOString()
    };
  }
}
