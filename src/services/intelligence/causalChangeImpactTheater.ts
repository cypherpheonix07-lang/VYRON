/**
 * Causal Change Impact Theater — Blast Radius, Dependency Breakage & Change DNA Engine
 */

export interface AffectedEntity {
  entityId: string;
  name: string;
  type: "SERVICE" | "API_ROUTE" | "DATABASE_TABLE" | "COMPONENT" | "INTEGRATION" | "CONFIG";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  directOrTransitive: "DIRECT" | "TRANSITIVE";
  reason: string;
}

export interface ChangeImpactAssessment {
  assessmentId: string;
  projectId: string;
  proposedChangeSummary: string;
  affectedEntities: AffectedEntity[];
  blastRadiusScore: number; // 0 to 100
  securityConsequences: string[];
  costImpactDeltaUsd: number;
  breakingChangesDetected: boolean;
  rollbackPlanFeasibility: "AUTOMATED_INSTANT" | "MANUAL_SCHEMA_MIGRATION" | "COMPLEX_RECOVERY";
  recommendedMitigations: string[];
  simulatedAt: string;
}

class CausalChangeImpactTheaterEngine {
  public assessChange(
    projectId: string,
    changeDescription: string,
    changedFiles: string[] = []
  ): ChangeImpactAssessment {
    const isSchemaChange = changedFiles.some((f) => f.includes("schema") || f.includes("migration") || f.includes("supabase"));
    const isAuthChange = changedFiles.some((f) => f.includes("auth") || f.includes("session") || f.includes("token"));
    const isAdapterChange = changedFiles.some((f) => f.includes("adapter") || f.includes("connector"));

    const affected: AffectedEntity[] = [];

    if (isAuthChange) {
      affected.push({
        entityId: "auth-layer",
        name: "Authentication & Session Boundary",
        type: "SERVICE",
        severity: "HIGH",
        directOrTransitive: "DIRECT",
        reason: "Modifies user identity validation and token issuance flow.",
      });
      affected.push({
        entityId: "api-gateway",
        name: "API Authorization Middleware",
        type: "API_ROUTE",
        severity: "HIGH",
        directOrTransitive: "TRANSITIVE",
        reason: "Downstream protected endpoints depend on session signature.",
      });
    }

    if (isSchemaChange) {
      affected.push({
        entityId: "db-schema",
        name: "PostgreSQL Database Schema",
        type: "DATABASE_TABLE",
        severity: "CRITICAL",
        directOrTransitive: "DIRECT",
        reason: "Schema alteration requires migration safety verification and zero-downtime lock analysis.",
      });
    }

    if (isAdapterChange) {
      affected.push({
        entityId: "connector-mesh",
        name: "Ecosystem Connectors & MCP Mesh",
        type: "INTEGRATION",
        severity: "MEDIUM",
        directOrTransitive: "DIRECT",
        reason: "Connector protocol update might require credentials or scope negotiation.",
      });
    }

    // Baseline affected entities
    affected.push({
      entityId: "ui-theater",
      name: "Evidence Preview Theater",
      type: "COMPONENT",
      severity: "LOW",
      directOrTransitive: "TRANSITIVE",
      reason: "UI components re-render with fresh lineage tokens.",
    });

    const blastRadiusScore = Math.min(100, Math.max(15, affected.length * 20 + (isSchemaChange ? 30 : 0)));

    return {
      assessmentId: `cia-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId,
      proposedChangeSummary: changeDescription,
      affectedEntities: affected,
      blastRadiusScore,
      securityConsequences: isAuthChange
        ? ["Enforce non-regression of token signature validation", "Verify zero silent privilege escalation"]
        : ["No elevated security risk detected in change diff"],
      costImpactDeltaUsd: 0.0,
      breakingChangesDetected: isSchemaChange,
      rollbackPlanFeasibility: isSchemaChange ? "MANUAL_SCHEMA_MIGRATION" : "AUTOMATED_INSTANT",
      recommendedMitigations: [
        "Execute automated acceptance gate suite before merge",
        "Record pre-change snapshot in Engineering Flight Recorder",
      ],
      simulatedAt: new Date().toISOString(),
    };
  }
}

export const causalChangeImpactTheater = new CausalChangeImpactTheaterEngine();
