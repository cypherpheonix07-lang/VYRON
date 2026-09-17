/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 10: Security Engineering & STRIDE Threat Modeling Workspace
 * Strictly ZERO Raw SQL.
 */

import React from "react";
import { Shield, Lock, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage10SecurityWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting } = useAiProject();
  const sec = state.security;

  const handleSynthesize = () => {
    executeStage("10_SECURITY");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-rose-400" />
                Security Engineering & STRIDE Threat Modeling
              </CardTitle>
              <CardDescription>
                Audits trust boundaries, analyzes STRIDE threat vectors, evaluates prompt injection attack surfaces, and enforces multi-tenant RLS.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {sec.securityPostureScore > 0 && (
                <Badge variant="outline" className="border-rose-500/40 text-rose-400 font-mono text-xs">
                  Posture Score: {sec.securityPostureScore}%
                </Badge>
              )}
              <Button
                size="sm"
                onClick={handleSynthesize}
                disabled={isExecuting}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs gap-1.5 shadow-md shadow-rose-600/20"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                Run STRIDE Threat Model
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {sec.threats.length > 0 ? (
            <>
              {/* Trust Boundaries Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-border/70 bg-background/40 space-y-2 text-xs">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider">
                    Audited Trust Boundaries
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sec.trustBoundaries.map((tb, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tb}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border/70 bg-background/40 space-y-2 text-xs">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider">
                    AI Security & Anti-Injection Guardrails
                  </span>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">
                      {sec.promptInjectionDefense ? "L0 Priority System Barriers Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Model inputs sanitized; outputs validated against JSON schemas before committing state.
                  </p>
                </div>
              </div>

              {/* STRIDE Threats List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  STRIDE Threat Matrix & Mitigations
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {sec.threats.map((threat) => (
                    <div
                      key={threat.id}
                      className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-2.5 text-xs transition-colors hover:border-border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-rose-500/40 text-rose-400 font-mono text-[10px]">
                            {threat.category.toUpperCase()}
                          </Badge>
                          <span className="font-bold text-foreground">{threat.threat}</span>
                        </div>
                        <Badge
                          className={
                            threat.residualRisk === "LOW"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]"
                          }
                        >
                          RESIDUAL RISK: {threat.residualRisk}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                        <div>Target Asset: <span className="text-foreground font-mono">{threat.targetAsset}</span></div>
                        <div>Entry Point: <span className="text-foreground font-mono">{threat.entryPoint}</span></div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-background/50 border border-border/50 text-[11px] space-y-1">
                        <span className="font-semibold text-emerald-400">Enforced Mitigation:</span>
                        <p className="text-muted-foreground">{threat.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Shield className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Threat model has not been synthesized. Click below to execute STRIDE security analysis.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Run Threat Modeling
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
