/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Transactional Mutation Engine (Phase 05)
 * Strict separation: AI generates proposals; Mutation Engine commits state updates.
 * Strictly ZERO Raw SQL.
 */

import {
  ProjectEngineeringState,
  AiProposal,
  AiMutation,
} from "@/types/aiProjectControlPlane";
import { projectMemory } from "../context/projectMemory";

export interface MutationCommitResult {
  success: boolean;
  newState: ProjectEngineeringState;
  mutation: AiMutation;
  error?: string;
}

export class MutationEngine {
  private static instance: MutationEngine | null = null;

  private constructor() {}

  public static getInstance(): MutationEngine {
    if (!MutationEngine.instance) {
      MutationEngine.instance = new MutationEngine();
    }
    return MutationEngine.instance;
  }

  /**
   * Applies an approved proposal atomically to state, incrementing version and writing to audit ledger.
   */
  public commitProposal(
    state: ProjectEngineeringState,
    proposal: AiProposal,
    committerId = "system_operator",
  ): MutationCommitResult {
    try {
      const newVersion = state.version + 1;
      const appliedAt = new Date().toISOString();
      const snapshotHash = `sha256_${Date.now()}_v${newVersion}`;

      const mutation: AiMutation = {
        id: `mut-${Date.now()}`,
        proposalId: proposal.id,
        stage: proposal.stage,
        mutationLevel: proposal.sensitivityLevel,
        appliedBy: committerId,
        appliedAt,
        snapshotHash,
      };

      // Atomic State Merge
      const newState: ProjectEngineeringState = {
        ...state,
        ...proposal.proposedChanges,
        version: newVersion,
        updatedAt: appliedAt,
        pendingProposals: state.pendingProposals.filter((p) => p.id !== proposal.id),
        mutationAuditTrail: [...state.mutationAuditTrail, mutation],
      };

      // Record snapshot in ProjectMemory
      projectMemory.recordSnapshot({
        version: newVersion,
        timestamp: appliedAt,
        summary: `Applied proposal: ${proposal.title}`,
        stateHash: snapshotHash,
      });

      return {
        success: true,
        newState,
        mutation,
      };
    } catch (err) {
      return {
        success: false,
        newState: state,
        mutation: null as unknown as AiMutation,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

export const mutationEngine = MutationEngine.getInstance();
