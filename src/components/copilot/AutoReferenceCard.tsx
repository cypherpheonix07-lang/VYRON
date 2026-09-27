/**
 * VYRON — AUTO-REFERENCE CARD COMPONENT (GOD MODE Ω×)
 * Renders the "Referenced from previous chat" card showing:
 * 1. Why the previous chat turn was selected (8D score breakdown, project affinity)
 * 2. Which turns were reused and which turns were ignored
 * 3. Whether newer empirical evidence superseded historical claims
 * 4. Interactive user correction buttons: [Use This] [Never Use] [Remember] [Forget]
 *
 * Strictly ZERO SQL.
 */

import React, { useState } from "react";
import {
  History,
  CheckCircle2,
  Ban,
  Bookmark,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { AutoReferenceExplanation, UserChatCorrection, historyRetrieval } from "@/services/copilot/historyRetrieval";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AutoReferenceCardProps {
  autoReferences: AutoReferenceExplanation[];
  className?: string | undefined;
}

export function AutoReferenceCard({ autoReferences, className }: AutoReferenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCorrections, setActiveCorrections] = useState<Record<string, UserChatCorrection>>({});

  if (!autoReferences || autoReferences.length === 0) return null;

  const handleCorrection = (turnId: string, action: UserChatCorrection) => {
    historyRetrieval.applyUserCorrection(turnId, action);
    setActiveCorrections((prev) => ({ ...prev, [turnId]: action }));

    switch (action) {
      case "USE":
        toast.success(`Pinned turn [${turnId.slice(0, 12)}] for future retrieval priority.`);
        break;
      case "NEVER_USE":
        toast.warning(`Excluded turn [${turnId.slice(0, 12)}]. It will never be referenced again.`);
        break;
      case "REMEMBER":
        toast.success(`Promoted turn [${turnId.slice(0, 12)}] claims into Durable Invariant Vault.`);
        break;
      case "FORGET":
        toast.info(`Erased turn [${turnId.slice(0, 12)}] from active memory.`);
        break;
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-primary/25 bg-primary/5 shadow-sm overflow-hidden text-xs font-sans transition-all",
        className
      )}
    >
      {/* Top Banner Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="size-3.5 text-primary animate-pulse" />
          <span className="font-semibold text-foreground text-xs">
            Referenced from previous chat
          </span>
          <Badge
            variant="outline"
            className="text-[9px] font-mono border-primary/40 text-primary bg-primary/10 py-0 px-1.5"
          >
            {autoReferences.length} {autoReferences.length === 1 ? "turn" : "turns"} admitted
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
          <span className="text-[10px] font-mono">8D Score: {autoReferences[0]?.scoreBreakdown.totalScore}/1.0</span>
          {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </div>
      </button>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="p-3.5 pt-2 border-t border-primary/20 space-y-3 bg-background/40">
          {autoReferences.map((ref, idx) => {
            const correction = activeCorrections[ref.referencedTurnId] || ref.activeCorrection;

            return (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-2.5 text-[11px]"
              >
                {/* Reason & Project Anchor */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold flex items-center gap-1">
                      <Sparkles className="size-3 text-amber-400" />
                      Selection Rationale:
                    </span>
                    <p className="text-foreground/90 font-medium leading-relaxed">
                      {ref.whySelected}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-mono border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shrink-0"
                  >
                    Project Isolated
                  </Badge>
                </div>

                {/* Turns Reused */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold block">
                    Admitted Content ({ref.turnsReused.length}):
                  </span>
                  {ref.turnsReused.map((tr, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-background/60 border border-border/40 font-mono text-[10px] text-foreground/80 leading-relaxed"
                    >
                      <span className="text-primary font-bold">[{tr.turnId}]:</span> "{tr.excerpt}"
                    </div>
                  ))}
                </div>

                {/* Turns Ignored */}
                {ref.turnsIgnored.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold block">
                      Excluded Turns (Noise Reduction):
                    </span>
                    {ref.turnsIgnored.map((ti, i) => (
                      <div
                        key={i}
                        className="text-[10px] text-muted-foreground/80 italic font-mono pl-1"
                      >
                        • [{ti.turnId}]: {ti.rationale}
                      </div>
                    ))}
                  </div>
                )}

                {/* Superseded Check */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  {ref.supersededByNewerEvidence ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      Superseded: Newer AST scan has updated historical assumptions.
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="size-3" />
                      Uncontradicted: Still conformant with active repository HEAD.
                    </span>
                  )}
                </div>

                {/* User Correction Controls */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Adjust Memory Influence:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant={correction === "USE" ? "default" : "outline"}
                      className="h-6 px-2 text-[10px] gap-1"
                      onClick={() => handleCorrection(ref.referencedTurnId, "USE")}
                    >
                      <CheckCircle2 className="size-3" />
                      Use This
                    </Button>
                    <Button
                      size="sm"
                      variant={correction === "NEVER_USE" ? "destructive" : "outline"}
                      className="h-6 px-2 text-[10px] gap-1"
                      onClick={() => handleCorrection(ref.referencedTurnId, "NEVER_USE")}
                    >
                      <Ban className="size-3" />
                      Never Use
                    </Button>
                    <Button
                      size="sm"
                      variant={correction === "REMEMBER" ? "secondary" : "outline"}
                      className="h-6 px-2 text-[10px] gap-1"
                      onClick={() => handleCorrection(ref.referencedTurnId, "REMEMBER")}
                    >
                      <Bookmark className="size-3" />
                      Remember
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-destructive"
                      onClick={() => handleCorrection(ref.referencedTurnId, "FORGET")}
                    >
                      <Trash2 className="size-3" />
                      Forget
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
