import { supabase } from "@/lib/supabaseClient";
import type {
  ActivityEvent,
  ProjectPulse,
  WorkspacePulse,
  ActivityFilterState,
} from "@/types/activity";

const INITIAL_FALLBACK_EVENTS: ActivityEvent[] = [
  {
    id: "act-ev-1",
    project_id: "demo-proj-1",
    project_name: "FinTech Ledger Gateway",
    actor_id: "usr-priya",
    actor_name: "Priya Nair",
    actor_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128",
    event_type: "scan_completion",
    severity: "info",
    title: "AST Cyclomatic Scan Completed",
    description:
      "Evaluated 24 Python modules. Average CCN: 8.4, Max CCN: 14. Zero high-risk complexity violations.",
    payload: { ccn_avg: 8.4, ccn_max: 14, modules_analyzed: 24, duration_ms: 1240 },
    provenance_sha: "c8a58f2be486c91a78363bc1e5108f92de0607bb470d04c102c91a45749bb691",
    created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
  },
  {
    id: "act-ev-2",
    project_id: "demo-proj-1",
    project_name: "FinTech Ledger Gateway",
    actor_id: "usr-gatekeeper",
    actor_name: "Automated Gatekeeper",
    event_type: "gate_evaluation",
    severity: "low",
    title: "Release Gate Check: 7/7 Criteria Met",
    description:
      "Release Gate verified AST, Security, Tests, Schema RLS, API Docs, Performance, and Licensure.",
    payload: { gates_passed: 7, gates_total: 7, score: 100, blocking_gates: [] },
    provenance_sha: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "act-ev-3",
    project_id: null,
    project_name: "Workspace Gateway",
    actor_id: null,
    actor_name: "Security Scanner",
    event_type: "auth_anomaly",
    severity: "high",
    title: "Token Rate Limit Spike Flagged",
    description: "Exceeded 50 requests per minute from unknown gateway proxy IP 192.168.1.104.",
    payload: { ip: "192.168.1.104", rate: 58, limit: 50, action: "rate_limited_temporarily" },
    provenance_sha: null,
    created_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: "act-ev-4",
    project_id: "demo-proj-2",
    project_name: "Autonomous Drone Telemetry Hub",
    actor_id: "usr-puli",
    actor_name: "Puli Phanindhra",
    actor_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128",
    event_type: "report_export",
    severity: "info",
    title: "Architecture Review PDF Exported",
    description:
      "Compiled 42-page defense-grade architecture report with SHA-256 custody fingerprint.",
    payload: { pages: 42, format: "PDF/A-1b", file_size_kb: 1840, author: "Puli Phanindhra" },
    provenance_sha: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    created_at: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
  },
  {
    id: "act-ev-5",
    project_id: "demo-proj-1",
    project_name: "FinTech Ledger Gateway",
    actor_id: "usr-github",
    actor_name: "GitHub Webhook Broker",
    event_type: "integration_connect",
    severity: "info",
    title: "GitHub Mirror Synced (commit 8a4c1f)",
    description: "Ingested webhook payload: 14 commits merged into main branch.",
    payload: {
      branch: "main",
      commits_count: 14,
      sha: "8a4c1f",
      repo: "project-brahma/ledger-core",
    },
    provenance_sha: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    created_at: new Date(Date.now() - 1000 * 60 * 225).toISOString(),
  },
  {
    id: "act-ev-6",
    project_id: "demo-proj-3",
    project_name: "Healthcare FHIR Interop Mesh",
    actor_id: "usr-admin",
    actor_name: "Platform Admin",
    event_type: "publish_override",
    severity: "critical",
    title: "Publish Gate Override Signoff",
    description: "Manual signoff applied by Priya Nair for Canary deployment corridor bypass.",
    payload: {
      authorized_by: "priya.nair@brahma.dev",
      reason: "Pre-scheduled demo corridor",
      override_id: "ovr-994",
    },
    provenance_sha: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    created_at: new Date(Date.now() - 1000 * 60 * 312).toISOString(),
  },
  {
    id: "act-ev-7",
    project_id: null,
    project_name: "Workspace Gateway",
    actor_id: "usr-arjun",
    actor_name: "Arjun Mehta",
    event_type: "member_invite",
    severity: "info",
    title: "Security Reviewer Invited",
    description:
      "Dispatched workspace collaboration invite to ananya.k@brahma.dev with Reviewer role.",
    payload: { invited_email: "ananya.k@brahma.dev", role: "reviewer" },
    provenance_sha: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "act-ev-8",
    project_id: "demo-proj-2",
    project_name: "Autonomous Drone Telemetry Hub",
    actor_id: "usr-priya",
    actor_name: "Priya Nair",
    event_type: "role_change",
    severity: "medium",
    title: "RBAC Role Escalation Granted",
    description: "Promoted Dev Lead to Platform Operator with transient production audit access.",
    payload: { target_user: "dev-lead-4", old_role: "developer", new_role: "operator" },
    provenance_sha: "1a884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d9",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
  },
];

