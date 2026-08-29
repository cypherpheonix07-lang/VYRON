/**
 * STARK Conference Cognition Kernel — Semantic Diff Engine
 * Pre/post knowledge delta analysis tracking acquired, reinforced, contradicted, and decayed concepts.
 */

import { starkDB, type ConceptRecord, type ContradictionRecord } from './db';

export interface ConceptDeltaItem {
  id: string;
  name: string;
  category: string;
  delta_type: 'acquired' | 'reinforced' | 'contradicted' | 'decayed';
  retention_change: number; // e.g. +0.40 or -0.15
  evidence_strength: number;
  annotation: string;
}

export interface KnowledgeAcquisitionReport {
  timestamp: string;
  total_gained: number;
  total_reinforced: number;
  total_contradicted: number;
  total_decayed: number;
  net_knowledge_delta_pct: number;
  items: ConceptDeltaItem[];
}

export class SemanticDiffEngine {
  public static computeKnowledgeDelta(baselineTimestamp?: string): KnowledgeAcquisitionReport {
    const concepts = starkDB.select<ConceptRecord>('concepts');
    const contradictions = starkDB.select<ContradictionRecord>('contradictions');
    const contradictedConceptIds = new Set([
      ...contradictions.map(c => c.concept_a_id),
      ...contradictions.map(c => c.concept_b_id)
    ]);

    const cutoff = baselineTimestamp ? new Date(baselineTimestamp).getTime() : Date.now() - 86400000;
    const items: ConceptDeltaItem[] = [];

    let gained = 0;
    let reinforced = 0;
    let contradicted = 0;
    let decayed = 0;

    for (const c of concepts) {
      const firstSeen = c.first_seen_at ? new Date(c.first_seen_at).getTime() : Date.now();
      const retention = c.retention_score ?? 1.0;

      if (contradictedConceptIds.has(c.id)) {
        contradicted++;
        items.push({
          id: c.id,
          name: c.name,
          category: c.category,
          delta_type: 'contradicted',
          retention_change: -0.25,
          evidence_strength: c.evidence_strength || 0.60,
          annotation: 'Conflicting claims detected across sessions; requires review.'
        });
      } else if (firstSeen >= cutoff) {
        gained++;
        items.push({
          id: c.id,
          name: c.name,
          category: c.category,
          delta_type: 'acquired',
          retention_change: 1.0,
          evidence_strength: c.evidence_strength || 0.90,
          annotation: 'Newly assimilated concept during this conference session.'
        });
      } else if (retention >= 0.8) {
        reinforced++;
        items.push({
          id: c.id,
          name: c.name,
          category: c.category,
          delta_type: 'reinforced',
          retention_change: 0.35,
          evidence_strength: c.evidence_strength || 0.85,
          annotation: 'Encountered in cross-session discussion; memory strengthened.'
        });
      } else if (retention < 0.4) {
        decayed++;
        items.push({
          id: c.id,
          name: c.name,
          category: c.category,
          delta_type: 'decayed',
          retention_change: -0.40,
          evidence_strength: c.evidence_strength || 0.50,
          annotation: 'Atrophy detected from lack of recent active review.'
        });
      }
    }

    const netScore = concepts.length > 0
      ? Math.round(((gained * 1.0 + reinforced * 0.5 - decayed * 0.3 - contradicted * 0.4) / concepts.length) * 100)
      : 0;

    return {
      timestamp: new Date().toISOString(),
      total_gained: gained,
      total_reinforced: reinforced,
      total_contradicted: contradicted,
      total_decayed: decayed,
      net_knowledge_delta_pct: netScore,
      items
    };
  }
}
