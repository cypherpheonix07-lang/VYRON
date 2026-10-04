import type { PipelineState, Citation  } from "../state.ts";

export async function stage24UCitationGeneration(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const rankedSources = state.rankedSources ?? [];
  const citations: Citation[] = rankedSources.slice(0, 3).map((s, i) => ({
    id: i + 1,
    title: (s.metadata?.title as string) ?? `Enterprise Knowledge Source #${i + 1}`,
    source: s.source,
    excerpt: s.content.slice(0, 150) + "...",
  }));

  let annotatedResponse = state.synthesizedResponse ?? "";
  if (citations.length > 0) {
    annotatedResponse += "\n\nSources:\n";
    for (const c of citations) {
      annotatedResponse += `[${c.id}] ${c.title} (${c.source})\n`;
    }
  }

  state.telemetry.stagesCompleted.push("24U_Citation_Generation");

  return { citations, synthesizedResponse: annotatedResponse };
}
