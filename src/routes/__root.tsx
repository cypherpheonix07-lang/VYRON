import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Compass, Command } from "lucide-react";

import { Toaster } from "@/components/ui/sonner";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="surface border border-border/80 max-w-lg p-10 rounded-2xl space-y-6 relative overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent" />

        <Compass className="size-16 text-cyan-400 mx-auto drop-shadow-[0_0_15px_rgba(34,211,238,0.45)]" />

        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-foreground tracking-tighter drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]">
            404
          </h1>
          <h2 className="text-base font-semibold text-foreground">
            This blueprint page does not exist.
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            The platform route configuration is unmapped, or this sub-node is restricted. Explore
            available modules using the shortcuts below.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/app"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/95 shadow-md"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
              });
              window.dispatchEvent(event);
            }}
            className="inline-flex items-center gap-1.5 justify-center rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-secondary/60"
          >
            <Command className="size-3.5" /> Cmd+K Palette
          </button>
        </div>

        <div className="border-t border-border/40 pt-5 text-left">
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-3">
            Quick Navigation links
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              to="/app"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>&bull;</span> Dashboard
            </Link>
            <Link
              to="/app/studio"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>&bull;</span> AI Studio
            </Link>
            <Link
              to="/app/projects"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>&bull;</span> Project Index
            </Link>
            <Link
              to="/app/reports"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>&bull;</span> Reports Library
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PROJECT BRAHMA — Engineering Intelligence Platform" },
      {
        name: "description",
        content:
          "Turn a raw project idea into a validated software blueprint, then monitor code health, security and delivery risk against business impact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <DemoModeProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-right" richColors />
      </DemoModeProvider>
    </QueryClientProvider>
  );
}
