import { useState, useMemo } from "react";
import { Download, ArrowUpDown, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ActivityEvent } from "@/types/activity";

interface ActivityTableProps {
  events: ActivityEvent[];
  onSelectEvent: (event: ActivityEvent) => void;
}

export function ActivityTable({ events, onSelectEvent }: ActivityTableProps) {
  const [sortField, setSortField] = useState<"created_at" | "severity" | "event_type">("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      let comparison = 0;
      if (sortField === "created_at") {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === "severity") {
        const rank = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
        comparison = (rank[a.severity] || 0) - (rank[b.severity] || 0);
      } else if (sortField === "event_type") {
        comparison = a.event_type.localeCompare(b.event_type);
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [events, sortField, sortAsc]);

  const toggleSort = (field: "created_at" | "severity" | "event_type") => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCSV = () => {
    if (events.length === 0) {
      toast.error("No activity events to export.");
      return;
    }

    const headers = ["ID", "Timestamp (UTC)", "Project", "Actor", "Event Type", "Severity", "Title", "SHA-256"];
    const rows = events.map((e) => [
      e.id,
      new Date(e.created_at).toISOString(),
      `"${e.project_name || "Workspace"}"`,
      `"${e.actor_name}"`,
      e.event_type,
      e.severity,
      `"${e.title.replace(/"/g, '""')}"`,
      e.provenance_sha || "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `brahma_activity_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${events.length} events to CSV.`);
  };

  return (
    <div className="space-y-3">
      {/* Table Action Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          Showing <span className="text-foreground font-semibold">{events.length}</span> tabular records
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          className="h-8 text-xs gap-1.5 border-border/80 hover:bg-secondary"
        >
          <Download className="size-3.5" />
          Export CSV (Honoring Filters)
        </Button>
      </div>

      {/* Dense 36px DataTable */}
      <div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-mono uppercase text-muted-foreground">
                <th className="h-9 px-3 font-semibold">
                  <button
                    onClick={() => toggleSort("created_at")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Timestamp <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="h-9 px-3 font-semibold">Project</th>
                <th className="h-9 px-3 font-semibold">Actor</th>
                <th className="h-9 px-3 font-semibold">
                  <button
                    onClick={() => toggleSort("event_type")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Type <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="h-9 px-3 font-semibold">
                  <button
                    onClick={() => toggleSort("severity")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Severity <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="h-9 px-3 font-semibold">Summary</th>
                <th className="h-9 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {sortedEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-24 text-center text-muted-foreground font-sans text-xs">
                    No activity records found matching filters.
                  </td>
                </tr>
              ) : (
                sortedEvents.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => onSelectEvent(e)}
                    className="h-9 cursor-pointer hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-3 whitespace-nowrap text-muted-foreground">
                      {new Date(e.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
                    </td>
                    <td className="px-3 whitespace-nowrap text-foreground font-medium max-w-[140px] truncate">
                      {e.project_name || "Workspace"}
                    </td>
                    <td className="px-3 whitespace-nowrap text-muted-foreground max-w-[120px] truncate">
                      {e.actor_name}
                    </td>
                    <td className="px-3 whitespace-nowrap">
                      <span className="capitalize text-foreground/80">
                        {e.event_type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                          e.severity === "critical"
                            ? "bg-red-500/20 text-red-400"
                            : e.severity === "high"
                            ? "bg-amber-500/20 text-amber-400"
                            : e.severity === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {e.severity}
                      </span>
                    </td>
                    <td className="px-3 text-foreground font-sans truncate max-w-xs" title={e.title}>
                      {e.title}
                    </td>
                    <td className="px-3 text-right whitespace-nowrap">
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1 text-[11px] font-sans font-medium">
                        Inspect <ExternalLink className="size-3" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
