/**
 * STARK Singularity — Temporal Knowledge Reconstructor
 * Point-in-time state reconstruction, belief diffs, and epistemic timeline replay.
 */

import { starkDB, type ConceptRecord } from '../kernel/db';

export interface TimelineSnapshot {
  timestamp: string;
  total_concepts: number;
  average_confidence: number;
  dominant_topic: string;
  active_beliefs: string[];
}

export class TemporalKnowledgeReconstructor {
  public static reconstructPointInTime(targetIsoDate: string): TimelineSnapshot {
    const targetMs = new Date(targetIsoDate).getTime();
    const allConcepts = starkDB.select<ConceptRecord>('concepts');

    const historical = allConcepts.filter(c => {
      const firstSeen = c.first_seen_at ? new Date(c.first_seen_at).getTime() : 0;
      return firstSeen <= targetMs;
    });

    const avgConf = historical.length > 0
      ? historical.reduce((acc, c) => acc + (c.evidence_strength || 0.8), 0) / historical.length
      : 0;

    return {
      timestamp: targetIsoDate,
      total_concepts: historical.length,
      average_confidence: Math.round(avgConf * 100) / 100,
      dominant_topic: historical[0]?.category || 'Distributed Systems',
      active_beliefs: historical.slice(0, 5).map(c => c.name)
    };
  }

  public static compareTimelines(isoDateA: string, isoDateB: string): {
    gained_concepts: string[];
    confidence_shift: number;
    velocity_delta: number;
  } {
    const snapA = this.reconstructPointInTime(isoDateA);
    const snapB = this.reconstructPointInTime(isoDateB);

    return {
      gained_concepts: snapB.active_beliefs.filter(b => !snapA.active_beliefs.includes(b)),
      confidence_shift: Math.round((snapB.average_confidence - snapA.average_confidence) * 100) / 100,
      velocity_delta: snapB.total_concepts - snapA.total_concepts
    };
  }
}
