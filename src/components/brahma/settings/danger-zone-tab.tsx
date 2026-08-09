import { AlertTriangle, Download, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { TypedConfirmDialog } from "@/components/brahma/typed-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { workspace } from "@/lib/settings-data";

export function DangerZoneTab() {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dialog, setDialog] = useState<null | "export" | "reset" | "delete">(null);

  const runExport = () => {
    setExporting(true);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setExporting(false);
          toast.success("Export ready — download link sent to your email");
          return 100;
        }
        return p + 20;
      });
    }, 400);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-[var(--critical)]/30 bg-[var(--critical)]/8 px-4 py-3 text-sm">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--critical)]" aria-hidden />
        <p className="text-muted-foreground">These actions cannot be undone.</p>
      </div>

      <Card className="surface border-[var(--critical)]/30">
        <CardContent className="divide-y divide-border px-5">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Export all project data</p>
              <p className="text-sm text-muted-foreground">
                Blueprints, requirements, findings and reports as JSON + ZIP.
              </p>
              {exporting ? (
                <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : null}
            </div>
            <Button variant="outline" disabled={exporting} onClick={() => setDialog("export")}>
              {exporting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Download className="size-4" aria-hidden />}
              Export data
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Reset workspace settings</p>
              <p className="text-sm text-muted-foreground">
                Restores default analysis profile, notifications and appearance. Projects are kept.
              </p>
            </div>
            <Button variant="outline" onClick={() => setDialog("reset")}>
              <RotateCcw className="size-4" aria-hidden /> Reset settings
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Delete workspace</p>
              <p className="text-sm text-muted-foreground">
                Permanently removes all projects, analyses and reports for every member.
              </p>
            </div>
            <Button variant="destructive" onClick={() => setDialog("delete")}>
              <Trash2 className="size-4" aria-hidden /> Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>

      <TypedConfirmDialog
        open={dialog === "export"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="Export all project data"
        description="The archive contains requirements, findings and business mappings for every project. Type EXPORT to start the job."
        confirmWord="EXPORT"
        confirmLabel="Start export"
        onConfirm={runExport}
      />
      <TypedConfirmDialog
        open={dialog === "reset"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="Reset workspace settings"
        description="All workspace preferences return to BRAHMA defaults. Type RESET to confirm."
        confirmWord="RESET"
        confirmLabel="Reset settings"
        onConfirm={() => toast.success("Workspace settings reset to defaults")}
      />
      <TypedConfirmDialog
        open={dialog === "delete"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="Delete workspace"
        description={`This deletes every project and report in ${workspace.name}. Type the workspace name to confirm.`}
        confirmWord={workspace.name}
        confirmLabel="Delete workspace"
        onConfirm={() => toast.success("Workspace deletion scheduled — 24 hour grace period")}
      />
    </div>
  );
}
