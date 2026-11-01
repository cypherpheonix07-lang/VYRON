/**
 * VYRON / BRAHMA — POLICY-AS-CODE GOVERNANCE VIEW
 * Fine-grained attribute and role-based policy evaluation engine,
 * blast radius constraints, and execution fences.
 */

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Search,
  Filter,
  Users,
  Settings,
  Flame,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  PolicyAsCodeEngine,
  type PolicyRule,
  type ExecutionEnvironment,
  type PolicyDecision,
} from "@/services/intelligence/policyAsCodeEngine";
import type { UserAuthority } from "@/types/engineeringEntity";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ROLES: UserAuthority[] = [
  "CHIEF_ARCHITECT",
  "SECURITY_LEAD",
  "SRE_LEAD",
  "STAFF_ENGINEER",
  "DEVELOPER",
];

const ENVIRONMENTS: ExecutionEnvironment[] = ["DEMO", "STAGING", "PRODUCTION"];

const BLAST_RADII: ("LOCAL" | "SUBSYSTEM" | "SYSTEM_WIDE")[] = [
  "LOCAL",
  "SUBSYSTEM",
  "SYSTEM_WIDE",
];

export function PolicyAsCodeView() {
  const rules = useMemo(() => PolicyAsCodeEngine.getAllRules(), []);

  // Simulator state
  const [selectedRole, setSelectedRole] = useState<UserAuthority>("STAFF_ENGINEER");
  const [selectedAction, setSelectedAction] = useState<string>("SIMULATE_CHAOS");
  const [selectedEnv, setSelectedEnv] = useState<ExecutionEnvironment>("PRODUCTION");
  const [selectedBlast, setSelectedBlast] = useState<"LOCAL" | "SUBSYSTEM" | "SYSTEM_WIDE">("SYSTEM_WIDE");
  const [lastDecision, setLastDecision] = useState<PolicyDecision | null>(null);

  const handleEvaluate = () => {
    const decision = PolicyAsCodeEngine.evaluatePolicy(
      selectedRole,
      selectedAction,
      selectedEnv,
      selectedBlast
    );
    setLastDecision(decision);
    if (decision.allowed) {
      toast.success("Policy Evaluation: Action Permitted");
    } else {
      toast.error(`Policy Denied: ${decision.reason}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono tracking-wider uppercase">
              GOVERNANCE & POLICY-AS-CODE
            </Badge>
            <span className="text-xs text-muted-foreground">• Deterministic Authority Fences</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="size-6 text-primary" />
            Enterprise Policy Engine & Execution Boundaries
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl mt-1">
            Fine-grained role authorization, environment restrictions, and blast radius guards governing system mutations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
            {rules.length} Active Policies Enforced
          </Badge>
        </div>
      </div>

      {/* Simulator Card */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader className="p-4 border-b border-border/30">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Lock className="size-4 text-primary" />
            Policy-as-Code Evaluation Simulator
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Test policy decisions against real authority rules, environment constraints, and blast-radius thresholds.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                User Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserAuthority)}
                className="w-full bg-background/60 border border-border/60 rounded px-2.5 py-1.5 text-xs text-foreground"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                Action
              </label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full bg-background/60 border border-border/60 rounded px-2.5 py-1.5 text-xs text-foreground"
              >
                {rules.map((r) => (
                  <option key={r.id} value={r.action}>
                    {r.action}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                Target Environment
              </label>
              <select
                value={selectedEnv}
                onChange={(e) => setSelectedEnv(e.target.value as ExecutionEnvironment)}
                className="w-full bg-background/60 border border-border/60 rounded px-2.5 py-1.5 text-xs text-foreground"
              >
                {ENVIRONMENTS.map((env) => (
                  <option key={env} value={env}>
                    {env}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                Blast Radius
              </label>
              <select
                value={selectedBlast}
                onChange={(e) => setSelectedBlast(e.target.value as never)}
                className="w-full bg-background/60 border border-border/60 rounded px-2.5 py-1.5 text-xs text-foreground"
              >
                {BLAST_RADII.map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button size="sm" onClick={handleEvaluate} className="text-xs gap-1.5">
              <Play className="size-3.5" />
              Evaluate Policy Decision
            </Button>

            {lastDecision && (
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    "text-xs font-mono font-bold",
                    lastDecision.allowed
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  )}
                >
                  {lastDecision.allowed ? "PERMITTED" : "DENIED"}
                </Badge>
                <span className="text-xs text-muted-foreground">{lastDecision.reason}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rules Registry */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader className="p-4 border-b border-border/30">
          <CardTitle className="text-sm font-semibold text-foreground">
            Enforced Policy Rule Roster
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Immutable policy specifications defined as code under <code>policyAsCodeEngine.ts</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/[0.01]">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 text-primary border-primary/20">
                      {rule.id}
                    </Badge>
                    <span className="font-mono text-xs font-semibold text-foreground">{rule.action}</span>
                    {rule.requiresApproval && (
                      <Badge variant="outline" className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border-amber-500/30">
                        DUAL-SIGNOFF REQUIRED
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <span className="text-[11px] text-muted-foreground">Allowed Roles:</span>
                    {rule.allowedRoles.map((role) => (
                      <Badge key={role} variant="outline" className="text-[10px] font-mono bg-muted/30">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block">Max Blast Radius</span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {rule.maxBlastRadius}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block">Environments</span>
                    <span className="text-xs font-mono text-foreground">{rule.allowedEnvironments.join(", ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
