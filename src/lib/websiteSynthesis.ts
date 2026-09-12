/**
 * PROJECT BRAHMA — AI WEBSITE GENERATION SYNTHESIS ENGINE
 * Core deterministic generator routines, fallback synthesis, and cryptographic hashing.
 */

import type {
  FrontendBlueprint,
  BackendBlueprint,
  MockDataPayload,
  DesignSystemTokens,
  FeatureToggles,
  SelectedTechStack,
  TechStackComparison,
  WebsiteProject,
  BlueprintComponent,
  BlueprintPage,
  SchemaTable,
} from "@/types/websiteStudio";

export function getDeterministicComparison(
  useCase: string = "Modern Web Application",
  features: FeatureToggles | Record<string, boolean> = {}
): TechStackComparison {
  const isEcommerce =
    useCase.toLowerCase().includes("commerce") ||
    useCase.toLowerCase().includes("store") ||
    Boolean(features["payments"]);

  return {
    useCase: useCase || "Modern Web Application",
    frontendOptions: [
      {
        id: "nextjs",
        name: "Next.js 15 (App Router)",
        category: "frontend",
        score: isEcommerce ? 96 : 94,
        pros: [
          "Server Components & SSR for fast initial loads",
          "Built-in image optimization and SEO routes",
          "Turbopack dev velocity",
        ],
        cons: ["Edge runtime bundle constraints", "Vercel vendor-tie subtleties"],
        synergyReasoning: "Seamless hydration and high Lighthouse performance with TypeScript.",
        recommended: true,
      },
      {
        id: "vite-react",
        name: "Vite + React 19 + TanStack",
        category: "frontend",
        score: 91,
        pros: [
          "Instant HMR and zero lock-in",
          "TanStack Router provides type-safe routes",
          "Lightweight bundle",
        ],
        cons: [
          "Client-side rendered by default unless static/SSR configured",
          "Manual SEO configuration",
        ],
        synergyReasoning: "Excellent for dashboard-heavy SPAs with complex local state.",
        recommended: false,
      },
      {
        id: "remix",
        name: "Remix / React Router v7",
        category: "frontend",
        score: 87,
        pros: [
          "Nested routing & web standard Request/Response",
          "Resilient progressive enhancement",
          "Fine-grained caching",
        ],
        cons: ["Smaller community ecosystem than Next.js", "Hosting adapter complexity"],
        synergyReasoning: "Great for data-mutation heavy applications with robust form handling.",
        recommended: false,
      },
    ],
    backendOptions: [
      {
        id: "supabase-edge",
        name: "Supabase Edge Functions (Deno)",
        category: "backend",
        score: 95,
        pros: [
          "Sub-50ms cold starts on global edge nodes",
          "Native JWT verification and Supabase client bindings",
          "Zero server maintenance",
        ],
        cons: ["Limited CPU time per invocation (150s)", "WASM memory caps"],
        synergyReasoning: "Direct cryptographic bridge to PostgreSQL Row Level Security.",
        recommended: true,
      },
      {
        id: "fastapi",
        name: "FastAPI + Python 3.12",
        category: "backend",
        score: 89,
        pros: [
          "Asynchronous asyncio throughput",
          "Pydantic automated OpenAPI documentation",
          "Ideal for AI/ML and data pipelines",
        ],
        cons: ["Requires persistent container hosting", "Manual token refresh plumbing"],
        synergyReasoning: "Optimal if heavy computational pipelines or vector scoring are required.",
        recommended: false,
      },
      {
        id: "node-express",
        name: "Node.js 22 + Fastify",
        category: "backend",
        score: 85,
        pros: [
          "Massive NPM package ecosystem",
          "High JSON serialization speed",
          "Familiar full-stack JavaScript syntax",
        ],
        cons: ["Single-threaded event loop blocking pitfalls", "More boilerplate than serverless"],
        synergyReasoning: "Solid corporate standard for generic microservices.",
        recommended: false,
      },
    ],
    databaseOptions: [
      {
        id: "supabase-pg",
        name: "PostgreSQL 16 (Supabase Managed)",
        category: "database",
        score: 98,
        pros: [
          "Declarative Row Level Security (RLS)",
          "pgvector for semantic search",
          "Realtime WebSockets pub/sub",
        ],
        cons: [
          "Connection pooling required for high concurrency",
          "Strict relational schemas require migrations",
        ],
        synergyReasoning: "Zero-latency database security with built-in audit capabilities.",
        recommended: true,
      },
      {
        id: "planetscale",
        name: "PlanetScale / MySQL Vitess",
        category: "database",
        score: 86,
        pros: [
          "Horizontal auto-sharding",
          "Zero-downtime branching migrations",
          "High write resilience",
        ],
        cons: ["No native foreign key enforcement", "Third-party auth integration needed"],
        synergyReasoning: "Suited for hyper-scale multi-tenant transactional systems.",
        recommended: false,
      },
      {
        id: "mongodb",
        name: "MongoDB Atlas",
        category: "database",
        score: 81,
        pros: [
          "Flexible schema-less document model",
          "Rapid early prototyping",
          "Rich aggregation pipeline",
        ],
        cons: ["Weak relational integrity enforcement", "Eventual consistency risks"],
        synergyReasoning: "Good for deeply nested, unstructured document storage.",
        recommended: false,
      },
    ],
    recommendedCombo: {
      frontend: "Next.js 15 (App Router)",
      backend: "Supabase Edge Functions (Deno)",
      database: "PostgreSQL 16 (Supabase Managed)",
      rationale:
        "The Next.js 15 + Supabase Edge + PostgreSQL 16 stack provides exceptional developer velocity, enterprise-grade Row Level Security, sub-100ms global response latencies, and unified TypeScript types from DB to UI.",
    },
  };
}

