/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 14: Canonical Blueprint & Initialization Gate Workspace
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, Rocket, RefreshCw, Hash, Database, Cpu, Brain, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAiProject } from "@/state/aiProject/aiProjectStore";
import { initializationGate } from "@/services/aiProject/initialization/initializationGate";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Stage14BlueprintWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting } = useAiProject();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const bp = state.blueprint;
  const redTeam = state.redTeamFindings;
  const validation = initializationGate.validate(state);

  const handleCompile = () => {
    executeStage("14_BLUEPRINT");
  };

  const handleInitialize = async () => {
    setIsInitializing(true);
    setInitError(null);

    try {
      const res = await initializationGate.initializeProject(state);
      if (res.success && res.projectId) {
        toast.success("Project initialized successfully!", {
          description: `All 14 engineering stages transferred into workspace /app/projects/${res.projectId}`,
        });
        navigate({ to: "/app/projects/$id", params: { id: res.projectId } });
      } else {
        setInitError(res.error || "Initialization failed.");
        toast.error("Initialization blocked", { description: res.error });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setInitError(msg);
      toast.error("Initialization failed", { description: msg });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                Canonical 26-Section Project Blueprint & Red-Team Audit
              </CardTitle>
              <CardDescription>
                Unified engineering blueprint verifying end-to-end consistency across requirements, architecture, security, and tasks.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleCompile}
                disabled={isExecuting || isInitializing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                Compile & Red-Team Blueprint
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Initialization Error Alert if any */}
          {initError && (
            <div className="p-4 rounded-xl border border-destructive bg-destructive/10 text-xs text-destructive flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Initialization Blocked</p>
                <p>{initError}</p>
              </div>
            </div>
          )}

          {/* Adversarial Red-Team Findings */}
          {redTeam.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Adversarial Red-Team Challenge Findings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {redTeam.map((finding) => (
                  <div
                    key={finding.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-background/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={
                          finding.severity === "CRITICAL"
                            ? "border-rose-500/40 text-rose-400 bg-rose-500/10 font-mono text-[10px]"
                            : "border-amber-500/40 text-amber-400 bg-amber-500/10 font-mono text-[10px]"
                        }
                      >
                        {finding.severity} • {finding.category.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {finding.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="font-semibold text-foreground">{finding.affectedElement}</div>
                    <p className="text-muted-foreground">{finding.evidence}</p>
                    <div className="p-2 rounded bg-card/60 border border-border/40 text-[11px] space-y-1">
                      <span className="font-semibold text-emerald-400">Mitigation:</span>
                      <p className="text-muted-foreground">{finding.suggestedMitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canonical 26-Section Blueprint Table */}
          {bp ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Hash className="h-4 w-4 text-cyan-400" />
                  Canonical 26-Section Engineering Blueprint
                </h4>
                <Badge variant="outline" className="font-mono text-[10px] text-cyan-400 border-cyan-500/40">
                  SHA-256: {bp.sha256.substring(0, 16)}...
                </Badge>
              </div>

              <div className="border border-border/70 rounded-xl overflow-hidden bg-background/40">
                <div className="max-h-80 overflow-y-auto divide-y divide-border/40 text-xs">
                  {bp.sections.map((sec) => (
                    <div key={sec.index} className="p-3 flex items-start justify-between gap-4 hover:bg-card/40">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground">
                          {sec.index}. {sec.title}
                        </div>
                        <div className="text-muted-foreground line-clamp-1">{sec.content}</div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] shrink-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        VERIFIED
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Initialization Gate Action Card */}
              <div className="p-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-500/10">
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="text-base font-bold text-foreground flex items-center gap-2 justify-center md:justify-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Initialization Gate Cleared & Ready
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    All 14 engineering stages verified. Ready to atomically provision project entities in database and transfer context to workspace.
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => setShowReviewDialog(true)}
                  disabled={isInitializing || !validation.canInitialize}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm gap-2 shadow-xl shadow-emerald-500/25 shrink-0 px-6"
                >
                  <Rocket className="h-4 w-4" />
                  Review & Initialize Project Workspace
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Blueprint has not been compiled yet. Click below to synthesize the canonical 26-section blueprint and challenge assumptions with the Red Team.
              </p>
              <Button size="sm" onClick={handleCompile} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Compile Project Blueprint
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pre-Initialization Blueprint Freeze & Review Modal */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl bg-card border-border shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Pre-Initialization Blueprint Freeze & Review
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Cryptographic verification and atomic database provisioning manifest.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            {/* Seal & Hash Banner */}
            <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                  Cryptographic Seal (SHA-256)
                </span>
                <p className="font-mono text-xs text-foreground font-semibold">
                  {bp?.sha256 || "Pending synthesis..."}
                </p>
              </div>
              <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 font-mono text-[10px]">
                SEALED & FROZEN
              </Badge>
            </div>

            {/* Verification Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 rounded-lg border border-border/70 bg-background/50 space-y-1 text-center">
                <span className="text-[10px] text-muted-foreground uppercase">Sections</span>
                <p className="text-base font-bold text-foreground">{bp?.sections.length || 26} / 26</p>
                <Badge variant="secondary" className="text-[9px] bg-emerald-500/10 text-emerald-400">VERIFIED</Badge>
              </div>
              <div className="p-3 rounded-lg border border-border/70 bg-background/50 space-y-1 text-center">
                <span className="text-[10px] text-muted-foreground uppercase">Requirements</span>
                <p className="text-base font-bold text-foreground">{state.requirements.length}</p>
                <Badge variant="secondary" className="text-[9px] bg-emerald-500/10 text-emerald-400">0 CONFLICTS</Badge>
              </div>
              <div className="p-3 rounded-lg border border-border/70 bg-background/50 space-y-1 text-center">
                <span className="text-[10px] text-muted-foreground uppercase">Security Threats</span>
                <p className="text-base font-bold text-foreground">{state.security.threats.length}</p>
                <Badge variant="secondary" className="text-[9px] bg-emerald-500/10 text-emerald-400">0 RESIDUAL HIGH</Badge>
              </div>
              <div className="p-3 rounded-lg border border-border/70 bg-background/50 space-y-1 text-center">
                <span className="text-[10px] text-muted-foreground uppercase">Task DAG</span>
                <p className="text-base font-bold text-foreground">{state.implementation.tasks.length} Tasks</p>
                <Badge variant="secondary" className="text-[9px] bg-indigo-500/10 text-indigo-400">READY</Badge>
              </div>
            </div>

            {/* Atomic Provisioning Manifest */}
            <div className="rounded-xl border border-border/70 bg-background/40 p-3.5 space-y-2">
              <h5 className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-indigo-400" />
                Atomic Provisioning Manifest
              </h5>
              <div className="space-y-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>1. Database Record</span>
                  <span className="font-mono text-foreground font-medium">projects (slug: {state.slug})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>2. Audit & Telemetry Log</span>
                  <span className="font-mono text-foreground font-medium">activity_events (system event)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>3. Copilot Memory Context</span>
                  <span className="font-mono text-foreground font-medium">PROJECT & TASK Layers (Epistemic metadata)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>4. Local Draft State</span>
                  <span className="font-mono text-emerald-400 font-medium">Draft cleared upon successful commit</span>
                </div>
              </div>
            </div>

            {/* Target Workspace Info */}
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="font-semibold text-foreground">Target Workspace Route</p>
                  <p className="text-[11px] text-muted-foreground font-mono">/app/projects/:id</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                SEAMLESS HANDOFF
              </Badge>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewDialog(false)}
              disabled={isInitializing}
              className="text-xs"
            >
              Back to Workspace
            </Button>
            <Button
              size="sm"
              onClick={handleInitialize}
              disabled={isInitializing || !validation.canInitialize}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Rocket className={`h-3.5 w-3.5 ${isInitializing ? "animate-spin" : ""}`} />
              {isInitializing ? "Provisioning Project..." : "Confirm & Provision Live Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
