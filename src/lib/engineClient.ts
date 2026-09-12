/**
 * engineClient — typed client for communicating with the Python FastAPI Brahma Engine
 */

export interface ScanRequest {
  repo_url?: string;
  project_id: string;
  user_id?: string;
  branch?: string;
}

export interface ScanResponse {
  task_id: string;
  status: string;
  message: string;
}

export interface ScanStatusResult {
  complexity_avg: number;
  complexity_max: number;
  total_functions: number;
  total_lines: number;
  security_score: number;
  bandit_findings: Array<{
    test_id: string;
    test_name: string;
    severity: string;
    confidence: string;
    file: string;
    line: number;
    text: string;
  }>;
  files_analyzed: number;
}

export interface ScanStatusResponse {
  task_id: string;
  status: "PROCESSING" | "SUCCESS" | "FAILURE";
  result?: ScanStatusResult | null;
}

export interface GateRequest {
  project_id: string;
  analysis_task_id?: string;
  blueprint?: Record<string, unknown>;
  coverage_pct?: number;
  dependency_vulns?: number;
}

export interface GateReport {
  overall_pass: boolean;
  gates_passed: number;
  gates_total: number;
  pass_rate: number;
  blocking_gates: number[];
  summary: string;
  gate_results: Array<{
    gate_id: number;
    gate_name: string;
    passed: boolean;
    score: number;
    threshold: number;
    evidence: string;
    recommendation?: string | null;
  }>;
}

export interface BlueprintResponse {
  content: string;
  cached: boolean;
  cost: number;
  model: string;
  tokens: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface QueueStatusResponse {
  workers: Array<{
    id: string;
    name: string;
    status: string;
    active_tasks: number;
    completed_24h: number;
    concurrency: number;
    uptime_seconds: number;
  }>;
  active: Array<unknown>;
  pending_depth: number;
  failed_tasks: Array<unknown>;
  completed_count_24h: number;
  timestamp: string;
}

export interface DriftReportResponse {
  timestamp: string;
  total_tables: number;
  in_sync_count: number;
  drift_count: number;
  overall_status: string;
  tables: Array<{
    table: string;
    db_cols: number;
    pydantic_fields: number;
    ts_fields: number;
    status: "in_sync" | "drift_detected" | "warning";
    drift?: string | null;
  }>;
}

const getEngineUrl = (): string => {
  if (typeof import.meta !== "undefined" && import.meta.env?.["VITE_ENGINE_URL"]) {
    return import.meta.env["VITE_ENGINE_URL"];
  }
  return "http://localhost:8000";
};

async function engineFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${getEngineUrl()}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  // Inject Supabase token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("brahma-auth-token");
    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (parsed.access_token) {
          headers.set("Authorization", `Bearer ${parsed.access_token}`);
        }
      } catch {
        // ignore parse error
      }
    }
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorMsg = `Engine API error (${response.status})`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.detail || errJson.error || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json() as Promise<T>;
}

export const engineApi = {
  checkHealth: () => engineFetch<{ status: string; checks: Record<string, string> }>("/health"),

  triggerScan: (body: ScanRequest) =>
    engineFetch<ScanResponse>("/analysis/scan", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getScanStatus: (taskId: string) => engineFetch<ScanStatusResponse>(`/analysis/status/${taskId}`),

  runGate: (body: GateRequest) =>
    engineFetch<GateReport>("/analysis/gate", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  evaluateGate: (body: {
    project_id: string;
    complexity_avg?: number;
    security_score?: number;
    coverage_pct?: number;
    dependency_vulns?: number;
  }) =>
    engineFetch<GateReport>("/gate/evaluate", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  generateBlueprint: (body: { requirement: string; project_id?: string; user_id?: string }) =>
    engineFetch<BlueprintResponse>("/llm/generate", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getQueueStatus: () => engineFetch<QueueStatusResponse>("/admin/queue/status"),

  getSchemaDrift: () => engineFetch<DriftReportResponse>("/admin/schema/drift"),
};
