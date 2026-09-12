import { useState, useMemo } from "react";
import { ArrowUpDown, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkPulseCard } from "./WorkPulseCard";
import type { WorkspacePulse, ProjectPulse } from "@/types/activity";

interface WorkPulseGridProps {
  workspacePulse: WorkspacePulse | null;
  isLoading: boolean;
  onSelectProject: (projectId: string) => void;
}

export function WorkPulseGrid({
  workspacePulse,
  isLoading,
  onSelectProject,
}: WorkPulseGridProps) {
  const [sortBy, setSortBy] = useState<"momentum" | "risk" | "recent">("momentum");
  const [query, setQuery] = useState("");

  const projects = useMemo(() => {
    if (!workspacePulse?.projects) return [];
    return workspacePulse.projects;
  }, [workspacePulse]);

  const filteredAndSorted = useMemo(() => {
    let list = [...projects];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.pulse?.project_name?.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      if (sortBy === "momentum") {
        return (b.pulse?.momentum || 0) - (a.pulse?.momentum || 0);
      } else if (sortBy === "risk") {
        // Lowest health first
        return (a.health || 0) - (b.health || 0);
      } else if (sortBy === "recent") {
        const tA = a.pulse?.last_event_at ? new Date(a.pulse.last_event_at).getTime() : 0;
        const tB = b.pulse?.last_event_at ? new Date(b.pulse.last_event_at).getTime() : 0;
        return tB - tA;
      }
      return 0;
    });

    return list;
  }, [projects, query, sortBy]);

  return (
    <div className="space-y-4">
      {/* Action and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Project Telemetry Pulse Grid</h3>
          <p className="text-xs text-muted-foreground">
            Live health, 24h momentum, and anomaly detection per project workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 size-3 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="h-8 w-44 pl-7 text-xs"
            />
          </div>

          {/* Sort pills */}
          <div className="flex items-center rounded-lg border border-border/70 p-0.5 bg-muted/20 text-xs">
            <Button
              variant={sortBy === "momentum" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("momentum")}
              className="h-7 px-2.5 text-xs font-medium"
            >
              Momentum
            </Button>
            <Button
              variant={sortBy === "risk" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("risk")}
              className="h-7 px-2.5 text-xs font-medium"
            >
              Risk Exposure
            </Button>
            <Button
              variant={sortBy === "recent" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("recent")}
              className="h-7 px-2.5 text-xs font-medium"
            >
              Recent Events
            </Button>
          </div>
        </div>
      </div>

      {/* Grid of WorkPulse Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <WorkPulseCard key={i} isLoading />
          ))}
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/80 p-12 text-center text-muted-foreground">
          <p className="text-sm">No project pulse metrics found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSorted.map((p) => (
            <WorkPulseCard
              key={p.id}
              pulse={p.pulse}
              onClick={() => onSelectProject(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
