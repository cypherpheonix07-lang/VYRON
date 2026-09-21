/**
 * PROJECT BRAHMA — READ-ONLY GUARD (PHASE I.3, LAW I.5, FL-02-B)
 * Intercepts mutations and write actions when Demo Mode is active.
 * Renders children with 50% opacity, disabled pointer events, and user-friendly toast alerts.
 */

import React from "react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export interface ReadOnlyGuardProps {
  action?: string;
  resource?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  showLockIcon?: boolean;
}

export function ReadOnlyGuard({
  action = "modify",
  resource = "resource",
  children,
  fallback,
  className = "",
  showLockIcon = false,
}: ReadOnlyGuardProps) {
  const { isDemo } = useDemoMode();

  if (!isDemo) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.warning(`Cannot ${action} ${resource}: disabled in Demo Mode.`);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block cursor-not-allowed select-none ${className}`}
      title={`This action is disabled in demo mode`}
    >
      <div className="opacity-50 pointer-events-none filter grayscale-[40%] flex items-center gap-1">
        {showLockIcon && <Lock className="size-3 text-amber-400 shrink-0" />}
        {children}
      </div>
    </div>
  );
}
