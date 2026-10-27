/**
 * PROJECT BRAHMA — INTELLIGENCE LAYER ERROR TAXONOMY (PHASE W)
 * Canonical Error Codes, Safe Error Classification, and Recovery Strategies.
 */

export type BrahmaErrorCode =
  | "BRA-601" // Plugin not found in registry
  | "BRA-602" // Tool execution timeout (>30s)
  | "BRA-603" // Demo fixture corrupted or missing
  | "BRA-604" // Kaggle proxy rate limited (429)
  | "BRA-605" // Chat context overflow
  | "BRA-606" // Streaming connection dropped mid-response
  | "BRA-607" // Demo mode mutation attempt blocked
  | "BRA-403-demo"; // Unauthorized mutation attempt in demo

export interface RecoveryAction {
  strategy: string;
  suggestedAction: string;
  retryable: boolean;
}

export const ERROR_RECOVERY_REGISTRY: Record<BrahmaErrorCode, RecoveryAction> = {
  "BRA-601": {
    strategy: "List available tools and suggest closest match.",
    suggestedAction: "Check registered tools or plugin manifest.",
    retryable: false,
  },
  "BRA-602": {
    strategy: "Retry once with extended timeout, then fail gracefully.",
    suggestedAction: "Retry the operation with reduced scope.",
    retryable: true,
  },
  "BRA-603": {
    strategy: "Fall back to generic fixture, alert telemetry.",
    suggestedAction: "Select an alternative sample domain.",
    retryable: false,
  },
  "BRA-604": {
    strategy: "Show retry-after countdown, queue request.",
    suggestedAction: "Wait for rate limit window to expire or use cached data.",
    retryable: true,
  },
  "BRA-605": {
    strategy: "Summarize history, continue with truncated context.",
    suggestedAction: "Reset or summarize earlier conversation history.",
    retryable: false,
  },
  "BRA-606": {
    strategy: "Reconnect SSE, resume from last received token.",
    suggestedAction: "Re-establishing streaming connection...",
    retryable: true,
  },
  "BRA-607": {
    strategy: "Show educational notification explaining demo read-only nature.",
    suggestedAction: "Exit demo mode to save changes to production.",
    retryable: false,
  },
  "BRA-403-demo": {
    strategy: "Intercept mutation and enforce read-only projection.",
    suggestedAction: "Mutations are disabled in Demo Mode.",
    retryable: false,
  },
};

export class BrahmaIntelligenceError extends Error {
  public readonly code: BrahmaErrorCode;
  public readonly recovery: RecoveryAction;
  public readonly details?: unknown;

  constructor(code: BrahmaErrorCode, message: string, details?: unknown) {
    super(`[${code}] ${message}`);
    this.name = "BrahmaIntelligenceError";
    this.code = code;
    this.recovery = ERROR_RECOVERY_REGISTRY[code];
    this.details = details;
    Object.setPrototypeOf(this, BrahmaIntelligenceError.prototype);
  }
}
