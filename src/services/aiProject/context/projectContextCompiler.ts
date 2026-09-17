/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Project Context Compiler (Phase 03)
 * Hierarchical L0–L7 Task-Scoped Context Assembly.
 * Strictly ZERO Raw SQL.
 */

import { AgentRole, ProjectEngineeringState } from "@/types/aiProjectControlPlane";

export interface CompiledContextEnvelope {
  role: AgentRole;
  timestamp: string;
  l0_system_policy: string;
  l1_platform_rules: string;
  l2_project_identity: string;
  l3_workflow_state: string;
  l4_domain_context: string;
  l5_task_scoped_state: string;
  l6_recent_decisions: string;
  l7_user_directives: string;
  estimatedTokens: number;
}

export class ProjectContextCompiler {
  private static instance: ProjectContextCompiler | null = null;

  private constructor() {}

  public static getInstance(): ProjectContextCompiler {
    if (!ProjectContextCompiler.instance) {
      ProjectContextCompiler.instance = new ProjectContextCompiler();
    }
    return ProjectContextCompiler.instance;
  }

  /**
   * Compiles hierarchical task-scoped context for a specific specialized agent.
   */
  public compileContext(
    role: AgentRole,
    state: ProjectEngineeringState,
    userDirective = "",
  ): CompiledContextEnvelope {
    const l0_system_policy =
      "LAW: System operates under strict deterministic control plane governance. AI generates proposals; control plane validates and commits mutations. ZERO raw SQL. Absolute multi-tenant isolation.";

    const l1_platform_rules =
      "PLATFORM: VYRON Cognitive Engineering Platform v2. Quality gates strictly enforced. Consequential changes require explicit human approval.";

    const l2_project_identity = `PROJECT: "${state.name}" (${state.slug}) | Stage: ${state.activeStage} | Maturity: ${state.maturity} | Version: ${state.version}`;

    const l3_workflow_state = `WORKFLOW: Stage statuses -> ${Object.entries(state.stageStatuses)
      .map(([k, v]) => `${k}:${v}`)
      .join(", ")}`;

    const l4_domain_context = `DOMAIN: ${state.intent.domain} | Secondary: ${state.intent.secondaryDomains.join(", ")} | Target: ${state.intent.projectType}`;

    // L5: Task-Scoped State (only the specific state subsets the target agent needs)
    const l5_task_scoped_state = this.buildTaskScopedContext(role, state);

    // L6: Recent Decisions & Evidence
    const l6_recent_decisions = `RECENT MUTATIONS: ${state.mutationAuditTrail.slice(-3).map((m) => `${m.stage}:${m.mutationLevel}`).join(", ") || "None"}`;

    // L7: User Directives
    const l7_user_directives = userDirective ? `USER DIRECTIVE: "${userDirective}"` : `RAW INTENT: "${state.intent.naturalLanguageIntent}"`;

    const fullText = [
      l0_system_policy,
      l1_platform_rules,
      l2_project_identity,
      l3_workflow_state,
      l4_domain_context,
      l5_task_scoped_state,
      l6_recent_decisions,
      l7_user_directives,
    ].join("\n\n");

    return {
      role,
      timestamp: new Date().toISOString(),
      l0_system_policy,
      l1_platform_rules,
      l2_project_identity,
      l3_workflow_state,
      l4_domain_context,
      l5_task_scoped_state,
      l6_recent_decisions,
      l7_user_directives,
      estimatedTokens: Math.ceil(fullText.length / 4),
    };
  }

  private buildTaskScopedContext(role: AgentRole, state: ProjectEngineeringState): string {
    switch (role) {
      case "DiscoveryAgent":
        return `INTENT OBJECTIVES: ${state.intent.goals.join("; ") || "Extract from raw input"}`;

      case "ProblemAnalystAgent":
        return `PROBLEM STATEMENT: ${state.problem.problemStatement || "Needs synthesis"} | PAIN POINTS: ${state.problem.painPoints.join(", ")}`;

      case "RequirementsEngineerAgent":
        return `EXISTING REQS: ${state.requirements.map((r) => `${r.code} (${r.type}): ${r.title}`).join("; ")}`;

      case "ScopeEngineerAgent":
        return `CORE PROBLEM: ${state.scope.coreProblem} | MVP REQS: ${state.scope.mvpRequirements.join(", ")}`;

      case "CapabilityArchitectAgent":
        return `CAPABILITIES: ${state.capabilities.capabilities.map((c) => c.name).join(", ")}`;

      case "SolutionArchitectAgent":
        return `SELECTED ARCH: ${state.architecture.selectedAlternativeId || "Pending alternatives evaluation"}`;

      case "TechnologyArchitectAgent":
        return `STACK DECISIONS: ${state.technology.decisions.map((d) => `${d.category}:${d.selectedOption}`).join(", ")}`;

      case "DataArchitectAgent":
        return `ENTITIES: ${state.data.entities.map((e) => `${e.name} (${e.sensitivity})`).join(", ")}`;

      case "AiArchitectAgent":
        return `AI ACTIVE: ${state.ai.isActive} | OBJECTIVE: ${state.ai.objective || "N/A"}`;

      case "SecurityArchitectAgent":
        return `THREATS IDENTIFIED: ${state.security.threats.length} | TRUST BOUNDARIES: ${state.security.trustBoundaries.join(", ")}`;

      case "ReliabilityEngineerAgent":
        return `SCENARIOS: ${state.reliability.scenarios.map((s) => `${s.componentName}: ${s.failureScenario}`).join(", ")}`;

      case "ImplementationPlannerAgent":
        return `API CONTRACTS: ${state.implementation.apiContracts.length} | TASKS: ${state.implementation.tasks.length}`;

      case "TestEngineerAgent":
        return `TEST CASES: ${state.testing.testCases.length} | COVERED REQS: ${state.testing.traceabilityMatrix.filter((t) => t.isCovered).length}`;

      case "RedTeamAgent":
      case "BlueprintCompilerAgent":
        return `FULL ARCH CONTEXT: ${state.requirements.length} reqs, ${state.architecture.alternatives.length} alternatives, ${state.security.threats.length} threats, ${state.implementation.tasks.length} tasks.`;

      default:
        return "GENERAL CONTEXT";
    }
  }
}

export const projectContextCompiler = ProjectContextCompiler.getInstance();
