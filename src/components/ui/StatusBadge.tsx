import React, { type ReactNode } from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusVariant = "pass" | "fail" | "pending" | "warning" | "info" | "success" | "danger";

export interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatusBadge({ status, label, icon, className }: StatusBadgeProps) {
  const styles: Record<
    StatusVariant,
    { bg: string; text: string; border: string; defaultIcon: ReactNode; defaultLabel: string }
  > = {
    pass: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      defaultIcon: <CheckCircle2 className="size-3" />,
      defaultLabel: "Passed",
    },
    success: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      defaultIcon: <CheckCircle2 className="size-3" />,
      defaultLabel: "Success",
    },
    fail: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      defaultIcon: <XCircle className="size-3" />,
      defaultLabel: "Failed",
    },
    danger: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      defaultIcon: <XCircle className="size-3" />,
      defaultLabel: "Danger",
    },
    warning: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      defaultIcon: <AlertTriangle className="size-3" />,
      defaultLabel: "Warning",
    },
    pending: {
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      border: "border-sky-500/30",
      defaultIcon: <Clock className="size-3" />,
      defaultLabel: "Pending",
    },
    info: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      defaultIcon: <Info className="size-3" />,
      defaultLabel: "Info",
    },
  };

  const current = styles[status] || styles.info;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border font-mono tracking-tight shadow-sm",
        current.bg,
        current.text,
        current.border,
        className,
      )}
    >
      {icon ?? current.defaultIcon}
      <span>{label || current.defaultLabel}</span>
    </span>
  );
}
