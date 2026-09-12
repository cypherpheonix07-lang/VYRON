/**
 * PROJECT BRAHMA — CONNECTOR STATUS BAR (FL-01-C STEP 2)
 * High-level summary indicator showing active connector counts and connection health.
 */

import React from "react";
import { CheckCircle, AlertCircle, Database, Github, Cpu, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ConnectorStatusItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
}

export interface ConnectorStatusProps {
  connectors?: ConnectorStatusItem[];
  className?: string;
}

export function ConnectorStatus({
  connectors = [
    { id: "github", name: "GitHub", icon: <Github className="size-3" />, connected: true },
    { id: "kaggle", name: "Kaggle", icon: <Database className="size-3" />, connected: true },
    { id: "openrouter", name: "OpenRouter LLM", icon: <Cpu className="size-3" />, connected: true },
    { id: "supabase", name: "Supabase DB", icon: <ShieldCheck className="size-3" />, connected: true },
  ],
  className = "",
}: ConnectorStatusProps) {
  const activeCount = connectors.filter((c) => c.connected).length;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-950/80 text-xs ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-zinc-200">Connectors Health:</span>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[11px] font-mono">
          {activeCount} of {connectors.length} Connected
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {connectors.map((c) => (
          <div key={c.id} className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-300">
            <span
              className={`size-1.5 rounded-full ${
                c.connected ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-zinc-600"
              }`}
            />
            {c.icon}
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
