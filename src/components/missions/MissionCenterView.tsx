/**
 * PROJECT BRAHMA — MISSION CENTER VIEW
 * Central control room for Engineering Missions.
 * Tracks multi-step autonomous plans, assigned agents, real-time step advancements,
 * evidence logs, and sealed audit reports.
 */

import React, { useState, useEffect } from "react";
import {
  Target,
  Play,
  Pause,
  XCircle,
  CheckCircle2,
  Clock,
  Activity,
  Bot,
  PlusCircle,
  FileText,
  Shield,
  ArrowRight,
  RotateCw,
} from "lucide-react";
import { missionEngine, EngineeringMission, MissionStatus } from "@/services/missions/missionEngine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MissionCenterView() {
  const [missions, setMissions] = useState<EngineeringMission[]>(() => missionEngine.listMissions());
  const [selectedMissionId, setSelectedMissionId] = useState<string>(
    () => missions[0]?.id || "",
  );

  useEffect(() => {
    return missionEngine.subscribe((updated) => {
      setMissions(updated);
      if (!selectedMissionId && updated[0]) {
        setSelectedMissionId(updated[0].id);
      }
    });
  }, [selectedMissionId]);

  const activeMission = missions.find((m) => m.id === selectedMissionId) || missions[0];

  const handleStart = (id: string) => {
    missionEngine.startMission(id);
    toast.success("Mission started.");
  };

  const handlePause = (id: string) => {
    missionEngine.pauseMission(id);
    toast.info("Mission paused.");
  };

  const handleResume = (id: string) => {
    missionEngine.resumeMission(id);
    toast.success("Mission resumed.");
  };

  const handleCancel = (id: string) => {
    missionEngine.cancelMission(id);
    toast.warning("Mission cancelled by operator.");
  };

  const handleAdvance = (id: string) => {
    missionEngine.advanceStep(id, "Step validated and certified by agent.", "AST Scan Proof");
    toast.success("Advanced mission step.");
  };

  const handleCreateNew = () => {
    const newMsn = missionEngine.createMission({
      title: "Comprehensive Security & Contract Audit",
      objective: "Audit unmitigated CWE vulnerabilities, verify OpenAPI contracts, and test settlement retry flows.",
      priority: "CRITICAL",
    });
    setSelectedMissionId(newMsn.id);
    toast.success(`Created Engineering Mission ${newMsn.id}`);
  };

  const getStatusBadge = (status: MissionStatus) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">COMPLETED</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">IN PROGRESS</Badge>;
      case "PAUSED":
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">PAUSED</Badge>;
      case "CANCELLED":
        return <Badge className="bg-zinc-500/20 text-zinc-300 border-zinc-500/30">CANCELLED</Badge>;
      default:
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">PLANNING</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-primary/5 to-card backdrop-blur-xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              Autonomous Control Plane
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Total Missions: {missions.length}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Engineering Mission Center
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Goal-oriented autonomous engineering missions orchestrating multi-agent delegation,
            evidence collection, and verifiable release seals.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleCreateNew}
          className="text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-md shadow-primary/20"
        >
          <PlusCircle className="size-3.5" />
          <span>New Mission</span>
        </Button>
      </div>

      {/* Main Grid: Mission List (4 cols) + Active Mission Detail (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mission Directory */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
            Active & Past Missions
          </h2>

          <div className="space-y-2">
            {missions.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMissionId(m.id)}
                className={cn(
                  "p-3.5 rounded-xl border cursor-pointer transition-all space-y-2",
                  m.id === selectedMissionId
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border/60 bg-card/60 hover:border-border",
                )}
              >
                <div className="flex items-center justify-between">
                  {getStatusBadge(m.status)}
                  <span className="text-[10px] text-muted-foreground font-mono">{m.id}</span>
                </div>
                <h3 className="text-xs font-bold text-foreground line-clamp-1">{m.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{m.steps.length} steps</span>
                  <span>{m.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mission Detail & Execution Stepper */}
        {activeMission ? (
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-xl border border-border/80 bg-card/80 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(activeMission.status)}
                    <span className="text-xs text-muted-foreground font-mono">
                      Started: {new Date(activeMission.startedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-foreground mt-1">{activeMission.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeMission.objective}</p>
                </div>

                {/* Mission Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  {activeMission.status === "PLANNING" && (
                    <Button
                      size="sm"
                      onClick={() => handleStart(activeMission.id)}
                      className="text-xs font-bold bg-primary text-primary-foreground gap-1.5"
                    >
                      <Play className="size-3" />
                      <span>Start Mission</span>
                    </Button>
                  )}
                  {activeMission.status === "IN_PROGRESS" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePause(activeMission.id)}
                        className="text-xs gap-1 border-border/80"
                      >
                        <Pause className="size-3" />
                        <span>Pause</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAdvance(activeMission.id)}
                        className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      >
                        <CheckCircle2 className="size-3" />
                        <span>Advance Step</span>
                      </Button>
                    </>
                  )}
                  {activeMission.status === "PAUSED" && (
                    <Button
                      size="sm"
                      onClick={() => handleResume(activeMission.id)}
                      className="text-xs font-bold bg-primary text-primary-foreground gap-1"
                    >
                      <Play className="size-3" />
                      <span>Resume</span>
                    </Button>
                  )}
                  {activeMission.status !== "COMPLETED" && activeMission.status !== "CANCELLED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCancel(activeMission.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    >
                      <XCircle className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Steps Progress List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Task Execution Steps ({activeMission.steps.length})
                </h3>

                <div className="space-y-2.5">
                  {activeMission.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={cn(
                        "p-3.5 rounded-xl border transition-colors flex items-start gap-3 text-xs",
                        step.status === "COMPLETED"
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : step.status === "RUNNING"
                            ? "border-primary/50 bg-primary/10 shadow-sm"
                            : "border-border/60 bg-card/40",
                      )}
                    >
                      <span className="grid size-6 place-items-center rounded-full bg-secondary text-primary font-mono text-[11px] shrink-0">
                        {step.status === "COMPLETED" ? (
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                        ) : step.status === "RUNNING" ? (
                          <Activity className="size-3.5 text-primary animate-spin" />
                        ) : (
                          idx + 1
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-foreground">{step.title}</p>
                          <Badge className="text-[10px] bg-secondary text-muted-foreground border-border/40">
                            {step.assignedAgent}
                          </Badge>
                        </div>
                        {step.resultSummary && (
                          <p className="text-[11px] text-muted-foreground mt-1 bg-background/60 p-2 rounded border border-border/40 font-mono">
                            {step.resultSummary}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence & Verification Seal */}
              {activeMission.evidence.length > 0 && (
                <div className="pt-3 border-t border-border/40 space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Collected Evidence & Cryptographic Hashes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeMission.evidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="px-2.5 py-1 rounded bg-secondary/80 text-[11px] font-mono text-muted-foreground border border-border/60 flex items-center gap-1.5"
                      >
                        <Shield className="size-3 text-primary" />
                        <span>{ev.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
