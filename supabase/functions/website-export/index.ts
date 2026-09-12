import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ExportRequest {
  project_id?: string;
  project_data?: any;
}

async function computeProvenanceSha(files: Record<string, string>): Promise<string> {
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

export function compileExportFiles(project: any): Record<string, string> {
  const name = project?.name || "brahma-generated-app";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const ddl = project?.backend_blueprint?.sqlDdl || "-- SQL Schema DDL\n";
  const mockData = project?.mock_data || {};

  // Build seed.sql from mock_data
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

  const files: Record<string, string> = {
    "package.json": JSON.stringify(
      {
        name: slug,
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc && vite build",
          preview: "vite preview",
        },
        dependencies: {
          "@tanstack/react-query": "^5.28.0",
          "@tanstack/react-router": "^1.19.0",
          "lucide-react": "^0.359.0",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
        },
        devDependencies: {
          "@types/react": "^18.3.3",
          "@types/react-dom": "^18.3.0",
          "@vitejs/plugin-react": "^4.2.1",
          "typescript": "^5.4.3",
          "vite": "^5.2.0",
        },
      },
      null,
      2
    ),

    "README.md": `# ${name}

Synthesized by **PROJECT BRAHMA** AI Website Generation System.

## Architecture
- **Frontend**: Next.js / Vite React + TanStack Router
- **Backend**: Supabase Edge Functions / PostgreSQL 16
- **Security**: Row Level Security (RLS) + HMAC Webhooks

## Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Run Local Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Database Migration
Execute \`migrations/001_init.sql\` followed by \`seed/seed.sql\` in your PostgreSQL database.
`,

    "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body class="dark bg-slate-950 text-slate-100">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

    "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,

    "src/main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

    "src/App.tsx": `import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '3rem', fontFamily: 'sans-serif' }}>
      <h1>${name}</h1>
      <p style={{ color: '#94a3b8' }}>Synthesized by Project Brahma Autonomous Website Generator.</p>
    </div>
  );
}`,

    "src/index.css": `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: dark;
}
body { margin: 0; background: #090d16; color: #f1f5f9; }`,

    "migrations/001_init.sql": ddl,
    "seed/seed.sql": seedSql,

    "Dockerfile": `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,

    "docker-compose.yml": `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production`,

    ".env.example": `VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
`,
  };

  return files;
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
      const body: ExportRequest = await req.json().catch(() => ({}));

      let project = body.project_data;
      if (!project && body.project_id && ctx.supabase) {
        const { data } = await ctx.supabase
          .from("website_projects")
          .select("*")
          .eq("id", body.project_id)
          .maybeSingle();
        project = data;
      }

      const files = compileExportFiles(project);
      const sha256 = await computeProvenanceSha(files);

      // Update project status and provenance sha
      if (ctx.supabase && body.project_id) {
        await ctx.supabase
          .from("website_projects")
          .update({
            provenance_sha: sha256,
            status: "exported",
            updated_at: new Date().toISOString(),
          })
          .eq("id", body.project_id);
      }

      return new Response(
        JSON.stringify({
          ok: true,
          files,
          provenance_sha: sha256,
          file_count: Object.keys(files).length,
          download_filename: `${(project?.name || "brahma-site").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-export.zip`,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (err: any) {
      console.error("[website-export] Error:", err);
      const fallbackFiles = compileExportFiles({});
      const sha256 = await computeProvenanceSha(fallbackFiles);

      return new Response(
        JSON.stringify({
          ok: true,
          fallback_used: true,
          files: fallbackFiles,
          provenance_sha: sha256,
          file_count: Object.keys(fallbackFiles).length,
          download_filename: "brahma-site-export.zip",
          error: err?.message,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }),
};
