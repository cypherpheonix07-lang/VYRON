/**
 * PROJECT BRAHMA — DEMO MODE TOGGLE (FL-02-A STEP 4)
 * Header / settings control providing confirmation flow before switching to synthetic data.
 */

import React, { useState } from "react";
import { Sparkles, LogOut } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DemoModeToggle({ className = "" }: { className?: string }) {
  const { isDemo, activate, deactivate, demoDomain } = useDemoMode();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmActivate = () => {
    activate("demo-project-brahma-showcase", demoDomain || "fintech");
    setIsDialogOpen(false);
    toast.success("Entered Demo Mode — Using synthetic FinLedger benchmark");
  };

  const handleDeactivate = () => {
    deactivate();
    toast.info("Returned to Live Stack");
  };

  if (isDemo) {
    return (
      <button
        type="button"
        onClick={handleDeactivate}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-amber-950 hover:bg-amber-400 font-bold text-xs transition-all shadow-md cursor-pointer ${className}`}
        aria-label="Exit Demo Mode"
      >
        <LogOut className="size-3.5" />
        <span>Exit Demo</span>
      </button>
    );
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-all cursor-pointer ${className}`}
        >
          <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
          <span>Enter Demo Mode</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-400">
            <Sparkles className="size-5" />
            Enter Brahma Demo Mode?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400 text-xs leading-relaxed space-y-2">
            <p>
              The interface will transform into an isolated simulation backed by realistic synthetic
              project benchmarks (FinLedger microservices architecture, 47 findings, 7 release gates).
            </p>
            <p className="font-semibold text-zinc-300">
              &bull; Zero live database writes will occur.
              <br />
              &bull; Synthetic sessions expire automatically when you close this browser tab.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmActivate}
            className="bg-amber-500 text-amber-950 hover:bg-amber-400 text-xs font-bold"
          >
            Enter Demo Mode
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
