/**
 * VYRON — REACT HOOK FOR CANONICAL ACTIVE PROJECT CONTEXT (WORKSTREAM B & E)
 * Guarantees coherent active project identity across Header, Command Center,
 * 14-lifecycle sections, and execution runs.
 * Strictly ZERO Raw SQL & Zero-Fiction Architecture Law enforced.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  projectRegistry,
  type CanonicalProject,
  type ProjectAvailability,
} from "@/services/project/projectRegistry";

export interface ActiveProjectContextValue {
  project: CanonicalProject | null;
  projectId: string | null;
  availability: ProjectAvailability;
  availableProjects: CanonicalProject[];
  generationId: number;
  setActiveProject: (id: string | null, options?: { navigateToProject?: boolean }) => void;
  refresh: () => Promise<void>;
}

export function useActiveProject(): ActiveProjectContextValue {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location?.pathname || "";
  const searchStr = location?.searchStr || "";

  // 1. Resolve project ID from route param hierarchy (B04)
  // Priority 1: Route param /app/projects/:id
  const routeMatch = pathname.match(/^\/app\/projects\/([a-zA-Z0-9_-]+)/);
  const routeProjectId = routeMatch && routeMatch[1] !== "new" && routeMatch[1] !== "all" ? routeMatch[1] : null;

  // Priority 2: Query param ?projectId=...
  const queryProjectId = useMemo(() => {
    if (!searchStr) return null;
    const params = new URLSearchParams(searchStr);
    return params.get("projectId");
  }, [searchStr]);

  // Priority 3: Registry active preference
  const fallbackProjectId = projectRegistry.getActiveProjectId();

  const resolvedTargetId = routeProjectId || queryProjectId || fallbackProjectId;

  const [currentProject, setCurrentProject] = useState<CanonicalProject | null>(() => {
    return resolvedTargetId ? projectRegistry.getProjectById(resolvedTargetId) : projectRegistry.getActiveProject();
  });

  const [availableProjects, setAvailableProjects] = useState<CanonicalProject[]>(() => {
    return projectRegistry.getAllProjects();
  });

  const [generationId, setGenerationId] = useState<number>(() => projectRegistry.getGenerationId());
  const [isResolving, setIsResolving] = useState<boolean>(false);

  // Synchronize on mount and subscribe to changes
  useEffect(() => {
    const handleUpdate = () => {
      setAvailableProjects(projectRegistry.getAllProjects());
      setGenerationId(projectRegistry.getGenerationId());

      if (resolvedTargetId) {
        const found = projectRegistry.getProjectById(resolvedTargetId);
        setCurrentProject(found);
      } else {
        setCurrentProject(projectRegistry.getActiveProject());
      }
    };

    const unsubscribe = projectRegistry.subscribe(handleUpdate);

    // Initial background sync with Supabase
    setIsResolving(true);
    projectRegistry
      .syncFromSupabase()
      .finally(() => {
        setIsResolving(false);
        handleUpdate();
      });

    return () => {
      unsubscribe();
    };
  }, [resolvedTargetId]);

  // Keep internal state aligned when route param changes
  useEffect(() => {
    if (routeProjectId) {
      projectRegistry.setActiveProjectId(routeProjectId);
      const proj = projectRegistry.getProjectById(routeProjectId);
      setCurrentProject(proj);
    } else if (resolvedTargetId) {
      const proj = projectRegistry.getProjectById(resolvedTargetId);
      setCurrentProject(proj);
    }
  }, [routeProjectId, resolvedTargetId]);

  // Compute availability state (B06)
  const availability: ProjectAvailability = useMemo(() => {
    if (isResolving && !currentProject) return "resolving";
    if (!resolvedTargetId) return "missing";
    if (currentProject) return "ready";
    return "missing";
  }, [isResolving, currentProject, resolvedTargetId]);

  const setActiveProject = useCallback(
    (id: string | null, options?: { navigateToProject?: boolean }) => {
      if (id === "all") {
        navigate({ to: "/app/projects" });
        return;
      }

      if (!id || id === "none") {
        projectRegistry.clearActiveProject();
        setCurrentProject(null);
        setGenerationId(projectRegistry.getGenerationId());
        return;
      }

      projectRegistry.setActiveProjectId(id);
      const target = projectRegistry.getProjectById(id);
      setCurrentProject(target);
      setGenerationId(projectRegistry.getGenerationId());

      if (options?.navigateToProject) {
        navigate({ to: "/app/projects/$id", params: { id } });
      } else if (routeProjectId && routeProjectId !== id) {
        // If already inside a project subview, maintain that subview for the new project
        const subpath = pathname.replace(/^\/app\/projects\/[a-zA-Z0-9_-]+/, "");
        const targetUrl = `/app/projects/${id}${subpath}`;
        navigate({ to: targetUrl as never });
      }
    },
    [navigate, pathname, routeProjectId]
  );

  const refresh = useCallback(async () => {
    setIsResolving(true);
    await projectRegistry.syncFromSupabase();
    setAvailableProjects(projectRegistry.getAllProjects());
    if (resolvedTargetId) {
      setCurrentProject(projectRegistry.getProjectById(resolvedTargetId));
    }
    setIsResolving(false);
  }, [resolvedTargetId]);

  return {
    project: currentProject,
    projectId: currentProject?.id || resolvedTargetId || null,
    availability,
    availableProjects,
    generationId,
    setActiveProject,
    refresh,
  };
}
