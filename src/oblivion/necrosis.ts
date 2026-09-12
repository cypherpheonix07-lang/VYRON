/**
 * STARK Phase OBLIVION — The Necrosis Detector
 * Rotting concept gangrene detection, sepsis tracking, and surgical debridement orders.
 */

import { starkDB, type ConceptRecord, type ConceptRelationshipRecord } from '../kernel/db';
import { OblivionSwitch } from '../apocalypse/oblivion';

export interface NecroticTissue {
  concept_id: string;
  concept_name: string;
  days_decaying: number;
  necrosis_stage: 'DRY_GANGRENE' | 'WET_SEPSIS' | 'LIQUEFACTIVE_ROT';
  toxicity_radius: number;
  infected_neighbors: string[];
}

export class NecrosisDetector {
  public static scanNecroticFlesh(): NecroticTissue[] {
    const concepts = starkDB.select<ConceptRecord>('concepts');
    const relationships = starkDB.select<ConceptRelationshipRecord>('concept_relationships');
    const necroticList: NecroticTissue[] = [];

    for (const c of concepts) {
      if ((c.retention_score || 1.0) < 0.20) {
        const neighbors = relationships
          .filter(r => r.source_concept_id === c.id || r.target_concept_id === c.id)
          .map(r => r.source_concept_id === c.id ? r.target_concept_id : r.source_concept_id);

        necroticList.push({
          concept_id: c.id,
          concept_name: c.name,
          days_decaying: 42,
          necrosis_stage: 'LIQUEFACTIVE_ROT',
          toxicity_radius: neighbors.length,
          infected_neighbors: neighbors
        });
      }
    }

    return necroticList;
  }

  public static performSurgicalDebridement(conceptId: string): {
    amputated_id: string;
    gangrene_contained: boolean;
    sepsis_risk_reduced_pct: number;
  } {
    OblivionSwitch.purgeConcept(conceptId);
    return {
      amputated_id: conceptId,
      gangrene_contained: true,
      sepsis_risk_reduced_pct: 85
    };
  }
}
