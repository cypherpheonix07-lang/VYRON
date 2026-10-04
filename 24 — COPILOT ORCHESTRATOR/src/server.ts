import { copilotOrchestrator } from "./pipeline/pipeline.ts";
import { SSEService } from "./streaming/sse.service.ts";

export interface ChatRequestBody {
  message: string;
  sessionId?: string;
}

export interface ChatResponseEnvelope<T> {
  data: T | null;
  meta: {
    requestId: string;
    timestamp: string;
    durationMs?: number;
  };
  error: {
    code: string;
    message: string;
  } | null;
}

/**
 * Handles incoming `/api/v1/copilot/chat` requests.
 * Supports both streaming (SSE) and buffered JSON delivery.
 */
export async function handleCopilotChatRequest(
  body: ChatRequestBody,
  options?: {
    userId?: string;
    tenantId?: string;
    onStreamChunk?: (sseFormattedChunk: string) => void;
  }
) {
  if (!body.message || typeof body.message !== "string") {
    return {
      data: null,
      meta: {
        requestId: "err_req",
        timestamp: new Date().toISOString(),
      },
      error: {
        code: "INVALID_REQUEST",
        message: "Request field 'message' must be a non-empty string.",
      },
    };
  }

  const sseWriter = options?.onStreamChunk
    ? SSEService.createResponseStream(options.onStreamChunk)
    : undefined;

  try {
    const finalState = await copilotOrchestrator.execute({
      message: body.message,
      sessionId: body.sessionId,
      userId: options?.userId,
      tenantId: options?.tenantId,
      writer: sseWriter,
    });

    return {
      data: {
        requestId: finalState.requestId,
        sessionId: finalState.sessionId,
        response: finalState.synthesizedResponse,
        model: finalState.selectedModel,
        intent: finalState.intent,
        citations: finalState.citations,
        tokensUsed: finalState.telemetry.tokensUsed,
        stagesExecuted: finalState.telemetry.stagesCompleted.length,
      },
      meta: {
        requestId: finalState.requestId,
        timestamp: new Date().toISOString(),
        durationMs: finalState.telemetry.totalDurationMs,
      },
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      data: null,
      meta: {
        requestId: "err_req",
        timestamp: new Date().toISOString(),
      },
      error: {
        code: "ORCHESTRATION_ERROR",
        message,
      },
    };
  }
}

export default handleCopilotChatRequest;
