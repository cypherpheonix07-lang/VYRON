/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 11: Reliability Engineering & Resilience Modeling Workspace
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import { Activity, Plus, Sparkles, AlertCircle, RefreshCw, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";

export const Stage11ReliabilityWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting, addManualReliabilityScenario } = useAiProject();
  const rel = state.reliability;

  const [showAddForm, setShowAddForm] = useState(false);
  const [componentName, setComponentName] = useState("");
  const [failureScenario, setFailureScenario] = useState("");
  const [timeoutMs, setTimeoutMs] = useState("3000");
  const [retries, setRetries] = useState("3");
  const [circuitBreaker, setCircuitBreaker] = useState("5");
  const [fallback, setFallback] = useState("");

  const handleSynthesize = () => {
    executeStage("11_RELIABILITY");
  };

  const handleCreateScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentName.trim()) return;

    addManualReliabilityScenario({
      componentName: componentName.trim(),
      failureScenario: failureScenario.trim() || "Downstream service timeout / partition",
      timeoutMs: parseInt(timeoutMs, 10) || 3000,
      retryCount: parseInt(retries, 10) || 3,
      circuitBreakerThreshold: parseInt(circuitBreaker, 10) || 5,
      fallbackStrategy: fallback.trim() || "Deterministic in-memory cache fallback",
      idempotencyRequired: true,
    });

    setComponentName("");
    setFailureScenario("");
    setFallback("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-400" />
                Reliability Engineering & Failure Modeling
              </CardTitle>
              <CardDescription>
                Models component failure modes, timeout policies, circuit breaker thresholds, and deterministic fallback engines to guarantee continuous uptime.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {rel.overallResilienceScore > 0 && (
                <Badge variant="outline" className="border-orange-500/40 text-orange-300 font-mono text-xs">
                  Resilience: {rel.overallResilienceScore}%
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs h-8 border-border/70 text-muted-foreground hover:text-foreground gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Scenario
              </Button>
              <Button
                size="sm"
                onClick={handleSynthesize}
                disabled={isExecuting}
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs h-8 gap-1.5 shadow-md shadow-orange-600/20"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                Model Failure Scenarios
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Manual Failure Scenario Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateScenario}
              className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/10 space-y-3"
            >
              <h4 className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                Add Component Failure Scenario
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="Component Name (e.g. PaymentGatewayAdapter)"
                  className="bg-background/60 border-border/80 text-xs h-8 sm:col-span-2"
                  required
                />
                <Input
                  value={timeoutMs}
                  onChange={(e) => setTimeoutMs(e.target.value)}
                  placeholder="Timeout (ms)"
                  className="bg-background/60 border-border/80 text-xs h-8"
                />
                <Input
                  value={retries}
                  onChange={(e) => setRetries(e.target.value)}
                  placeholder="Max Retries"
                  className="bg-background/60 border-border/80 text-xs h-8"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  value={failureScenario}
                  onChange={(e) => setFailureScenario(e.target.value)}
                  placeholder="Failure Condition (e.g. 504 Gateway Timeout or Rate Limit)"
                  className="bg-background/60 border-border/80 text-xs h-8"
                />
                <Input
                  value={fallback}
                  onChange={(e) => setFallback(e.target.value)}
                  placeholder="Fallback Strategy (e.g. Exponential backoff + Circuit breaker)"
                  className="bg-background/60 border-border/80 text-xs h-8"
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
                <Button type="submit" size="sm" className="bg-orange-600 hover:bg-orange-500 text-white text-xs h-7">
                  Save Scenario
                </Button>
              </div>
            </form>
          )}

          {/* Scenarios Grid */}
          {rel.scenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rel.scenarios.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-3 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-orange-400" />
                        <span className="font-mono text-sm font-bold text-foreground">{s.componentName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{s.failureScenario}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-orange-500/40 text-orange-300">
                      CB: {s.circuitBreakerThreshold} failures
                    </Badge>
                  </div>

                  {/* Latency & Retry Matrix */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-background/50 border border-border/50 text-[11px] font-mono text-center">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Timeout</div>
                      <div className="font-bold text-foreground">{s.timeoutMs}ms</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Retries</div>
                      <div className="font-bold text-foreground">{s.retryCount}x backoff</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Idempotency</div>
                      <div className="font-bold text-emerald-400">Enforced</div>
                    </div>
                  </div>

                  {/* Fallback Strategy Banner */}
                  <div className="p-2 rounded bg-orange-500/10 border border-orange-500/30 text-[11px] space-y-0.5">
                    <span className="font-semibold text-orange-300">Deterministic Fallback:</span>
                    <p className="text-muted-foreground">{s.fallbackStrategy}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-xs text-muted-foreground">
                No component failure scenarios modeled yet. Synthesize circuit breakers and retry policies from architecture.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Model Failure Scenarios
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
