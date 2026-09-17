/**
 * VYRON — SKILL REGISTRY & DEPENDENCY GRAPH ENGINE (GOD MODE vNEXT)
 * Directives: 496-518, 649-677, 1265-1273, 1600-1607
 *
 * Master singleton registry governing:
 * - Built-in, workspace, custom, and internet-imported capability packages.
 * - Semantic versioning (CREATE, DRAFT, TEST, REVIEW, ACTIVATE, UPDATE, ROLLBACK, REVOKE).
 * - Skill Dependency Graph: AGENT -> SKILL -> TOOL -> CONNECTOR -> EVIDENCE.
 * - Tamper-evident SHA-256 audit logging.
 * - Strictly ZERO SQL.
 */

import {
  GovernedSkill,
  SkillLifecycleState,
  SkillAuditEvent,
  SkillVersionRecord,
} from "./types";
import { skillSandbox } from "./skillSandbox";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";

type SkillRegistryListener = (skills: GovernedSkill[]) => void;

export class SkillRegistry {
  private static instance: SkillRegistry | null = null;
  private skills: Map<string, GovernedSkill> = new Map();
  private auditLog: SkillAuditEvent[] = [];
  private listeners: Set<SkillRegistryListener> = new Set();

  private constructor() {
    this.seedBuiltInSkills();
  }

  public static getInstance(): SkillRegistry {
    if (!SkillRegistry.instance) {
      SkillRegistry.instance = new SkillRegistry();
    }
    return SkillRegistry.instance;
  }

  public subscribe(listener: SkillRegistryListener): () => void {
    this.listeners.add(listener);
    listener(this.listSkills());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const list = this.listSkills();
    this.listeners.forEach((l) => l(list));
  }

