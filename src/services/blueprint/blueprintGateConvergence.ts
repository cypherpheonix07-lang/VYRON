/**
 * VYRON — BLUEPRINT GRAPH × RELEASE GATE CONVERGENCE ORCHESTRATOR
 * GOD MODE vULTIMA ΩΩΩΩΩΩΩΩ
 * Master Convergence Loop:
 * CHANGE → GRAPH UPDATE → DEPENDENCY PROPAGATION → GATE INVALIDATION
 * → EVIDENCE RECHECK → RISK RECALCULATION → GATE EVALUATION
 * → USER/COPILOT NOTIFICATION → GRAPH CONVERGENCE.
 * Strictly ZERO Raw SQL.
 */

import {
  blueprintGraphEngine,
  BlueprintGraphNode,
  BlueprintGraphEdge,
} from "@/services/blueprint/blueprintGraphEngine";
import {
  releaseGateEngine,
  ReleaseGateDefinition,
  DecomposedReleaseScore,
  CausalBlockerExplanation,
} from "@/services/release/releaseGateEngine";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";

export interface ConvergenceCycleResult {
  cycleId: string;
  triggerEvent: string;
  timestamp: string;
  mutatedNodeIds: string[];
  transitiveImpactedNodeIds: string[];
  invalidatedGateIds: string[];
  recalculatedReadiness: DecomposedReleaseScore;
  cycleVerificationHash: string;
  illuminatedFailurePaths: Array<{
    gateId: string;
    path: string[];
    severity: string;
  }>;
}

export type ConvergenceEventListener = (result: ConvergenceCycleResult) => void;

export class BlueprintGateConvergence {
  private static instance: BlueprintGateConvergence | null = null;
  private listeners: Set<ConvergenceEventListener> = new Set();

  private constructor() {}

  public static getInstance(): BlueprintGateConvergence {
    if (!BlueprintGateConvergence.instance) {
      BlueprintGateConvergence.instance = new BlueprintGateConvergence();
    }
    return BlueprintGateConvergence.instance;
  }

  public subscribe(listener: ConvergenceEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(result: ConvergenceCycleResult): void {
    this.listeners.forEach((listener) => {
      try {
        listener(result);
      } catch (err) {
        console.error("Error in convergence listener:", err);
      }
    });
  }

  /**
   * Executes the full Realtime Convergence Loop on a node mutation.
   */
  public handleNodeMutation(
    nodeData: Partial<BlueprintGraphNode> & { id: string },
    author = "Engineer"
  ): ConvergenceCycleResult {
    const cycleId = `CYC-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    // 1. Mutate Graph Node
    const updatedNode = blueprintGraphEngine.upsertNode(nodeData, author);

    // 2. Propagate Dependencies (transitive descendants)
    const descendants = blueprintGraphEngine.getDownstreamDescendants(updatedNode.id);
    const allImpactedNodeIds = [updatedNode.id, ...descendants];

    // 3. Invalidate Dependent Gates
    const invalidatedGates = new Set<string>();
    for (const nodeId of allImpactedNodeIds) {
      const boundGates = releaseGateEngine.getGatesForNode(nodeId);
      boundGates.forEach((g) => invalidatedGates.add(g.id));
    }

    // 4. Re-evaluate Invalidated Gates
    for (const gateId of invalidatedGates) {
      const gate = releaseGateEngine.getGate(gateId);
      if (gate) {
        if (updatedNode.state === "FAILED" || updatedNode.healthScore < 50) {
          releaseGateEngine.updateGateStatus(
            gateId,
            "FAILED",
            "LIVE",
            Math.min(gate.score, updatedNode.healthScore),
            `Bound graph node [${updatedNode.label}] reported degraded health (${updatedNode.healthScore}%) or state [${updatedNode.state}].`
          );
        } else if (updatedNode.freshness === "STALE") {
          releaseGateEngine.updateGateStatus(
            gateId,
            "STALE",
            "STALE",
            gate.score,
            `Bound graph node [${updatedNode.label}] context evidence is STALE (>24h).`
          );
        } else {
          // Revalidate positive gate status
          releaseGateEngine.updateGateStatus(gateId, "VERIFIED", "LIVE", 100);
        }
      }
    }

    // 5. Recalculate Overall Release Readiness
    const readiness = releaseGateEngine.evaluateReleaseReadiness();

    // 6. Trace Illuminated Failure Paths
    const illuminatedFailurePaths: ConvergenceCycleResult["illuminatedFailurePaths"] = [];
    for (const gateId of readiness.blockingGateIds) {
      const explanation = releaseGateEngine.explainWhyBlocked(gateId);
      const upstream = blueprintGraphEngine.getUpstreamAncestors(updatedNode.id);
      illuminatedFailurePaths.push({
        gateId,
        path: [...upstream, updatedNode.id, ...descendants],
        severity: "BLOCKING",
      });
    }

    const cycleVerificationHash = generateVerificationHash(
      `${cycleId}:${updatedNode.id}:${readiness.overallScore}:${now}`
    );

    const result: ConvergenceCycleResult = {
      cycleId,
      triggerEvent: `Node Mutation on [${updatedNode.id}]: ${updatedNode.label}`,
      timestamp: now,
      mutatedNodeIds: [updatedNode.id],
      transitiveImpactedNodeIds: allImpactedNodeIds,
      invalidatedGateIds: Array.from(invalidatedGates),
      recalculatedReadiness: readiness,
      cycleVerificationHash,
      illuminatedFailurePaths,
    };

    this.notify(result);
    return result;
  }

  /**
   * Recomputes entire convergence status across all active graph nodes and gates.
   */
  public recomputeConvergence(): ConvergenceCycleResult {
    const cycleId = `CYC-RECOMP-${Date.now()}`;
    const now = new Date().toISOString();
    const readiness = releaseGateEngine.evaluateReleaseReadiness();

    const illuminatedFailurePaths: ConvergenceCycleResult["illuminatedFailurePaths"] = [];
    for (const gateId of readiness.blockingGateIds) {
      const gate = releaseGateEngine.getGate(gateId);
      if (gate) {
        illuminatedFailurePaths.push({
          gateId,
          path: gate.boundNodeIds,
          severity: gate.severity,
        });
      }
    }

    const cycleVerificationHash = generateVerificationHash(`${cycleId}:${readiness.overallScore}:${now}`);

    return {
      cycleId,
      triggerEvent: "Full System Convergence Recompute",
      timestamp: now,
      mutatedNodeIds: [],
      transitiveImpactedNodeIds: [],
      invalidatedGateIds: readiness.blockingGateIds,
      recalculatedReadiness: readiness,
      cycleVerificationHash,
      illuminatedFailurePaths,
    };
  }
}

export const blueprintGateConvergence = BlueprintGateConvergence.getInstance();
