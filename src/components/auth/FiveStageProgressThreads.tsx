import React from "react";
import { Check, AlertCircle, Lock, User, ShieldCheck, FolderKanban, Sparkles, Key } from "lucide-react";
import { FIVE_STAGE_ONBOARDING_TOKENS } from "@/styles/vyron-auth-tokens";
import { cn } from "@/lib/utils";

export type OnboardingStageId = 1 | 2 | 3 | 4 | 5;

export type StageStatus = "pending" | "active" | "completed" | "error" | "blocked";

interface FiveStageProgressThreadsProps {
  currentStage: OnboardingStageId;
  completedStages: Record<number, boolean>;
  stageErrors?: Record<number, string | null>;
  onSelectStage?: (stage: OnboardingStageId) => void;
  completingStageId?: number | null; // For firing orbital progress reveal arc
  className?: string;
}

const STAGE_CONFIGS = [
  {
    stage: 1 as OnboardingStageId,
    meta: FIVE_STAGE_ONBOARDING_TOKENS.stage1,
    icon: User,
  },
  {
    stage: 2 as OnboardingStageId,
    meta: FIVE_STAGE_ONBOARDING_TOKENS.stage2,
    icon: ShieldCheck,
  },
  {
    stage: 3 as OnboardingStageId,
    meta: FIVE_STAGE_ONBOARDING_TOKENS.stage3,
    icon: FolderKanban,
  },
  {
    stage: 4 as OnboardingStageId,
    meta: FIVE_STAGE_ONBOARDING_TOKENS.stage4,
    icon: Key,
  },
  {
    stage: 5 as OnboardingStageId,
    meta: FIVE_STAGE_ONBOARDING_TOKENS.stage5,
    icon: Sparkles,
  },
];

export function FiveStageProgressThreads({
  currentStage,
  completedStages,
  stageErrors = {},
  onSelectStage,
  completingStageId = null,
  className,
}: FiveStageProgressThreadsProps) {
  // Determine overall progress percentage (0% to 100%)
  const completedCount = Object.values(completedStages).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.max(0, ((currentStage - 1) / 4) * 100));

  return (
    <div
      className={cn("w-full max-w-xl mx-auto mb-6 px-2 select-none", className)}
      role="progressbar"
      aria-label="Five-stage onboarding progress"
      aria-valuenow={currentStage}
      aria-valuemin={1}
      aria-valuemax={5}
    >
      {/* Upper Suspended Track and Connecting Illuminated SVG Thread */}
      <div className="relative mb-2">
        {/* Track baseline */}
        <div className="h-0.5 w-full bg-white/10 rounded-full relative overflow-hidden">
          {/* Animated Illuminated Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-[#0C7075] via-[#0F969C] to-[#00C896] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 5 Suspended Stage Nodes */}
      <div className="grid grid-cols-5 gap-1.5 relative">
        {STAGE_CONFIGS.map(({ stage, meta, icon: Icon }) => {
          const isCompleted = Boolean(completedStages[stage]);
          const isActive = currentStage === stage;
          const isError = Boolean(stageErrors[stage]);
          const isBlocked = stage > currentStage && !isCompleted;
          const isOrbitalAnimating = completingStageId === stage;

          // Status derivation
          const status: StageStatus = isError
            ? "error"
            : isActive
              ? "active"
              : isCompleted
                ? "completed"
                : isBlocked
                  ? "blocked"
                  : "pending";

          // Accessible stage click (allow going back to previously completed stages or current)
          const isClickable = Boolean(onSelectStage) && (isCompleted || stage <= currentStage);

          return (
            <button
              key={stage}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelectStage?.(stage)}
              className={cn(
                "group flex flex-col items-center text-center p-1.5 rounded-xl transition-all relative focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0F969C]",
                isClickable ? "cursor-pointer hover:bg-white/5" : "cursor-default opacity-60",
                isActive ? "bg-white/[0.04]" : "",
              )}
              aria-label={`${meta.fullName} - ${status} stage`}
              aria-current={isActive ? "step" : undefined}
            >
              {/* Suspended Cord */}
              <div
                className={cn(
                  "w-px transition-all duration-300",
                  isActive
                    ? "h-2.5 bg-gradient-to-b from-[#0F969C] to-[#6DA5C0]"
                    : isCompleted
                      ? "h-2 bg-emerald-500/60"
                      : "h-1.5 bg-white/10",
                )}
                aria-hidden="true"
              />

              {/* Node Orb with Optional Orbital Completion Arc */}
              <div className="relative size-8 mb-1 flex items-center justify-center">
                {/* Orbital Arc SVG when completing */}
                {(isOrbitalAnimating || (isActive && !isCompleted)) && (
                  <svg
                    className={cn(
                      "absolute inset-0 size-8 pointer-events-none -rotate-90",
                      isOrbitalAnimating && "vyron-orbital-spin",
                    )}
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke={meta.accent}
                      strokeWidth="2"
                      strokeDasharray="88"
                      strokeDashoffset={isOrbitalAnimating ? "0" : "44"}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                )}

                {/* Main Orb Center */}
                <div
                  className={cn(
                    "size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all relative border",
                    isActive
                      ? "bg-[#1A1A1A] text-foreground border-white/40 ring-2 shadow-lg"
                      : isCompleted
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                        : isError
                          ? "bg-destructive/20 text-destructive border-destructive/40"
                          : "bg-black/40 text-muted-foreground border-white/10 group-hover:border-white/20",
                  )}
                  style={{
                    boxShadow: isActive ? `0 0 12px ${meta.glow}` : undefined,
                    borderColor: isActive ? meta.accent : undefined,
                  }}
                >
                  {isCompleted ? (
                    <Check className="size-3.5 stroke-[2.5]" />
                  ) : isError ? (
                    <AlertCircle className="size-3.5 text-destructive" />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                </div>
              </div>

              {/* Node Label */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold tracking-tight truncate max-w-full",
                    isActive
                      ? "text-foreground"
                      : isCompleted
                        ? "text-emerald-400/90"
                        : "text-muted-foreground",
                  )}
                >
                  {meta.number}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-medium tracking-tight truncate max-w-full hidden sm:block",
                    isActive ? "text-[#E2E8F0]" : "text-muted-foreground/70",
                  )}
                >
                  {meta.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
