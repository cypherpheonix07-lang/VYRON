import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertCircle, Clock, RefreshCw } from "lucide-react";

export interface GitHubSyncStatusProps {
  sync_status: "pending" | "syncing" | "synced" | "failed" | string;
  last_synced_at?: string | null;
  onRetry?: () => void;
  showTimestamp?: boolean;
}

function formatMonoTimestamp(dateStr?: string | null): string {
  if (!dateStr) return "Never synced";
  try {
    const d = new Date(dateStr);
    return d.toISOString().replace("T", " ").substring(0, 19) + "Z";
  } catch {
    return dateStr;
  }
}

export function GitHubSyncStatus({
  sync_status,
  last_synced_at,
  onRetry,
  showTimestamp = true,
}: GitHubSyncStatusProps) {
  const status = sync_status?.toLowerCase() || "pending";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      {status === "synced" && (
        <Badge
          id="badge-sync-synced"
          className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono px-2 py-0.5 flex items-center gap-1.5 shrink-0"
        >
          <CheckCircle2 className="size-3 text-emerald-400" />
          <span>synced</span>
        </Badge>
      )}

      {status === "syncing" && (
        <Badge
          id="badge-sync-syncing"
          className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono px-2 py-0.5 flex items-center gap-1.5 shrink-0"
        >
          <Loader2 className="size-3 animate-spin text-cyan-400" />
          <span>syncing</span>
        </Badge>
      )}

      {status === "pending" && (
        <Badge
          id="badge-sync-pending"
          className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono px-2 py-0.5 flex items-center gap-1.5 shrink-0"
        >
          <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>pending</span>
        </Badge>
      )}

      {status === "failed" && (
        <div className="flex items-center gap-1.5">
          <Badge
            id="badge-sync-failed"
            className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono px-2 py-0.5 flex items-center gap-1.5 shrink-0"
          >
            <AlertCircle className="size-3 text-rose-400" />
            <span>failed</span>
          </Badge>
          {onRetry && (
            <Button
              id="btn-retry-sync"
              size="sm"
              variant="ghost"
              onClick={onRetry}
              className="h-5 px-1.5 text-[10px] text-rose-300 hover:text-rose-100 hover:bg-rose-500/20"
            >
              <RefreshCw className="size-2.5 mr-1" /> Retry
            </Button>
          )}
        </div>
      )}

      {showTimestamp && (
        <span
          title={`Last synchronized: ${last_synced_at || "Never"}`}
          className="text-[11px] font-mono text-muted-foreground flex items-center gap-1"
        >
          <Clock className="size-3 text-zinc-500" />
          {formatMonoTimestamp(last_synced_at)}
        </span>
      )}
    </div>
  );
}