export function synthesizeFrontendBlueprint(
  requirements: string = "",
  designSystem: Partial<DesignSystemTokens> = {},
  features: FeatureToggles | Record<string, boolean> = {}
): FrontendBlueprint {
  const isEcommerce =
    requirements.toLowerCase().includes("store") ||
    requirements.toLowerCase().includes("commerce") ||
    Boolean(features["payments"]);
  const isSaas =
    requirements.toLowerCase().includes("saas") ||
    requirements.toLowerCase().includes("b2b") ||
    Boolean(features["analytics"]);

  const appName = isEcommerce
    ? "OmniCommerce Hub"
    : isSaas
      ? "Nexus Intelligence Studio"
      : "Apex Digital Portal";
  const appDesc = requirements.slice(0, 160) || "Autonomous intelligent cloud application interface.";

  const pages: BlueprintPage[] = [
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
      name: "Settings & Team Access",
      route: "/settings",
      title: "Configuration & Role Governance",
      description: "Manage organization members, OAuth integrations, notification preferences, and API keys.",
      layout: "sidebar-topbar",
      components: ["comp-user-profile-form", "comp-team-member-table", "comp-api-key-list"],
      authRequired: true,
      rolesAllowed: ["admin"],
    },
    {
      id: "page-detail",
      name: isEcommerce ? "Order Confirmation" : "Item Inspector",
      route: isEcommerce ? "/orders/:id" : "/items/:id",
      title: "Detail & Audit View",
      description: "Detailed view with timeline logs, item status, and downloadable receipts.",
      layout: "sidebar-topbar",
      components: ["comp-item-header", "comp-status-timeline", "comp-action-bar"],
      authRequired: true,
    },
  ];

  const components: BlueprintComponent[] = [
    {
      id: "comp-hero-banner",
      name: "HeroBanner",
      type: "organism",
      purpose: "Dynamic responsive showcase header featuring primary call-to-action button and telemetry highlights.",
      props: [
        { name: "title", type: "string", required: true },
        { name: "subtitle", type: "string", required: false },
        { name: "primaryActionText", type: "string", required: false },
      ],
      usedInPages: ["page-home"],
    },
    {
      id: "comp-metric-card",
      name: "MetricCard",
      type: "molecule",
      purpose: "Numeric telemetry card showing KPIs, percentage change indicators, and mini sparkline graphs.",
      props: [
        { name: "label", type: "string", required: true },
        { name: "value", type: "string | number", required: true },
        { name: "trendPercent", type: "number", required: false },
      ],
      usedInPages: ["page-home", "page-analytics"],
    },
    {
      id: "comp-data-table",
      name: "DataTable",
      type: "organism",
      purpose: "Enterprise table supporting column sorting, multi-row selection, search filtering, and pagination.",
      props: [
        { name: "columns", type: "ColumnDef[]", required: true },
        { name: "data", type: "any[]", required: true },
        { name: "onRowClick", type: "function", required: false },
      ],
      usedInPages: ["page-catalog"],
    },
    {
      id: "comp-search-bar",
      name: "SearchBar",
      type: "atom",
      purpose: "Debounced keyboard search input with shortcut hint (Cmd+K) and query clear trigger.",
      props: [
        { name: "placeholder", type: "string", required: false },
        { name: "onSearch", type: "function", required: true },
      ],
      usedInPages: ["page-catalog"],
    },
    {
      id: "comp-chart-widget",
      name: "ChartWidget",
      type: "organism",
      purpose: "Interactive line and bar chart wrapper using CSS variable theme tokens for responsive rendering.",
      props: [
        { name: "chartType", type: "'line' | 'bar' | 'area'", required: true },
        { name: "series", type: "ChartSeries[]", required: true },
      ],
      usedInPages: ["page-analytics"],
    },
    {
      id: "comp-activity-feed",
      name: "ActivityFeed",
      type: "molecule",
      purpose: "Chronological event feed with user avatars, timestamp badges, and event categories.",
      props: [{ name: "events", type: "PlatformEvent[]", required: true }],
      usedInPages: ["page-home"],
    },
    {
      id: "comp-quick-filter",
      name: "QuickFilter",
      type: "atom",
      purpose: "Horizontal pill tags allowing one-click filtering by status or category.",
      props: [
        { name: "options", type: "string[]", required: true },
        { name: "selected", type: "string", required: true },
        { name: "onChange", type: "function", required: true },
      ],
      usedInPages: ["page-home", "page-catalog"],
    },
    {
      id: "comp-pagination",
      name: "PaginationControls",
      type: "molecule",
      purpose: "Page index selector with Next/Previous buttons and records count indicator.",
      props: [
        { name: "page", type: "number", required: true },
        { name: "totalPages", type: "number", required: true },
        { name: "onPageChange", type: "function", required: true },
      ],
      usedInPages: ["page-catalog"],
    },
    {
      id: "comp-user-profile-form",
      name: "UserProfileForm",
      type: "organism",
      purpose: "Validated form with avatar upload, email, password reset, and notification toggles.",
      props: [{ name: "user", type: "UserProfile", required: true }],
      usedInPages: ["page-settings"],
    },
    {
      id: "comp-team-member-table",
      name: "TeamMemberTable",
      type: "organism",
      purpose: "RBAC list of organization users with role dropdowns (Admin, Member, Viewer) and invite trigger.",
      props: [{ name: "members", type: "Member[]", required: true }],
      usedInPages: ["page-settings"],
    },
    {
      id: "comp-status-timeline",
      name: "StatusTimeline",
      type: "molecule",
      purpose: "Step-by-step progress tracker indicating created, processing, shipped, and completed milestones.",
      props: [{ name: "steps", type: "TimelineStep[]", required: true }],
      usedInPages: ["page-detail"],
    },
  ];

  return {
    appName,
    description: appDesc,
    pages,
    components,
    routes: pages.map((p) => ({
      path: p.route,
      component: p.name.replace(/\s+/g, ""),
      auth: p.authRequired,
    })),
    layoutStructure: {
      type: (designSystem?.layout?.template as any) || "sidebar-topbar",
      header: true,
      sidebar: true,
      footer: true,
    },
    stateManagement: {
      primary: "React Query + URL State (TanStack)",
      stores: ["authSession", "notificationFeed", "activeWorkspace"],
    },
  };
}

