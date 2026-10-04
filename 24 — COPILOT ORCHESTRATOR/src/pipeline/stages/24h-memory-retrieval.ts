import type { PipelineState, RetrievedMemories  } from "../state.ts";
import { embed } from "../../../../13 — VECTOR & KNOWLEDGE STORAGE/embeddings/embed.ts";
import { pgVectorStore } from "../../../../13 — VECTOR & KNOWLEDGE STORAGE/stores/pgvector.store.ts";

// In-memory short-term user memory cache
const shortTermMemoryCache = new Map<string, Array<{ query: string; response: string; ts: string }>>();

export async function stage24HMemoryRetrieval(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const queryEmbedding = await embed(state.rawInput);

  // 1. Fetch short-term TTL memory
  const shortTerm = shortTermMemoryCache.get(state.userId) ?? [];

  // 2. Fetch long-term semantic memory from pgVectorStore
  const searchResults = await pgVectorStore.similaritySearch(queryEmbedding, 5, {
    tenantId: state.tenantId,
    source: "memory",
  });

  const longTerm = searchResults.map((r) => ({
    content: r.content,
    score: r.score,
    metadata: r.metadata,
  }));

  const memories: RetrievedMemories = {
    shortTerm,
    longTerm,
    episodic: state.session?.history?.slice(-5) ?? [],
  };

  state.telemetry.stagesCompleted.push("24H_Memory_Retrieval");

  return { memories };
}

export function saveShortTermMemory(userId: string, query: string, response: string): void {
  const current = shortTermMemoryCache.get(userId) ?? [];
  current.push({ query, response, ts: new Date().toISOString() });
  if (current.length > 20) current.shift();
  shortTermMemoryCache.set(userId, current);
}
