import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Calendar,
  User,
  FolderGit2,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ActivityEvent } from "@/types/activity";

interface EventDrawerProps {
  event: ActivityEvent | null;
  onClose: () => void;
}

export function EventDrawer({ event, onClose }: EventDrawerProps) {
  const [copiedSha, setCopiedSha] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!event) return null;

  const copySha = () => {
    if (!event.provenance_sha) return;
    navigator.clipboard.writeText(event.provenance_sha);
    setCopiedSha(true);
    toast.success("Provenance SHA-256 copied to clipboard");
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(event.payload, null, 2));
    setCopiedJson(true);
    toast.success("Payload JSON copied to clipboard");
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Determine deep link based on event_type and project_id
  const getDeepLink = () => {
    const pId = event.project_id || "demo-proj-1";
    switch (event.event_type) {
      case "gate_evaluation":
      case "publish_attempt":
      case "publish_override":
        return {
          label: "View Release Gate Status",
          to: `/app/studio/${pId}/publish`,
        };
      case "scan_completion":
        return {
          label: "View Code Health & AST Radar",
          to: `/app/projects/${pId}/code-health`,
        };
      case "report_export":
        return {
          label: "Open Reports Archive",
          to: "/app/reports",
        };
      case "integration_connect":
        return {
          label: "Inspect GitHub Mirror",
          to: "/app/github",
        };
      case "auth_anomaly":
        return {
          label: "Inspect Security Audit Logs",
          to: "/app/admin/audit",
        };
      case "member_invite":
      case "role_change":
        return {
          label: "Manage Team RBAC",
          to: "/app/team",
        };
      default:
        return {
          label: "Open Project Workspace",
          to: `/app/projects/${pId}`,
        };
    }
  };

  const deepLink = getDeepLink();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-lg border-l border-border bg-card p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="font-mono text-xs uppercase" variant="outline">
                {event.event_type.replace(/_/g, " ")}
              </Badge>
              <Badge className="font-mono text-xs uppercase bg-primary/10 text-primary">
                {event.severity}
              </Badge>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-foreground tracking-tight">
              {event.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Metadata Details */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-md border border-border/50 bg-muted/20 p-2.5">
            <span className="text-muted-foreground flex items-center gap-1 font-mono text-[10px] uppercase">
              <User className="size-3" /> Actor
            </span>
            <p className="mt-1 font-medium text-foreground">{event.actor_name}</p>
          </div>

          <div className="rounded-md border border-border/50 bg-muted/20 p-2.5">
            <span className="text-muted-foreground flex items-center gap-1 font-mono text-[10px] uppercase">
              <FolderGit2 className="size-3" /> Project
            </span>
            <p className="mt-1 font-medium text-foreground truncate">
              {event.project_name || "Workspace Scope"}
            </p>
          </div>

          <div className="col-span-2 rounded-md border border-border/50 bg-muted/20 p-2.5">
            <span className="text-muted-foreground flex items-center gap-1 font-mono text-[10px] uppercase">
              <Calendar className="size-3" /> Timestamp
            </span>
            <p className="mt-1 font-mono text-foreground">
              {new Date(event.created_at).toUTCString()}
            </p>
          </div>
        </div>

        {/* Provenance SHA-256 Vault Checksum */}
        <div className="mt-5 rounded-md border border-primary/20 bg-primary/5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="size-4" /> Cryptographic Provenance SHA-256
            </span>
            {event.provenance_sha && (
              <Button
                variant="ghost"
                size="sm"
                onClick={copySha}
                className="h-7 text-xs gap-1 px-2 text-primary hover:bg-primary/10"
              >
                {copiedSha ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copiedSha ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-foreground/90 break-all bg-background/80 p-2 rounded border border-border/40">
            {event.provenance_sha || "Not anchored (External or transient log)"}
          </p>
        </div>

        {/* Payload JSON Inspector */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted-foreground">
              <Terminal className="size-3.5" /> Payload JSON
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={copyJson}
              className="h-7 text-xs gap-1 px-2"
            >
              {copiedJson ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copiedJson ? "Copied" : "Copy JSON"}
            </Button>
          </div>
          <pre className="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs font-mono text-foreground overflow-x-auto max-h-60 leading-relaxed">
            {JSON.stringify(event.payload, null, 2)}
          </pre>
        </div>

        {/* Deep Link to Source Section */}
        <div className="mt-6 border-t border-border/60 pt-4">
          <Link
            to={deepLink.to}
            className="flex items-center justify-center gap-2 w-full rounded-md bg-primary py-2.5 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            onClick={onClose}
          >
            {deepLink.label}
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
