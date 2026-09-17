/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Project Diff Engine (Phase 05)
 * Visual Git-like diffing between Current Project State and AI-Proposed Mutation.
 * Strictly ZERO Raw SQL.
 */

import { ProjectEngineeringState, ProjectDiffSummary } from "@/types/aiProjectControlPlane";

export class ProjectDiffEngine {
  private static instance: ProjectDiffEngine | null = null;

  private constructor() {}

  public static getInstance(): ProjectDiffEngine {
    if (!ProjectDiffEngine.instance) {
      ProjectDiffEngine.instance = new ProjectDiffEngine();
    }
    return ProjectDiffEngine.instance;
  }

  /**
   * Compares current state with proposed state delta and returns structured diff.
   */
  public computeDiff(
    currentState: ProjectEngineeringState,
    proposedDelta: Partial<ProjectEngineeringState>,
  ): ProjectDiffSummary {
    const added: string[] = [];
    const modified: string[] = [];
    const removed: string[] = [];
    const stale: string[] = [];

    // 1. Requirements Diff
    if (proposedDelta.requirements) {
      const currentMap = new Map(currentState.requirements.map((r) => [r.id, r]));
      const proposedMap = new Map(proposedDelta.requirements.map((r) => [r.id, r]));

      for (const [id, req] of proposedMap.entries()) {
        if (!currentMap.has(id)) {
          added.push(`Requirement: ${req.code} - "${req.title}"`);
        } else {
          const curr = currentMap.get(id)!;
          if (curr.title !== req.title || curr.priority !== req.priority) {
            modified.push(`Requirement modified: ${req.code} [${curr.priority} -> ${req.priority}]`);
          }
        }
      }

      for (const [id, req] of currentMap.entries()) {
        if (!proposedMap.has(id)) {
          removed.push(`Requirement removed: ${req.code} - "${req.title}"`);
          stale.push(`Downstream tasks dependent on ${req.code}`);
        }
      }
    }

    // 2. Architecture Baseline Diff
    if (
      proposedDelta.architecture &&
      proposedDelta.architecture.selectedAlternativeId !== currentState.architecture.selectedAlternativeId
    ) {
      modified.push(
        `Architecture baseline: ${currentState.architecture.selectedAlternativeId} -> ${proposedDelta.architecture.selectedAlternativeId}`,
      );
      stale.push("Security threat model boundaries", "Component failure scenarios");
    }

    // 3. Tech Stack Diff
    if (proposedDelta.technology) {
      for (const decision of proposedDelta.technology.decisions) {
        const curr = currentState.technology.decisions.find((d) => d.category === decision.category);
        if (!curr || curr.selectedOption !== decision.selectedOption) {
          modified.push(`Technology stack [${decision.category}]: ${decision.selectedOption}`);
        }
      }
    }

    return {
      added,
      modified,
      removed,
      stale,
    };
  }
}

export const projectDiffEngine = ProjectDiffEngine.getInstance();
