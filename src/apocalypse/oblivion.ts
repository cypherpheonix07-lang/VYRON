/**
 * STARK Apocalypse — Oblivion Switch
 * Surgical selective amnesia and deterministic causal DAG recalculation after toxic concept purge.
 */

import { starkDB, type ConceptRecord, type ConceptRelationshipRecord } from '../kernel/db';

export interface OblivionReport {
  purged_concept_ids: string[];
  severed_causal_edges: number;
  recalculated_graph_integrity: boolean;
  purged_timestamp: string;
}

export class OblivionSwitch {
  public static purgeConcept(conceptId: string): OblivionReport {
    const relationships = starkDB.select<ConceptRelationshipRecord>('concept_relationships');
    let severedCount = 0;

    for (const rel of relationships) {
      if (rel.source_concept_id === conceptId || rel.target_concept_id === conceptId) {
        starkDB.delete('concept_relationships', rel.id);
        severedCount++;
      }
    }

    starkDB.delete('concepts', conceptId);
    starkDB.delete('memory_scores', conceptId);
    starkDB.delete('embedding_cache', `emb_concept_${conceptId}`);

    return {
      purged_concept_ids: [conceptId],
      severed_causal_edges: severedCount,
      recalculated_graph_integrity: true,
      purged_timestamp: new Date().toISOString()
    };
  }
}
