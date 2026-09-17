/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 07: Technology Stack & Trade-Offs Workspace
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import { Cpu, Plus, Sparkles, CheckCircle2, ArrowRightLeft, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";
import { TechStackDecision } from "@/types/aiProjectControlPlane";

export const Stage07TechnologyWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting, addManualDecision, updateDecision } = useAiProject();
  const tech = state.technology;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState<TechStackDecision["category"]>("backend");
  const [newPrimary, setNewPrimary] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newRationale, setNewRationale] = useState("");
  const [newTradeOffs, setNewTradeOffs] = useState("");

  const handleSynthesize = () => {
    executeStage("07_TECHNOLOGY");
  };

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrimary.trim()) return;

    addManualDecision({
      category: newCat,
      primaryOption: newPrimary.trim(),
      alternativeOption: newAlt.trim() || "Custom / None",
      selectedOption: newPrimary.trim(),
      rationale: newRationale.trim() || "Selected based on team velocity and architectural requirements.",
      tradeOffs: newTradeOffs.trim() || "Standard trade-off profile.",
      migrationImplications: "Standard migration path.",
    });

    setNewPrimary("");
    setNewAlt("");
    setNewRationale("");
    setNewTradeOffs("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-400" />
                Technology Stack Engineering & Compatibility
              </CardTitle>
              <CardDescription>
                Audits runtime compatibility, velocity vs operational complexity, and vendor lock-in risks across all system layers.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {tech.stackFitScore > 0 && (
                <Badge variant="outline" className="border-blue-500/40 text-blue-300 font-mono text-xs">
                  Stack Fit: {tech.stackFitScore}%
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs h-8 border-border/70 text-muted-foreground hover:text-foreground gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Decision
              </Button>
              <Button
                size="sm"
                onClick={handleSynthesize}
                disabled={isExecuting}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 gap-1.5 shadow-md shadow-blue-600/20"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                Evaluate Stack Fit
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Manual Decision Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateDecision}
              className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 space-y-3"
            >
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                Add Architecture Technology Decision
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as TechStackDecision["category"])}
                  className="bg-background/60 border border-border/80 rounded-md px-2 text-xs h-8 text-foreground"
                >
                  <option value="frontend">Frontend Framework</option>
                  <option value="backend">Backend Runtime</option>
                  <option value="database">Database / Persistence</option>
                  <option value="cache">Caching Layer</option>
                  <option value="queue">Message Broker / Queue</option>
                  <option value="search">Search & Indexing</option>
                  <option value="ai_inference">AI Inference Gateway</option>
                </select>
                <Input
                  value={newPrimary}
                  onChange={(e) => setNewPrimary(e.target.value)}
                  placeholder="Primary Choice (e.g. React 19 + Vite)"
                  className="bg-background/60 border-border/80 text-xs h-8"
                  required
                />
                <Input
                  value={newAlt}
                  onChange={(e) => setNewAlt(e.target.value)}
                  placeholder="Alternative Option (e.g. Next.js App Router)"
                  className="bg-background/60 border-border/80 text-xs h-8"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Textarea
                  value={newRationale}
                  onChange={(e) => setNewRationale(e.target.value)}
                  placeholder="Architectural rationale..."
                  className="bg-background/60 border-border/80 text-xs resize-none h-14"
                />
                <Textarea
                  value={newTradeOffs}
                  onChange={(e) => setNewTradeOffs(e.target.value)}
                  placeholder="Trade-offs and operational complexity..."
                  className="bg-background/60 border-border/80 text-xs resize-none h-14"
                />
              </div>
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
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-7">
                  Save Decision
                </Button>
              </div>
            </form>
          )}

          {/* Technology Decisions Grid */}
          {tech.decisions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tech.decisions.map((d, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-3 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="outline" className="border-blue-500/40 text-blue-300 font-mono text-[10px] uppercase">
                      {d.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">ADR #{idx + 1}</span>
                  </div>

                  {/* Primary vs Alternative Toggleable Selection */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => updateDecision(d.category, d.primaryOption)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        d.selectedOption === d.primaryOption
                          ? "border-blue-500 bg-blue-500/15 shadow-sm"
                          : "border-border/60 bg-background/40 hover:border-border text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-blue-400">Primary</span>
                        {d.selectedOption === d.primaryOption && <CheckCircle2 className="h-3 w-3 text-blue-400" />}
                      </div>
                      <div className="text-xs font-semibold text-foreground mt-0.5">{d.primaryOption}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateDecision(d.category, d.alternativeOption)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        d.selectedOption === d.alternativeOption
                          ? "border-amber-500 bg-amber-500/15 shadow-sm"
                          : "border-border/60 bg-background/40 hover:border-border text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-amber-400">Alternative</span>
                        {d.selectedOption === d.alternativeOption && <CheckCircle2 className="h-3 w-3 text-amber-400" />}
                      </div>
                      <div className="text-xs font-semibold text-foreground mt-0.5">{d.alternativeOption}</div>
                    </button>
                  </div>

                  {/* Decision Rationale */}
                  <div className="p-2.5 rounded-lg bg-background/50 border border-border/50 text-[11px] space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <Zap className="h-3 w-3 text-blue-400" />
                      Rationale:
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{d.rationale}</p>
                  </div>

                  {/* Trade-offs & Migration */}
                  <div className="text-[10px] text-muted-foreground space-y-1 pt-1 border-t border-border/40">
                    <div>
                      <span className="font-semibold text-foreground">Trade-offs:</span> {d.tradeOffs}
                    </div>
                    {d.migrationImplications && (
                      <div>
                        <span className="font-semibold text-foreground">Migration:</span> {d.migrationImplications}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Cpu className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-xs text-muted-foreground">
                No stack decisions evaluated yet. Click below to synthesize technology choices based on your requirements.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Evaluate Stack Fit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
