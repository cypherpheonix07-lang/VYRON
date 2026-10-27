/**
 * VYRON — P08: CANONICAL DOMAIN MODEL & ENTITY STATE MACHINES
 * Universal domain entities, relationships, validation invariants,
 * and deterministic state transition machines across the engineering intelligence plane.
 * Strictly ZERO operational raw SQL.
 */

export type EntityUrn = `urn:vyron:${string}:${string}`;

export type IncidentLifecycleState = 
  | "DETECTED"
  | "TRIAGED"
  | "ROOT_CAUSED"
  | "REMEDIATING"
  | "POSTCONDITION_VERIFYING"
  | "RESOLVED"
  | "CLOSED";

export type ActionProposalState =
  | "DRAFTED"
  | "POLICY_CHECKED"
  | "AWAITING_APPROVAL"
  | "EXECUTING"
  | "SUCCEEDED"
  | "FAILED"
  | "ROLLED_BACK";

export interface CanonicalService {
  urn: EntityUrn;
  name: string;
  tier: "TIER_0" | "TIER_1" | "TIER_2";
  ownerTeam: string;
  repositoryUrn: EntityUrn;
  healthScore: number; // 0.00 to 1.00
  activeVersion: string;
}

export interface CanonicalIncident {
  id: string;
  serviceUrn: EntityUrn;
  title: string;
  severity: "SEV1" | "SEV2" | "SEV3" | "SEV4";
  state: IncidentLifecycleState;
  detectedAt: string;
  resolvedAt?: string | undefined;
  causalCommitUrn?: EntityUrn | undefined;
  evidenceNodeIds: string[];
}

export interface CanonicalActionProposal {
  id: string;
  incidentId?: string | undefined;
  title: string;
  targetServiceUrn: EntityUrn;
  state: ActionProposalState;
  riskTier: string;
  proposedChanges: string[];
  evidenceHash: string;
  createdAt: string;
  updatedAt: string;
}

export class CanonicalDomainModelEngine {
  private static readonly VALID_INCIDENT_TRANSITIONS: Record<IncidentLifecycleState, IncidentLifecycleState[]> = {
    DETECTED: ["TRIAGED", "CLOSED"],
    TRIAGED: ["ROOT_CAUSED", "CLOSED"],
    ROOT_CAUSED: ["REMEDIATING", "CLOSED"],
    REMEDIATING: ["POSTCONDITION_VERIFYING", "CLOSED"],
    POSTCONDITION_VERIFYING: ["RESOLVED", "REMEDIATING"],
    RESOLVED: ["CLOSED"],
    CLOSED: [] // Terminal
  };

  private static readonly VALID_ACTION_TRANSITIONS: Record<ActionProposalState, ActionProposalState[]> = {
    DRAFTED: ["POLICY_CHECKED", "FAILED"],
    POLICY_CHECKED: ["AWAITING_APPROVAL", "EXECUTING", "FAILED"],
    AWAITING_APPROVAL: ["EXECUTING", "FAILED"],
    EXECUTING: ["SUCCEEDED", "FAILED", "ROLLED_BACK"],
    SUCCEEDED: [],
    FAILED: ["ROLLED_BACK"],
    ROLLED_BACK: []
  };

  public static createServiceUrn(subsystem: string, name: string): EntityUrn {
    return `urn:vyron:${subsystem.toLowerCase()}:${name.toLowerCase()}`;
  }

  public static transitionIncident(
    currentState: IncidentLifecycleState,
    nextState: IncidentLifecycleState
  ): { valid: boolean; reason?: string | undefined } {
    const allowed = this.VALID_INCIDENT_TRANSITIONS[currentState] || [];
    if (allowed.includes(nextState)) {
      return { valid: true };
    }
    return {
      valid: false,
      reason: `Illegal incident lifecycle transition from ${currentState} to ${nextState}. Allowed: [${allowed.join(", ")}]`
    };
  }

  public static transitionAction(
    currentState: ActionProposalState,
    nextState: ActionProposalState
  ): { valid: boolean; reason?: string | undefined } {
    const allowed = this.VALID_ACTION_TRANSITIONS[currentState] || [];
    if (allowed.includes(nextState)) {
      return { valid: true };
    }
    return {
      valid: false,
      reason: `Illegal action state transition from ${currentState} to ${nextState}. Allowed: [${allowed.join(", ")}]`
    };
  }

  public static validateServiceInvariant(service: CanonicalService): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!service.urn.startsWith("urn:vyron:")) {
      errors.push(`Invalid URN format: ${service.urn}`);
    }
    if (service.healthScore < 0 || service.healthScore > 1) {
      errors.push(`Health score must be between 0.0 and 1.0, got: ${service.healthScore}`);
    }
    if (!service.name || service.name.trim().length === 0) {
      errors.push("Service name must not be empty.");
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
