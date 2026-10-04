/**
 * Recursive character and semantic text splitter for document ingestion.
 */
export interface TextSplitterOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  separators?: string[];
}

export interface DocumentChunk {
  content: string;
  chunkIndex: number;
  totalChunks: number;
  metadata: Record<string, unknown>;
}

export class RecursiveTextSplitter {
  private readonly chunkSize: number;
  private readonly chunkOverlap: number;
  private readonly separators: string[];

  constructor(options?: TextSplitterOptions) {
    this.chunkSize = options?.chunkSize ?? 1000;
    this.chunkOverlap = options?.chunkOverlap ?? 200;
    this.separators = options?.separators ?? ["\n\n", "\n", ". ", " ", ""];
  }

  public split(text: string, metadata: Record<string, unknown> = {}): DocumentChunk[] {
    const rawChunks = this.splitText(text, this.separators);
    const totalChunks = rawChunks.length;

    return rawChunks.map((content, chunkIndex) => ({
      content,
      chunkIndex,
      totalChunks,
      metadata: {
        ...metadata,
        characterLength: content.length,
        estimatedTokens: Math.ceil(content.length / 4),
      },
    }));
  }

  private splitText(text: string, separators: string[]): string[] {
    if (text.length <= this.chunkSize) return [text.trim()];

    const separator = separators[0] ?? "";
    const remainingSeparators = separators.slice(1);
    const splits = separator ? text.split(separator) : text.split("");

    const chunks: string[] = [];
    let currentChunk = "";

    for (const piece of splits) {
      const candidate = currentChunk ? currentChunk + separator + piece : piece;
      if (candidate.length <= this.chunkSize) {
        currentChunk = candidate;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          const overlapStart = Math.max(0, currentChunk.length - this.chunkOverlap);
          currentChunk = currentChunk.slice(overlapStart) + separator + piece;
        } else {
          if (remainingSeparators.length > 0) {
            chunks.push(...this.splitText(piece, remainingSeparators));
          } else {
            chunks.push(piece.slice(0, this.chunkSize));
          }
        }
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter((c) => c.length > 0);
  }
}
