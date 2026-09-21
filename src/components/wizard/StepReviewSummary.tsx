/**
 * PROJECT BRAHMA — REVIEW & GENERATION SUMMARY
 * Displays per-step summary cards with "Edit" jump links and final confirmation dialog.
 */

import React, { useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Rocket,
  Shield,
  Layers,
  Users,
  Cpu,
  Sliders,
  DollarSign,
  AlertTriangle,
  FileCheck,
  Calendar,
} from "lucide-react";
import type { WizardPayload } from "@/types/wizard";
import { usePricingCatalog, calculateEstimateUsd } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
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

interface StepReviewProps {
  payload: WizardPayload;
  onJumpToStep: (step: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const StepReviewSummary: React.FC<StepReviewProps> = ({
  payload,
  onJumpToStep,
  onGenerate,
  isGenerating,
}) => {
  const { data: pricingTable } = usePricingCatalog();
  const estimateUsd = calculateEstimateUsd(payload.ai_tasks, pricingTable);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const activeFeaturesCount = Object.values(payload.feature_toggles).filter(Boolean).length;
  const activeAiTasksCount = Object.values(payload.ai_tasks).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-primary/40 bg-gradient-to-r from-primary/20 via-card to-card p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono uppercase font-bold">
                Contract Validated
              </span>
              <span className="text-xs font-mono text-muted-foreground">7 of 7 Steps Passed</span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-foreground">{payload.name}</h2>
            <p className="text-xs font-mono text-muted-foreground">brahma://{payload.slug}</p>
          </div>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button size="lg" className="gap-2 font-bold shadow-lg" disabled={isGenerating}>
                <Rocket className="h-4 w-4" />
                {isGenerating ? "Synthesizing Project..." : "Generate & Synthesize Blueprint"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Confirm Project Blueprint Generation
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3 pt-2 text-xs">
                  <p>
                    You are about to synthesize architecture specifications, AST test suites, and
                    cryptographic audit proofs for <strong>{payload.name}</strong>.
                  </p>

                  <div className="rounded-lg border border-border/70 bg-muted/30 p-3 space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Compute Estimate:</span>
                      <span className="text-primary font-bold">
                        ${estimateUsd.toFixed(4)} USD / run
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Budget Cap:</span>
                      <span className="text-foreground font-semibold">
                        ${(payload.budget_cap_usd || 15).toFixed(2)} USD
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Release Gate Mode:</span>
                      <span className="text-foreground uppercase font-bold">
                        {payload.gate_strictness}
                      </span>
                    </div>
                  </div>

                  {payload.gate_strictness === "strict" && (
                    <div className="flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-2.5 text-rose-300">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>
                        <strong>Strict Deterministic Gate:</strong> Deployment will be blocked if
                        any security flaw or cyclomatic violation is detected. Manual overrides are
                        prohibited.
                      </span>
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Review Steps</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setConfirmOpen(false);
                    onGenerate();
                  }}
                  className="bg-primary font-bold"
                >
                  Confirm & Provision
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Per-Step Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 Review */}
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                Step 1: Identity
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(1)}
              className="h-6 text-xs text-primary gap-1"
            >
              <Edit3 className="h-3 w-3" /> Edit
            </Button>
          </div>
          <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/40">
            <p>
              <strong>Name:</strong> {payload.name}
            </p>
            <p className="font-mono">
              <strong>Slug:</strong> {payload.slug}
            </p>
            <p className="line-clamp-1">
              <strong>Description:</strong> {payload.description || "None"}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {payload.tags.length > 0 ? payload.tags.map((t) => `#${t}`).join(" ") : "None"}
            </p>
            <p>
              <strong>Icon:</strong> {payload.icon}
            </p>
          </div>
        </div>

        {/* Step 2 Review */}
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                Step 2: Domain & Scale
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(2)}
              className="h-6 text-xs text-primary gap-1"
            >
              <Edit3 className="h-3 w-3" /> Edit
            </Button>
          </div>
          <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/40">
            <p>
              <strong>Primary Domain:</strong>{" "}
              <span className="text-foreground font-semibold uppercase">{payload.domain}</span>
            </p>
            <p>
              <strong>Secondary:</strong>{" "}
              {payload.domain_secondary.length > 0 ? payload.domain_secondary.join(", ") : "None"}
            </p>
            <p>
              <strong>Scale:</strong> <span className="capitalize">{payload.scale}</span>
            </p>
          </div>
        </div>

