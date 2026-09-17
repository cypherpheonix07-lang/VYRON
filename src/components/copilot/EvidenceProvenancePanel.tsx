/**
 * VYRON — EVIDENCE PROVENANCE POPOVER PANEL (GOD MODE vNEXT)
 * Directives: 440-459, 996-1009, 2066-2073
 *
 * Renders verified, derived, inferred, unknown, stale, or conflicted evidence badges.
 * Clicking a badge displays the cryptographic provenance panel.
 * Strictly ZERO SQL.
 */

import React, { useState } from "react";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Swords,
  ExternalLink,
  Lock,
  Hash,
} from "lucide-react";
import { EvidenceBadgeItem } from "@/state/copilot/copilotStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EvidenceProvenancePanelProps {
  evidence: EvidenceBadgeItem;
  className?: string;
}

export function EvidenceProvenancePanel({ evidence, className }: EvidenceProvenancePanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getBadgeConfig = (badge: EvidenceBadgeItem["badge"]) => {
    switch (badge) {
      case "VERIFIED":
        return {
          icon: CheckCircle2,
          symbol: "✓ VERIFIED",
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
          iconColor: "text-emerald-400",
        };
      case "DERIVED":
        return {
          icon: Shield,
          symbol: "◇ DERIVED",
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20",
          iconColor: "text-blue-400",
        };
      case "INFERRED":
        return {
          icon: AlertCircle,
          symbol: "! INFERRED",
          bg: "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20",
          iconColor: "text-amber-400",
        };
      case "UNKNOWN":
        return {
          icon: HelpCircle,
          symbol: "? UNKNOWN",
          bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/20",
          iconColor: "text-zinc-400",
        };
      case "STALE":
        return {
          icon: Clock,
          symbol: "⚠ STALE",
          bg: "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20",
          iconColor: "text-orange-400",
        };
      case "CONFLICTED":
        return {
          icon: Swords,
          symbol: "⚔ CONFLICTED",
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20",
          iconColor: "text-rose-400",
        };
    }
  };

  const config = getBadgeConfig(evidence.badge);
  const Icon = config.icon;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all cursor-pointer select-none",
            config.bg,
            className,
          )}
          title={`Click to inspect cryptographic provenance for ${evidence.label}`}
        >
          <Icon className={cn("size-2.5", config.iconColor)} />
          <span className="font-bold">{config.symbol}</span>
          <span className="text-muted-foreground truncate max-w-[120px]">
            {evidence.label}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 p-3.5 bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-xl text-xs space-y-2.5"
      >
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div className="flex items-center gap-1.5">
            <Icon className={cn("size-4", config.iconColor)} />
            <span className="font-bold text-foreground text-xs">{config.symbol}</span>
          </div>
          <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
            PROVENANCE
          </Badge>
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div>
            <span className="text-muted-foreground text-[10px] block">Claim / Evidence:</span>
            <p className="font-medium text-foreground">{evidence.label}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-muted-foreground text-[10px] block">Source:</span>
              <span className="text-foreground">{evidence.source}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-[10px] block">Trust State:</span>
              <span className="text-emerald-400 font-bold">{evidence.status || "VERIFIED"}</span>
            </div>
          </div>

          {evidence.confidence !== undefined && (
            <div>
              <span className="text-muted-foreground text-[10px] block">Calibrated Confidence:</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.round(evidence.confidence * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-foreground font-bold">
                  {Math.round(evidence.confidence * 100)}%
                </span>
              </div>
            </div>
          )}

          {evidence.hash && (
            <div className="pt-1">
              <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                <Hash className="size-2.5" />
                <span>SHA-256 Digest:</span>
              </span>
              <p className="text-[10px] text-primary/90 break-all select-all bg-background/50 p-1 rounded border border-border/40 mt-0.5">
                {evidence.hash}
              </p>
            </div>
          )}

          {evidence.retrievedAt && (
            <div className="text-[10px] text-muted-foreground/70 flex items-center gap-1 pt-1">
              <Clock className="size-2.5" />
              <span>Retrieved: {new Date(evidence.retrievedAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