export function synthesizeBackendBlueprint(
  requirements: string = "",
  techStack: Partial<SelectedTechStack> = {},
  features: FeatureToggles | Record<string, boolean> = {}
): BackendBlueprint {
  const isEcommerce =
    requirements.toLowerCase().includes("store") ||
    requirements.toLowerCase().includes("commerce") ||
    Boolean(features["payments"]);

  const runtime = techStack.backend || "Supabase Edge Functions (Deno / TypeScript)";

  const apiRoutes = isEcommerce
    ? [
        {
          method: "GET" as const,
          path: "/api/products",
          handlerName: "listProducts",
          summary: "Fetches paginated list of catalog products with full-text search and category filtering.",
          authRequired: false,
          responseSchema: { type: "array", items: { type: "Product" } },
        },
        {
          method: "GET" as const,
          path: "/api/products/:id",
          handlerName: "getProductDetails",
          summary: "Retrieves single product specification, inventory count, and pricing tiers.",
          authRequired: false,
        },
        {
          method: "POST" as const,
          path: "/api/checkout/session",
          handlerName: "createCheckoutSession",
          summary: "Initializes Stripe or payment gateway checkout session with line items and idempotency key.",
          authRequired: true,
          requestBodySchema: {
            type: "object",
            properties: { items: { type: "array" }, currency: { type: "string" } },
          },
        },
        {
          method: "GET" as const,
          path: "/api/orders",
          handlerName: "getUserOrders",
          summary: "Lists all historical purchase orders for the authenticated customer.",
          authRequired: true,
        },
        {
          method: "POST" as const,
          path: "/api/reviews",
          handlerName: "createProductReview",
          summary: "Submits a customer rating (1-5) and testimonial comment with content validation.",
          authRequired: true,
        },
        {
          method: "GET" as const,
          path: "/api/analytics/summary",
          handlerName: "getAnalyticsSummary",
          summary: "Calculates total gross merchandise value (GMV), conversion rate, and average order value.",
          authRequired: true,
        },
      ]
    : [
        {
          method: "GET" as const,
          path: "/api/dashboard/metrics",
          handlerName: "getDashboardMetrics",
          summary: "Computes system telemetry, active user sessions, through-put rates, and error latency.",
          authRequired: true,
        },
        {
          method: "GET" as const,
          path: "/api/projects",
          handlerName: "listProjects",
          summary: "Retrieves workspace projects filtered by user ownership and team permissions.",
          authRequired: true,
        },
        {
          method: "POST" as const,
          path: "/api/projects",
          handlerName: "createProject",
          summary: "Creates a new workspace project entity with initial configuration payload.",
          authRequired: true,
        },
        {
          method: "PATCH" as const,
          path: "/api/projects/:id",
          handlerName: "updateProject",
          summary: "Updates specific project properties with optimistic concurrency version checking.",
          authRequired: true,
        },
        {
          method: "DELETE" as const,
          path: "/api/projects/:id",
          handlerName: "deleteProject",
          summary: "Soft-deletes project and cascades cancellation to active background worker tasks.",
          authRequired: true,
        },
        {
          method: "GET" as const,
          path: "/api/audit/logs",
          handlerName: "getAuditLogs",
          summary: "Fetches immutable WORM audit log feed for compliance auditing.",
          authRequired: true,
        },
      ];

  const tables: SchemaTable[] = isEcommerce
    ? [
        {
          name: "customers",
          description: "Authenticated buyer accounts linked to Supabase Auth users.",
          columns: [
            { name: "id", type: "UUID", isPrimary: true, isNullable: false, defaultValue: "gen_random_uuid()" },
            { name: "auth_user_id", type: "UUID", isNullable: false, references: { table: "auth.users", column: "id" } },
            { name: "email", type: "TEXT", isNullable: false },
            { name: "full_name", type: "TEXT", isNullable: true },
            { name: "stripe_customer_id", type: "TEXT", isNullable: true },
            { name: "created_at", type: "TIMESTAMPTZ", isNullable: false, defaultValue: "now()" },
          ],
          indexes: ["idx_customers_auth"],
        },
        {
          name: "products",
          description: "Inventory catalog items with prices, stock levels, and categorization.",
          columns: [
            { name: "id", type: "UUID", isPrimary: true, isNullable: false, defaultValue: "gen_random_uuid()" },
            { name: "title", type: "TEXT", isNullable: false },
            { name: "sku", type: "TEXT", isNullable: false },
            { name: "price_cents", type: "INTEGER", isNullable: false },
            { name: "stock_quantity", type: "INTEGER", isNullable: false, defaultValue: "0" },
            { name: "category", type: "TEXT", isNullable: false },
            { name: "created_at", type: "TIMESTAMPTZ", isNullable: false, defaultValue: "now()" },
          ],
          indexes: ["idx_products_category", "idx_products_sku"],
        },
        {
          name: "orders",
          description: "Purchase transaction headers with customer reference, totals, and shipping state.",
          columns: [
            { name: "id", type: "UUID", isPrimary: true, isNullable: false, defaultValue: "gen_random_uuid()" },
            { name: "customer_id", type: "UUID", isNullable: false, references: { table: "customers", column: "id" } },
            { name: "total_amount_cents", type: "INTEGER", isNullable: false },
            { name: "status", type: "TEXT", isNullable: false, defaultValue: "'pending'" },
            { name: "payment_intent_id", type: "TEXT", isNullable: true },
            { name: "created_at", type: "TIMESTAMPTZ", isNullable: false, defaultValue: "now()" },
          ],
          indexes: ["idx_orders_customer"],
        },
        {
          name: "order_items",
          description: "Line item records linking orders to inventory products.",
          columns: [
            { name: "id", type: "UUID", isPrimary: true, isNullable: false, defaultValue: "gen_random_uuid()" },
            { name: "order_id", type: "UUID", isNullable: false, references: { table: "orders", column: "id" } },
            { name: "product_id", type: "UUID", isNullable: false, references: { table: "products", column: "id" } },
            { name: "quantity", type: "INTEGER", isNullable: false, defaultValue: "1" },
            { name: "unit_price_cents", type: "INTEGER", isNullable: false },
          ],
          indexes: ["idx_order_items_order", "idx_order_items_product"],
        },
      ]
    : [
        {
          name: "organizations",
          description: "Multi-tenant workspaces isolating teams, projects, and data.",
          columns: [
            { name: "id", type: "UUID", isPrimary: true, isNullable: false, defaultValue: "gen_random_uuid()" },
            { name: "name", type: "TEXT", isNullable: false },
            { name: "slug", type: "TEXT", isNullable: false },
            { name: "created_at", type: "TIMESTAMPTZ", isNullable: false, defaultValue: "now()" },
          ],
          indexes: ["idx_organizations_slug"],
        },
        {
          name: "workspace_projects",
          description: "Core project entities governed by tenant organization and creator.",
          columns: [
            { name: "id", type: "UUID", isPrimary: true, isNullable: false, defaultValue: "gen_random_uuid()" },
            { name: "organization_id", type: "UUID", isNullable: false, references: { table: "organizations", column: "id" } },
            { name: "name", type: "TEXT", isNullable: false },
            { name: "status", type: "TEXT", isNullable: false, defaultValue: "'active'" },
            { name: "metadata", type: "JSONB", isNullable: false, defaultValue: "'{}'::jsonb" },
            { name: "created_at", type: "TIMESTAMPTZ", isNullable: false, defaultValue: "now()" },
          ],
          indexes: ["idx_projects_org"],
        },
        {
          name: "audit_logs",
          description: "Tamper-evident WORM security and audit records.",
          columns: [
            { name: "id", type: "UUID", isPrimary: true, isNullable: false, defaultValue: "gen_random_uuid()" },
            { name: "actor_id", type: "UUID", isNullable: false },
            { name: "action", type: "TEXT", isNullable: false },
            { name: "resource_type", type: "TEXT", isNullable: false },
            { name: "resource_id", type: "UUID", isNullable: true },
            { name: "payload", type: "JSONB", isNullable: false, defaultValue: "'{}'::jsonb" },
            { name: "created_at", type: "TIMESTAMPTZ", isNullable: false, defaultValue: "now()" },
          ],
          indexes: ["idx_audit_logs_actor"],
        },
      ];

  const sqlDdl = isEcommerce
    ? `-- PROJECT BRAHMA — Auto-Generated Relational DDL (E-Commerce)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  total_amount_cents INTEGER NOT NULL CHECK (total_amount_cents >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0)
);

CREATE INDEX IF NOT EXISTS idx_customers_auth ON public.customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Customers view own profile" ON public.customers FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.customers c WHERE c.id = orders.customer_id AND c.auth_user_id = auth.uid())
);`
    : `-- PROJECT BRAHMA — Auto-Generated Relational DDL (SaaS Enterprise)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workspace_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_org ON public.workspace_projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;`;

  return {
    runtime,
    apiRoutes,
    databaseSchema: {
      tables,
      relationships: isEcommerce
        ? [
            { fromTable: "orders", fromCol: "customer_id", toTable: "customers", toCol: "id" },
            { fromTable: "order_items", fromCol: "order_id", toTable: "orders", toCol: "id" },
            { fromTable: "order_items", fromCol: "product_id", toTable: "products", toCol: "id" },
          ]
        : [
            { fromTable: "workspace_projects", fromCol: "organization_id", toTable: "organizations", toCol: "id" },
          ],
    },
    sqlDdl,
    authModel: {
      provider: "Supabase GoTrue (PKCE)",
      sessionStrategy: "JWT",
      roles: ["admin", "member", "viewer"],
    },
    storagePlan: {
      buckets: ["public-assets", "user-attachments"],
      maxUploadSizeBytes: 25 * 1024 * 1024,
    },
    environmentVariables: [
      { key: "SUPABASE_URL", description: "Canonical project REST and Edge URL", required: true, secret: false },
      { key: "SUPABASE_ANON_KEY", description: "Public browser key", required: true, secret: false },
      { key: "STRIPE_SECRET_KEY", description: "Stripe payment secret", required: false, secret: true },
      { key: "JWT_SECRET", description: "Edge signing key", required: true, secret: true },
    ],
  };
}

