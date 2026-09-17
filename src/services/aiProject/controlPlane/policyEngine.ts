/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Control Plane Policy Engine (Phase 05)
 * Enforces permissions and human approval gates across Mutation Sensitivity Levels 0–4.
 * Strictly ZERO Raw SQL.
 */

import { MutationSensitivityLevel, AgentRole } from "@/types/aiProjectControlPlane";

export type PolicyDecision = "ALLOW" | "DENY" | "REQUIRE_APPROVAL";

export interface PolicyEvaluationResult {
  decision: PolicyDecision;
  sensitivityLevel: MutationSensitivityLevel;
  requiresHumanSignature: boolean;
  reason: string;
}

export class PolicyEngine {
  private static instance: PolicyEngine | null = null;

  private constructor() {}

  public static getInstance(): PolicyEngine {
    if (!PolicyEngine.instance) {
      PolicyEngine.instance = new PolicyEngine();
    }
    return PolicyEngine.instance;
  }

  /**
   * Evaluates whether an agent action is permitted or requires human-in-the-loop approval.
   */
  public evaluateAction(
    agentRole: AgentRole,
    actionType: string,
    mutationLevel: MutationSensitivityLevel,
  ): PolicyEvaluationResult {
    // Level 0: Informational (Reading context, generating suggestions)
    if (mutationLevel === "L0_INFORMATIONAL") {
      return {
        decision: "ALLOW",
        sensitivityLevel: mutationLevel,
        requiresHumanSignature: false,
        reason: "Read-only informational action with zero state side-effects.",
      };
    }

    // Level 1: Low-Risk Draft (Adding draft requirement, updating understanding)
    if (mutationLevel === "L1_DRAFT") {
      return {
        decision: "ALLOW",
        sensitivityLevel: mutationLevel,
        requiresHumanSignature: false,
        reason: "Low-risk draft operation; automatically stored in draft state.",
      };
    }

    // Level 2: Project Modification (Adding questions, editing non-breaking fields)
    if (mutationLevel === "L2_PROJECT_MODIFICATION") {
      return {
        decision: "ALLOW",
        sensitivityLevel: mutationLevel,
        requiresHumanSignature: false,
        reason: "Standard project modification adhering to schema contracts.",
      };
    }

    // Level 3: Structural Modification (Changing baseline architecture, pruning scope)
    if (mutationLevel === "L3_STRUCTURAL_APPROVAL") {
      return {
        decision: "REQUIRE_APPROVAL",
        sensitivityLevel: mutationLevel,
        requiresHumanSignature: true,
        reason: `Structural modification proposed by ${agentRole} (${actionType}). Requires explicit human architect approval.`,
      };
    }

    // Level 4: Destructive / Critical (Deleting requirements, project initialization, modifying security)
    if (mutationLevel === "L4_CRITICAL") {
      return {
        decision: "REQUIRE_APPROVAL",
        sensitivityLevel: mutationLevel,
        requiresHumanSignature: true,
        reason: "Critical/destructive mutation affecting security or database schema. Strict human sign-off required.",
      };
    }

    return {
      decision: "DENY",
      sensitivityLevel: mutationLevel,
      requiresHumanSignature: false,
      reason: "Action denied by default security policy.",
    };
  }
}

export const policyEngine = PolicyEngine.getInstance();
