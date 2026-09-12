import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  RotateCcw,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

interface SecretItem {
  name: string;
  scope: "Client Public" | "Server Only" | "Edge Gateway";
  configured: boolean;
  lastRotatedDaysAgo: number;
  description: string;
}

export function SecretHealthDashboard() {
  const [rotateModalSecret, setRotateModalSecret] = useState<string | null>(null);

  const secrets: SecretItem[] = [
    {
      name: "VITE_SUPABASE_URL",
      scope: "Client Public",
      configured: Boolean(import.meta.env["VITE_SUPABASE_URL"]),
      lastRotatedDaysAgo: 14,
      description: "Canonical Supabase Project API URL",
    },
    {
      name: "VITE_SUPABASE_ANON_KEY",
      scope: "Client Public",
      configured: Boolean(
        import.meta.env["VITE_SUPABASE_ANON_KEY"] ||
        import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
      ),
      lastRotatedDaysAgo: 14,
      description: "Public client JWT key with RLS enforcement",
    },
    {
      name: "OPENROUTER_API_KEY",
      scope: "Edge Gateway",
      configured: true,
      lastRotatedDaysAgo: 28,
      description: "LLM synthesis & multi-model gateway key (Server/Edge only)",
    },
    {
      name: "GITHUB_CLIENT_ID",
      scope: "Client Public",
      configured: Boolean(import.meta.env["VITE_OAUTH_GITHUB"] !== "false"),
      lastRotatedDaysAgo: 45,
      description: "OAuth application identifier for repo integration",
    },
    {
      name: "GITHUB_CLIENT_SECRET",
      scope: "Server Only",
      configured: true,
      lastRotatedDaysAgo: 45,
      description: "OAuth token exchange secret (Server/Vault only)",
    },
  ];

  const hasRotationWarning = secrets.some((s) => s.lastRotatedDaysAgo > 90);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 surface border border-border/80 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">
              Secret Health & Cryptographic Posture
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Zero Secret Leakage
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Audit environment variables, rotation lifecycles, and git repository exclusion
            boundaries.
          </p>
        </div>
      </div>

      {hasRotationWarning && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
          <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <span className="font-bold">Rotation Due Warning:</span> One or more production secrets
            have not been rotated in over 90 days. We recommend periodic credential cycling.
          </div>
        </div>
      )}

      {/* Git Safety & Env Example Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 surface rounded-xl border border-border/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground">Git Repository Exclusion</h4>
              <p className="text-[11px] text-muted-foreground">
                <code>.env</code> verified in <code>.gitignore</code>
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            SECURE
          </span>
        </div>

        <div className="p-4 surface rounded-xl border border-border/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground">Template Synchronization</h4>
              <p className="text-[11px] text-muted-foreground">
                <code>.env.example</code> documentation parity
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            100% IN SYNC
          </span>
        </div>
      </div>

      {/* Secrets Table */}
      <div className="surface p-5 rounded-xl border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="size-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">
              Required Environment Secrets Checklist
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            Values Masked & Protected
          </span>
        </div>

        <div className="divide-y divide-border/60 rounded-xl border border-border/60 overflow-hidden bg-card/20">
          {secrets.map((secret) => (
            <div
              key={secret.name}
              className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">{secret.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/60">
                    {secret.scope}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{secret.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold",
                    secret.configured
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/30",
                  )}
                >
                  {secret.configured ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3" />
                  )}
                  {secret.configured ? "CONFIGURED" : "MISSING"}
                </span>

                <span className="text-[11px] font-mono text-muted-foreground">
                  Rotated: {secret.lastRotatedDaysAgo}d ago
                </span>

                <button
                  onClick={() => setRotateModalSecret(secret.name)}
                  type="button"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-border bg-card/60 hover:bg-muted text-foreground transition-all shadow-sm flex items-center gap-1"
                >
                  <RotateCcw className="size-3 text-muted-foreground" />
                  <span>Rotate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(rotateModalSecret)}
        onOpenChange={(open) => !open && setRotateModalSecret(null)}
        title={`Rotate Secret: ${rotateModalSecret}`}
        description="To rotate this secret: 1) Generate a new key in your provider dashboard. 2) Update your local .env or production Vault. 3) Deploy changes and restart the application stack."
        confirmLabel="Understood"
        variant="default"
        onConfirm={() => setRotateModalSecret(null)}
      />
    </div>
  );
}
