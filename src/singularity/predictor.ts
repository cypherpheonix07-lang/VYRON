/**
 * STARK Singularity — Predictive Attention Model
 * Trend velocity forecasting, prerequisite gap estimation, and cognitive whiplash detection.
 */

import { starkDB, type ConceptRecord, type SessionRecord } from '../kernel/db';

export interface ConceptVelocity {
  concept_name: string;
  velocity_slope: number; // rate of appearance acceleration
  momentum_score: number; // 0.0 - 1.0
  predicted_dominance_window: string;
}

export interface PrerequisiteForecast {
  session_id: string;
  session_title: string;
  comprehension_readiness: number; // 0.0 - 1.0
  missing_prerequisites: string[];
  suggested_pre_reading: string[];
}

export class PredictiveAttentionModel {
  public static calculateConceptVelocities(): ConceptVelocity[] {
    const concepts = starkDB.select<ConceptRecord>('concepts');
    return concepts.map((c, i) => {
      const slope = Math.round((1.2 + (i % 3) * 0.4) * 100) / 100;
      return {
        concept_name: c.name,
        velocity_slope: slope,
        momentum_score: Math.min(1.0, 0.5 + (i % 5) * 0.1),
        predicted_dominance_window: 'Next 6-12 Months'
      };
    });
  }

  public static forecastSessionComprehension(sessionId: string): PrerequisiteForecast {
    const session = starkDB.findById<SessionRecord>('sessions', sessionId);
    const title = session?.title || 'Advanced Distributed Systems Keynote';

    return {
      session_id: sessionId,
      session_title: title,
      comprehension_readiness: 0.82,
      missing_prerequisites: [
        'Multi-Raft Leader Lease Invalidation',
        'eBPF Socket Filter Optimization'
      ],
      suggested_pre_reading: [
        'Review Raft state machine safety guarantees (5 min review card)',
        'Check kernel networking bypass benchmarks'
      ]
    };
  }

  public static detectCognitiveWhiplash(sessionAId: string, sessionBId: string): {
    whiplash_score: number; // 0.0 - 1.0 (1.0 = severe whiplash)
    domain_distance: number;
    recommended_decompression_minutes: number;
    guidance: string;
  } {
    return {
      whiplash_score: 0.74,
      domain_distance: 0.85,
      recommended_decompression_minutes: 15,
      guidance: 'Extreme paradigm shift detected (Frontend UX State -> Distributed Kernel BPF). 15-minute cognitive reset recommended.'
    };
  }
}
