import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

import { StatusBadge } from "@/components/brahma/primitives";
import { getProject } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/projects/$id")({
  component: ProjectLayout,
});

const tabs = [
  { to: "/app/projects/$id", label: "Overview", exact: true },
  { to: "/app/projects/$id/requirements", label: "Requirements", exact: false },
  { to: "/app/projects/$id/blueprint", label: "Blueprint", exact: false },
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
  const project = getProject(id);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="space-y-6">
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
