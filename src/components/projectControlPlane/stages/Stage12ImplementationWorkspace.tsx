/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 12: Implementation Architecture & Task DAG Workspace
 * Strictly ZERO Raw SQL.
 */

import React from "react";
import { Terminal, Network, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage12ImplementationWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting } = useAiProject();
  const impl = state.implementation;

  const handleSynthesize = () => {
    executeStage("12_IMPLEMENTATION");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Terminal className="h-5 w-5 text-purple-400" />
                Implementation Architecture & Task DAG
              </CardTitle>
              <CardDescription>
                Translates architecture into API contracts, database entities, and a dependency-ordered Directed Acyclic Graph (DAG) of implementation tasks.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handleSynthesize}
              disabled={isExecuting}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5 shadow-md shadow-purple-600/20"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
              Generate Task Graph & API Contracts
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {impl.tasks.length > 0 ? (
            <>
              {/* API Contracts */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Network className="h-4 w-4 text-purple-400" />
                  API Service Contracts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {impl.apiContracts.map((api) => (
                    <div key={api.id} className="p-3.5 rounded-xl border border-border/70 bg-background/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] font-mono">
                            {api.method}
                          </Badge>
                          <span className="font-mono font-bold text-foreground">{api.endpoint}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          Auth: {api.authRequired ? "Required" : "Public"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{api.description}</p>
                      <div className="text-[11px] text-muted-foreground">
                        Satisfies: <span className="font-mono text-purple-400">{api.satisfiesRequirementCode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementation Task DAG */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  Dependency-Aware Task Graph
                </h4>
                <div className="space-y-3">
                  {impl.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-2.5 text-xs transition-colors hover:border-border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground">{task.code}</span>
                          <span className="font-semibold text-foreground text-sm">{task.title}</span>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {task.area}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          Status: {task.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground">
                        <div>Requirement: <span className="text-foreground font-mono">{task.requirementCode}</span></div>
                        <div>
                          Depends On:{" "}
                          <span className="text-foreground font-mono">
                            {task.dependsOn.length > 0 ? task.dependsOn.join(", ") : "None (Root)"}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-background/50 border border-border/50 text-[11px] space-y-1">
                        <span className="font-semibold text-muted-foreground">Acceptance Verification Criteria:</span>
                        <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                          {task.acceptanceCriteria.map((ac, idx) => (
                            <li key={idx}>{ac}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Terminal className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Task DAG has not been planned yet. Click below to synthesize dependency-ordered implementation tasks.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Generate Implementation Tasks
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
