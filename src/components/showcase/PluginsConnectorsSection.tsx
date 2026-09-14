import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  FileCode2,
  Globe,
  Lock,
  Radio,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";

export function PluginsConnectorsSection() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "manifest" | "connectors">("pipeline");

  const sampleManifest = `{
  "plugin_id": "brahma-security-guard-enterprise",
  "version": "1.2.0",
  "capabilities": [
    {
      "name": "cwe_audit_scan",
      "permission": "SAFE",
      "mutating": false,
      "sandbox": "container_isolated",
      "tools": ["bandit_scanner", "secret_regex"]
    },
    {
      "name": "apply_remediation_patch",
      "permission": "HIGH_IMPACT",
      "mutating": true,
      "requires_approval": true,
      "tools": ["git_patch_apply"]
    }
  ],
  "hooks": {
    "on_pull_request": "cwe_audit_scan",
    "on_release_gate": "verify_zero_cwe_blockers"
  }
}`;

  return (
    <section className="py-20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Extensibility Framework • Manifest-Driven Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Plugins, Skills & MCP-Compatible Connectors
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every engineering organization has proprietary governance rules and internal tooling. Brahma provides a
            strict capability pipeline where plugins and connectors register sandboxed tools that Copilot can invoke
            under cryptographic permission boundaries.
          </p>
        </div>

        {/* 5-STEP EXTENSION FLOW: Plugin -> Capability -> Tool -> Connector -> Copilot (Requirement 346) */}
        <div className="p-6 rounded-2xl border border-border/70 bg-secondary/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              The Extensibility Lineage
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Permission Scoped & Audited</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
            {[
              {
                step: "01",
                name: "Plugin / Skill",
                desc: "Declares manifest & YAML metadata",
                icon: FileCode2,
                color: "text-amber-400",
              },
              {
                step: "02",
                name: "Capability",
                desc: "Registers scoped inspection logic",
                icon: Sparkles,
                color: "text-cyan-400",
              },
              {
                step: "03",
                name: "Tool",
                desc: "Exposes typed parameters & schema",
                icon: Terminal,
                color: "text-indigo-400",
              },
              {
                step: "04",
                name: "Connector (MCP)",
                desc: "Bridges external API securely",
                icon: Globe,
                color: "text-emerald-400",
              },
              {
                step: "05",
                name: "Copilot",
                desc: "Invokes tool with user authorization",
                icon: BrainCircuit,
                color: "text-primary",
              },
            ].map((node, idx) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.step}
                  className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-1.5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">{node.step}</span>
                    <Icon className={`size-4 ${node.color}`} />
                  </div>
                  <div className="text-xs font-bold text-foreground">{node.name}</div>
                  <div className="text-[11px] text-muted-foreground">{node.desc}</div>

                  {idx < 4 && (
                    <span className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs">
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-COLUMN INSPECTION: PERMISSION TIERS & REAL MANIFEST PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: PERMISSIONS & SAFETY TIERS */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Sandboxed Permission Boundaries</h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="size-4" /> SAFE PERMISSION TIER (Read-Only)
                  </span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Auto-Permitted</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AST complexity calculation, vulnerability inspection, git commit log reading, and schema query
                  execution. Cannot mutate code or files. Guaranteed safe in public showcase and demo mode.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                    <Lock className="size-4" /> HIGH_IMPACT TIER (Mutating Actions)
                  </span>
                  <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">User Confirmation Required</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Refactoring patch generation, Git branch merging, database migration execution, and release gate
                  override. Always requires explicit interactive confirmation and leaves an immutable audit entry.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                    <Globe className="size-4" /> MODEL CONTEXT PROTOCOL (MCP)
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono border-border/60">
                    Vendor Neutral
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Standardized client-host bridges allowing any external MCP-compliant server (PostgreSQL, GitHub,
                  Filesystem, Cloudrun) to expose structured tools and resources to Brahma Copilot seamlessly.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: REAL JSON MANIFEST SPECIFICATION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Live Plugin Manifest Contract</h3>
              <span className="text-[10px] font-mono text-muted-foreground">JSON Schema Validated</span>
            </div>

            <div className="rounded-xl border border-border/70 bg-zinc-950/90 p-4 font-mono text-xs overflow-x-auto shadow-inner">
              <pre className="text-zinc-300 leading-relaxed">{sampleManifest}</pre>
            </div>
            <p className="text-[11px] text-muted-foreground">
              All plugins are registered in the database, validated with Pydantic schemas, and executed inside bounded
              containers with strict token and time limits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
