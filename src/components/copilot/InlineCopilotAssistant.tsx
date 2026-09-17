/**
 * PROJECT BRAHMA — INLINE CONTEXTUAL COPILOT ASSISTANT
 * Embeddable, page-aware intelligence widget providing real-time recommendations,
 * verified assertions, and 1-click execution actions.
 * Strictly ZERO SQL.
 */

import React, { useState } from "react";
import { Sparkles, Bot, Play, ArrowRight, ShieldCheck, Database, Layers, Send, CheckCircle2 } from "lucide-react";
import { useCopilot } from "@/state/copilot/useCopilot";
import { useAppMode } from "@/state/mode/useAppMode";
import { copilotContextEngine } from "@/services/copilot/copilotContextEngine";
import { copilotPlanner } from "@/services/copilot/copilotPlanner";
import { copilotExecutionEngine } from "@/services/copilot/copilotExecutionEngine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface InlineCopilotAssistantProps {
  pageContext: "dashboard" | "analysis" | "datasets" | "connectors" | "studio" | "reports";
  className?: string;
  onActionTriggered?: (actionType: string) => void;
}

export function InlineCopilotAssistant({
  pageContext,
  className,
  onActionTriggered,
}: InlineCopilotAssistantProps) {
  const { mode } = useAppMode();
  const { setDrawerOpen, setActiveTab, sendMessage, addAssistantMessage, setActivePlan } = useCopilot();
  const [query, setQuery] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const getPageDirective = () => {
    switch (pageContext) {
      case "analysis":
        return {
          title: mode === "DEMO" ? "Demo Copilot Analysis Observer" : "Copilot Execution & Anomaly Engine",
          description:
            mode === "DEMO"
              ? "Actively observing the IEEE-CIS benchmark simulation. Synthesize execution plans or review IQR statistical outlier thresholds."
              : "12-stage analysis pipeline ready. Formulate execution plans, inspect bipartite graph centrality, or verify cryptographic proofs.",
          recommendedPrompts: [
            "Synthesize 12-stage analytical plan",
            "Audit IQR statistical outlier thresholds",
            "Explain bipartite graph proxy hubs",
          ],
        };
      case "datasets":
        return {
          title: mode === "DEMO" ? "Demo Dataset Validator" : "Copilot Dataset Quality Auditor",
          description:
            "Evaluate public Kaggle benchmarks, inspect column contracts, and audit null-tolerance integrity before pipeline ingestion.",
          recommendedPrompts: [
            "Validate schema contracts for active dataset",
            "Compare Kaggle benchmarks for fraud detection",
            "Inspect column null tolerances",
          ],
        };
      case "connectors":
        return {
          title: "Copilot Zero-Trust Connector Governor",
          description:
            "Enforce least-privilege tool execution, inspect MCP health latencies, and audit cryptographic session keys with zero credential leaks.",
          recommendedPrompts: [
            "Test health and latency on all connectors",
            "Audit tool execution permissions",
            "Verify zero credential leaks",
          ],
        };
      case "studio":
        return {
          title: "Copilot Blueprint Synthesizer",
          description:
            "Deconstruct natural language SRS requirements into formal 8-tab architectural specifications and React Flow DAG topologies.",
          recommendedPrompts: [
            "Decompose SRS into microservice topology",
            "Evaluate STRIDE threat model",
            "Audit requirements traceability",
          ],
        };
      default:
        return {
          title: mode === "DEMO" ? "Vyron Demo Copilot" : "Vyron Intelligence Copilot",
          description:
            mode === "DEMO"
              ? "Ready to narrate technical demonstrations, explain simulated scenarios, and guide reviewer queries."
              : "Autonomous architectural intelligence layer. Ask questions, generate execution plans, and audit release gates.",
          recommendedPrompts: [
            "What are the top architecture risks?",
            "Synthesize full verification plan",
            "Run 12-stage analysis pipeline",
          ],
        };
    }
  };

  const config = getPageDirective();

  const handlePromptClick = async (promptText: string) => {
    setDrawerOpen(true);
    sendMessage(promptText);
    if (onActionTriggered) onActionTriggered(promptText);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const text = query.trim();
    setQuery("");
    setDrawerOpen(true);
    sendMessage(text);
    if (onActionTriggered) onActionTriggered(text);
  };

  return (
    <div
      className={cn(
        "p-4 rounded-2xl border transition-all duration-300 shadow-md",
        mode === "DEMO"
          ? "border-amber-500/30 bg-gradient-to-r from-card/90 via-amber-500/5 to-card/90"
          : "border-primary/20 bg-gradient-to-r from-card/90 via-primary/5 to-card/90",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "p-2 rounded-xl border flex items-center justify-center",
              mode === "DEMO"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-primary/20 text-primary border-primary/30",
            )}
          >
            <Bot className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-foreground tracking-tight">{config.title}</h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-mono px-1.5 py-0",
                  mode === "DEMO"
                    ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                    : "border-primary/40 text-primary bg-primary/10",
                )}
              >
                {mode === "DEMO" ? "SIMULATION MODE" : "LIVE GOVERNANCE"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{config.description}</p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setDrawerOpen(true)}
          className="text-xs h-7 gap-1 shrink-0"
        >
          <Sparkles className="size-3 text-primary" />
          <span>Open Full Copilot</span>
        </Button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-1.5 pt-3">
        <span className="text-[11px] text-muted-foreground mr-1 flex items-center gap-1">
          <Sparkles className="size-3 text-primary" /> Suggested:
        </span>
        {config.recommendedPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handlePromptClick(prompt)}
            disabled={isExecuting}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 text-foreground transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <span>{prompt}</span>
            <ArrowRight className="size-2.5 opacity-60" />
          </button>
        ))}
      </div>

      {/* Quick Input Box */}
      <form onSubmit={handleFormSubmit} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Ask ${mode === "DEMO" ? "Demo Copilot" : "Brahma Copilot"} or enter a goal...`}
          className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-background/80 border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button type="submit" size="sm" disabled={!query.trim() || isExecuting} className="text-xs h-8 px-3">
          <Send className="size-3 mr-1" />
          <span>Send</span>
        </Button>
      </form>
    </div>
  );
}
