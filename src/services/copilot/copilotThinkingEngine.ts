/**
 * VYRON — COPILOT DETERMINISTIC THINKING & DEPTH ENGINE (GOD MODE vNEXT)
 * Directives: 21-27, 79-92, 120-179, 1010-1049, 1088-1097, 1666-1690
 *
 * Core Principle: Thinking is execution, not decoration.
 * Controls actual orchestration depth, evidence requirements, specialist collaboration,
 * tool invocation limits, and validation rigor across 6 deterministic levels:
 * - LEVEL 0 (DIRECT): Instant answer from trusted local/session memory.
 * - LEVEL 1 (ANALYZE): Project state inspection, AST conformity, and schema verification.
 * - LEVEL 2 (INVESTIGATE): Targeted retrieval, single specialist routing, and evidence correlation.
 * - LEVEL 3 (DEEP INVESTIGATION): Multi-specialist consensus, contradiction analysis, dependency evaluation.
 * - LEVEL 4 (ENGINEERING MISSION): Multi-step DAG planning, connector synchronization, simulation runs, approval gates.
 * - LEVEL 5 (HIGH-STAKES): Strongest cryptographic proof, multi-model validator deliberation, policy gates, manual sign-off.
 *
 * Strictly ZERO SQL.
 */

import { AppMode } from "@/state/mode/modeStore";
import {
  ThinkingState,
  ThinkingDepthLevel,
  ResponseDetailLevel,
  EvidenceMode,
} from "@/state/copilot/copilotStore";
import { SpecialistAgentType } from "./copilotAgentOrchestrator";

export interface ThinkingPolicy {
  thinkingMode: ThinkingState;
  requestedDepth: ThinkingDepthLevel;
  effectiveDepth: ThinkingDepthLevel;
  depthLabel: string;
  responseDetail: ResponseDetailLevel;
  evidenceMode: EvidenceMode;
  toolDepthLimit: number;
  minEvidenceCount: number;
  multiModelDeliberationRequired: boolean;
  approvalRequired: boolean;
  requiresSimulation: boolean;
  timeoutMs: number;
  rationale: string;
  recommendedSpecialists: SpecialistAgentType[];
  escalationReasons: string[];
}

export interface QueryComplexityProfile {
  isFactualQuick: boolean;
  hasSecurityImpact: boolean;
  hasArchitecturalImpact: boolean;
  hasMutationRequest: boolean;
  hasExternalConnectorRequirement: boolean;
  hasMultipleDependencies: boolean;
  hasAmbiguityOrUncertainty: boolean;
  hasExplicitThinkingKeyword: boolean;
  score: number; // 0 to 10
}

export class CopilotThinkingEngine {
  private static instance: CopilotThinkingEngine | null = null;

  public static getInstance(): CopilotThinkingEngine {
    if (!CopilotThinkingEngine.instance) {
      CopilotThinkingEngine.instance = new CopilotThinkingEngine();
    }
    return CopilotThinkingEngine.instance;
  }

