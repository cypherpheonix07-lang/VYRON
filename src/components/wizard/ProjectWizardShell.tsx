/**
 * PROJECT BRAHMA — PROJECT WIZARD MASTER SHELL (7-STEP GUIDED GENERATOR)
 * Features:
 *   - Step rail (1–7 + Review) with progress % & per-step validity dots
 *   - DraftAutosave (debounce 5s + on step change) writing projects.draft_state
 *   - Resume banner on mount when draft exists
 *   - Discard confirm dialog (nulls draft_state)
 *   - BRA-409 version mismatch recovery card
 *   - Next button disabled until current step schema safeParse passes
 *   - All errors rendered inline under fields
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Save,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import type { WizardPayload, DraftState } from "@/types/wizard";
import { validateStep } from "@/lib/wizardSchemas";
import { Step1Identity } from "./Step1Identity";
import { Step2DomainScale } from "./Step2DomainScale";
import { Step3Audience } from "./Step3Audience";
import { Step4TechStack } from "./Step4TechStack";
import { Step5FeaturesAI } from "./Step5FeaturesAI";
import { Step6Governance } from "./Step6Governance";
import { Step7DeliveryKPIs } from "./Step7DeliveryKPIs";
import { StepReviewSummary } from "./StepReviewSummary";
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
} from "@/components/ui/alert-dialog";

interface WizardShellProps {
  initialDraft?: DraftState | null;
  onGenerateProject: (payload: WizardPayload) => Promise<void>;
  isGenerating?: boolean;
}

const STEP_TITLES = [
  "Identity & Taxonomy",
  "Domain & Scale",
  "Audience & Personas",
  "Technology Stack",
  "Features & AI Tasks",
  "Governance & Release Gates",
  "Delivery & KPIs",
  "Review & Synthesis",
];

const INITIAL_PAYLOAD: WizardPayload = {
  name: "",
  slug: "",
  description: "",
  tags: [],
  icon: "Folder",
  cover: "from-cyan-900/60 via-slate-900 to-slate-950",
  domain: "",
  domain_secondary: [],
  scale: "production",
  target_users: [],
  accessibility: false,
  platforms: ["web"],
  stack: "react-fastapi",
  repo_full_name: null,
  complexity_budget: 5,
  feature_toggles: {
    auth: true,
    search: false,
    audit_logs: true,
    payments: false,
    invoicing: false,
    subscriptions: false,
    cms: false,
    file_uploads: false,
    i18n: false,
    copilot: true,
    analytics: true,
    embeddings: false,
    realtime: false,
    notifications: false,
    pwa: false,
  },
  ai_tasks: {
    requirement_extraction: true,
    architecture_generation: true,
    code_review: true,
    test_generation: false,
    report_prose: false,
    copilot: true,
  },
  gate_strictness: "standard",
  compliance_pack: "none",
  allow_override: true,
  retention: "90d",
  kpi_targets: {
    health_min: 80,
    coverage_min: 75,
    max_critical: 0,
  },
  budget_cap_usd: 15,
  milestone: null,
  cadence: "weekly",
};

const DRAFT_LOCAL_KEY = "brahma_project_wizard_draft_v2";

export const ProjectWizardShell: React.FC<WizardShellProps> = ({
  initialDraft,
  onGenerateProject,
  isGenerating = false,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [payload, setPayload] = useState<WizardPayload>(INITIAL_PAYLOAD);
  const [hasVisitedSteps, setHasVisitedSteps] = useState<Record<number, boolean>>({ 1: true });
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Resume / Version Mismatch Modals
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [stashedDraft, setStashedDraft] = useState<DraftState | null>(null);
  const [versionMismatchModal, setVersionMismatchModal] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Check for existing draft on mount
  useEffect(() => {
    let candidate: Record<string, unknown> | null =
      (initialDraft as unknown as Record<string, unknown>) ?? null;
    if (!candidate) {
      try {
        const local = localStorage.getItem(DRAFT_LOCAL_KEY);
        if (local) candidate = JSON.parse(local) as Record<string, unknown>;
      } catch {
        // ignore parse error
      }
    }

    if (candidate) {
      if (candidate["version"] === 2) {
        setStashedDraft(candidate as unknown as DraftState);
        setShowResumeBanner(true);
      } else {
        // BRA-409 version mismatch
        setStashedDraft(candidate as unknown as DraftState);
        setVersionMismatchModal(true);
      }
    }
  }, [initialDraft]);

  // 2. Draft Autosave Mechanism (Debounced 5s + immediate on step change)
  const persistDraft = useCallback(async (stepNum: number, currentPayload: WizardPayload) => {
    const draftObj: DraftState = {
      step: stepNum,
      payload: currentPayload,
      saved_at: new Date().toISOString(),
      version: 2,
    };

    try {
      localStorage.setItem(DRAFT_LOCAL_KEY, JSON.stringify(draftObj));
      setSavedAt(draftObj.saved_at);

      // Also persist to Supabase if session active
      const { data: userSession } = await supabase.auth.getSession();
      if (userSession?.session?.user?.id) {
        await supabase
          .from("projects")
          .update({ draft_state: draftObj, updated_at: new Date().toISOString() })
          .eq("owner_id", userSession.session.user.id)
          .is("status", "draft");
      }
    } catch (e) {
      console.warn("[Autosave] Failed to write draft_state:", e);
    }
  }, []);

  // Schedule debounced autosave on payload changes
  const updatePayload = (patch: Partial<WizardPayload>) => {
    setPayload((prev) => {
      const next = { ...prev, ...patch };
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        persistDraft(currentStep, next);
      }, 5000);
      return next;
    });
  };

  // Immediate autosave on step change
  const handleStepChange = (targetStep: number) => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    persistDraft(targetStep, payload);
    setCurrentStep(targetStep);
    setHasVisitedSteps((prev) => ({ ...prev, [targetStep]: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Resume Draft action
  const handleResumeDraft = () => {
    if (!stashedDraft) return;
    setPayload(stashedDraft.payload);
    setCurrentStep(stashedDraft.step || 1);
    setSavedAt(stashedDraft.saved_at);
    setShowResumeBanner(false);
    toast.success(
      `Resumed draft at Step ${stashedDraft.step}: ${STEP_TITLES[stashedDraft.step - 1]}`,
    );
  };

  // Discard Draft action
  const handleDiscardDraft = async () => {
    try {
      localStorage.removeItem(DRAFT_LOCAL_KEY);
      const { data: userSession } = await supabase.auth.getSession();
      if (userSession?.session?.user?.id) {
        await supabase
          .from("projects")
          .update({ draft_state: null })
          .eq("owner_id", userSession.session.user.id)
          .is("status", "draft");

        // Write telemetry event
        await supabase.from("activity_events").insert({
          actor_id: userSession.session.user.id,
          actor_name: "System Operator",
          event_type: "system",
          severity: "info",
          title: "Wizard Draft Discarded",
          description: "Operator discarded in-progress project creation wizard draft.",
          payload: { timestamp: new Date().toISOString() },
        });
      }
    } catch {
      // ignore
    }

    setPayload(INITIAL_PAYLOAD);
    setCurrentStep(1);
    setShowResumeBanner(false);
    setStashedDraft(null);
    setVersionMismatchModal(false);
    setDiscardConfirmOpen(false);
    toast.info("Draft discarded. Started fresh project creation.");
  };

  // Calculate validity for each step
  const stepValidationResults = useMemo(() => {
    const results: Record<number, { isValid: boolean; errors: Record<string, string> }> = {};
    for (let i = 1; i <= 7; i++) {
      results[i] = validateStep(i, payload);
    }
    return results;
  }, [payload]);

  // Current Step validity
  const currentStepValidation = (currentStep <= 7 ? stepValidationResults[currentStep] : null) ?? {
    isValid: true,
    errors: {},
  };
  const currentStepErrors = currentStepValidation.errors;

  // Check R1 dependency blocking on Step 5
  const isR1Violated = Boolean(
    payload.feature_toggles["payments"] && !payload.feature_toggles["auth"],
  );
  const isNextDisabled =
    currentStep <= 7
      ? !currentStepValidation.isValid || (currentStep === 5 && isR1Violated)
      : false;

  // Progress percentage (0% at Step 1, 100% at Review)
  const progressPercent = Math.round(((currentStep - 1) / 7) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* Screen reader live region for wizard step transitions */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {currentStep <= 7
          ? `Step ${currentStep} of 7: ${STEP_TITLES[currentStep - 1]}`
          : "Review and Generate Architecture Project"}
      </div>

      {/* 2.1 Resume Banner */}
      {showResumeBanner && stashedDraft && (
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 shadow-sm"
          role="status"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                In-Progress Draft Detected — Step {stashedDraft.step}:{" "}
                {STEP_TITLES[stashedDraft.step - 1]}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                Last autosaved at {new Date(stashedDraft.saved_at).toLocaleTimeString()} (
                {stashedDraft.payload.name || "Untitled"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleResumeDraft}
              className="gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Resume Draft
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDiscardConfirmOpen(true)}
              className="gap-1 text-xs text-muted-foreground hover:text-destructive border-border/70"
            >
              <Trash2 className="h-3.5 w-3.5" /> Discard
            </Button>
          </div>
        </div>
      )}

      {/* 2.1 BRA-409 Version Mismatch Recovery Card */}
      <AlertDialog open={versionMismatchModal} onOpenChange={setVersionMismatchModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
              BRA-409: Draft Version Conflict
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-xs">
              <p>
                An in-progress draft from an older wizard version was detected. The schema contract
                has evolved to v2 (Enhanced Contract Edition).
              </p>
              <p>
                You can start fresh with the new Zod schema contracts, or attempt to migrate
                existing field values into the v2 schema.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardDraft} className="text-xs">
              Start Fresh (Recommended)
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (stashedDraft) {
                  setPayload({ ...INITIAL_PAYLOAD, ...stashedDraft.payload });
                  setVersionMismatchModal(false);
                  toast.success("Migrated compatible draft values into v2 schema.");
                }
              }}
              className="text-xs"
            >
              Attempt Migration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={discardConfirmOpen} onOpenChange={setDiscardConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Discard Saved Wizard Draft?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              This will permanently delete your stored draft state from both local cache and cloud
              storage. All entered values will be reset. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscardDraft}
              className="bg-destructive text-destructive-foreground"
            >
              Confirm Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Step Rail Header & Progress Bar */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-5 shadow-sm backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
              Step {currentStep} of 8 — {STEP_TITLES[currentStep - 1]}
            </span>
            <h1 className="text-lg font-bold text-foreground">
              Project Architecture Synthesizer v2
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <Save className="h-3 w-3 text-emerald-400" />
                Autosaved {new Date(savedAt).toLocaleTimeString()}
              </span>
            )}
            <span className="font-mono text-xs font-bold text-primary">
              {progressPercent}% Completed
            </span>
          </div>
        </div>

        {/* Linear Progress Indicator */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/80">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-primary transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 2.1 Step Rail with per-step validity dots */}
        <nav aria-label="Wizard Steps Progress" className="overflow-x-auto pb-1">
          <ol className="flex items-center justify-between min-w-[620px] gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((stepNum) => {
              const isCurrent = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              const validity = stepValidationResults[stepNum];
              const isValid = stepNum === 8 ? true : validity?.isValid;
              const hasVisited = hasVisitedSteps[stepNum];

              let dotColor = "bg-muted-foreground/30 border-muted-foreground/40";
              if (isValid) {
                dotColor = "bg-emerald-500 border-emerald-400";
              } else if (hasVisited && !isValid) {
                dotColor = "bg-rose-500 border-rose-400";
              }

              return (
                <li key={stepNum} className="flex-1">
                  <button
                    type="button"
                    onClick={() => handleStepChange(stepNum)}
                    className={`group flex w-full flex-col items-center gap-1.5 text-center focus:outline-none ${
                      isCurrent ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-mono font-bold transition-all ${
                          isCurrent
                            ? "bg-primary text-primary-foreground ring-2 ring-primary/40 shadow-sm"
                            : isCompleted
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : stepNum}
                      </span>
                      {stepNum <= 7 && (
                        <span
                          className={`h-2 w-2 rounded-full border ${dotColor} transition-all`}
                          title={isValid ? "Step contract valid" : "Step has validation errors"}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-medium truncate max-w-[85px] block ${
                        isCurrent ? "text-primary font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {(STEP_TITLES[stepNum - 1] ?? "").split(" ")[0]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Main Step Content Card */}
      <div className="rounded-2xl border border-border/70 bg-card/40 p-6 md:p-8 shadow-sm backdrop-blur-md">
        {currentStep === 1 && (
          <Step1Identity payload={payload} onChange={updatePayload} errors={currentStepErrors} />
        )}
        {currentStep === 2 && (
          <Step2DomainScale payload={payload} onChange={updatePayload} errors={currentStepErrors} />
        )}
        {currentStep === 3 && (
          <Step3Audience payload={payload} onChange={updatePayload} errors={currentStepErrors} />
        )}
        {currentStep === 4 && (
          <Step4TechStack payload={payload} onChange={updatePayload} errors={currentStepErrors} />
        )}
        {currentStep === 5 && (
          <Step5FeaturesAI payload={payload} onChange={updatePayload} errors={currentStepErrors} />
        )}
        {currentStep === 6 && (
          <Step6Governance payload={payload} onChange={updatePayload} errors={currentStepErrors} />
        )}
        {currentStep === 7 && (
          <Step7DeliveryKPIs
            payload={payload}
            onChange={updatePayload}
            errors={currentStepErrors}
          />
        )}
        {currentStep === 8 && (
          <StepReviewSummary
            payload={payload}
            onJumpToStep={handleStepChange}
            onGenerate={() => onGenerateProject(payload)}
            isGenerating={isGenerating}
          />
        )}
      </div>

      {/* Wizard Footer Navigation Controls */}
      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-md">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleStepChange(Math.max(currentStep - 1, 1))}
          disabled={currentStep === 1 || isGenerating}
          className="gap-1.5 text-xs font-semibold"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-3">
          {currentStep < 8 && (
            <Button
              type="button"
              onClick={() => handleStepChange(currentStep + 1)}
              disabled={isNextDisabled || isGenerating}
              className="gap-1.5 text-xs font-bold shadow-md min-w-[100px]"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
