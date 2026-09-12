/**
 * PROJECT BRAHMA — RUN ANALYSIS BUTTON (PHASE M.1, FL-01-D)
 * Dual-mode trigger button with mode-aware confirmation modal.
 * Live Mode: dispatches to live scan API.
 * Demo Mode: launches deterministic DemoStageRunner.
 */

import React, { useState } from "react";
import { Play, Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";
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

export interface RunAnalysisButtonProps {
  onStartAnalysis: () => void;
  isRunning?: boolean;
  className?: string;
}

export function RunAnalysisButton({
  onStartAnalysis,
  isRunning = false,
  className = "",
}: RunAnalysisButtonProps) {
  const { isDemo, demoDomain } = useDemoMode();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConfirm = () => {
    setDialogOpen(false);
    onStartAnalysis();
    if (isDemo) {
      toast.success(`Launched Demo Analysis for ${demoDomain?.toUpperCase() || "FINTECH"} platform`);
    } else {
      toast.info("Launched live repository static analysis & gate scan");
    }
  };

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={isRunning}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer ${
            isRunning
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60"
              : isDemo
              ? "bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          } ${className}`}
        >
          {isDemo ? <Sparkles className="size-4 text-amber-950" /> : <Play className="size-4" />}
          <span>{isRunning ? "Analysis Running..." : isDemo ? "Run Demo Analysis" : "Run Analysis"}</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-base">
            {isDemo ? (
              <>
                <Sparkles className="size-4 text-amber-400" />
                <span>Launch Demo Architecture Scan</span>
              </>
            ) : (
              <>
                <Play className="size-4 text-violet-400" />
                <span>Launch Live Static Code Analysis</span>
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-zinc-400">
            {isDemo
              ? `You are in Demo Mode. This will simulate AST parsing, Bandit security scanning, and 7-gate validation for the ${demoDomain || "fintech"} architecture with zero cloud mutations.`
              : "This will clone the active repository branch, compute cyclomatic complexity, run Bandit security rules, and evaluate all 7 architectural release gates."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={`text-xs font-bold ${
              isDemo
                ? "bg-amber-500 hover:bg-amber-400 text-amber-950"
                : "bg-violet-600 hover:bg-violet-500 text-white"
            }`}
          >
            Start Analysis
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
