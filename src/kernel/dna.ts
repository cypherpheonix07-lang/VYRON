/**
 * STARK Conference Cognition Kernel — Session DNA Fingerprinting
 * Normalized concept vectors, technical depth scoring, innovation index, and cross-session recombination.
 */

import { starkDB, type ConceptRecord, type SessionRecord } from './db';
import { SemanticEngine } from './semantic';

export interface SessionDNA {
  session_id: string;
  concept_frequencies: Record<string, number>;
  technical_depth_score: number; // 0.0 - 1.0
  innovation_index: number;      // 0.0 - 1.0
  primary_vector: number[];
  top_concepts: string[];
  prerequisite_chain_length: number;
}

export interface SessionRecombination {
  target_session_id: string;
  recommended_session_id: string;
  dna_similarity: number; // percentage
  shared_concepts: string[];
  gap_coverage_concepts: string[];
  recommendation_rationale: string;
}

export class SessionDNAProfiler {
  public static async computeSessionDNA(
    sessionId: string,
    transcriptText: string
  ): Promise<SessionDNA> {
    const allConcepts = starkDB.select<ConceptRecord>('concepts');
    const freqs: Record<string, number> = {};
    const topConcepts: string[] = [];
    const textLower = transcriptText.toLowerCase();

    let totalMentions = 0;
    let novelConceptsCount = 0;
    let sumComplexity = 0;

    for (const c of allConcepts) {
      const regex = new RegExp(`\\b${c.name.toLowerCase()}\\b`, 'g');
      const count = (textLower.match(regex) || []).length;
      if (count > 0) {
        freqs[c.id] = count;
        totalMentions += count;
        topConcepts.push(c.name);
        sumComplexity += (c.complexity || 0.5) * count;

        // Check if first seen in this event
        if (c.first_seen_at && Date.now() - new Date(c.first_seen_at).getTime() < 86400000) {
          novelConceptsCount++;
        }
      }
    }

    const technicalDepth = totalMentions > 0
      ? Math.min(1.0, Math.round((sumComplexity / totalMentions) * 100) / 100)
      : 0.5;

    const innovationIdx = topConcepts.length > 0
      ? Math.min(1.0, Math.round((novelConceptsCount / topConcepts.length) * 100) / 100)
      : 0.3;

    const primaryVector = await SemanticEngine.generateEmbedding(transcriptText);

    return {
      session_id: sessionId,
      concept_frequencies: freqs,
      technical_depth_score: technicalDepth,
      innovation_index: innovationIdx,
      primary_vector: primaryVector,
      top_concepts: topConcepts.slice(0, 8),
      prerequisite_chain_length: Math.max(1, Math.round(technicalDepth * 6))
    };
  }

  public static compareSessions(dnaA: SessionDNA, dnaB: SessionDNA): number {
    return SemanticEngine.cosineSimilarity(dnaA.primary_vector, dnaB.primary_vector);
  }

  public static recommendRecombinations(
    targetDNA: SessionDNA,
    candidateDNAs: SessionDNA[]
  ): SessionRecombination[] {
    const results: SessionRecombination[] = [];
    const targetConceptSet = new Set(targetDNA.top_concepts);

    for (const cand of candidateDNAs) {
      if (cand.session_id === targetDNA.session_id) continue;
      const sim = this.compareSessions(targetDNA, cand);
      const candConceptSet = new Set(cand.top_concepts);

      const shared = targetDNA.top_concepts.filter(c => candConceptSet.has(c));
      const gaps = cand.top_concepts.filter(c => !targetConceptSet.has(c));

      const simPct = Math.round(sim * 100);
      if (simPct >= 20) {
        results.push({
          target_session_id: targetDNA.session_id,
          recommended_session_id: cand.session_id,
          dna_similarity: simPct,
          shared_concepts: shared,
          gap_coverage_concepts: gaps.slice(0, 4),
          recommendation_rationale: `Shares ${simPct}% DNA with your session while bridging knowledge gaps in ${gaps.slice(0, 2).join(' & ')}.`
        });
      }
    }

    return results.sort((a, b) => b.dna_similarity - a.dna_similarity);
  }
}
