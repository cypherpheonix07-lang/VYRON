import type { PipelineState, ExecutionPlan, PlanStep  } from "../state.ts";

export async function stage24NPlanning(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const steps: PlanStep[] = [];
  const intent = state.intent?.category;

  steps.push({
    id: 1,
    description: `Analyze input intent "${intent}" and synthesize context`,
    canRunParallel: true,
    requiresAgent: false,
  });

  if (state.selectedTools && state.selectedTools.length > 0) {
    steps.push({
      id: 2,
      description: `Execute tool sandboxes: ${state.selectedTools.map((t) => t.name).join(", ")}`,
      canRunParallel: true,
      requiresAgent: false,
      tools: state.selectedTools.map((t) => t.name),
    });
  }

  if (state.complexity?.level === "high") {
    steps.push({
      id: 3,
      description: "Delegate deep reasoning sub-task to specialized reasoning agent",
      canRunParallel: false,
      requiresAgent: true,
    });
  }

  steps.push({
    id: steps.length + 1,
    description: "Synthesize response, cross-check evidence, and format inline citations",
    canRunParallel: false,
    requiresAgent: false,
  });

  const plan: ExecutionPlan = {
    steps,
    draftResponse: `Vyron cognitive engine response for intent: ${intent}. Verified across ${state.rankedSources?.length ?? 0} enterprise knowledge sources.`,
  };

  state.telemetry.stagesCompleted.push("24N_Planning");

  return { plan };
}
