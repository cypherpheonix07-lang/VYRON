/**
 * PROJECT BRAHMA — AI WEBSITE GENERATION SYSTEM
 * Canonical Types for Blueprints, Design Systems, Tech Stacks, and Generations.
 */

export type WebsiteProjectStatus =
  | "configuring"
  | "generating"
  | "previewing"
  | "refining"
  | "exported"
  | "failed";

export type TypographyScale = "modern" | "editorial" | "technical" | "compact";
export type LayoutTemplate = "sidebar-topbar" | "topnav-only" | "minimal" | "split";

export interface DesignSystemTokens {
  presetName: string;
  colors: {
    primary: string;
    secondary: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    accent: string;
    textPrimary: string;
    textMuted: string;
  };
  typography: {
    fontFamily: string;
    baseSize: string;
    scaleRatio: string;
  };
  layout: {
    template: "sidebar-topbar" | "topnav-only" | "minimal";
    radius: string;
    spacing: string;
  };
}

export type DesignSystemConfig = DesignSystemTokens;

export interface FeatureToggles {
  auth: boolean;
  search: boolean;
  darkMode: boolean;
  payments: boolean;
  invoicing: boolean;
  cms: boolean;
  i18n: boolean;
  fileUploads: boolean;
  analytics: boolean;
  emailNotifications: boolean;
  pwa: boolean;
  [key: string]: boolean;
}

export interface TechStackOption {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database";
  score: number;
  pros: string[];
  cons: string[];
  synergyReasoning: string;
  recommended: boolean;
}

export interface TechStackComparison {
  useCase: string;
  frontendOptions: TechStackOption[];
  backendOptions: TechStackOption[];
  databaseOptions: TechStackOption[];
  recommendedCombo: {
    frontend: string;
    backend: string;
    database: string;
    rationale: string;
  };
}

export interface SelectedTechStack {
  frontend: string;
  backend: string;
  database: string;
  deployment?: string;
}

// ─── Frontend Blueprint ───────────────────────────────────────────────────────

export interface BlueprintComponent {
  id: string;
  name: string;
  type: "atom" | "molecule" | "organism" | "template";
  purpose: string;
  props: Array<{ name: string; type: string; required: boolean }>;
  usedInPages: string[];
}

export interface BlueprintPage {
  id: string;
  name: string;
  route: string;
  title: string;
  description: string;
  layout: string;
  components: string[];
  authRequired: boolean;
  rolesAllowed?: string[];
}

export interface FrontendBlueprint {
  appName: string;
  description: string;
  pages: BlueprintPage[];
  components: BlueprintComponent[];
  routes: Array<{ path: string; component: string; auth: boolean }>;
  layoutStructure: {
    type: LayoutTemplate;
    header: boolean;
    sidebar: boolean;
    footer: boolean;
  };
  stateManagement: {
    primary: string;
    stores: string[];
  };
}

// ─── Backend Blueprint ────────────────────────────────────────────────────────

export interface ApiRouteEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  handlerName: string;
  summary: string;
  authRequired: boolean;
  requestBodySchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
}

export interface SchemaTableColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  defaultValue?: string;
  references?: { table: string; column: string };
}

export interface SchemaTable {
  name: string;
  description: string;
  columns: SchemaTableColumn[];
  indexes: string[];
}

export interface BackendBlueprint {
  runtime: string;
  apiRoutes: ApiRouteEndpoint[];
  databaseSchema: {
    tables: SchemaTable[];
    relationships: Array<{ fromTable: string; fromCol: string; toTable: string; toCol: string }>;
  };
  sqlDdl: string;
  authModel: {
    provider: string;
    roles: string[];
    sessionStrategy: string;
  };
  storagePlan: {
    buckets: string[];
    maxUploadSizeBytes: number;
  };
  environmentVariables: Array<{ key: string; description: string; required: boolean; secret: boolean }>;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export type MockDataPayload = Record<string, Array<Record<string, unknown>>>;

// ─── Project Record ───────────────────────────────────────────────────────────

export interface WebsiteProject {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  requirements_text: string;
  design_system: DesignSystemConfig;
  tech_stack: SelectedTechStack;
  feature_toggles: FeatureToggles;
  frontend_blueprint: FrontendBlueprint | null;
  backend_blueprint: BackendBlueprint | null;
  tech_comparison: TechStackComparison | null;
  mock_data: MockDataPayload;
  status: WebsiteProjectStatus;
  generation_step: number;
  provenance_sha: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebsiteGenerationHistory {
  id: string;
  website_project_id: string;
  generation_number: number;
  trigger_type: "initial" | "refinement" | "tech_change" | "design_change";
  user_feedback: string | null;
  input_snapshot: Record<string, unknown>;
  output_snapshot: Record<string, unknown>;
  llm_metadata: Record<string, unknown>;
  created_at: string;
}
