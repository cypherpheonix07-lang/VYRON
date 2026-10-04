import type { PipelineState, SafetyResult  } from "../state.ts";

export async function stage24VSafetyValidation(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const content = (state.synthesizedResponse ?? "").toLowerCase();

  // Safety filter rules
  const harmfulPatterns = ["malicious_exploit", "drop database", "rm -rf /"];
  let flagged = false;
  let reason: string | undefined;

  for (const pattern of harmfulPatterns) {
    if (content.includes(pattern)) {
      flagged = true;
      reason = `Violation detected: pattern "${pattern}" is prohibited by AI safety policy.`;
      break;
    }
  }

  const safetyValidation: SafetyResult = {
    passed: !flagged,
    reason,
    inputScore: 0.99,
    outputScore: flagged ? 0.2 : 0.98,
  };

  state.telemetry.stagesCompleted.push("24V_Safety_Validation");

  if (flagged) {
    return {
      safetyValidation,
      synthesizedResponse:
        "The response could not be displayed because it triggered enterprise AI safety guardrails.",
    };
  }

  return { safetyValidation };
}
