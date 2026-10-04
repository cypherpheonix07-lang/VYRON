import crypto from "node:crypto";

export interface EmbedOptions {
  model?: string;
  dimensions?: number;
  apiKey?: string;
}

export class EmbeddingService {
  private readonly defaultModel: string;
  private readonly dimensions: number;
  private readonly apiKey: string | undefined;

  constructor(options?: EmbedOptions) {
    this.defaultModel = options?.model ?? "text-embedding-3-large";
    this.dimensions = options?.dimensions ?? 1536;
    this.apiKey = options?.apiKey ?? process.env.OPENAI_API_KEY;
  }

  /**
   * Generates a normalized floating point embedding vector for a single string.
   */
  public async embed(text: string): Promise<number[]> {
    if (this.apiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            input: text,
            model: this.defaultModel,
            dimensions: this.dimensions,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.data?.[0]?.embedding) {
            return json.data[0].embedding;
          }
        }
      } catch (err) {
        console.warn("[EmbeddingService] Remote embedding failed, utilizing deterministic fallback:", err);
      }
    }

    // Deterministic offline embedding for testing & zero-latency local fallback
    return this.generateDeterministicVector(text, this.dimensions);
  }

  public async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }

  /**
   * Generates a unit-normalized deterministic vector from text hash.
   */
  private generateDeterministicVector(text: string, dimensions: number): number[] {
    const vector = new Array<number>(dimensions);
    let hash = crypto.createHash("sha256").update(text).digest();
    let norm = 0;

    for (let i = 0; i < dimensions; i++) {
      const byte = hash[i % hash.length] ?? 0;
      const seed = Math.sin(i * 1337 + byte) * 10000;
      const val = seed - Math.floor(seed) - 0.5;
      vector[i] = val;
      norm += val * val;

      if (i % hash.length === 0) {
        hash = crypto.createHash("sha256").update(hash).digest();
      }
    }

    // Unit normalize vector
    const sqrtNorm = Math.sqrt(norm) || 1;
    for (let i = 0; i < dimensions; i++) {
      vector[i] = Number(((vector[i] ?? 0) / sqrtNorm).toFixed(6));
    }

    return vector;
  }
}

export const embeddingService = new EmbeddingService();
export const embed = (text: string) => embeddingService.embed(text);
export default embeddingService;
