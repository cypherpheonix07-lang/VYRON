/**
 * VYRON — LIVE SYSTEM TEST WORKBENCH & REALTIME CONTROL PLANE
 * 
 * Interactive live testing console providing:
 * 1. 4-Account Persona Switcher (Student, Teacher, Working Professional, Admin)
 * 2. Supabase Real-Time Listener Console (Postgres Changes, Presence Roster, High-Speed Broadcast)
 * 3. Bidirectional Signal Emitter with Roundtrip Latency Ping
 * 4. Live RLS & Privilege Escalation Boundary Probes
 * 5. Integrated 12-Stage Forensics Execution Trigger
 * 
 * Strictly ZERO Raw SQL. Built using React, Tailwind CSS, Lucide icons, and Supabase SDK.
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Activity,
  Send,
  Lock,
  Unlock,
  RefreshCw,
  Clock,
  Sparkles,
  Server,
  Layers,
  GraduationCap,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  supabaseRealtimeHub,
  ChannelStatus,
  RealtimeMessage,
  PresenceMember,
  BroadcastEventType,
} from "@/services/realtime/supabaseRealtimeHub";
import {
  seedAccountManager,
  SeedUserAccount,
  SEED_USER_ACCOUNTS,
} from "@/services/auth/seedUserAccounts";
import { analysisStore } from "@/state/analysis/analysisStore";
import { analysisOrchestrator } from "@/services/orchestrator/analysisOrchestrator";

export function LiveSystemTestWorkbench({ className }: { className?: string }) {
  // 1. Account & Persona State
  const [activeAccount, setActiveAccount] = useState<SeedUserAccount>(() =>
    seedAccountManager.getActiveAccount()
  );
  const [rlsResult, setRlsResult] = useState<{
    tested: boolean;
    allowed: boolean;
    message: string;
    isSecure: boolean;
  } | null>(null);
  const [isolationResult, setIsolationResult] = useState<{
    tested: boolean;
    rowsRetrieved: number;
    crossTenantLeak: boolean;
    message: string;
  } | null>(null);

  // 2. Realtime State
  const [channelStatus, setChannelStatus] = useState<ChannelStatus>("DISCONNECTED");
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [presenceMembers, setPresenceMembers] = useState<PresenceMember[]>([]);
  const [selectedChannel, setSelectedChannel] = useState("vyron:global_realtime_stream");
  const [customPayload, setCustomPayload] = useState('{"metric": "IQR_ANOMALY", "score": 94.2}');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [measuredLatency, setMeasuredLatency] = useState<number | null>(null);

  // 3. Analysis Pipeline State
  const [activeRun, setActiveRun] = useState(() => analysisStore.getActiveRun());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize Realtime Channel on Mount
  useEffect(() => {
    let isMounted = true;

    const initChannel = async () => {
      await supabaseRealtimeHub.subscribeChannel(selectedChannel, {
        userId: activeAccount.id,
        name: activeAccount.name,
        role: activeAccount.role,
      });

      if (isMounted) {
        setChannelStatus(supabaseRealtimeHub.getStatus());
        setMessages(supabaseRealtimeHub.getMessageHistory());
        setPresenceMembers(supabaseRealtimeHub.getPresenceMembers());
      }
    };

    initChannel();

    const unsubscribeRealtime = supabaseRealtimeHub.addListener({
      onStatusChange: (status) => {
        if (isMounted) setChannelStatus(status);
      },
      onMessage: (msg) => {
        if (isMounted) {
          setMessages((prev) => [msg, ...prev].slice(0, 50));
          if (msg.type === "TEST_PING") {
            // Auto reply with PONG
            supabaseRealtimeHub.broadcastMessage(
              "TEST_PONG",
              { receivedAt: Date.now() },
              { userId: activeAccount.id, name: activeAccount.name, role: activeAccount.role }
            );
          } else if (msg.type === "TEST_PONG" && msg.latencyMs !== undefined) {
            setMeasuredLatency(msg.latencyMs);
          }
        }
      },
      onPresenceSync: (members) => {
        if (isMounted) setPresenceMembers(members);
      },
    });

    const unsubscribeAnalysis = analysisStore.subscribe((run) => {
      if (isMounted) {
        setActiveRun(run);
        setIsAnalyzing(run?.status === "RUNNING");
      }
    });

    return () => {
      isMounted = false;
      unsubscribeRealtime();
      unsubscribeAnalysis();
    };
  }, [selectedChannel, activeAccount]);

  // Handle Persona Switching
  const handleSelectAccount = (key: "student" | "teacher" | "professional" | "admin") => {
    const updated = seedAccountManager.switchPersona(key);
    setActiveAccount(updated);
    setRlsResult(null);
    setIsolationResult(null);
    toast.info(`Switched Persona to ${updated.name}`, {
      description: `Role: ${updated.role.toUpperCase()} | Persona: ${updated.personaType}`,
    });

    // Re-track presence with updated role
    supabaseRealtimeHub.subscribeChannel(selectedChannel, {
      userId: updated.id,
      name: updated.name,
      role: updated.role,
    });
  };

  // Live RLS Role Assignment Test
  const handleTestRoleRLS = async () => {
    toast.loading("Probing set_user_role RPC security boundary...", { id: "rls-probe" });
    const res = await seedAccountManager.testRoleAssignmentRLS();
    setRlsResult({ tested: true, ...res });

    if (res.isSecure) {
      toast.success(
        res.allowed
          ? "Admin authorization confirmed (Role escalation permitted)."
          : "RLS boundary verified: Unauthorized escalation successfully blocked!",
        { id: "rls-probe" }
      );
    } else {
      toast.error("RLS Violation: Unexpected privilege behavior!", { id: "rls-probe" });
    }
  };

  // Live Profile Read Isolation Test
  const handleTestIsolation = async () => {
    toast.loading("Testing tenant profile read constraints...", { id: "iso-probe" });
    const res = await seedAccountManager.testProfileReadIsolation();
    setIsolationResult({ tested: true, ...res });

    if (!res.crossTenantLeak) {
      toast.success(res.message, { id: "iso-probe" });
    } else {
      toast.error(res.message, { id: "iso-probe" });
    }
  };

  // Broadcast Message Emitter
  const handleEmitBroadcast = async (eventType: BroadcastEventType, customData?: Record<string, unknown>) => {
    setIsBroadcasting(true);
    let payload = customData;
    if (!payload) {
      try {
        payload = JSON.parse(customPayload);
      } catch {
        payload = { raw: customPayload, timestamp: new Date().toISOString() };
      }
    }

    const success = await supabaseRealtimeHub.broadcastMessage(
      eventType,
      payload,
      {
        userId: activeAccount.id,
        role: activeAccount.role,
        name: activeAccount.name,
      }
    );

    setIsBroadcasting(false);
    if (success) {
      toast.success(`Broadcast signal sent: ${eventType}`, {
        description: `Dispatched to channel '${selectedChannel}' as ${activeAccount.name}.`,
      });
    } else {
      toast.error(`Broadcast failed: Channel not in SUBSCRIBED state.`);
    }
  };

  // Ping Roundtrip Latency Probe
  const handlePingLatency = async () => {
    setMeasuredLatency(null);
    toast.info("Sending realtime ping probe...", { id: "ping" });
    await supabaseRealtimeHub.pingLatency({
      userId: activeAccount.id,
      role: activeAccount.role,
      name: activeAccount.name,
    });
    toast.success("Ping dispatched. Awaiting reflection...", { id: "ping" });
  };

  // Trigger 12-Stage Forensics
  const handleRunAnalysis = async () => {
    toast.info(`Launching 12-Stage Forensics as ${activeAccount.name}...`);
    try {
      await analysisOrchestrator.runPipeline({
        datasetId: "sample_fraud_benchmark",
        datasetName: "IEEE-CIS Fraud Benchmark (Test Partition)",
        mode: "NORMAL",
        speedMultiplier: 2.0,
      });
      toast.success("12-Stage Forensics pipeline completed and cryptographically sealed!");
    } catch (err) {
      toast.error(`Pipeline failed: ${(err as Error).message}`);
    }
  };

  return (
    <div className={cn("space-y-6 max-w-7xl mx-auto p-4 sm:p-6", className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="size-5 text-primary animate-pulse" />
            <h2 className="text-lg font-bold text-foreground">
              Live System Test Workbench & Realtime Control Plane
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test live Supabase Realtime listeners, evaluate 4-account personas, probe RLS boundaries, and dispatch cryptographic telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "font-mono text-xs px-2.5 py-1 flex items-center gap-1.5",
              channelStatus === "SUBSCRIBED"
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : channelStatus === "CONNECTING"
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-rose-500/15 text-rose-400 border-rose-500/30"
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                channelStatus === "SUBSCRIBED"
                  ? "bg-emerald-400 animate-ping"
                  : channelStatus === "CONNECTING"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-rose-400"
              )}
            />
            <span>REALTIME: {channelStatus}</span>
          </Badge>

          {measuredLatency !== null && (
            <Badge variant="outline" className="font-mono text-xs bg-primary/10 text-primary border-primary/30">
              <Clock className="size-3 mr-1" />
              {measuredLatency}ms RTT
            </Badge>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="personas" className="w-full space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md bg-muted/60 p-1">
          <TabsTrigger value="personas" className="font-mono text-xs gap-1.5">
            <Users className="size-3.5" /> 4 User Accounts
          </TabsTrigger>
          <TabsTrigger value="realtime" className="font-mono text-xs gap-1.5">
            <Radio className="size-3.5" /> Realtime Hub
          </TabsTrigger>
          <TabsTrigger value="forensics" className="font-mono text-xs gap-1.5">
            <Zap className="size-3.5" /> 12-Stage Forensics
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: 4 USER ACCOUNTS & PERSONA SUITE */}
        <TabsContent value="personas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(SEED_USER_ACCOUNTS).map(([key, acc]) => {
              const isSelected = activeAccount.id === acc.id;
              const Icon =
                acc.role === "student"
                  ? GraduationCap
                  : acc.role === "teacher"
                  ? UserCheck
                  : acc.role === "professional"
                  ? Briefcase
                  : Server;

              return (
                <Card
                  key={acc.id}
                  onClick={() => handleSelectAccount(key as "student" | "teacher" | "professional" | "admin")}
                  className={cn(
                    "cursor-pointer transition-all border relative overflow-hidden",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10 ring-1 ring-primary/40"
                      : "border-border/50 bg-card/40 hover:bg-card/70"
                  )}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-secondary text-primary">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold text-foreground">{acc.name}</CardTitle>
                          <span className="text-[11px] font-mono text-muted-foreground">{acc.email}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-2 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-[10px] font-mono font-bold", acc.badgeColor)}>
                        {acc.role.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {acc.personaType}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">{acc.title} — {acc.organization}</p>

                    <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-mono">
                        {acc.permissions.length} Permissions
                      </span>
                      {isSelected ? (
                        <span className="font-bold font-mono text-primary flex items-center gap-1">
                          <CheckCircleIcon className="size-3" /> ACTIVE
                        </span>
                      ) : (
                        <span className="text-zinc-500 hover:text-foreground">Click to Activate</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Active Persona Details & Live RLS Probe Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <Card className="lg:col-span-6 border-border/50 bg-card/60 backdrop-blur-xl">
              <CardHeader className="p-5 pb-3 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">
                        Active Persona Profile: {activeAccount.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Effective permissions, recommended navigation routes, and architectural complexity
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("font-mono text-xs", activeAccount.badgeColor)}>
                    {activeAccount.role.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Unlock className="size-3.5 text-emerald-400" /> Granted Capabilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {activeAccount.permissions.map((p) => (
                      <div
                        key={p}
                        className="px-2.5 py-1 rounded bg-secondary/50 font-mono text-[11px] text-foreground flex items-center gap-1.5"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Lock className="size-3.5 text-rose-400" /> RLS Restricted Invariants
                  </h4>
                  <div className="space-y-1">
                    {activeAccount.restrictedActions.map((r) => (
                      <div
                        key={r}
                        className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 font-mono text-[11px] text-rose-300 flex items-center gap-1.5"
                      >
                        <span className="size-1.5 rounded-full bg-rose-400" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/30">
                  <span className="text-muted-foreground font-mono">Recommended Dashboards: </span>
                  <span className="font-bold text-foreground font-mono">
                    {activeAccount.experienceProfile.defaultDashboard}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Live Security & RLS Test Panel */}
            <Card className="lg:col-span-6 border-border/50 bg-card/60 backdrop-blur-xl">
              <CardHeader className="p-5 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="size-5 text-amber-400" />
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground">
                      Live RLS & Privilege Escalation Probes
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Verify PostgreSQL Row Level Security boundaries under the active persona
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-border/40 bg-zinc-950/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">Probe 1: set_user_role RPC Escalation</h4>
                      <p className="text-muted-foreground text-[11px]">
                        Calls RPC to mutate role to 'admin'. Must succeed ONLY for verified Admin.
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleTestRoleRLS} className="h-7 text-xs font-mono">
                      Test Probe
                    </Button>
                  </div>

                  {rlsResult && (
                    <div
                      className={cn(
                        "p-2.5 rounded-lg border text-xs font-mono",
                        rlsResult.isSecure
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      )}
                    >
                      {rlsResult.isSecure ? "VERIFIED SECURE: " : "VULNERABILITY DETECTED: "}
                      {rlsResult.message}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-border/40 bg-zinc-950/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">Probe 2: profiles Table Cross-Read Isolation</h4>
                      <p className="text-muted-foreground text-[11px]">
                        Queries public.profiles. Students must see ONLY their own row.
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleTestIsolation} className="h-7 text-xs font-mono">
                      Test Probe
                    </Button>
                  </div>

                  {isolationResult && (
                    <div
                      className={cn(
                        "p-2.5 rounded-lg border text-xs font-mono",
                        !isolationResult.crossTenantLeak
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      )}
                    >
                      {isolationResult.message}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: REALTIME HUB & BROADCAST CONSOLE */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Realtime Controls & Signal Emitter */}
            <Card className="lg:col-span-5 border-border/50 bg-card/60 backdrop-blur-xl">
              <CardHeader className="p-5 pb-3 border-b border-border/30">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Radio className="size-4 text-primary" />
                  <span>Realtime Broadcast Emitter</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Dispatch peer signals across channel '{selectedChannel}'
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1 block">Active Channel</label>
                  <Input
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="font-mono text-xs"
                    placeholder="Channel name..."
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Preset Broadcast Signals</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isBroadcasting || channelStatus !== "SUBSCRIBED"}
                      onClick={() =>
                        handleEmitBroadcast("ANOMALY_ALERT", {
                          entityId: "TX-1003",
                          amount: 940.0,
                          riskIndex: 94,
                          reason: "Bipartite cross-border velocity burst",
                        })
                      }
                      className="text-xs font-mono justify-start h-8"
                    >
                      <Sparkles className="size-3 mr-1 text-amber-400" /> Anomaly Alert
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isBroadcasting || channelStatus !== "SUBSCRIBED"}
                      onClick={() =>
                        handleEmitBroadcast("PIPELINE_UPDATE", {
                          stage: "12_CRYPTOGRAPHIC_SEAL",
                          status: "COMPLETED",
                          proofHash: "sha256_mock_broadcast_proof",
                        })
                      }
                      className="text-xs font-mono justify-start h-8"
                    >
                      <Zap className="size-3 mr-1 text-primary" /> Pipeline Update
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isBroadcasting || channelStatus !== "SUBSCRIBED"}
                      onClick={() =>
                        handleEmitBroadcast("PEER_REVIEW_SIGNAL", {
                          reviewer: activeAccount.name,
                          rubricGrade: "A+",
                          feedback: "Clean architecture modularity verified.",
                        })
                      }
                      className="text-xs font-mono justify-start h-8"
                    >
                      <GraduationCap className="size-3 mr-1 text-emerald-400" /> Peer Review
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isBroadcasting || channelStatus !== "SUBSCRIBED"}
                      onClick={handlePingLatency}
                      className="text-xs font-mono justify-start h-8"
                    >
                      <Clock className="size-3 mr-1 text-blue-400" /> Ping Latency
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1 block">Custom Payload (JSON)</label>
                  <textarea
                    value={customPayload}
                    onChange={(e) => setCustomPayload(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-zinc-950 p-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    size="sm"
                    disabled={isBroadcasting || channelStatus !== "SUBSCRIBED"}
                    onClick={() => handleEmitBroadcast("CUSTOM_EVENT")}
                    className="w-full mt-2 text-xs font-mono gap-1.5"
                  >
                    <Send className="size-3" /> Broadcast Custom Event
                  </Button>
                </div>

                {/* Online Presence Roster */}
                <div className="pt-3 border-t border-border/30">
                  <h4 className="text-xs font-bold font-mono text-foreground mb-2 flex items-center justify-between">
                    <span>Presence Roster ({presenceMembers.length})</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Auto-synchronized</span>
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {presenceMembers.map((m) => (
                      <div
                        key={m.userId}
                        className="p-2 rounded-lg bg-zinc-950/50 border border-border/30 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-semibold text-foreground">{m.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-mono">
                          {m.role.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Realtime Event Log Feed */}
            <Card className="lg:col-span-7 border-border/50 bg-card/60 backdrop-blur-xl">
              <CardHeader className="p-5 pb-3 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    <CardTitle className="text-sm font-bold text-foreground">
                      Live Message Feed ({messages.length})
                    </CardTitle>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setMessages([])}
                    className="h-7 text-xs font-mono text-muted-foreground hover:text-foreground"
                  >
                    Clear Feed
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-xs text-muted-foreground font-mono">
                      No realtime broadcast events received yet. Dispatch a preset signal to observe live reflection.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3 rounded-lg border border-border/40 bg-zinc-950/70 text-xs font-mono space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">{msg.type}</span>
                            <span className="text-muted-foreground text-[10px]">
                              from {msg.sender.name} ({msg.sender.role})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {msg.latencyMs !== undefined && (
                              <span className="text-[10px] text-emerald-400 font-bold">
                                {msg.latencyMs}ms
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        <pre className="p-2 rounded bg-zinc-900/80 text-[11px] text-zinc-300 overflow-x-auto">
                          {JSON.stringify(msg.payload, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: 12-STAGE FORENSICS RUNNER */}
        <TabsContent value="forensics" className="space-y-6">
          <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
            <CardHeader className="p-5 pb-3 border-b border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Contextual 12-Stage Forensics Execution
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Execute full statistical anomaly and SHAP attribution pipeline under persona {activeAccount.name} ({activeAccount.role.toUpperCase()})
                  </CardDescription>
                </div>
                <Button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="font-mono text-xs gap-1.5"
                >
                  <RefreshCw className={cn("size-3.5", isAnalyzing && "animate-spin")} />
                  {isAnalyzing ? "Executing 12 Stages..." : "Launch Forensics"}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {activeRun ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg border border-border/40 bg-zinc-950/60">
                    <span className="text-[11px] font-mono text-muted-foreground">RUN IDENTIFIER</span>
                    <p className="text-xs font-mono font-bold text-foreground truncate mt-0.5">
                      {activeRun.id}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/40 bg-zinc-950/60">
                    <span className="text-[11px] font-mono text-muted-foreground">RECORDS EVALUATED</span>
                    <p className="text-lg font-mono font-bold text-foreground mt-0.5">
                      {activeRun.telemetry.recordsProcessed}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/40 bg-zinc-950/60">
                    <span className="text-[11px] font-mono text-muted-foreground">OVERALL RISK INDEX</span>
                    <p className="text-lg font-mono font-bold text-amber-400 mt-0.5">
                      {activeRun.telemetry.overallRiskScore} / 100
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/40 bg-zinc-950/60">
                    <span className="text-[11px] font-mono text-muted-foreground">CRYPTOGRAPHIC SEAL</span>
                    <p className="text-xs font-mono font-bold text-emerald-400 truncate mt-0.5">
                      {activeRun.telemetry.verificationHash || activeRun.verificationHash || "Awaiting seal..."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground font-mono">
                  No active forensic run in memory. Click 'Launch Forensics' to execute on benchmark sample data.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
