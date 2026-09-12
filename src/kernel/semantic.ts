/**
 * STARK Conference Cognition Kernel — Client-Side Semantic Engine
 * 384-dimensional local vector mathematics, cosine similarity search, and k-means clustering.
 */

import { starkDB, type EmbeddingRecord, type ConceptRecord } from './db';

export interface SemanticSearchResult {
  id: string;
  entity_type: EmbeddingRecord['entity_type'];
  entity_id: string;
  similarity: number;
  evidence_score: number;
  combined_rank: number;
  snippet?: string;
}

export interface ConceptCluster {
  cluster_id: number;
  centroid: number[];
  concept_ids: string[];
  label: string;
}

export class SemanticEngine {
  private static readonly VECTOR_DIM = 384;

  /**
   * Deterministic 384-dimensional semantic projection hashing.
   * Produces dense unit-normalized vectors suitable for cosine ranking.
   */
  public static async generateEmbedding(text: string): Promise<number[]> {
    const clean = text.toLowerCase().trim();
    const vector = new Array<number>(this.VECTOR_DIM).fill(0);
    const tokens = clean.split(/[\s,._\-:;!?]+/).filter(t => t.length > 1);

    if (tokens.length === 0) {
      vector[0] = 1.0;
      return vector;
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i] ?? '';
      if (!token) continue;
      let seed = 0;
      for (let j = 0; j < token.length; j++) {
        seed = ((seed << 5) - seed) + token.charCodeAt(j);
        seed |= 0;
      }
      for (let d = 0; d < this.VECTOR_DIM; d++) {
        const hashVal = Math.sin(seed * (d + 1) * 0.1337) * 43758.5453;
        const component = hashVal - Math.floor(hashVal);
        const cur = vector[d] ?? 0;
        vector[d] = cur + (component - 0.5) / Math.sqrt(tokens.length);
      }
    }

    // L2 Normalize
    let norm = 0;
    for (let d = 0; d < this.VECTOR_DIM; d++) {
      const val = vector[d] ?? 0;
      norm += val * val;
    }
    norm = Math.sqrt(norm) || 1e-12;
    for (let d = 0; d < this.VECTOR_DIM; d++) {
      const val = vector[d] ?? 0;
      vector[d] = val / norm;
    }

