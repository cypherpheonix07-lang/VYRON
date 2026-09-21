import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/billing/plans")({
  component: PlansPage,
});

function PlansPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Locked State Card */}
      <div className="surface border border-[var(--warning)]/30 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-6">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--warning)]/10 text-[var(--warning)]">
          <Lock className="size-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-semibold">Available in BRAHMA Pro</h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            Billing management, invoice ledger logs, and custom plans allocation configurations are
            premium features. Upgrade your workspace to unlock.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="outline" className="text-xs" asChild>
            <Link to="/app">Back to Dashboard</Link>
          </Button>
          <Button
            onClick={() => setShowUpgradeModal(true)}
            className="bg-primary text-primary-foreground text-xs font-semibold"
          >
            <Sparkles className="mr-1.5 size-3.5" /> Upgrade Workspace
          </Button>
        </div>
      </div>

      {/* Upgrade modal mock */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-border p-6 rounded-2xl space-y-6 relative">
            <div className="border-b border-border/60 pb-3">
              <h3 className="text-sm font-semibold">Upgrade to BRAHMA Pro</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select a subscription plan parameters.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-border/60 p-4 rounded-xl surface space-y-2 relative overflow-hidden">
                <Badge className="absolute top-2 right-2 text-[8px]" variant="secondary">
                  Active
                </Badge>
                <h4 className="text-xs font-bold text-foreground">Student Free</h4>
                <p className="text-lg font-bold">
                  $0 <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-[10px] text-muted-foreground">Up to 2 team seats.</p>
              </div>

              <div className="border border-primary p-4 rounded-xl surface space-y-2 bg-primary/4">
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="size-3.5 animate-pulse" /> Team Pro
                </h4>
                <p className="text-lg font-bold">
                  $49 <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Unlimited blueprints, custom domains and regional hosting.
                </p>
                <Button
                  size="sm"
                  className="w-full text-[10px] h-7 bg-primary text-primary-foreground mt-2"
                  onClick={() => {
                    toast.success("Upgrade billing requested successfully.");
                    setShowUpgradeModal(false);
                  }}
                >
                  Select Pro
                </Button>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
              <Button size="sm" variant="outline" onClick={() => setShowUpgradeModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
