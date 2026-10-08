/**
 * PROJECT VYRON / ATHER — COGNITIVE ARCHITECTURE TYPE CONTRACTS
 * Unifies the Seven Cognitive Responsibilities:
 * 1. Executive Controller
 * 2. World Model
 * 3. Memory Fabric
 * 4. Multi-Model Intelligence
 * 5. Critic System
 * 6. Simulation Engine
 * 7. Action Engine
 *
 * Enforces Zero-Fiction Architecture, strict project isolation,
 * calibrated confidence, and transparent receipt logging.
 */

export type AtherBrainType =
  | "EXECUTIVE_CONTROLLER"
  | "WORLD_MODEL"
  | "MEMORY_FABRIC"
  | "MULTI_MODEL_INTELLIGENCE"
  | "CRITIC_SYSTEM"
  | "SIMULATION_ENGINE"
  | "ACTION_ENGINE";

/** Memory Fabric: 7 Scopes and 7 Types */
export type MemoryScope =
  | "SESSION"
  | "TASK"
  | "PROJECT"
  | "WORKSPACE"
  | "USER_PREFERENCE"
  | "ANALYSIS"
  | "DEMO";

export type MemoryType =
  | "EPISODIC"
  | "SEMANTIC"
  | "PROCEDURAL"
  | "WORKING"
  | "TEMPORAL"
  | "RELATIONSHIP"
  | "COUNTERFACTUAL";

export interface MemoryFabricEntry {
  id: string;
  scope: MemoryScope;
  type: MemoryType;
  key: string;
  title: string;
  content: string;
  confidence: number; // 0.0 to 1.0 calibrated
  provenance: string;
  projectId?: string | undefined;
  tags?: string[] | undefined;
  createdAt: string;
  updatedAt: string;
  validUntil?: string | undefined;
  isInvalidated?: boolean | undefined;
}

/** Execution Depth & Response Controls */
export type ExecutionDepth =
  | "AUTO"
  | "QUICK"
  | "STANDARD"
  | "DEEP"
  | "INVESTIGATE"
  | "HIGH_ASSURANCE";

export type SpecialistType =
  | "DATA_ANALYST"
  | "SECURITY_AUDITOR"
  | "SYSTEMS_ARCHITECT"
  | "CORE_ENGINEER"
  | "RESEARCHER"
  | "CRITIC";

export type ResponseDetail =
  | "CONCISE"
  | "BALANCED"
  | "IN_DEPTH"
  | "EVIDENCE_FIRST";

export type TaskMode =
  | "CHAT"
  | "PLANNING"
  | "INVESTIGATION"
  | "MISSION"
  | "ARCHITECTURE"
  | "SIMULATION";

export type RequestIntent =
  | "QUESTION"
  | "CRITIQUE"
  | "EXECUTION"
  | "ANALYSIS"
  | "INVESTIGATION"
  | "MISSION"
  | "SIMULATION";

/** Structured Request Contract extracted by Executive Controller / Request Parser */
export interface ParsedRequestContract {
  rawText: string;
  objective: string;
  intent: RequestIntent;
  isCritiqueOnly: boolean;
  subtasks: string[];
  requestedFormat: "concise" | "bulleted" | "table" | "json" | "detailed_report" | "natural";
  explicitConstraints: string[];
  evidenceNeeds: string[];
  completionConditions: string[];
  sanitizedContent: string;
  embeddedCommandsBlocked: string[];
  targetProjectId: string;
}

/** Critic System Assertion Receipt */
export interface CriticCheckReceipt {
  checkName: string;
  passed: boolean;
  details: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

/** Tool & Action Execution Receipt */
export interface AtherToolReceipt {
  id: string;
  toolName: string;
  params: Record<string, unknown>;
  result: Record<string, unknown>;
  status: "SUCCESS" | "FAILED" | "CANCELLED" | "BLOCKED";
  durationMs: number;
  verificationHash: string;
  error?: string | undefined;
}

/** Shared Answer Contract: User Explanation Receipt ("How this answer was produced") */
export interface HowThisAnswerWasProduced {
  turnId: string;
  timestamp: string;
  understoodRequest: string;
  contextUsed: Array<{
    source: string;
    version?: string | undefined;
    scope: string;
    relevance: number;
  }>;
  actualModel: string;
  requestedModel: string;
  modelFallbackOccurred: boolean;
  fallbackReason?: string | undefined;
  selectedSpecialist: SpecialistType;
  skillsInvoked: string[];
  connectorsUsed: string[];
  toolReceipts: AtherToolReceipt[];
  citedSources: string[];
  checksPerformed: CriticCheckReceipt[];
  remainingUncertainty: string;
  verifiedChanges: string[];
  executionDepth: ExecutionDepth;
  responseDetail: ResponseDetail;
}

/** Final Answer Packet returned to the UI */
export interface AtherAnswerPacket {
  turnId: string;
  directAnswer: string;
  summary?: string | undefined;
  detailedAnalysis?: string | undefined;
  tableData?: Array<Record<string, unknown>> | undefined;
  suggestedNextSteps: string[];
  receipt: HowThisAnswerWasProduced;
  status: "COMPLETED" | "PARTIAL" | "FAILED" | "CANCELLED";
}

/** Connector Definition & Status */
export interface AtherConnectorStatus {
  id: string;
  name: string;
  isGranted: boolean;
  scopes: string[];
  lastHealthCheck: string;
  revocationReason?: string | undefined;
}
