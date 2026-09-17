/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 01: Project Intent & Discovery Workspace
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import { Sparkles, Brain, HelpCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage01IntentWorkspace: React.FC = () => {
  const { state, updateIntent, executeStage, isExecuting, answerQuestion } = useAiProject();
  const [inputText, setInputText] = useState(state.intent.naturalLanguageIntent);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleAnalyzeIntent = () => {
    updateIntent({ naturalLanguageIntent: inputText });
    executeStage("01_INTENT", inputText);
  };

  const handleAnswer = (qId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: option }));
    answerQuestion(qId, option);
  };

  return (
    <div className="space-y-6">
      {/* Intent Capture Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-cyan-400" />
                Unstructured Human Intent
              </CardTitle>
              <CardDescription>
                Describe what you want to build in plain natural language. The Discovery Engine will extract domain, entities, target users, and unknowns.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 text-xs">
              Stage 01 • Intent Model
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Project Title</label>
              <Input
                value={state.name}
                onChange={(e) => updateIntent({ projectName: e.target.value })}
                placeholder="e.g. Apex Health Gateway"
                className="bg-background/50 border-border/80 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Unique Slug</label>
              <Input
                value={state.slug}
                onChange={(e) => updateIntent({ slug: e.target.value })}
                placeholder="e.g. apex-health-gateway"
                className="bg-background/50 border-border/80 text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Natural Language Intent</label>
            <Textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. I want to build a platform that helps developers understand whether their software architecture has security and scalability problems..."
              className="bg-background/50 border-border/80 text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Domain:</span>
              <Badge variant="secondary" className="text-[11px] font-medium">
                {state.intent.domain}
              </Badge>
              <span>Type:</span>
              <Badge variant="outline" className="text-[11px] font-mono">
                {state.intent.projectType}
              </Badge>
            </div>

            <Button
              size="sm"
              onClick={handleAnalyzeIntent}
              disabled={isExecuting || !inputText.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
              Run Discovery Engine
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progressive Discovery Questions */}
      {state.discoveryQuestions.length > 0 && (
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-amber-400" />
                  Prioritized Discovery Questions
                </CardTitle>
                <CardDescription className="text-xs">
                  Prioritized by Decision Impact × Uncertainty × Dependency to minimize assumptions.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/40 bg-amber-500/10">
                Formula: Impact × Uncertainty × Dep
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.discoveryQuestions.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl border border-border/70 bg-background/40 space-y-3 transition-colors hover:border-border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{q.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.context}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[10px] font-mono">
                    Priority Score: {q.priority}
                  </Badge>
                </div>

                {q.suggestedOptions && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {q.suggestedOptions.map((opt) => {
                      const isSelected = selectedAnswers[q.id] === opt || q.answer === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswer(q.id, opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm"
                              : "bg-card/60 border-border/70 text-muted-foreground hover:text-foreground hover:bg-card"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="h-3 w-3 text-cyan-400" />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Extracted Entities & Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Extracted Target Users
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {state.intent.targetUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-background/30 border border-border/50 text-xs">
                <span className="font-medium text-foreground">{u.label}</span>
                <Badge variant="outline" className="text-[10px]">
                  Priority #{u.priority} • {u.category}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Detected Technical Signals
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 flex flex-wrap gap-2">
            {state.intent.technicalSignals.map((sig) => (
              <Badge key={sig} variant="secondary" className="text-xs font-medium">
                {sig}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
