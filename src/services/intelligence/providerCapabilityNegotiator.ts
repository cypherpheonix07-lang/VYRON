/**
 * Provider Capability Negotiator — Dynamic Capability & Scope Matrix Negotiation Engine
 */

export type ProviderActionCapability =
  | "DISCOVER"
  | "IMPORT"
  | "SYNC"
  | "READ"
  | "SEARCH"
  | "BRANCH"
  | "COMMIT"
  | "PR"
  | "ISSUE"
  | "PLAN"
  | "RUN_AGENT"
  | "RUN_COMMAND"
  | "PREVIEW"
  | "DEPLOY"
  | "OBSERVE"
  | "ROLLBACK"
  | "VERIFY"
  | "RECONCILE"
  | "DISCONNECT";

export interface NegotiatedProviderCapabilities {
  providerId: string;
  authenticated: boolean;
  activeScopes: string[];
  supportedCapabilities: ProviderActionCapability[];
  restrictedCapabilities: Array<{
    capability: ProviderActionCapability;
    reason: string;
    requiredScope?: string;
  }>;
  freshnessSlaSeconds: number;
  rateLimitRemaining: number;
  negotiatedAt: string;
}

class ProviderCapabilityNegotiatorEngine {
  public negotiate(providerId: string, grantedScopes: string[] = []): NegotiatedProviderCapabilities {
    const allCaps: ProviderActionCapability[] = [
      "DISCOVER",
      "IMPORT",
      "SYNC",
      "READ",
      "SEARCH",
      "BRANCH",
      "COMMIT",
      "PR",
      "ISSUE",
      "PLAN",
      "RUN_AGENT",
      "RUN_COMMAND",
      "PREVIEW",
      "DEPLOY",
      "OBSERVE",
      "ROLLBACK",
      "VERIFY",
      "RECONCILE",
      "DISCONNECT",
    ];

    const hasWrite = grantedScopes.some((s) => s.includes("write") || s.includes("repo") || s.includes("admin"));
    const hasAgent = grantedScopes.some((s) => s.includes("agent") || s.includes("workflow") || s.includes("repo"));

    const supported = allCaps.filter((cap) => {
      if (["COMMIT", "BRANCH", "PR", "DEPLOY", "ROLLBACK"].includes(cap)) return hasWrite;
      if (["RUN_AGENT", "RUN_COMMAND"].includes(cap)) return hasAgent;
      return true;
    });

    const restricted = allCaps
      .filter((c) => !supported.includes(c))
      .map((c) => ({
        capability: c,
        reason: "Requires elevated OAuth/App write scope.",
        requiredScope: "repo:write",
      }));

    return {
      providerId,
      authenticated: true,
      activeScopes: grantedScopes.length > 0 ? grantedScopes : ["read:user", "repo:read"],
      supportedCapabilities: supported,
      restrictedCapabilities: restricted,
      freshnessSlaSeconds: 30,
      rateLimitRemaining: 4950,
      negotiatedAt: new Date().toISOString(),
    };
  }
}

export const providerCapabilityNegotiator = new ProviderCapabilityNegotiatorEngine();
