import React from "react";
import { LogIn, UserPlus, FolderKanban, Check } from "lucide-react";
import { SUSPENDED_THREAD_TOKENS } from "@/styles/vyron-auth-tokens";
import { cn } from "@/lib/utils";

export type AuthThreadMode = "signin" | "signup" | "workspace";

interface SuspendedIdentityThreadsProps {
  activeMode: AuthThreadMode;
  onSelectMode: (mode: AuthThreadMode) => void;
  completedStages?: {
    signin?: boolean;
    signup?: boolean;
    workspace?: boolean;
  };
  className?: string;
}

export function SuspendedIdentityThreads({
  activeMode,
  onSelectMode,
  completedStages = {},
  className,
}: SuspendedIdentityThreadsProps) {
  const threads = [
    {
      id: "signin" as const,
      title: "1. SIGN IN",
      subtitle: "Identity & entry",
      accent: SUSPENDED_THREAD_TOKENS.thread1.accent,
      glow: SUSPENDED_THREAD_TOKENS.thread1.glow,
      icon: LogIn,
      completed: completedStages.signin,
    },
    {
      id: "signup" as const,
      title: "2. CREATE ACCOUNT",
      subtitle: "3-stage setup",
      accent: SUSPENDED_THREAD_TOKENS.thread2.accent,
      glow: SUSPENDED_THREAD_TOKENS.thread2.glow,
      icon: UserPlus,
      completed: completedStages.signup,
    },
    {
      id: "workspace" as const,
      title: "3. CHOOSE WORKSPACE",
      subtitle: "Role activation",
      accent: SUSPENDED_THREAD_TOKENS.thread3.accent,
      glow: SUSPENDED_THREAD_TOKENS.thread3.glow,
      icon: FolderKanban,
      completed: completedStages.workspace,
    },
  ];

  return (
    <div className={cn("w-full max-w-2xl mx-auto mb-6 px-2 select-none", className)}>
      {/* Upper Shared Anchor Bar */}
      <div className="relative flex items-center justify-center">
        {/* Horizontal suspended track */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2A3A35] to-transparent relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        </div>
      </div>

      {/* 3 Hanging Threads & Connected Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 relative pt-1">
        {threads.map((thread) => {
          const isActive = activeMode === thread.id;
          const Icon = thread.icon;

          return (
            <div key={thread.id} className="flex flex-col items-center group">
              {/* Vertical suspended thread cord */}
              <div
                className={cn(
                  "w-px transition-all duration-300",
                  isActive
                    ? "h-4 sm:h-5 bg-gradient-to-b from-cyan-400/50 via-current to-current"
                    : "h-3 sm:h-4 bg-white/15 group-hover:bg-white/30",
                )}
                style={{ color: isActive ? thread.accent : undefined }}
                aria-hidden="true"
              />

              {/* Thread Anchor Node */}
              <div
                className={cn(
                  "size-1.5 rounded-full mb-1 transition-all duration-300",
                  isActive
                    ? "ring-2 ring-offset-1 ring-offset-[#070C0B]"
                    : "bg-white/30 group-hover:bg-white/60",
                )}
                style={{
                  backgroundColor: isActive ? thread.accent : undefined,
                  boxShadow: isActive ? `0 0 8px ${thread.glow}` : undefined,
                }}
                aria-hidden="true"
              />

              {/* Suspended Card */}
              <button
                type="button"
                onClick={() => onSelectMode(thread.id)}
                className={cn(
                  "w-full rounded-xl p-2.5 sm:p-3 text-left transition-all duration-200 border relative overflow-hidden focus:outline-none focus:ring-1",
                  isActive
                    ? "bg-[#101A18]/95 shadow-lg transform -translate-y-0.5"
                    : "bg-[#101A18]/50 hover:bg-[#101A18]/80 text-muted-foreground hover:text-foreground border-white/10 hover:border-white/20",
                )}
                style={{
                  borderColor: isActive ? thread.accent : undefined,
                  boxShadow: isActive ? `0 4px 20px -2px ${thread.glow}` : undefined,
                }}
                aria-selected={isActive}
                aria-label={`${thread.title} - ${thread.subtitle}`}
              >
                {/* Active Accent Header Line */}
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: thread.accent }}
                  />
                )}

                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "size-6 rounded-md flex items-center justify-center transition-colors shrink-0",
                        isActive ? "bg-white/10" : "bg-white/5",
                      )}
                      style={{ color: isActive ? thread.accent : undefined }}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] sm:text-xs font-mono font-bold tracking-wider truncate",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {thread.title}
                    </span>
                  </div>

                  {thread.completed && (
                    <span className="size-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="size-2.5" />
                    </span>
                  )}
                </div>

                <p className="text-[9px] sm:text-[10px] text-muted-foreground/80 truncate pl-7">
                  {thread.subtitle}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
