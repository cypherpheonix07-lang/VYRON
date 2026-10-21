/**
 * PROJECT VYRON / BRAHMA — WORKSPACE EXIT NAVIGATION GUARD HOOK
 * Implements Workstreams O (Internal Navigation Guards) and P (Browser Lifecycle Protection):
 * - Attaches window 'beforeunload' listener strictly while unsaved edits exist
 * - Dynamically removes 'beforeunload' when edits are saved or discarded
 * - Provides programmatic route-guarding utilities for internal transitions
 */

import { useEffect, useCallback } from "react";
import { workspaceChangeRegistry } from "@/services/workspace/workspaceChangeRegistry";
import { workspaceExitCoordinator } from "@/services/workspace/workspaceExitCoordinator";

export function useWorkspaceExitGuard(projectId?: string | null, projectName?: string | null) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): string | undefined => {
      if (workspaceChangeRegistry.hasUnsavedChanges(projectId)) {
        // Standard cross-browser unload protection
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
      return undefined;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [projectId]);

  const guardNavigation = useCallback(
    (navigateFn: () => void) => {
      if (workspaceChangeRegistry.hasUnsavedChanges(projectId)) {
        workspaceExitCoordinator.requestExit({
          projectId,
          projectName,
          navigate: () => navigateFn(),
        });
        return false;
      }

      navigateFn();
      return true;
    },
    [projectId, projectName],
  );

  return { guardNavigation };
}
