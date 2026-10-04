/**
 * VYRON PLATFORM LAYER 24: COPILOT ORCHESTRATOR
 * Complete PipelineState definition covering all 26 stages (24A–24Z).
 */

export type IntentCategory =
  | "code_generation"
  | "debugging"
  | "explanation"
  | "analysis"
  | "search"
  | "planning"
  | "review"
  | "question_answer"
  | "summarization"
  | "creative";

export type ComplexityLevel = "low" | "medium" | "high";

export interface ResolvedIdentity {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  plan: "starter" | "pro" | "enterprise";
  features: string[];
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  ts: string;
}

export interface ResolvedSession {
  id: string;
  userId: string;
  tenantId: string;
  startedAt: string;
  messageCount: number;
  history: CopilotMessage[];
}

export interface ClassifiedIntent {
  category: IntentCategory;
  subCategory?: string;
  entities: string[];
  confidence: number;
}

export interface ComplexityEstimate {
  score: number;
  level: ComplexityLevel;
  estimatedMs: number;
}

export interface DiscoveredContext {
  project?: {
    id: string;
    name: string;
    healthScore?: number;
  };
  repo?: {
    name: string;
    branch: string;
    language: string;
  };
  preferences: Record<string, unknown>;
  sessionHistory: CopilotMessage[];
}

export interface RetrievedMemories {
  shortTerm: Array<{ query: string; response: string; ts: string }>;
  longTerm: Array<{ content: string; score: number; metadata: Record<string, unknown> }>;
  episodic: CopilotMessage[];
}

export interface PermissionResult {
  valid: boolean;
  quotaRemaining: number;
  rateLimitAllowed: boolean;
}

export interface KnowledgeItem {
  id: string;
  content: string;
  score?: number;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface RetrievedKnowledge {
  vector: KnowledgeItem[];
  keyword: KnowledgeItem[];
  raw: KnowledgeItem[];
}

export interface RankedSource extends KnowledgeItem {
  relevanceScore: number;
  rank: number;
}

export interface SelectedTool {
  name: string;
  reason: string;
  parameters?: Record<string, unknown>;
}

export interface PlanStep {
  id: number;
  description: string;
  canRunParallel: boolean;
  requiresAgent: boolean;
  tools?: string[];
}

export interface ExecutionPlan {
  steps: PlanStep[];
  draftResponse?: string;
}

export interface ToolResult {
  toolName: string;
  success: boolean;
  result?: unknown;
  error?: string;
  durationMs: number;
}

export interface AgentResult {
  agentName: string;
  success: boolean;
  output: string;
}

export interface ClaimValidation {
  claim: string;
  validated: boolean;
  confidence: number;
  sourceRank?: number;
}

export interface EvidenceResult {
  claims: string[];
  validations: ClaimValidation[];
  overallConfidence: number;
}

export interface HallucinationResult {
  score: number;
  passed: boolean;
  regenerated?: boolean;
}

export interface Citation {
  id: number;
  source?: string;
  title?: string;
  excerpt?: string;
}

export interface SafetyResult {
  passed: boolean;
  reason?: string;
  inputScore?: number;
  outputScore?: number;
}

export interface TelemetryData {
  startMs: number;
  totalDurationMs?: number;
  tokensUsed?: number;
  stagesCompleted: string[];
}

export interface MemoryUpdateDecision {
  shouldStoreShortTerm: boolean;
  shouldStoreLongTerm: boolean;
  importanceScore: number;
}

/**
 * Master PipelineState Object shared incrementally across all 26 stages.
 */
export interface PipelineState {
  // Required initial properties
  requestId: string;
  sessionId: string;
  userId: string;
  tenantId: string;
  rawInput: string;

  // Populated incrementally by stages 24A through 24Z
  identity?: ResolvedIdentity;
  session?: ResolvedSession;
  intent?: ClassifiedIntent;
  subQueries?: string[];
  complexity?: ComplexityEstimate;
  context?: DiscoveredContext;
  memories?: RetrievedMemories;
  permissions?: PermissionResult;
  knowledge?: RetrievedKnowledge;
  rankedSources?: RankedSource[];
  selectedTools?: SelectedTool[];
  selectedModel?: string;
  plan?: ExecutionPlan;
  parallelResults?: ToolResult[];
  delegatedResults?: AgentResult[];
  toolResults?: ToolResult[];
  evidenceValidation?: EvidenceResult;
  hallucinationCheck?: HallucinationResult;
  synthesizedResponse?: string;
  citations?: Citation[];
  safetyValidation?: SafetyResult;
  optimizedResponse?: string;
  streamChunks?: string[];
  telemetry: TelemetryData;
  memoryUpdateDecision?: MemoryUpdateDecision;
}

export const PIPELINE_STATE_VERSION = '1.0.0';
