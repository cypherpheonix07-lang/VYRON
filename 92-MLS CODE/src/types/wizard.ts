/**
 * PROJECT BRAHMA — NEW PROJECT GENERATOR V2 (ENHANCED CONTRACT EDITION)
 * Core Type Definitions & Entity Interfaces
 */

export type ScaleType = "prototype" | "production" | "enterprise";
export type PlatformType = "web" | "mobile" | "api" | "desktop";
export type StackType = "ai-decides" | "react-fastapi" | "next-serverless" | "custom";
export type GateStrictness = "advisory" | "standard" | "strict";
export type CompliancePack = "none" | "soc2" | "hipaa" | "fda" | "do178c";
export type RetentionPeriod = "90d" | "1y" | "7y";
export type DeliveryCadence = "weekly" | "biweekly" | "monthly";

/**
 * 0.2: TargetUser contract
 */
export interface TargetUser {
  label: string;
  slug?: string | undefined;
  custom: boolean;
  priority: number;
}

/**
 * 0.2: Feature toggles & AI tasks contracts
 */
export type FeatureToggles = Record<string, boolean>;
export type AiTasks = Record<string, boolean>;

/**
 * 0.2: KpiTargets contract
 */
export interface KpiTargets {
  health_min: number;
  coverage_min: number;
  max_critical: number;
}

/**
 * 0.2: Complete unified WizardPayload matching Steps 1–7
 */
export interface WizardPayload {
  // Step 1: Identity
  name: string;
  slug: string;
  description: string;
  tags: string[];
  icon: string;
  cover: string;

  // Step 2: Domain & Scale
  domain: string;
  domain_secondary: string[];
  scale: ScaleType;

  // Step 3: Audience & Target Users
  target_users: TargetUser[];
  accessibility: boolean;

  // Step 4: Tech Stack
  platforms: PlatformType[];
  stack: StackType;
  repo_full_name: string | null;
  complexity_budget: number;

  // Step 5: Feature Catalog & AI Tasks
  feature_toggles: FeatureToggles;
  ai_tasks: AiTasks;

  // Step 6: Governance, Strictness & Compliance
  gate_strictness: GateStrictness;
  compliance_pack: CompliancePack;
  allow_override: boolean;
  retention: RetentionPeriod;

  // Step 7: Delivery KPIs, Budget & Schedule
  kpi_targets: KpiTargets;
  budget_cap_usd: number;
  milestone: string | null;
  cadence: DeliveryCadence;
}

/**
 * 0.2: DraftState contract (version: 2)
 */
export interface DraftState {
  step: number;
  payload: WizardPayload;
  saved_at: string;
  version: 2;
}

/**
 * Catalog Entities from Supabase
 */
export interface ProjectDomain {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string | null;
  default_features: string[];
  compliance_pack: string | null;
  sort_order: number;
  active: boolean;
}

export interface ProjectPersona {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  category: string;
  default_priority: number;
  icon: string;
  active: boolean;
}

export interface LlmRoutingEntry {
  task: string;
  task_name: string;
  avg_tokens: number;
  provider: string;
  model: string;
  price_per_1k: number;
  chain: Array<{
    provider: string;
    model: string;
    price_per_1k: number;
  }>;
  cache_ttl_h: number;
  active: boolean;
}

export interface ProjectTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  domains: string[];
  modules: string[];
  recommended_stack: StackType;
  feature_toggles: FeatureToggles;
  active: boolean;
}
