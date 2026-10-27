import type { SupabaseClient } from "@supabase/supabase-js";

export interface LiveProjectRecord {
  id: string;
  name: string;
  description: string | null;
  status: string;
  health_score: number | null;
  updated_at: string;
}

export interface RepositoryBinding {
  id: string;
  repo_full_name: string;
  sync_status: string;
  last_synced_at: string | null;
}

export interface LiveOverview {
  project: LiveProjectRecord;
  repositories: RepositoryBinding[] | null;
  requirementCount: number | null;
  warnings: string[];
  fetchedAt: string;
}

// Reads only existing schema fields. RLS, not a UI filter, must enforce access.
// No demo fallback and no fabricated score calculations.
export async function fetchLiveOverview(
  client: SupabaseClient,
  projectId: string,
): Promise<LiveOverview | null> {
  const { data: auth, error: authError } = await client.auth.getUser();
  if (authError || !auth.user) throw new Error("Sign in to load this project's database records.");

  const { data: project, error } = await client
    .from("projects")
    .select("id,name,description,status,health_score,updated_at")
    .eq("id", projectId)
    .maybeSingle();
  if (error) throw new Error(`Project could not be loaded (${error.code}). Check database configuration and access policies.`);
  if (!project) return null; // Do not distinguish inaccessible from nonexistent projects.

  const [repos, requirements] = await Promise.all([
    client.from("project_repos")
      // Never fetch webhook_secret or account credentials into an overview/export.
      .select("id,repo_full_name,sync_status,last_synced_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    client.from("requirements").select("id", { count: "exact", head: true })
      .eq("project_id", projectId),
  ]);
  const warnings: string[] = [];
  if (repos.error) warnings.push(`Repository bindings unavailable (${repos.error.code}).`);
  if (requirements.error) warnings.push(`Requirement count unavailable (${requirements.error.code}).`);

  return {
    project: project as LiveProjectRecord,
    repositories: repos.error ? null : (repos.data as RepositoryBinding[]),
    requirementCount: requirements.error ? null : requirements.count,
    warnings,
    fetchedAt: new Date().toISOString(),
  };
}
