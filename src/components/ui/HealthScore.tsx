import React from "react";
import { cn } from "@/lib/utils";

export interface HealthScoreProps {
  score: number;
  targetScore?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function HealthScore({
  score,
  targetScore,
  size = "md",
  showLabel = false,
  className,
}: HealthScoreProps) {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  const targetNormalized =
    targetScore !== undefined ? Math.max(0, Math.min(100, Math.round(targetScore))) : undefined;

  // Radius and stroke calculations
  const dimensions = {
    sm: { size: 36, stroke: 3, text: "text-xs font-bold" },
    md: { size: 54, stroke: 4, text: "text-sm font-extrabold" },
    lg: { size: 84, stroke: 6, text: "text-2xl font-black" },
  }[size];

  const radius = (dimensions.size - dimensions.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;
  const targetOffset =
    targetNormalized !== undefined
      ? circumference - (targetNormalized / 100) * circumference
      : undefined;

  const colorClass =
    normalized >= 75
      ? "text-emerald-400 stroke-emerald-500"
      : normalized >= 50
        ? "text-amber-400 stroke-amber-500"
        : "text-rose-400 stroke-rose-500";

  return (
    <div className={cn("inline-flex flex-col items-center justify-center gap-1", className)}>
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: dimensions.size, height: dimensions.size }}
      >
        <svg className="rotate-[-90deg]" width={dimensions.size} height={dimensions.size}>
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            className="stroke-border/40 fill-none"
            strokeWidth={dimensions.stroke}
          />
          {/* Target marker indicator */}
          {targetNormalized !== undefined && targetOffset !== undefined && (
            <circle
              cx={dimensions.size / 2}
              cy={dimensions.size / 2}
              r={radius}
              className="fill-none stroke-cyan-400/80"
              strokeWidth={dimensions.stroke + 3}
              strokeDasharray={`3 ${circumference}`}
              strokeDashoffset={targetOffset}
              strokeLinecap="round"
            />
          )}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            className={cn("fill-none transition-all duration-700 ease-out", colorClass)}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className={cn("absolute font-mono", dimensions.text, colorClass)}>{normalized}</span>
      </div>
      {showLabel && (
        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1">
          <span>Health</span>
          {targetNormalized !== undefined && (
            <span className="text-[9px] text-cyan-400 font-mono tracking-normal">
              (&ge;{targetNormalized})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
