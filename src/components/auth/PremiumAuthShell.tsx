import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SuspendedIdentityThreads, type AuthThreadMode } from "./SuspendedIdentityThreads";
import { MidnightCoralSignIn } from "./MidnightCoralSignIn";
import { IndigoAuroraSignUp } from "./IndigoAuroraSignUp";
import { WorkspaceSelectionModal } from "./WorkspaceSelectionModal";
import { GraphiteOceanShowcase } from "./GraphiteOceanShowcase";
import { BrahmaLogo } from "@/components/brahma/logo";
import { useAuth, resolvePostLoginRoute, type Role } from "@/lib/auth";

interface PremiumAuthShellProps {
  initialMode?: AuthThreadMode;
}

export function PremiumAuthShell({ initialMode = "signin" }: PremiumAuthShellProps) {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [activeMode, setActiveMode] = useState<AuthThreadMode>(initialMode);
  const [completedStages, setCompletedStages] = useState<{
    signin?: boolean;
    signup?: boolean;
    workspace?: boolean;
  }>({});

  const handleAuthSuccess = async (destination?: string) => {
    await refresh?.();
    setCompletedStages((prev) => ({ ...prev, [activeMode]: true }));

    // If user signs in or completes signup, offer brief workspace selection or route directly
    if (destination) {
      navigate({ to: destination as never });
    } else if (activeMode === "signin") {
      // Transition to workspace selection or dashboard
      setActiveMode("workspace");
    } else {
      const dest = resolvePostLoginRoute(user?.role);
      navigate({ to: dest as never });
    }
  };

  const handleSelectWorkspace = (role: Role) => {
    setCompletedStages((prev) => ({ ...prev, workspace: true }));
    const dest = resolvePostLoginRoute(role);
    navigate({ to: dest as never });
  };

  return (
    <div className="relative min-h-screen w-screen bg-[#050505] text-[#F8FAFC] flex flex-col font-sans overflow-x-hidden selection:bg-purple-600/30 selection:text-white">
      {/* Background Subtle Gradient Glow (Royal Smoke & Obsidian Glow) */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30 transition-all duration-700"
        style={{
          backgroundImage:
            activeMode === "signup"
              ? "radial-gradient(circle at 25% 25%, rgba(58, 12, 163, 0.28) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(31, 10, 87, 0.22) 0%, transparent 55%)"
              : "radial-gradient(circle at 25% 25%, rgba(106, 13, 173, 0.28) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(74, 20, 120, 0.20) 0%, transparent 55%)",
        }}
        aria-hidden="true"
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Interactive Authentication Column */}
        <div className="flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto relative z-10">
          {/* Header Branding */}
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <BrahmaLogo className="h-7 w-7 text-primary" />
              <div>
                <span className="text-sm font-bold tracking-tight text-[#F3F7F5] font-mono">
                  VYRON / ATHER
                </span>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  Autonomous Engineering Platform
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>STABLE ACCESS</span>
            </div>
          </div>

          {/* Suspended Identity Flow (Hanging Threads) */}
          <div className="my-6">
            <SuspendedIdentityThreads
              activeMode={activeMode}
              onSelectMode={(mode) => setActiveMode(mode)}
              completedStages={completedStages}
            />

            {/* Main Interactive Stage Panel */}
            <div className="transition-all duration-300">
              {activeMode === "signin" && (
                <MidnightCoralSignIn
                  onSuccess={handleAuthSuccess}
                  onSwitchToSignUp={() => setActiveMode("signup")}
                  onSwitchToWorkspace={() => setActiveMode("workspace")}
                />
              )}

              {activeMode === "signup" && (
                <IndigoAuroraSignUp
                  onSuccess={handleAuthSuccess}
                  onSwitchToSignIn={() => setActiveMode("signin")}
                  onSwitchToWorkspace={() => setActiveMode("workspace")}
                />
              )}

              {activeMode === "workspace" && (
                <WorkspaceSelectionModal onSelectWorkspace={handleSelectWorkspace} />
              )}
            </div>
          </div>

          {/* Footer Copyright & Legal */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
            <span>© 2026 VYRON Engineering Intelligence. All rights reserved.</span>
            <div className="flex items-center gap-3 font-mono text-[10px]">
              <span className="text-muted-foreground/60">Zero-Fiction Law</span>
              <span>•</span>
              <span className="text-muted-foreground/60">WCAG 2.2 AA</span>
            </div>
          </div>
        </div>

        {/* Right Column: Industry-Grade Product Showcase */}
        <div className="relative z-10">
          <GraphiteOceanShowcase />
        </div>
      </div>
    </div>
  );
}
