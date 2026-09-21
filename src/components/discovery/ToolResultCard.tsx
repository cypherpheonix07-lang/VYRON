import React, { useState } from "react";
import {
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Scale,
  Star,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToolSearchResult, AITool } from "@/types/discovery";
import { HealthBadge } from "./HealthBadge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ToolResultCardProps {
  result: ToolSearchResult;
  onCompare?: (tool: AITool) => void;
  isComparing?: boolean;
}

export function ToolResultCard({ result, onCompare, isComparing = false }: ToolResultCardProps) {
  const { tool, relevanceScore, reasons, healthScore } = result;
  const [isSaved, setIsSaved] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success(`Saved ${tool.name} to your Discovery Library`);
    } else {
      toast.info(`Removed ${tool.name} from saved items`);
    }
  };

  const getVerificationBadge = () => {
    switch (tool.verification_level) {
      case "data":
        return (
          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[10px] gap-1">
            <ShieldCheck className="size-3" /> Data Verified
          </Badge>
        );
      case "editor":
        return (
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px] gap-1">
            <Sparkles className="size-3" /> Editor Choice
          </Badge>
        );
      case "domain":
        return (
          <Badge variant="outline" className="text-[10px] text-muted-foreground gap-1">
            <ShieldCheck className="size-3" /> Domain Verified
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPricingLabel = () => {
    switch (tool.pricing_type) {
      case "free":
        return "Free";
      case "open_source":
        return "Open Source";
      case "freemium":
        return `Freemium (From $${tool.starting_price_usd}/mo)`;
      case "paid":
        return `Paid (From $${tool.starting_price_usd}/mo)`;
      default:
        return "Freemium";
    }
  };

  const formatLastVerified = (isoString?: string) => {
    if (!isoString) return "Recently";
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <Card className="group relative flex flex-col justify-between border-border/70 bg-card/60 hover:bg-card hover:border-primary/40 transition-all duration-200 hover:shadow-xl hover:shadow-primary/[0.04]">
      <div>
        {/* Card Header: Name, Health, Verification */}
        <CardHeader className="p-4 pb-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                {getVerificationBadge()}
              </div>

              {tool.primary_task && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Layers className="size-3 text-primary" />
                  <span className="font-medium text-foreground/85">{tool.primary_task}</span>
                </div>
              )}
            </div>

            {/* Health Telemetry Beacon */}
            <div className="shrink-0 flex flex-col items-end gap-1">
              <HealthBadge
                status={tool.health_status}
                latencyMs={tool.latency_ms ?? 190}
                httpStatus={tool.http_status ?? 200}
                showDetails
              />
              <span className="text-[10px] text-muted-foreground/70 font-mono">
                Probe: {formatLastVerified(tool.last_verified_at)}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </CardHeader>

        {/* Card Body: Capabilities & Match Signals */}
        <CardContent className="p-4 pt-0 space-y-3">
          {/* Capabilities Tags */}
          {tool.capabilities && tool.capabilities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tool.capabilities.slice(0, 4).map((cap, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] bg-secondary/70 text-secondary-foreground font-medium"
                >
                  {cap}
                </span>
              ))}
            </div>
          )}

          {/* Pricing & Ratings Row */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40 text-muted-foreground">
            <span className="font-medium text-foreground/90">{getPricingLabel()}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-amber-400 font-semibold text-xs">
                <Star className="size-3 fill-amber-400" />
                <span>{tool.average_rating.toFixed(2)}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  ({tool.review_count})
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {tool.save_count?.toLocaleString()} saves
              </span>
            </div>
          </div>

          {/* Evidence Explanation Accordion */}
          {reasons && reasons.length > 0 && (
            <div className="rounded-lg bg-primary/[0.04] border border-primary/15 p-2 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-primary font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="size-3" /> Match Confidence:{" "}
                  {Math.round(relevanceScore * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-[10px] text-muted-foreground hover:text-primary transition-colors underline"
                >
                  {showExplanation ? "Hide Details" : "Why this matched"}
                </button>
              </div>
              {showExplanation && (
                <ul className="space-y-1 pt-1 text-muted-foreground">
                  {reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Card Footer: Action CTAs */}
      <CardFooter className="p-4 pt-2 border-t border-border/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {/* Save Action */}
          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-8 rounded-lg",
                    isSaved
                      ? "text-primary hover:text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={handleSaveToggle}
                >
                  {isSaved ? (
                    <BookmarkCheck className="size-4 fill-primary text-primary" />
                  ) : (
                    <Bookmark className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {isSaved ? "Saved" : "Save Tool"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Compare Action */}
          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-8 rounded-lg",
                    isComparing
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => onCompare?.(tool)}
                >
                  <Scale className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Compare AI Models
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* External Visit Button */}
        <Button
          size="sm"
          className="h-8 px-3 rounded-lg text-xs gap-1.5 font-semibold bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground transition-all"
          asChild
        >
          <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
            <span>Open Tool</span>
            <ExternalLink className="size-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
