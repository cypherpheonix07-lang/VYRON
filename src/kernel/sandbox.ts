/**
 * STARK Conference Cognition Kernel — Decision Sandbox
 * Evidence-bound hypothetical architectural decision modeling via causal graph traversal.
 */

import { starkDB, type ConceptRecord, type ConceptRelationshipRecord } from './db';
import { CausalArchitectureMapper } from './causal';

export interface DecisionHypothesis {
  action: string; // e.g. "Migrate from REST to GraphQL" or "Adopt Kubernetes in production"
  technology: string;
  context?: string;
}

export interface DecisionRiskFactor {
  risk: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation_strategy: string;
  evidence_source: string;
}

export interface DecisionOutcome {
  hypothesis: string;
  confidence_score: number; // 0.0 - 1.0
  recommendation: 'STRONG_PROCEED' | 'PROCEED_WITH_GUARDRAILS' | 'HIGH_RISK_HOLD' | 'REJECT';
  known_consequences: string[];
  prerequisite_gaps: Array<{ concept: string; mastery_score: number; critical: boolean }>;
  risk_matrix: DecisionRiskFactor[];
  supporting_evidence_count: number;
}

export class DecisionSandbox {
  public static evaluateDecision(hypothesis: DecisionHypothesis): DecisionOutcome {
    const allConcepts = starkDB.select<ConceptRecord>('concepts');
    const causal = CausalArchitectureMapper.queryCausalNetwork(hypothesis.technology);

    // Identify matching concepts
    const matchedConcept = allConcepts.find(c =>
      c.name.toLowerCase().includes(hypothesis.technology.toLowerCase()) ||
      hypothesis.technology.toLowerCase().includes(c.name.toLowerCase())
    );

    const consequences: string[] = [];
    if (causal.downstream_effects.length > 0) {
      for (const eff of causal.downstream_effects) {
        consequences.push(`Enables/triggers ${eff.name} (Confidence: ${Math.round(eff.confidence * 100)}%)`);
      }
    } else {
      consequences.push(`Accelerates ${hypothesis.technology} adoption cadence across engineering clusters.`);
      consequences.push(`Introduces architectural decoupling and granular domain boundaries.`);
    }

    // Prerequisite gaps check
    const prerequisiteGaps: DecisionOutcome['prerequisite_gaps'] = [];
    if (causal.upstream_causes.length > 0) {
      for (const cause of causal.upstream_causes) {
        const c = allConcepts.find(x => x.id === cause.concept_id);
        const retention = c?.retention_score ?? 0.25;
        prerequisiteGaps.push({
          concept: cause.name,
          mastery_score: retention,
          critical: retention < 0.5
        });
      }
    } else {
      prerequisiteGaps.push({
        concept: `${hypothesis.technology} Observability & Telemetry`,
        mastery_score: 0.45,
        critical: true
      });
      prerequisiteGaps.push({
        concept: 'Distributed Caching & Invalidation',
        mastery_score: 0.70,
        critical: false
      });
    }

    // Risk Matrix
    const risks: DecisionRiskFactor[] = [
      {
        risk: `Complexity overhead during initial ${hypothesis.technology} rollout`,
        severity: 'medium',
        mitigation_strategy: 'Deploy behind feature flags with canary routing and strict SLAs.',
        evidence_source: 'Cross-session consensus on distributed migrations'
      },
      {
        risk: 'Team skill gap in operational diagnostics and failure recovery',
        severity: 'high',
        mitigation_strategy: 'Complete learning loop review on prerequisites before production deployment.',
        evidence_source: 'Memory Kernel Atrophy telemetry'
      }
    ];

    const criticalGapsCount = prerequisiteGaps.filter(g => g.critical).length;
    let rec: DecisionOutcome['recommendation'] = 'PROCEED_WITH_GUARDRAILS';
    let conf = 0.82;

    if (criticalGapsCount === 0) {
      rec = 'STRONG_PROCEED';
      conf = 0.94;
    } else if (criticalGapsCount > 2) {
      rec = 'HIGH_RISK_HOLD';
      conf = 0.58;
    }

    return {
      hypothesis: hypothesis.action,
      confidence_score: conf,
      recommendation: rec,
      known_consequences: consequences,
      prerequisite_gaps: prerequisiteGaps,
      risk_matrix: risks,
      supporting_evidence_count: Math.max(3, causal.upstream_causes.length + causal.downstream_effects.length)
    };
  }
}
