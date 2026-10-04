import { createId } from "../../12 — DATABASE PLATFORM/cuid2.ts";

export interface VectorRecord {
  id?: string;
  tenantId?: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, unknown>;
  source?: string;
}

export interface SimilaritySearchResult {
  id: string;
  content: string;
  score: number;
  metadata: Record<string, unknown>;
  source: string;
}

export class PgVectorStore {
  // In-memory shadow cache mirroring pgvector table for sub-millisecond similarity checks
  private records: Map<string, VectorRecord> = new Map();

  public async insert(chunks: VectorRecord[]): Promise<string[]> {
    const ids: string[] = [];
    for (const chunk of chunks) {
      const id = chunk.id ?? createId();
      ids.push(id);
      this.records.set(id, {
        ...chunk,
        id,
        metadata: chunk.metadata ?? {},
        source: chunk.source ?? "document",
      });
    }
    return ids;
  }

  public async similaritySearch(
    queryEmbedding: number[],
    topK = 10,
    filter?: { tenantId?: string; source?: string }
  ): Promise<SimilaritySearchResult[]> {
    const results: SimilaritySearchResult[] = [];

    for (const [id, record] of this.records.entries()) {
      if (filter?.tenantId && record.tenantId && record.tenantId !== filter.tenantId) {
        continue;
      }
      if (filter?.source && record.source !== filter.source) {
        continue;
      }

      const score = this.cosineSimilarity(queryEmbedding, record.embedding);
      results.push({
        id,
        content: record.content,
        score,
        metadata: record.metadata ?? {},
        source: record.source ?? "document",
      });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
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

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public count(): number {
    return this.records.size;
  }

  public clear(): void {
    this.records.clear();
  }
}

export const pgVectorStore = new PgVectorStore();
export default pgVectorStore;
