/**
 * VYRON — GLOBAL COMMAND CONTEXT BAR (PHASE 02)
 * Shared command-center control bar governing:
 * Organization, Project, Environment, Branch, Time Range, User Authority,
 * and Time Machine Historical Mode toggle.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter, Environment, TimeRange, UserAuthority } from "@/state/commandCenter/commandCenterStore";
import { projects } from "@/lib/mock-data";
import { useAppMode } from "@/state/mode/useAppMode";
import { cn } from "@/lib/utils";
import {
  Building2,
  Calendar,
  ChevronDown,
  FolderKanban,
  GitBranch,
  GitCompare,
  Layers,
  Radio,
  Server,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";

export function GlobalCommandContextBar({
  showTimeMachine,
  onToggleTimeMachine,
}: {
  showTimeMachine: boolean;
  onToggleTimeMachine: () => void;
}) {
  const {
    organization,
    selectedProjectId,
    setSelectedProject,
    environment,
    setEnvironment,
    branch,
    setBranch,
    timeRange,
    setTimeRange,
    userAuthority,
    setUserAuthority,
    architectureVersion,
  } = useCommandCenter();

  const { mode } = useAppMode();

  return (
    <div className="p-3 rounded-xl border border-border/50 bg-zinc-950/80 backdrop-blur-md shadow-lg space-y-2.5">
      {/* TOP ROW: ORG, PROJECT SELECTOR, ENVIRONMENT, AND TIME MACHINE TOGGLE */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* ORG & PROJECT SELECTOR */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Building2 className="size-3.5 text-primary" />
            <span className="truncate">{organization}</span>
          </div>

          <div className="h-3.5 w-px bg-border/60 hidden sm:block" />

          {/* PROJECT SELECTOR */}
          <div className="flex items-center gap-1.5">
            <FolderKanban className="size-3.5 text-muted-foreground" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-zinc-900 border border-border/50 text-foreground font-medium rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.domain})
                </option>
              ))}
            </select>
          </div>

          {/* BRANCH */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground hidden md:flex">
            <GitBranch className="size-3 text-primary" />
            <span>{branch}</span>
            <Badge variant="outline" className="text-[9px] font-mono px-1 py-0 text-primary">
              {architectureVersion}
            </Badge>
          </div>
        </div>

        {/* TIME MACHINE & ENVIRONMENT SWITCHER */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "DEMO" && (
            <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] font-mono">
              DEMO / SYNTHETIC TWIN
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleTimeMachine}
            className={cn(
              "h-7 px-2 text-[10px] font-mono gap-1",
              showTimeMachine ? "bg-primary/15 text-primary border-primary/40" : "text-muted-foreground",
            )}
          >
            <GitCompare className="size-3 text-primary" />
            {showTimeMachine ? "Hide Time Machine" : "Time Machine"}
          </Button>

          {/* ENVIRONMENT TABS */}
          <div className="flex items-center rounded-lg border border-border/40 p-0.5 bg-zinc-900/60">
            {(["production", "staging", "dev", "sandbox"] as Environment[]).map((env) => (
              <button
                key={env}
                type="button"
                onClick={() => setEnvironment(env)}
                className={cn(
                  "px-2 py-0.5 text-[10px] font-mono capitalize rounded transition-all",
                  environment === env
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: TIME RANGE SELECTOR & USER AUTHORITY */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/30 text-[11px]">
        {/* TIME RANGE */}
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground mr-1 text-[10px] font-mono flex items-center gap-1">
            <Calendar className="size-2.5" /> Time Window:
          </span>
          {(["1h", "24h", "7d", "30d", "90d", "1y"] as TimeRange[]).map((tr) => (
            <button
              key={tr}
              type="button"
              onClick={() => setTimeRange(tr)}
              className={cn(
                "px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors",
                timeRange === tr
                  ? "bg-zinc-800 text-foreground font-bold border border-border"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tr}
            </button>
          ))}
        </div>

        {/* USER AUTHORITY ROLE SWITCHER */}
        <div className="flex items-center gap-1.5">
          <UserCheck className="size-3 text-emerald-400" />
          <span className="text-muted-foreground text-[10px] font-mono">Authority:</span>
          <select
            value={userAuthority}
            onChange={(e) => setUserAuthority(e.target.value as UserAuthority)}
            className="bg-zinc-900 border border-border/50 text-foreground font-mono rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
          >
            <option value="CHIEF_ARCHITECT">Chief Architect</option>
            <option value="SECURITY_LEAD">Security Lead</option>
            <option value="RELEASE_ENGINEER">Release Engineer</option>
            <option value="DEVELOPER">Developer</option>
          </select>
        </div>
      </div>
    </div>
  );
}
