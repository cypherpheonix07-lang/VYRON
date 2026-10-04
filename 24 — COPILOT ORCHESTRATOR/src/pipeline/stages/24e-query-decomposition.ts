import type { PipelineState  } from "../state.ts";

export async function stage24EQueryDecomposition(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const text = state.rawInput;
  let subQueries: string[] = [text];

  // If compound sentence with coordinating conjunctions or multi-intent punctuation
  if (text.includes(" and ") || text.includes(" as well as ") || text.includes("; ") || text.includes(". ")) {
    const parts = text
      .split(/(?: and | as well as |; |\.\s+)/)
      .map((p) => p.trim())
      .filter((p) => p.length > 5);

    if (parts.length > 1) {
      subQueries = parts.slice(0, 5);
    }
  }

  state.telemetry.stagesCompleted.push("24E_Query_Decomposition");

  return { subQueries };
}
