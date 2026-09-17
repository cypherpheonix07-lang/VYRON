/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Deterministic Workflow State Machine (Phase 05)
 * Governs lifecycle states, transition guards, and pre/post conditions.
 * Strictly ZERO Raw SQL.
 */

import { ProjectLifecycleStage, StageStatus, ProjectEngineeringState } from "@/types/aiProjectControlPlane";

export interface StageTransitionRule {
  stage: ProjectLifecycleStage;
  label: string;
  allowedNextStages: ProjectLifecycleStage[];
  requiredPreConditions: (state: ProjectEngineeringState) => { valid: boolean; error?: string };
}

export const STAGE_TRANSITION_RULES: Record<ProjectLifecycleStage, StageTransitionRule> = {
  "01_INTENT": {
    stage: "01_INTENT",
    label: "Project Intent",
    allowedNextStages: ["02_PROBLEM", "03_REQUIREMENTS"],
    requiredPreConditions: (state) => ({
      valid: !!state.intent.naturalLanguageIntent.trim(),
      error: "Natural language intent cannot be empty.",
    }),
  },
  "02_PROBLEM": {
    stage: "02_PROBLEM",
    label: "Problem Engineering",
    allowedNextStages: ["03_REQUIREMENTS"],
    requiredPreConditions: (state) => ({
      valid: !!state.problem.problemStatement.trim(),
      error: "Problem statement must be synthesized before proceeding.",
    }),
  },
  "03_REQUIREMENTS": {
    stage: "03_REQUIREMENTS",
    label: "Requirements Engineering",
    allowedNextStages: ["04_SCOPE", "05_CAPABILITY"],
    requiredPreConditions: (state) => ({
      valid: state.requirements.length > 0,
      error: "At least one atomic requirement is required.",
    }),
  },
  "04_SCOPE": {
    stage: "04_SCOPE",
    label: "Scope Engineering",
    allowedNextStages: ["05_CAPABILITY", "06_ARCHITECTURE"],
    requiredPreConditions: (state) => ({
      valid: state.scope.mvpRequirements.length > 0,
      error: "At least one requirement must be allocated to MVP scope.",
    }),
  },
  "05_CAPABILITY": {
    stage: "05_CAPABILITY",
    label: "Capability Modeling",
    allowedNextStages: ["06_ARCHITECTURE"],
    requiredPreConditions: (state) => ({
      valid: state.capabilities.capabilities.length > 0,
      error: "At least one system capability must be defined.",
    }),
  },
  "06_ARCHITECTURE": {
    stage: "06_ARCHITECTURE",
    label: "System Architecture",
    allowedNextStages: ["07_TECHNOLOGY", "08_DATA", "10_SECURITY"],
    requiredPreConditions: (state) => ({
      valid: state.architecture.alternatives.length > 0 && !!state.architecture.selectedAlternativeId,
      error: "An architecture baseline alternative must be selected.",
    }),
  },
  "07_TECHNOLOGY": {
    stage: "07_TECHNOLOGY",
    label: "Technology Stack",
    allowedNextStages: ["08_DATA", "09_AI_DESIGN", "10_SECURITY"],
    requiredPreConditions: (state) => ({
      valid: state.technology.decisions.length > 0,
      error: "Technology decisions must be established.",
    }),
  },
  "08_DATA": {
    stage: "08_DATA",
    label: "Data Architecture",
    allowedNextStages: ["09_AI_DESIGN", "10_SECURITY", "11_RELIABILITY"],
    requiredPreConditions: (state) => ({
      valid: state.data.entities.length > 0,
      error: "At least one core data entity is required.",
    }),
  },
  "09_AI_DESIGN": {
    stage: "09_AI_DESIGN",
    label: "AI / ML Systems",
    allowedNextStages: ["10_SECURITY", "11_RELIABILITY", "12_IMPLEMENTATION"],
    requiredPreConditions: () => ({ valid: true }), // Conditional stage
  },
  "10_SECURITY": {
    stage: "10_SECURITY",
    label: "Security & Threat Model",
    allowedNextStages: ["11_RELIABILITY", "12_IMPLEMENTATION"],
    requiredPreConditions: (state) => ({
      valid: state.security.threats.length > 0,
      error: "Threat modeling must identify and address potential boundary risks.",
    }),
  },
  "11_RELIABILITY": {
    stage: "11_RELIABILITY",
    label: "Reliability & Failure",
    allowedNextStages: ["12_IMPLEMENTATION"],
    requiredPreConditions: (state) => ({
      valid: state.reliability.scenarios.length > 0,
      error: "Failure analysis scenarios must be configured.",
    }),
  },
  "12_IMPLEMENTATION": {
    stage: "12_IMPLEMENTATION",
    label: "Implementation & Tasks",
    allowedNextStages: ["13_TESTING"],
    requiredPreConditions: (state) => ({
      valid: state.implementation.tasks.length > 0,
      error: "Dependency-aware tasks must be synthesized.",
    }),
  },
  "13_TESTING": {
    stage: "13_TESTING",
    label: "Test Engineering",
    allowedNextStages: ["14_BLUEPRINT"],
    requiredPreConditions: (state) => ({
      valid: state.testing.testCases.length > 0,
      error: "Automated test verification cases are required.",
    }),
  },
  "14_BLUEPRINT": {
    stage: "14_BLUEPRINT",
    label: "Blueprint & Initialization",
    allowedNextStages: [],
    requiredPreConditions: (state) => ({
      valid: !!state.blueprint && state.blueprint.initializationReady,
      error: "Canonical blueprint must be compiled and verified before initialization.",
    }),
  },
};

export class WorkflowStateMachine {
  private static instance: WorkflowStateMachine | null = null;

  private constructor() {}

  public static getInstance(): WorkflowStateMachine {
    if (!WorkflowStateMachine.instance) {
      WorkflowStateMachine.instance = new WorkflowStateMachine();
    }
    return WorkflowStateMachine.instance;
  }

  public canTransition(
    currentStage: ProjectLifecycleStage,
    targetStage: ProjectLifecycleStage,
    state: ProjectEngineeringState,
  ): { allowed: boolean; reason?: string } {
    const currentRule = STAGE_TRANSITION_RULES[currentStage];
    if (!currentRule) {
      return { allowed: false, reason: "Unknown current stage" };
    }

    // Checking pre-conditions of current stage
    const preCheck = currentRule.requiredPreConditions(state);
    if (!preCheck.valid) {
      return { allowed: false, reason: preCheck.error || "Pre-condition not met" };
    }

    // Checking target stage pre-conditions
    const targetRule = STAGE_TRANSITION_RULES[targetStage];
    if (!targetRule) {
      return { allowed: false, reason: "Unknown target stage" };
    }

    return { allowed: true };
  }

  public computeStageStatus(
    stage: ProjectLifecycleStage,
    state: ProjectEngineeringState,
  ): StageStatus {
    const rule = STAGE_TRANSITION_RULES[stage];
    if (!rule) return "not_started";

    const preCheck = rule.requiredPreConditions(state);
    if (!preCheck.valid) {
      if (state.activeStage === stage) return "in_progress";
      return "not_started";
    }

    if (state.staleNodes.some((node) => node.startsWith(stage))) {
      return "stale";
    }

    return "complete";
  }
}

export const workflowStateMachine = WorkflowStateMachine.getInstance();
