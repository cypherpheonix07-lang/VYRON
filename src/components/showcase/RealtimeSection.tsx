import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Database,
  Layers,
  Play,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

export function RealtimeSection() {
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(5);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const eventStream = [
    {
      time: "T+00ms",
      stage: "Webhook Dispatch",
      detail: "GitHub push webhook verified via HMAC SHA-256. Shallow git tree delta spawned.",
      status: "confirmed",
      type: "Network",
    },
    {
      time: "T+18ms",
      stage: "Worker Task Queued",
      detail: "Celery task #84b12 assigned to worker pool 'ast-heavy-01' via Redis queue.",
      status: "confirmed",
      type: "Worker",
    },
    {
      time: "T+42ms",
      stage: "Lizard AST Analysis",
      detail: "Parsed 14 modified Python & TypeScript files. Average cyclomatic score: 3.8.",
      status: "confirmed",
      type: "AST",
    },
    {
      time: "T+76ms",
      stage: "Bandit Security Scanner",
      detail: "Syntax tree vulnerability scan completed. 0 High/Critical findings. 1 Low note.",
      status: "confirmed",
      type: "Security",
    },
    {
      time: "T+110ms",
      stage: "Traceability Correlation",
      detail: "Verified test coverage for REQ-PAY-004. Traceability index: 94.2%.",
      status: "confirmed",
      type: "Governance",
    },
    {
      time: "T+145ms",
      stage: "Copilot State Synchronized",
      detail: "PostgreSQL LISTEN/NOTIFY broadcasted live state update to connected browser WebSocket.",
      status: "confirmed",
      type: "Realtime",
    },
    {
      time: "T+180ms",
      stage: "Release Gate Evaluated",
      detail: "All 4 mathematical release policies evaluated. PASS decision certified.",
      status: "confirmed",
      type: "Gate",
    },
    {
      time: "T+195ms",
      stage: "SHA-256 Provenance Sealed",
      detail: "Tamper-evident Merkle hash logged to immutable audit ledger.",
      status: "confirmed",
      type: "Audit",
    },
  ];

  const playStream = () => {
    setIsStreaming(true);
    setCurrentEventIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < eventStream.length) {
        setCurrentEventIndex(idx);
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 600);
  };

  return (
    <section className="py-20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
            <Radio className="size-3.5" />
            <span>Event Streaming • PostgreSQL LISTEN/NOTIFY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Real-Time Telemetry & Asynchronous Pipeline Sync
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Long-running AST scans and repository evaluations cannot block web workers. Brahma streams granular progress
            events from asynchronous Python workers to client browsers via WebSockets in sub-200ms roundtrips.
          </p>
        </div>

        {/* INTERACTIVE EVENT STREAM CARD */}
        <Card className="border-border/80 bg-card/90 shadow-xl overflow-hidden backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground font-mono">
                    Live Analysis Event Bus (ws://broker/events)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Telemetry Stream: Event {currentEventIndex + 1} of {eventStream.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={playStream}
                  disabled={isStreaming}
                  size="sm"
                  className="gap-1.5 text-xs bg-cyan-500 text-black font-bold hover:bg-cyan-400"
                >
                  <Play className="size-3.5" />
                  {isStreaming ? "Streaming Live Events..." : "Simulate Live Push Event"}
                </Button>
                <Button
                  onClick={() => setCurrentEventIndex(eventStream.length - 1)}
                  disabled={isStreaming}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <RotateCcw className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* EVENT TIMELINE */}
            <div className="space-y-2 font-mono text-xs">
              {eventStream.slice(0, currentEventIndex + 1).map((ev, idx) => (
                <div
                  key={ev.stage}
                  className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all duration-150 animate-in fade-in slide-in-from-left-2 ${
                    idx === currentEventIndex
                      ? "border-cyan-500/60 bg-cyan-500/10 ring-1 ring-cyan-500/20"
                      : "border-border/50 bg-secondary/20 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-cyan-400 font-bold w-14 shrink-0">{ev.time}</span>
                    <Badge variant="outline" className="text-[9px] py-0 border-border/60 uppercase">
                      {ev.type}
                    </Badge>
                    <span className="font-bold text-foreground text-xs">{ev.stage}</span>
                    <span className="hidden md:inline text-muted-foreground text-[11px]">— {ev.detail}</span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> SERVER-CONFIRMED
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CLIENT PRESENTATION VS SERVER-CONFIRMED STATE CALLOUT (Requirement 390) */}
            <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                  Client Presentation Layer
                </span>
                <p className="text-muted-foreground text-[11px]">
                  Optimistically updates UI indicators and renders animated progress graphs without blocking user
                  interaction.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                  Server-Confirmed Transactional State
                </span>
                <p className="text-muted-foreground text-[11px]">
                  Official gate sign-offs and metric updates only commit when verified by background Python workers and
                  persisted to PostgreSQL.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
