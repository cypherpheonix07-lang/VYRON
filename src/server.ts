import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { gatewayEngine } from "./server/ai/gatewayEngine";
import { modelRegistry } from "./server/ai/modelRegistry";
import { modelRouter } from "./server/ai/modelRouter";
import { openAiServerAdapter } from "./server/ai/adapters/openAiServerAdapter";
import { openRouterServerAdapter } from "./server/ai/adapters/openRouterServerAdapter";

function renderFallbackErrorHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>PROJECT BRAHMA — Loading Error</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, sans-serif; background: oklch(0.19 0.032 264); color: oklch(0.94 0.012 264); display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; background: oklch(0.23 0.028 264); border: 1px solid oklch(0.32 0.020 264); border-radius: 0.75rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; color: oklch(0.79 0.13 205); }
      p { color: oklch(0.70 0.018 264); margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.5rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: oklch(0.79 0.13 205); color: oklch(0.19 0.032 264); font-weight: 600; }
      .secondary { background: oklch(0.27 0.025 264); color: oklch(0.94 0.012 264); border-color: oklch(0.32 0.020 264); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>A server-side rendering error occurred. You can reload or proceed to the main dashboard.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/app">Dashboard</a>
      </div>
    </div>
  </body>
</html>`;
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderFallbackErrorHtml(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function handleAiServerRoutes(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/favicon.svg") {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0B132B"/><path d="M16 6L24.66 11V21L16 26L7.34 21V11L16 6Z" stroke="#22D3EE" stroke-width="2.2" stroke-linejoin="round" fill="rgba(34, 211, 238, 0.15)"/><circle cx="16" cy="16" r="3" fill="#6366F1"/></svg>`;
    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  if (path === "/favicon.ico") {
    try {
      const fs = await import("fs");
      const pathModule = await import("path");
      const iconPath = pathModule.resolve(process.cwd(), "public", "favicon.ico");
      if (fs.existsSync(iconPath)) {
        const buffer = fs.readFileSync(iconPath);
        return new Response(buffer, {
          status: 200,
          headers: {
            "Content-Type": "image/x-icon",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {
      // fallback to svg response if fs is unavailable
    }
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0B132B"/><path d="M16 6L24.66 11V21L16 26L7.34 21V11L16 6Z" stroke="#22D3EE" stroke-width="2.2" stroke-linejoin="round" fill="rgba(34, 211, 238, 0.15)"/><circle cx="16" cy="16" r="3" fill="#6366F1"/></svg>`;
    return new Response(fallbackSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  if (request.method === "OPTIONS" && path.startsWith("/api/ai")) {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  if (path === "/api/ai/health") {
    const health = await gatewayEngine.getHealth();
    return new Response(JSON.stringify(health), { status: 200, headers: jsonHeaders });
  }

  if (path === "/api/ai/models") {
    const models = modelRegistry.listModels();
    return new Response(JSON.stringify({ models }), { status: 200, headers: jsonHeaders });
  }

  if (path === "/api/ai/observability") {
    const metrics = gatewayEngine.getObservability();
    return new Response(JSON.stringify(metrics), { status: 200, headers: jsonHeaders });
  }

  if (path === "/api/ai/test-connection" && request.method === "POST") {
    try {
      const body = await request.json();
      const provider = body.provider;
      if (provider === "openai") {
        const result = await openAiServerAdapter.healthCheck();
        return new Response(JSON.stringify(result), { status: 200, headers: jsonHeaders });
      } else if (provider === "openrouter") {
        const result = await openRouterServerAdapter.healthCheck();
        return new Response(JSON.stringify(result), { status: 200, headers: jsonHeaders });
      } else {
        return new Response(
          JSON.stringify({ error: "Unknown provider" }),
          { status: 400, headers: jsonHeaders },
        );
      }
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({ error: (err as Error).message }),
        { status: 500, headers: jsonHeaders },
      );
    }
  }

  if (path === "/api/ai/override-policy" && request.method === "POST") {
    try {
      const body = await request.json();
      const { task, provider, model } = body;
      if (task && provider && model) {
        modelRouter.setAdminOverride(task, provider, model);
        return new Response(
          JSON.stringify({ ok: true, message: `Admin override applied for task ${task}` }),
          { status: 200, headers: jsonHeaders },
        );
      }
      return new Response(
        JSON.stringify({ ok: false, message: "Missing required fields" }),
        { status: 400, headers: jsonHeaders },
      );
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({ error: (err as Error).message }),
        { status: 500, headers: jsonHeaders },
      );
    }
  }

  if (path === "/api/ai/gateway" && request.method === "POST") {
    try {
      const body = await request.json();
      const response = await gatewayEngine.execute(body);
      return new Response(JSON.stringify(response), { status: 200, headers: jsonHeaders });
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: "GATEWAY_ERROR", message: (err as Error).message },
        }),
        { status: 500, headers: jsonHeaders },
      );
    }
  }

  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const aiResponse = await handleAiServerRoutes(request);
      if (aiResponse) return aiResponse;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderFallbackErrorHtml(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

