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

  let reposResult: { data: RepositoryBinding[] | null; error: { code: string; message: string } | null } = { data: null, error: null };
  try {
    const res = await client
      .from("project_repos")
      // Never fetch webhook_secret or account credentials into an overview/export.
      .select("id,repo_full_name,sync_status,last_synced_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    reposResult = res as typeof reposResult;
  } catch (err: unknown) {
    reposResult = { data: null, error: { code: "FETCH_ERROR", message: err instanceof Error ? err.message : String(err) } };
  }

  let reqsResult: { count: number | null; error: { code: string; message: string } | null } = { count: null, error: null };
  try {
    const res = await client
      .from("requirements")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId);
    reqsResult = res as typeof reqsResult;
  } catch (err: unknown) {
    reqsResult = { count: null, error: { code: "FETCH_ERROR", message: err instanceof Error ? err.message : String(err) } };
  }

  const warnings: string[] = [];
  if (reposResult.error) {
    warnings.push(`Repository bindings unavailable (${reposResult.error.code}).`);
  }
  if (reqsResult.error) {
    if (reqsResult.error.code === "PGRST205" || reqsResult.error.code === "42P01") {
      warnings.push("Requirements schema table is not provisioned in database.");
    } else {
      warnings.push(`Requirement count unavailable (${reqsResult.error.code}).`);
    }
  }

  return {
    project: project as LiveProjectRecord,
    repositories: reposResult.error ? null : (reposResult.data as RepositoryBinding[]),
    requirementCount: reqsResult.error ? null : reqsResult.count,
    warnings,
    fetchedAt: new Date().toISOString(),
  };
}
