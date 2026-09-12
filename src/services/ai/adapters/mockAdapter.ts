/**
 * PROJECT BRAHMA — DETERMINISTIC MOCK AI ADAPTER
 * Generates verified, reproducible analytics reasoning and tool calls without external network dependencies.
 * Used for Demo Mode and offline development.
 */

import { AIAdapter, AICompletionRequest, AICompletionResponse } from "../types";
import { generateVerificationHash } from "../cryptoUtils";

export class MockAIAdapter implements AIAdapter {
  public id = "MOCK_DETERMINISTIC" as const;
  public providerName = "MOCK" as const;

  public isAvailable(): boolean {
    return true;
  }

  public async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const startTime = Date.now();
    const lastUserMessage = request.messages.filter((m) => m.role === "user").pop()?.content || "";
    const lower = lastUserMessage.toLowerCase();

    let textResponse = "";
    let toolCalls = undefined;

    if (lower.includes("fraud") || lower.includes("anomaly") || lower.includes("iqr")) {
      textResponse =
        `**Brahma Anomaly Engine [SHAP Analysis & IQR Scoring]**\n\n` +
        `• **Evaluated Records**: 12,480 live transactions across the IEEE-CIS benchmark.\n` +
        `• **High-Risk Anomalies Detected**: 18 transactions deviated by >3.5 standard deviations from median velocity.\n` +
        `• **Primary Attribution**: IP-country mismatch combined with transaction velocity spike (0.87 SHAP importance weight).\n` +
        `• **Recommended Action**: Enable step-up biometric MFA on entity cluster \`ENT-US-9921\` and throttle burst carding attempts.`;
    } else if (lower.includes("risk") || lower.includes("score")) {
      textResponse =
        `**Composite Multi-Factor Risk Assessment**\n\n` +
        `• **Overall Risk Index**: 78.4 / 100 [HIGH ALERT]\n` +
        `• **Factor Breakdown**:\n` +
        `  - Velocity Risk: 92/100 (Unusually short interval between successive checkout events)\n` +
        `  - Geographic Drift: 81/100 (Cross-continental IP jump in < 8 minutes)\n` +
        `  - Device Fingerprint Entropy: 65/100 (Canvas hash rotation detected)\n` +
        `• **Confidence**: 94.2% based on cross-validated isolation forest ensemble.`;
    } else if (
      lower.includes("schema") ||
      lower.includes("contract") ||
      lower.includes("validation")
    ) {
      textResponse =
        `**Data Quality & Contract Verification**\n\n` +
        `• **Target**: Canonical IEEE-CIS Dataset Schema\n` +
        `• **Conformity Score**: 99.8% (0 critical null violations)\n` +
        `• **Type Strictness**: All numeric columns verified within float64 bounds.\n` +
        `• **Drift Check**: Distribution drift is within acceptable tolerance (+0.04 Kolmogorov-Smirnov metric).`;
    } else if (lower.includes("run") || lower.includes("analysis") || lower.includes("pipeline")) {
      textResponse =
        `**Pipeline Orchestration Ready**\n\n` +
        `I have prepared the 12-stage analysis pipeline for execution. All data contracts and Kaggle connectors are verified. ` +
        `You can trigger the pipeline directly using the **RUN ANALYSIS** control.`;
      if (request.tools && request.tools.some((t) => t.name === "trigger_analysis")) {
        toolCalls = [
          {
            id: `call_${Date.now()}`,
            name: "trigger_analysis",
            arguments: { datasetId: "ieee_fraud_benchmark", depth: "COMPREHENSIVE" },
          },
        ];
      }
    } else {
      textResponse =
        `**Brahma Intelligence Copilot**\n\n` +
        `Analyzing request: "${lastUserMessage.slice(0, 80)}${lastUserMessage.length > 80 ? "..." : ""}"\n\n` +
        `The Brahma live analytics engine is fully synchronized. Available commands:\n` +
        `1. Run 12-stage analysis on current dataset\n` +
        `2. Inspect data contracts and schema drift\n` +
        `3. Review detected entity anomalies and SHAP attribution\n` +
        `4. Simulate synthetic fraud surges in Demo Mode`;
    }

    const durationMs = Math.max(80, Date.now() - startTime);
    const hashPayload = `${request.taskType}:${textResponse}:${durationMs}`;
    const verificationHash = generateVerificationHash(hashPayload);

    return {
      model: "MOCK_DETERMINISTIC",
      provider: "MOCK",
      text: textResponse,
      toolCalls,
      usage: {
        promptTokens: Math.round(lastUserMessage.length / 4) + 50,
        completionTokens: Math.round(textResponse.length / 4),
        totalTokens: Math.round((lastUserMessage.length + textResponse.length) / 4) + 50,
      },
      durationMs,
      verificationHash,
    };
  }
}
