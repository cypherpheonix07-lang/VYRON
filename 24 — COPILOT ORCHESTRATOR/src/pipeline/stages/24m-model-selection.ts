import type { PipelineState  } from "../state.ts";

export async function stage24MModelSelection(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const plan = state.identity?.plan ?? "starter";
  const intent = state.intent?.category;
  const complexityLevel = state.complexity?.level ?? "low";

  let selectedModel = "gpt-4o-mini";

  if (plan === "enterprise" || plan === "pro") {
    if (intent === "code_generation" || intent === "debugging" || complexityLevel === "high") {
      selectedModel = "claude-sonnet-4-6";
    } else if (intent === "analysis" || intent === "planning") {
      selectedModel = "gemini-2.5-pro";
    } else {
      selectedModel = "claude-sonnet-4-6";
    }
  } else {
    // Starter plan tier
    selectedModel = "gpt-4o-mini";
  }

  state.telemetry.stagesCompleted.push("24M_Model_Selection");

  return { selectedModel };
}
