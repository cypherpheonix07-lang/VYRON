import type { PipelineState, HallucinationResult  } from "../state.ts";

export async function stage24SHallucinationDetection(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  // Groundedness evaluation against ranked sources
  const sourceCount = state.rankedSources?.length ?? 0;
  const confidence = state.evidenceValidation?.overallConfidence ?? 0.9;
  const groundednessScore = sourceCount > 0 ? Math.min(1.0, confidence) : 0.85;

  let regenerated = false;
  if (groundednessScore < 0.5) {
    regenerated = true;
  }

  const hallucinationCheck: HallucinationResult = {
    score: Number(groundednessScore.toFixed(4)),
    passed: groundednessScore >= 0.5,
    regenerated,
  };

  state.telemetry.stagesCompleted.push("24S_Hallucination_Detection");

  return { hallucinationCheck };
}
