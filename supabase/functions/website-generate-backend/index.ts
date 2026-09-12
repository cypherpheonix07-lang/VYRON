import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface BackendGenRequest {
  project_id?: string;
  requirements_text?: string;
  tech_stack?: any;
  feature_toggles?: Record<string, boolean>;
  frontend_blueprint?: any;
}

function synthesizeBackendBlueprint(
  requirements: string = "",
  techStack: any = {},
  features: Record<string, boolean> = {}
) {
  const isEcommerce = requirements.toLowerCase().includes("store") || requirements.toLowerCase().includes("commerce") || features.payments;

  const runtime = techStack.backend || "Supabase Edge Functions (Deno / TypeScript)";

  // API Routes (>= 5 endpoints)
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
          requestBodySchema: { type: "object", properties: { items: { type: "array" }, currency: { type: "string" } } },
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
          path: "/api/orders/:id/refund",
          handlerName: "requestOrderRefund",
          summary: "Submits formal refund request with reason payload; triggers audit event.",
          authRequired: true,
        },
        {
          method: "POST" as const,
          path: "/api/admin/inventory/adjust",
          handlerName: "adjustInventoryStock",
          summary: "Administrative stock level override with transaction lock.",
          authRequired: true,
        },
      ]
    : [
        {
          method: "GET" as const,
          path: "/api/workspaces",
          handlerName: "listWorkspaces",
          summary: "Retrieves all team workspaces accessible by current user credentials.",
          authRequired: true,
        },
        {
          method: "POST" as const,
          path: "/api/workspaces",
          handlerName: "createWorkspace",
          summary: "Provisions a new isolated tenant workspace with default role assignment.",
          authRequired: true,
        },
        {
          method: "GET" as const,
          path: "/api/analytics/telemetry",
          handlerName: "getTelemetrySummary",
          summary: "Aggregates real-time event counts, API latencies, and conversion rates.",
          authRequired: true,
        },
        {
          method: "POST" as const,
          path: "/api/webhooks/subscribe",
          handlerName: "registerWebhook",
          summary: "Registers an outgoing webhook endpoint with HMAC signature secret.",
          authRequired: true,
        },
        {
          method: "DELETE" as const,
          path: "/api/users/:id/sessions",
          handlerName: "revokeAllSessions",
          summary: "Invalidates all active refresh tokens for target security account.",
          authRequired: true,
        },
      ];

  // Database Schema (>= 3 tables with FK constraints)
  const databaseSchema = isEcommerce
    ? {
        tables: [
          {
            name: "customers",
            description: "Registered customer identities linked to auth.users.",
            columns: [
              { name: "id", type: "UUID", isPrimary: true, defaultValue: "gen_random_uuid()" },
              { name: "auth_user_id", type: "UUID", isNullable: false, references: { table: "auth.users", column: "id" } },
              { name: "email", type: "TEXT", isNullable: false },
              { name: "full_name", type: "TEXT", isNullable: true },
              { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "now()" },
            ],
            indexes: ["idx_customers_auth_user_id", "idx_customers_email"],
          },
          {
            name: "products",
            description: "Storefront merchandise catalog and pricing.",
            columns: [
              { name: "id", type: "UUID", isPrimary: true, defaultValue: "gen_random_uuid()" },
              { name: "title", type: "TEXT", isNullable: false },
              { name: "sku", type: "TEXT", isNullable: false },
              { name: "price_cents", type: "INTEGER", isNullable: false },
              { name: "stock_quantity", type: "INTEGER", defaultValue: "0" },
              { name: "category", type: "TEXT", defaultValue: "'General'" },
              { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "now()" },
            ],
            indexes: ["idx_products_sku", "idx_products_category"],
          },
          {
            name: "orders",
            description: "Transactional order records with payment status.",
            columns: [
              { name: "id", type: "UUID", isPrimary: true, defaultValue: "gen_random_uuid()" },
              { name: "customer_id", type: "UUID", isNullable: false, references: { table: "customers", column: "id" } },
              { name: "total_amount_cents", type: "INTEGER", isNullable: false },
              { name: "payment_status", type: "TEXT", defaultValue: "'pending'" },
              { name: "tracking_number", type: "TEXT", isNullable: true },
              { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "now()" },
            ],
            indexes: ["idx_orders_customer_id", "idx_orders_status"],
          },
          {
            name: "order_items",
            description: "Line items associated with a specific order record.",
            columns: [
              { name: "id", type: "UUID", isPrimary: true, defaultValue: "gen_random_uuid()" },
              { name: "order_id", type: "UUID", isNullable: false, references: { table: "orders", column: "id" } },
              { name: "product_id", type: "UUID", isNullable: false, references: { table: "products", column: "id" } },
              { name: "quantity", type: "INTEGER", isNullable: false },
              { name: "unit_price_cents", type: "INTEGER", isNullable: false },
            ],
            indexes: ["idx_order_items_order_id", "idx_order_items_product_id"],
          },
        ],
        relationships: [
          { fromTable: "customers", fromCol: "auth_user_id", toTable: "auth.users", toCol: "id" },
          { fromTable: "orders", fromCol: "customer_id", toTable: "customers", toCol: "id" },
          { fromTable: "order_items", fromCol: "order_id", toTable: "orders", toCol: "id" },
          { fromTable: "order_items", fromCol: "product_id", toTable: "products", toCol: "id" },
        ],
      }
    : {
        tables: [
          {
            name: "workspaces",
            description: "Multi-tenant workspace partitions.",
            columns: [
              { name: "id", type: "UUID", isPrimary: true, defaultValue: "gen_random_uuid()" },
              { name: "name", type: "TEXT", isNullable: false },
              { name: "slug", type: "TEXT", isNullable: false },
              { name: "owner_id", type: "UUID", isNullable: false, references: { table: "auth.users", column: "id" } },
              { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "now()" },
            ],
            indexes: ["idx_workspaces_owner_id", "idx_workspaces_slug"],
          },
          {
            name: "workspace_members",
            description: "Team membership bindings and role authorizations.",
            columns: [
              { name: "id", type: "UUID", isPrimary: true, defaultValue: "gen_random_uuid()" },
              { name: "workspace_id", type: "UUID", isNullable: false, references: { table: "workspaces", column: "id" } },
              { name: "user_id", type: "UUID", isNullable: false, references: { table: "auth.users", column: "id" } },
              { name: "role", type: "TEXT", defaultValue: "'member'" },
              { name: "joined_at", type: "TIMESTAMPTZ", defaultValue: "now()" },
            ],
            indexes: ["idx_workspace_members_user_ws"],
          },
          {
            name: "telemetry_records",
            description: "High-volume operational event logs.",
            columns: [
              { name: "id", type: "UUID", isPrimary: true, defaultValue: "gen_random_uuid()" },
              { name: "workspace_id", type: "UUID", isNullable: false, references: { table: "workspaces", column: "id" } },
              { name: "event_name", type: "TEXT", isNullable: false },
              { name: "payload", type: "JSONB", defaultValue: "'{}'::jsonb" },
              { name: "recorded_at", type: "TIMESTAMPTZ", defaultValue: "now()" },
            ],
            indexes: ["idx_telemetry_workspace_id", "idx_telemetry_event_name"],
          },
        ],
        relationships: [
          { fromTable: "workspaces", fromCol: "owner_id", toTable: "auth.users", toCol: "id" },
          { fromTable: "workspace_members", fromCol: "workspace_id", toTable: "workspaces", toCol: "id" },
          { fromTable: "workspace_members", fromCol: "user_id", toTable: "auth.users", toCol: "id" },
          { fromTable: "telemetry_records", fromCol: "workspace_id", toTable: "workspaces", toCol: "id" },
        ],
      };

  // Syntactically Valid SQL DDL
  const sqlDdl = isEcommerce
    ? `-- Auto-Generated Project Brahma SQL DDL (E-Commerce Schema)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock_quantity INTEGER DEFAULT 0 NOT NULL,
  category TEXT DEFAULT 'General' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  total_amount_cents INTEGER NOT NULL CHECK (total_amount_cents >= 0),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0)
);

-- Covering Indexes
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON public.customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Customer own data" ON public.customers FOR ALL USING (auth.uid() = auth_user_id);
CREATE POLICY "Customer own orders" ON public.orders FOR ALL USING (
  customer_id IN (SELECT id FROM public.customers WHERE auth_user_id = auth.uid())
);
`
    : `-- Auto-Generated Project Brahma SQL DDL (SaaS Schema)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member','viewer')),
  joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.telemetry_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  event_name TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_workspace ON public.telemetry_records(workspace_id);

-- RLS Policies
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Member select workspace" ON public.workspaces FOR SELECT USING (
  owner_id = auth.uid() OR
  id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);
CREATE POLICY "Member select telemetry" ON public.telemetry_records FOR SELECT USING (
  workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);
`;

  return {
    runtime,
    apiRoutes,
    databaseSchema,
    sqlDdl,
    authModel: {
      provider: "Supabase Auth + JWT Tokens",
      roles: ["admin", "member", "customer"],
      sessionStrategy: "HTTP-only Secure Cookie Refresh + Bearer Access Token",
    },
    storagePlan: {
      buckets: ["public-media", "user-attachments", "export-archives"],
      maxUploadSizeBytes: 52428800, // 50MB
    },
    environmentVariables: [
      { key: "DATABASE_URL", description: "PostgreSQL pooled connection string", required: true, secret: true },
      { key: "SUPABASE_SERVICE_ROLE_KEY", description: "Privileged server-side key", required: true, secret: true },
      { key: "STRIPE_SECRET_KEY", description: "Stripe payment integration secret", required: false, secret: true },
      { key: "RESEND_API_KEY", description: "Transactional email provider API key", required: false, secret: true },
      { key: "PUBLIC_APP_URL", description: "Production canonical URL for webhooks and CORS", required: true, secret: false },
    ],
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
      const body: BackendGenRequest = await req.json().catch(() => ({}));
      const blueprint = synthesizeBackendBlueprint(
        body.requirements_text,
        body.tech_stack,
        body.feature_toggles
      );

      // Persist to website_projects if project_id is provided
      if (ctx.supabase && body.project_id) {
        await ctx.supabase
          .from("website_projects")
          .update({
            backend_blueprint: blueprint,
            generation_step: 3,
            updated_at: new Date().toISOString(),
          })
          .eq("id", body.project_id);

        // Record history
        await ctx.supabase.from("website_generations").insert({
          website_project_id: body.project_id,
          generation_number: 2,
          trigger_type: "initial",
          user_feedback: "Backend blueprint and SQL DDL synthesis",
          input_snapshot: {
            requirements_text: body.requirements_text,
            tech_stack: body.tech_stack,
            feature_toggles: body.feature_toggles,
          },
          output_snapshot: { backend_blueprint: blueprint },
          llm_metadata: { generator: "brahma-backend-engine-v1" },
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
      console.error("[website-generate-backend] Error:", err);
      const fallback = synthesizeBackendBlueprint();
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
