import React from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FormSubmissionRow, FormStatus } from "@/lib/db/types";

export interface FormStatusTrackerProps {
  form: FormSubmissionRow | null;
  formTypeTitle: string;
  onOpenForm: () => void;
  onRefresh?: () => void;
}

export function FormStatusTracker({
  form,
  formTypeTitle,
  onOpenForm,
  onRefresh,
}: FormStatusTrackerProps) {
  const status: FormStatus = form?.status || "draft";

  const renderStatusDetails = () => {
    switch (status) {
      case "approved":
        return {
          badge: (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 text-xs">
              <CheckCircle className="h-3.5 w-3.5" />
              Verified & Approved
            </Badge>
          ),
          icon: ShieldCheck,
          iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          title: "Official Verification Granted",
          description:
            form?.admin_remarks ||
            "Your profile credentials and enrollment details have been officially approved by the platform administration.",
          actionText: "View Approved Submission",
          actionVariant: "outline" as const,
        };

      case "rejected":
        return {
          badge: (
            <Badge className="bg-red-500/10 text-red-400 border-red-500/30 gap-1 text-xs">
              <XCircle className="h-3.5 w-3.5" />
              Revision Required
            </Badge>
          ),
          icon: AlertTriangle,
          iconColor: "text-red-400 bg-red-500/10 border-red-500/30",
          title: "Form Submission Rejected / Needs Edits",
          description:
            form?.admin_remarks ||
            "The administrator requested revisions to your submitted documentation. Please review comments and resubmit.",
          actionText: "Update & Resubmit Form",
          actionVariant: "default" as const,
        };

      case "submitted":
        return {
          badge: (
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 gap-1 text-xs">
              <Clock className="h-3.5 w-3.5 animate-spin" />
              Under Review
            </Badge>
          ),
          icon: Clock,
          iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
          title: "Awaiting Administrative Review",
          description:
            "Your form has been safely received by the administrative control plane. You will receive real-time notification once approved.",
          actionText: "View Current Submission",
          actionVariant: "outline" as const,
        };

      case "draft":
      default:
        return {
          badge: (
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 text-xs">
              <AlertTriangle className="h-3.5 w-3.5" />
              Form Pending
            </Badge>
          ),
          icon: FileText,
          iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          title: `${formTypeTitle} Required`,
          description:
            "Submit your official verification form to unlock institutional credentials, review approvals, and portfolio verification badges.",
          actionText: "Complete & Submit Form",
          actionVariant: "default" as const,
        };
    }
  };

  const details = renderStatusDetails();
  const Icon = details.icon;

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        status === "approved"
          ? "border-emerald-500/30 bg-emerald-950/10"
          : status === "rejected"
          ? "border-red-500/30 bg-red-950/10"
          : status === "submitted"
          ? "border-blue-500/30 bg-blue-950/10"
          : "border-amber-500/30 bg-amber-950/10"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`h-10 w-10 rounded-lg border flex items-center justify-center shrink-0 ${details.iconColor}`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm text-foreground">
                {details.title}
              </h3>
              {details.badge}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              {details.description}
            </p>

            {form?.submitted_at && (
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                <span>
                  Submitted: {new Date(form.submitted_at).toLocaleDateString()} at{" "}
                  {new Date(form.submitted_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {form.reviewed_at && (
                  <span>
                    Reviewed: {new Date(form.reviewed_at).toLocaleDateString()}
                  </span>
                )}
                {form.id && (
                  <span className="font-mono text-[10px] text-zinc-500">
                    ID: {form.id.slice(0, 8)}...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Refresh status"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button
            variant={details.actionVariant}
            size="sm"
            onClick={onOpenForm}
            className={`text-xs h-8 gap-1.5 ${
              status === "draft" || status === "rejected"
                ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                : "border-border/60 hover:bg-zinc-900"
            }`}
          >
            {status === "draft" ? <Send className="h-3 w-3" /> : null}
            <span>{details.actionText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
