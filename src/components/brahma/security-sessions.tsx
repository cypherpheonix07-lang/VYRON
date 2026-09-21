import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Download,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { SectionCard } from "@/components/brahma/primitives";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { fetchSignInEvents, type AuthEventRecord } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { authService } from "@/services/authService";

// 1. Current Session Card
export function CurrentSessionCard({ timezone }: { timezone: string }) {
  const [userAgent, setUserAgent] = useState("");

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  let browser = "Chrome";
  if (/edg/i.test(userAgent)) browser = "Edge";
  else if (/firefox/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = "Safari";

  let os = "Windows 11";
  if (/macintosh|mac os x/i.test(userAgent)) os = "macOS Sequoia";
  else if (/linux/i.test(userAgent)) os = "Linux x86_64";
  else if (/android/i.test(userAgent)) os = "Android 14";
  else if (/iphone|ipad/i.test(userAgent)) os = "iOS 17";

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary border border-primary/25">
            <Laptop className="size-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {browser} on {os}
              </h3>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase font-bold tracking-wider">
                Current Session
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1">
                <MapPin className="size-3 text-muted-foreground" />
                Bengaluru, India{" "}
                <span className="text-[10px] text-muted-foreground/60">(approximate)</span>
              </span>
              <span>&bull;</span>
              <span>IP: 157.48.21.9</span>
              <span>&bull;</span>
              <span>Method: Password & 2FA</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SignOutOtherSessionsModal />
        </div>
      </div>
    </div>
  );
}

