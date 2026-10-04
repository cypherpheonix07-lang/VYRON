import type { PipelineState, SelectedTool  } from "../state.ts";

export async function stage24LToolSelection(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const selectedTools: SelectedTool[] = [];
  const intentCategory = state.intent?.category;

  if (intentCategory === "code_generation" || intentCategory === "debugging") {
    selectedTools.push({
      name: "code_interpreter",
      reason: "Validate syntax and execute static AST inspection",
    });
  }

  if (intentCategory === "analysis") {
    selectedTools.push({
      name: "architecture_analyzer",
      reason: "Inspect component interaction models and dependency graphs",
    });
  }

  if (intentCategory === "search" || state.rawInput.toLowerCase().includes("lookup")) {
    selectedTools.push({
      name: "knowledge_retriever",
      reason: "Search semantic knowledge base and enterprise architecture documents",
    });
  }

  state.telemetry.stagesCompleted.push("24L_Tool_Selection");

  return { selectedTools };
}
