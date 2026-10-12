/**
 * VYRON — RUN OPERATION REGISTRY (WORKSTREAM I & J)
 * Central contract declaring supported operations, inputs, effects, prerequisites, and renderers.
 * Enforces Zero-Fiction Architecture Law: no ambiguous "Run" buttons without declared contracts.
 */

export type OperationCategory = "analysis" | "blueprint" | "testing" | "security" | "build" | "ather";
export type OperationEffect =
  | "read_analysis"
  | "generate_blueprint"
  | "test_execution"
  | "security_audit"
  | "build_artifact"
  | "code_mutation";

export interface OperationDefinition {
  id: string;
  name: string;
  category: OperationCategory;
  description: string;
  expectedDurationMs: number;
  effects: OperationEffect;
  prerequisites: string[];
  requiredInputFields: string[];
  outputArtifactType: string;
  supportedEnvironments: string[];
}

export const OPERATION_REGISTRY: Record<string, OperationDefinition> = {
  REPOSITORY_ANALYSIS: {
    id: "REPOSITORY_ANALYSIS",
    name: "12-Stage Repository AST & Architecture Forensics",
    category: "analysis",
    description:
      "Performs deep AST parsing, architectural drift detection between code and blueprint, and dependency graph validation.",
    expectedDurationMs: 1450,
    effects: "read_analysis",
    prerequisites: ["project_accessible"],
    requiredInputFields: ["projectId", "branch"],
    outputArtifactType: "AST_FORENSICS_REPORT",
    supportedEnvironments: ["production", "staging", "dev", "sandbox"],
  },

  BLUEPRINT_GENERATION: {
    id: "BLUEPRINT_GENERATION",
    name: "14-Stage Canonical Blueprint Synthesis",
    category: "blueprint",
    description:
      "Synthesizes Intent, Problem, Requirements, and Architecture into a unified, cryptographically sealed project blueprint.",
    expectedDurationMs: 2100,
    effects: "generate_blueprint",
    prerequisites: ["project_accessible"],
    requiredInputFields: ["projectId"],
    outputArtifactType: "CANONICAL_BLUEPRINT",
    supportedEnvironments: ["production", "staging", "dev", "sandbox"],
  },

  TEST_SUITE_RUN: {
    id: "TEST_SUITE_RUN",
    name: "Automated Acceptance Gates & Test Verification",
    category: "testing",
    description:
      "Executes isolated test suites, asserts gate strictness thresholds, and records test passing telemetry.",
    expectedDurationMs: 1800,
    effects: "test_execution",
    prerequisites: ["project_accessible"],
    requiredInputFields: ["projectId"],
    outputArtifactType: "TEST_TELEMETRY_REPORT",
    supportedEnvironments: ["production", "staging", "dev", "sandbox"],
  },

  SECURITY_SCAN: {
    id: "SECURITY_SCAN",
    name: "STRIDE Threat Modeling & Compliance Scan",
    category: "security",
    description:
      "Audits STRIDE threat categories, verifies zero raw SQL compliance, validates multi-tenant RLS, and scans secrets.",
    expectedDurationMs: 1250,
    effects: "security_audit",
    prerequisites: ["project_accessible"],
    requiredInputFields: ["projectId"],
    outputArtifactType: "STRIDE_SECURITY_AUDIT",
    supportedEnvironments: ["production", "staging", "dev", "sandbox"],
  },

  BUILD_VERIFICATION: {
    id: "BUILD_VERIFICATION",
    name: "Clean Room Build & Package Verification",
    category: "build",
    description:
      "Executes package bundling and type check verification in an isolated worker runtime.",
    expectedDurationMs: 2400,
    effects: "build_artifact",
    prerequisites: ["project_accessible"],
    requiredInputFields: ["projectId", "branch"],
    outputArtifactType: "BUILD_RECEIPT",
    supportedEnvironments: ["production", "staging", "dev", "sandbox"],
  },

  ATHER_TASK: {
    id: "ATHER_TASK",
    name: "ATHER Autonomous Engineering Directive",
    category: "ather",
    description:
      "Executes an authorized copilot engineering task bound to the project context.",
    expectedDurationMs: 1950,
    effects: "code_mutation",
    prerequisites: ["project_accessible"],
    requiredInputFields: ["projectId", "instruction"],
    outputArtifactType: "ATHER_EXECUTION_RECEIPT",
    supportedEnvironments: ["production", "staging", "dev", "sandbox"],
  },
};

export function getOperationDefinition(operationType: string): OperationDefinition {
  const op = OPERATION_REGISTRY[operationType];
  if (!op) {
    throw new Error(`[OperationRegistry] Unknown operation type: "${operationType}"`);
  }
  return op;
}

export function listSupportedOperations(): OperationDefinition[] {
  return Object.values(OPERATION_REGISTRY);
}
