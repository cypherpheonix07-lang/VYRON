/**
 * VYRON — SKILL RUNTIME & CAPABILITY PACKAGE CONTRACTS (GOD MODE vNEXT)
 * Directives: 460-495, 496-518, 538-557, 603-614, 626-648, 649-668, 669-677
 *
 * Core Principle: A Skill is not a prompt snippet. A Skill is a governed capability package.
 * Governs lifecycle states, semantic versioning, 14 test classes, and dependency graphs.
 * Strictly ZERO SQL.
 */

export type SkillLifecycleState =
  | "DRAFT"
  | "REVIEW"
  | "VALIDATED"
  | "ACTIVE"
  | "DISABLED"
  | "DEPRECATED"
  | "REVOKED";

export type SkillTrustLevel =
  | "TRUSTED"
  | "VERIFIED"
  | "COMMUNITY"
  | "UNKNOWN"
  | "BLOCKED";

export type SkillTestClass =
  | "HAPPY_PATH"
  | "EDGE_CASE"
  | "MISSING_INPUT"
  | "INVALID_INPUT"
  | "TOOL_FAILURE"
  | "CONNECTOR_FAILURE"
  | "PERMISSION_DENIED"
  | "MALICIOUS_INPUT"
  | "PROMPT_INJECTION"
  | "TIMEOUT"
  | "RATE_LIMIT"
  | "CONTRADICTORY_DATA"
  | "EMPTY_RESULT"
  | "LOW_CONFIDENCE";

export interface SkillTestCase {
  id: string;
  name: string;
  testClass: SkillTestClass;
  inputPayload: Record<string, unknown>;
  expectedOutputSchema: Record<string, unknown>;
  shouldPass: boolean;
  timeoutMs: number;
}

export interface SkillTestRunResult {
  testCaseId: string;
  testClass: SkillTestClass;
  status: "PASSED" | "FAILED" | "BLOCKED";
  durationMs: number;
  errorMessage?: string;
}

export interface SkillProvenance {
  sourceType: "BUILT_IN" | "CUSTOM_FACTORY" | "INTERNET_INGESTION" | "CONNECTOR_PACKAGE";
  sourceUrl?: string;
  author: string;
  contentHash: string;
  retrievedAt: string;
  trustLevel: SkillTrustLevel;
  license?: string;
}

export interface SkillVersionRecord {
  version: string;
  timestamp: string;
  author: string;
  changeLog: string;
  diffSummary: string;
  impactedAgents: string[];
  impactedTools: string[];
  impactedConnectors: string[];
  testResults: {
    passedCount: number;
    failedCount: number;
    totalCount: number;
  };
  contentHash: string;
}

export interface GovernedSkill {
  skillId: string;
  name: string;
  slug: string;
  version: string;
  description: string;
  purpose: string;
  domain: string;
  triggers: string[];
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  systemInstructions: string;
  allowedTools: string[];
  requiredConnectors: string[];
  permissions: string[];
  safetyPolicy: string;
  evidencePolicy: string;
  modelPolicy: string;
  testSuite: SkillTestCase[];
  provenance: SkillProvenance;
  status: SkillLifecycleState;
  versionHistory: SkillVersionRecord[];
  createdAt: string;
  updatedAt: string;
  lastTestedAt?: string;
}

export interface SkillAuditEvent {
  id: string;
  timestamp: string;
  skillId: string;
  action:
    | "CREATED"
    | "VALIDATED"
    | "ACTIVATED"
    | "DISABLED"
    | "UPDATED"
    | "ROLLED_BACK"
    | "REVOKED"
    | "TESTED";
  userId: string;
  details: string;
  verificationHash: string;
}
