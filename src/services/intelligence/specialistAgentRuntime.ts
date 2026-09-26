/**
 * VYRON — P25: SPECIALIST AGENT RUNTIME & INTER-AGENT DISPATCH
 * Orchestrates the 10 domain specialist agents, verifies CAN vs CANNOT
 * boundary permissions, and handles inter-agent JSON-RPC dispatch.
 * Strictly ZERO operational raw SQL.
 */

export type SpecialistId =
  | "CODE_HEALTH_SPECIALIST"
  | "ARCHITECTURE_SPECIALIST"
  | "PERFORMANCE_SRE_SPECIALIST"
  | "SECURITY_SPECIALIST"
  | "TEST_QA_SPECIALIST"
  | "DATA_ETL_SPECIALIST"
  | "API_INTEGRATION_SPECIALIST"
  | "DEVOPS_RELEASE_SPECIALIST"
  | "GOVERNANCE_SPECIALIST"
  | "PRODUCT_REQUIREMENTS_SPECIALIST";

export interface SpecialistAgentContract {
  id: SpecialistId;
  name: string;
  domain: string;
  canExecute: string[];
  cannotExecute: string[];
}

export interface DispatchJobResult {
  jobId: string;
  specialistId: SpecialistId;
  status: "COMPLETED" | "REJECTED_OUT_OF_BOUNDS";
  outputPayload?: Record<string, unknown> | undefined;
  rejectionReason?: string | undefined;
  dispatchedAt: string;
}

export class SpecialistAgentRuntime {
  private static readonly SPECIALISTS: SpecialistAgentContract[] = [
    {
      id: "CODE_HEALTH_SPECIALIST",
      name: "Code Health Specialist",
      domain: "Static analysis, cyclomatic complexity, refactoring AST",
      canExecute: ["SCAN_AST", "COMPUTE_CCN", "PROPOSE_REFACTOR"],
      cannotExecute: ["DEPLOY_PRODUCTION", "MUTATE_DATABASE_SCHEMA"]
    },
    {
      id: "ARCHITECTURE_SPECIALIST",
      name: "Architecture Specialist",
      domain: "System topology, dependency DAGs, ADR lifecycle, drift",
      canExecute: ["ANALYZE_DRIFT", "EVALUATE_DEPENDENCY_CYCLE", "DRAFT_ADR"],
      cannotExecute: ["DEPLOY_PRODUCTION", "BYPASS_AUTHORITY_FENCE"]
    },
    {
      id: "PERFORMANCE_SRE_SPECIALIST",
      name: "Performance & SRE Specialist",
      domain: "WorkPulse telemetry, latency SLOs, bottleneck detection",
      canExecute: ["CALCULATE_DORA", "PARTITION_STREAMS", "DETECT_LATENCY_SPIKE"],
      cannotExecute: ["FORCE_PUSH_CODE", "DROP_DATABASE"]
    },
    {
      id: "SECURITY_SPECIALIST",
      name: "Security Specialist",
      domain: "STRIDE threat modeling, CWE scanning, zero raw SQL audit",
      canExecute: ["AUDIT_SQL_INJECTIONS", "SCAN_PROMPT_INJECTION", "VERIFY_AUTHZ"],
      cannotExecute: ["OVERRIDE_RBAC", "EXPOSE_SECRETS"]
    },
    {
      id: "TEST_QA_SPECIALIST",
      name: "Test & QA Specialist",
      domain: "Postcondition assertion, test coverage, fixture validation",
      canExecute: ["RUN_ACCEPTANCE_TESTS", "VERIFY_POSTCONDITIONS", "BENCHMARK_SUITES"],
      cannotExecute: ["SKIP_VERIFICATION_GATE"]
    },
    {
      id: "DATA_ETL_SPECIALIST",
      name: "Data & ETL Specialist",
      domain: "Dataset ingestion, schema normalization, Kaggle fixtures",
      canExecute: ["INGEST_BENCHMARK_DATA", "VALIDATE_DATASET_SCHEMA"],
      cannotExecute: ["EXECUTE_RAW_SQL", "MODIFY_PRODUCTION_DATA"]
    },
    {
      id: "API_INTEGRATION_SPECIALIST",
      name: "API & Integration Specialist",
      domain: "Connector fabric, third-party REST/gRPC, circuit breaking",
      canExecute: ["CHECK_CONNECTOR_HEALTH", "ENGAGE_FALLBACK_CIRCUIT"],
      cannotExecute: ["EXPOSE_API_KEYS"]
    },
    {
      id: "DEVOPS_RELEASE_SPECIALIST",
      name: "DevOps & Release Specialist",
      domain: "Release gating, rollout orchestration, canary verification",
      canExecute: ["EVALUATE_RELEASE_GATE", "STAGE_CANARY_PROPOSAL"],
      cannotExecute: ["DEPLOY_WITHOUT_APPROVAL"]
    },
    {
      id: "GOVERNANCE_SPECIALIST",
      name: "Governance Specialist",
      domain: "Policy-as-code, audit ledger, compliance reporting",
      canExecute: ["VERIFY_POLICY_COMPLIANCE", "GENERATE_AUDIT_LOG"],
      cannotExecute: ["MUTATE_AUDIT_HISTORY"]
    },
    {
      id: "PRODUCT_REQUIREMENTS_SPECIALIST",
      name: "Product & Requirements Specialist",
      domain: "JTBD satisfaction, persona journeys, traceability",
      canExecute: ["CHECK_JTBD_COVERAGE", "MAP_REQUIREMENT_TRACE"],
      cannotExecute: ["MUTATE_CORE_PRODUCT_THESIS"]
    }
  ];

  public static getSpecialists(): SpecialistAgentContract[] {
    return this.SPECIALISTS;
  }

  public static dispatchJob(
    specialistId: SpecialistId,
    action: string,
    payload: Record<string, unknown>
  ): DispatchJobResult {
    const specialist = this.SPECIALISTS.find((s) => s.id === specialistId);
    const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (!specialist) {
      return {
        jobId,
        specialistId,
        status: "REJECTED_OUT_OF_BOUNDS",
        rejectionReason: `Specialist ${specialistId} not registered.`,
        dispatchedAt: new Date().toISOString()
      };
    }

    if (specialist.cannotExecute.includes(action)) {
      return {
        jobId,
        specialistId,
        status: "REJECTED_OUT_OF_BOUNDS",
        rejectionReason: `Action ${action} is strictly forbidden for ${specialist.name} (CANNOT boundary).`,
        dispatchedAt: new Date().toISOString()
      };
    }

    if (!specialist.canExecute.includes(action)) {
      return {
        jobId,
        specialistId,
        status: "REJECTED_OUT_OF_BOUNDS",
        rejectionReason: `Action ${action} is outside ${specialist.name}'s declared capability scope.`,
        dispatchedAt: new Date().toISOString()
      };
    }

    return {
      jobId,
      specialistId,
      status: "COMPLETED",
      outputPayload: {
        success: true,
        actionExecuted: action,
        input: payload
      },
      dispatchedAt: new Date().toISOString()
    };
  }
}
