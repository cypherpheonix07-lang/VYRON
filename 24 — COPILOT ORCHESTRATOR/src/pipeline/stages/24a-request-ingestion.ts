import type { PipelineState  } from "../state.ts";
import { createId } from "../../../../12 — DATABASE PLATFORM/cuid2.ts";

export function sanitizeInput(input: string): string {
  // Strip control characters except newline and tab, clamp length to 32,000
  return input
    .trim()
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "")
    .slice(0, 32000);
}

export async function stage24ARequestIngestion(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const requestId = state.requestId || createId();
  const cleaned = sanitizeInput(state.rawInput);

  state.telemetry.stagesCompleted.push("24A_Request_Ingestion");

  return {
    requestId,
    rawInput: cleaned,
  };
}
