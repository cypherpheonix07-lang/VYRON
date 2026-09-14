import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Database,
  FileCheck,
  Fingerprint,
  Key,
  Lock,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

export function SecurityGovernanceSection() {
  const pillars = [
    {
      id: "rls",
      title: "Row-Level Security (RLS) Tenant Isolation",
      icon: Database,
      tagline: "Cryptographic database separation between enterprise organizations",
      details:
        "Every database query automatically appends tenant organization claims from verified JWTs. No customer or project can query or mutate blueprints, repositories, or scan findings belonging to another tenant at the database engine level.",
      badge: "Zero Cross-Tenant Leakage",
    },
    {
      id: "merkle",
      title: "Immutable SHA-256 Provenance Ledger",
      icon: Fingerprint,
      tagline: "Append-only cryptographic hashing for every analysis and gate sign-off",
      details:
        "When an analysis is executed or a release gate is evaluated, input source trees, analyzer versions, and final verdicts are hashed using SHA-256 and appended to an unalterable audit ledger, creating a tamper-evident chain of custody.",
      badge: "Cryptographic Non-Repudiation",
    },
    {
      id: "prompt-injection",
      title: "Prompt Injection Defense & Boundary Sanitization",
      icon: ShieldAlert,
      tagline: "Strict isolation of untrusted external content (PR titles, briefs, user comments)",
      details:
        "All untrusted text from GitHub PRs, user prompts, or external datasets is passed through an isolation boundary before reaching the LLM. Copilot system directives cannot be overridden by malicious payloads embedded in source code comments or tickets.",
      badge: "Defensive AI Architecture",
    },
    {
      id: "zero-secrets",
      title: "Zero Client-Side Vendor Secrets",
      icon: Lock,
      tagline: "AI provider tokens and GitHub credentials reside exclusively in secure server environments",
      details:
        "The browser frontend never possesses API tokens for OpenAI, OpenRouter, GitHub, or Supabase service roles. All external calls are brokered through the backend AI Gateway 2.0 with rate limiting, semantic caching, and token quotas.",
      badge: "G7 Gateway Security Standard",
    },
    {
      id: "gates",
      title: "Deterministic Zero-Tolerance Release Gates",
      icon: ShieldCheck,
      tagline: "Strict mathematical rules that block releases regardless of human persuasion",
      details:
        "Release readiness is governed by uncompromising mathematical formulas: zero Critical/High CVEs, cyclomatic complexity < 15, and 100% Tier-1 test traceability. Authoritative policies cannot be overridden without multi-signature executive approval.",
      badge: "Authoritative Enforcement",
    },
    {
      id: "demo-live",
      title: "Clean Demo / Live Memory Separation",
      icon: Key,
      tagline: "Simulated sandbox runs in isolated in-memory stores with zero production state access",
      details:
        "Public showcase visitors and prospective evaluators operate inside a deterministic simulation sandbox. Demo runs produce zero mutations in live databases and cannot trigger billable AI token consumption.",
      badge: "Sandbox Isolation",
    },
  ];

  return (
    <section className="py-20 border-b border-border/60 bg-secondary/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="size-3.5" />
            <span>Zero-Trust Architecture • Defensive Governance</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Security, Governance & Provenance by Design
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Enterprise software intelligence requires rigorous defense in depth. PROJECT BRAHMA enforces tenant
            isolation at the database layer, guards AI contexts against adversarial prompt injection, and signs every
            release gate evaluation with immutable cryptographic hashes.
          </p>
        </div>

        {/* 6 PILLARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.id}
                className="border-border/70 bg-card/70 hover:border-emerald-500/40 transition-all duration-200"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-400">
                      {p.badge}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">{p.title}</h3>
                    <p className="text-xs text-primary font-medium">{p.tagline}</p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
                    {p.details}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* DEFENSIVE EXAMPLE: BANDIT CWE-89 SCAN (Requirement 766-777) */}
        <div className="p-6 rounded-2xl border border-border/70 bg-zinc-950/80 space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/40">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <ShieldAlert className="size-4" />
              <span>DEFENSIVE SCENARIO: Bandit AST Scanner Detects SQL Injection (CWE-89)</span>
            </div>
            <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px] self-start">
              Release Blocker Enforced
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-[10px] text-muted-foreground uppercase">Flawed Code (checkout.py:84)</div>
              <div className="p-3 rounded-lg bg-black/60 border border-rose-500/30 text-rose-300">
                <code>query = f"SELECT * FROM invoices WHERE id = &#39;{'{user_input}'}&#39;"</code>
              </div>
              <div className="text-[11px] text-muted-foreground">
                <strong>Vulnerability:</strong> Unsanitized f-string formatting in SQL construction allows query breakout.
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] text-muted-foreground uppercase">Copilot Remediation Patch</div>
              <div className="p-3 rounded-lg bg-black/60 border border-emerald-500/30 text-emerald-300">
                <code>query = "SELECT * FROM invoices WHERE id = %s", (user_input,)</code>
              </div>
              <div className="text-[11px] text-muted-foreground">
                <strong>Remediation:</strong> Parameterized query binding completely eliminates SQL injection vector.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
