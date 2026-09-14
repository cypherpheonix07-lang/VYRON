import React, { useState } from "react";
import {
  Github,
  Plus,
  RefreshCw,
  User,
  Building2,
  CheckCircle2,
  Shield,
  Activity,
  LogOut,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useDemoMode } from "@/hooks/useDemoMode";
import { testGitHubConnection } from "@/lib/github/oauth";
import type { GitHubAccountItem } from "./GitHubAccountSelector";

export interface GitHubConnectorCardProps {
  accounts: GitHubAccountItem[];
  isLoading?: boolean;
  onConnectGitHub: () => void;
  onAddRepository?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

export function GitHubConnectorCard({
  accounts,
  isLoading = false,
  onConnectGitHub,
  onAddRepository,
  onDisconnect,
  className = "",
}: GitHubConnectorCardProps) {
  const { isDemo } = useDemoMode();
  const [testingConnection, setTestingConnection] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    latencyMs?: number;
    status: "Operational" | "Degraded" | "Disconnected";
  } | null>(null);

  const isConnected = accounts.length > 0;

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      if (isDemo) {
        await new Promise((r) => setTimeout(r, 200));
        setHealthStatus({ latencyMs: 38, status: "Operational" });
        toast.success("GitHub Connector Health: 100% Operational (Simulated)", {
          description: "Round-trip latency: 38ms · Token: valid · Scopes: repo, read:org, read:user",
        });
        return;
      }

      const res = await testGitHubConnection(accounts[0]?.login);
      setHealthStatus({ latencyMs: res.latencyMs, status: res.status });
      if (res.ok) {
        toast.success(`GitHub Connector Health: ${res.status}`, {
          description: `Round-trip latency: ${res.latencyMs}ms · Token active · Permissions verified`,
        });
      } else {
        toast.error(`GitHub Connector: ${res.status}`, {
          description: res.error || "Connection check failed. Consider re-authorizing.",
        });
      }
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/80 bg-zinc-950/60 p-5 shadow-lg backdrop-blur-md transition-all hover:border-border ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Icon & Meta */}
        <div className="flex items-start gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-border text-foreground shadow-inner">
            <Github className="size-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                GitHub Multi-Account Connector
              </h3>
              {isDemo ? (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-400 text-[10px] font-mono uppercase tracking-wider"
                >
                  <Sparkles className="mr-1 size-3" /> SIMULATED
                </Badge>
              ) : isConnected ? (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-medium"
                >
                  <CheckCircle2 className="mr-1 size-3" /> Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-border bg-zinc-900 text-muted-foreground text-[11px] font-medium"
                >
                  Not Connected
                </Badge>
              )}

              {healthStatus && (
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono ${
                    healthStatus.status === "Operational"
                      ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                      : healthStatus.status === "Degraded"
                      ? "border-amber-500/40 text-amber-300 bg-amber-500/10"
                      : "border-destructive/40 text-destructive bg-destructive/10"
                  }`}
                >
                  <Activity className="mr-1 size-2.5" />
                  {healthStatus.latencyMs}ms · {healthStatus.status}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              Securely discover personal and organization identities, search repositories, and bind codebases with automated webhook telemetry.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {isConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="border-border text-foreground hover:bg-zinc-900 text-xs font-medium"
            >
              <Zap className={`mr-1.5 size-3.5 text-primary ${testingConnection ? "animate-pulse" : ""}`} />
              Test Connection
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onConnectGitHub}
            disabled={isLoading}
            className="border-border text-foreground hover:bg-zinc-900 text-xs font-medium"
          >
            {isConnected ? (
              <>
                <RefreshCw className="mr-1.5 size-3.5" /> Re-Authorize
              </>
            ) : (
              <>
                <Github className="mr-1.5 size-3.5" /> Connect GitHub
              </>
            )}
          </Button>

          {isConnected && onAddRepository && (
            <Button
              id="btn-add-repository"
              size="sm"
              onClick={onAddRepository}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md"
            >
              <Plus className="mr-1.5 size-3.5" /> Add Repository
            </Button>
          )}

          {isConnected && onDisconnect && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDisconnect}
              className="text-muted-foreground hover:text-destructive text-xs"
              title="Disconnect all accounts"
            >
              <LogOut className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Scopes & Connected Accounts Row */}
      <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Permission Scopes */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Shield className="size-3 text-primary" /> Granted Scopes:
          </span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <Badge variant="outline" className="border-border/70 bg-zinc-900/60 text-foreground">
              repo
            </Badge>
            <Badge variant="outline" className="border-border/70 bg-zinc-900/60 text-foreground">
              read:org
            </Badge>
            <Badge variant="outline" className="border-border/70 bg-zinc-900/60 text-foreground">
              read:user
            </Badge>
          </div>
        </div>

        {/* Connected Identities Pill Row */}
        {isConnected && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Identities:
            </span>
            {accounts.map((acc) => {
              const isOrg = acc.type === "organization";
              return (
                <div
                  key={acc.login}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-zinc-900/70 px-2.5 py-1 text-xs text-foreground"
                >
                  {acc.avatar_url ? (
                    <img
                      src={acc.avatar_url}
                      alt={acc.login}
                      className="size-4 rounded-full ring-1 ring-border object-cover"
                    />
                  ) : isOrg ? (
                    <Building2 className="size-3 text-purple-400" />
                  ) : (
                    <User className="size-3 text-cyan-400" />
                  )}
                  <span className="font-medium text-foreground">@{acc.login}</span>
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
    </div>
  );
}

