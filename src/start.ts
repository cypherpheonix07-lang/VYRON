import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

function renderFallbackErrorHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>VYRON — Loading Error</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="font-family:system-ui;background:oklch(0.16 0.025 151.3);color:oklch(0.864 0.021 358.8);display:grid;place-items:center;min-height:100vh;margin:0">
    <div style="max-width:28rem;text-align:center;padding:2rem;background:oklch(0.20 0.024 151.3);border:1px solid oklch(0.30 0.020 196.8);border-radius:0.75rem">
      <h1 style="color:oklch(0.854 0.061 294.4)">This page didn't load</h1>
      <p style="color:oklch(0.827 0.030 15.1)">An SSR error occurred. Please try refreshing or go to the dashboard.</p>
      <a href="/app" style="display:inline-block;padding:0.5rem 1rem;background:oklch(0.854 0.061 294.4);color:oklch(0.16 0.025 151.3);font-weight:600;border-radius:0.5rem;text-decoration:none">Go to Dashboard</a>
    </div>
  </body>
</html>`;
}

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderFallbackErrorHtml(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
