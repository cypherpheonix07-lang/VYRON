/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 05: Capability Modeling Workspace
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import { Layers, Plus, Sparkles, CheckCircle2, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage05CapabilityWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting, addManualCapability } = useAiProject();
  const capabilities = state.capabilities.capabilities;

  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [showManualForm, setShowManualForm] = useState(false);
  const [newCapName, setNewCapName] = useState("");
  const [newCapCategory, setNewCapCategory] = useState("CORE");
  const [newCapDesc, setNewCapDesc] = useState("");
  const [newCapSubs, setNewCapSubs] = useState("");

  const handleSynthesize = () => {
    executeStage("05_CAPABILITY");
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapName.trim()) return;

    addManualCapability({
      name: newCapName.trim(),
      category: newCapCategory,
      description: newCapDesc.trim(),
      subCapabilities: newCapSubs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      satisfiesRequirementIds: [],
    });

    setNewCapName("");
    setNewCapDesc("");
    setNewCapSubs("");
    setShowManualForm(false);
  };

  const filteredCapabilities =
    filterCategory === "ALL"
      ? capabilities
      : capabilities.filter((c) => c.category.toUpperCase() === filterCategory);

  const categories = ["ALL", "CORE", "SUPPORTING", "GENERIC", "DOMAIN"];

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5 text-amber-400" />
                Capability Modeling & Domain Taxonomy
              </CardTitle>
              <CardDescription>
                Derives WHAT the system must do before deciding HOW it will be built. Separates business value from technology implementations.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowManualForm(!showManualForm)}
                className="text-xs h-8 border-border/70 text-muted-foreground hover:text-foreground gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Capability
              </Button>
              <Button
                size="sm"
                onClick={handleSynthesize}
                disabled={isExecuting}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-8 gap-1.5 shadow-md shadow-amber-600/20"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                Synthesize Capabilities
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Manual Creation Card */}
          {showManualForm && (
            <form
              onSubmit={handleCreateManual}
              className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3"
            >
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Create Business Capability
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  value={newCapName}
                  onChange={(e) => setNewCapName(e.target.value)}
                  placeholder="Capability Name (e.g. Real-Time Telemetry Ingestion)"
                  className="bg-background/60 border-border/80 text-xs h-8"
                  required
                />
                <select
                  value={newCapCategory}
                  onChange={(e) => setNewCapCategory(e.target.value)}
                  className="bg-background/60 border border-border/80 rounded-md px-2 text-xs h-8 text-foreground"
                >
                  <option value="CORE">CORE (Primary Value Prop)</option>
                  <option value="SUPPORTING">SUPPORTING (Enabling Workflow)</option>
                  <option value="GENERIC">GENERIC (Standard Infrastructure)</option>
                  <option value="DOMAIN">DOMAIN (Specialized Industry Model)</option>
                </select>
              </div>
              <Textarea
                value={newCapDesc}
                onChange={(e) => setNewCapDesc(e.target.value)}
                placeholder="Capability description and operational value..."
                className="bg-background/60 border-border/80 text-xs resize-none h-16"
              />
              <Input
                value={newCapSubs}
                onChange={(e) => setNewCapSubs(e.target.value)}
                placeholder="Comma-separated sub-capabilities (e.g. Validation, Deduplication, Buffer Queue)"
                className="bg-background/60 border-border/80 text-xs h-8"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowManualForm(false)}
                  className="text-xs h-7"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-7"
                >
                  Save Capability
                </Button>
              </div>
            </form>
          )}

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="h-3 w-3 text-muted-foreground mr-1" />
            <span className="text-[11px] text-muted-foreground mr-2 font-medium">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  filterCategory === cat
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-background/40 text-muted-foreground hover:text-foreground border border-border/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Capabilities List */}
          {filteredCapabilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCapabilities.map((cap) => (
                <div
                  key={cap.id}
                  className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-3 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge variant="outline" className="border-amber-500/40 text-amber-300 font-mono text-[10px] uppercase">
                        {cap.category}
                      </Badge>
                      <h4 className="text-sm font-bold text-foreground mt-1">{cap.name}</h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0 font-mono">
                      {cap.subCapabilities.length} sub-items
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{cap.description}</p>

                  {/* Sub-capabilities Tags */}
                  {cap.subCapabilities.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Decomposed Sub-Capabilities:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cap.subCapabilities.map((sub, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-background/60 border border-border/50 text-[10px] text-foreground flex items-center gap-1"
                          >
                            <ChevronRight className="h-2.5 w-2.5 text-amber-400" />
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirement Links */}
                  {cap.satisfiesRequirementIds.length > 0 && (
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1 border-t border-border/40">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span>Satisfies Requirements: </span>
                      <span className="font-mono text-amber-300 font-medium">
                        {cap.satisfiesRequirementIds.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Layers className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-xs text-muted-foreground">
                No capabilities modeled yet. Synthesize capabilities from project requirements or add them manually.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Synthesize Capabilities
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
