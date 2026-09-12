import { useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  FileCode,
  Users,
  KeyRound,
  FileSpreadsheet,
  GitMerge,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ActivityEvent, ActivitySeverity, ActivityEventType } from "@/types/activity";

interface EventCardProps {
  event: ActivityEvent;
  onClick: () => void;
  density?: "comfortable" | "compact";
}

const SEVERITY_CONFIG: Record<
  ActivitySeverity,
  { rail: string; badge: string; border: string }
> = {
  critical: {
    rail: "bg-red-500",
    badge: "bg-red-500/10 text-red-400 border-red-500/30",
    border: "border-red-500/20 hover:border-red-500/40",
  },
  high: {
    rail: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
  medium: {
    rail: "bg-yellow-500",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    border: "border-yellow-500/20 hover:border-yellow-500/40",
  },
  low: {
    rail: "bg-cyan-500",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
  },
  info: {
    rail: "bg-primary",
    badge: "bg-primary/10 text-primary border-primary/30",
    border: "border-border/60 hover:border-primary/40",
  },
};

const EVENT_ICON_MAP: Record<ActivityEventType, React.ElementType> = {
  gate_evaluation: ShieldCheck,
  scan_completion: FileCode,
  publish_attempt: FileCheck2,
  publish_override: AlertTriangle,
  report_export: FileSpreadsheet,
  member_invite: Users,
  role_change: KeyRound,
  integration_connect: GitMerge,
  auth_anomaly: ShieldAlert,
};

export function EventCard({ event, onClick, density = "comfortable" }: EventCardProps) {
  const sev = SEVERITY_CONFIG[event.severity] || SEVERITY_CONFIG.info;
  const Icon = EVENT_ICON_MAP[event.event_type] || Sparkles;

  const formattedTime = useMemo(() => {
    const d = new Date(event.created_at);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) + " UTC";
  }, [event.created_at]);

  const relativeTime = useMemo(() => {
    const diff = Date.now() - new Date(event.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }, [event.created_at]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className={`group relative overflow-hidden rounded-lg border bg-card/60 backdrop-blur-sm transition-all duration-200 hover:bg-card/90 hover:shadow-md cursor-pointer ${sev.border} ${
        density === "compact" ? "p-2.5" : "p-4"
      }`}
    >
      {/* Left Severity Rail */}
      <div className={`absolute inset-y-0 left-0 w-1 ${sev.rail}`} />

      <div className="flex items-start gap-3 pl-2">
        {/* Event Icon Avatar */}
        <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-secondary text-foreground ring-1 ring-border group-hover:ring-primary/40">
          <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        {/* Content Body */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-foreground truncate">
              {event.actor_name}
            </span>

            {event.project_name && (
              <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 h-4 bg-muted/40">
                {event.project_name}
              </Badge>
            )}

            <Badge className={`text-[10px] uppercase font-mono tracking-wider py-0 px-1.5 h-4 border ${sev.badge}`}>
              {event.severity}
            </Badge>

            <span className="ml-auto text-[11px] font-mono text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              <span>{formattedTime}</span>
              <span className="text-muted-foreground/60 hidden sm:inline">({relativeTime})</span>
            </span>
          </div>

          <p className="mt-1 text-sm font-medium text-foreground tracking-tight line-clamp-1">
            {event.title}
          </p>

          {event.description && density === "comfortable" && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Mini Payload & Provenance Indicator */}
          <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-muted-foreground/80">
            {event.provenance_sha && (
              <span className="flex items-center gap-1 hover:text-primary transition-colors">
                <span className="text-primary/70">SHA:</span> {event.provenance_sha.substring(0, 8)}...
              </span>
            )}
            <span className="capitalize">{event.event_type.replace(/_/g, " ")}</span>
            <span className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-[10px]">
              Inspect payload <ExternalLink className="size-2.5 ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
