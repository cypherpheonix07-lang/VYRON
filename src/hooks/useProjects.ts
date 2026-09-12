import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { authService } from "@/services/authService";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { DEMO_PROJECTS } from "@/data/demoSeedData";

export interface Project {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
  health_score: number;
  status: string;
  created_at: string;
  owner_id?: string;
  owner_name?: string;
  domain?: string | null;
  domain_secondary?: string[];
  target_users?: Array<{ label: string; priority: number; custom?: boolean }>;
  platforms?: string[];
  stack?: string;
  repo_full_name?: string | null;
  complexity_budget?: number;
  gate_strictness?: string;
  compliance_pack?: string | null;
  allow_override?: boolean;
  retention?: string;
  kpi_targets?: { health_min?: number; coverage_min?: number; max_critical?: number };
  budget_cap_usd?: number | null;
  milestone?: string | null;
  cadence?: string;
  draft_state?: any;
  wizard_step?: number;
}

export function useProjects() {
  const { isDemoMode } = useDemoMode();
  const [projects, setProjects] = useState<Project[]>([]);
  const [draftCount, setDraftCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (isDemoMode) {
      setProjects(DEMO_PROJECTS as unknown as Project[]);
      // Check local draft
      try {
        const local = localStorage.getItem("brahma_project_wizard_draft_v2");
        setDraftCount(local ? 1 : 0);
      } catch {
        setDraftCount(0);
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;
      if (!data || data.length === 0) {
        setProjects(DEMO_PROJECTS as unknown as Project[]);
      } else {
        setProjects(data as Project[]);
      }

      // Query active draft count for current user
      const userRes = await authService.getUser();
      if (userRes.data?.id) {
        const { count } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("owner_id", userRes.data.id)
          .is("status", "draft")
          .not("draft_state", "is", null);

        let localCount = 0;
        try {
          if (localStorage.getItem("brahma_project_wizard_draft_v2")) localCount = 1;
        } catch {}

        setDraftCount(Math.max(count ?? 0, localCount));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("[useProjects] Fetch error, falling back to cached seed:", msg);
      setProjects(DEMO_PROJECTS as unknown as Project[]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (name: string, description: string) => {
    if (isDemoMode) {
      const newProj: Project = {
        id: `demo-${Date.now()}`,
        name,
        description,
        health_score: 95,
        status: "active",
        created_at: new Date().toISOString(),
      };
      setProjects((prev) => [newProj, ...prev]);
      return newProj;
    }

    const userRes = await authService.getUser();
    const user = userRes.data;
    const { data, error: err } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        owner_id: user?.id,
        health_score: 95,
        status: "active",
      })
      .select()
      .single();

    if (err) throw err;
    setProjects((prev) => [data as Project, ...prev]);
    return data as Project;
  };

  const deleteProject = async (id: string) => {
    if (isDemoMode) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    const { error: err } = await supabase.from("projects").delete().eq("id", id);
    if (err) throw err;
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    projects,
    draftCount,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    deleteProject,
  };
}

export function useProject(id: string) {
  const { projects, loading } = useProjects();
  const project = projects.find((p) => p.id === id) || projects[0] || null;
  return { project, loading };
}
