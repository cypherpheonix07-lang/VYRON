import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface PreviewRequest {
  project_id?: string;
  design_system?: any;
  frontend_blueprint?: any;
  mock_data?: any;
  route?: string;
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
    { title: "Studio Noise-Cancelling Headphones", sku: "SKU-AUD-04", price_cents: 28900, category: "Audio" },
  ];

  const customers = mockData?.customers || [
    { full_name: "Priya Nair", email: "priya.nair@brahma.dev", created_at: "2026-09-01" },
    { full_name: "Aarav Sharma", email: "aarav.sharma@example.com", created_at: "2026-09-02" },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName} — Live Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-surface: ${colors.surface};
      --color-elevated: ${colors.surfaceElevated};
      --color-border: ${colors.border};
      --color-accent: ${colors.accent};
      --color-text: ${colors.textPrimary};
      --color-text-muted: ${colors.textMuted};
      --font-main: 'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --radius: ${designSystem?.layout?.radius || "0.5rem"};
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-main);
      background-color: var(--color-surface);
      color: var(--color-text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Top Navbar */
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.5rem;
      border-bottom: 1px solid var(--color-border);
      background-color: var(--color-elevated);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 700;
      font-size: 1rem;
      color: var(--color-text);
      text-decoration: none;
    }
    .brand-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--color-primary);
      box-shadow: 0 0 12px var(--color-primary);
    }
    .nav-links {
      display: flex;
      gap: 0.75rem;
      list-style: none;
    }
    .nav-btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--color-text-muted);
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius);
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .nav-btn:hover, .nav-btn.active {
      color: var(--color-text);
      border-color: var(--color-border);
      background-color: rgba(255, 255, 255, 0.05);
    }
    .nav-btn.active {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    /* Main Container */
    .container {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 2rem 1.5rem;
    }

    /* Page View Sections */
    .page-section { display: none; }
    .page-section.active { display: block; animation: fadeIn 0.2s ease; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Hero Banner */
    .hero {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 2.5rem;
      margin-bottom: 2rem;
      position: relative;
    }
    .hero h1 { font-size: 1.85rem; font-weight: 700; margin-bottom: 0.5rem; }
    .hero p { color: var(--color-text-muted); font-size: 0.95rem; max-width: 650px; line-height: 1.5; }
    .badge {
      display: inline-block;
      font-size: 0.72rem;
      font-family: var(--font-mono);
      font-weight: 600;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      border: 1px solid var(--color-primary);
      color: var(--color-primary);
      margin-bottom: 0.75rem;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .metric-card {
      background-color: var(--color-elevated);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 1.25rem;
    }
    .metric-label { font-size: 0.78rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .metric-val { font-size: 1.6rem; font-weight: 700; margin: 0.35rem 0; color: var(--color-text); }
    .metric-trend { font-size: 0.75rem; color: var(--color-accent); display: flex; align-items: center; gap: 0.25rem; }

    /* Data Table / Cards Grid */
    .table-container {
      background-color: var(--color-elevated);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      overflow: hidden;
      margin-bottom: 2rem;
    }
    .table-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .search-input {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius);
      font-size: 0.8rem;
      width: 240px;
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem; }
    th { padding: 0.75rem 1.25rem; background-color: rgba(255,255,255,0.02); color: var(--color-text-muted); font-size: 0.75rem; font-weight: 600; border-bottom: 1px solid var(--color-border); }
    td { padding: 0.85rem 1.25rem; border-bottom: 1px solid var(--color-border); }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background-color: rgba(255, 255, 255, 0.02); }

    /* Toast Notification */
    #toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--color-elevated);
      border: 1px solid var(--color-primary);
      color: var(--color-text);
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      font-size: 0.85rem;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.25s ease;
      z-index: 100;
    }
    #toast.show { transform: translateY(0); opacity: 1; }
  </style>
</head>
<body>
  <header class="top-bar">
    <a href="#" class="brand-logo" onclick="switchPage('p1')">
      <div class="brand-indicator"></div>
      <span>${projectName}</span>
    </a>
    <ul class="nav-links">
      ${pages
        .map(
          (p: any, i: number) =>
            `<li><button class="nav-btn ${i === 0 ? "active" : ""}" id="btn-${p.id}" onclick="switchPage('${p.id}')">${p.name}</button></li>`
        )
        .join("")}
    </ul>
  </header>

  <main class="container">
    <!-- Page 1: Dashboard -->
    <div id="page-p1" class="page-section active">
      <div class="hero">
        <div class="badge">SYSTEM READY • ONLINE</div>
        <h1>Welcome to ${projectName}</h1>
        <p>Synthesized full-stack web application powered by Project Brahma autonomous Edge generation engine with reactive state management and validated schemas.</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Active Users</div>
          <div class="metric-val">${customers.length * 142}</div>
          <div class="metric-trend">↑ +14.2% this week</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Catalog Items</div>
          <div class="metric-val">${products.length}</div>
          <div class="metric-trend">100% In Stock</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Edge Latency</div>
          <div class="metric-val">34ms</div>
          <div class="metric-trend">Sub-50ms SLA</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Security Gate</div>
          <div class="metric-val">100%</div>
          <div class="metric-trend">RLS Enforced</div>
        </div>
      </div>

      <div class="table-container">
        <div class="table-header">
          <h3>Recent Customer Accounts</h3>
          <span style="font-size: 0.75rem; color: var(--color-text-muted);">Showing ${customers.length} verified records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Onboarded Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${customers
              .map(
                (c: any) => `
              <tr>
                <td style="font-weight: 600;">${c.full_name}</td>
                <td style="font-family: var(--font-mono); color: var(--color-text-muted);">${c.email}</td>
                <td>${new Date(c.created_at).toLocaleDateString()}</td>
                <td><span style="color: var(--color-accent); font-weight: 500;">Active</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Page 2: Products / Catalog -->
    <div id="page-p2" class="page-section">
      <div class="hero">
        <div class="badge">LIVE INVENTORY</div>
        <h1>Storefront & Product Catalog</h1>
        <p>Explore simulated inventory seed records synthesized with strict foreign-key integrity.</p>
      </div>

      <div class="table-container">
        <div class="table-header">
          <h3>Catalog Items</h3>
          <input type="text" class="search-input" placeholder="Search catalog..." oninput="filterTable(this.value)" />
        </div>
        <table id="products-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (p: any) => `
              <tr>
                <td style="font-weight: 600;">${p.title}</td>
                <td style="font-family: var(--font-mono); color: var(--color-text-muted);">${p.sku}</td>
                <td style="font-family: var(--font-mono); color: var(--color-primary); font-weight: 600;">$${(p.price_cents / 100).toFixed(2)}</td>
                <td><span style="background: rgba(255,255,255,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;">${p.category}</span></td>
                <td><button onclick="showToast('Item added to cart: ${p.title.replace(/'/g, "")}')" style="background: var(--color-primary); color: #000; border: none; padding: 0.35rem 0.75rem; border-radius: 4px; font-weight: 600; font-size: 0.75rem; cursor: pointer;">Add to Cart</button></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Page 3: Analytics -->
    <div id="page-p3" class="page-section">
      <div class="hero">
        <div class="badge">TELEMETRY STREAM</div>
        <h1>Performance & Audit Analytics</h1>
        <p>Comprehensive observability dashboard tracking edge function invocations and audit logs.</p>
      </div>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Cache Hit Ratio</div>
          <div class="metric-val">94.8%</div>
          <div class="metric-trend">Global CDN Layer</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Error Rate</div>
          <div class="metric-val">0.00%</div>
          <div class="metric-trend">Clean Telemetry</div>
        </div>
      </div>
    </div>

    <!-- Page 4: Settings -->
    <div id="page-p4" class="page-section">
      <div class="hero">
        <div class="badge">CONFIGURATION</div>
        <h1>Settings & Workspace Profile</h1>
        <p>Manage security protocols, API keys, and notification channels.</p>
      </div>
      <div class="metric-card" style="max-width: 600px;">
        <h4 style="margin-bottom: 0.5rem;">Security Protocol</h4>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem;">Row Level Security is active on all PostgreSQL tables with HMAC webhook verification.</p>
        <button onclick="showToast('Security audit scan triggered!')" style="background: var(--color-elevated); border: 1px solid var(--color-border); color: var(--color-text); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.82rem;">Run Security Scan</button>
      </div>
    </div>
  </main>

  <div id="toast">Notification Message</div>

  <script>
    function switchPage(pageId) {
      document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
      const activeSec = document.getElementById('page-' + pageId) || document.getElementById('page-p1');
      const activeBtn = document.getElementById('btn-' + pageId);
      if (activeSec) activeSec.classList.add('active');
      if (activeBtn) activeBtn.classList.add('active');
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function filterTable(query) {
      const q = query.toLowerCase();
      const rows = document.querySelectorAll('#products-table tbody tr');
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    try {
      let projectName = "Project Brahma Application";
      let designSystem: any = null;
      let blueprint: any = null;
      let mockData: any = null;

      if (req.method === "POST") {
        const body: PreviewRequest = await req.json().catch(() => ({}));
        if (body.project_id && ctx.supabase) {
          const { data: project } = await ctx.supabase
            .from("website_projects")
            .select("*")
            .eq("id", body.project_id)
            .maybeSingle();

          if (project) {
            projectName = project.name;
            designSystem = project.design_system;
            blueprint = project.frontend_blueprint;
            mockData = project.mock_data;
          }
        }
        if (body.design_system) designSystem = body.design_system;
        if (body.frontend_blueprint) blueprint = body.frontend_blueprint;
        if (body.mock_data) mockData = body.mock_data;
      }

      const html = generatePreviewHtml(projectName, designSystem, blueprint, mockData);

      // Check Accept header: if requesting JSON, return JSON payload, otherwise return text/html
      const accept = req.headers.get("accept") || "";
      if (accept.includes("application/json")) {
        return new Response(JSON.stringify({ ok: true, html }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
      });
    } catch (err: any) {
      console.error("[website-preview] Error:", err);
      const fallbackHtml = generatePreviewHtml();
      return new Response(fallbackHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
      });
    }
  }),
};
