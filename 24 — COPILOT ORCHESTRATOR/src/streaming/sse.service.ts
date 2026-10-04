import type { SSEWriter  } from "../pipeline/stages/24x-output-streaming.ts";

/**
 * Server-Sent Events (SSE) Delivery Helper for Copilot Streaming.
 */
export class SSEService {
  public static createResponseStream(onWrite: (data: string) => void): SSEWriter {
    return {
      writeChunk(chunk: string, sessionId: string) {
        const payload = JSON.stringify({ text: chunk, sessionId });
        onWrite(`event: chunk\ndata: ${payload}\n\n`);
      },
      writeDone(metadata: { citations: unknown[]; requestId: string; tokensUsed: number }) {
        const payload = JSON.stringify(metadata);
        onWrite(`event: done\ndata: ${payload}\n\n`);
      },
    };
  }

  public static formatError(code: string, message: string): string {
    const payload = JSON.stringify({ code, message });
    return `event: error\ndata: ${payload}\n\n`;
  }
}

export default SSEService;
