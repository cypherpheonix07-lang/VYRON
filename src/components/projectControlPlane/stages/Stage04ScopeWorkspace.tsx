/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 04: Scope Engineering & Creep Detection Workspace
 * Strictly ZERO Raw SQL.
 */

import React from "react";
import { Layers, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage04ScopeWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting } = useAiProject();
  const scope = state.scope;

  const handleSynthesize = () => {
    executeStage("04_SCOPE");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5 text-amber-400" />
                Scope Engineering & Creep Detection
              </CardTitle>
              <CardDescription>
                Partitions requirements into MVP, V1, V2, and Out-of-Scope. Actively detects scope creep divergence from core intent.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {scope.scopeStabilityScore > 0 && (
                <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-mono text-xs">
                  Stability: {scope.scopeStabilityScore}%
                </Badge>
              )}
              <Button
                size="sm"
                onClick={handleSynthesize}
                disabled={isExecuting}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs gap-1.5 shadow-md shadow-amber-600/20"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                Partition Scope & Detect Creep
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Scope Drift Alerts */}
          {scope.driftWarnings.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                Scope Creep Warnings Detected
              </h4>
              {scope.driftWarnings.map((warning) => (
                <div
                  key={warning.id}
                  className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-300">{warning.rule}: {warning.divergentFeature}</span>
                    <Badge variant="destructive" className="text-[10px]">
                      {warning.impactSeverity} SEVERITY
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Original objective: <span className="text-foreground">{warning.originalObjective}</span>
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-muted-foreground">Suggested Resolution:</span>
                    <Badge variant="outline" className="border-border text-foreground uppercase text-[10px]">
                      {warning.suggestedAction.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scope Partitions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* MVP */}
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">MVP Core</h4>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                  {scope.mvpRequirements.length} REQS
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Essential for launch. Cannot be removed.</p>
              <div className="space-y-1.5">
                {scope.mvpRequirements.map((reqId) => {
                  const req = state.requirements.find((r) => r.id === reqId);
                  return (
                    <div key={reqId} className="p-2 rounded bg-background/50 border border-border/50 text-xs font-medium">
                      {req ? `${req.code}: ${req.title}` : reqId}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Version 1 */}
            <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Version 1.0</h4>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-[10px]">
                  {scope.v1Requirements.length} REQS
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Required for complete commercial release.</p>
              <div className="space-y-1.5">
                {scope.v1Requirements.map((reqId) => {
                  const req = state.requirements.find((r) => r.id === reqId);
                  return (
                    <div key={reqId} className="p-2 rounded bg-background/50 border border-border/50 text-xs font-medium">
                      {req ? `${req.code}: ${req.title}` : reqId}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Version 2 */}
            <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Version 2.0</h4>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px]">
                  {scope.v2Requirements.length} REQS
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Deferred roadmap items.</p>
              <div className="space-y-1.5">
                {scope.v2Requirements.map((reqId) => (
                  <div key={reqId} className="p-2 rounded bg-background/50 border border-border/50 text-xs font-medium text-muted-foreground">
                    {reqId}
                  </div>
                ))}
              </div>
            </div>

            {/* Out of Scope */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Out of Scope</h4>
                <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px]">
                  {scope.outOfScope.length} ITEMS
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Explicitly rejected to prevent distraction.</p>
              <div className="space-y-1.5">
                {scope.outOfScope.map((item, idx) => (
                  <div key={idx} className="p-2 rounded bg-background/50 border border-border/50 text-xs text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
