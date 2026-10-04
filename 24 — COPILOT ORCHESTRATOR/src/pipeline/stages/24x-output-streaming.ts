import type { PipelineState  } from "../state.ts";

export interface SSEWriter {
  writeChunk: (chunk: string, sessionId: string) => void;
  writeDone: (metadata: { citations: unknown[]; requestId: string; tokensUsed: number }) => void;
}

export async function stage24XOutputStreaming(
  state: PipelineState,
  writer?: SSEWriter
): Promise<Partial<PipelineState>> {
  const chunks = state.streamChunks ?? [];

  if (writer) {
    for (const chunk of chunks) {
      writer.writeChunk(chunk, state.sessionId);
    }

    writer.writeDone({
      citations: state.citations ?? [],
      requestId: state.requestId,
      tokensUsed: Math.ceil((state.synthesizedResponse?.length ?? 0) / 4),
    });
  }

  state.telemetry.stagesCompleted.push("24X_Output_Streaming");

  return {};
}
