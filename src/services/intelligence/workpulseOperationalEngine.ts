/**
 * VYRON — P20: WORKPULSE OPERATIONAL PULSE ENGINE
 * Real-time operational intelligence, DORA 4 metrics calculation,
 * developer velocity metrics, and sub-50ms event stream partitioning.
 * Strictly ZERO operational raw SQL.
 */

export interface DoraMetricsSummary {
  deploymentFrequencyPerDay: number;
  leadTimeForChangesMinutes: number;
  changeFailureRatePercentage: number;
  meanTimeToRestoreMinutes: number;
  rating: "ELITE" | "HIGH" | "MEDIUM" | "LOW";
}

export interface WorkpulseEvent {
  id: string;
  timestamp: number;
  category: "COMMIT" | "PR" | "DEPLOYMENT" | "INCIDENT" | "HEALTH_CHECK";
  payload: Record<string, unknown>;
}

export class WorkpulseOperationalEngine {
  public static calculateDora(
    deploymentsCount: number,
    days: number,
    leadTimes: number[],
    failuresCount: number,
    restorationTimes: number[]
  ): DoraMetricsSummary {
    const deploymentFrequencyPerDay = days > 0 ? Math.round((deploymentsCount / days) * 10) / 10 : 0;
    const avgLeadTime = leadTimes.length > 0 ? leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length : 0;
    const changeFailureRatePercentage = deploymentsCount > 0 ? Math.round((failuresCount / deploymentsCount) * 1000) / 10 : 0;
    const avgMttr = restorationTimes.length > 0 ? restorationTimes.reduce((a, b) => a + b, 0) / restorationTimes.length : 0;

    let rating: "ELITE" | "HIGH" | "MEDIUM" | "LOW" = "HIGH";
    if (deploymentFrequencyPerDay >= 1 && avgLeadTime <= 60 && changeFailureRatePercentage <= 5) {
      rating = "ELITE";
    } else if (changeFailureRatePercentage > 15 || avgMttr > 240) {
      rating = "MEDIUM";
    }

    return {
      deploymentFrequencyPerDay,
      leadTimeForChangesMinutes: Math.round(avgLeadTime),
      changeFailureRatePercentage,
      meanTimeToRestoreMinutes: Math.round(avgMttr),
      rating
    };
  }

  /**
   * Partitions an event stream into category buckets with strict sub-50ms performance.
   */
  public static partitionEvents(events: WorkpulseEvent[]): {
    buckets: Record<string, WorkpulseEvent[]>;
    durationMs: number;
    count: number;
  } {
    const start = performance.now();
    const buckets: Record<string, WorkpulseEvent[]> = {
      COMMIT: [],
      PR: [],
      DEPLOYMENT: [],
      INCIDENT: [],
      HEALTH_CHECK: []
    };

    for (let i = 0; i < events.length; i++) {
      const ev = events[i]!;
      const bucket = buckets[ev.category];
      if (bucket) {
        bucket.push(ev);
      }
    }

    const durationMs = performance.now() - start;

    return {
      buckets,
      durationMs: Math.round(durationMs * 100) / 100,
      count: events.length
    };
  }

  public static getCompositePulseScore(dora: DoraMetricsSummary, errorRate: number): number {
    let score = 100;
    if (dora.rating === "HIGH") score -= 5;
    if (dora.rating === "MEDIUM") score -= 15;
    if (dora.rating === "LOW") score -= 30;

    score -= Math.min(30, errorRate * 100);
    return Math.max(0, Math.round(score));
  }
}
