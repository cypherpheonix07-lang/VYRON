/**
 * PROJECT BRAHMA — DEMO BANNER (PHASE I.1, FL-02-A)
 * Sticky amber warning banner indicating active synthetic demonstration mode.
 * Hidden in print media. Shows real-time session duration counter.
 */

import React, { useState, useEffect } from "react";
import { AlertCircle, LogOut, Clock } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { useNavigate } from "@tanstack/react-router";

export function DemoBanner() {
  const { isDemo, activatedAt, deactivate, demoDomain } = useDemoMode();
  const navigate = useNavigate();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isDemo || !activatedAt) return;

    const interval = setInterval(() => {
      const sec = Math.floor((Date.now() - activatedAt) / 1000);
      setElapsedSeconds(sec);
    }, 1000);

    return () => clearInterval(interval);
  }, [isDemo, activatedAt]);

  if (!isDemo) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleExitDemo = () => {
    deactivate();
    navigate({ to: "/" });
  };

  return (
    <div
      className="sticky top-0 z-50 w-full bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-between shadow-md text-xs font-medium animate-demo-mount no-print-demo select-none"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className="size-4 shrink-0 text-amber-950" />
        <div>
          <span className="font-extrabold uppercase tracking-wide">
            DEMO MODE — Using sample data. No changes are saved.
          </span>
          <span className="ml-2 text-amber-900 hidden sm:inline">
            Domain: <strong className="uppercase">{demoDomain || "fintech"}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-900 bg-amber-600/20 px-2 py-0.5 rounded border border-amber-900/20">
          <Clock className="size-3" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>

        <button
          type="button"
          onClick={handleExitDemo}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950 text-amber-100 hover:bg-black font-semibold text-xs transition-colors cursor-pointer shadow-sm"
          aria-label="Exit Demo Mode"
        >
          <span>Exit Demo</span>
          <LogOut className="size-3" />
        </button>
      </div>
    </div>
  );
}
