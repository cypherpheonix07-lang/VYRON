/**
 * PROJECT BRAHMA — TASK-AWARE AI ROUTER
 * Intelligently routes analytical prompts and tool-calls to the optimal model:
 * - Claude 3.7 / 3.5 Sonnet: Multi-step reasoning, pipeline planning, tool-calling.
 * - Moonshot Kimi K3 (MoE): Long-context tabular RAG, dataset schema comprehension.
 * - OpenAI GPT-4o: Structured JSON contract validation and classification.
 * - Deterministic Mock: High-speed demo mode & offline execution.
 */

import { AIAdapter, AICompletionRequest, AICompletionResponse } from "./types";
import { ClaudeAdapter } from "./adapters/claudeAdapter";
import { KimiAdapter } from "./adapters/kimiAdapter";
import { OpenAiAdapter } from "./adapters/openAiAdapter";
import { MockAIAdapter } from "./adapters/mockAdapter";
import { AIModelType } from "../../state/copilot/copilotStore";

export class AIRouter {
  private adapters: Map<AIModelType, AIAdapter> = new Map();
  private mockAdapter: MockAIAdapter;

  constructor() {
    this.mockAdapter = new MockAIAdapter();
    this.adapters.set("CLAUDE_SONNET", new ClaudeAdapter());
    this.adapters.set("KIMI_K3", new KimiAdapter());
    this.adapters.set("OPENAI_GPT4O", new OpenAiAdapter());
    this.adapters.set("MOCK_DETERMINISTIC", this.mockAdapter);
  }

  public getAdapter(model: AIModelType): AIAdapter {
    return this.adapters.get(model) || this.mockAdapter;
  }

  public resolveModel(request: AICompletionRequest): AIModelType {
    if (request.modelOverride) {
      return request.modelOverride;
    }

    switch (request.taskType) {
      case "REASONING":
      case "EXPLAINABILITY":
        return "CLAUDE_SONNET";
      case "LONG_CONTEXT_RAG":
        return "KIMI_K3";
      case "STRUCTURED_EXTRACTION":
        return "OPENAI_GPT4O";
      case "DEMO_SIMULATION":
      default:
        return "MOCK_DETERMINISTIC";
    }
  }

  public async routeAndComplete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const selectedModel = this.resolveModel(request);
    const primaryAdapter = this.getAdapter(selectedModel);

    try {
      return await primaryAdapter.complete(request);
    } catch (err: unknown) {
      console.warn(
        `Primary model ${selectedModel} failed; routing to deterministic fallback engine.`,
        err,
      );
      return await this.mockAdapter.complete(request);
    }
  }
}

export const aiRouter = new AIRouter();
