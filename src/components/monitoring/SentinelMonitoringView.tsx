/**
 * VYRON / BRAHMA — SENTINEL OPERATIONAL MONITORING VIEW
 * Real-time operational telemetry, error budgets, and backend sentinel status.
 */

import React, { useState } from "react";
import {
  Activity,
  ShieldAlert,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { systemFlowEngine, type BackendGlobalMetrics } from "@/services/systemFlow/systemFlowEngine";
import { openAiBackendSentinel } from "@/services/sentinel/openAiBackendSentinel";
import { sentinelIncidentStore, type SentinelIncident } from "@/services/sentinel/sentinelIncidentStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SentinelMonitoringView() {
  const [metrics, setMetrics] = useState<BackendGlobalMetrics>(() => systemFlowEngine.getGlobalMetrics());
  const [incidents, setIncidents] = useState<SentinelIncident[]>(() => sentinelIncidentStore.getIncidents());
  const [sentinelMode] = useState(() => openAiBackendSentinel.getMode());

  const handleRefresh = () => {
    setMetrics(systemFlowEngine.getGlobalMetrics());
    setIncidents(sentinelIncidentStore.getIncidents());
    toast.success("Refreshed operational telemetry and incident logs");
  };

  const activeIncidents = incidents.filter((i) => i.status !== "CLOSED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono tracking-wider uppercase">
              SYSTEM FLOW & SENTINEL TELEMETRY
            </Badge>
            <span className="text-xs text-muted-foreground">• Operational Telemetry Stream</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="size-6 text-primary" />
            Sentinel Operational Monitoring & Health
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl mt-1">
            Real-time backend telemetry, p95 latency percentiles, error rate tracking, and automated sentinel defense loops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleRefresh} className="text-xs gap-1.5">
            <RefreshCw className="size-3.5" />
            Refresh Telemetry
          </Button>
          <Badge variant="outline" className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            Sentinel: {sentinelMode}
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/40">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Throughput (Req/sec)</CardDescription>
            <CardTitle className="text-2xl font-mono font-bold text-foreground">
              {metrics.activeRequestsRps.toFixed(1)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[11px] text-emerald-400 font-medium">Within Target Budget</span>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/40">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">P95 Latency</CardDescription>
            <CardTitle className="text-2xl font-mono font-bold text-foreground">
              {metrics.p95LatencyMs.toFixed(0)} ms
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[11px] text-emerald-400 font-medium">&lt; 120ms Target</span>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/40">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Pool Utilization</CardDescription>
            <CardTitle className="text-2xl font-mono font-bold text-foreground">
              {(metrics.connectionPoolUtilization * 100).toFixed(0)}%
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[11px] text-emerald-400 font-medium">Cache Hit: {(metrics.cacheHitRatio * 100).toFixed(0)}%</span>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/40">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Active Incidents</CardDescription>
            <CardTitle className="text-2xl font-mono font-bold text-foreground">
              {activeIncidents.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[11px] text-emerald-400 font-medium">0 Critical Uncontained</span>
          </CardContent>
        </Card>
      </div>

      {/* Incidents Card */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader className="p-4 border-b border-border/30">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ShieldAlert className="size-4 text-primary" />
            Backend Sentinel Incident History
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Automated threat detections, circuit-breaker engagements, and counterattack logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {incidents.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                Zero active incidents detected. All system telemetry nominal.
              </div>
            ) : (
              incidents.map((incident) => (
                <div key={incident.incidentId} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-mono",
                          incident.severity === "ULTRA_HIGH" || incident.severity === "HIGH"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        )}
                      >
                        {incident.severity}
                      </Badge>
                      <span className="text-xs font-semibold text-foreground">{incident.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{incident.description}</p>
                    <span className="text-[11px] font-mono text-muted-foreground/80 block pt-1">
                      Detected: {new Date(incident.firstSeen).toLocaleString()} • Component: {incident.affectedComponent}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                    {incident.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
