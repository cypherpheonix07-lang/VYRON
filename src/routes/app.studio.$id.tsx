import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

import { StatusBadge } from "@/components/brahma/primitives";
import { getProject } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/studio/$id")({
  component: StudioLayout,
});

const tabs = [
  { to: "/app/studio/$id/plan", label: "Plan", exact: true },
  { to: "/app/studio/$id/generate", label: "Generate", exact: true },
  { to: "/app/studio/$id/editor", label: "Editor", exact: true },
  { to: "/app/studio/$id/preview", label: "Preview", exact: true },
  { to: "/app/studio/$id/data", label: "Data", exact: true },
  { to: "/app/studio/$id/integrations", label: "Integrations", exact: true },
  { to: "/app/studio/$id/tests", label: "Tests", exact: true },
  { to: "/app/studio/$id/security", label: "Security", exact: true },
  { to: "/app/studio/$id/versions", label: "Versions", exact: true },
  { to: "/app/studio/$id/collaborate", label: "Collaborate", exact: true },
  { to: "/app/studio/$id/publish", label: "Publish Gate", exact: true },
  { to: "/app/studio/$id/analytics", label: "Analytics", exact: true },
  { to: "/app/studio/$id/settings", label: "Settings", exact: true },
] as const;

function StudioLayout() {
  const { id } = Route.useParams();
  const project = getProject(id);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-primary">
              BRAHMA AI Studio Workspace
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-xs font-mono text-muted-foreground">{project.domain}</span>
          </div>
          <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl mt-1 text-foreground">
            {project.name}
          </h1>
          <p className="mt-1 line-clamp-1 max-w-2xl text-xs text-muted-foreground">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={project.status} />
        </div>
      </header>

      <nav
        className="-mx-1 overflow-x-auto border-b border-border"
        aria-label="Studio workspace sections"
      >
        <ul className="flex min-w-max gap-1 px-1">
          {tabs.map((t) => {
            const href = t.to.replace("$id", id);
            const active = t.exact ? pathname === href : pathname.startsWith(href);
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  params={{ id }}
                  className={cn(
                    "-mb-px inline-block border-b-2 px-3.5 py-2.5 text-xs font-semibold transition-all duration-150",
                    active
                      ? "border-primary text-primary"
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

      <div className="outline-none">
        <Outlet />
      </div>
    </div>
  );
}