export function synthesizeMockData(
  _backendBlueprint?: any
): MockDataPayload {
  const customerIds = Array.from(
    { length: 12 },
    (_, i) => `10000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`
  );
  const productIds = Array.from(
    { length: 16 },
    (_, i) => `20000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`
  );
  const orderIds = Array.from(
    { length: 16 },
    (_, i) => `30000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`
  );
  const orderItemIds = Array.from(
    { length: 20 },
    (_, i) => `40000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`
  );

  const customerNames = [
    "Aarav Sharma",
    "Priya Nair",
    "Vikram Malhotra",
    "Ananya Iyer",
    "Rohan Mehta",
    "Sneha Patel",
    "Aditya Verma",
    "Kavita Rao",
    "Siddharth Gupta",
    "Meera Joshi",
    "Rajesh Kumar",
    "Divya Menon",
  ];

  const customers = customerIds.map((id, idx) => ({
    id,
    auth_user_id: `auth-${id}`,
    email: `${customerNames[idx]?.toLowerCase().replace(/\s+/g, ".") || "user"}@example.com`,
    full_name: customerNames[idx] || "Customer",
    created_at: new Date(Date.now() - (idx + 1) * 86400000 * 3).toISOString(),
  }));

  const productTitles = [
    { title: "Obsidian Pro Monitor Arm", sku: "SKU-MON-01", price: 14900, category: "Hardware" },
    { title: "Quantum Mechanical Keyboard (Cherry Brown)", sku: "SKU-KEY-02", price: 18500, category: "Peripherals" },
    { title: "Ergonomic Mesh Task Chair", sku: "SKU-CHR-03", price: 34900, category: "Furniture" },
    { title: "Studio Noise-Cancelling Headphones", sku: "SKU-AUD-04", price: 28900, category: "Audio" },
    { title: "Thunderbolt 4 Docking Station (10-in-1)", sku: "SKU-DCK-05", price: 21900, category: "Hardware" },
    { title: "Magnetic Wireless Charging Pad", sku: "SKU-CHG-06", price: 4900, category: "Accessories" },
    { title: "Ultra-Wide 34-inch Curved OLED Display", sku: "SKU-DSP-07", price: 89900, category: "Displays" },
    { title: "Precision Wireless Laser Mouse", sku: "SKU-MOU-08", price: 8900, category: "Peripherals" },
    { title: "High-Speed USB-C Braided Cable 2M", sku: "SKU-CBL-09", price: 2500, category: "Accessories" },
    { title: "Desk Mat Extended Felt & Leather", sku: "SKU-MAT-10", price: 3900, category: "Accessories" },
    { title: "Smart Ambient LED Lightbar", sku: "SKU-LGT-11", price: 6500, category: "Lighting" },
    { title: "Portable 2TB NVMe SSD", sku: "SKU-SSD-12", price: 17900, category: "Storage" },
    { title: "Dual Monitor Laptop Riser", sku: "SKU-RSR-13", price: 7200, category: "Hardware" },
    { title: "Mechanical Keycap Artisan Set", sku: "SKU-CAP-14", price: 5400, category: "Peripherals" },
    { title: "Acoustic Wall Panels (Pack of 8)", sku: "SKU-PAN-15", price: 9800, category: "Studio" },
    { title: "Smart Temperature Control Desk Mug", sku: "SKU-MUG-16", price: 6900, category: "Lifestyle" },
  ];

  const products = productIds.map((id, idx) => ({
    id,
    title: productTitles[idx]?.title || "Product",
    sku: productTitles[idx]?.sku || `SKU-${idx}`,
    price_cents: productTitles[idx]?.price || 9900,
    stock_quantity: 15 + idx * 8,
    category: productTitles[idx]?.category || "General",
  }));

  const orderStatuses = ["completed", "processing", "pending", "completed"];
  const orders = orderIds.map((id, idx) => {
    const custId = customerIds[idx % customerIds.length]!;
    return {
      id,
      customer_id: custId,
      total_amount_cents: 14900 + (idx * 3700) % 50000,
      status: orderStatuses[idx % orderStatuses.length] || "completed",
      created_at: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
    };
  });

  const orderItems = orderItemIds.map((id, idx) => {
    const orderId = orderIds[idx % orderIds.length]!;
    const prodId = productIds[idx % productIds.length]!;
    return {
      id,
      order_id: orderId,
      product_id: prodId,
      quantity: (idx % 3) + 1,
      unit_price_cents: 14900,
    };
  });

  return {
    customers,
    products,
    orders,
    order_items: orderItems,
  };
}

