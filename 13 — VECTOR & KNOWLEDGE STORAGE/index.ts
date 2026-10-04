export * from "./embeddings/embed.ts";
export * from "./stores/pgvector.store.ts";
export * from "./retrieval/rerank.ts";
export * from "./chunking/text-splitter.ts";

export const Layer13Manifest = {
  id: "13",
  name: "13 — VECTOR & KNOWLEDGE STORAGE",
  capabilities: [
    "pgvector 1536-dim semantic search",
    "OpenAI text-embedding-3-large integration",
    "Cohere rerank-v3.5 cross-encoder ranking",
    "Recursive character and semantic document chunking",
  ],
  status: "ACTIVE",
};
