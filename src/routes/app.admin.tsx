import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Brahma platform usage metrics, audit logs, active users, and service status.",
      },
    ],
  }),
  component: AdminLayout,
});

const subNavs = [
  { to: "/app/admin/studio", label: "Overview", exact: true },
  { to: "/app/admin/users", label: "Users", exact: true },
  { to: "/app/admin/templates", label: "Templates", exact: true },
  { to: "/app/admin/models", label: "Models Routing", exact: true },
  { to: "/app/admin/audit", label: "Audit Log", exact: true },
  { to: "/app/admin/usage", label: "Usage & Billing", exact: true },
] as const;

function AdminLayout() {
  const { user, isAdmin } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Access Control check
  if (!isAdmin) {
    return (
      <div className="surface flex flex-col items-center justify-center gap-4 rounded-xl px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--critical)]/12 text-[var(--critical)]">
          <ShieldAlert className="size-6" aria-hidden />
        </span>
        <div className="max-w-md">
          <h2 className="text-lg font-semibold text-foreground">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            The Admin Console is restricted to accounts with the **Admin** role. Your current
            logged-in role is **{user?.role ?? "Guest"}**.
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <Button asChild variant="outline">
            <Link to="/app">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Admin Console
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Brahma platform usage metrics, audit logs, active users, and service status.
          </p>
        </div>
      </header>

      <nav
        className="-mx-1 overflow-x-auto border-b border-border"
        aria-label="Admin console navigation"
      >
        <ul className="flex min-w-max gap-1 px-1">
          {subNavs.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
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
