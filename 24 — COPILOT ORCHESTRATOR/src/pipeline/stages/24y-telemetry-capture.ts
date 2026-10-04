import type { PipelineState  } from "../state.ts";

export async function stage24YTelemetryCapture(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const durationMs = Date.now() - state.telemetry.startMs;
  const tokensUsed = Math.ceil((state.synthesizedResponse?.length ?? 0) / 4);

  state.telemetry.totalDurationMs = durationMs;
  state.telemetry.tokensUsed = tokensUsed;
  state.telemetry.stagesCompleted.push("24Y_Telemetry_Capture");

  return {};
}
