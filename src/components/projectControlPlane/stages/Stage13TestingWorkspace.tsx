/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 13: Test Engineering & Traceability Matrix Workspace
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import { CheckSquare, Plus, Sparkles, CheckCircle2, AlertTriangle, Shield, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";
import { TestCaseItem } from "@/types/aiProjectControlPlane";

export const Stage13TestingWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting, addManualTestCase } = useAiProject();
  const testModel = state.testing;

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TestCaseItem["type"]>("integration");
  const [reqCode, setReqCode] = useState("FR-001");
  const [taskCode, setTaskCode] = useState("TSK-001");
  const [assertion, setAssertion] = useState("");

  const handleSynthesize = () => {
    executeStage("13_TESTING");
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assertion.trim()) return;

    addManualTestCase({
      title: title.trim(),
      type,
      targetRequirementCode: reqCode.trim(),
      targetTaskCode: taskCode.trim(),
      assertion: assertion.trim(),
    });

    setTitle("");
    setAssertion("");
    setShowAddForm(false);
  };

  const getTypeBadge = (t: TestCaseItem["type"]) => {
    switch (t) {
      case "e2e":
        return "border-purple-500/40 text-purple-300 bg-purple-500/10";
      case "security":
        return "border-rose-500/40 text-rose-300 bg-rose-500/10";
      case "api":
        return "border-blue-500/40 text-blue-300 bg-blue-500/10";
      case "ai_eval":
        return "border-cyan-500/40 text-cyan-300 bg-cyan-500/10";
      default:
        return "border-emerald-500/40 text-emerald-300 bg-emerald-500/10";
    }
  };

  const coveredCount = testModel.traceabilityMatrix.filter((m) => m.isCovered).length;
  const totalReqCount = Math.max(1, testModel.traceabilityMatrix.length);
  const coveragePercent = Math.round((coveredCount / totalReqCount) * 100);

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-teal-400" />
                Test Strategy & Requirement Traceability Matrix
              </CardTitle>
              <CardDescription>
                Guarantees 100% test coverage across functional, non-functional, and security specifications with verified assertion contracts.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {testModel.traceabilityMatrix.length > 0 && (
                <Badge variant="outline" className="border-teal-500/40 text-teal-300 font-mono text-xs">
                  Coverage: {coveragePercent}% ({coveredCount}/{totalReqCount})
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs h-8 border-border/70 text-muted-foreground hover:text-foreground gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Test Case
              </Button>
              <Button
                size="sm"
                onClick={handleSynthesize}
                disabled={isExecuting}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs h-8 gap-1.5 shadow-md shadow-teal-600/20"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                Synthesize Traceability
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Manual Test Case Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateTest}
              className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/10 space-y-3"
            >
              <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Create Test Case Contract
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Test Title (e.g. Verify RLS isolation between org tenants)"
                  className="bg-background/60 border-border/80 text-xs h-8 sm:col-span-2"
                  required
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TestCaseItem["type"])}
                  className="bg-background/60 border border-border/80 rounded-md px-2 text-xs h-8 text-foreground"
                >
                  <option value="unit">Unit Test</option>
                  <option value="integration">Integration Test</option>
                  <option value="api">API Contract Test</option>
                  <option value="e2e">E2E Flow Test</option>
                  <option value="security">Security Test</option>
                  <option value="ai_eval">AI Evaluation Benchmark</option>
                </select>
                <Input
                  value={reqCode}
                  onChange={(e) => setReqCode(e.target.value)}
                  placeholder="Target Req (e.g. FR-001)"
                  className="bg-background/60 border-border/80 text-xs h-8 font-mono"
                />
              </div>
              <Textarea
                value={assertion}
                onChange={(e) => setAssertion(e.target.value)}
                placeholder="Explicit test assertion criteria (e.g. Cross-tenant GET returns HTTP 403 Forbidden with empty result set)..."
                className="bg-background/60 border-border/80 text-xs resize-none h-14"
                required
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs h-7"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-500 text-white text-xs h-7">
                  Save Test Case
                </Button>
              </div>
            </form>
          )}

          {/* Traceability Matrix Banner */}
          {testModel.traceabilityMatrix.length > 0 && (
            <div className="p-3.5 rounded-xl border border-border/70 bg-background/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Requirement Traceability Matrix
                </span>
                <span className="text-[10px] text-teal-400 font-mono font-semibold">
                  100% Test Coverage Target
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {testModel.traceabilityMatrix.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg border border-border/50 bg-card/60 flex items-center justify-between"
                  >
                    <span className="font-mono font-bold text-foreground">{item.requirementCode}</span>
                    {item.isCovered ? (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[9px] gap-1 font-mono">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        COVERED
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[9px] gap-1 font-mono">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        UNTESTED
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Cases List */}
          {testModel.testCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testModel.testCases.map((tc) => (
                <div
                  key={tc.id}
                  className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-3 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-foreground">{tc.code}</span>
                        <Badge variant="outline" className={`text-[10px] uppercase font-mono ${getTypeBadge(tc.type)}`}>
                          {tc.type}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-semibold text-foreground mt-1">{tc.title}</h4>
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px] shrink-0">
                      {tc.targetRequirementCode}
                    </Badge>
                  </div>

                  {/* Assertion Criteria */}
                  <div className="p-2.5 rounded-lg bg-background/50 border border-border/50 text-[11px] space-y-1">
                    <span className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
                      Assertion Contract:
                    </span>
                    <p className="text-muted-foreground font-mono leading-relaxed">{tc.assertion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <CheckSquare className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-xs text-muted-foreground">
                No test cases synthesized yet. Synthesize test suites to generate 100% requirement-to-test traceability.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Synthesize Traceability
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