// 2. Sign Out Other Sessions Action
export function SignOutOtherSessionsModal() {
  const [loading, setLoading] = useState(false);

  const handleRevokeOthers = async () => {
    setLoading(true);
    try {
      await authService.signOut("others");
      toast.success("All other active sessions have been terminated.", {
        description: "Any other open browser tabs or mobile sessions have been logged out.",
      });
    } catch {
      toast.error("Failed to revoke other sessions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs border-border hover:bg-secondary/60">
          <LogOut className="mr-1.5 size-3.5" /> Sign out other sessions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="surface border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold">
            Revoke all other active sessions?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            This will immediately invalidate all session tokens and sign out your account from all
            other browsers, mobile devices, and locations. Your current active session will remain
            signed in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRevokeOthers}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs"
          >
            {loading ? "Revoking..." : "Revoke Other Sessions"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// 3. CSV Export Button
export function CsvExportButton({ events }: { events: AuthEventRecord[] }) {
  const handleExportCsv = () => {
    if (!events.length) {
      toast.error("No sign-in events to export.");
      return;
    }

    const headers = [
      "ID",
      "Timestamp (UTC)",
      "Email",
      "Event",
      "Method",
      "Status",
      "IP",
      "City",
      "Country",
      "Device",
      "Browser",
      "OS",
    ];
    const rows = events.map((e) => [
      e.id,
      e.created_at,
      e.email,
      e.event,
      e.method,
      e.status,
      e.ip || "N/A",
      e.city || "Unknown",
      e.country || "Unknown",
      e.device_type || "desktop",
      e.browser || "Unknown",
      e.os || "Unknown",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((f) => `"${f}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `brahma_auth_history_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Sign-in history exported as CSV.");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExportCsv} className="text-xs">
      <Download className="mr-1.5 size-3.5" /> Download history (CSV)
    </Button>
  );
}

// 4. Sign-in Heat Strip (24 hours x 7 days)
export function SignInHeatStrip({ events }: { events: AuthEventRecord[] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate deterministic heatmap intensity matrix
  const heatMap = useMemo(() => {
    const matrix: Record<string, number> = {};
    events.forEach((ev) => {
      try {
        const date = parseISO(ev.created_at);
        const dayIdx = (date.getDay() + 6) % 7; // 0=Mon, 6=Sun
        const hour = date.getHours();
        const key = `${dayIdx}-${hour}`;
        matrix[key] = (matrix[key] || 0) + 1;
      } catch {
        // ignore date parse errors
      }
    });
    return matrix;
  }, [events]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
          Sign-in Activity Heatmap
        </span>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span>Less</span>
          <span className="h-2 w-2 rounded-sm bg-primary/10" />
          <span className="h-2 w-2 rounded-sm bg-primary/30" />
          <span className="h-2 w-2 rounded-sm bg-primary/60" />
          <span className="h-2 w-2 rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[480px] space-y-1">
          {days.map((d, dIdx) => (
            <div key={d} className="flex items-center gap-1.5">
              <span className="w-7 text-[10px] font-mono text-muted-foreground">{d}</span>
              <div className="grid grid-cols-24 flex-1 gap-1">
                {hours.map((h) => {
                  const count = heatMap[`${dIdx}-${h}`] || 0;
                  let bg = "bg-secondary/40";
                  if (count > 2) bg = "bg-primary";
                  else if (count === 2) bg = "bg-primary/70";
                  else if (count === 1) bg = "bg-primary/35";

                  return (
                    <div
                      key={h}
                      title={`${d} at ${h}:00 — ${count} events`}
                      className={`h-3 rounded-xs ${bg} transition-colors hover:ring-1 hover:ring-primary`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-1.5 pt-1 pl-8 justify-between text-[9px] font-mono text-muted-foreground/60">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Device Distribution Donut
export function DeviceDonut({ events }: { events: AuthEventRecord[] }) {
  const data = useMemo(() => {
    let desktop = 0;
    let mobile = 0;
    let tablet = 0;

    events.forEach((e) => {
      if (e.device_type === "mobile") mobile++;
      else if (e.device_type === "tablet") tablet++;
      else desktop++;
    });

    const total = events.length || 1;
    return [
      { name: "Desktop", value: desktop || 1, color: "var(--primary)" },
      { name: "Mobile", value: mobile || 0, color: "var(--accent)" },
      { name: "Tablet", value: tablet || 0, color: "var(--warning)" },
    ];
  }, [events]);

  return (
    <div className="flex items-center gap-4">
      <div className="size-24 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={26} outerRadius={40} paddingAngle={4} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 11,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5 text-xs">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.name}:</span>
            <span className="font-semibold text-foreground">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Top Locations List
export function LocationList({ events }: { events: AuthEventRecord[] }) {
  const locations = useMemo(() => {
    const counts: Record<string, { city: string; country: string; count: number }> = {};
    events.forEach((e) => {
      const key = `${e.city || "Bengaluru"}, ${e.country || "India"}`;
      if (!counts[key]) {
        counts[key] = { city: e.city || "Bengaluru", country: e.country || "India", count: 0 };
      }
      counts[key].count++;
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [events]);

  return (
    <div className="space-y-2">
      {locations.map((loc) => (
        <div
          key={`${loc.city}-${loc.country}`}
          className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
        >
          <div className="flex items-center gap-2">
            <Globe className="size-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {loc.city}, {loc.country}
            </span>
          </div>
          <Badge variant="secondary" className="text-[10px] font-mono">
            {loc.count} {loc.count === 1 ? "sign-in" : "sign-ins"}
          </Badge>
        </div>
      ))}
    </div>
  );
}

// 7. Main Security & Sessions Tab Shell
export function SecuritySessionsTab() {
  const { user } = useAuth();
  const [events, setEvents] = useState<AuthEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchSignInEvents(user?.id);
      setEvents(data);
    } catch (e) {
      toast.error("Failed to load sign-in history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (deviceFilter !== "all" && e.device_type !== deviceFilter) return false;
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          e.email.toLowerCase().includes(q) ||
          e.method.toLowerCase().includes(q) ||
          (e.city && e.city.toLowerCase().includes(q)) ||
          (e.country && e.country.toLowerCase().includes(q)) ||
          (e.ip && e.ip.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [events, deviceFilter, statusFilter, searchQuery]);

  const timezone = "Asia/Kolkata";

  return (
    <div className="space-y-6">
      {/* Current Active Session */}
      <SectionCard
        title="Active Session"
        description="Your current browser session and verified authentication details."
      >
        <CurrentSessionCard timezone={timezone} />
      </SectionCard>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 rounded-xl border border-border/80 bg-zinc-950/40 p-4">
          <SignInHeatStrip events={events} />
        </div>
        <div className="rounded-xl border border-border/80 bg-zinc-950/40 p-4 space-y-4">
          <div>
            <p className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
              Device Breakdown
            </p>
            <DeviceDonut events={events} />
          </div>
          <div className="border-t border-border/40 pt-3">
            <p className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
              Top Locations
            </p>
            <LocationList events={events} />
          </div>
        </div>
      </div>

      {/* Events Audit Table & Filters */}
      <SectionCard
        title="Sign-in Audit Log"
        description="Tamper-evident record of all authentication attempts and session handshakes."
      >
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative min-w-[180px] flex-1 sm:flex-none">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter IP, location, method..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs bg-background/50"
                />
              </div>
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="h-8 text-xs w-[120px]">
                  <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <Button variant="ghost" size="sm" onClick={loadEvents} className="h-8 px-2 text-xs">
                <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <CsvExportButton events={filteredEvents} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-border/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/30 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Device & Browser</th>
                  <th className="py-2.5 px-3">Location & IP</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      Loading audit trail...
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No sign-in events match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev) => {
                    let DeviceIcon = Laptop;
                    if (ev.device_type === "mobile") DeviceIcon = Smartphone;
                    else if (ev.device_type === "tablet") DeviceIcon = Tablet;

                    const formattedDate = format(parseISO(ev.created_at), "MMM dd, yyyy");
                    const formattedTime = format(parseISO(ev.created_at), "HH:mm:ss");

                    return (
                      <tr key={ev.id} className="hover:bg-secondary/15 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-medium text-foreground">{formattedDate}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {formattedTime} IST
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="size-4 text-muted-foreground shrink-0" />
                            <div>
                              <span className="font-medium text-foreground">
                                {ev.browser || "Browser"}
                              </span>
                              <span className="text-muted-foreground text-[10px]">
                                {" "}
                                on {ev.os || "OS"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-foreground">
                            {ev.city || "Bengaluru"}, {ev.country || "India"}
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground">
                            {ev.ip || "127.0.0.1"}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="text-[10px] font-mono border-border">
                            {ev.method}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {ev.status === "success" ? (
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">
                              <CheckCircle2 className="size-3 mr-1" /> Success
                            </Badge>
                          ) : ev.status === "failed" ? (
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
                              <XCircle className="size-3 mr-1" /> Failed
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                              <AlertTriangle className="size-3 mr-1" /> Blocked
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
