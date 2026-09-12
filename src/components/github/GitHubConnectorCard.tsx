import React from "react";
import { Github, Plus, RefreshCw, User, Building2, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GitHubAccountItem } from "./GitHubAccountSelector";

export interface GitHubConnectorCardProps {
  accounts: GitHubAccountItem[];
  isLoading?: boolean;
  onConnectGitHub: () => void;
  onAddRepository?: () => void;
  className?: string;
}

export function GitHubConnectorCard({
  accounts,
  isLoading = false,
  onConnectGitHub,
  onAddRepository,
  className = "",
}: GitHubConnectorCardProps) {
  const isConnected = accounts.length > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md transition-all hover:border-slate-700/80 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Icon & Meta */}
        <div className="flex items-start gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700/60 text-white shadow-inner">
            <Github className="size-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white tracking-tight">
                GitHub Multi-Account Connector
              </h3>
              {isConnected ? (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-medium"
                >
                  <CheckCircle2 className="mr-1 size-3" /> Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-slate-700 bg-slate-800/60 text-slate-400 text-[11px] font-medium"
                >
                  Not Connected
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Securely discover personal and organization identities, search repositories, and bind codebases with automated webhook telemetry.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onConnectGitHub}
            disabled={isLoading}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-medium"
          >
            {isConnected ? (
              <>
                <RefreshCw className="mr-1.5 size-3.5" /> Re-Authorize GitHub
              </>
            ) : (
              <>
                <Github className="mr-1.5 size-3.5" /> Connect GitHub
              </>
            )}
          </Button>

          {isConnected && onAddRepository && (
            <Button
              size="sm"
              onClick={onAddRepository}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            >
              <Plus className="mr-1.5 size-3.5" /> Add Repository
            </Button>
          )}
        </div>
      </div>

      {/* Connected Accounts Pill Row */}
      {isConnected && (
        <div className="mt-4 pt-3.5 border-t border-slate-800/70 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Shield className="size-3 text-cyan-400" /> Identities:
          </span>
          {accounts.map((acc) => {
            const isOrg = acc.type === "organization";
            return (
              <div
                key={acc.login}
                className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-xs text-slate-300"
              >
                {acc.avatar_url ? (
                  <img
                    src={acc.avatar_url}
                    alt={acc.login}
                    className="size-4 rounded-full ring-1 ring-slate-700"
                  />
                ) : isOrg ? (
                  <Building2 className="size-3 text-purple-400" />
                ) : (
                  <User className="size-3 text-cyan-400" />
                )}
                <span className="font-medium text-white">@{acc.login}</span>
                <span
                  className={`text-[9px] font-mono uppercase tracking-widest px-1 py-0.2 rounded ${
                    isOrg
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  }`}
                >
                  {isOrg ? "ORG" : "PERSONAL"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
