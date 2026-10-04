import type { PipelineState, ResolvedSession  } from "../state.ts";
import { createId } from "../../../../12 — DATABASE PLATFORM/cuid2.ts";

// In-memory session cache backing Redis with 3600s TTL
const sessionCache = new Map<string, { session: ResolvedSession; expiresAt: number }>();

export async function stage24CSessionResolution(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const sessionId = state.sessionId || createId();
  const now = Date.now();
  const cached = sessionCache.get(sessionId);

  let session: ResolvedSession;
  if (cached && cached.expiresAt > now) {
    session = cached.session;
  } else {
    session = {
      id: sessionId,
      userId: state.userId,
      tenantId: state.tenantId,
      startedAt: new Date().toISOString(),
      messageCount: 0,
      history: [],
    };
    sessionCache.set(sessionId, { session, expiresAt: now + 3600 * 1000 });
  }

  state.telemetry.stagesCompleted.push("24C_Session_Resolution");

  return { session, sessionId };
}
