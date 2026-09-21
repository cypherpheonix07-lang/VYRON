import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Zap, Maximize2, Minimize2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePulseHeader } from "@/components/activity/WorkspacePulseHeader";
import { WorkPulseGrid } from "@/components/activity/WorkPulseGrid";
import { WorkPulseCard, type WorkPulseDensity } from "@/components/activity/WorkPulseCard";
import type { WorkspacePulse } from "@/types/activity";
import type { Project } from "@/hooks/useProjects";

interface WorkPulseActivityTabProps {
  pulse: WorkspacePulse | null;
  isLoading: boolean;
  projects: Project[];
  onSelectProject: (id: string) => void;
}

export function WorkPulseActivityTab({
  pulse,
  isLoading,
  onSelectProject,
}: WorkPulseActivityTabProps) {
  const [density, setDensity] = useState<WorkPulseDensity>("normal");
  const navigate = useNavigate();

  const handleProjectSelect = (projectId: string) => {
    onSelectProject(projectId);
    // Navigate to activity with project scope
    navigate({
      to: "/app/activity",
      search: { project: projectId, mode: "stream" },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Section header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="size-4 text-amber-400" />
            Project Telemetry Pulse
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live health, 24h momentum, velocity, and anomaly detection across all projects
          </p>
        </div>

        {/* Density controls */}
        <div className="flex items-center rounded-lg border border-border/70 p-0.5 bg-muted/20">
          <Button
            variant={density === "compact" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDensity("compact")}
            className="h-7 px-2 text-xs font-medium gap-1"
            title="Compact density"
          >
            <Minimize2 className="size-3" />
            <span className="hidden sm:inline">Compact</span>
          </Button>
          <Button
            variant={density === "normal" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDensity("normal")}
            className="h-7 px-2 text-xs font-medium gap-1"
            title="Standard density"
          >
            <LayoutGrid className="size-3" />
            <span className="hidden sm:inline">Standard</span>
          </Button>
          <Button
            variant={density === "expanded" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDensity("expanded")}
            className="h-7 px-2 text-xs font-medium gap-1"
            title="Expanded density"
          >
            <Maximize2 className="size-3" />
            <span className="hidden sm:inline">Expanded</span>
          </Button>
        </div>
      </div>

      {/* Workspace-level quick stats */}
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70 mb-3">
          Workspace Summary
        </p>
        <WorkspacePulseHeader pulse={pulse} isLoading={isLoading} />
      </div>

      {/* Project pulse grid */}
      <div className="border-t border-border/40 pt-5">
        {pulse?.projects && pulse.projects.length > 0 ? (
          <WorkPulseGrid
            workspacePulse={pulse}
            isLoading={isLoading}
            onSelectProject={handleProjectSelect}
            defaultDensity={density}
          />
        ) : isLoading ? (
          // Loading skeleton grid
          <div
            className={`grid gap-4 ${
              density === "compact"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                : density === "expanded"
                  ? "grid-cols-1 md:grid-cols-2 gap-5"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            }`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <WorkPulseCard key={i} isLoading density={density} />
            ))}
          </div>
        ) : (
          // No project pulse data — show individual project cards using mock pulse
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70 mb-3">
              Project Pulse Grid
            </p>
            <div
              className={`grid ${
                density === "compact"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                  : density === "expanded"
                    ? "grid-cols-1 md:grid-cols-2 gap-5"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              }`}
            >
              {/* Show empty state cards when no realtime data */}
              <div className="col-span-full rounded-xl border border-dashed border-border/60 p-10 text-center">
                <Zap className="size-8 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No project pulse data available
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Pulse data populates as your projects record activity events
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
