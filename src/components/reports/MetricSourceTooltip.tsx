import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface MetricSourceTooltipProps {
  value: string | number | null;
  source: string;
  className?: string;
}

export const MetricSourceTooltip: React.FC<MetricSourceTooltipProps> = ({
  value,
  source,
  className = "",
}) => {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex items-center gap-1 cursor-help border-b border-dashed border-slate-400 hover:border-cyan-600 transition-colors ${className}`}
          >
            <span>{value !== null ? value : "—"}</span>
            <Info className="size-3 text-slate-400 hover:text-cyan-600 inline" />
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs bg-slate-900 text-slate-100 text-xs p-2.5 rounded shadow-xl border border-slate-700"
        >
          <p className="font-semibold text-cyan-400 mb-0.5">Metric Source & Explainability</p>
          <p className="text-slate-300 leading-snug">{source}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
