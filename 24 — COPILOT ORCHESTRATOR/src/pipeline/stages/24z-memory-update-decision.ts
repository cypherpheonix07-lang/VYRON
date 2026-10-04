import type { PipelineState, MemoryUpdateDecision  } from "../state.ts";
import { saveShortTermMemory } from "./24h-memory-retrieval.ts";
import { embed } from "../../../../13 — VECTOR & KNOWLEDGE STORAGE/embeddings/embed.ts";
import { pgVectorStore } from "../../../../13 — VECTOR & KNOWLEDGE STORAGE/stores/pgvector.store.ts";

export async function stage24ZMemoryUpdateDecision(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const isImportant =
    state.intent?.category === "code_generation" ||
    state.intent?.category === "planning" ||
    (state.rawInput.length > 50 && state.safetyValidation?.passed);

  const importanceScore = isImportant ? 0.85 : 0.45;
  const shouldStoreShortTerm = importanceScore >= 0.4;
  const shouldStoreLongTerm = importanceScore >= 0.7;

  if (shouldStoreShortTerm && state.synthesizedResponse) {
    saveShortTermMemory(state.userId, state.rawInput, state.synthesizedResponse);
  }

  if (shouldStoreLongTerm && state.synthesizedResponse) {
    const memoryText = `User: ${state.rawInput}\nAssistant: ${state.synthesizedResponse.slice(0, 500)}`;
    const embedding = await embed(memoryText);

    await pgVectorStore.insert([
      {
        tenantId: state.tenantId,
        content: memoryText,
        embedding,
        source: "memory",
        metadata: {
          userId: state.userId,
          sessionId: state.sessionId,
          importance: importanceScore,
        },
      },
    ]);
  }

  // Update session history in session object
  if (state.session) {
    state.session.messageCount += 2;
    state.session.history.push(
      {
        id: `msg_u_${Date.now()}`,
        role: "user",
        content: state.rawInput,
        ts: new Date().toISOString(),
      },
      {
        id: `msg_a_${Date.now()}`,
        role: "assistant",
        content: state.synthesizedResponse ?? "",
        ts: new Date().toISOString(),
      }
    );
  }

  const memoryUpdateDecision: MemoryUpdateDecision = {
    shouldStoreShortTerm,
    shouldStoreLongTerm,
    importanceScore,
  };

  state.telemetry.stagesCompleted.push("24Z_Memory_Update_Decision");

  return { memoryUpdateDecision };
}
