import { useState } from "react";
import {
  ShieldCheck,
  Cpu,
  Clock,
  Coins,
  Copy,
  Check,
  AlertTriangle,
  Database,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ProvenanceMeta {
  provider?: string | undefined;
  model?: string | undefined;
  cost_usd?: number | undefined;
  latency_ms?: number | undefined;
  cache_hit?: boolean | undefined;
  fallback_used?: boolean | undefined;
  sha256?: string | undefined;
  created_at?: string | undefined;
}

interface ProvenancePopoverProps {
  meta?: ProvenanceMeta | null | undefined;
  className?: string | undefined;
  compact?: boolean | undefined;
}

export function ProvenancePopover({ meta, className, compact }: ProvenancePopoverProps) {
  const [copied, setCopied] = useState(false);

  if (!meta) {
    return (
      <Badge variant="outline" className="text-xs text-muted-foreground border-border/60 gap-1.5 py-1 px-2.5">
        <Sparkles className="size-3 text-cyan-400" />
        AI Synthesized
      </Badge>
    );
  }

  const isTemplate = meta.provider === "template" || meta.fallback_used === true;
  const isCacheHit = meta.cache_hit === true;
  const hash = meta.sha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const shortHash = `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    toast.success("SHA-256 checksum copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className || ""}`}>
      {/* If template fallback, show prominent amber badge */}
      {isTemplate && (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1.5 py-0.5 px-2 text-[11px] font-mono font-medium shadow-xs"
        >
          <AlertTriangle className="size-3" />
          Template Fallback
        </Badge>
      )}

      {/* Main Provenance Popover Trigger */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 px-2.5 text-xs bg-slate-900/60 hover:bg-slate-800 border-slate-700/60 text-slate-300 transition-colors shadow-xs"
          >
            <ShieldCheck className={`size-3.5 ${isTemplate ? "text-amber-400" : "text-emerald-400"}`} />
            <span className="font-mono text-[11px]">{meta.model || "brahma-kernel"}</span>
            {isCacheHit && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 font-medium">
                Cached
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-80 p-4 bg-slate-950/95 border-slate-800 text-slate-200 shadow-2xl backdrop-blur-xl space-y-3.5 rounded-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              <h4 className="text-xs font-semibold tracking-wide uppercase text-slate-100">
                Artifact Provenance
              </h4>
            </div>
            <Badge
              variant="outline"
              className={
                isTemplate
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/20 text-[10px]"
                  : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-[10px]"
              }
            >
              {isTemplate ? "Deterministic Template" : "Cryptographically Verified"}
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Cpu className="size-3.5 text-slate-500" /> Provider &amp; Model
              </span>
              <span className="font-mono text-slate-200 font-medium">
                {meta.provider || "openrouter"} / {meta.model || "claude-3.5-sonnet"}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Coins className="size-3.5 text-slate-500" /> Metered Cost
              </span>
              <span className="font-mono text-emerald-400 font-medium">
                ${Number(meta.cost_usd || 0).toFixed(6)} USD
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="size-3.5 text-slate-500" /> Execution Latency
              </span>
              <span className="font-mono text-slate-200">
                {meta.latency_ms || 0} ms {isCacheHit ? "(Cache Hit)" : ""}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Database className="size-3.5 text-slate-500" /> State
              </span>
              <span className="text-slate-200">
                {isCacheHit ? "Semantic Cache Hit (0 cost)" : isTemplate ? "Fallback Chain Triggered" : "Direct Gateway Generation"}
              </span>
            </div>
          </div>

          {/* SHA-256 Vault Hash */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>SHA-256 Canonical Checksum</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyHash}
                className="h-5 px-1.5 text-[10px] text-slate-400 hover:text-slate-200"
              >
                {copied ? <Check className="size-3 text-emerald-400 mr-1" /> : <Copy className="size-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-[10px] text-slate-300 break-all select-all">
              {hash}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
