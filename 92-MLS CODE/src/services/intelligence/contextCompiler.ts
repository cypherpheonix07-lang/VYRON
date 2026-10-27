/**
 * VYRON — P22: CONTEXT COMPILER & TOKEN BUDGET OPTIMIZER
 * Semantic context compiler, token budgeting, multi-tier prioritization,
 * and loss-less syntax preservation under strict token limits.
 * Strictly ZERO operational raw SQL.
 */

export interface ContextChunk {
  id: string;
  priority: "CRITICAL_EVIDENCE" | "HIGH_ADR" | "MEDIUM_DIFF" | "LOW_FILE_SURROUND";
  content: string;
  estimatedTokens: number;
}

export interface CompiledContextResult {
  totalTokens: number;
  maxBudget: number;
  includedChunks: ContextChunk[];
  droppedChunkIds: string[];
  compiledPrompt: string;
}

export class ContextCompiler {
  private static readonly PRIORITY_WEIGHTS = {
    CRITICAL_EVIDENCE: 4,
    HIGH_ADR: 3,
    MEDIUM_DIFF: 2,
    LOW_FILE_SURROUND: 1
  };

  /**
   * Fast token estimation (roughly 4 characters per token).
   */
  public static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  public static compileContext(
    chunks: ContextChunk[],
    maxTokenBudget: number = 8192
  ): CompiledContextResult {
    // Sort chunks by priority descending
    const sorted = [...chunks].sort(
      (a, b) => this.PRIORITY_WEIGHTS[b.priority] - this.PRIORITY_WEIGHTS[a.priority]
    );

    let currentTokens = 0;
    const included: ContextChunk[] = [];
    const dropped: string[] = [];

    for (const chunk of sorted) {
      if (currentTokens + chunk.estimatedTokens <= maxTokenBudget) {
        included.push(chunk);
        currentTokens += chunk.estimatedTokens;
      } else {
        dropped.push(chunk.id);
      }
    }

    const compiledPrompt = included.map((c) => `--- [${c.priority}] ---\n${c.content}`).join("\n\n");

    return {
      totalTokens: currentTokens,
      maxBudget: maxTokenBudget,
      includedChunks: included,
      droppedChunkIds: dropped,
      compiledPrompt
    };
  }
}
