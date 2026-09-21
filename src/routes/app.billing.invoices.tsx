import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/billing/invoices")({
  component: InvoicesPage,
});

function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="surface border border-[var(--warning)]/30 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-6">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--warning)]/10 text-[var(--warning)]">
          <Lock className="size-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-semibold">Invoices Ledger Locked</h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            Invoice history downloads and PDF billing receipts are available for Team and Enterprise
            subscribers.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="outline" className="text-xs" asChild>
            <Link to="/app">Back to Dashboard</Link>
          </Button>
          <Button className="bg-primary text-primary-foreground text-xs font-semibold" asChild>
            <Link to="/app/billing/plans">Upgrade Plan</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
