import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { activityService } from "@/services/activityService";
import type { ProjectPulse, WorkspacePulse } from "@/types/activity";

export function useProjectPulse(projectId: string | null) {
  const [pulse, setPulse] = useState<ProjectPulse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPulse = useCallback(async () => {
    if (!projectId || projectId === "all") {
      setPulse(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await activityService.getProjectPulse(projectId);
      setPulse(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load pulse");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchPulse();

    if (!projectId || projectId === "all") return;

    // Realtime invalidation on activity_events INSERT
    const channel = supabase
      .channel(`pulse:project:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_events",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          fetchPulse();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, fetchPulse]);

  return { pulse, isLoading, error, refetch: fetchPulse };
}

export function useWorkspacePulse() {
  const [pulse, setPulse] = useState<WorkspacePulse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspace = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await activityService.getWorkspacePulse();
      setPulse(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load workspace pulse");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspace();

    // Invalidate on any activity event insert across workspace
    const channel = supabase
      .channel("pulse:workspace")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_events",
        },
        () => {
          fetchWorkspace();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchWorkspace]);

  return { pulse, isLoading, error, refetch: fetchWorkspace };
}
