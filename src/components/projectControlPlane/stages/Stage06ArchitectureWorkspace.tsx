/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 06: System Architecture & Alternatives Workspace
 * Strictly ZERO Raw SQL.
 */

import React from "react";
import { Server, CheckCircle2, Sparkles, Network, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage06ArchitectureWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting } = useAiProject();
  const arch = state.architecture;

  const handleSynthesize = () => {
    executeStage("06_ARCHITECTURE");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Server className="h-5 w-5 text-cyan-400" />
                System Architecture Alternatives & Trade-Offs
              </CardTitle>
              <CardDescription>
                Generates 3 viable architecture topologies. Compares complexity, operational cost, scalability cliffs, and time-to-MVP.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handleSynthesize}
              disabled={isExecuting}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs gap-1.5 shadow-md shadow-cyan-600/20"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
              Generate Architecture Alternatives
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {arch.alternatives.length > 0 ? (
            <>
              {/* 3 Architecture Alternatives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {arch.alternatives.map((alt) => {
                  const isSelected = alt.id === arch.selectedAlternativeId;
                  return (
                    <div
                      key={alt.id}
                      className={`p-4 rounded-xl border transition-all space-y-3 flex flex-col justify-between ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                          : "border-border/70 bg-card/40 hover:border-border"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="font-mono text-[10px] uppercase">
                            {alt.type.replace("_", " ")}
                          </Badge>
                          {isSelected && (
                            <Badge className="bg-cyan-500 text-black font-semibold text-[10px]">
                              PROPOSED BASELINE
                            </Badge>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-foreground">{alt.name}</h4>
                        <p className="text-xs text-muted-foreground">{alt.description}</p>

                        {/* Trade-Off Matrix */}
                        <div className="p-2.5 rounded-lg bg-background/50 border border-border/50 text-[11px] space-y-1.5 font-mono">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Complexity:</span>
                            <span className="font-bold">{alt.tradeOffs.complexityScore}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. Cost:</span>
                            <span className="font-bold">{alt.tradeOffs.estimatedCostScore}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Scalability:</span>
                            <span className="font-bold">{alt.tradeOffs.scalabilityScore}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time to MVP:</span>
                            <span className="font-bold text-cyan-400">{alt.tradeOffs.timeToMvpWeeks} weeks</span>
                          </div>
                        </div>

                        {/* Pros & Cons */}
                        <div className="space-y-1 text-[11px]">
                          <div className="text-emerald-400 font-semibold">Pros:</div>
                          <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                            {alt.pros.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full text-xs mt-2 ${
                          isSelected ? "bg-cyan-500 hover:bg-cyan-400 text-black font-semibold" : ""
                        }`}
                      >
                        {isSelected ? "Active Baseline" : "Select Alternative"}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Component Layer Topology Breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Network className="h-4 w-4 text-cyan-400" />
                  Baseline Component Layers & Service Contracts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {arch.alternatives[0]?.components.map((comp) => (
                    <div key={comp.id} className="p-3 rounded-xl border border-border/70 bg-background/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{comp.name}</span>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                          {comp.layer}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{comp.description}</p>
                      <div className="text-[11px] text-muted-foreground">
                        APIs: <span className="font-mono text-cyan-400">{comp.apis.join(", ")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Server className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                No architectures generated yet. Click below to synthesize 3 competing architecture alternatives.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Generate Architecture Alternatives
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
