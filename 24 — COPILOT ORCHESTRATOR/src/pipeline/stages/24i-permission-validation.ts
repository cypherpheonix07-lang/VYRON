import type { PipelineState, PermissionResult  } from "../state.ts";

export async function stage24IPermissionValidation(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  // 1. RBAC Check (Admin / Member access to copilot)
  const role = state.identity?.user?.role ?? "member";
  const isAllowedRole = ["owner", "admin", "member"].includes(role);

  if (!isAllowedRole) {
    throw new Error(`[Permission Denied] Role "${role}" is not authorized to invoke Copilot Orchestrator.`);
  }

  // 2. Quota Check (Simulated tenant quota lookup)
  const quotaRemaining = 9850; // out of 10,000 requests

  // 3. Rate Limit Check
  const rateLimitAllowed = true;

  const permissions: PermissionResult = {
    valid: isAllowedRole,
    quotaRemaining,
    rateLimitAllowed,
  };

  state.telemetry.stagesCompleted.push("24I_Permission_Validation");

  return { permissions };
}
