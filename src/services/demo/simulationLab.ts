/**
 * PROJECT BRAHMA — ENGINEERING SIMULATION LAB
 * 11 concrete simulation scenarios transforming Demo Mode into an interactive laboratory.
 * Supports storyline progression, live synthetic telemetry injection, and pristine snapshot reset.
 * Strictly ZERO SQL.
 */

import { demoStore } from "@/state/demo/demoStore";
import { eventSimulator } from "@/services/demo/eventSimulator";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";

export type SimulationScenarioId =
  | "ARCHITECTURE_DRIFT"
  | "SECURITY_REGRESSION"
  | "REQUIREMENT_ORPHAN"
  | "TEST_COVERAGE_DEGRADATION"
  | "API_CONTRACT_BREAK"
  | "DANGEROUS_DEPENDENCY"
  | "HIGH_RISK_PR"
  | "CONNECTOR_OUTAGE"
  | "DATASET_QUALITY_FAILURE"
  | "RELEASE_GATE_FAILURE"
  | "PRODUCTION_READINESS_DECLINE";

export interface SimulationScenario {
  id: SimulationScenarioId;
  name: string;
  category: "ARCHITECTURE" | "SECURITY" | "QUALITY" | "INTEGRATION" | "DATA" | "RELEASE";
  storyline: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  targetSystem: string;
  initialHealthScore: number;
  simulatedHealthScore: number;
  expectedFindingsCount: number;
  remediationPlan: string;
  verificationHash: string;
}

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "ARCHITECTURE_DRIFT",
    name: "Unmapped Microservice & Boundary Violation",
    category: "ARCHITECTURE",
    storyline: "A developer introduced an unmapped shadow microservice (srv-legacy-export) that queries the database directly, bypassing the API gateway.",
    severity: "HIGH",
    targetSystem: "srv-settlement",
    initialHealthScore: 91,
    simulatedHealthScore: 74,
    expectedFindingsCount: 2,
    remediationPlan: "Register service in architecture blueprint and enforce gateway routing policies.",
    verificationHash: generateVerificationHash("SCENARIO:ARCHITECTURE_DRIFT"),
  },
  {
    id: "SECURITY_REGRESSION",
    name: "CWE-89 SQL Injection in Query Builder",
    category: "SECURITY",
    storyline: "A pull request introduced string concatenation in billing transaction queries, allowing SQL injection attacks via merchant IDs.",
    severity: "CRITICAL",
    targetSystem: "services/billing/query.ts",
    initialHealthScore: 91,
    simulatedHealthScore: 62,
    expectedFindingsCount: 1,
    remediationPlan: "Apply parameterized queries via Supabase client and seal pre-commit AST scanner.",
    verificationHash: generateVerificationHash("SCENARIO:SECURITY_REGRESSION"),
  },
  {
    id: "REQUIREMENT_ORPHAN",
    name: "Orphaned Idempotency Settlement Requirement",
    category: "QUALITY",
    storyline: "Requirement FR-02 (settlement retry idempotency) was decoupled from the worker implementation, creating risk of double charges.",
    severity: "HIGH",
    targetSystem: "req-idem-02",
    initialHealthScore: 91,
    simulatedHealthScore: 78,
    expectedFindingsCount: 1,
    remediationPlan: "Restore bidirectional requirement-to-code traceability link and execute idempotency test suite.",
    verificationHash: generateVerificationHash("SCENARIO:REQUIREMENT_ORPHAN"),
  },
  {
    id: "TEST_COVERAGE_DEGRADATION",
    name: "Settlement Test Coverage Plunge",
    category: "QUALITY",
    storyline: "A refactoring skipped core settlement edge case unit tests, dropping coverage from 94% to 58%.",
    severity: "HIGH",
    targetSystem: "Settlement Idempotency Suite",
    initialHealthScore: 91,
    simulatedHealthScore: 69,
    expectedFindingsCount: 2,
    remediationPlan: "Re-enable mocking harnesses and enforce 85% minimum branch coverage gate.",
    verificationHash: generateVerificationHash("SCENARIO:TEST_COVERAGE_DEGRADATION"),
  },
  {
    id: "API_CONTRACT_BREAK",
    name: "Breaking Change in POST /v2/settlements",
    category: "INTEGRATION",
    storyline: "An undocumented endpoint modification removed the required 'currency' parameter, breaking 14 external merchant panel integrations.",
    severity: "CRITICAL",
    targetSystem: "api-settlements-post",
    initialHealthScore: 91,
    simulatedHealthScore: 58,
    expectedFindingsCount: 3,
    remediationPlan: "Restore optional parameter with backward compatibility shim and publish OpenAPI spec.",
    verificationHash: generateVerificationHash("SCENARIO:API_CONTRACT_BREAK"),
  },
  {
    id: "DANGEROUS_DEPENDENCY",
    name: "Compromised Transitive Dependency Detected",
    category: "SECURITY",
    storyline: "Supply chain scanner detected malicious typosquatting package 'crypto-auth-tokens-v2' inside node_modules.",
    severity: "CRITICAL",
    targetSystem: "package.json",
    initialHealthScore: 91,
    simulatedHealthScore: 49,
    expectedFindingsCount: 1,
    remediationPlan: "Remove malicious dependency, verify lockfile integrity, and reinstall pinned versions.",
    verificationHash: generateVerificationHash("SCENARIO:DANGEROUS_DEPENDENCY"),
  },
  {
    id: "HIGH_RISK_PR",
    name: "Unreviewed High-Risk Pull Request #4412",
    category: "RELEASE",
    storyline: "PR #4412 touches 4 core auth & billing files with zero test additions and unverified architectural approval.",
    severity: "HIGH",
    targetSystem: "PR-4412",
    initialHealthScore: 91,
    simulatedHealthScore: 71,
    expectedFindingsCount: 2,
    remediationPlan: "Trigger Change Impact Analysis and block merge pending Lead Architect sign-off.",
    verificationHash: generateVerificationHash("SCENARIO:HIGH_RISK_PR"),
  },
  {
    id: "CONNECTOR_OUTAGE",
    name: "GitHub API Rate-Limit Exhaustion Outage",
    category: "INTEGRATION",
    storyline: "External GitHub VCS connector experienced HTTP 429 rate-limit exhaustion, stalling continuous synchronization.",
    severity: "MEDIUM",
    targetSystem: "githubConnector",
    initialHealthScore: 91,
    simulatedHealthScore: 82,
    expectedFindingsCount: 1,
    remediationPlan: "Rotate GitHub personal access token and enable secondary backoff proxy.",
    verificationHash: generateVerificationHash("SCENARIO:CONNECTOR_OUTAGE"),
  },
  {
    id: "DATASET_QUALITY_FAILURE",
    name: "High Null Fraction in Kaggle Fraud Feed",
    category: "DATA",
    storyline: "Dataset partition ingestion detected a 42% missing values rate on the 'card1' primary attribute.",
    severity: "HIGH",
    targetSystem: "clementbingham/ieee-fraud-detection",
    initialHealthScore: 91,
    simulatedHealthScore: 65,
    expectedFindingsCount: 2,
    remediationPlan: "Reject corrupted dataset partition and trigger imputation fallback workflow.",
    verificationHash: generateVerificationHash("SCENARIO:DATASET_QUALITY_FAILURE"),
  },
  {
    id: "RELEASE_GATE_FAILURE",
    name: "Review 1 Milestone Defense Gate Blocker",
    category: "RELEASE",
    storyline: "Deterministic release gatekeeper blocked release v2.4.0 due to open HIGH vulnerability and unverified test gate.",
    severity: "CRITICAL",
    targetSystem: "Release Gatekeeper v2.4.0",
    initialHealthScore: 91,
    simulatedHealthScore: 54,
    expectedFindingsCount: 2,
    remediationPlan: "Resolve critical release blockers or obtain formal approved exemption with expiration.",
    verificationHash: generateVerificationHash("SCENARIO:RELEASE_GATE_FAILURE"),
  },
  {
    id: "PRODUCTION_READINESS_DECLINE",
    name: "Multidimensional Readiness Score Collapse",
    category: "RELEASE",
    storyline: "Cumulative compound regressions across security, drift, tests, and contracts collapsed readiness to 48%.",
    severity: "CRITICAL",
    targetSystem: "Production Gateway",
    initialHealthScore: 91,
    simulatedHealthScore: 48,
    expectedFindingsCount: 4,
    remediationPlan: "Execute comprehensive stabilization mission via AI Copilot Orchestrator.",
    verificationHash: generateVerificationHash("SCENARIO:PRODUCTION_READINESS_DECLINE"),
  },
];

