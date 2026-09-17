/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 03: Requirements Engineering & Quality Scoring Workspace
 * Strictly ZERO Raw SQL.
 */

import React from "react";
import { CheckSquare, AlertTriangle, Sparkles, Shield, Cpu, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage03RequirementsWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting } = useAiProject();
  const requirements = state.requirements;

  const handleSynthesize = () => {
    executeStage("03_REQUIREMENTS");
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "functional":
        return "border-blue-500/40 text-blue-400 bg-blue-500/10";
      case "non_functional":
        return "border-amber-500/40 text-amber-400 bg-amber-500/10";
      case "security":
        return "border-rose-500/40 text-rose-400 bg-rose-500/10";
      case "compliance":
        return "border-purple-500/40 text-purple-400 bg-purple-500/10";
      default:
        return "border-cyan-500/40 text-cyan-400 bg-cyan-500/10";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-emerald-400" />
                Atomic Requirements Engineering
              </CardTitle>
              <CardDescription>
                Normalized atomic specifications scored across clarity, completeness, testability, and atomicity. Continuous contradiction detection.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handleSynthesize}
              disabled={isExecuting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
              Run Requirements Normalizer
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {requirements.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-3 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">{req.code}</span>
                        <Badge variant="outline" className={`text-[10px] ${getBadgeColor(req.type)}`}>
                          {req.type.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {req.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">• Source: {req.source}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">{req.title}</h4>
                      <p className="text-xs text-muted-foreground">{req.description}</p>
                    </div>

                    {/* Quality Score Pill */}
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {req.qualityScore.scoreTotal}% Quality
                      </div>
                      <div className="text-[10px] text-muted-foreground flex gap-1 mt-0.5 font-mono">
                        <span>C:{req.qualityScore.clarity}</span>
                        <span>T:{req.qualityScore.testability}</span>
                        <span>A:{req.qualityScore.atomicity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acceptance Criteria */}
                  <div className="p-3 rounded-lg bg-background/40 border border-border/50 text-xs space-y-1.5">
                    <div className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                      Acceptance Criteria (Testable Contract)
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                      {req.acceptanceCriteria.map((ac, idx) => (
                        <li key={idx}>{ac}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Conflicts Banner if present */}
                  {req.conflictsWith.length > 0 && (
                    <div className="p-2.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                      <span>Conflicts with requirement(s): {req.conflictsWith.join(", ")}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <CheckSquare className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                No requirements extracted yet. Click below to normalize your project intent into atomic specifications.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Extract Requirements
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
