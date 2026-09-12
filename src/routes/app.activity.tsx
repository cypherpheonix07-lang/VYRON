import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Activity,
  Table as TableIcon,
  Grid,
  Zap,
  Filter,
  Search,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  FileCode,
  Users,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { useActivityRealtime } from "@/hooks/useActivityRealtime";
import { useWorkspacePulse, useProjectPulse } from "@/hooks/useWorkPulse";
import { EventCard } from "@/components/activity/EventCard";
import { EventDrawer } from "@/components/activity/EventDrawer";
import { NewEventsPill } from "@/components/activity/NewEventsPill";
import { LiveMeter } from "@/components/activity/LiveMeter";
import { ActivityTable } from "@/components/activity/ActivityTable";
import { ActivityHeatmap } from "@/components/activity/ActivityHeatmap";
import { SavedViewsManager } from "@/components/activity/SavedViewsManager";
import { ProjectScopeSelector } from "@/components/activity/ProjectScopeSelector";
import { WorkspacePulseHeader } from "@/components/activity/WorkspacePulseHeader";
import { WorkPulseGrid } from "@/components/activity/WorkPulseGrid";
import { WorkPulseCard } from "@/components/activity/WorkPulseCard";
import type {
  ActivityEvent,
  ActivityEventType,
  ActivitySeverity,
  FeedMode,
  DensityMode,
  ActivityFilterState,
  SavedViewPreset,
} from "@/types/activity";

export interface ActivitySearch {
  mode?: FeedMode | undefined;
  view?: string | undefined;
  type?: ActivityEventType | "all" | undefined;
  severity?: ActivitySeverity | "all" | undefined;
  project?: string | undefined;
  range?: ("all" | "1h" | "24h" | "7d" | "30d") | undefined;
  density?: DensityMode | undefined;
  hour?: number | undefined;
}