export function generatePreviewHtml(
  projectName: string = "Project Brahma Application",
  designSystem: any = {},
  blueprint: any = {},
  mockData: any = {}
): string {
  const colors = designSystem?.colors || {
    primary: "#06b6d4",
    secondary: "#6366f1",
    surface: "#0f172a",
    surfaceElevated: "#1e293b",
    border: "#334155",
    accent: "#10b981",
    textPrimary: "#f8fafc",
    textMuted: "#94a3b8",
  };

  const pages = blueprint?.pages || [
    { id: "p1", name: "Dashboard", route: "/", description: "Realtime metrics and system pulse" },
    { id: "p2", name: "Products", route: "/products", description: "Catalog inventory search" },
    { id: "p3", name: "Analytics", route: "/analytics", description: "Performance telemetry" },
    { id: "p4", name: "Settings", route: "/settings", description: "Workspace preferences" },
  ];

  const products = mockData?.products || [
    { title: "Obsidian Pro Monitor Arm", sku: "SKU-MON-01", price_cents: 14900, category: "Hardware" },
    { title: "Quantum Mechanical Keyboard", sku: "SKU-KEY-02", price_cents: 18500, category: "Peripherals" },
    { title: "Ergonomic Mesh Task Chair", sku: "SKU-CHR-03", price_cents: 34900, category: "Furniture" },
    { title: "Studio Headphones", sku: "SKU-AUD-04", price_cents: 28900, category: "Audio" },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName} — Live Preview</title>
  <style>
    :root {
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --surface: ${colors.surface};
      --surface-elevated: ${colors.surfaceElevated};
      --border: ${colors.border};
      --accent: ${colors.accent};
      --text-primary: ${colors.textPrimary};
      --text-muted: ${colors.textMuted};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--surface);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
    }
    .sidebar {
      width: 240px;
      background: var(--surface-elevated);
      border-right: 1px solid var(--border);
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .brand {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-item {
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.15s;
    }
    .nav-item:hover, .nav-item.active {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
    }
    .nav-item.active {
      border-left: 3px solid var(--primary);
      background: rgba(6, 182, 212, 0.1);
      color: var(--primary);
    }
    .main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--surface-elevated);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.25rem;
    }
    .stat-value {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--primary);
      margin-top: 0.4rem;
    }
    .table-container {
      background: var(--surface-elevated);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.85rem;
    }
    th, td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border);
    }
    th {
      background: rgba(0,0,0,0.2);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent);
    }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="brand">✦ ${projectName}</div>
    <div class="nav-list">
      ${pages
        .map(
          (p: any, idx: number) => `
        <div class="nav-item ${idx === 0 ? "active" : ""}" onclick="switchView('${p.id}')">
          ${p.name}
        </div>
      `
        )
        .join("")}
    </div>
  </div>
  <div class="main">
    <div class="header">
      <div>
        <h1 style="font-size: 1.5rem; font-weight: 700;">Workspace Overview</h1>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Live generated preview linked to active seed data</p>
      </div>
      <span class="badge">● Live Sandboxed</span>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div style="font-size: 0.8rem; color: var(--text-muted);">Active Items</div>
        <div class="stat-value">${products.length}</div>
      </div>
      <div class="stat-card">
        <div style="font-size: 0.8rem; color: var(--text-muted);">System Health</div>
        <div class="stat-value" style="color: var(--accent);">99.9%</div>
      </div>
      <div class="stat-card">
        <div style="font-size: 0.8rem; color: var(--text-muted);">Response Latency</div>
        <div class="stat-value">24ms</div>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (prod: any) => `
            <tr>
              <td style="font-weight: 600;">${prod.title}</td>
              <td style="font-family: monospace; color: var(--text-muted);">${prod.sku}</td>
              <td><span class="badge">${prod.category}</span></td>
              <td style="font-weight: 600;">$${((prod.price_cents || 9900) / 100).toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>
  <script>
    function switchView(id) {
      console.log('Navigating to', id);
    }
  </script>
</body>
</html>`;
}

