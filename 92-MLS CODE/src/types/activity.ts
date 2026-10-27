/**
 * PROJECT BRAHMA — ACTIVITY & WORKPULSE DOMAIN CONTRACT
 * Strictly typed schema for realtime activity telemetry and pulse indicators.
 */

export type ActivityEventType =
  | "gate_evaluation"
  | "scan_completion"
  | "publish_attempt"
  | "publish_override"
  | "report_export"
  | "member_invite"
  | "role_change"
  | "integration_connect"
  | "auth_anomaly";

export type ActivitySeverity = "info" | "low" | "medium" | "high" | "critical";

export interface ActivityEvent {
  id: string;
  project_id: string | null;
  project_name?: string;
  actor_id: string | null;
  actor_name: string;
  actor_avatar?: string;
  event_type: ActivityEventType;
  severity: ActivitySeverity;
  title: string;
  description: string | null;
  payload: Record<string, unknown>;
  provenance_sha?: string | null;
  created_at: string;
}

export interface ProjectPulse {
  project_id: string;
  project_name: string;
  health: number;
  velocity_24h: number;
  velocity_prev_24h: number;
  momentum: number; // positive = acceleration (▲), negative = deceleration (▼)
  gate_status: "pass" | "warning" | "blocked";
  open_critical: number;
  active_scans: number;
  last_event_at: string | null;
  sparkline_24h: number[];
  sparkline_7d: number[];
}

export interface WorkspacePulse {
  events_today: number;
  active_projects: number;
  blocked_gates: number;
  open_critical: number;
  token_rate: number;
  avg_health: number;
  top_risk_project: string;
  projects: Array<{
    id: string;
    name: string;
    health: number;
    status: string;
    created_at: string;
    pulse: ProjectPulse;
  }>;
  generated_at: string;
}

export type FeedMode = "stream" | "table" | "heatmap" | "pulse";
export type DensityMode = "comfortable" | "compact";

export interface ActivityFilterState {
  search?: string | undefined;
  eventType?: ActivityEventType | "all" | undefined;
  severity?: ActivitySeverity | "all" | undefined;
  projectId?: string | "all" | undefined;
  timeRange?: ("all" | "1h" | "24h" | "7d" | "30d") | undefined;
  mode?: FeedMode | undefined;
  density?: DensityMode | undefined;
}

export interface SavedViewPreset {
  id: string;
  name: string;
  filters: Omit<ActivityFilterState, "search">;
  createdAt: string;
}
