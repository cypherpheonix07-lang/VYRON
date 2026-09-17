/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Generic Stage Workspace for Stages 05, 07, 08, 09, 11, 13
 * Strictly ZERO Raw SQL.
 */

import React from "react";
import { Sparkles, Layers, Cpu, Database, Brain, Activity, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";
import { ProjectLifecycleStage } from "@/types/aiProjectControlPlane";

interface GenericStageWorkspaceProps {
  stage: ProjectLifecycleStage;
}

export const GenericStageWorkspace: React.FC<GenericStageWorkspaceProps> = ({ stage }) => {
  const { state, executeStage, isExecuting } = useAiProject();

  const handleSynthesize = () => {
    executeStage(stage);
  };

  const getStageMeta = () => {
    switch (stage) {
      case "05_CAPABILITY":
        return {
          title: "Capability Modeling",
          icon: Layers,
          color: "text-amber-400",
          desc: "Hierarchical business and system capability taxonomy separated from technology implementation.",
          items: state.capabilities.capabilities.map((c) => ({
            title: c.name,
            subtitle: c.category,
            details: c.description,
          })),
        };
      case "07_TECHNOLOGY":
        return {
          title: "Technology Stack Engineering",
          icon: Cpu,
          color: "text-blue-400",
          desc: "Primary and alternative stacks with trade-offs, operational burden, and migration implications.",
          items: state.technology.decisions.map((d) => ({
            title: `${d.category.toUpperCase()}: ${d.selectedOption}`,
            subtitle: `Alternative: ${d.alternativeOption}`,
            details: d.rationale,
          })),
        };
      case "08_DATA":
        return {
          title: "Data Architecture & Governance",
          icon: Database,
          color: "text-emerald-400",
          desc: "Domain entities, relationships, sensitivity classifications, retention windows, and multi-tenant RLS.",
          items: state.data.entities.map((e) => ({
            title: e.name,
            subtitle: `Sensitivity: ${e.sensitivity.toUpperCase()} • Retention: ${e.retentionPeriod}`,
            details: e.description,
          })),
        };
      case "09_AI_DESIGN":
        return {
          title: "AI/ML Systems Engineering",
          icon: Brain,
          color: "text-purple-400",
          desc: "Conditional AI architecture: candidate models, inference pipeline, prompt injection defense, and fallback strategies.",
          items: state.ai.modelCandidates.map((m) => ({
            title: m.name,
            subtitle: `${m.provider.toUpperCase()} • ${m.costPer1kTokens * 1000}$ / 1M tokens`,
            details: m.purpose,
          })),
        };
      case "11_RELIABILITY":
        return {
          title: "Reliability Engineering & Failure Scenarios",
          icon: Activity,
          color: "text-orange-400",
          desc: "Component failure modes, timeout policies, circuit breaker thresholds, and deterministic fallback engines.",
          items: state.reliability.scenarios.map((s) => ({
            title: s.componentName,
            subtitle: `Timeout: ${s.timeoutMs}ms • Retries: ${s.retryCount}`,
            details: `Failure: ${s.failureScenario} -> Fallback: ${s.fallbackStrategy}`,
          })),
        };
      case "13_TESTING":
        return {
          title: "Test Automation & Traceability Matrix",
          icon: CheckSquare,
          color: "text-teal-400",
          desc: "Multi-tier test strategy and requirement-to-test traceability matrix ensuring zero unverified specifications.",
          items: state.testing.testCases.map((tc) => ({
            title: `${tc.code}: ${tc.title}`,
            subtitle: `Type: ${tc.type.toUpperCase()} • Target: ${tc.targetRequirementCode}`,
            details: tc.assertion,
          })),
        };
      default:
        return {
          title: stage,
          icon: Sparkles,
          color: "text-cyan-400",
          desc: "Specialized engineering stage.",
          items: [],
        };
    }
  };

  const meta = getStageMeta();
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Icon className={`h-5 w-5 ${meta.color}`} />
                {meta.title}
              </CardTitle>
              <CardDescription>{meta.desc}</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handleSynthesize}
              disabled={isExecuting}
              className="text-xs gap-1.5 shadow-md"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
              Run Specialist Agent
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {meta.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {meta.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border/70 bg-background/40 space-y-1.5 text-xs transition-colors hover:border-border"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm">{item.title}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {item.subtitle}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{item.details}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Icon className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Stage specifications have not been synthesized yet. Click below to execute the specialized agent.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Synthesize {meta.title}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