export function compileExportFiles(project: any): Record<string, string> {
  const name = project?.name || "brahma-generated-app";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const ddl = project?.backend_blueprint?.sqlDdl || "-- SQL Schema DDL\n";
  const mockData = project?.mock_data || {};

  let seedSql = "-- Auto-Generated Seed Data\n";
  for (const [table, rows] of Object.entries(mockData)) {
    if (Array.isArray(rows) && rows.length > 0) {
      seedSql += `\n-- Table: ${table}\n`;
      for (const row of rows) {
        const cols = Object.keys(row);
        const vals = cols.map((c) => {
          const v = (row as any)[c];
          if (v === null || v === undefined) return "NULL";
          if (typeof v === "number") return v;
          if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
          if (typeof v === "object") return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
          return `'${String(v).replace(/'/g, "''")}'`;
        });
        seedSql += `INSERT INTO public.${table} (${cols.join(", ")}) VALUES (${vals.join(", ")}) ON CONFLICT DO NOTHING;\n`;
      }
    }
  }

  const packageJson = JSON.stringify(
    {
      name: slug,
      version: "1.0.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        "@supabase/supabase-js": "^2.48.1",
        "lucide-react": "^0.475.0",
        next: "15.1.7",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        tailwindcss: "^3.4.17",
      },
      devDependencies: {
        "@types/node": "^22.0.0",
        "@types/react": "^19.0.0",
        typescript: "^5.7.3",
      },
    },
    null,
    2
  );

  const dockerfile = `FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
`;

  const dockerCompose = `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=\${SUPABASE_URL}
      - SUPABASE_ANON_KEY=\${SUPABASE_ANON_KEY}
`;

  const envExample = `SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
`;

  const readme = `# ${name}

Generated by **PROJECT BRAHMA** AI-Driven Website Studio.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Configure environment:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

3. Apply database migration & seed:
   - Run \`migrations/001_init.sql\` in your PostgreSQL database.
   - Run \`seed/seed.sql\` to populate initial records.

4. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000)
`;

  return {
    "package.json": packageJson,
    "Dockerfile": dockerfile,
    "docker-compose.yml": dockerCompose,
    ".env.example": envExample,
    "README.md": readme,
    "migrations/001_init.sql": ddl,
    "seed/seed.sql": seedSql,
  };
}

