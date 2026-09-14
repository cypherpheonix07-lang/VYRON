import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, ShieldAlert, Cpu, FileText, Users, Settings, Radio, Clock } from "lucide-react";
import { getProject } from "@/lib/mock-data";
import { useActivityRealtime } from "@/hooks/useActivityRealtime";
import { useProjectPulse } from "@/hooks/useWorkPulse";
import { EventCard } from "@/components/activity/EventCard";
import { EventDrawer } from "@/components/activity/EventDrawer";
import { NewEventsPill } from "@/components/activity/NewEventsPill";
import { LiveMeter } from "@/components/activity/LiveMeter";
import { WorkPulseCard } from "@/components/activity/WorkPulseCard";
import type { ActivityEvent, ActivityEventType } from "@/types/activity";

export const Route = createFileRoute("/app/projects/$id/activity")({
  component: ProjectActivityPage,
});

type SectionTab = "stream" | "gates" | "scans" | "reports" | "members" | "system";

const SECTION_TYPE_MAPPING: Record<SectionTab, ActivityEventType[] | null> = {
  stream: null, // all types
  gates: ["gate_evaluation"],
  scans: ["scan_completion"],
  reports: ["report_export", "publish_attempt", "publish_override"],
  members: ["member_invite", "role_change"],
  system: ["integration_connect", "auth_anomaly"],
};

function ProjectActivityPage() {
  const { id } = Route.useParams();
  const project = getProject(id);
  const [activeTab, setActiveTab] = useState<SectionTab>("stream");
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);

  // Scoped project pulse
  const { pulse, isLoading: isPulseLoading, refetch: refreshPulse } = useProjectPulse(id);

  // Scoped realtime hook
  const activeTypes = SECTION_TYPE_MAPPING[activeTab];
  const {
    events,
    pendingCount,
    applyPending,
    isPaused,
    togglePause,
    eventsPerMinute,
    presenceUsers,
  } = useActivityRealtime({
    projectId: id,
    eventType: activeTypes && activeTypes.length === 1 ? activeTypes[0] : undefined,
  });

  // Client-side section filter if tab matches multiple event types
  const filteredEvents = useMemo(() => {
    if (!activeTypes) return events;
    return events.filter((e) => activeTypes.includes(e.event_type));
  }, [events, activeTypes]);

  // Group events by hour/day
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: ActivityEvent[] } = {};
    for (const ev of filteredEvents) {
      const d = new Date(ev.created_at);
      const key = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    }
    return groups;
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      {/* Top Project Pulse Card */}
      <div className="w-full">
        <WorkPulseCard pulse={pulse} isLoading={isPulseLoading} onClick={() => refreshPulse()} />
      </div>

      {/* Feed Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card/60 backdrop-blur-md">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist">
          {[
            { id: "stream", label: "Stream", icon: Activity },
            { id: "gates", label: "Gates", icon: ShieldAlert },
            { id: "scans", label: "Scans", icon: Cpu },
            { id: "reports", label: "Reports", icon: FileText },
            { id: "members", label: "Members", icon: Users },
            { id: "system", label: "System", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id as SectionTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Meter & Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <LiveMeter
            eventsPerMinute={eventsPerMinute}
            isPaused={isPaused}
            onTogglePause={togglePause}
            presenceUsers={presenceUsers}
          />
        </div>
      </div>

      {/* Floating Pending Events Pill */}
      <NewEventsPill count={pendingCount} onClick={applyPending} />

      {/* Event Stream Timeline */}
      <div className="space-y-8 min-h-[400px]">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/30">
            <Radio className="w-10 h-10 text-muted-foreground/40 mb-3 animate-pulse" />
            <h3 className="text-sm font-semibold text-foreground">Zero Activity Recorded</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              No events recorded for project &quot;{project?.name || id}&quot; under the &quot;
              {activeTab}&quot; category.
            </p>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([dateLabel, groupList]) => (
            <div key={dateLabel} className="space-y-3">
              {/* Sticky Date Header */}
              <div className="sticky top-16 z-10 flex items-center gap-2 py-1.5 px-3 rounded-md bg-background/90 backdrop-blur border border-border/60 text-xs font-semibold text-muted-foreground w-fit shadow-xs">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{dateLabel}</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-muted text-[10px] font-mono text-muted-foreground">
                  {groupList.length}
                </span>
              </div>

              {/* Event Cards */}
              <div className="space-y-2.5">
                {groupList.map((event) => (
                  <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slide-out Event Drawer */}
      <EventDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