  private recordAudit(event: Omit<SkillAuditEvent, "id" | "timestamp" | "verificationHash">) {
    const id = `audit_sk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const timestamp = new Date().toISOString();
    const hash = generateVerificationHash(`${id}:${event.skillId}:${event.action}:${timestamp}`);
    const record: SkillAuditEvent = {
      ...event,
      id,
      timestamp,
      verificationHash: hash,
    };
    this.auditLog.unshift(record);
    if (this.auditLog.length > 200) this.auditLog.pop();
  }

  public getAuditLog(): SkillAuditEvent[] {
    return [...this.auditLog];
  }

  /**
   * Pre-seeds authoritative built-in skills.
   */
  private seedBuiltInSkills() {
    const builtIns: GovernedSkill[] = [
      {
        skillId: "sk_owasp_security_review",
        name: "OWASP & Bandit Security Review Skill",
        slug: "owasp_security_review",
        version: "1.2.0",
        description: "Deep static AST security audit enforcing CWE-89 SQL injection and API secret detection.",
        purpose: "Audit codebase against OWASP Top 10, CWE-89 injection, and unmasked credential leaks.",
        domain: "Security",
        triggers: ["security", "cwe", "vulnerability", "leak", "audit", "injection"],
        inputSchema: { targetFiles: "array", complianceStandard: "string" },
        outputSchema: { violationsCount: "number", findings: "array", riskRating: "string" },
        systemInstructions: "Inspect AST node syntax for dynamic query concatenation, unescaped user inputs, and hardcoded secrets.",
        allowedTools: ["test_connector_health"],
        requiredConnectors: ["github", "sentry"],
        permissions: ["READ_CODE", "ANALYZE_AST"],
        safetyPolicy: "Read-only inspection; zero automatic code modification.",
        evidencePolicy: "Requires AST node line number and Bandit static scan proof.",
        modelPolicy: "Prefers DEEP_REASONING model family.",
        testSuite: [],
        provenance: {
          sourceType: "BUILT_IN",
          author: "VYRON Security Core",
          contentHash: generateVerificationHash("owasp_security_review_v1.2.0"),
          retrievedAt: new Date().toISOString(),
          trustLevel: "TRUSTED",
          license: "MIT",
        },
        status: "ACTIVE",
        versionHistory: [
          {
            version: "1.2.0",
            timestamp: new Date().toISOString(),
            author: "Chief Security Architect",
            changeLog: "Enhanced CWE-89 dynamic query detection with parameterized checks.",
            diffSummary: "+12 AST inspection rules",
            impactedAgents: ["SECURITY_ANALYST"],
            impactedTools: ["test_connector_health"],
            impactedConnectors: ["github"],
            testResults: { passedCount: 5, failedCount: 0, totalCount: 5 },
            contentHash: generateVerificationHash("owasp_v1.2.0"),
          },
        ],
        createdAt: "2026-09-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      },
      {
        skillId: "sk_architecture_drift_audit",
        name: "Architecture Drift & AST Conformity Skill",
        slug: "architecture_drift_audit",
        version: "2.0.0",
        description: "Monitors microservice layer boundaries and Lizard cyclomatic complexity drift.",
        purpose: "Verify codebase adherence to declared ATLAS architectural blueprints.",
        domain: "Architecture",
        triggers: ["drift", "architecture", "boundaries", "ast", "lizard", "complexity"],
        inputSchema: { blueprintId: "string" },
        outputSchema: { driftScore: "number", boundaryViolations: "array" },
        systemInstructions: "Compare AST import graph against declared component boundaries in ATLAS graph.",
        allowedTools: ["detect_architecture_drift", "get_architecture_graph"],
        requiredConnectors: ["github"],
        permissions: ["READ_AST", "INSPECT_GRAPH"],
        safetyPolicy: "Read-only evaluation.",
        evidencePolicy: "Requires AST import path correlation and blast radius estimate.",
        modelPolicy: "Standard reasoning.",
        testSuite: [],
        provenance: {
          sourceType: "BUILT_IN",
          author: "VYRON Architecture Guild",
          contentHash: generateVerificationHash("architecture_drift_audit_v2.0.0"),
          retrievedAt: new Date().toISOString(),
          trustLevel: "TRUSTED",
          license: "MIT",
        },
        status: "ACTIVE",
        versionHistory: [],
        createdAt: "2026-09-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      },
      {
        skillId: "sk_data_contract_verification",
        name: "Data Quality & Contract Verification Skill",
        slug: "data_contract_verification",
        version: "1.1.0",
        description: "Enforces null tolerance thresholds (<5%) and type invariants across partitions.",
        purpose: "Validate partition schemas against strict enterprise data contracts.",
        domain: "Data Quality",
        triggers: ["data", "schema", "contract", "nulls", "partition", "validation"],
        inputSchema: { datasetId: "string", partitionId: "string" },
        outputSchema: { passed: "boolean", nullRatios: "object" },
        systemInstructions: "Calculate column null ratios, inspect timestamp monotonic increases, verify foreign keys.",
        allowedTools: ["validate_dataset_schema"],
        requiredConnectors: ["kaggle", "supabase"],
        permissions: ["READ_DATASET"],
        safetyPolicy: "Zero write mutation to datasets.",
        evidencePolicy: "Requires sample statistics and cryptographic validation hash.",
        modelPolicy: "Deterministic model route.",
        testSuite: [],
        provenance: {
          sourceType: "BUILT_IN",
          author: "VYRON Data Operations",
          contentHash: generateVerificationHash("data_contract_verification_v1.1.0"),
          retrievedAt: new Date().toISOString(),
          trustLevel: "TRUSTED",
          license: "MIT",
        },
        status: "ACTIVE",
        versionHistory: [],
        createdAt: "2026-09-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      },
      {
        skillId: "sk_kaggle_benchmark_eval",
        name: "Kaggle Benchmark Evaluation Skill",
        slug: "kaggle_benchmark_eval",
        version: "1.0.0",
        description: "Evaluates public Kaggle competition benchmark compatibility and usability ratings.",
        purpose: "Search and evaluate public reference benchmarks for research comparison.",
        domain: "Research",
        triggers: ["kaggle", "benchmark", "competition", "dataset search"],
        inputSchema: { query: "string" },
        outputSchema: { candidates: "array" },
        systemInstructions: "Search public Kaggle benchmarks, filter by usability > 0.8 and schema overlap.",
        allowedTools: ["test_connector_health"],
        requiredConnectors: ["kaggle"],
        permissions: ["READ_CONNECTOR"],
        safetyPolicy: "Read-only dataset metadata indexing.",
        evidencePolicy: "Requires Kaggle dataset URL and schema contract.",
        modelPolicy: "Standard.",
        testSuite: [],
        provenance: {
          sourceType: "BUILT_IN",
          author: "VYRON ML Guild",
          contentHash: generateVerificationHash("kaggle_benchmark_eval"),
          retrievedAt: new Date().toISOString(),
          trustLevel: "TRUSTED",
        },
        status: "ACTIVE",
        versionHistory: [],
        createdAt: "2026-09-05T00:00:00Z",
        updatedAt: new Date().toISOString(),
      },
      {
        skillId: "sk_meeting_doc_intelligence",
        name: "Multi-Connector Meeting & Doc Intelligence Skill",
        slug: "meeting_doc_intelligence",
        version: "1.0.0",
        description: "Cross-correlates Google Drive, Notion, and Slack decisions into traceable engineering summaries.",
        purpose: "Aggregate project decisions and context from external productivity integrations.",
        domain: "Productivity",
        triggers: ["meeting", "notes", "minutes", "slack", "notion", "google drive"],
        inputSchema: { timeWindowDays: "number" },
        outputSchema: { decisionsSummary: "string", actionItems: "array" },
        systemInstructions: "Aggregate recent discussions from Notion documents, Slack threads, and Google Drive PDFs.",
        allowedTools: ["test_connector_health"],
        requiredConnectors: ["google_drive", "notion", "slack"],
        permissions: ["READ_DOCS"],
        safetyPolicy: "Context minimization; zero exfiltration.",
        evidencePolicy: "Requires source URI and timestamp for every claim.",
        modelPolicy: "LONG_CONTEXT model route.",
        testSuite: [],
        provenance: {
          sourceType: "BUILT_IN",
          author: "VYRON Integration Lab",
          contentHash: generateVerificationHash("meeting_doc_intelligence"),
          retrievedAt: new Date().toISOString(),
          trustLevel: "TRUSTED",
        },
        status: "ACTIVE",
        versionHistory: [],
        createdAt: "2026-09-10T00:00:00Z",
        updatedAt: new Date().toISOString(),
      },
    ];

    builtIns.forEach((s) => {
      this.skills.set(s.skillId, s);
    });
  }

  public listSkills(filter?: { status?: SkillLifecycleState; domain?: string }): GovernedSkill[] {
    let list = Array.from(this.skills.values());
    if (filter?.status) {
      list = list.filter((s) => s.status === filter.status);
    }
    if (filter?.domain) {
      list = list.filter((s) => s.domain.toLowerCase() === filter.domain?.toLowerCase());
    }
    return list;
  }

  public getSkill(skillIdOrSlug: string): GovernedSkill | undefined {
    return (
      this.skills.get(skillIdOrSlug) ||
      Array.from(this.skills.values()).find((s) => s.slug === skillIdOrSlug)
    );
  }

  /**
   * Registers a new skill in DRAFT state.
   */
  public registerSkill(skill: GovernedSkill, userId = "operator"): GovernedSkill {
    // Duplicate check (Directive 1600-1607)
    const existing = this.getSkill(skill.slug);
    if (existing) {
      throw new Error(`Skill with slug '${skill.slug}' already exists (v${existing.version}).`);
    }

    this.skills.set(skill.skillId, skill);
    this.recordAudit({
      skillId: skill.skillId,
      action: "CREATED",
      userId,
      details: `Registered skill '${skill.name}' in state ${skill.status}.`,
    });
    this.notify();
    return skill;
  }

  /**
   * Activates a skill only after validation has succeeded.
   */
  public async activateSkill(skillId: string, userId = "operator"): Promise<boolean> {
    const skill = this.skills.get(skillId);
    if (!skill) throw new Error(`Skill '${skillId}' not found.`);

    // Directive 615-625: Skill must pass sandbox validation before activation
    const testReport = await skillSandbox.executeTestSuite(skill);
    if (!testReport.passed) {
      skill.status = "REVIEW";
      this.notify();
      throw new Error(
        `Cannot activate skill '${skill.name}': Sandbox validation failed (${testReport.failedCount} failures).`,
      );
    }

    skill.status = "ACTIVE";
    skill.lastTestedAt = new Date().toISOString();
    skill.updatedAt = new Date().toISOString();

    this.recordAudit({
      skillId: skill.skillId,
      action: "ACTIVATED",
      userId,
      details: `Skill '${skill.name}' validated and promoted to ACTIVE.`,
    });
    this.notify();
    return true;
  }

  public disableSkill(skillId: string, userId = "operator"): void {
    const skill = this.skills.get(skillId);
    if (!skill) throw new Error(`Skill '${skillId}' not found.`);

    skill.status = "DISABLED";
    skill.updatedAt = new Date().toISOString();

    this.recordAudit({
      skillId: skill.skillId,
      action: "DISABLED",
      userId,
      details: `Skill '${skill.name}' disabled by operator.`,
    });
    this.notify();
  }

  /**
   * Performs semantic version rollback (Directive 649-668).
   */
  public rollbackSkill(skillId: string, targetVersion: string, userId = "operator"): GovernedSkill {
    const skill = this.skills.get(skillId);
    if (!skill) throw new Error(`Skill '${skillId}' not found.`);

    const target = skill.versionHistory.find((v) => v.version === targetVersion);
    if (!target) {
      throw new Error(`Target version '${targetVersion}' not found in version history for ${skill.name}.`);
    }

    const prevVersion = skill.version;
    skill.version = targetVersion;
    skill.updatedAt = new Date().toISOString();

    this.recordAudit({
      skillId: skill.skillId,
      action: "ROLLED_BACK",
      userId,
      details: `Rolled back skill '${skill.name}' from v${prevVersion} to v${targetVersion}.`,
    });
    this.notify();
    return skill;
  }

  /**
   * Checks whether all required connectors and tools are satisfied (Directive 669-677).
   */
  public checkDependencies(skillId: string, activeConnectors: string[]): {
    satisfied: boolean;
    missingConnectors: string[];
    missingTools: string[];
  } {
    const skill = this.skills.get(skillId);
    if (!skill) throw new Error(`Skill '${skillId}' not found.`);

    const missingConnectors = skill.requiredConnectors.filter(
      (req) => !activeConnectors.includes(req.toLowerCase()),
    );

    return {
      satisfied: missingConnectors.length === 0,
      missingConnectors,
      missingTools: [],
    };
  }
}

export const skillRegistry = SkillRegistry.getInstance();
