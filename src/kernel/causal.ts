/**
 * STARK Conference Cognition Kernel — Causal Architecture Mapper
 * Deterministic linguistic causal pattern extraction, directed DAG construction, and root cause analysis.
 */

import { starkDB, type ConceptRelationshipRecord, type ConceptRecord } from './db';
import { TemporalEvidenceFabric } from './evidence';

export interface CausalClaim {
  id: string;
  source_concept_name: string;
  target_concept_name: string;
  relationship_type: 'causes' | 'enables' | 'leads_to' | 'prerequisite_of';
  pattern_matched: string;
  confidence: number;
  snippet: string;
}

export interface CausalPathNode {
  concept_id: string;
  concept_name: string;
  relationship_to_next?: string;
  confidence: number;
}

export interface CausalAnalysisResult {
  target_concept: string;
  upstream_causes: Array<{ concept_id: string; name: string; relationship: string; confidence: number }>;
  downstream_effects: Array<{ concept_id: string; name: string; relationship: string; confidence: number }>;
  root_cause_chains: CausalPathNode[][];
}

export class CausalArchitectureMapper {
  private static readonly CAUSAL_PATTERNS = [
    { regex: /([a-zA-Z0-9\s_-]+?)\s+(?:causes|triggers|induces)\s+([a-zA-Z0-9\s_-]+)/i, type: 'causes' as const, specificity: 0.95 },
    { regex: /([a-zA-Z0-9\s_-]+?)\s+(?:enables|empowers|facilitates)\s+([a-zA-Z0-9\s_-]+)/i, type: 'enables' as const, specificity: 0.90 },
    { regex: /([a-zA-Z0-9\s_-]+?)\s+(?:leads\s+to|results\s+in)\s+([a-zA-Z0-9\s_-]+)/i, type: 'leads_to' as const, specificity: 0.85 },
    { regex: /if\s+([a-zA-Z0-9\s_-]+?)\s+then\s+([a-zA-Z0-9\s_-]+)/i, type: 'causes' as const, specificity: 0.80 },
    { regex: /([a-zA-Z0-9\s_-]+?)\s+(?:is\s+required\s+for|prerequisite\s+for)\s+([a-zA-Z0-9\s_-]+)/i, type: 'prerequisite_of' as const, specificity: 0.92 }
  ];

  public static extractCausalClaims(transcriptText: string): CausalClaim[] {
    const claims: CausalClaim[] = [];
    const sentences = transcriptText.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 10);

    for (const sentence of sentences) {
      for (const pattern of this.CAUSAL_PATTERNS) {
        const match = sentence.match(pattern.regex);
        if (match && match[1] && match[2]) {
          const source = match[1].trim();
          const target = match[2].trim();
          if (source.length > 2 && target.length > 2 && source.length < 50 && target.length < 50) {
            claims.push({
              id: `claim_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              source_concept_name: source,
              target_concept_name: target,
              relationship_type: pattern.type,
              pattern_matched: match[0],
              confidence: pattern.specificity,
              snippet: sentence
            });
          }
        }
      }
    }

    return claims;
  }

  public static async registerCausalEdge(
    sourceConceptId: string,
    targetConceptId: string,
    type: ConceptRelationshipRecord['relationship_type'],
    sourceSnippet: string
  ): Promise<ConceptRelationshipRecord> {
    const evidence = await TemporalEvidenceFabric.registerEvidence({
      artifact_type: 'transcript',
      extraction_method: 'regex_heuristic',
      operator: 'system',
      source_id: `causal_${sourceConceptId}_${targetConceptId}`,
      content: sourceSnippet
    });

    const edgeId = `edge_${sourceConceptId}_${targetConceptId}`;
    const edge: ConceptRelationshipRecord = {
      id: edgeId,
      source_concept_id: sourceConceptId,
      target_concept_id: targetConceptId,
      relationship_type: type,
      confidence: evidence.confidence,
      provenance_id: evidence.provenance_id
    };

    await starkDB.insert('concept_relationships', edgeId, edge as unknown as Record<string, unknown>);
    return edge;
  }

  public static queryCausalNetwork(conceptIdOrName: string): CausalAnalysisResult {
    const allConcepts = starkDB.select<ConceptRecord>('concepts');
    const target = allConcepts.find(c =>
      c.id === conceptIdOrName || c.name.toLowerCase() === conceptIdOrName.toLowerCase()
    );

    if (!target) {
      return {
        target_concept: conceptIdOrName,
        upstream_causes: [],
        downstream_effects: [],
        root_cause_chains: []
      };
    }

    const allEdges = starkDB.select<ConceptRelationshipRecord>('concept_relationships');
    const conceptMap = new Map(allConcepts.map(c => [c.id, c]));

    // Upstream (who affects target?)
    const upstream = allEdges
      .filter(e => e.target_concept_id === target.id)
      .map(e => ({
        concept_id: e.source_concept_id,
        name: conceptMap.get(e.source_concept_id)?.name || 'Unknown Concept',
        relationship: e.relationship_type,
        confidence: e.confidence
      }));

    // Downstream (who does target affect?)
    const downstream = allEdges
      .filter(e => e.source_concept_id === target.id)
      .map(e => ({
        concept_id: e.target_concept_id,
        name: conceptMap.get(e.target_concept_id)?.name || 'Unknown Concept',
        relationship: e.relationship_type,
        confidence: e.confidence
      }));

    // Traverse root cause chains (up to 4 levels)
    const chains: CausalPathNode[][] = [];
    const traverse = (currentId: string, currentChain: CausalPathNode[], depth: number) => {
      if (depth > 4) return;
      const parents = allEdges.filter(e => e.target_concept_id === currentId);
      if (parents.length === 0) {
        if (currentChain.length > 1) chains.push(currentChain);
        return;
      }
      for (const p of parents) {
        const parentConcept = conceptMap.get(p.source_concept_id);
        const node: CausalPathNode = {
          concept_id: p.source_concept_id,
          concept_name: parentConcept?.name || 'Unknown',
          relationship_to_next: p.relationship_type,
          confidence: p.confidence
        };
        traverse(p.source_concept_id, [node, ...currentChain], depth + 1);
      }
    };

    traverse(target.id, [{ concept_id: target.id, concept_name: target.name, confidence: 1.0 }], 0);

    return {
      target_concept: target.name,
      upstream_causes: upstream,
      downstream_effects: downstream,
      root_cause_chains: chains
    };
  }
}
