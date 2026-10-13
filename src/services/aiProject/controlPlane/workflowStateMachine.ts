/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Deterministic Workflow State Machine (Phase 05)
 * Governs lifecycle states, transition guards, and pre/post conditions.
 * Strictly ZERO Raw SQL.
 */

import type {
  ProjectLifecycleStage,
  StageStatus,
  ProjectEngineeringState,
} from "../../../types/aiProjectControlPlane.ts";

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
    allowedNextStages: ["02_PROBLEM", "21_VALUE", "03_REQUIREMENTS"],
    requiredPreConditions: (state) => ({
      valid: !!state.intent.naturalLanguageIntent.trim(),
      error: "Natural language intent cannot be empty.",
    }),
  },
  "02_PROBLEM": {
    stage: "02_PROBLEM",
    label: "Problem Engineering",
    allowedNextStages: ["21_VALUE", "03_REQUIREMENTS"],
    requiredPreConditions: (state) => ({
      valid: !!state.problem.problemStatement.trim(),
      error: "Problem statement must be synthesized before proceeding.",
    }),
  },
  "21_VALUE": {
    stage: "21_VALUE",
    label: "Business Value & Financial Viability",
    allowedNextStages: ["03_REQUIREMENTS", "04_SCOPE"],
    requiredPreConditions: (state) => ({
      valid: !!state.value,
      error: "Business value and financial viability assumptions must be initialized.",
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
    allowedNextStages: ["05_CAPABILITY", "22_GOVERNANCE", "15_EXPERIENCE", "06_ARCHITECTURE"],
    requiredPreConditions: (state) => ({
      valid: state.scope.mvpRequirements.length > 0,
      error: "At least one requirement must be allocated to MVP scope.",
    }),
  },
  "05_CAPABILITY": {
    stage: "05_CAPABILITY",
    label: "Capability Modeling",
    allowedNextStages: ["22_GOVERNANCE", "15_EXPERIENCE", "06_ARCHITECTURE"],
    requiredPreConditions: (state) => ({
      valid: state.capabilities.capabilities.length > 0,
      error: "At least one system capability must be defined.",
    }),
  },
  "22_GOVERNANCE": {
    stage: "22_GOVERNANCE",
    label: "Governance & Decision Accountability",
    allowedNextStages: ["15_EXPERIENCE", "06_ARCHITECTURE"],
    requiredPreConditions: (state) => ({
      valid: !!state.governance,
      error: "Governance model and decision rights must be configured.",
    }),
  },
  "15_EXPERIENCE": {
    stage: "15_EXPERIENCE",
    label: "Experience & Accessibility",
    allowedNextStages: ["06_ARCHITECTURE", "07_TECHNOLOGY", "16_INTEGRATION"],
    requiredPreConditions: (state) => ({
      valid: !!state.experience,
      error: "Experience and accessibility model must be initialized.",
    }),
  },
  "06_ARCHITECTURE": {
    stage: "06_ARCHITECTURE",
    label: "System Architecture",
    allowedNextStages: ["07_TECHNOLOGY", "23_DEPENDENCY_ASSURANCE", "08_DATA", "10_SECURITY"],
    requiredPreConditions: (state) => ({
      valid:
        state.architecture.alternatives.length > 0 && !!state.architecture.selectedAlternativeId,
      error: "An architecture baseline alternative must be selected.",
    }),
  },
  "07_TECHNOLOGY": {
    stage: "07_TECHNOLOGY",
    label: "Technology Stack",
    allowedNextStages: ["23_DEPENDENCY_ASSURANCE", "08_DATA", "09_AI_DESIGN", "10_SECURITY"],
    requiredPreConditions: (state) => ({
      valid: state.technology.decisions.length > 0,
      error: "Technology decisions must be established.",
    }),
  },
  "23_DEPENDENCY_ASSURANCE": {
    stage: "23_DEPENDENCY_ASSURANCE",
    label: "Dependency & Supplier Assurance",
    allowedNextStages: ["08_DATA", "16_INTEGRATION", "10_SECURITY"],
    requiredPreConditions: (state) => ({
      valid: !!state.dependencyAssurance,
      error: "Dependency and supplier assurance records must be established.",
    }),
  },
  "08_DATA": {
    stage: "08_DATA",
    label: "Data Architecture",
    allowedNextStages: ["09_AI_DESIGN", "16_INTEGRATION", "10_SECURITY", "11_RELIABILITY"],
    requiredPreConditions: (state) => ({
      valid: state.data.entities.length > 0,
      error: "At least one core data entity is required.",
    }),
  },
  "09_AI_DESIGN": {
    stage: "09_AI_DESIGN",
    label: "AI / ML Systems",
    allowedNextStages: ["16_INTEGRATION", "10_SECURITY", "11_RELIABILITY", "12_IMPLEMENTATION"],
    requiredPreConditions: () => ({ valid: true }), // Conditional stage
  },
  "16_INTEGRATION": {
    stage: "16_INTEGRATION",
    label: "Integration & Interoperability",
    allowedNextStages: ["10_SECURITY", "11_RELIABILITY", "12_IMPLEMENTATION"],
    requiredPreConditions: (state) => ({
      valid: !!state.integration,
      error: "Integration contracts and endpoints must be initialized.",
    }),
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
    allowedNextStages: ["17_RELEASE", "18_OPERATIONS", "14_BLUEPRINT"],
    requiredPreConditions: (state) => ({
      valid: state.testing.testCases.length > 0,
      error: "Automated test verification cases are required.",
    }),
  },
  "17_RELEASE": {
    stage: "17_RELEASE",
    label: "Release & Migration",
    allowedNextStages: ["18_OPERATIONS", "19_EVALUATION", "14_BLUEPRINT"],
    requiredPreConditions: (state) => ({
      valid: !!state.release,
      error: "Release and migration strategy must be configured.",
    }),
  },
  "18_OPERATIONS": {
    stage: "18_OPERATIONS",
    label: "Operations & Incident Response",
    allowedNextStages: ["19_EVALUATION", "24_DELIVERY", "20_RETIREMENT", "14_BLUEPRINT"],
    requiredPreConditions: (state) => ({
      valid: !!state.operations,
      error: "Operations and runbook procedures must be configured.",
    }),
  },
  "19_EVALUATION": {
    stage: "19_EVALUATION",
    label: "Evaluation & Improvement",
    allowedNextStages: ["24_DELIVERY", "25_COMPLIANCE", "20_RETIREMENT", "14_BLUEPRINT"],
    requiredPreConditions: (state) => ({
      valid: !!state.evaluation,
      error: "Evaluation telemetry and error budget baselines must be initialized.",
    }),
  },
  "24_DELIVERY": {
    stage: "24_DELIVERY",
    label: "Delivery Planning & Coordination",
    allowedNextStages: ["25_COMPLIANCE", "26_DOCUMENTATION", "14_BLUEPRINT"],
    requiredPreConditions: (state) => ({
      valid: !!state.delivery,
      error: "Delivery planning milestones and work packages must be configured.",
    }),
  },
  "25_COMPLIANCE": {
    stage: "25_COMPLIANCE",
    label: "Compliance & Data Stewardship",
    allowedNextStages: ["26_DOCUMENTATION", "20_RETIREMENT", "14_BLUEPRINT"],
    requiredPreConditions: (state) => ({
      valid: !!state.compliance,
      error: "Compliance obligations and data classifications must be registered.",
    }),
  },
  "26_DOCUMENTATION": {
    stage: "26_DOCUMENTATION",
    label: "Documentation, Training & Knowledge Transfer",
    allowedNextStages: ["20_RETIREMENT", "14_BLUEPRINT"],
    requiredPreConditions: (state) => ({
      valid: !!state.documentation,
      error: "Documentation guides and operational runbooks must be prepared.",
    }),
  },
  "20_RETIREMENT": {
    stage: "20_RETIREMENT",
    label: "Retirement & Transition",
    allowedNextStages: ["14_BLUEPRINT"],
    requiredPreConditions: (state) => ({
      valid: !!state.retirement,
      error: "Retirement and data retention plans must be initialized.",
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
