import type { PipelineState, ToolResult  } from "../state.ts";

export async function stage24OParallelExecution(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const parallelSteps = state.plan?.steps.filter((s) => s.canRunParallel) ?? [];

  const promises = parallelSteps.map(async (step): Promise<ToolResult> => {
    const startMs = Date.now();
    // Simulate non-blocking async execution
    await new Promise((resolve) => setTimeout(resolve, 15));
    return {
      toolName: `step_${step.id}`,
      success: true,
      result: `Completed parallel execution: ${step.description}`,
      durationMs: Date.now() - startMs,
    };
  });

  const settled = await Promise.allSettled(promises);
  const parallelResults: ToolResult[] = settled.map((r, i) => {
    if (r.status === "fulfilled") {
      return r.value;
    }
    return {
      toolName: `step_${parallelSteps[i]?.id ?? i}`,
      success: false,
      error: String(r.reason),
      durationMs: 0,
    };
  });

  state.telemetry.stagesCompleted.push("24O_Parallel_Execution");

  return { parallelResults };
}
