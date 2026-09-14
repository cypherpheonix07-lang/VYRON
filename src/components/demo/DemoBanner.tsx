/**
 * PROJECT BRAHMA — ENHANCED DEMO CONTROL BANNER
 * Global application-level transformation banner providing:
 * - Real-time scenario switcher (IEEE-CIS Fraud, Brazilian E-Commerce, Clinical Appointments)
 * - Deterministic Reset Demo button (purges synthetic events with zero production contamination)
 * - Live anomaly burst injection
 * - Direct launcher for Brahma Demo Copilot
 * - Session duration counter and clean exit workflow
 * Strictly ZERO SQL.
 */

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  LogOut,
  Clock,
  RotateCcw,
  Zap,
  Bot,
  Database,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { demoStore } from "@/state/demo/demoStore";
import { eventSimulator } from "@/services/demo/eventSimulator";
import { analysisStore } from "@/state/analysis/analysisStore";
import { useCopilot } from "@/state/copilot/useCopilot";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DemoBanner() {
  const { isDemo, activatedAt, deactivate, demoDomain } = useDemoMode();
  const { setDrawerOpen, sendMessage } = useCopilot();
  const navigate = useNavigate();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState(() => demoStore.getState().selectedDatasetId);
  const [isInjecting, setIsInjecting] = useState(false);

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

  const handleBenchmarkChange = (newDatasetId: string) => {
    setSelectedBenchmarkId(newDatasetId);
    demoStore.selectDataset(newDatasetId);
    toast.success(`Demo benchmark switched to: ${newDatasetId}`);
  };

  const handleInjectAnomaly = () => {
    setIsInjecting(true);
    eventSimulator.injectAnomalyWave(5);
    toast.warning("Injected 5 high-velocity anomaly deviations into simulator.");
    setTimeout(() => setIsInjecting(false), 400);
  };

  const handleResetDemo = () => {
    eventSimulator.reset();
    analysisStore.reset();
    toast.info("Demo environment deterministically reset to baseline.");
  };

  const handleOpenDemoCopilot = () => {
    setDrawerOpen(true);
    sendMessage("Explain the current demo scenario and highlight top detected anomalies.");
  };

  const handleExitDemo = () => {
    deactivate();
    navigate({ to: "/app" });
  };

  return (
    <div
      className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-amber-950 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-lg text-xs font-medium select-none no-print-demo border-b border-amber-600/30"
      role="alert"
      aria-live="polite"
    >
      {/* Left: Indicator & Scenario Selector */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5 font-bold tracking-wide uppercase text-[11px] bg-amber-950/10 px-2 py-0.5 rounded-md border border-amber-950/20">
          <span className="size-2 rounded-full bg-amber-950 animate-ping" />
          <span className="size-2 rounded-full bg-amber-950" />
          <span>DEMO SIMULATION</span>
        </div>

        {/* Benchmark Scenario Dropdown */}
        <div className="flex items-center gap-1.5 text-xs">
          <Database className="size-3.5 text-amber-950/80" />
          <select
            value={selectedBenchmarkId}
            onChange={(e) => handleBenchmarkChange(e.target.value)}
            className="text-xs bg-amber-600/20 border border-amber-950/20 rounded-lg px-2 py-0.5 text-amber-950 font-bold focus:outline-none focus:ring-1 focus:ring-amber-950"
          >
            <option value="ieee_fraud_benchmark">IEEE-CIS Fraud Detection (Fintech)</option>
            <option value="ecommerce_orders">Olist Brazilian E-Commerce</option>
            <option value="clinical_scheduling">Clinical Appointments Brazil</option>
          </select>
        </div>
      </div>

      {/* Right: Actions, Timer, Reset, and Exit */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Quick Inject Button */}
        <button
          type="button"
          onClick={handleInjectAnomaly}
          disabled={isInjecting}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/15 hover:bg-amber-950/25 text-amber-950 font-semibold text-[11px] transition-colors border border-amber-950/20 active:scale-95"
          title="Inject synthetic fraud wave into event simulator"
        >
          <Zap className={cn("size-3", isInjecting && "animate-spin")} />
          <span>Inject Surge</span>
        </button>

        {/* Reset Demo Button */}
        <button
          type="button"
          onClick={handleResetDemo}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/15 hover:bg-amber-950/25 text-amber-950 font-semibold text-[11px] transition-colors border border-amber-950/20 active:scale-95"
          title="Reset simulated events and telemetry to pristine state"
        >
          <RotateCcw className="size-3" />
          <span>Reset Demo</span>
        </button>

        {/* Open Demo Copilot */}
        <button
          type="button"
          onClick={handleOpenDemoCopilot}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950 text-amber-100 hover:bg-black font-semibold text-[11px] transition-colors shadow-sm"
          title="Open Vyron Demo Copilot"
        >
          <Bot className="size-3 text-amber-400" />
          <span>Demo Copilot</span>
        </button>

        {/* Timer */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-950 bg-amber-950/10 px-2 py-1 rounded-md border border-amber-950/20">
          <Clock className="size-3" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Exit Demo Button */}
        <button
          type="button"
          onClick={handleExitDemo}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/90 text-red-100 hover:bg-red-950 font-semibold text-[11px] transition-colors shadow-sm"
          aria-label="Exit Demo Mode"
        >
          <span>Exit</span>
          <LogOut className="size-3" />
        </button>
      </div>
    </div>
  );
}
