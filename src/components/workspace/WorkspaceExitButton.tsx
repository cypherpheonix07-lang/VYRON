/**
 * PROJECT VYRON / BRAHMA — WORKSPACE EXIT BUTTON
 * Visible Exit control fulfilling Workstreams A (A03, A04) and C (C01).
 * Inspects change registry before navigating.
 * - If clean: routes directly to /app/exit without dialog.
 * - If dirty: triggers WorkspaceExitDialog with affected sections.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, ArrowRightFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  workspaceChangeRegistry,
  type DirtySectionDetail,
} from "@/services/workspace/workspaceChangeRegistry";
import { workspaceExitCoordinator } from "@/services/workspace/workspaceExitCoordinator";
import { cn } from "@/lib/utils";

export interface WorkspaceExitButtonProps {
  projectId?: string | undefined;
  projectName?: string | undefined;
  className?: string | undefined;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "icon";
  showLabel?: boolean;
}

export function WorkspaceExitButton({
  projectId,
  projectName,
  className,
  variant = "ghost",
  size = "sm",
  showLabel = true,
}: WorkspaceExitButtonProps) {
  const navigate = useNavigate();
  const [dirtySections, setDirtySections] = useState<DirtySectionDetail[]>(() =>
    workspaceChangeRegistry.getDirtySections(projectId),
  );

  useEffect(() => {
    const updateDirty = () => {
      setDirtySections(workspaceChangeRegistry.getDirtySections(projectId));
    };

    updateDirty();
    return workspaceChangeRegistry.subscribe(updateDirty);
  }, [projectId]);

  const hasUnsaved = dirtySections.length > 0;

  const handleExitClick = async () => {
    await workspaceExitCoordinator.requestExit({
      projectId,
      projectName,
      navigate: (to) => navigate({ to }),
    });
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleExitClick}
      title={hasUnsaved ? `Exit Workspace (${dirtySections.length} unsaved changes)` : "Exit Workspace"}
      aria-label="Exit Workspace"
      className={cn(
        "relative gap-1.5 h-8 text-xs font-medium transition-colors",
        hasUnsaved
          ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border-amber-500/30"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <ArrowRightFromLine className="size-3.5 shrink-0" aria-hidden="true" />
      {showLabel && <span>Exit</span>}
      {hasUnsaved && (
        <span
          className="size-2 rounded-full bg-amber-400 animate-pulse ring-2 ring-background"
          aria-label="Unsaved changes pending"
        />
      )}
    </Button>
  );
}
