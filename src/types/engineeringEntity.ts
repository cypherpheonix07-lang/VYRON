/**
 * VYRON — UNIVERSAL ENGINEERING ENTITY CONTRACT (PHASE 03)
 * The canonical data contract for all engineering objects in the system:
 * Identity, Type, Owner, Source, Version, Time, Status, Confidence,
 * Provenance, Relationships, Impact, Evidence, Actions.
 * Strictly ZERO SQL.
 */

export type UniversalEntityType =
  | "project"
  | "requirement"
  | "service"
  | "component"
  | "dependency"
  | "api"
  | "database_object"
  | "configuration"
  | "decision"
  | "test"
  | "vulnerability"
  | "risk"
  | "anomaly"
  | "drift_finding"
  | "release"
  | "deployment"
  | "telemetry_event"
  | "incident"
  | "simulation"
  | "evidence"
  | "plugin"
  | "connector"
  | "ai_run";

export type BlastRadiusTier =
  | "DIRECT"
  | "TRANSITIVE"
  | "UNCERTAIN"
  | "HIGH_RISK"
  | "UNVERIFIED";

export type CausalityTier =
  | "OBSERVED_CORRELATION"
  | "INFERRED_CAUSAL_HYPOTHESIS"
  | "VERIFIED_CAUSAL_RELATIONSHIP";

export type EvidenceLifecycleState =
  | "UNVERIFIED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "EXPIRED"
  | "REVOKED"
  | "CONTRADICTED";

export type EvidenceState = EvidenceLifecycleState;

export type AIEpistemicState =
  | "FACT"
  | "OBSERVATION"
  | "INFERENCE"
  | "HYPOTHESIS"
  | "RECOMMENDATION";

export type EpistemicState = AIEpistemicState;

export type UserAuthority =
  | "CHIEF_ARCHITECT"
  | "SECURITY_LEAD"
  | "SECURITY_OFFICER"
  | "CISO"
  | "STAFF_ENGINEER"
  | "SRE_LEAD"
  | "RELEASE_CAPTAIN"
  | "RELEASE_ENGINEER"
  | "DEVELOPER";

export type GovernanceActionLevel =
  | "READ"
  | "ANALYZE"
  | "RECOMMEND"
  | "SIMULATE"
  | "MODIFY"
  | "DEPLOY"
  | "APPROVE"
  | "ADMINISTER";

export type ReleaseDecisionState =
  | "READY"
  | "CONDITIONALLY_READY"
  | "REVIEW_REQUIRED"
  | "BLOCKED";

export interface EntityRelationshipLink {
  targetId: string;
  targetType: UniversalEntityType;
  relationship: string;
  provenance: string;
  confidence: number;
}

export interface EntityImpactProfile {
  blastRadius: BlastRadiusTier;
  affectedServices: string[];
  affectedRequirements: string[];
  affectedPolicies: string[];
  releaseBlocker: boolean;
  recoveryEstimateHours?: number | undefined;
}

export interface EntityEvidenceRef {
  hash: string;
  algorithm: string;
  signer: string;
  state: EvidenceLifecycleState;
  timestamp: string;
  artifactUri?: string | undefined;
}

export interface EntityActionDef {
  id: string;
  label: string;
  description: string;
  requiredAuthority: "CHIEF_ARCHITECT" | "SECURITY_LEAD" | "RELEASE_ENGINEER" | "DEVELOPER";
  actionLevel: GovernanceActionLevel;
  handlerName: string;
  isDangerous?: boolean | undefined;
}

/**
 * The Canonical Universal Engineering Object Contract
 */
export interface EngineeringEntity {
  identity: string;
  type: UniversalEntityType;
  title: string;
  owner: string;
  source: string;
  version: string;
  time: string;
  status: string;
  confidence: number; // 0 to 1
  provenance: string;
  relationships: EntityRelationshipLink[];
  impact: EntityImpactProfile;
  evidence: EntityEvidenceRef;
  actions: EntityActionDef[];
  metadata?: Record<string, unknown> | undefined;
}
