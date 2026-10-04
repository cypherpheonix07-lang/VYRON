import type { PipelineState, RetrievedKnowledge, KnowledgeItem  } from "../state.ts";
import { embed } from "../../../../13 — VECTOR & KNOWLEDGE STORAGE/embeddings/embed.ts";
import { pgVectorStore } from "../../../../13 — VECTOR & KNOWLEDGE STORAGE/stores/pgvector.store.ts";

export async function stage24JKnowledgeRetrieval(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const queryEmbedding = await embed(state.rawInput);

  // 1. Vector similarity search from Layer 13
  const vectorHits = await pgVectorStore.similaritySearch(queryEmbedding, 10, {
    tenantId: state.tenantId,
  });

  const vector: KnowledgeItem[] = vectorHits.map((h) => ({
    id: h.id,
    content: h.content,
    score: h.score,
    source: h.source,
    metadata: h.metadata,
  }));

  // 2. Keyword fallback knowledge items from canonical architecture specs
  const keyword: KnowledgeItem[] = [
    {
      id: "kb_arch_01",
      content:
        "VYRON Platform is an Enterprise AI SaaS system structured across 90 canonical layers with a 26-stage Copilot Orchestrator (24A–24Z).",
      score: 0.95,
      source: "architecture_spec",
      metadata: { title: "VYRON 90-Layer Topology Specification" },
    },
    {
      id: "kb_arch_02",
      content:
        "The Copilot Orchestrator processes raw user input through LangGraph state machine, enforcing cryptographic audit logging and deterministic evaluation.",
      score: 0.91,
      source: "copilot_spec",
      metadata: { title: "Copilot Orchestration Pipeline Guide" },
    },
  ];

  const raw = [...vector, ...keyword];

  const knowledge: RetrievedKnowledge = {
    vector,
    keyword,
    raw,
  };

  state.telemetry.stagesCompleted.push("24J_Knowledge_Retrieval");

  return { knowledge };
}