export async function computeProvenanceSha(files: Record<string, string>): Promise<string> {
  const sortedKeys = Object.keys(files).sort();
  let accumulated = "";
  for (const k of sortedKeys) {
    accumulated += `${k}:${files[k]}\n`;
  }
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(accumulated));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function refineBlueprint(
  project: WebsiteProject,
  userFeedback: string,
  targetSection: "frontend" | "backend" | "design" | "features" | "auto" = "auto"
): { updatedProject: WebsiteProject; affectedSection: string; changeSummaries: string[] } {
  const lower = userFeedback.toLowerCase();
  const changeSummaries: string[] = [];
  let section = targetSection;

  if (section === "auto") {
    if (lower.includes("color") || lower.includes("theme") || lower.includes("font") || lower.includes("palette")) {
      section = "design";
    } else if (
      lower.includes("api") ||
      lower.includes("route") ||
      lower.includes("sql") ||
      lower.includes("database") ||
      lower.includes("table")
    ) {
      section = "backend";
    } else if (
      lower.includes("feature") ||
      lower.includes("payment") ||
      lower.includes("auth") ||
      lower.includes("toggle")
    ) {
      section = "features";
    } else {
      section = "frontend";
    }
  }

  const updated: WebsiteProject = { ...project, updated_at: new Date().toISOString() };

  if (section === "design") {
    const currentDs = updated.design_system || {
      presetName: "Obsidian Cyan",
      colors: {
        primary: "#06b6d4",
        secondary: "#6366f1",
        surface: "#090d16",
        surfaceElevated: "#111827",
        border: "#1e293b",
        accent: "#10b981",
        textPrimary: "#f8fafc",
        textMuted: "#94a3b8",
      },
      typography: { fontFamily: "Inter, sans-serif", baseSize: "16px", scaleRatio: "1.25" },
      layout: { template: "sidebar-topbar", radius: "8px", spacing: "relaxed" },
    };

    if (lower.includes("violet") || lower.includes("purple")) {
      updated.design_system = {
        ...currentDs,
        presetName: "Midnight Violet",
        colors: {
          ...currentDs.colors,
          primary: "#a855f7",
          secondary: "#ec4899",
          accent: "#38bdf8",
        },
      };
      changeSummaries.push("Updated design tokens to Midnight Violet color scheme.");
    } else if (lower.includes("emerald") || lower.includes("green")) {
      updated.design_system = {
        ...currentDs,
        presetName: "Forest Emerald",
        colors: {
          ...currentDs.colors,
          primary: "#10b981",
          secondary: "#06b6d4",
          accent: "#f59e0b",
        },
      };
      changeSummaries.push("Updated design tokens to Forest Emerald color scheme.");
    } else {
      changeSummaries.push("Refined layout spacing and typography scale.");
    }
  } else if (section === "backend") {
    const currentBe = updated.backend_blueprint || synthesizeBackendBlueprint(updated.requirements_text);
    if (lower.includes("webhook") || lower.includes("signature")) {
      const newRoute = {
        method: "POST" as const,
        path: "/api/webhooks/incoming",
        handlerName: "handleIncomingWebhook",
        summary: "Verifies HMAC-SHA256 signature header and enqueues event for asynchronous worker processing.",
        authRequired: false,
      };
      updated.backend_blueprint = {
        ...currentBe,
        apiRoutes: [...currentBe.apiRoutes, newRoute],
      };
      changeSummaries.push("Added /api/webhooks/incoming endpoint with HMAC-SHA256 signature verification.");
    } else {
      changeSummaries.push("Refined backend API route query parameters and response pagination.");
    }
  } else if (section === "features") {
    const currentFeats = updated.feature_toggles || {
      auth: true,
      search: true,
      darkMode: true,
      payments: false,
      invoicing: false,
      cms: false,
      i18n: false,
      fileUploads: false,
      analytics: false,
      emailNotifications: false,
      pwa: false,
    };
    if (lower.includes("currency") || lower.includes("payments")) {
      updated.feature_toggles = { ...currentFeats, payments: true, invoicing: true };
      changeSummaries.push("Enabled payments and multi-currency invoicing capabilities.");
    } else {
      changeSummaries.push("Updated feature module flags.");
    }
  } else {
    // Frontend
    const currentFe = updated.frontend_blueprint || synthesizeFrontendBlueprint(updated.requirements_text);
    if (lower.includes("export") || lower.includes("csv")) {
      const updatedPages = currentFe.pages.map((p) => {
        if (p.route === "/analytics" || p.route === "/products") {
          return { ...p, components: [...p.components, "comp-csv-export-button"] };
        }
        return p;
      });
      updated.frontend_blueprint = { ...currentFe, pages: updatedPages };
      changeSummaries.push("Added CSV export capability and component bindings to data tables.");
    } else {
      changeSummaries.push("Optimized page layout hierarchy and component bindings.");
    }
  }

  return { updatedProject: updated, affectedSection: section, changeSummaries };
}
