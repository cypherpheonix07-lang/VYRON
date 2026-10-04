import type { PipelineState  } from "./state.ts";
import { createId } from "../../../12 — DATABASE PLATFORM/cuid2.ts";

// Import all 26 stages
import { stage24ARequestIngestion } from "./stages/24a-request-ingestion.ts";
import { stage24BIdentityResolution } from "./stages/24b-identity-resolution.ts";
import { stage24CSessionResolution } from "./stages/24c-session-resolution.ts";
import { stage24DIntentClassification } from "./stages/24d-intent-classification.ts";
import { stage24EQueryDecomposition } from "./stages/24e-query-decomposition.ts";
import { stage24FComplexityEstimation } from "./stages/24f-complexity-estimation.ts";
import { stage24GContextDiscovery } from "./stages/24g-context-discovery.ts";
import { stage24HMemoryRetrieval } from "./stages/24h-memory-retrieval.ts";
import { stage24IPermissionValidation } from "./stages/24i-permission-validation.ts";
import { stage24JKnowledgeRetrieval } from "./stages/24j-knowledge-retrieval.ts";
import { stage24KSourceRanking } from "./stages/24k-source-ranking.ts";
import { stage24LToolSelection } from "./stages/24l-tool-selection.ts";
import { stage24MModelSelection } from "./stages/24m-model-selection.ts";
import { stage24NPlanning } from "./stages/24n-planning.ts";
import { stage24OParallelExecution } from "./stages/24o-parallel-execution.ts";
import { stage24PAgentDelegation } from "./stages/24p-agent-delegation.ts";
import { stage24QToolExecution } from "./stages/24q-tool-execution.ts";
import { stage24REvidenceValidation } from "./stages/24r-evidence-validation.ts";
import { stage24SHallucinationDetection } from "./stages/24s-hallucination-detection.ts";
import { stage24TResponseSynthesis } from "./stages/24t-response-synthesis.ts";
import { stage24UCitationGeneration } from "./stages/24u-citation-generation.ts";
import { stage24VSafetyValidation } from "./stages/24v-safety-validation.ts";
import { stage24WLatencyOptimization } from "./stages/24w-latency-optimization.ts";
import { stage24XOutputStreaming, type SSEWriter } from "./stages/24x-output-streaming.ts";
import { stage24YTelemetryCapture } from "./stages/24y-telemetry-capture.ts";
import { stage24ZMemoryUpdateDecision } from "./stages/24z-memory-update-decision.ts";

export interface PipelineExecutionOptions {
  message: string;
  sessionId?: string;
  userId?: string;
  tenantId?: string;
  writer?: SSEWriter;
}

export class CopilotOrchestrator {
  /**
   * Executes the full 26-stage Copilot Orchestration Pipeline (24A–24Z).
   */
  public async execute(options: PipelineExecutionOptions): Promise<PipelineState> {
    const startMs = Date.now();

    // 1. Initialize PipelineState
    let state: PipelineState = {
      requestId: createId(),
      sessionId: options.sessionId || createId(),
      userId: options.userId || "usr_student_01",
      tenantId: options.tenantId || "tnt_brahma_dev",
      rawInput: options.message,
      telemetry: {
        startMs,
        stagesCompleted: [],
      },
    };

    // 2. Sequential State Machine Execution (24A through 24Z)
    state = { ...state, ...(await stage24ARequestIngestion(state)) };
    state = { ...state, ...(await stage24BIdentityResolution(state)) };
    state = { ...state, ...(await stage24CSessionResolution(state)) };
    state = { ...state, ...(await stage24DIntentClassification(state)) };
    state = { ...state, ...(await stage24EQueryDecomposition(state)) };
    state = { ...state, ...(await stage24FComplexityEstimation(state)) };
    state = { ...state, ...(await stage24GContextDiscovery(state)) };
    state = { ...state, ...(await stage24HMemoryRetrieval(state)) };
    state = { ...state, ...(await stage24IPermissionValidation(state)) };
    state = { ...state, ...(await stage24JKnowledgeRetrieval(state)) };
    state = { ...state, ...(await stage24KSourceRanking(state)) };
    state = { ...state, ...(await stage24LToolSelection(state)) };
    state = { ...state, ...(await stage24MModelSelection(state)) };
    state = { ...state, ...(await stage24NPlanning(state)) };
    state = { ...state, ...(await stage24OParallelExecution(state)) };
    state = { ...state, ...(await stage24PAgentDelegation(state)) };
    state = { ...state, ...(await stage24QToolExecution(state)) };
    state = { ...state, ...(await stage24REvidenceValidation(state)) };
    state = { ...state, ...(await stage24SHallucinationDetection(state)) };
    state = { ...state, ...(await stage24TResponseSynthesis(state)) };
    state = { ...state, ...(await stage24UCitationGeneration(state)) };
    state = { ...state, ...(await stage24VSafetyValidation(state)) };
    state = { ...state, ...(await stage24WLatencyOptimization(state)) };
    state = { ...state, ...(await stage24XOutputStreaming(state, options.writer)) };
    state = { ...state, ...(await stage24YTelemetryCapture(state)) };
    state = { ...state, ...(await stage24ZMemoryUpdateDecision(state)) };

    return state;
  }
}

export const copilotOrchestrator = new CopilotOrchestrator();
export default copilotOrchestrator;
