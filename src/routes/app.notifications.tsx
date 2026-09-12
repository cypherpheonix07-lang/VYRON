import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle,
  Filter,
  ShieldAlert,
  FileCode,
  FileText,
  AlertTriangle,
  XCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notification Ledger — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Review historical platform alerts, vulnerability detections, and quality gates.",
      },
    ],
  }),
  component: NotificationHistoryPage,
});

interface HistoryNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  category: "Security" | "Analysis" | "Reports" | "Risk" | "System";
  unread: boolean;
  severity: "Critical" | "High" | "Medium" | "Low";
}

const initialHistory: HistoryNotification[] = [
  {
    id: "h-1",
    title: "Critical vulnerability detected",
    detail:
      "Hardcoded JWT secret in VaultLedger auth module. Committed token string literal detected.",
    time: "12 mins ago",
    category: "Security",
    unread: true,
    severity: "Critical",
  },
  {
    id: "h-2",
    title: "Analysis completed successfully",
    detail: "Aurora Payments Gateway health score rated 91. Passed 12 unit specifications.",
    time: "1 hour ago",
    category: "Analysis",
    unread: true,
    severity: "Low",
  },
  {
    id: "h-3",
    title: "PDF Report generated",
    detail: "MediSync Customer Database Schema is available in the Export Center.",
    time: "3 hours ago",
    category: "Reports",
    unread: true,
    severity: "Medium",
  },
  {
    id: "h-4",
    title: "Clarity warning threshold breached",
    detail: "Refund flow clarity index dropped to 48%. Low functional details provided.",
    time: "5 hours ago",
    category: "Risk",
    unread: false,
    severity: "High",
  },
  {
    id: "h-5",
    title: "System settings synchronized",
    detail: "Copilot model parameters re-routed to default workspace fallback.",
    time: "1 day ago",
    category: "System",
    unread: false,
    severity: "Low",
  },
];

const severityColors = {
  Critical: "bg-red-500/10 text-red-400 border-red-500/20",
  High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

function NotificationHistoryPage() {
  const [notifications, setNotifications] = useState<HistoryNotification[]>(initialHistory);
  const [catFilter, setCatFilter] = useState("All");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("Cleared notifications archive ledger.");
  };

  const filtered = notifications.filter((n) => catFilter === "All" || n.category === catFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Ledger"
        description="Comprehensive audit logs of workspace notifications and pipeline events."
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Security", "Analysis", "Reports", "Risk", "System"].map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={catFilter === cat ? "default" : "outline"}
              className="h-7 text-[10px] font-semibold"
              onClick={() => setCatFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 shrink-0">
          {unreadCount > 0 && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground text-xs h-8"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs text-[var(--critical)] hover:bg-[var(--critical)]/10"
            onClick={handleClearAll}
          >
            <Trash2 className="size-3.5 mr-1" /> Clear Ledger
          </Button>
        </div>
      </div>

      <SectionCard title="Notification Archives" description="Historical alert snapshots.">
        {filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3 border border-dashed border-border rounded-xl">
            <Bell className="size-10 text-muted-foreground/30 mx-auto" />
            <h4 className="text-xs font-semibold text-foreground">You&apos;re all caught up</h4>
            <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
              No alert profiles match the selected category filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkRead(item.id)}
                className={`py-4 flex items-start justify-between gap-4 cursor-pointer first:pt-0 last:pb-0 ${
                  item.unread ? "opacity-100" : "opacity-75"
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.unread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                    )}
                    <h4
                      className={`text-xs text-foreground ${item.unread ? "font-bold" : "font-semibold"}`}
                    >
                      {item.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-[8px] px-1.5 py-0 h-4 border-none ${severityColors[item.severity]}`}
                    >
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{item.detail}</p>
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-mono">
                    <span>{item.time}</span>
                    <span>&bull;</span>
                    <span>Category: {item.category}</span>
                  </div>
                </div>

                {item.unread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[9px] text-primary shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkRead(item.id);
                    }}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
