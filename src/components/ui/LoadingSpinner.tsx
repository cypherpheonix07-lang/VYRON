import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading...",
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "size-4",
    md: "size-6",
    lg: "size-10",
  };

  return (
    <div
      className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}
      role="status"
      aria-label={label}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
    </div>
  );
}