  /**
   * Analyzes query text to detect complexity, risk, dependencies, and explicit triggers.
   */
  public profileQueryComplexity(text: string): QueryComplexityProfile {
    const lower = text.toLowerCase();

    const explicitThinkingKeywords = [
      "think",
      "analyze deeply",
      "reason",
      "investigate",
      "verify",
      "go deep",
      "deep dive",
      "deliberate",
      "thoroughly",
    ];
    const hasExplicitThinkingKeyword = explicitThinkingKeywords.some((kw) =>
      lower.includes(kw),
    );

    const securityKeywords = [
      "security",
      "cwe",
      "vulnerability",
      "privilege escalation",
      "auth",
      "injection",
      "jwt",
      "pci",
      "soc2",
      "bandit",
      "owasp",
    ];
    const hasSecurityImpact = securityKeywords.some((kw) => lower.includes(kw));

    const archKeywords = [
      "architecture",
      "drift",
      "blast radius",
      "microservice",
      "dependency",
      "refactor",
      "adr",
      "atlas",
      "boundary",
    ];
    const hasArchitecturalImpact = archKeywords.some((kw) => lower.includes(kw));

    const mutationKeywords = [
      "deploy",
      "mutate",
      "delete",
      "create issue",
      "patch",
      "apply",
      "fix",
      "execute",
      "commit",
      "trigger",
    ];
    const hasMutationRequest = mutationKeywords.some((kw) => lower.includes(kw));

    const externalKeywords = [
      "slack",
      "google drive",
      "notion",
      "github",
      "linear",
      "jira",
      "figma",
      "sentry",
      "datadog",
      "stripe",
      "kaggle",
    ];
    const hasExternalConnectorRequirement = externalKeywords.some((kw) => lower.includes(kw));

    const dependencyKeywords = [
      "and",
      "then",
      "across",
      "compare",
      "correlation",
      "impact of",
      "consequences",
      "both",
    ];
    const hasMultipleDependencies =
      dependencyKeywords.filter((kw) => lower.includes(kw)).length >= 2;

    const ambiguityKeywords = [
      "why",
      "what if",
      "should we",
      "might",
      "tradeoff",
      "optimal",
      "pros and cons",
    ];
    const hasAmbiguityOrUncertainty = ambiguityKeywords.some((kw) => lower.includes(kw));

    const quickKeywords = [
      "what is",
      "who is",
      "define",
      "syntax of",
      "status of",
      "ping",
      "hello",
      "help",
    ];
    const isFactualQuick =
      quickKeywords.some((kw) => lower.startsWith(kw) || lower === kw) &&
      !hasSecurityImpact &&
      !hasArchitecturalImpact &&
      !hasMutationRequest;

    let score = 2; // Baseline
    if (hasExplicitThinkingKeyword) score += 3;
    if (hasSecurityImpact) score += 3;
    if (hasArchitecturalImpact) score += 2;
    if (hasMutationRequest) score += 4;
    if (hasExternalConnectorRequirement) score += 2;
    if (hasMultipleDependencies) score += 2;
    if (hasAmbiguityOrUncertainty) score += 1;
    if (isFactualQuick) score = Math.max(0, score - 3);

    return {
      isFactualQuick,
      hasSecurityImpact,
      hasArchitecturalImpact,
      hasMutationRequest,
      hasExternalConnectorRequirement,
      hasMultipleDependencies,
      hasAmbiguityOrUncertainty,
      hasExplicitThinkingKeyword,
      score: Math.min(10, Math.max(0, score)),
    };
  }

