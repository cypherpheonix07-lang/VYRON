import type { PipelineState, RankedSource  } from "../state.ts";
import { cohereRerank } from "../../../../13 — VECTOR & KNOWLEDGE STORAGE/retrieval/rerank.ts";

export async function stage24KSourceRanking(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const rawSources = state.knowledge?.raw ?? [];

  if (rawSources.length === 0) {
    state.telemetry.stagesCompleted.push("24K_Source_Ranking");
    return { rankedSources: [] };
  }

  const documents = rawSources.map((s) => s.content);
  const reranked = await cohereRerank(state.rawInput, documents, 10);

  const rankedSources: RankedSource[] = reranked.results.map((r, i) => {
    const original = rawSources[r.index] ?? {
      id: `src_${i}`,
      content: r.document,
      source: "unknown",
    };
    return {
      ...original,
      relevanceScore: Number(r.relevanceScore.toFixed(4)),
      rank: i + 1,
    };
  });

  state.telemetry.stagesCompleted.push("24K_Source_Ranking");

  return { rankedSources };
}
