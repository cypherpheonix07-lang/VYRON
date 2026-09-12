import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface FrontendGenRequest {
  project_id?: string;
  requirements_text?: string;
  design_system?: any;
  tech_stack?: any;
  feature_toggles?: Record<string, boolean>;
}

function synthesizeFrontendBlueprint(
  requirements: string = "",
  designSystem: any = {},
  features: Record<string, boolean> = {}
) {
  const isEcommerce = requirements.toLowerCase().includes("store") || requirements.toLowerCase().includes("commerce") || features.payments;
  const isSaas = requirements.toLowerCase().includes("saas") || requirements.toLowerCase().includes("b2b") || features.analytics;

  const appName = isEcommerce ? "OmniCommerce Hub" : isSaas ? "Nexus Intelligence Studio" : "Apex Digital Portal";
  const appDesc = requirements.slice(0, 160) || "Autonomous intelligent cloud application interface.";

  const pages = [
    {
      id: "page-home",
      name: isEcommerce ? "Storefront Catalog" : "Executive Dashboard",
      route: "/",
      title: isEcommerce ? "Explore Products" : "Overview & Telemetry",
      description: "Primary landing interface presenting summary metrics and quick navigation.",
      layout: "sidebar-topbar",
      components: ["comp-hero-banner", "comp-metric-card", "comp-quick-filter", "comp-activity-feed"],
      authRequired: false,
    },
    {
      id: "page-catalog",
      name: isEcommerce ? "Product Details & Checkout" : "Resource Explorer",
      route: isEcommerce ? "/products" : "/resources",
      title: isEcommerce ? "Catalog & Inventory" : "Data Explorer",
      description: "Faceted search grid with pagination, sorting filters, and batch selection.",
      layout: "sidebar-topbar",
      components: ["comp-data-table", "comp-search-bar", "comp-pagination", "comp-filter-drawer"],
      authRequired: false,
    },
    {
      id: "page-analytics",
      name: "Analytics & Reports",
      route: "/analytics",
      title: "Realtime Performance Telemetry",
      description: "Interactive chart visualization of conversion funnels, throughput, and system health.",
      layout: "sidebar-topbar",
      components: ["comp-metric-card", "comp-chart-widget", "comp-date-range-picker", "comp-export-trigger"],
      authRequired: true,
      rolesAllowed: ["admin", "analyst"],
    },
    {
      id: "page-settings",
      name: "Settings & Integrations",
      route: "/settings",
      title: "System Configuration",
      description: "Manage organization workspace, API keys, webhooks, and team roles.",
      layout: "sidebar-topbar",
      components: ["comp-form-builder", "comp-toggle-switch", "comp-api-key-manager", "comp-audit-viewer"],
      authRequired: true,
      rolesAllowed: ["admin"],
    },
    {
      id: "page-profile",
      name: "User Account & Security",
      route: "/profile",
      title: "Personal Profile & Credentials",
      description: "Update personal preferences, notification alerts, and active login sessions.",
      layout: "topnav-only",
      components: ["comp-avatar-uploader", "comp-form-builder", "comp-session-list"],
      authRequired: true,
    },
  ];

  const components = [
    {
      id: "comp-hero-banner",
      name: "HeroBanner",
      type: "organism" as const,
      purpose: "Renders branded focal header with call-to-action buttons and live telemetry badges.",
      props: [
        { name: "headline", type: "string", required: true },
        { name: "subheading", type: "string", required: false },
        { name: "ctaText", type: "string", required: true },
        { name: "onCtaClick", type: "() => void", required: false },
      ],
      usedInPages: ["page-home"],
    },
    {
      id: "comp-metric-card",
      name: "MetricKpiCard",
      type: "molecule" as const,
      purpose: "Displays numeric KPI indicator with trend delta and mini sparkline chart.",
      props: [
        { name: "label", type: "string", required: true },
        { name: "value", type: "string | number", required: true },
        { name: "changePercent", type: "number", required: false },
        { name: "trend", type: "'up' | 'down' | 'neutral'", required: false },
      ],
      usedInPages: ["page-home", "page-analytics"],
    },
    {
      id: "comp-search-bar",
      name: "FacetedSearchBar",
      type: "molecule" as const,
      purpose: "Debounced omni-search input with keyword tag chips and query auto-suggest.",
      props: [
        { name: "query", type: "string", required: true },
        { name: "onSearch", type: "(term: string) => void", required: true },
        { name: "placeholder", type: "string", required: false },
      ],
      usedInPages: ["page-catalog", "page-home"],
    },
    {
      id: "comp-data-table",
      name: "VirtualDataTable",
      type: "organism" as const,
      purpose: "High-density data grid with multi-column sorting, column resizing, and row selections.",
      props: [
        { name: "columns", type: "Array<ColumnDef>", required: true },
        { name: "data", type: "Array<Record<string, any>>", required: true },
        { name: "onRowClick", type: "(row: any) => void", required: false },
      ],
      usedInPages: ["page-catalog"],
    },
    {
      id: "comp-chart-widget",
      name: "TimeseriesChartWidget",
      type: "organism" as const,
      purpose: "Responsive area and bar visualization tracking performance over selectable periods.",
      props: [
        { name: "series", type: "Array<{ name: string; data: number[] }>", required: true },
        { name: "categories", type: "string[]", required: true },
        { name: "colorScheme", type: "string", required: false },
      ],
      usedInPages: ["page-analytics"],
    },
    {
      id: "comp-filter-drawer",
      name: "FilterDrawer",
      type: "molecule" as const,
      purpose: "Slide-over sidebar containing categorized multi-select checkboxes and range sliders.",
      props: [
        { name: "isOpen", type: "boolean", required: true },
        { name: "onClose", type: "() => void", required: true },
        { name: "onApplyFilters", type: "(filters: any) => void", required: true },
      ],
      usedInPages: ["page-catalog"],
    },
    {
      id: "comp-activity-feed",
      name: "LiveActivityFeed",
      type: "molecule" as const,
      purpose: "Real-time scrolling event log displaying system actions, user edits, and alerts.",
      props: [
        { name: "events", type: "Array<AuditEvent>", required: true },
        { name: "maxItems", type: "number", required: false },
      ],
      usedInPages: ["page-home"],
    },
    {
      id: "comp-api-key-manager",
      name: "ApiKeyManager",
      type: "organism" as const,
      purpose: "Secure token generation, revocation, and scope assignment interface.",
      props: [
        { name: "keys", type: "Array<ApiKeyRecord>", required: true },
        { name: "onGenerate", type: "() => void", required: true },
        { name: "onRevoke", type: "(keyId: string) => void", required: true },
      ],
      usedInPages: ["page-settings"],
    },
    {
      id: "comp-pagination",
      name: "SmartPagination",
      type: "atom" as const,
      purpose: "Accessible pagination bar with page size selector and jump-to-page input.",
      props: [
        { name: "currentPage", type: "number", required: true },
        { name: "totalPages", type: "number", required: true },
        { name: "onPageChange", type: "(page: number) => void", required: true },
      ],
      usedInPages: ["page-catalog"],
    },
    {
      id: "comp-form-builder",
      name: "DynamicFormBuilder",
      type: "organism" as const,
      purpose: "Validates and renders structured form inputs according to JSON schema definitions.",
      props: [
        { name: "schema", type: "Record<string, any>", required: true },
        { name: "onSubmit", type: "(values: any) => void", required: true },
      ],
      usedInPages: ["page-settings", "page-profile"],
    },
    {
      id: "comp-avatar-uploader",
      name: "AvatarUploader",
      type: "atom" as const,
      purpose: "Image crop, compression, and direct S3/Supabase storage upload button.",
      props: [
        { name: "currentUrl", type: "string", required: false },
        { name: "onUploadComplete", type: "(url: string) => void", required: true },
      ],
      usedInPages: ["page-profile"],
    },
  ];

  const routes = pages.map((p) => ({
    path: p.route,
    component: p.name.replace(/\s+/g, "") + "Page",
    auth: p.authRequired,
  }));

  return {
    appName,
    description: appDesc,
    pages,
    components,
    routes,
    layoutStructure: {
      type: designSystem.layoutTemplate || "sidebar-topbar",
      header: true,
      sidebar: true,
      footer: true,
    },
    stateManagement: {
      primary: "TanStack Query v5 + Zustand",
      stores: ["useAuthStore", "useCartOrInventoryStore", "usePreferencesStore"],
    },
  };
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const body: FrontendGenRequest = await req.json().catch(() => ({}));
      const blueprint = synthesizeFrontendBlueprint(
        body.requirements_text,
        body.design_system,
        body.feature_toggles
      );

      // Persist to website_projects if project_id is provided
      if (ctx.supabase && body.project_id) {
        await ctx.supabase
          .from("website_projects")
          .update({
            frontend_blueprint: blueprint,
            generation_step: 2,
            updated_at: new Date().toISOString(),
          })
          .eq("id", body.project_id);

        // Record history
        await ctx.supabase.from("website_generations").insert({
          website_project_id: body.project_id,
          generation_number: 1,
          trigger_type: "initial",
          user_feedback: "Initial frontend blueprint generation",
          input_snapshot: {
            requirements_text: body.requirements_text,
            design_system: body.design_system,
            feature_toggles: body.feature_toggles,
          },
          output_snapshot: { frontend_blueprint: blueprint },
          llm_metadata: { generator: "brahma-frontend-engine-v1" },
        });
      }

      return new Response(
        JSON.stringify({
          ok: true,
          blueprint,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (err: any) {
      console.error("[website-generate-frontend] Error:", err);
      const fallback = synthesizeFrontendBlueprint();
      return new Response(
        JSON.stringify({
          ok: true,
          fallback_used: true,
          blueprint: fallback,
          error: err?.message,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }),
};
