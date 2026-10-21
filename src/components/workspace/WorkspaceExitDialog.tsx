/**
 * PROJECT VYRON / BRAHMA — WORKSPACE EXIT CONFIRMATION DIALOG
 * Accessible confirmation modal conforming to Workstreams H & I:
 * - Clear title: "Save changes before leaving?"
 * - Lists affected sections with non-sensitive summaries
 * - 3 distinct options: Save and exit, Discard changes and exit, Continue working
 * - In-modal error presentation if save fails
 * - Full keyboard accessibility (Focus trap, Enter, Escape, visible contrast)
 */

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  FileEdit,
  Loader2,
  Save,
  Trash2,
  XCircle,
  ShieldAlert,
} from "lucide-react";
import {
  workspaceExitCoordinator,
  type ExitCoordinatorState,
} from "@/services/workspace/workspaceExitCoordinator";

export function WorkspaceExitDialog() {
  const [state, setState] = useState<ExitCoordinatorState>(() =>
    workspaceExitCoordinator.getState(),
  );

  useEffect(() => {
    return workspaceExitCoordinator.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  const isOpen = state.status === "CONFIRMING" || state.status === "SAVING" || state.status === "DISCARDING" || state.status === "ERROR";
  const isSaving = state.status === "SAVING";
  const isDiscarding = state.status === "DISCARDING";
  const hasError = state.status === "ERROR";

  const handleSaveAndExit = async () => {
    await workspaceExitCoordinator.executeSaveAndExit();
  };

  const handleDiscardAndExit = async () => {
    await workspaceExitCoordinator.executeDiscardAndExit();
  };

  const handleContinueWorking = () => {
    workspaceExitCoordinator.cancelExit();
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving && !isDiscarding) {
          handleContinueWorking();
        }
      }}
    >
      <AlertDialogContent
        className="max-w-lg surface border border-border/80 bg-zinc-950 p-6 shadow-2xl rounded-2xl"
        aria-describedby="workspace-exit-desc"
      >
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <AlertTriangle className="size-4" aria-hidden="true" />
            </span>
            <AlertDialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Save changes before leaving?
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription id="workspace-exit-desc" className="text-xs text-muted-foreground leading-relaxed">
            You have unsaved changes in your workspace
            {state.projectName ? ` for ${state.projectName}` : ""}.
            Choose how you would like to proceed before exiting to the exit summary page.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Affected sections list */}
        <div className="my-4 space-y-2 rounded-xl border border-border/70 bg-zinc-900/60 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileEdit className="size-3.5 text-primary" />
              Unsaved Sections ({state.dirtySections.length})
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Pending Sync
            </span>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            {state.dirtySections.map((sec) => (
              <div
                key={sec.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-zinc-950/80 border border-border/40 p-2 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="font-medium text-foreground truncate">{sec.label}</span>
                </div>
                {sec.summary ? (
                  <span className="text-[10px] text-muted-foreground truncate max-w-40 font-mono">
                    {sec.summary}
                  </span>
                ) : (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-500/30 text-amber-400">
                    Unsaved Edits
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save error alert if persistence failed */}
        {hasError && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground"
          >
            <ShieldAlert className="size-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1 min-w-0">
              <p className="font-semibold text-red-300">Persistence Failed</p>
              <p className="text-[11px] text-red-200/90 leading-relaxed">
                {state.error || "Unable to save all sections to storage. Your edits remain intact in the workspace."}
              </p>
            </div>
          </div>
        )}

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          {/* Action 3: Continue working */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSaving || isDiscarding}
            onClick={handleContinueWorking}
            className="text-xs order-3 sm:order-1 hover:bg-zinc-900 text-muted-foreground hover:text-foreground"
          >
            Continue working
          </Button>

          {/* Action 2: Discard changes and exit */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving || isDiscarding}
            onClick={handleDiscardAndExit}
            className="text-xs order-2 sm:order-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
          >
            {isDiscarding ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Discarding...
              </>
            ) : (
              <>
                <Trash2 className="mr-1.5 size-3.5" /> Discard changes & exit
              </>
            )}
          </Button>

          {/* Action 1: Save and exit (Primary) */}
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isSaving || isDiscarding}
            onClick={handleSaveAndExit}
            className="text-xs order-1 sm:order-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 size-3.5" /> Save and exit
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
