import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Zap,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Calendar,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspacePulse } from "@/hooks/useWorkPulse";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { WorkPulseOverviewTab } from "./WorkPulseOverviewTab";
import { WorkPulseActivityTab } from "./WorkPulseActivityTab";
import { WorkPulseAnalyticsTab } from "./WorkPulseAnalyticsTab";
import { WorkPulseSettingsTab } from "./WorkPulseSettingsTab";
import { toast } from "sonner";

type WorkPulseTabId = "overview" | "activity" | "analytics" | "settings";

const TABS: Array<{
  id: WorkPulseTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: "overview",
    label: "Overview",
    icon: Activity,
    description: "Workspace health summary and key metrics",
  },
  {
    id: "activity",
    label: "Activity",
    icon: Zap,
    description: "Project telemetry pulse grid with live event data",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Engineering trends, drift patterns, and health trajectories",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Configure WorkPulse monitoring preferences",
  },
];

const DATE_RANGES = [
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "All time", value: "all" },
] as const;

type DateRange = (typeof DATE_RANGES)[number]["value"];

export function WorkPulsePage() {
  const [activeTab, setActiveTab] = useState<WorkPulseTabId>("overview");
  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const [isExporting, setIsExporting] = useState(false);

  const navigate = useNavigate();
  const { pulse, isLoading, error, refetch } = useWorkspacePulse();
  const { projects } = useProjects();

  const selectedRange = DATE_RANGES.find((r) => r.value === dateRange);

  const handleRefresh = useCallback(async () => {
    await refetch();
    toast.success("WorkPulse data refreshed");
  }, [refetch]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Build a JSON export of the current pulse snapshot
      const exportData = {
        exported_at: new Date().toISOString(),
        date_range: dateRange,
        workspace_pulse: pulse,
        projects: projects.map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          health_score: p.health_score,
        })),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `workpulse-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("WorkPulse data exported successfully");
    } catch {
      toast.error("Export failed — please try again");
    } finally {
      setIsExporting(false);
    }
  }, [pulse, projects, dateRange]);

  const handleSelectProject = useCallback(
    (projectId: string) => {
      navigate({ to: "/app/activity", search: { project: projectId, mode: "stream" } });
    },
    [navigate],
  );

  return (
    <div className="flex flex-col min-h-full pb-12">
      {/* ─── WorkPulse Page Header ─────────────────────────────────────── */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-4">
          {/* Top row: identity + actions */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            {/* Identity */}
            <div className="flex items-center gap-3 min-w-0">
              {/* WorkPulse Icon Mark */}
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-cyan-500/20 border border-primary/30 shadow-[0_0_16px_rgba(0,0,0,0.4)]">
                <Zap className="size-4 text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                {/* Live pulse dot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    WorkPulse
                  </h1>
                  <Badge
                    variant="outline"
                    className="font-mono text-[9px] uppercase border-primary/30 text-primary bg-primary/5 hidden sm:flex"
                  >
                    Live Telemetry
                  </Badge>
                  {isLoading && (
                    <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  Engineering workspace telemetry, project health, and signal command center
                </p>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Date range picker */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs font-medium border-border/70"
                    aria-label="Select date range"
                  >
                    <Calendar className="size-3.5 text-muted-foreground" />
                    <span className="hidden sm:inline">{selectedRange?.label}</span>
                    <span className="sm:hidden">{selectedRange?.value}</span>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {DATE_RANGES.map((range) => (
                    <DropdownMenuItem
                      key={range.value}
                      onClick={() => setDateRange(range.value)}
                      className={cn(
                        "text-xs cursor-pointer",
                        dateRange === range.value && "text-primary font-semibold",
                      )}
                    >
                      {dateRange === range.value && (
                        <span className="mr-2 text-primary">✓</span>
                      )}
                      {range.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Refresh */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-8 gap-1.5 text-xs font-medium border-border/70"
                aria-label="Refresh WorkPulse data"
              >
                <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              {/* Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting || isLoading}
                className="h-8 gap-1.5 text-xs font-medium border-border/70"
                aria-label="Export WorkPulse data"
              >
                {isExporting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Download className="size-3.5" />
                )}
                <span className="hidden md:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300">
              <span>⚠ WorkPulse data unavailable: {error}</span>
              <button
                onClick={handleRefresh}
                className="ml-2 font-semibold underline hover:text-rose-200"
              >
                Retry
              </button>
            </div>
          )}

          {/* ─── Tab Navigation ──────────────────────────────────────────── */}
          <nav
            className="mt-3 flex items-center gap-0.5 overflow-x-auto"
            aria-label="WorkPulse sections"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`workpulse-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`workpulse-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/4",
                  )}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-4/5 bg-primary/60 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ─── Tab Panel Content ──────────────────────────────────────────── */}
      <main className="flex-1 px-4 sm:px-6 py-5">
        <div
          id="workpulse-panel-overview"
          role="tabpanel"
          aria-labelledby="workpulse-tab-overview"
          hidden={activeTab !== "overview"}
        >
          {activeTab === "overview" && (
            <WorkPulseOverviewTab
              pulse={pulse}
              isLoading={isLoading}
              error={error}
              dateRange={dateRange}
              projects={projects}
              onSelectProject={handleSelectProject}
              onRefresh={handleRefresh}
            />
          )}
        </div>

        <div
          id="workpulse-panel-activity"
          role="tabpanel"
          aria-labelledby="workpulse-tab-activity"
          hidden={activeTab !== "activity"}
        >
          {activeTab === "activity" && (
            <WorkPulseActivityTab
              pulse={pulse}
              isLoading={isLoading}
              projects={projects}
              onSelectProject={handleSelectProject}
            />
          )}
        </div>

        <div
          id="workpulse-panel-analytics"
          role="tabpanel"
          aria-labelledby="workpulse-tab-analytics"
          hidden={activeTab !== "analytics"}
        >
          {activeTab === "analytics" && (
            <WorkPulseAnalyticsTab
              pulse={pulse}
              isLoading={isLoading}
              dateRange={dateRange}
              projects={projects}
            />
          )}
        </div>

        <div
          id="workpulse-panel-settings"
          role="tabpanel"
          aria-labelledby="workpulse-tab-settings"
          hidden={activeTab !== "settings"}
        >
          {activeTab === "settings" && <WorkPulseSettingsTab />}
        </div>
      </main>
    </div>
  );
}
