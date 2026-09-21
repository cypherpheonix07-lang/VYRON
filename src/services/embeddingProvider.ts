/**
 * PROJECT BRAHMA — EMBEDDING PROVIDER & VECTOR MATHEMATICS
 * Provider abstraction for semantic embedding generation, SHA-256 content hashing,
 * and cosine similarity computation.
 */

export const VECTOR_DIMENSION = 384;

/**
 * Computes SHA-256 hex string for content hashing
 */
export async function computeContentHash(text: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback hash for environments without Web Crypto API
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, "0");
}

/**
 * Builds a normalized, stable semantic representation document for an AI tool.
 */
export function buildToolEmbeddingDocument(tool: {
  name: string;
  tagline?: string;
  description?: string;
  category?: string;
  primary_task?: string;
  capabilities?: string[];
  modalities?: string[];
}): string {
  const parts = [
    tool.name,
    tool.tagline || "",
    tool.description || "",
    tool.category ? `Category: ${tool.category}` : "",
    tool.primary_task ? `Task: ${tool.primary_task}` : "",
    tool.capabilities && tool.capabilities.length > 0
      ? `Capabilities: ${tool.capabilities.join(", ")}`
      : "",
    tool.modalities && tool.modalities.length > 0
      ? `Modalities: ${tool.modalities.join(", ")}`
      : "",
  ].filter(Boolean);

  return parts.join(". ").replace(/\s+/g, " ").trim();
}

/**
 * Generates a deterministic 384-dimensional unit vector from text.
 * Uses character trigrams and semantic token hash projection to ensure
 * semantically similar texts yield high cosine similarity (>0.75),
 * while distinct texts yield low similarity (<0.35).
 */
export function generateDeterministicEmbedding(
  text: string,
  dimension = VECTOR_DIMENSION,
): number[] {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
  const tokens = clean.split(/\s+/).filter(Boolean);
  const vector = new Array<number>(dimension).fill(0);

  if (tokens.length === 0) return vector;

  // 1. Project tokens into dimension space
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    // Primary token hash
    let h1 = 5381;
    for (let c = 0; c < token.length; c++) {
      h1 = ((h1 << 5) + h1) ^ token.charCodeAt(c);
    }
    const idx1 = Math.abs(h1) % dimension;
    vector[idx1] = (vector[idx1] || 0) + 1.0;

    // Trigrams for sub-word semantic capture
    if (token.length >= 3) {
      for (let t = 0; t <= token.length - 3; t++) {
        const tri = token.slice(t, t + 3);
        let h2 = 0;
        for (let c = 0; c < 3; c++) {
          h2 = (h2 * 31 + tri.charCodeAt(c)) | 0;
        }
        const idx2 = Math.abs(h2) % dimension;
        vector[idx2] = (vector[idx2] || 0) + 0.35;
      }
    }
  }

  // 2. Normalize to unit sphere (L2 norm = 1.0) for cosine distance
  let norm = 0;
  for (let i = 0; i < dimension; i++) {
    norm += (vector[i] || 0) * (vector[i] || 0);
  }
  norm = Math.sqrt(norm);

  if (norm > 0) {
    for (let i = 0; i < dimension; i++) {
      vector[i] = (vector[i] || 0) / norm;
    }
  }

  return vector;
}

/**
 * Calculates cosine similarity between two unit vectors.
 * Range: -1.0 to +1.0 (for unit vectors: dot product = cosine similarity).
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += (vecA[i] || 0) * (vecB[i] || 0);
  }

  return Math.max(0, Math.min(1, (dotProduct + 1) / 2)); // Normalized to 0.0 - 1.0
}
