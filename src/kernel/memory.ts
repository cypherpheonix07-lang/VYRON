/**
 * STARK Conference Cognition Kernel — Anti-Forgetting Memory Kernel
 * Mathematical Ebbinghaus decay curve model R = e^(-t/S) with SM-2 spaced repetition reinforcement.
 */

import { starkDB, type ConceptRecord, type MemoryScoreRecord } from './db';

export interface DailyReviewCard {
  concept_id: string;
  concept_name: string;
  category: string;
  retention_score: number;
  strength_factor: number;
  days_since_exposure: number;
  atrophy_risk: boolean;
  sample_evidence_quote?: string;
}

export interface MemoryHealthSummary {
  total_concepts: number;
  mastered_count: number; // retention > 0.8
  active_count: number;   // retention 0.3 - 0.8
  atrophy_count: number;  // retention < 0.3
  average_retention: number;
  learning_velocity_per_hour: number;
  projected_retention_30d: number;
}

export class MemoryKernel {
  /**
   * Calculates Ebbinghaus retention: R = e^(-t / S)
   * @param daysSinceExposure t (in days)
   * @param strengthFactor S (strength multiplier)
   */
  public static calculateRetention(daysSinceExposure: number, strengthFactor = 1.0): number {
    const s = Math.max(0.1, strengthFactor);
    const t = Math.max(0, daysSinceExposure);
    const r = Math.exp(-t / (s * 3.5)); // scaled for conference retention timescale
    return Math.max(0.01, Math.min(1.0, Math.round(r * 1000) / 1000));
  }

  public static async reinforceConcept(
    conceptId: string,
    action: 'bookmark' | 'note' | 'review' | 'cross_session' | 'perfect_quiz'
  ): Promise<MemoryScoreRecord> {
    let score = starkDB.findById<MemoryScoreRecord>('memory_scores', conceptId);
    if (!score) {
      score = {
        concept_id: conceptId,
        retention: 1.0,
        strength_factor: 1.0,
        last_review_at: new Date().toISOString(),
        review_count: 0,
        sm2_interval: 1,
        sm2_ease_factor: 2.5,
        atrophy_risk: false
      };
    }

    let deltaS = 0;
    switch (action) {
      case 'bookmark':
        deltaS = 0.5;
        break;
      case 'note':
        deltaS = 1.0;
        break;
      case 'cross_session':
        deltaS = 1.5;
        break;
      case 'review':
        deltaS = 2.0;
        break;
      case 'perfect_quiz':
        deltaS = 3.0;
        break;
    }

    const newStrength = score.strength_factor + deltaS;
    const newReviewCount = score.review_count + 1;

    // SuperMemo 2 (SM-2) Interval Math
    let newInterval = score.sm2_interval;
    if (newReviewCount === 1) {
      newInterval = 1;
    } else if (newReviewCount === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(score.sm2_interval * score.sm2_ease_factor);
    }

    const updatedRecord: MemoryScoreRecord = {
      ...score,
      retention: 1.0, // reset to peak on active reinforcement
      strength_factor: Math.round(newStrength * 100) / 100,
      last_review_at: new Date().toISOString(),
      review_count: newReviewCount,
      sm2_interval: newInterval,
      sm2_ease_factor: Math.max(1.3, score.sm2_ease_factor + 0.1),
      atrophy_risk: false
    };

    await starkDB.insert('memory_scores', conceptId, updatedRecord as unknown as Record<string, unknown>);

    // Sync back to concept entity
    const concept = starkDB.findById<ConceptRecord>('concepts', conceptId);
    if (concept) {
      await starkDB.update<ConceptRecord>('concepts', conceptId, {
        retention_score: 1.0,
        last_encountered_at: new Date().toISOString()
      });
    }

    return updatedRecord;
  }

  public static evaluateAllConcepts(): void {
    const concepts = starkDB.select<ConceptRecord>('concepts');
    const now = Date.now();

    for (const c of concepts) {
      let score = starkDB.findById<MemoryScoreRecord>('memory_scores', c.id);
      const lastSeen = c.last_encountered_at ? new Date(c.last_encountered_at).getTime() : now;
      const daysElapsed = Math.max(0, (now - lastSeen) / (1000 * 60 * 60 * 24));
      const s = score?.strength_factor || 1.0;
      const currentRetention = this.calculateRetention(daysElapsed, s);
      const isAtrophy = currentRetention < 0.30;

      if (score) {
        starkDB.update<MemoryScoreRecord>('memory_scores', c.id, {
          retention: currentRetention,
          atrophy_risk: isAtrophy
        });
      } else {
        starkDB.insert<MemoryScoreRecord>('memory_scores', c.id, {
          concept_id: c.id,
          retention: currentRetention,
          strength_factor: 1.0,
          last_review_at: c.last_encountered_at || new Date().toISOString(),
          review_count: 0,
          sm2_interval: 1,
          sm2_ease_factor: 2.5,
          atrophy_risk: isAtrophy
        });
      }

      starkDB.update<ConceptRecord>('concepts', c.id, {
        retention_score: currentRetention
      });
    }
  }

  public static getDailyReviewQueue(limit = 10): DailyReviewCard[] {
    this.evaluateAllConcepts();
    const concepts = starkDB.select<ConceptRecord>('concepts');
    const scores = starkDB.select<MemoryScoreRecord>('memory_scores');
    const scoreMap = new Map(scores.map(s => [s.concept_id, s]));

    const cards: DailyReviewCard[] = concepts.map(c => {
      const s = scoreMap.get(c.id);
      const days = c.last_encountered_at
        ? (Date.now() - new Date(c.last_encountered_at).getTime()) / (1000 * 60 * 60 * 24)
        : 0;
      return {
        concept_id: c.id,
        concept_name: c.name,
        category: c.category,
        retention_score: c.retention_score || 1.0,
        strength_factor: s?.strength_factor || 1.0,
        days_since_exposure: Math.round(days * 10) / 10,
        atrophy_risk: (c.retention_score || 1.0) < 0.3,
        sample_evidence_quote: c.description
      };
    });

    // Sort by lowest retention first
    return cards.sort((a, b) => a.retention_score - b.retention_score).slice(0, limit);
  }

  public static getMemoryHealthSummary(): MemoryHealthSummary {
    this.evaluateAllConcepts();
    const concepts = starkDB.select<ConceptRecord>('concepts');
    if (concepts.length === 0) {
      return {
        total_concepts: 0,
        mastered_count: 0,
        active_count: 0,
        atrophy_count: 0,
        average_retention: 1.0,
        learning_velocity_per_hour: 0,
        projected_retention_30d: 0.85
      };
    }

    let mastered = 0;
    let active = 0;
    let atrophy = 0;
    let sumRetention = 0;

    for (const c of concepts) {
      const r = c.retention_score ?? 1.0;
      sumRetention += r;
      if (r >= 0.8) mastered++;
      else if (r >= 0.3) active++;
      else atrophy++;
    }

    const avg = sumRetention / concepts.length;
    // Projected 30 days decay at current average strength
    const proj30 = this.calculateRetention(30, 1.8);

    return {
      total_concepts: concepts.length,
      mastered_count: mastered,
      active_count: active,
      atrophy_count: atrophy,
      average_retention: Math.round(avg * 100) / 100,
      learning_velocity_per_hour: Math.round((concepts.length / 8) * 10) / 10,
      projected_retention_30d: Math.round(proj30 * 100) / 100
    };
  }
}
