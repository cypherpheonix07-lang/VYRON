/**
 * PROJECT BRAHMA — USE DEMO MODE HOOK (PHASE H.2)
 * Convenient hook accessor for demo mode state, domain binding, and mutation guards.
 */

import { useDemoMode as useDemoModeContext } from "@/contexts/DemoModeContext";
import { BrahmaIntelligenceError } from "@/lib/errors/brahmaErrors";

export function useDemoMode() {
  const context = useDemoModeContext();

  return {
    ...context,
    isDemoActive: () => context.isDemo,
    getDemoProject: () => context.demoProjectId,
    requireLive: () => {
      if (context.isDemo) {
        throw new BrahmaIntelligenceError(
          "BRA-403-demo",
          "Mutations and external writes are strictly disabled in Demo Mode."
        );
      }
    },
  };
}