export const Route = createFileRoute("/app/activity")({
  head: () => ({
    meta: [
      { title: "Workspace Activity & WorkPulse — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Real-time multi-mode intelligence stream and WorkPulse telemetry command center.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): ActivitySearch => {
    const res: ActivitySearch = {};
    if (search["mode"]) res.mode = search["mode"] as FeedMode;
    if (search["view"]) res.view = search["view"] as string;
    if (search["type"]) res.type = search["type"] as ActivityEventType | "all";
    if (search["severity"]) res.severity = search["severity"] as ActivitySeverity | "all";
    if (search["project"]) res.project = search["project"] as string;
    if (search["range"]) res.range = search["range"] as "all" | "1h" | "24h" | "7d" | "30d";
    if (search["density"]) res.density = search["density"] as DensityMode;
    if (search["hour"] !== undefined) res.hour = Number(search["hour"]);
    return res;
  },
  component: WorkspaceActivityPage,
});

function WorkspaceActivityPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // Active filters derived from URL Search Params
  const mode: FeedMode = searchParams.view === "pulse" ? "pulse" : searchParams.mode || "stream";
  const eventType = searchParams.type || "all";
  const severity = searchParams.severity || "all";
  const selectedProjectId = searchParams.project || "all";
  const timeRange = searchParams.range || "all";
  const density: DensityMode = searchParams.density || "comfortable";
  const filterHour = searchParams.hour;

  // Local text search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);

  // Projects & Pulses
  const { projects } = useProjects();
  const { pulse: workspacePulse, isLoading: isWorkspacePulseLoading } = useWorkspacePulse();
  const { pulse: scopedProjectPulse, isLoading: isProjectPulseLoading } = useProjectPulse(
    selectedProjectId !== "all" ? selectedProjectId : null,
  );

  // Realtime hook
  const activeFilters = useMemo(
    () => ({
      search: searchQuery,
      eventType,
      severity,
      projectId: selectedProjectId,
      timeRange,
      mode,
      density,
    }),
    [searchQuery, eventType, severity, selectedProjectId, timeRange, mode, density],
  );

  const {
    events,
    pendingCount,
    isLoading: isStreamLoading,
    isPaused,
    eventsPerMinute,
    presenceUsers,
    applyPending,
    togglePause,
  } = useActivityRealtime(activeFilters);

  // URL State Synchronizer helper
  const updateSearch = (patch: Partial<ActivitySearch>) => {
    navigate({
      to: "/app/activity",
      search: (prev) => ({
        ...prev,
        ...patch,
      }),
    });
  };

  // Filter events in memory for client-side search text and heatmap hour
  const displayedEvents = useMemo(() => {
    let list = [...events];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          e.actor_name.toLowerCase().includes(q) ||
          (e.project_name && e.project_name.toLowerCase().includes(q)),
      );
    }

    if (filterHour !== undefined) {
      list = list.filter((e) => new Date(e.created_at).getHours() === filterHour);
    }

    return list;
  }, [events, searchQuery, filterHour]);

  // Group events by day/hour for stream sticky headers
  const groupedEvents = useMemo(() => {
    const groups: Array<{ label: string; items: ActivityEvent[] }> = [];
    const dateMap = new Map<string, ActivityEvent[]>();

    displayedEvents.forEach((ev) => {
      const d = new Date(ev.created_at);
      const isToday = new Date().toDateString() === d.toDateString();
      const isYesterday =
        new Date(Date.now() - 86400000).toDateString() === d.toDateString();

      let header = d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (isToday) header = "Today";
      else if (isYesterday) header = "Yesterday";

      if (!dateMap.has(header)) {
        dateMap.set(header, []);
      }
      dateMap.get(header)!.push(ev);
    });

    dateMap.forEach((items, label) => {
      groups.push({ label, items });
    });

    return groups;
  }, [displayedEvents]);

  // Handler for Saved View Presets
  const handleApplyPreset = (preset: SavedViewPreset) => {
    updateSearch({
      type: preset.filters.eventType,
      severity: preset.filters.severity,
      project: preset.filters.projectId,
      range: preset.filters.timeRange,
      mode: preset.filters.mode,
      density: preset.filters.density,
      hour: undefined,
    });
  };

  // Handler for Heatmap Cell Click
  const handleHeatmapCellClick = (type: ActivityEventType, hour: number) => {
    updateSearch({
      mode: "stream",
      type,
      hour,
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    updateSearch({
      type: "all",
      severity: "all",
      project: "all",
      range: "all",
      hour: undefined,
    });
  };

  const hasActiveFilters =
    eventType !== "all" ||
    severity !== "all" ||
    selectedProjectId !== "all" ||
    timeRange !== "all" ||
    filterHour !== undefined ||
    searchQuery.trim() !== "";

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Top Command Header ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Activity &amp; WorkPulse Command
            </h1>
            <Badge variant="outline" className="font-mono text-[10px] uppercase text-primary border-primary/30">
              Live Realtime
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Multi-mode intelligence stream, project-scoped event ledger, and WorkPulse telemetry.
          </p>
        </div>

        {/* Global Live Meter & Presence */}
        <div className="flex items-center gap-3">
          <LiveMeter
            eventsPerMinute={eventsPerMinute}
            isPaused={isPaused}
            onTogglePause={togglePause}
            presenceUsers={presenceUsers}
          />
        </div>
      </div>

      {/* ─── Primary Controls Toolbar ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card/40 p-3 rounded-lg border border-border/60 backdrop-blur-sm">
        {/* Left: Project Scope Selector & Saved Views */}
        <div className="flex flex-wrap items-center gap-2">
          <ProjectScopeSelector
            selectedProjectId={selectedProjectId}
            projects={projects}
            onSelectProject={(pId) => updateSearch({ project: pId, hour: undefined })}
          />

          <SavedViewsManager
            currentFilters={activeFilters}
            onApplyPreset={handleApplyPreset}
          />

          {filterHour !== undefined && (
            <Badge
              variant="secondary"
              className="text-xs font-mono gap-1.5 py-1 px-2.5 bg-primary/10 text-primary border border-primary/30"
            >
              <span>Hour {filterHour.toString().padStart(2, "0")}:00</span>
              <button
                onClick={() => updateSearch({ hour: undefined })}
                className="hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
        </div>

        {/* Right: Mode Switcher & Density Toggle */}
        <div className="flex items-center gap-2">
          {/* Density Toggle */}
          <div className="flex items-center rounded-lg border border-border/80 p-0.5 bg-muted/20">
            <Button
              variant={density === "comfortable" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => updateSearch({ density: "comfortable" })}
              className="h-7 px-2 text-xs font-medium"
              title="Comfortable row density"
            >
              Comfortable
            </Button>
            <Button
              variant={density === "compact" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => updateSearch({ density: "compact" })}
              className="h-7 px-2 text-xs font-medium"
              title="Compact row density"
            >
              Compact
            </Button>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center rounded-lg border border-border/80 p-0.5 bg-muted/20">
            <Button
              variant={mode === "stream" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => updateSearch({ mode: "stream", view: undefined })}
              className="h-7 px-2.5 text-xs gap-1.5 font-medium"
            >
              <Activity className="size-3.5 text-primary" />
              Stream
            </Button>
            <Button
              variant={mode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => updateSearch({ mode: "table", view: undefined })}
              className="h-7 px-2.5 text-xs gap-1.5 font-medium"
            >
              <TableIcon className="size-3.5" />
              Table
            </Button>
            <Button
              variant={mode === "heatmap" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => updateSearch({ mode: "heatmap", view: undefined })}
              className="h-7 px-2.5 text-xs gap-1.5 font-medium"
            >
              <Grid className="size-3.5" />
              Heatmap
            </Button>
            <Button
              variant={mode === "pulse" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => updateSearch({ mode: "pulse", view: "pulse" })}
              className="h-7 px-2.5 text-xs gap-1.5 font-medium"
            >
              <Zap className="size-3.5 text-amber-400" />
              WorkPulse
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Project Scoped Header Card (When Scoped) ──────────────────────── */}
      {selectedProjectId !== "all" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Layers className="size-3.5 text-primary" />
              <span>PROJECT-SCOPED AUDIT LEDGER</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">
                {scopedProjectPulse?.project_name || "Project"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateSearch({ project: "all" })}
              className="h-6 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset to Global Scope
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <WorkPulseCard
                pulse={scopedProjectPulse}
                isLoading={isProjectPulseLoading}
              />
            </div>
            <div className="md:col-span-2 rounded-lg border border-border/70 bg-card/40 p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Project Scope Isolation</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  All activity queries, velocity counts, and gate indicators on this view are restricted strictly to this repository. RLS and composite indexes guarantee zero cross-project leakage.
                </p>
              </div>

              {/* Sub-Section Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/60">
                <Button
                  variant={eventType === "all" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => updateSearch({ type: "all" })}
                  className="h-7 text-xs"
                >
                  All Events
                </Button>
                <Button
                  variant={eventType === "gate_evaluation" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => updateSearch({ type: "gate_evaluation" })}
                  className="h-7 text-xs"
                >
                  Gates
                </Button>
                <Button
                  variant={eventType === "scan_completion" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => updateSearch({ type: "scan_completion" })}
                  className="h-7 text-xs"
                >
                  Scans
                </Button>
                <Button
                  variant={eventType === "report_export" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => updateSearch({ type: "report_export" })}
                  className="h-7 text-xs"
                >
                  Reports
                </Button>
                <Button
                  variant={eventType === "member_invite" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => updateSearch({ type: "member_invite" })}
                  className="h-7 text-xs"
                >
                  Members
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mode 4: WorkPulse Command Center ─────────────────────────────── */}
      {mode === "pulse" ? (
        <div className="space-y-6 animate-in fade-in-0 duration-200">
          <WorkspacePulseHeader
            pulse={workspacePulse}
            isLoading={isWorkspacePulseLoading}
          />
          <WorkPulseGrid
            workspacePulse={workspacePulse}
            isLoading={isWorkspacePulseLoading}
            onSelectProject={(pId) => updateSearch({ project: pId, mode: "stream", view: undefined })}
          />
        </div>
      ) : (
        /* ─── Modes 1, 2, 3: Stream, Table, Heatmap ───────────────────────── */
        <div className="space-y-4">
          {/* Secondary Filtering Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-2xl">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, actors, sha..."
                  className="h-8 pl-8 text-xs bg-card/60"
                />
              </div>

              {/* Event Type Filter */}
              <Select
                value={eventType}
                onValueChange={(val) =>
                  updateSearch({ type: val as ActivityEventType | "all", hour: undefined })
                }
              >
                <SelectTrigger className="h-8 w-36 text-xs bg-card/60">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="all">All Event Types</SelectItem>
                  <SelectItem value="gate_evaluation">Gate Evaluation</SelectItem>
                  <SelectItem value="scan_completion">Scan Completion</SelectItem>
                  <SelectItem value="publish_attempt">Publish Attempt</SelectItem>
                  <SelectItem value="publish_override">Publish Override</SelectItem>
                  <SelectItem value="report_export">Report Export</SelectItem>
                  <SelectItem value="member_invite">Member Invite</SelectItem>
                  <SelectItem value="role_change">Role Change</SelectItem>
                  <SelectItem value="integration_connect">Integration Connect</SelectItem>
                  <SelectItem value="auth_anomaly">Auth Anomaly</SelectItem>
                </SelectContent>
              </Select>

              {/* Severity Filter */}
              <Select
                value={severity}
                onValueChange={(val) =>
                  updateSearch({ severity: val as ActivitySeverity | "all" })
                }
              >
                <SelectTrigger className="h-8 w-32 text-xs bg-card/60">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical Only</SelectItem>
                  <SelectItem value="high">High &amp; Critical</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              {/* Time Range Filter */}
              <Select
                value={timeRange}
                onValueChange={(val) =>
                  updateSearch({ range: val as "all" | "1h" | "24h" | "7d" | "30d" })
                }
              >
                <SelectTrigger className="h-8 w-28 text-xs bg-card/60">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1h">Last 1 Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Clear Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                Reset Filters
              </Button>
            )}
          </div>

          {/* New Events Pending Buffer Pill */}
          <NewEventsPill count={pendingCount} onClick={applyPending} />

          {/* Mode 3: Heatmap */}
          {mode === "heatmap" && (
            <div className="animate-in fade-in-0 duration-200">
              <ActivityHeatmap
                events={events}
                onCellClick={handleHeatmapCellClick}
              />
            </div>
          )}

          {/* Mode 2: Table */}
          {mode === "table" && (
            <div className="animate-in fade-in-0 duration-200">
              <ActivityTable
                events={displayedEvents}
                onSelectEvent={(e) => setSelectedEvent(e)}
              />
            </div>
          )}

          {/* Mode 1: Stream (Default) */}
          {mode === "stream" && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              {displayedEvents.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/80 p-12 text-center text-muted-foreground">
                  <Activity className="size-8 mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-medium">No activity matches current filters.</p>
                  <p className="text-xs mt-1">Try broadening your search or time range.</p>
                  <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4 text-xs">
                    Clear Active Filters
                  </Button>
                </div>
              ) : (
                groupedEvents.map((group) => (
                  <div key={group.label} className="space-y-2">
                    {/* Sticky Day / Hour Separator */}
                    <div className="sticky top-0 z-10 flex items-center gap-3 py-1 backdrop-blur-md bg-background/80">
                      <span className="font-mono text-xs font-semibold uppercase text-primary tracking-wider">
                        {group.label}
                      </span>
                      <div className="h-px flex-1 bg-border/60" />
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {group.items.length} {group.items.length === 1 ? "event" : "events"}
                      </span>
                    </div>

                    {/* Timeline Event Cards */}
                    <div className="space-y-2.5 pl-1">
                      {group.items.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          density={density}
                          onClick={() => setSelectedEvent(event)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── Detail Drawer Inspector ───────────────────────────────────────── */}
      <EventDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