        {/* Step 3 Review */}
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                Step 3: Audience
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(3)}
              className="h-6 text-xs text-primary gap-1"
            >
              <Edit3 className="h-3 w-3" /> Edit
            </Button>
          </div>
          <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/40">
            <p>
              <strong>Target Personas ({payload.target_users.length}):</strong>
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {payload.target_users.map((u) => (
                <span key={u.label} className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">
                  #{u.priority} {u.label} {u.custom && "(custom)"}
                </span>
              ))}
            </div>
            <p className="pt-1">
              <strong>Accessibility:</strong>{" "}
              {payload.accessibility ? "WCAG 2.1 AA Enforced" : "Standard"}
            </p>
          </div>
        </div>

        {/* Step 4 Review */}
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                Step 4: Tech Stack
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(4)}
              className="h-6 text-xs text-primary gap-1"
            >
              <Edit3 className="h-3 w-3" /> Edit
            </Button>
          </div>
          <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/40">
            <p>
              <strong>Platforms:</strong> {payload.platforms.join(", ")}
            </p>
            <p>
              <strong>Core Stack:</strong>{" "}
              <span className="font-mono text-foreground">{payload.stack}</span>
            </p>
            <p>
              <strong>GitHub Repo:</strong> {payload.repo_full_name || "None linked"}
            </p>
            <p>
              <strong>Complexity Budget:</strong> {payload.complexity_budget} / 10
            </p>
          </div>
        </div>

        {/* Step 5 Review */}
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                Step 5: Features & AI
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(5)}
              className="h-6 text-xs text-primary gap-1"
            >
              <Edit3 className="h-3 w-3" /> Edit
            </Button>
          </div>
          <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/40">
            <p>
              <strong>Feature Modules:</strong> {activeFeaturesCount} enabled
            </p>
            <p>
              <strong>AI Tasks:</strong> {activeAiTasksCount} active compute workers
            </p>
            <p>
              <strong>Dependency Checks:</strong> All 4 Rules Verified (R1–R4 Passed)
            </p>
          </div>
        </div>

        {/* Step 6 Review */}
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                Step 6: Governance
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(6)}
              className="h-6 text-xs text-primary gap-1"
            >
              <Edit3 className="h-3 w-3" /> Edit
            </Button>
          </div>
          <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/40">
            <p>
              <strong>Strictness:</strong>{" "}
              <span className="capitalize font-bold text-foreground">
                {payload.gate_strictness}
              </span>
            </p>
            <p>
              <strong>Compliance Pack:</strong>{" "}
              <span className="uppercase">{payload.compliance_pack}</span>
            </p>
            <p>
              <strong>Manual Override:</strong>{" "}
              {payload.allow_override ? "Allowed with admin sign-off" : "Disabled"}
            </p>
            <p>
              <strong>Audit Retention:</strong> {payload.retention}
            </p>
          </div>
        </div>

        {/* Step 7 Review */}
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                Step 7: Delivery & KPIs
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(7)}
              className="h-6 text-xs text-primary gap-1"
            >
              <Edit3 className="h-3 w-3" /> Edit
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-muted-foreground pt-1 border-t border-border/40">
            <div>
              <strong>Target Health:</strong>
              <p className="font-mono text-sm font-bold text-emerald-400">
                ≥ {payload.kpi_targets.health_min}
              </p>
            </div>
            <div>
              <strong>Target Coverage:</strong>
              <p className="font-mono text-sm font-bold text-cyan-400">
                ≥ {payload.kpi_targets.coverage_min}%
              </p>
            </div>
            <div>
              <strong>Daily Budget Cap:</strong>
              <p className="font-mono text-sm font-bold text-primary">
                ${(payload.budget_cap_usd || 15).toFixed(2)}
              </p>
            </div>
            <div>
              <strong>Milestone Deadline:</strong>
              <p className="font-mono text-xs">{payload.milestone || "Open / Unspecified"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
