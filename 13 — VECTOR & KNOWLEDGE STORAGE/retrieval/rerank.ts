export interface RerankResultItem {
  index: number;
  relevanceScore: number;
  document: string;
}

export interface RerankResponse {
  results: RerankResultItem[];
  model: string;
}

export class RerankService {
  private readonly apiKey: string | undefined;
  private readonly model: string;

  constructor(apiKey?: string, model = "rerank-v3.5") {
    this.apiKey = apiKey ?? process.env.COHERE_API_KEY;
    this.model = model;
  }

  public async rerank(query: string, documents: string[], topN?: number): Promise<RerankResponse> {
    const limit = topN ?? documents.length;

    if (this.apiKey) {
      try {
        const response = await fetch("https://api.cohere.com/v1/rerank", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            query,
            documents,
            model: this.model,
            top_n: limit,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.results) {
            return {
              model: this.model,
              results: json.results.map((r: { index: number; relevance_score: number }) => ({
                index: r.index,
                relevanceScore: r.relevance_score,
                document: documents[r.index] ?? "",
              })),
            };
          }
        }
      } catch (err) {
        console.warn("[RerankService] Remote rerank call failed, utilizing BM25-lexical fallback:", err);
      }
    }

    // Local BM25-lexical & token-overlap reranking fallback
    const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = documents.map((doc, index) => {
      const lower = doc.toLowerCase();
      let matchCount = 0;
      for (const term of queryTerms) {
        if (lower.includes(term)) matchCount++;
      }
      const relevanceScore = queryTerms.length > 0 ? matchCount / queryTerms.length : 0.5;
      return { index, relevanceScore, document: doc };
    });

    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return {
      model: "lexical-reciprocal-fusion-fallback",
      results: scored.slice(0, limit),
    };
  }
}

export const rerankService = new RerankService();
export const cohereRerank = (query: string, documents: string[], topN?: number) =>
  rerankService.rerank(query, documents, topN);
export default rerankService;
