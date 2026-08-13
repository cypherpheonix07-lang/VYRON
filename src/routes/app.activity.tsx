import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Filter,
  Download,
  ShieldAlert,
  Play,
  RotateCcw,
  Users,
  FileBarChart2,
  Settings,
  ChevronDown,
  HelpCircle,
  FileCode,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/activity")({
  head: () => ({
    meta: [
      { title: "Workspace Activity Feed — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Audit log checklist of all AI analysis jobs, commits, and publish actions.",
      },
    ],
  }),
  component: WorkspaceActivityPage,
});

interface ActivityEvent {
  id: string;
  actor: string;
  project: string;
  action: string;
  detail: string;
  time: string;
  type: "analysis" | "security" | "publish" | "report" | "member" | "system";
}

const initialEvents: ActivityEvent[] = [
  {
    id: "act-1",
    actor: "Priya Nair",
    project: "Smart Campus Portal",
    action: "Run blueprint analysis",
    detail: "Extracted 14 functional requirements and mapped 5 actors.",
    time: "10m ago",
    type: "analysis",
  },
  {
    id: "act-2",
    actor: "System Scanner",
    project: "Smart Campus Portal",
    action: "Security scan failed gates",
    detail:
      "Vulnerability V-103: Missing authorization check on refund endpoint flagged as Critical.",
    time: "24m ago",
    type: "security",
  },
  {
    id: "act-3",
    actor: "Puli Phanindhra",
    project: "Aurora Payments Gateway",
    action: "Deploy production build",
    detail: "Publish Gate passed 6/7 checks with 1 warning override log.",
    time: "1h ago",
    type: "publish",
  },
  {
    id: "act-4",
    actor: "Priya Nair",
    project: "MediSync Patient Portal",
    action: "Exported report",
    detail: "Technical Architecture Review (42 pages PDF) compiled and downloaded.",
    time: "3h ago",
    type: "report",
  },
  {
    id: "act-5",
    actor: "Priya Nair",
    project: "Global",
    action: "Invite teammate",
    detail: "Sent invitation email parameters to ananya.k@brahma.dev.",
    time: "1d ago",
    type: "member",
  },
  {
    id: "act-6",
    actor: "Puli Phanindhra",
    project: "Smart Campus Portal",
    action: "AI prompt adjustment",
    detail: "Re-routed risk model parameters to Claude-3.5-Sonnet proxy.",
    time: "2d ago",
    type: "system",
  },
];

const typeColors = {
  analysis: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  security: "text-red-400 bg-red-500/10 border-red-500/20",
  publish: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  report: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  member: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  system: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const typeIcons = {
  analysis: FileCode,
  security: ShieldAlert,
  publish: Play,
  report: FileBarChart2,
  member: Users,
  system: Settings,
};

function WorkspaceActivityPage() {
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = events.filter((e) => {
    const matchesSearch =
      e.project.toLowerCase().includes(search.toLowerCase()) ||
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    toast.success("CSV export initialized", {
      description: "Downloading workspace audit timeline logs.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace Activity Feed"
        description="Chronological audit records of blueprint creations, publish runs, security gates, and team invites."
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "analysis", "security", "publish", "report", "member", "system"].map((type) => (
            <Button
              key={type}
              size="sm"
              variant={typeFilter === type ? "default" : "outline"}
              className="h-7 text-[10px] capitalize font-semibold"
              onClick={() => setTypeFilter(type)}
            >
              {type === "All" ? "All Activity" : type}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 shrink-0">
          <Input
            placeholder="Search activity..."
            className="h-8 text-xs w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] gap-1.5"
            onClick={handleExportCSV}
          >
            <Download className="size-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      <SectionCard
        title="System Ledger logs"
        description="Audit compliance trail of all developer inputs."
      >
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2 border border-dashed border-border rounded-xl">
            <Activity className="size-8 text-muted-foreground/30 mx-auto" />
            <p className="text-xs font-semibold text-foreground">No matches found</p>
            <p className="text-[10px] text-muted-foreground">
              Adjust filters or search parameters to view logs.
            </p>
          </div>
        ) : (
          <div className="relative border-l border-border/80 pl-6 ml-3 space-y-6">
            {filtered.map((item) => {
              const Icon = typeIcons[item.type];
              return (
                <div key={item.id} className="relative">
                  {/* Event Bullet Node */}
                  <span
                    className={`absolute -left-[35px] top-0 grid size-6 place-items-center rounded-full border text-[10px] ${typeColors[item.type]}`}
                  >
                    <Icon className="size-3" />
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{item.actor}</span>
                      <span className="text-[10px] text-muted-foreground">{item.action}</span>
                      <Badge variant="secondary" className="text-[8px] h-4">
                        {item.project}
                      </Badge>
                      <span className="ml-auto text-[9px] text-muted-foreground font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="pt-6 text-center border-t border-border/30 mt-6">
            <Button
              variant="outline"
              size="sm"
              className="text-[10px] h-8"
              onClick={() =>
                toast.info("No further historical entries exist in this log partition.")
              }
            >
              Load more events
            </Button>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