    return vector;
  }

  public static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      const valA = a[i] ?? 0;
      const valB = b[i] ?? 0;
      dot += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom === 0) return 0;
    return Math.max(0, Math.min(1, dot / denom));
  }

  public static async cacheEmbedding(
    entityType: EmbeddingRecord['entity_type'],
    entityId: string,
    text: string
  ): Promise<EmbeddingRecord> {
    const vector = await this.generateEmbedding(text);
    const id = `emb_${entityType}_${entityId}`;
    const record: EmbeddingRecord = {
      id,
      entity_type: entityType,
      entity_id: entityId,
      vector,
      dimension: this.VECTOR_DIM,
      created_at: new Date().toISOString()
    };
    await starkDB.insert('embedding_cache', id, record as unknown as Record<string, unknown>);
    return record;
  }

  public static async semanticSearch(
    queryText: string,
    limit = 10,
    minSimilarity = 0.15
  ): Promise<SemanticSearchResult[]> {
    const queryVec = await this.generateEmbedding(queryText);
    const cached = starkDB.select<EmbeddingRecord>('embedding_cache');
    const results: SemanticSearchResult[] = [];

    for (const record of cached) {
      const sim = this.cosineSimilarity(queryVec, record.vector);
      if (sim >= minSimilarity) {
        let evidenceScore = 0.70;
        if (record.entity_type === 'concept') {
          const c = starkDB.findById<ConceptRecord>('concepts', record.entity_id);
          if (c) evidenceScore = c.evidence_strength || 0.70;
        }
        // Combined Rank = 65% vector similarity + 35% evidence strength
        const combined = sim * 0.65 + evidenceScore * 0.35;
        results.push({
          id: record.id,
          entity_type: record.entity_type,
          entity_id: record.entity_id,
          similarity: Math.round(sim * 1000) / 1000,
          evidence_score: Math.round(evidenceScore * 1000) / 1000,
          combined_rank: Math.round(combined * 1000) / 1000
        });
      }
    }

    return results.sort((a, b) => b.combined_rank - a.combined_rank).slice(0, limit);
  }

  /**
   * K-Means clustering algorithm for auto-discovering topic galaxies.
   */
  public static async clusterConcepts(k = 5, maxIterations = 15): Promise<ConceptCluster[]> {
    const concepts = starkDB.select<ConceptRecord>('concepts');
    if (concepts.length === 0) return [];

    const effectiveK = Math.min(k, concepts.length);
    const conceptVectors: Array<{ id: string; name: string; vector: number[] }> = [];

    for (const c of concepts) {
      const vecRec = starkDB.findById<EmbeddingRecord>('embedding_cache', `emb_concept_${c.id}`);
      let vec = vecRec?.vector;
      if (!vec) {
        vec = await this.generateEmbedding(`${c.name} ${c.category} ${c.description}`);
      }
      conceptVectors.push({ id: c.id, name: c.name, vector: vec });
    }

    const firstVector = conceptVectors[0]?.vector ?? new Array<number>(this.VECTOR_DIM).fill(0);
    const centroids: number[][] = [[...firstVector]];

    while (centroids.length < effectiveK) {
      let maxDist = -1;
      let bestCandidate = firstVector;
      for (const item of conceptVectors) {
        let minDistToCentroids = Infinity;
        for (const c of centroids) {
          const d = 1 - this.cosineSimilarity(item.vector, c);
          if (d < minDistToCentroids) minDistToCentroids = d;
        }
        if (minDistToCentroids > maxDist) {
          maxDist = minDistToCentroids;
          bestCandidate = item.vector;
        }
      }
      centroids.push([...bestCandidate]);
    }

    let clusters: number[][] = new Array(effectiveK).fill(0).map(() => []);

    for (let iter = 0; iter < maxIterations; iter++) {
      clusters = new Array(effectiveK).fill(0).map(() => []);

      // Assignment step
      for (let i = 0; i < conceptVectors.length; i++) {
        const item = conceptVectors[i];
        if (!item) continue;
        let bestC = 0;
        let highestSim = -1;
        for (let cIdx = 0; cIdx < effectiveK; cIdx++) {
          const cent = centroids[cIdx] ?? [];
          const sim = this.cosineSimilarity(item.vector, cent);
          if (sim > highestSim) {
            highestSim = sim;
            bestC = cIdx;
          }
        }
        const targetCluster = clusters[bestC];
        if (targetCluster) {
          targetCluster.push(i);
        }
      }

      // Update centroids
      for (let cIdx = 0; cIdx < effectiveK; cIdx++) {
        const memberIndices = clusters[cIdx] ?? [];
        if (memberIndices.length === 0) continue;
        const newCentroid = new Array<number>(this.VECTOR_DIM).fill(0);
        for (const idx of memberIndices) {
          const vec = conceptVectors[idx]?.vector;
          if (!vec) continue;
          for (let d = 0; d < this.VECTOR_DIM; d++) {
            const curVal = newCentroid[d] ?? 0;
            const addVal = vec[d] ?? 0;
            newCentroid[d] = curVal + addVal;
          }
        }
        // Normalize
        let norm = 0;
        for (let d = 0; d < this.VECTOR_DIM; d++) {
          const val = (newCentroid[d] ?? 0) / memberIndices.length;
          newCentroid[d] = val;
          norm += val * val;
        }
        norm = Math.sqrt(norm) || 1e-12;
        const finalCentroid = centroids[cIdx] ?? new Array<number>(this.VECTOR_DIM).fill(0);
        for (let d = 0; d < this.VECTOR_DIM; d++) {
          finalCentroid[d] = (newCentroid[d] ?? 0) / norm;
        }
        centroids[cIdx] = finalCentroid;
      }
    }

    const clusterResults: ConceptCluster[] = [];
    for (let cIdx = 0; cIdx < effectiveK; cIdx++) {
      const memberIndices = clusters[cIdx] ?? [];
      const memberIds = memberIndices.map(idx => conceptVectors[idx]?.id).filter((id): id is string => Boolean(id));
      const topConceptNames = memberIndices.slice(0, 3).map(idx => conceptVectors[idx]?.name).filter((n): n is string => Boolean(n));
      clusterResults.push({
        cluster_id: cIdx + 1,
        centroid: centroids[cIdx] ?? [],
        concept_ids: memberIds,
        label: topConceptNames.length ? topConceptNames.join(' • ') : `Cluster #${cIdx + 1}`
      });
    }

    return clusterResults;
  }
}
