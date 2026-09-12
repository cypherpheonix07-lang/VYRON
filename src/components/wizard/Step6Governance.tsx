/**
 * PROJECT BRAHMA — STEP 6: GOVERNANCE, RELEASE GATES & COMPLIANCE
 * Contract: { gate_strictness: enum('advisory','standard','strict'),
 *   compliance_pack: enum('none','soc2','hipaa','fda','do178c'),
 *   allow_override: boolean, retention: enum('90d','1y','7y') }
 */

import React, { useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  FileCheck,
  Clock,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import type {
  WizardPayload,
  GateStrictness,
  CompliancePack,
  RetentionPeriod,
} from "@/types/wizard";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Step6Props {
  payload: WizardPayload;
  onChange: (patch: Partial<WizardPayload>) => void;
  errors: Record<string, string>;
}

const STRICTNESS_OPTIONS: Array<{
  id: GateStrictness;
  title: string;
  badge: string;
  copy: string;
  consequence: string;
  icon: React.ComponentType<{ className?: string }>;
  borderActive: string;
}> = [
  {
    id: "advisory",
    title: "Advisory Mode",
    badge: "Non-Blocking",
    copy: "Evaluates AST cyclomatic complexity, CVE vulnerabilities, and test coverage. Emits audit warnings without halting deployment.",
    consequence:
      "Safe for rapid prototyping. Quality gates log telemetry but do not fail build pipelines.",
    icon: ShieldCheck,
    borderActive: "border-amber-500/60 bg-amber-500/10 ring-amber-500/30",
  },
  {
    id: "standard",
    title: "Standard Enterprise Gate",
    badge: "Production Default",
    copy: "Blocks deployment on Critical CVEs (CVSS >= 9.0) or AST cyclomatic hotspots (CCN > 15). Permits authenticated platform admins to apply manual overrides.",
    consequence:
      "Balanced security posture. Enforces release gates while maintaining developer escape hatches.",
    icon: ShieldAlert,
    borderActive: "border-primary/60 bg-primary/10 ring-primary/30",
  },
  {
    id: "strict",
    title: "Strict Deterministic Gate",
    badge: "Zero Override",
    copy: "Zero-tolerance architectural governance. Blocks deployment on ANY high/critical CVE, CCN > 10, or schema mismatch. Manual overrides permanently disabled.",
    consequence:
      "Mission-critical standard. Absolute cryptographic verification required before production deployment.",
    icon: ShieldX,
    borderActive: "border-rose-500/60 bg-rose-500/10 ring-rose-500/30",
  },
];

const COMPLIANCE_PACKS: Array<{
  id: CompliancePack;
  label: string;
  desc: string;
  domainMatch?: string[];
}> = [
  {
    id: "none",
    label: "None / Standard Internal",
    desc: "No external regulatory standard applied. Internal team benchmarks only.",
  },
  {
    id: "soc2",
    label: "SOC 2 Type II",
    desc: "Trust services criteria: Security, Availability, and Confidentiality.",
    domainMatch: ["fintech", "web", "api"],
  },
  {
    id: "hipaa",
    label: "HIPAA Security Rule",
    desc: "ePHI encryption, audit trails, and strict patient record access control.",
    domainMatch: ["healthcare"],
  },
  {
    id: "fda",
    label: "FDA 21 CFR Part 11",
    desc: "Electronic signatures, system validation, and medical device software governance.",
    domainMatch: ["healthcare", "iot"],
  },
  {
    id: "do178c",
    label: "DO-178C (Aviation/Mission Critical)",
    desc: "Formal methods, full AST traceability, and structural coverage analysis.",
    domainMatch: ["robotics", "iot"],
  },
];

const RETENTION_OPTIONS: Array<{ id: RetentionPeriod; label: string; desc: string }> = [
  { id: "90d", label: "90 Days", desc: "Standard telemetry rolling window." },
  { id: "1y", label: "1 Year", desc: "Annual regulatory audit cycle." },
  { id: "7y", label: "7 Years", desc: "Permanent statutory & financial compliance archival." },
];

export const Step6Governance: React.FC<Step6Props> = ({ payload, onChange, errors }) => {
  // If strictness is strict, enforce allow_override = false
  useEffect(() => {
    if (payload.gate_strictness === "strict" && payload.allow_override) {
      onChange({ allow_override: false });
    }
  }, [payload.gate_strictness, payload.allow_override, onChange]);

  const domainRecommendation = React.useMemo(() => {
    const d = payload.domain;
    if (d === "healthcare")
      return {
        pack: "hipaa",
        text: "Healthcare domain detected — HIPAA Compliance Pack recommended.",
      };
    if (d === "fintech")
      return {
        pack: "soc2",
        text: "FinTech domain detected — SOC 2 Type II Compliance Pack recommended.",
      };
    if (d === "robotics" || d === "iot")
      return {
        pack: "do178c",
        text: "Hardware / Embedded domain detected — DO-178C high-integrity pack recommended.",
      };
    return null;
  }, [payload.domain]);

  return (
    <div className="space-y-8">
      {/* 1. Gate Strictness Selector Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Release Gate Strictness Model <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            Governs 7-check automated deployment quality barrier
          </span>
        </div>

        {errors["gate_strictness"] && (
          <p className="text-xs text-destructive font-medium" role="alert">
            {errors["gate_strictness"]}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STRICTNESS_OPTIONS.map(
            ({ id, title, badge, copy, consequence, icon: IconComp, borderActive }) => {
              const isSelected = payload.gate_strictness === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange({ gate_strictness: id })}
                  aria-pressed={isSelected}
                  className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? `${borderActive} ring-2 shadow-sm`
                      : "border-border/70 bg-card/40 hover:border-border hover:bg-card/70"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComp className="h-4 w-4" />
                        <span className="font-semibold text-xs text-foreground">{title}</span>
                      </div>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground">
                      {badge}
                    </span>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{copy}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-border/40 text-[11px] font-medium text-foreground/80">
                    <span className="text-muted-foreground">Impact: </span>
                    {consequence}
                  </div>
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* 2. Compliance Pack Picker with Domain Hints */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Compliance & Regulatory Pack</Label>
          {domainRecommendation && (
            <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              {domainRecommendation.text}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {COMPLIANCE_PACKS.map(({ id, label, desc }) => {
            const isSelected = payload.compliance_pack === id;
            const isRecommended = domainRecommendation?.pack === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange({ compliance_pack: id })}
                aria-pressed={isSelected}
                className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                    : isRecommended
                      ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                      : "border-border/60 bg-card/40 hover:border-border"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">{label}</span>
                    {isRecommended && (
                      <span className="rounded bg-primary/20 text-primary px-1.5 py-0.2 text-[9px] font-mono font-semibold uppercase">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Override Toggle (Disabled when strictness='strict') */}
      <div
        className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
          payload.gate_strictness === "strict"
            ? "border-border/40 bg-muted/20 opacity-70"
            : "border-border/70 bg-card/40"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-secondary-foreground">
            {payload.gate_strictness === "strict" ? (
              <Lock className="h-5 w-5 text-rose-400" />
            ) : (
              <FileCheck className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="override-switch" className="text-sm font-semibold cursor-pointer">
                Allow Manual Gate Override
              </Label>
              {payload.gate_strictness === "strict" && (
                <span className="inline-flex items-center gap-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 text-[9px] font-mono uppercase">
                  <Lock className="h-2.5 w-2.5" /> Locked by Strict Mode
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {payload.gate_strictness === "strict"
                ? "Security Law: Manual overrides are permanently disabled in Strict Deterministic Mode."
                : "Allows platform administrators to bypass non-critical advisory and standard quality gate warnings with signed justification."}
            </p>
          </div>
        </div>

        <Switch
          id="override-switch"
          checked={payload.allow_override && payload.gate_strictness !== "strict"}
          disabled={payload.gate_strictness === "strict"}
          onCheckedChange={(val) => onChange({ allow_override: val })}
        />
      </div>

      {/* 4. Audit Log Retention Period */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Immutable WORM Audit Retention Period</Label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RETENTION_OPTIONS.map(({ id, label, desc }) => {
            const isSelected = payload.retention === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange({ retention: id })}
                aria-pressed={isSelected}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary/40 font-semibold"
                    : "border-border/60 bg-card/40 hover:border-border"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-mono text-foreground font-bold">{label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground font-normal">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
