/**
 * STARK Conference Cognition Kernel — Contradiction Detection Engine
 * Syntactic negation, tech antonym ontology, and temporal cross-session conflict detection.
 */

import { starkDB, type ContradictionRecord, type ConceptRecord } from './db';
import { TemporalEvidenceFabric } from './evidence';

export interface AntonymPair {
  term_a: string;
  term_b: string;
  domain: string;
}

export class ContradictionEngine {
  private static readonly TECH_ANTONYMS: AntonymPair[] = [
    { term_a: 'monolith', term_b: 'microservices', domain: 'architecture' },
    { term_a: 'sql', term_b: 'nosql', domain: 'database' },
    { term_a: 'sync', term_b: 'async', domain: 'networking' },
    { term_a: 'synchronous', term_b: 'asynchronous', domain: 'networking' },
    { term_a: 'rest', term_b: 'graphql', domain: 'api' },
    { term_a: 'stateful', term_b: 'stateless', domain: 'systems' },
    { term_a: 'push', term_b: 'pull', domain: 'messaging' },
    { term_a: 'serverless', term_b: 'dedicated server', domain: 'infrastructure' },
    { term_a: 'client-rendered', term_b: 'server-rendered', domain: 'frontend' },
    { term_a: 'centralized', term_b: 'decentralized', domain: 'topology' }
  ];

  public static detectDirectNegation(claimA: string, claimB: string): boolean {
    const a = claimA.toLowerCase();
    const b = claimB.toLowerCase();

    // Check negation markers
    const negations = ['not', 'never', 'deprecated', 'dead', 'obsolete', 'antipattern', 'abandoned'];
    for (const neg of negations) {
      if ((a.includes(neg) && !b.includes(neg)) || (!a.includes(neg) && b.includes(neg))) {
        // Check if same subject
        const wordsA = a.split(/\s+/).filter(w => w.length > 3);
        const overlap = wordsA.filter(w => b.includes(w));
        if (overlap.length >= 2) return true;
      }
    }
    return false;
  }

  public static detectAntonymClash(claimA: string, claimB: string): AntonymPair | null {
    const a = claimA.toLowerCase();
    const b = claimB.toLowerCase();

    for (const pair of this.TECH_ANTONYMS) {
      if (
        (a.includes(pair.term_a) && b.includes(pair.term_b)) ||
        (a.includes(pair.term_b) && b.includes(pair.term_a))
      ) {
        return pair;
      }
    }
    return false as unknown as null;
  }

  public static async scanCrossSessionContradictions(
    sessionA: { id: string; title: string; transcript: string },
    sessionB: { id: string; title: string; transcript: string }
  ): Promise<ContradictionRecord[]> {
    const found: ContradictionRecord[] = [];
    const sentencesA = sessionA.transcript.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 15);
    const sentencesB = sessionB.transcript.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 15);

    const allConcepts = starkDB.select<ConceptRecord>('concepts');

    for (const sA of sentencesA) {
      for (const sB of sentencesB) {
        let severity: ContradictionRecord['severity'] | null = null;
        if (this.detectDirectNegation(sA, sB)) {
          severity = 'high';
        } else {
          const antonym = this.detectAntonymClash(sA, sB);
          if (antonym) severity = 'medium';
        }

        if (severity) {
          const matchedConceptA = allConcepts.find(c => sA.toLowerCase().includes(c.name.toLowerCase()))?.id || 'concept_gen_a';
          const matchedConceptB = allConcepts.find(c => sB.toLowerCase().includes(c.name.toLowerCase()))?.id || 'concept_gen_b';

          const id = `contra_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
          const record: ContradictionRecord = {
            id,
            concept_a_id: matchedConceptA,
            concept_b_id: matchedConceptB,
            session_a_id: sessionA.id,
            session_b_id: sessionB.id,
            claim_a: sA,
            claim_b: sB,
            severity,
            status: 'unresolved',
            detected_at: new Date().toISOString()
          };

          await starkDB.insert('contradictions', id, record as unknown as Record<string, unknown>);
          found.push(record);
        }
      }
    }

    return found;
  }

  public static async resolveContradiction(
    contradictionId: string,
    resolution: ContradictionRecord['status'],
    resolutionNote: string
  ): Promise<ContradictionRecord | null> {
    const existing = starkDB.findById<ContradictionRecord>('contradictions', contradictionId);
    if (!existing) return null;

    // Register resolution into provenance
    await TemporalEvidenceFabric.registerEvidence({
      artifact_type: 'user_note',
      extraction_method: 'user_annotation',
      operator: 'user',
      source_id: contradictionId,
      content: `[Contradiction Resolved: ${resolution}] ${resolutionNote}`
    });

    const updated = await starkDB.update<ContradictionRecord>('contradictions', contradictionId, {
      status: resolution,
      resolution_note: resolutionNote
    });

    return updated;
  }
}
