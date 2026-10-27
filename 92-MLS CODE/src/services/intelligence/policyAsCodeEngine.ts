/**
 * VYRON — P17: GOVERNANCE, POLICY-AS-CODE & AUTHORITY FENCING
 * Fine-grained attribute and role-based policy evaluation engine,
 * blast radius constraints, and execution fences.
 * Strictly ZERO operational raw SQL.
 */

import type { UserAuthority } from "@/types/engineeringEntity";

export type ExecutionEnvironment = "DEMO" | "STAGING" | "PRODUCTION";

export interface PolicyRule {
  id: string;
  allowedRoles: UserAuthority[];
  action: string;
  allowedEnvironments: ExecutionEnvironment[];
  maxBlastRadius: "LOCAL" | "SUBSYSTEM" | "SYSTEM_WIDE";
  requiresApproval: boolean;
}

export interface PolicyDecision {
  allowed: boolean;
  ruleId?: string | undefined;
  reason: string;
  requiresDualSignoff: boolean;
  evaluatedAt: string;
}

export class PolicyAsCodeEngine {
  private static readonly RULES: PolicyRule[] = [
    {
      id: "POL-01",
      allowedRoles: ["CHIEF_ARCHITECT", "SECURITY_LEAD", "SRE_LEAD", "STAFF_ENGINEER", "DEVELOPER"],
      action: "READ_TELEMETRY",
      allowedEnvironments: ["DEMO", "STAGING", "PRODUCTION"],
      maxBlastRadius: "SYSTEM_WIDE",
      requiresApproval: false
    },
    {
      id: "POL-02",
      allowedRoles: ["CHIEF_ARCHITECT", "SRE_LEAD", "STAFF_ENGINEER"],
      action: "SIMULATE_CHAOS",
      allowedEnvironments: ["DEMO", "STAGING"],
      maxBlastRadius: "SUBSYSTEM",
      requiresApproval: false
    },
    {
      id: "POL-03",
      allowedRoles: ["CHIEF_ARCHITECT"],
      action: "APPROVE_ADR_MUTATION",
      allowedEnvironments: ["STAGING", "PRODUCTION"],
      maxBlastRadius: "SYSTEM_WIDE",
      requiresApproval: true
    },
    {
      id: "POL-04",
      allowedRoles: ["CHIEF_ARCHITECT", "SECURITY_LEAD"],
      action: "DEPLOY_HOTFIX",
      allowedEnvironments: ["PRODUCTION"],
      maxBlastRadius: "SUBSYSTEM",
      requiresApproval: true
    }
  ];

  public static evaluatePolicy(
    role: UserAuthority,
    action: string,
    environment: ExecutionEnvironment,
    blastRadius: "LOCAL" | "SUBSYSTEM" | "SYSTEM_WIDE"
  ): PolicyDecision {
    const matchingRule = this.RULES.find((r) => r.action === action);

    if (!matchingRule) {
      return {
        allowed: false,
        reason: `No policy rule permits action: ${action}. Denied by default.`,
        requiresDualSignoff: false,
        evaluatedAt: new Date().toISOString()
      };
    }

    if (!matchingRule.allowedRoles.includes(role)) {
      return {
        allowed: false,
        ruleId: matchingRule.id,
        reason: `Role ${role} is not authorized for action ${action}. Required: [${matchingRule.allowedRoles.join(", ")}]`,
        requiresDualSignoff: false,
        evaluatedAt: new Date().toISOString()
      };
    }

    if (!matchingRule.allowedEnvironments.includes(environment)) {
      return {
        allowed: false,
        ruleId: matchingRule.id,
        reason: `Action ${action} is not permitted in environment ${environment}. Allowed: [${matchingRule.allowedEnvironments.join(", ")}]`,
        requiresDualSignoff: false,
        evaluatedAt: new Date().toISOString()
      };
    }

    const blastRadiusLevels = { LOCAL: 1, SUBSYSTEM: 2, SYSTEM_WIDE: 3 };
    if (blastRadiusLevels[blastRadius] > blastRadiusLevels[matchingRule.maxBlastRadius]) {
      return {
        allowed: false,
        ruleId: matchingRule.id,
        reason: `Blast radius ${blastRadius} exceeds maximum permitted ${matchingRule.maxBlastRadius} for action ${action}.`,
        requiresDualSignoff: false,
        evaluatedAt: new Date().toISOString()
      };
    }

    return {
      allowed: true,
      ruleId: matchingRule.id,
      reason: "Action complies with policy-as-code specification.",
      requiresDualSignoff: matchingRule.requiresApproval,
      evaluatedAt: new Date().toISOString()
    };
  }

  public static getAllRules(): PolicyRule[] {
    return this.RULES;
  }
}