  /**
   * Resolves the deterministic ThinkingPolicy given user configuration and query complexity.
   * Directive 178: "The system must not use Level 5 for trivial questions."
   * Directive 179: "The system must not use Level 0 for high-risk engineering decisions."
   */
  public evaluateThinkingPolicy(params: {
    queryText: string;
    userThinkingMode: ThinkingState;
    userThinkingDepth: ThinkingDepthLevel;
    responseDetail: ResponseDetailLevel;
    evidenceMode?: EvidenceMode | undefined;
    selectedSpecialist?: string | undefined;
    mode: AppMode;
  }): ThinkingPolicy {
    const profile = this.profileQueryComplexity(params.queryText);
    const escalationReasons: string[] = [];

    let effectiveDepth: ThinkingDepthLevel = params.userThinkingDepth;

    // 1. Evaluate user mode override
    if (params.userThinkingMode === "THINK_DISABLED") {
      // If user turned think off, allow level 0 or 1 unless high-risk mutation
      if (profile.hasMutationRequest || profile.hasSecurityImpact) {
        effectiveDepth = 1; // Safeguard: minimum analyze for security/mutations
        escalationReasons.push("Safety floor enforced: high-impact query requires minimum Level 1 Analysis.");
      } else {
        effectiveDepth = 0;
      }
    } else if (params.userThinkingMode === "THINK_DEEP") {
      effectiveDepth = Math.max(3, effectiveDepth) as ThinkingDepthLevel;
      escalationReasons.push("User explicitly engaged THINK_DEEP mode.");
    } else if (params.userThinkingMode === "THINK_HIGH_STAKES") {
      effectiveDepth = 5;
      escalationReasons.push("User explicitly engaged THINK_HIGH_STAKES mode.");
    } else if (params.userThinkingMode === "THINK_AUTO") {
      // Auto-escalation based on complexity profile
      if (profile.isFactualQuick) {
        effectiveDepth = 0;
      } else if (profile.score <= 3) {
        effectiveDepth = 1;
      } else if (profile.score <= 6) {
        effectiveDepth = 2;
      } else if (profile.score <= 8) {
        effectiveDepth = 3;
      } else if (profile.score <= 9) {
        effectiveDepth = 4;
      } else {
        effectiveDepth = 5;
      }
      escalationReasons.push(`THINK_AUTO calibrated depth to Level ${effectiveDepth} (Complexity score: ${profile.score}/10).`);
    } else {
      // THINK_ENABLED: Respect user's selected depth, but auto-escalate if risk requires it
      if (profile.hasExplicitThinkingKeyword && effectiveDepth < 3) {
        effectiveDepth = Math.min(4, effectiveDepth + 1) as ThinkingDepthLevel;
        escalationReasons.push("Explicit reasoning keyword detected: escalating depth.");
      }
      if (profile.hasSecurityImpact && effectiveDepth < 2) {
        effectiveDepth = 2;
        escalationReasons.push("Security domain requires at least Level 2 Investigation.");
      }
      if (profile.hasMutationRequest && effectiveDepth < 4) {
        effectiveDepth = 4;
        escalationReasons.push("Mutation requested: escalates to Level 4 Engineering Mission for safe staging & approval.");
      }
    }

    // Safety guard: prevent trivial questions from wasting Level 5
    if (profile.isFactualQuick && effectiveDepth > 1) {
      effectiveDepth = 1;
      escalationReasons.push("Factual quick query throttled down from high depth to avoid latency inflation.");
    }

    const depthLabels: Record<ThinkingDepthLevel, string> = {
      0: "LEVEL 0 — DIRECT (Fast Answer)",
      1: "LEVEL 1 — ANALYZE (State & Context Verification)",
      2: "LEVEL 2 — INVESTIGATE (Targeted Retrieval & Specialist)",
      3: "LEVEL 3 — DEEP INVESTIGATION (Parallel Specialist Cross-Check)",
      4: "LEVEL 4 — ENGINEERING MISSION (Multi-Step DAG & Tool Sync)",
      5: "LEVEL 5 — HIGH-STAKES (Cryptographic Proof & Deliberation)",
    };

    // Calculate required specialists
    const recommendedSpecialists: SpecialistAgentType[] = [];
    if (profile.hasSecurityImpact) recommendedSpecialists.push("SECURITY_ANALYST");
    if (profile.hasArchitecturalImpact) recommendedSpecialists.push("ARCHITECTURE_ANALYST");
    if (profile.hasExternalConnectorRequirement) recommendedSpecialists.push("SYSTEM_DIAGNOSTICS");
    if (recommendedSpecialists.length === 0) recommendedSpecialists.push("DATA_ANALYST");

    return {
      thinkingMode: params.userThinkingMode,
      requestedDepth: params.userThinkingDepth,
      effectiveDepth,
      depthLabel: depthLabels[effectiveDepth],
      responseDetail: params.responseDetail,
      evidenceMode: params.evidenceMode || (effectiveDepth >= 4 ? "STRICT" : "STANDARD"),
      toolDepthLimit: Math.max(1, effectiveDepth),
      minEvidenceCount: effectiveDepth === 0 ? 0 : effectiveDepth === 1 ? 1 : effectiveDepth * 2,
      multiModelDeliberationRequired: effectiveDepth >= 3 && (profile.hasSecurityImpact || profile.hasAmbiguityOrUncertainty),
      approvalRequired: effectiveDepth >= 4 || profile.hasMutationRequest,
      requiresSimulation: profile.hasAmbiguityOrUncertainty && (profile.hasArchitecturalImpact || profile.hasSecurityImpact),
      timeoutMs: effectiveDepth <= 1 ? 8000 : effectiveDepth <= 3 ? 20000 : 45000,
      rationale: escalationReasons.join(" • ") || "Default policy mapping.",
      recommendedSpecialists,
      escalationReasons,
    };
  }
}

export const copilotThinkingEngine = CopilotThinkingEngine.getInstance();
