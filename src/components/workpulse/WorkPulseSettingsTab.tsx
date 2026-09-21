import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  Gauge,
  Mail,
  RefreshCw,
  Settings,
  Shield,
  Sliders,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SettingRowProps {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function SettingRow({ label, description, icon: Icon, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-border/40 last:border-0">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-muted/30 border border-border/40">
          <Icon className="size-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground">{label}</p>
          <p className="text-[10.5px] text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/40 bg-muted/10">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80 font-bold">
          {title}
        </h3>
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

export function WorkPulseSettingsTab() {
  const [refreshInterval, setRefreshInterval] = useState("30");
  const [alertThreshold, setAlertThreshold] = useState("70");

  // Notification toggles
  const [notifyDrift, setNotifyDrift] = useState(true);
  const [notifyRelease, setNotifyRelease] = useState(true);
  const [notifySecurity, setNotifySecurity] = useState(true);
  const [notifyApproval, setNotifyApproval] = useState(false);

  // Display toggles
  const [showSparklines, setShowSparklines] = useState(true);
  const [showSignalFeed, setShowSignalFeed] = useState(true);
  const [showSubsystems, setShowSubsystems] = useState(true);
  const [compactSidebar, setCompactSidebar] = useState(false);

  // Data toggles
  const [realtimeStream, setRealtimeStream] = useState(true);
  const [includeArchived, setIncludeArchived] = useState(false);

  const handleSave = () => {
    // Persist to localStorage so settings survive navigation
    try {
      localStorage.setItem(
        "vyron_workpulse_settings",
        JSON.stringify({
          refreshInterval,
          alertThreshold,
          notifications: { notifyDrift, notifyRelease, notifySecurity, notifyApproval },
          display: { showSparklines, showSignalFeed, showSubsystems, compactSidebar },
          data: { realtimeStream, includeArchived },
        }),
      );
    } catch {
      // ignore storage errors
    }
    toast.success("WorkPulse settings saved", {
      description: "Your preferences will apply on next load.",
    });
  };

  const handleReset = () => {
    setRefreshInterval("30");
    setAlertThreshold("70");
    setNotifyDrift(true);
    setNotifyRelease(true);
    setNotifySecurity(true);
    setNotifyApproval(false);
    setShowSparklines(true);
    setShowSignalFeed(true);
    setShowSubsystems(true);
    setCompactSidebar(false);
    setRealtimeStream(true);
    setIncludeArchived(false);
    try {
      localStorage.removeItem("vyron_workpulse_settings");
    } catch {
      // ignore
    }
    toast.info("WorkPulse settings reset to defaults");
  };

  return (
    <div className="space-y-5 animate-in fade-in-0 duration-200 max-w-3xl">
      {/* Page section header */}
      <div className="flex items-center gap-2 pb-1">
        <Settings className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">WorkPulse Settings</h2>
        <Badge variant="outline" className="text-[9px] font-mono border-border/60 text-muted-foreground">
          Preferences
        </Badge>
      </div>

      {/* ─── Polling & Thresholds ─────────────────────────────────────── */}
      <SettingSection title="Telemetry">
        <SettingRow
          label="Auto-Refresh Interval"
          description="How often WorkPulse polls for updated engineering signals and metrics"
          icon={RefreshCw}
        >
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="h-8 w-32 text-xs border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10" className="text-xs">Every 10s</SelectItem>
              <SelectItem value="30" className="text-xs">Every 30s</SelectItem>
              <SelectItem value="60" className="text-xs">Every 1 min</SelectItem>
              <SelectItem value="300" className="text-xs">Every 5 min</SelectItem>
              <SelectItem value="0" className="text-xs">Manual only</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow
          label="Health Alert Threshold"
          description="Projects with health score below this value will be flagged with a warning indicator"
          icon={Gauge}
        >
          <Select value={alertThreshold} onValueChange={setAlertThreshold}>
            <SelectTrigger className="h-8 w-24 text-xs border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50" className="text-xs">50%</SelectItem>
              <SelectItem value="60" className="text-xs">60%</SelectItem>
              <SelectItem value="70" className="text-xs">70% (default)</SelectItem>
              <SelectItem value="80" className="text-xs">80%</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow
          label="Realtime Stream"
          description="Subscribe to Supabase Realtime changes for live event updates without manual refresh"
          icon={Zap}
        >
          <Switch
            checked={realtimeStream}
            onCheckedChange={setRealtimeStream}
            aria-label="Toggle realtime stream"
          />
        </SettingRow>

        <SettingRow
          label="Include Archived Projects"
          description="Show archived projects in telemetry calculations and pulse grid"
          icon={Clock}
        >
          <Switch
            checked={includeArchived}
            onCheckedChange={setIncludeArchived}
            aria-label="Include archived projects"
          />
        </SettingRow>
      </SettingSection>

      {/* ─── Notifications ───────────────────────────────────────────── */}
      <SettingSection title="Signal Notifications">
        <SettingRow
          label="Architecture Drift Alerts"
          description="Notify when drift findings exceed baseline deviation tolerance"
          icon={Mail}
        >
          <Switch
            checked={notifyDrift}
            onCheckedChange={setNotifyDrift}
            aria-label="Toggle drift alerts"
          />
        </SettingRow>

        <SettingRow
          label="Release Gate Alerts"
          description="Notify when a release gate evaluation completes or is blocked"
          icon={CheckCircle2}
        >
          <Switch
            checked={notifyRelease}
            onCheckedChange={setNotifyRelease}
            aria-label="Toggle release gate alerts"
          />
        </SettingRow>

        <SettingRow
          label="Security Signal Alerts"
          description="Notify on critical security findings from AST or Bandit scanner"
          icon={Shield}
        >
          <Switch
            checked={notifySecurity}
            onCheckedChange={setNotifySecurity}
            aria-label="Toggle security alerts"
          />
        </SettingRow>

        <SettingRow
          label="ADR Approval Reminders"
          description="Remind when Architecture Decision Records are awaiting sign-off"
          icon={Bell}
        >
          <Switch
            checked={notifyApproval}
            onCheckedChange={setNotifyApproval}
            aria-label="Toggle ADR approval alerts"
          />
        </SettingRow>
      </SettingSection>

      {/* ─── Display ─────────────────────────────────────────────────── */}
      <SettingSection title="Display">
        <SettingRow
          label="Health Sparklines"
          description="Show mini health trend sparklines on project pulse cards"
          icon={Sliders}
        >
          <Switch
            checked={showSparklines}
            onCheckedChange={setShowSparklines}
            aria-label="Toggle health sparklines"
          />
        </SettingRow>

        <SettingRow
          label="Engineering Signal Feed"
          description="Show live signal feed section in the Overview tab"
          icon={Zap}
        >
          <Switch
            checked={showSignalFeed}
            onCheckedChange={setShowSignalFeed}
            aria-label="Toggle signal feed"
          />
        </SettingRow>

        <SettingRow
          label="Subsystem Status Row"
          description="Show API, AI, and Queue subsystem health indicators in the sidebar widget"
          icon={Gauge}
        >
          <Switch
            checked={showSubsystems}
            onCheckedChange={setShowSubsystems}
            aria-label="Toggle subsystem status"
          />
        </SettingRow>

        <SettingRow
          label="Compact Sidebar Widget"
          description="Collapse the WorkPulse sidebar widget to a minimal 2-line summary"
          icon={Settings}
        >
          <Switch
            checked={compactSidebar}
            onCheckedChange={setCompactSidebar}
            aria-label="Toggle compact sidebar"
          />
        </SettingRow>
      </SettingSection>

      {/* ─── Save & Reset ────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3",
        )}
      >
        <p className="text-[10.5px] text-muted-foreground">
          Settings are saved locally and applied on next page load.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            Reset to defaults
          </Button>
          <Button size="sm" onClick={handleSave} className="h-8 text-xs font-semibold gap-1.5">
            <CheckCircle2 className="size-3.5" />
            Save settings
          </Button>
        </div>
      </div>
    </div>
  );
}
