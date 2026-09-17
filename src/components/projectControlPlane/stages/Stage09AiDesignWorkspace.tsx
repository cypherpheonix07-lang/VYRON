/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 09: AI/ML Systems Engineering Workspace (Conditional)
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import { Brain, Plus, Sparkles, ShieldCheck, Cpu, DollarSign, ToggleLeft, ToggleRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage09AiDesignWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting, setAiEngineeringActive, addManualAiModelCandidate } = useAiProject();
  const ai = state.ai;

  const [showAddForm, setShowAddForm] = useState(false);
  const [modelName, setModelName] = useState("");
  const [provider, setProvider] = useState("OpenRouter");
  const [purpose, setPurpose] = useState("");
  const [cost, setCost] = useState("0.003");
  const [latency, setLatency] = useState("450");

  const handleSynthesize = () => {
    executeStage("09_AI_DESIGN");
  };

  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim()) return;

    addManualAiModelCandidate({
      name: modelName.trim(),
      provider,
      purpose: purpose.trim() || "General task execution",
      costPer1kTokens: parseFloat(cost) || 0.003,
      expectedLatencyMs: parseInt(latency, 10) || 450,
      knownLimitations: ["Rate limits apply"],
      selected: true,
    });

    setModelName("");
    setPurpose("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI/ML Systems Engineering (Conditional)
                </CardTitle>
                <button
                  type="button"
                  onClick={() => setAiEngineeringActive(!ai.isActive)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
                  title="Toggle AI/ML requirement for this project"
                >
                  {ai.isActive ? (
                    <Badge className="bg-purple-600 text-white text-[10px] gap-1 cursor-pointer">
                      <ToggleRight className="h-3.5 w-3.5" />
                      AI ENABLED
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-[10px] gap-1 cursor-pointer">
                      <ToggleLeft className="h-3.5 w-3.5" />
                      DISABLED (NON-AI PROJECT)
                    </Badge>
                  )}
                </button>
              </div>
              <CardDescription>
                Architects model selection, inference pipelines, token budgets, prompt injection defenses, and dual-provider fallback strategies.
              </CardDescription>
            </div>
            {ai.isActive && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-xs h-8 border-border/70 text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Model
                </Button>
                <Button
                  size="sm"
                  onClick={handleSynthesize}
                  disabled={isExecuting}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-8 gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                  Synthesize AI Topology
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {!ai.isActive ? (
            <div className="p-6 rounded-xl border border-border/50 bg-background/30 text-center space-y-2">
              <Brain className="h-8 w-8 text-muted-foreground/30 mx-auto" />
              <h4 className="text-sm font-semibold text-foreground">AI Subsystem Disabled for this Project</h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                This project has been configured as a deterministic, non-AI platform. No model candidate selection, vector embeddings, or token spend quotas are required.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAiEngineeringActive(true)}
                className="text-xs mt-2"
              >
                Enable AI Subsystem
              </Button>
            </div>
          ) : (
            <>
              {/* Manual Model Registration Form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddModel}
                  className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-3"
                >
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Register Candidate AI Model
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <Input
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      placeholder="Model Name (e.g. claude-3-5-sonnet)"
                      className="bg-background/60 border-border/80 text-xs h-8 sm:col-span-2"
                      required
                    />
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="bg-background/60 border border-border/80 rounded-md px-2 text-xs h-8 text-foreground"
                    >
                      <option value="OpenRouter">OpenRouter Hub</option>
                      <option value="OpenAI">OpenAI Direct</option>
                      <option value="Local">Self-Hosted / vLLM</option>
                    </select>
                    <Input
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="Cost / 1k tokens ($)"
                      className="bg-background/60 border-border/80 text-xs h-8"
                    />
                  </div>
                  <Input
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Intended purpose (e.g. Complex Code Analysis, Reasoning, Structured Extraction)"
                    className="bg-background/60 border-border/80 text-xs h-8"
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
                    <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-7">
                      Register Candidate
                    </Button>
                  </div>
                </form>
              )}

              {/* Inference Pipeline Topology */}
              <div className="p-4 rounded-xl border border-border/70 bg-background/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-400" />
                    Inference Pipeline Architecture
                  </h4>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40 font-mono">
                    Prompt Injection Defense: Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-card/60 border border-border/50 space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono">01. INTAKE</span>
                    <p className="font-semibold text-foreground text-xs">Boundary Sanitization</p>
                    <p className="text-[10px] text-muted-foreground">Strip prompt injection markers</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card/60 border border-border/50 space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono">02. ROUTING</span>
                    <p className="font-semibold text-foreground text-xs">Task-Aware Dispatch</p>
                    <p className="text-[10px] text-muted-foreground">OpenRouter / OpenAI failover</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card/60 border border-border/50 space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono">03. VALIDATION</span>
                    <p className="font-semibold text-foreground text-xs">JSON Schema Guard</p>
                    <p className="text-[10px] text-muted-foreground">Semantic contract enforcement</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card/60 border border-border/50 space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono">04. FALLBACK</span>
                    <p className="font-semibold text-foreground text-xs">Offline Deterministic</p>
                    <p className="text-[10px] text-muted-foreground">Zero cloud dependency guarantee</p>
                  </div>
                </div>
              </div>

              {/* Model Candidates Grid */}
              {ai.modelCandidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ai.modelCandidates.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-3 transition-colors hover:border-border"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-foreground">{m.name}</span>
                            <Badge variant="outline" className="border-purple-500/40 text-purple-300 font-mono text-[10px] uppercase">
                              {m.provider}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{m.purpose}</p>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] font-mono shrink-0">
                          {m.expectedLatencyMs}ms
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40 font-mono">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-emerald-400" />
                          <span>Cost: ${(m.costPer1kTokens * 1000).toFixed(3)} / 1M tokens</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          {m.selected ? "PRIMARY" : "EVALUATED"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <Brain className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    No models registered yet. Click below to synthesize candidate models and routing rules.
                  </p>
                  <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Synthesize AI Topology
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
