import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin")({
  head: () => ({
    meta: [
      { title: "Admin — PROJECT BRAHMA" },
      { name: "description", content: "Platform administration: users, templates, AI models, audit log and usage." },
      { property: "og:title", content: "Admin — PROJECT BRAHMA" },
      { property: "og:description", content: "Users, templates, model routing, audit log and credit usage." },
    ],
  }),
  component: AdminLayout,
});

const subNav = [
  { to: "/app/admin", label: "Overview", exact: true },
  { to: "/app/admin/users", label: "Users", exact: false },
  { to: "/app/admin/templates", label: "Templates", exact: false },
  { to: "/app/admin/models", label: "Models", exact: false },
  { to: "/app/admin/audit", label: "Audit Log", exact: false },
  { to: "/app/admin/usage", label: "Usage & Billing", exact: false },
] as const;

export function LockedState403() {
  return (
    <Card className="surface mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--warning)]/12 text-[var(--warning)]">
          <ShieldAlert className="size-6" aria-hidden />
        </span>
        <div>
          <p className="font-medium">Admin access required</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            This area manages users, AI model routing and audit records. Your current role can view projects
            but cannot change platform configuration.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={() => toast.success("Access request sent to workspace admins")}>Request access</Button>
          <Button asChild variant="outline">
            <Link to="/app">Back to dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminLayout() {
  const { isAdmin } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin"
        description="Platform-wide configuration, oversight and audit for the BRAHMA deployment."
      />
      {isAdmin ? (
        <>
          <div className="-mx-1 overflow-x-auto px-1">
            <nav className="flex w-max gap-1 rounded-lg border border-border bg-muted/40 p-1" aria-label="Admin sections">
              {subNav.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      active ? "bg-primary/12 text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Outlet />
        </>
      ) : (
        <LockedState403 />
      )}
    </div>
  );
}
