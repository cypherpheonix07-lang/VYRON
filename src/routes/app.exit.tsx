/**
 * PROJECT VYRON / BRAHMA — DEDICATED WORKSPACE EXIT PAGE
 * Implements Workstream T (Dedicated Exit Page) & Workstream U (Destination and Re-entry):
 * - Authoritative display of exit outcome: "saved" | "discarded" | "clean"
 * - Maintains active authenticated session (workspace exit != logout)
 * - Offers direct re-entry to project, directory, or dashboard
 */

import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  RotateCcw,
  ShieldCheck,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

interface ExitSearch {
  projectId?: string | undefined;
  projectName?: string | undefined;
  outcome?: "saved" | "discarded" | "clean" | undefined;
  sections?: string | undefined;
  ts?: string | undefined;
}

export const Route = createFileRoute("/app/exit")({
  validateSearch: (search: Record<string, unknown>): ExitSearch => {
    return {
      projectId: typeof search["projectId"] === "string" ? search["projectId"] : undefined,
      projectName: typeof search["projectName"] === "string" ? search["projectName"] : undefined,
      outcome:
        search["outcome"] === "saved" || search["outcome"] === "discarded" || search["outcome"] === "clean"
          ? search["outcome"]
          : "clean",
      sections: typeof search["sections"] === "string" ? search["sections"] : undefined,
      ts: typeof search["ts"] === "string" ? search["ts"] : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Workspace Closed — VYRON" },
      { name: "description", content: "You have safely exited the project workspace." },
    ],
  }),
  component: WorkspaceExitPage,
});

function WorkspaceExitPage() {
  const { user } = useAuth();
  const search = Route.useSearch();

  const projectId = search.projectId || "brahma-core";
  const projectName = search.projectName || (search.projectId ? `Project ${search.projectId}` : "Active Project");
  const outcome = search.outcome || "clean";
  const sectionsList = search.sections ? search.sections.split(",").filter(Boolean) : [];
  const exitTime = search.ts ? new Date(search.ts).toLocaleTimeString() : new Date().toLocaleTimeString();

  return (
    <div className="mx-auto max-w-2xl py-12 px-4 sm:px-6">
      <Card className="surface border border-border/80 bg-zinc-950/80 shadow-2xl rounded-2xl overflow-hidden">
        {/* Top colored accent banner */}
        <div
          className={`h-2 w-full ${
            outcome === "saved"
              ? "bg-emerald-500"
              : outcome === "discarded"
                ? "bg-amber-500"
                : "bg-primary"
          }`}
        />

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header & Status Icon */}
          <div className="flex items-start gap-4">
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-xl border ${
                outcome === "saved"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                  : outcome === "discarded"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                    : "bg-primary/10 text-primary border-primary/25"
              }`}
            >
              {outcome === "saved" ? (
                <CheckCircle2 className="size-6" />
              ) : outcome === "discarded" ? (
                <Trash2 className="size-6" />
              ) : (
                <ShieldCheck className="size-6" />
              )}
            </span>

            <div className="space-y-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                You&apos;ve left the workspace
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {outcome === "saved"
                  ? "All verified changes were successfully committed to project storage before exiting."
                  : outcome === "discarded"
                    ? "Unsaved changes were discarded. Previously saved project data remains completely intact."
                    : "The workspace was closed cleanly with no pending or unsaved changes."}
              </p>
            </div>
          </div>

          {/* Outcome & Context Summary Banner */}
          <div className="rounded-xl border border-border/70 bg-zinc-900/50 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <FolderKanban className="size-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">{projectName}</span>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary px-1.5 py-0">
                  {projectId}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                <Clock className="size-3 text-muted-foreground" />
                <span>Exited at {exitTime}</span>
              </div>
            </div>

            {/* Outcome badge row */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-xs text-muted-foreground">Exit Outcome</span>
              {outcome === "saved" ? (
                <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs px-2.5 py-0.5 font-medium">
                  Changes Confirmed & Saved
                </Badge>
              ) : outcome === "discarded" ? (
                <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-xs px-2.5 py-0.5 font-medium">
                  Unsaved Edits Discarded
                </Badge>
              ) : (
                <Badge className="bg-primary/15 text-primary border-primary/30 text-xs px-2.5 py-0.5 font-medium">
                  Clean Exit (No Changes)
                </Badge>
              )}
            </div>

            {/* Sections list if any */}
            {sectionsList.length > 0 && (
              <div className="pt-2 border-t border-border/40">
                <p className="text-[11px] font-medium text-muted-foreground mb-1.5">
                  Synchronized Sections ({sectionsList.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sectionsList.map((sec) => (
                    <Badge
                      key={sec}
                      variant="secondary"
                      className="text-[10px] bg-zinc-800 text-zinc-300 border border-border/60"
                    >
                      {sec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Authentication Note (Workstream E08 & Semantics) */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/[0.03] border border-primary/15 rounded-xl p-3">
            <Info className="size-4 text-primary shrink-0" />
            <span>
              Signed in as <strong className="text-foreground">{user?.email || "priya.nair@brahma.dev"}</strong>. Your authenticated session remains active.
            </span>
          </div>

          {/* Navigation Action Buttons (Workstreams T07 & T08) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <Button
              asChild
              variant="default"
              size="sm"
              className="h-9 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              <Link to="/app/projects/$id" params={{ id: projectId }}>
                <RotateCcw className="size-3.5" /> Return to project
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium border-border/80 hover:bg-secondary gap-1.5"
            >
              <Link to="/app/projects">
                <FolderKanban className="size-3.5" /> All projects
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 text-xs font-medium hover:bg-secondary gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Link to="/app">
                <LayoutDashboard className="size-3.5" /> Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
