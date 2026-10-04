import type { PipelineState, ComplexityEstimate, ComplexityLevel  } from "../state.ts";

export async function stage24FComplexityEstimation(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const queryLength = state.rawInput.length;
  const subQueryCount = state.subQueries?.length ?? 1;
  const isCodeGen = state.intent?.category === "code_generation";
  const isPlanning = state.intent?.category === "planning";

  let score = 1;
  if (queryLength > 200) score += 2;
  if (subQueryCount > 1) score += subQueryCount * 1.5;
  if (isCodeGen) score += 3;
  if (isPlanning) score += 2.5;

  let level: ComplexityLevel = "low";
  if (score > 6) level = "high";
  else if (score > 3) level = "medium";

  const complexity: ComplexityEstimate = {
    score: Math.min(10, Math.round(score * 10) / 10),
    level,
    estimatedMs: Math.round(score * 450),
  };

  state.telemetry.stagesCompleted.push("24F_Complexity_Estimation");

  return { complexity };
}
