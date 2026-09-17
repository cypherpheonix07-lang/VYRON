/**
 * PROJECT BRAHMA — DEMO MODE CONTEXT (PHASE H.1, FL-02-A)
 * Global state transformation driving synthetic projections and read-only protections.
 * Persists to sessionStorage ONLY (clears on tab close, never in localStorage/Supabase).
 */

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { modeStore } from "@/state/mode/modeStore";

export interface DemoModeContextType {
  isDemo: boolean;
  isDemoMode: boolean; // Compatibility alias
  demoProjectId: string | null;
  demoDomain: string | null;
  activatedAt: number;
  demoSessionId: string;
  activate: (projectId?: string, domain?: string) => void;
  deactivate: () => void;
  setProject: (id: string) => void;
  setDemoMode: (val: boolean) => void; // Compatibility alias
  toggleDemoMode: () => void; // Compatibility alias
}

const STORAGE_KEY = "brahma_demo_session";

const DemoModeContext = createContext<DemoModeContextType>({
  isDemo: false,
  isDemoMode: false,
  demoProjectId: null,
  demoDomain: "fintech",
  activatedAt: 0,
  demoSessionId: "",
  activate: () => {},
  deactivate: () => {},
  setProject: () => {},
  setDemoMode: () => {},
  toggleDemoMode: () => {},
});

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{
    isDemo: boolean;
    demoProjectId: string | null;
    demoDomain: string;
    activatedAt: number;
    demoSessionId: string;
  }>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            isDemo: Boolean(parsed.isDemo),
            demoProjectId: parsed.demoProjectId || "demo-project-brahma-showcase",
            demoDomain: parsed.demoDomain || "fintech",
            activatedAt: parsed.activatedAt || Date.now(),
            demoSessionId: parsed.demoSessionId || crypto.randomUUID(),
          };
        }
      } catch {
        // Fallback to default
      }
    }
    return {
      isDemo: false,
      demoProjectId: null,
      demoDomain: "fintech",
      activatedAt: 0,
      demoSessionId: "",
    };
  });

  // Keep document.body class in sync
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (session.isDemo) {
        document.body.classList.add("demo-mode");
      } else {
        document.body.classList.remove("demo-mode");
      }
    }
  }, [session.isDemo]);

  // Two-way reactive synchronization: Subscribe to external modeStore changes
  useEffect(() => {
    return modeStore.subscribe((state) => {
      const shouldBeDemo = state.mode === "DEMO";
      setSession((prev) => {
        if (prev.isDemo === shouldBeDemo) return prev;
        const updated = {
          isDemo: shouldBeDemo,
          demoProjectId: shouldBeDemo ? prev.demoProjectId || "demo-project-brahma-showcase" : null,
          demoDomain: prev.demoDomain || "fintech",
          activatedAt: shouldBeDemo ? prev.activatedAt || Date.now() : 0,
          demoSessionId: shouldBeDemo ? prev.demoSessionId || crypto.randomUUID() : "",
        };
        if (typeof window !== "undefined") {
          if (shouldBeDemo) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            window.dispatchEvent(
              new CustomEvent("brahma:demo:activated", { detail: updated }),
            );
          } else {
            sessionStorage.removeItem(STORAGE_KEY);
            window.dispatchEvent(new CustomEvent("brahma:demo:deactivated"));
          }
        }
        return updated;
      });
    });
  }, []);

  const saveSession = (newSession: typeof session) => {
    setSession(newSession);
    modeStore.setMode(newSession.isDemo ? "DEMO" : "NORMAL");

    if (typeof window !== "undefined") {
      if (newSession.isDemo) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        window.dispatchEvent(
          new CustomEvent("brahma:demo:activated", { detail: newSession })
        );
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(
          new CustomEvent("brahma:demo:deactivated")
        );
      }
    }
  };

  const activate = useCallback((projectId?: string, domain?: string) => {
    const newSession = {
      isDemo: true,
      demoProjectId: projectId || "demo-project-brahma-showcase",
      demoDomain: domain || "fintech",
      activatedAt: Date.now(),
      demoSessionId: crypto.randomUUID(),
    };
    saveSession(newSession);
  }, []);

  const deactivate = useCallback(() => {
    const newSession = {
      isDemo: false,
      demoProjectId: null,
      demoDomain: "fintech",
      activatedAt: 0,
      demoSessionId: "",
    };
    saveSession(newSession);
  }, []);

  const setProject = useCallback((id: string) => {
    setSession((prev) => {
      const updated = { ...prev, demoProjectId: id };
      if (typeof window !== "undefined" && updated.isDemo) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setDemoMode = useCallback((val: boolean) => {
    if (val) activate();
    else deactivate();
  }, [activate, deactivate]);

  const toggleDemoMode = useCallback(() => {
    if (session.isDemo) deactivate();
    else activate();
  }, [session.isDemo, activate, deactivate]);

  return (
    <DemoModeContext.Provider
      value={{
        isDemo: session.isDemo,
        isDemoMode: session.isDemo,
        demoProjectId: session.demoProjectId,
        demoDomain: session.demoDomain,
        activatedAt: session.activatedAt,
        demoSessionId: session.demoSessionId,
        activate,
        deactivate,
        setProject,
        setDemoMode,
        toggleDemoMode,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  return {
    ...ctx,
    isDemoActive: () => ctx.isDemo,
    getDemoProject: () => ctx.demoProjectId,
    requireLive: () => {
      if (ctx.isDemo) {
        throw new Error("[BRA-403-demo] This action cannot be performed in Demo Mode. Exit Demo Mode to continue.");
      }
    },
  };
}
