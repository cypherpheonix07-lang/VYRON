/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 02: Problem Engineering & 5-Whys Root Cause Workspace
 * Strictly ZERO Raw SQL.
 */

import React from "react";
import { AlertCircle, GitCommit, CheckCircle2, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage02ProblemWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting } = useAiProject();
  const problem = state.problem;

  const handleSynthesize = () => {
    executeStage("02_PROBLEM");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-400" />
                Problem Engineering & 5-Whys Root Cause
              </CardTitle>
              <CardDescription>
                Distinguishes between Problem, Root Cause, Solution, and Feature. Prevents defining the problem as a mere technology.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handleSynthesize}
              disabled={isExecuting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
              Run 5-Whys Root Cause Engine
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {problem.problemStatement ? (
            <>
              {/* Problem Statement Banner */}
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4 text-indigo-400" />
                  Validated Problem Statement
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {problem.problemStatement}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Root Problem:</span>
                  <Badge variant="outline" className="border-indigo-500/40 text-indigo-300 text-xs">
                    {problem.rootProblem}
                  </Badge>
                </div>
              </div>

              {/* 5-Whys Root Cause Decomposition Tree */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-cyan-400" />
                  5-Whys Causal Decomposition Chain
                </h4>
                <div className="space-y-2.5">
                  {problem.rootCauseTree.map((why) => (
                    <div
                      key={why.level}
                      className="p-3 rounded-lg border border-border/70 bg-background/40 flex items-start gap-3"
                    >
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs shrink-0 mt-0.5">
                        Why #{why.level}
                      </Badge>
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold text-foreground">{why.question}</p>
                        <p className="text-muted-foreground">{why.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Criteria */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Measurable Success Criteria
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {problem.successCriteria.map((crit, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-border/70 bg-card/40 flex items-start gap-2.5 text-xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Target className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Problem model has not been synthesized yet. Click below to execute 5-Whys Root Cause Analysis.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Synthesize Problem Model
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
