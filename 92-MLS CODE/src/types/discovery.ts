/**
 * PROJECT BRAHMA — AI DISCOVERY PLATFORM
 * Core Domain Types for Discovery, Intent Understanding, Taxonomy, and Tool Health.
 */

export type PricingType = "free" | "freemium" | "paid" | "open_source";

export type VerificationLevel = "unverified" | "community" | "domain" | "editor" | "data";

export type ToolHealthStatus =
  "healthy" | "warning" | "degraded" | "critical" | "offline" | "active" | "unknown";

export interface AITool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url?: string;
  pricing_type: PricingType;
  starting_price_usd: number;
  verification_level: VerificationLevel;
  health_status: ToolHealthStatus;
  average_rating: number;
  review_count: number;
  save_count: number;
  last_verified_at: string;
  created_at: string;
  // Extended fields
  capabilities?: string[];
  modalities?: string[];
  platforms?: string[];
  has_api?: boolean;
  latency_ms?: number;
  http_status?: number;
  content_hash?: string;
  embedding?: number[];
  primary_task?: string;
  category?: string;
}

export interface AITask {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  parent_id?: string | null;
  intent_patterns: string[];
  popularity_score: number;
  keywords?: string[];
  synonyms?: string[];
  is_active?: boolean;
  created_at: string;
}

export interface AIToolTaskMapping {
  tool_id: string;
  task_id: string;
  is_primary: boolean;
}

export interface IntentDeconstruction {
  originalQuery: string;
  detectedIntent: string;
  primaryTask: string;
  category: string;
  detectedRequirements: string[];
  suggestedKeywords: string[];
  confidence: number;
}

export interface DiscoveryFilters {
  category?: string | undefined;
  task?: string | undefined;
  pricing?: PricingType | "all" | undefined;
  verification?: VerificationLevel | "all" | undefined;
  healthStatus?: ToolHealthStatus | "all" | undefined;
  modality?: string | undefined;
  hasApi?: boolean | undefined;
  minRating?: number | undefined;
  sortBy?: "relevance" | "rating" | "popular" | "newest" | "health" | undefined;
}

export interface ToolSearchResult {
  tool: AITool;
  relevanceScore: number;
  reasons: string[];
  taskMatchScore: number;
  healthScore: number;
}

export interface DiscoverySearchResponse {
  query: string;
  intent: IntentDeconstruction;
  matchedTasks: AITask[];
  results: ToolSearchResult[];
  totalCount: number;
  executionTimeMs: number;
  suggestedRefinements: string[];
  nearbyCategories: string[];
}

export interface ToolHealthCheckRecord {
  id: string;
  tool_id: string;
  checked_at: string;
  status: ToolHealthStatus;
  http_status: number;
  response_time_ms: number;
  final_url?: string | undefined;
  error_code?: string | null | undefined;
  error_message?: string | null | undefined;
  attempt_count: number;
  is_ssrf_safe?: boolean | undefined;
  is_live?: boolean | undefined;
}