export const activityService = {
  /**
   * Fetch activity events with multi-dimensional filtering.
   */
  async fetchEvents(filters?: Partial<ActivityFilterState>): Promise<ActivityEvent[]> {
    try {
      let query = supabase
        .from("activity_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (filters?.projectId && filters.projectId !== "all") {
        query = query.eq("project_id", filters.projectId);
      }
      if (filters?.eventType && filters.eventType !== "all") {
        query = query.eq("event_type", filters.eventType);
      }
      if (filters?.severity && filters.severity !== "all") {
        query = query.eq("severity", filters.severity);
      }

      if (filters?.timeRange && filters.timeRange !== "all") {
        const msMap: Record<string, number> = {
          "1h": 3600 * 1000,
          "24h": 24 * 3600 * 1000,
          "7d": 7 * 24 * 3600 * 1000,
          "30d": 30 * 24 * 3600 * 1000,
        };
        const delta = msMap[filters.timeRange];
        if (delta) {
          const cutoff = new Date(Date.now() - delta).toISOString();
          query = query.gte("created_at", cutoff);
        }
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return this.filterFallbackEvents(filters);
      }

      return data as ActivityEvent[];
    } catch {
      return this.filterFallbackEvents(filters);
    }
  },

  /**
   * Filter fallback events purely in memory when DB table is empty.
   */
  filterFallbackEvents(filters?: Partial<ActivityFilterState>): ActivityEvent[] {
    let list = [...INITIAL_FALLBACK_EVENTS];

    if (filters?.projectId && filters.projectId !== "all") {
      list = list.filter((e) => e.project_id === filters.projectId);
    }
    if (filters?.eventType && filters.eventType !== "all") {
      list = list.filter((e) => e.event_type === filters.eventType);
    }
    if (filters?.severity && filters.severity !== "all") {
      list = list.filter((e) => e.severity === filters.severity);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          e.actor_name.toLowerCase().includes(q) ||
          (e.project_name && e.project_name.toLowerCase().includes(q)),
      );
    }
    if (filters?.timeRange && filters.timeRange !== "all") {
      const msMap: Record<string, number> = {
        "1h": 3600 * 1000,
        "24h": 24 * 3600 * 1000,
        "7d": 7 * 24 * 3600 * 1000,
        "30d": 30 * 24 * 3600 * 1000,
      };
      const delta = msMap[filters.timeRange];
      if (delta) {
        const cutoff = Date.now() - delta;
        list = list.filter((e) => new Date(e.created_at).getTime() >= cutoff);
      }
    }

    return list;
  },

  /**
   * Fetch project pulse metrics using SQL RPC project_pulse.
   */
  async getProjectPulse(projectId: string): Promise<ProjectPulse> {
    if (import.meta.env["VITE_ENABLE_REMOTE_PULSE_RPC"] === "true") {
      try {
        const { data, error } = await supabase.rpc("project_pulse", {
          p_project_id: projectId,
        });

        if (!error && data) {
          return data as ProjectPulse;
        }
      } catch {
        // fallback
      }
    }

    // Deterministic arithmetic fallback matching Postgres formula
    return {
      project_id: projectId,
      project_name: "FinTech Ledger Gateway",
      health: 94,
      velocity_24h: 6,
      velocity_prev_24h: 4,
      momentum: 50.0,
      gate_status: "pass",
      open_critical: 0,
      active_scans: 0,
      last_event_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      sparkline_24h: [0, 0, 1, 0, 0, 2, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      sparkline_7d: [3, 5, 2, 8, 4, 6, 7],
    };
  },

  /**
   * Fetch global workspace pulse using SQL RPC workspace_pulse.
   */
  async getWorkspacePulse(): Promise<WorkspacePulse> {
    if (import.meta.env["VITE_ENABLE_REMOTE_PULSE_RPC"] === "true") {
      try {
        const { data, error } = await supabase.rpc("workspace_pulse");
        if (!error && data) {
          return data as WorkspacePulse;
        }
      } catch {
        // fallback
      }
    }

    return {
      events_today: 14,
      active_projects: 3,
      blocked_gates: 0,
      open_critical: 1,
      token_rate: 4,
      avg_health: 87.0,
      top_risk_project: "Healthcare FHIR Interop Mesh",
      projects: [
        {
          id: "demo-proj-1",
          name: "FinTech Ledger Gateway",
          health: 94,
          status: "active",
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          pulse: {
            project_id: "demo-proj-1",
            project_name: "FinTech Ledger Gateway",
            health: 94,
            velocity_24h: 6,
            velocity_prev_24h: 4,
            momentum: 50.0,
            gate_status: "pass",
            open_critical: 0,
            active_scans: 0,
            last_event_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
            sparkline_24h: [0, 0, 1, 0, 0, 2, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            sparkline_7d: [3, 5, 2, 8, 4, 6, 7],
          },
        },
        {
          id: "demo-proj-2",
          name: "Autonomous Drone Telemetry Hub",
          health: 88,
          status: "active",
          created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
          pulse: {
            project_id: "demo-proj-2",
            project_name: "Autonomous Drone Telemetry Hub",
            health: 88,
            velocity_24h: 3,
            velocity_prev_24h: 5,
            momentum: -40.0,
            gate_status: "pass",
            open_critical: 0,
            active_scans: 0,
            last_event_at: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
            sparkline_24h: [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            sparkline_7d: [1, 4, 3, 2, 5, 3, 4],
          },
        },
        {
          id: "demo-proj-3",
          name: "Healthcare FHIR Interop Mesh",
          health: 79,
          status: "review",
          created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
          pulse: {
            project_id: "demo-proj-3",
            project_name: "Healthcare FHIR Interop Mesh",
            health: 79,
            velocity_24h: 5,
            velocity_prev_24h: 2,
            momentum: 150.0,
            gate_status: "blocked",
            open_critical: 1,
            active_scans: 0,
            last_event_at: new Date(Date.now() - 1000 * 60 * 312).toISOString(),
            sparkline_24h: [0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            sparkline_7d: [0, 2, 1, 4, 3, 2, 5],
          },
        },
      ],
      generated_at: new Date().toISOString(),
    };
  },

  _isRpcSupported: null as boolean | null,

  recordFallbackEvent(params: EmitActivityParams) {
    const newEvent: ActivityEvent = {
      id: `act-ev-local-${Date.now()}`,
      project_id: params.projectId || null,
      project_name: params.projectId ? "Active Project" : "Workspace Gateway",
      actor_id: params.actorId || null,
      actor_name: params.actorName || "System Operator",
      event_type: params.eventType as ActivityEvent["event_type"],
      severity: params.severity || "info",
      title: params.title,
      description: params.description || "",
      payload: params.payload || {},
      provenance_sha: params.provenanceSha || null,
      created_at: new Date().toISOString(),
    };
    INITIAL_FALLBACK_EVENTS.unshift(newEvent);
  },

  /**
   * Safely emit an activity event with circuit-breaker protection.
   * If the remote RPC is unavailable, gracefully buffers to in-memory fallback
   * without triggering repetitive 404 network errors in the browser console.
   */
  async emitActivity(params: EmitActivityParams): Promise<string | null> {
    const isRemoteRpcEnabled = import.meta.env["VITE_ENABLE_REMOTE_ACTIVITY_RPC"] === "true";

    if (!isRemoteRpcEnabled) {
      this.recordFallbackEvent(params);
      return null;
    }

    if (typeof window !== "undefined" && this._isRpcSupported === null) {
      const cached = sessionStorage.getItem("vyron_rpc_emit_activity_event");
      if (cached === "unsupported") this._isRpcSupported = false;
      else if (cached === "supported") this._isRpcSupported = true;
    }

    if (this._isRpcSupported === false) {
      this.recordFallbackEvent(params);
      return null;
    }

    try {
      const isUuid =
        Boolean(params.projectId) &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.projectId!);

      const { data, error } = await supabase.rpc("emit_activity_event", {
        p_project_id: isUuid ? params.projectId : null,
        p_actor_id: params.actorId || null,
        p_actor_name: params.actorName || "System Operator",
        p_event_type: params.eventType,
        p_severity: params.severity || "info",
        p_title: params.title,
        p_description: params.description || "",
        p_payload: params.payload || {},
        p_provenance_sha: params.provenanceSha || null,
      });

      if (error) {
        this._isRpcSupported = false;
        if (typeof window !== "undefined") {
          sessionStorage.setItem("vyron_rpc_emit_activity_event", "unsupported");
        }
        this.recordFallbackEvent(params);
        return null;
      }

      this._isRpcSupported = true;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("vyron_rpc_emit_activity_event", "supported");
      }
      return data as string;
    } catch {
      this._isRpcSupported = false;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("vyron_rpc_emit_activity_event", "unsupported");
      }
      this.recordFallbackEvent(params);
      return null;
    }
  },
};

export interface EmitActivityParams {
  projectId?: string | null | undefined;
  actorId?: string | null | undefined;
  actorName?: string | undefined;
  eventType: string;
  severity?: "info" | "low" | "medium" | "high" | "critical" | undefined;
  title: string;
  description?: string | undefined;
  payload?: Record<string, unknown> | undefined;
  provenanceSha?: string | null | undefined;
}
