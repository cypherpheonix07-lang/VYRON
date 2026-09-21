import React, { useState } from "react";
import { Sparkles, Check, AlertCircle } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

export function DemoModeToggle({ className }: { className?: string }) {
  const { isDemoMode, setDemoMode } = useDemoMode();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setDemoMode(!isDemoMode);
  };

  return (
    <>
      <button
        onClick={handleClick}
        type="button"
        title="Demo mode — no real data is modified"
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all shadow-sm",
          isDemoMode
            ? "bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30"
            : "bg-secondary/40 text-muted-foreground border-border/80 hover:text-foreground hover:bg-secondary/60",
          className,
        )}
      >
        <Sparkles
          className={cn(
            "size-3.5",
            isDemoMode ? "text-amber-400 animate-pulse" : "text-muted-foreground",
          )}
        />
        <span>{isDemoMode ? "DEMO MODE" : "Live Stack"}</span>
      </button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={isDemoMode ? "Switch to Live Production Stack?" : "Switch to Demo Mode?"}
        description={
          isDemoMode
            ? "This will reconnect all queries and actions directly to your live Supabase database and FastAPI engine."
            : "This will populate all sections with pre-seeded sample data for demonstration purposes without modifying live database records."
        }
        confirmLabel={isDemoMode ? "Switch to Live" : "Enable Demo Mode"}
        variant={isDemoMode ? "default" : "warning"}
        onConfirm={handleConfirm}
      />
    </>
  );
}
