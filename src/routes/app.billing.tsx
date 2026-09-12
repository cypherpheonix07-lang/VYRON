import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/billing")({
  head: () => ({
    meta: [
      { title: "Billing Console — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Upgrade plans, scale seat quotas, and download invoice records.",
      },
    ],
  }),
  component: BillingShellLayout,
});

const billingTabs = [
  { to: "/app/billing/plans", label: "Plans comparison" },
  { to: "/app/billing/usage", label: "Compute Usage" },
  { to: "/app/billing/invoices", label: "Invoice History" },
] as const;

function BillingShellLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Billing & Plans
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your subscription tiers and seat capacity parameters.
          </p>
        </div>
      </header>

      {/* Subnav Tabs */}
      <nav className="-mx-1 overflow-x-auto border-b border-border" aria-label="Billing sections">
        <ul className="flex min-w-max gap-1 px-1">
          {billingTabs.map((t) => {
            const active = pathname === t.to;
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
