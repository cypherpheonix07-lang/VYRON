/**
 * PROJECT BRAHMA — CONNECTOR CARD COMPONENT (FL-01-C STEP 1)
 * Standardized integration card supporting connected/disconnected/error states and expandable detail drawers.
 */

import React, { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ConnectorCardProps {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  status: "connected" | "disconnected" | "error";
  connectedAs?: string;
  errorMessage?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  children?: ReactNode;
  className?: string;
}

export function ConnectorCard({
  name,
  description,
  icon,
  status,
  connectedAs,
  errorMessage,
  onConnect,
  onDisconnect,
  children,
  className = "",
}: ConnectorCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950 transition-all ${className}`}>
      <div className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">{name}</h3>
              <span
                className={`inline-block size-2 rounded-full ${
                  status === "connected"
                    ? "bg-emerald-400"
                    : status === "error"
                    ? "bg-rose-500"
                    : "bg-zinc-600"
                }`}
              />
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  status === "connected"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : status === "error"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
            {connectedAs && (
              <span className="text-[11px] font-mono text-zinc-400 block mt-1">
                Active account: <span className="text-zinc-200">{connectedAs}</span>
              </span>
            )}
            {errorMessage && (
              <span className="text-[11px] font-mono text-rose-400 block mt-1">
                Error: {errorMessage}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "connected" ? (
            <button
              type="button"
              onClick={onDisconnect}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={onConnect}
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Connect
            </button>
          )}

          {children && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              aria-label="Toggle configuration panel"
            >
              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
          )}
        </div>
      </div>

      {expanded && children && (
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/30">
          {children}
        </div>
      )}
    </div>
  );
}
