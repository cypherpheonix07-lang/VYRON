import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

import { StatusBadge } from "@/components/brahma/primitives";
import { getProject } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { LiveProjectProvider, useLiveProject } from "@/contexts/LiveProjectContext";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/projects/$id")({
  component: ProjectLayout,
});

const tabs = [
  { to: "/app/projects/$id", label: "Overview", exact: true },
  { to: "/app/projects/$id/results", label: "Results Workspace", exact: false },
  { to: "/app/projects/$id/activity", label: "Activity Stream", exact: false },
  { to: "/app/projects/$id/requirements", label: "Requirements", exact: false },
  { to: "/app/projects/$id/blueprint", label: "Blueprint", exact: false },
  { to: "/app/projects/$id/integrations", label: "Integrations", exact: false },
  { to: "/app/projects/$id/scans", label: "Scan History", exact: false },
  { to: "/app/projects/$id/code-health", label: "Code Health", exact: false },
  { to: "/app/projects/$id/security", label: "Security", exact: false },
  { to: "/app/projects/$id/tests", label: "Tests", exact: false },
  { to: "/app/projects/$id/risk-business", label: "Risk & Business", exact: false },
  { to: "/app/projects/$id/versions", label: "Versions", exact: false },
  { to: "/app/projects/$id/collaborate", label: "Collaborate", exact: false },
  { to: "/app/projects/$id/publish", label: "Publish", exact: false },
  { to: "/app/projects/$id/analytics", label: "Analytics", exact: false },
] as const;

function ProjectLayout() {
  const { id } = Route.useParams();
  const { isDemoMode } = useDemoMode();
  return isDemoMode ? <DemoProjectLayout /> : (
    <LiveProjectProvider key={id} id={id}><LiveProjectLayout /></LiveProjectProvider>
  );
}

function LiveProjectLayout() {
  const { id } = Route.useParams();
  const { activate } = useDemoMode();
  const { data, status, error, refresh } = useLiveProject();
  if (status === "loading") return <p role="status">Loading project from the database…</p>;
  if (status === "error") {
    return (
      <div role="alert" className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/10 p-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">Database Access Unavailable</h2>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button onClick={refresh} variant="outline" size="sm">Retry database request</Button>
          <Button onClick={() => activate(id, "fintech")} variant="default" size="sm">
            Switch to Demo Mode (Sample Fixtures)
          </Button>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="space-y-4 rounded-xl border border-border/40 bg-card p-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">Project Not Found in Database</h2>
          <p className="mt-1 text-sm text-muted-foreground">Project not found or access is unavailable. No sample project has been substituted.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button onClick={refresh} variant="outline" size="sm">Check again</Button>
          <Button onClick={() => activate(id, "fintech")} variant="default" size="sm">
            Explore in Demo Mode (Sample Fixtures)
          </Button>
        </div>
      </div>
    );
  }
  return <ProjectShell id={id} project={data.project} />;
}

function DemoProjectLayout() {
  const { id } = Route.useParams();
  const project = getProject(id);
  return <ProjectShell id={id} project={project} demo />;
}

function ProjectShell({ id, project, demo = false }: {
  id: string;
  project: { name: string; description: string | null; status: string };
  demo?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="space-y-6">
      {demo && <p role="status" className="text-sm text-amber-400">Demo mode — sample data, not database results.</p>}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
            {project.name}
          </h1>
          <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </header>

      <nav className="-mx-1 overflow-x-auto" aria-label="Project sections">
        <ul className="flex min-w-max gap-1 border-b border-border px-1">
          {tabs.map((t) => {
            const href = t.to.replace("$id", id);
            const active = t.exact ? pathname === href : pathname.startsWith(href);
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  params={{ id }}
                  className={cn(
                    "-mb-px inline-block border-b-2 px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "border-primary font-medium text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}
