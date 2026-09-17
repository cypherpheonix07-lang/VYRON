/**
 * VYRON — ACTION PREVIEW & AUTHORIZATION MODAL (GOD MODE vNEXT)
 * Directives: 976-985, 1328-1340, 1341-1350, 1489-1499
 *
 * Enforces mandatory Human-in-the-Loop authorization plane for consequential actions:
 * PROPOSE -> PREVIEW -> IMPACT ANALYSIS -> AUTHORIZE -> EXECUTE -> VERIFY.
 *
 * Strictly ZERO SQL.
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Hash,
  Activity,
  Check,
  X,
  Zap,
} from "lucide-react";
import { ActionPreviewPayload, connectorFabric } from "@/services/connectors/connectorFabric";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ActionPreviewModalProps {
  preview: ActionPreviewPayload | null;
  onClose: () => void;
  onAuthorized?: (result: { success: boolean; verificationHash: string }) => void;
}

export function ActionPreviewModal({
  preview,
  onClose,
  onAuthorized,
}: ActionPreviewModalProps) {
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!preview) return null;

  const handleAuthorize = async () => {
    setIsAuthorizing(true);
    toast.loading(`Authorizing and executing: ${preview.operation}...`, { id: "auth-exec" });
    try {
      const res = await connectorFabric.executeAuthorizedAction(preview.actionId);
      toast.dismiss("auth-exec");
      toast.success(res.message);
      if (onAuthorized) {
        onAuthorized({ success: res.success, verificationHash: res.verificationHash });
      }
      onClose();
    } catch (err: unknown) {
      toast.dismiss("auth-exec");
      toast.error(`Authorization failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <Dialog open={Boolean(preview)} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 bg-card/95 backdrop-blur-2xl border border-amber-500/40 shadow-2xl rounded-2xl overflow-hidden font-sans">
        <DialogHeader className="p-4 sm:p-5 border-b border-border/50 bg-amber-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Action Authorization & Impact Preview
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Consequential external mutation staged with verified idempotency key.
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-amber-500/40 text-amber-300 bg-amber-500/20"
            >
              {preview.riskLevel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-5 space-y-3.5 text-xs font-mono">
          {/* Operation & Target */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-secondary/40 border border-border/50">
            <div>
              <span className="text-[10px] text-muted-foreground block">Operation:</span>
              <span className="font-bold text-foreground text-xs">{preview.operation}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">Target Service:</span>
              <span className="font-bold text-primary text-xs">{preview.targetService}</span>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Connector:</span>
              <span className="text-foreground">{preview.connectorId}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Tool Invoked:</span>
              <span className="text-foreground">{preview.toolName}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Data Affected:</span>
              <span className="text-foreground">{preview.dataAffected}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Rollback Possibility:</span>
              <span className={preview.rollbackPossibility ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {preview.rollbackPossibility ? "YES (Reversible)" : "NO (Permanent External State)"}
              </span>
            </div>
          </div>

          {/* Idempotency Key */}
          <div className="p-2.5 rounded-xl bg-background/50 border border-border/40 space-y-1">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Hash className="size-2.5" />
              <span>Idempotency Key (Duplicate Mutation Defense):</span>
            </span>
            <p className="text-[10px] text-primary break-all select-all font-mono">
              {preview.idempotencyKey}
            </p>
          </div>

          {/* Parameters Payload */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Execution Parameters:
            </span>
            <pre className="p-2.5 rounded-xl bg-background/60 border border-border/40 text-[10px] overflow-x-auto text-foreground/80 max-h-28">
              {JSON.stringify(preview.parameters, null, 2)}
            </pre>
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/40">
            <Button
              size="sm"
              variant="outline"
              disabled={isAuthorizing}
              onClick={onClose}
              className="h-8 text-xs font-mono"
            >
              <X className="size-3.5 mr-1" />
              <span>Cancel / Deny</span>
            </Button>
            <Button
              size="sm"
              disabled={isAuthorizing}
              onClick={handleAuthorize}
              className="h-8 text-xs font-mono font-bold bg-amber-500 hover:bg-amber-600 text-amber-950 gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Check className="size-3.5" />
              <span>{isAuthorizing ? "Executing..." : "Authorize & Execute"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