export class SimulationLabEngine {
  private static instance: SimulationLabEngine | null = null;
  private activeScenario: SimulationScenario | null = null;
  private listeners: Set<(scenario: SimulationScenario | null) => void> = new Set();

  private constructor() {}

  public static getInstance(): SimulationLabEngine {
    if (!SimulationLabEngine.instance) {
      SimulationLabEngine.instance = new SimulationLabEngine();
    }
    return SimulationLabEngine.instance;
  }

  public getScenarios(): SimulationScenario[] {
    return [...SIMULATION_SCENARIOS];
  }

  public getActiveScenario(): SimulationScenario | null {
    return this.activeScenario;
  }

  public activateScenario(scenarioId: SimulationScenarioId): SimulationScenario {
    const scenario = SIMULATION_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) throw new Error(`Simulation scenario ${scenarioId} not found.`);

    this.activeScenario = scenario;

    // Apply synthetic anomaly surge to demo stream
    eventSimulator.injectAnomalyWave(6);
    this.notify();
    return scenario;
  }

  public resetToPristineBaseline(): void {
    this.activeScenario = null;
    eventSimulator.reset();
    this.notify();
  }

  public resetToBaseline(): void {
    this.resetToPristineBaseline();
  }

  public subscribe(listener: (scenario: SimulationScenario | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.activeScenario);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.activeScenario));
  }
}

export const simulationLabEngine = SimulationLabEngine.getInstance();
