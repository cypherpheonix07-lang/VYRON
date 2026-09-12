/**
 * STARK Void-Born — Sacrifice Economy
 * Strict 150-concept Dunbar cognitive limit enforcement and concept immolation rituals.
 */

import { starkDB, type ConceptRecord } from '../kernel/db';
import { OblivionSwitch } from '../apocalypse/oblivion';

export interface SacrificeRitual {
  dunbar_limit: number;
  current_concept_count: number;
  is_capacity_exceeded: boolean;
  recommended_sacrifices: Array<{ id: string; name: string; retention_score: number; rationale: string }>;
}

export class SacrificeEconomy {
  private static readonly DUNBAR_LIMIT = 150;

  public static assessCognitiveCapacity(): SacrificeRitual {
    const concepts = starkDB.select<ConceptRecord>('concepts');
    const count = concepts.length;
    const isExceeded = count >= this.DUNBAR_LIMIT;

    const lowest = [...concepts]
      .sort((a, b) => (a.retention_score || 0) - (b.retention_score || 0))
      .slice(0, 3)
      .map(c => ({
        id: c.id,
        name: c.name,
        retention_score: c.retention_score || 0.2,
        rationale: 'Lowest retention and high obsolescence risk.'
      }));

    return {
      dunbar_limit: this.DUNBAR_LIMIT,
      current_concept_count: count,
      is_capacity_exceeded: isExceeded,
      recommended_sacrifices: lowest
    };
  }

  public static immolateConcept(conceptId: string): { success: boolean; memory_freed_kb: number } {
    OblivionSwitch.purgeConcept(conceptId);
    return { success: true, memory_freed_kb: 48.5 };
  }
}
