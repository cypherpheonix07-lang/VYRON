import type { PipelineState, ClassifiedIntent, IntentCategory  } from "../state.ts";

export async function stage24DIntentClassification(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const text = state.rawInput.toLowerCase();
  let category: IntentCategory = "question_answer";
  let confidence = 0.85;
  const entities: string[] = [];

  // Entity extraction keywords
  const entityKeywords = [
    "react", "typescript", "postgres", "drizzle", "fastify", "langgraph",
    "docker", "kubernetes", "temporal", "kafka", "redis", "copilot", "vyron"
  ];
  for (const kw of entityKeywords) {
    if (text.includes(kw)) entities.push(kw);
  }

  // Multi-class classification logic
  if (text.includes("generate") || text.includes("write") || text.includes("code") || text.includes("build") || text.includes("function") || text.includes("class")) {
    category = "code_generation";
    confidence = 0.95;
  } else if (text.includes("debug") || text.includes("fix") || text.includes("error") || text.includes("crash") || text.includes("fail")) {
    category = "debugging";
    confidence = 0.92;
  } else if (text.includes("analyze") || text.includes("evaluate") || text.includes("audit") || text.includes("benchmark")) {
    category = "analysis";
    confidence = 0.90;
  } else if (text.includes("plan") || text.includes("roadmap") || text.includes("strategy") || text.includes("step")) {
    category = "planning";
    confidence = 0.88;
  } else if (text.includes("search") || text.includes("find") || text.includes("locate")) {
    category = "search";
    confidence = 0.89;
  } else if (text.includes("explain") || text.includes("how does") || text.includes("what is")) {
    category = "explanation";
    confidence = 0.94;
  } else if (text.includes("summarize") || text.includes("summary") || text.includes("tldr")) {
    category = "summarization";
    confidence = 0.93;
  }

  const intent: ClassifiedIntent = {
    category,
    entities,
    confidence,
  };

  state.telemetry.stagesCompleted.push("24D_Intent_Classification");

  return { intent };
}
