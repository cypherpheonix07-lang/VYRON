/**
 * VYRON — P09: SOURCE OF TRUTH ARCHITECTURE & PROJECTION PATHWAYS
 * Subsystem data ownership matrix, projection pipelines, and consistency guarantees.
 * Strictly ZERO operational raw SQL.
 */

export type SubsystemAuthority = 
  | "GIT_SCM_FABRIC"             // Commits, branches, PRs, diffs
  | "WORKPULSE_TELEMETRY"        // Live runtime metrics, DORA, developer pulse
  | "ARCHITECTURE_GOVERNANCE"    // AST, dependency graphs, ADRs, drift alerts
  | "AGENT_RUNTIME"              // Copilot sessions, specialist dispatch, tool broker
  | "SECURITY_POLICY_ENGINE"     // RBAC, STRIDE threat models, blast radius
  | "TRUTH_STATE_MANIFEST";      // Verified capabilities, quarantine locks

export interface SubsystemOwnershipRecord {
  subsystem: SubsystemAuthority;
  authoritativeEntities: string[];
  readModelProjections: string[];
  syncMode: "SYNCHRONOUS" | "EVENT_DRIVEN" | "POLLING_FALLBACK";
  consistencyGuarantee: "STRONG" | "EVENTUAL_BOUNDED" | "READ_OPTIMISTIC";
  evictionPolicy: string;
}

export class SourceOfTruthArchitecture {
  private static readonly OWNERSHIP_REGISTRY: Record<SubsystemAuthority, SubsystemOwnershipRecord> = {
    GIT_SCM_FABRIC: {
      subsystem: "GIT_SCM_FABRIC",
      authoritativeEntities: ["Repository", "Commit", "PullRequest", "GitBlame"],
      readModelProjections: ["CommitDriftView", "AuthorHeatmap", "ChangeFrequency"],
      syncMode: "EVENT_DRIVEN",
      consistencyGuarantee: "STRONG",
      evictionPolicy: "LRU_IMMUTABLE_COMMIT_CACHE"
    },
    WORKPULSE_TELEMETRY: {
      subsystem: "WORKPULSE_TELEMETRY",
      authoritativeEntities: ["RuntimeMetric", "DORAScore", "DeveloperVelocity", "LatencyHistogram"],
      readModelProjections: ["PulseDashboardRollup", "AnomalyWindowBuffer"],
      syncMode: "SYNCHRONOUS",
      consistencyGuarantee: "EVENTUAL_BOUNDED",
      evictionPolicy: "TIME_SERIES_RING_BUFFER"
    },
    ARCHITECTURE_GOVERNANCE: {
      subsystem: "ARCHITECTURE_GOVERNANCE",
      authoritativeEntities: ["ArchitecturalDecisionRecord", "DependencyGraph", "DriftViolation"],
      readModelProjections: ["SystemHealthComposite", "ModularBoundaryScore"],
      syncMode: "EVENT_DRIVEN",
      consistencyGuarantee: "STRONG",
      evictionPolicy: "ON_COMMIT_INVALIDATION"
    },
    AGENT_RUNTIME: {
      subsystem: "AGENT_RUNTIME",
      authoritativeEntities: ["AgentSession", "DispatchJob", "ToolExecutionLog"],
      readModelProjections: ["ActiveMissionCard", "AgentAuditTrail"],
      syncMode: "SYNCHRONOUS",
      consistencyGuarantee: "READ_OPTIMISTIC",
      evictionPolicy: "SESSION_TERMINATION_PURGE"
    },
    SECURITY_POLICY_ENGINE: {
      subsystem: "SECURITY_POLICY_ENGINE",
      authoritativeEntities: ["RBACPolicy", "STRIDEThreat", "AuditToken"],
      readModelProjections: ["ComplianceReport", "ActiveTokenRegistry"],
      syncMode: "SYNCHRONOUS",
      consistencyGuarantee: "STRONG",
      evictionPolicy: "NEVER_EVICT_REVOCATION_LIST"
    },
    TRUTH_STATE_MANIFEST: {
      subsystem: "TRUTH_STATE_MANIFEST",
      authoritativeEntities: ["CapabilityProof", "QuarantinedBlocker", "TruthVerificationStatus"],
      readModelProjections: ["SystemStatusBadge", "AuditSummaryBanner"],
      syncMode: "SYNCHRONOUS",
      consistencyGuarantee: "STRONG",
      evictionPolicy: "IMMUTABLE_MANIFEST_LOCKED"
    }
  };

  public static getSubsystemOwnership(subsystem: SubsystemAuthority): SubsystemOwnershipRecord {
    return this.OWNERSHIP_REGISTRY[subsystem];
  }

  public static getAllSubsystems(): SubsystemOwnershipRecord[] {
    return Object.values(this.OWNERSHIP_REGISTRY);
  }

  public static resolveAuthoritativeOwner(entityName: string): SubsystemAuthority | "UNKNOWN" {
    for (const record of Object.values(this.OWNERSHIP_REGISTRY)) {
      if (record.authoritativeEntities.includes(entityName)) {
        return record.subsystem;
      }
    }
    return "UNKNOWN";
  }
}
