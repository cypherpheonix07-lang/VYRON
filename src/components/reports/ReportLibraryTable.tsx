import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadMenu } from "./DownloadMenu";
import { Eye, Share2, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { ReportDocument } from "@/types/report";

interface ReportLibraryTableProps {
  reports: ReportDocument[];
  onRegenerate: (reportId: string) => void;
  onViewReport?: (reportId: string) => void;
  userRole?: string;
}

export const ReportLibraryTable: React.FC<ReportLibraryTableProps> = ({
  reports,
  onRegenerate,
  onViewReport,
  userRole = "admin",
}) => {
  const isReviewer = userRole.toLowerCase() === "reviewer";

  const handleShare = (rep: ReportDocument) => {
    const url = `${window.location.origin}/app/reports/${rep.id}/view`;
    navigator.clipboard.writeText(url);
    toast.success("Secure report link copied to clipboard (Expires in 7 days).");
  };

  const handleRegenerateClick = (id: string) => {
    if (isReviewer) {
      toast.error("Reviewer Access Restricted: Modification and regeneration denied.");
      return;
    }
    onRegenerate(id);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">Attestation</TableHead>
            <TableHead>Report Name & Target</TableHead>
            <TableHead>Template Format</TableHead>
            <TableHead>Verification Hash (SHA-256)</TableHead>
            <TableHead>Generated At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                No reports compiled yet. Click "Generate Report" above to compile the live dataset.
              </TableCell>
            </TableRow>
          ) : (
            reports.map((rep) => (
              <TableRow key={rep.id} className="hover:bg-muted/40 transition-colors">
                <TableCell>
                  <ShieldCheck className="size-4 text-emerald-400" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-xs">{rep.title}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-xs">
                      {rep.subtitle}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-mono border-border bg-secondary/50">
                    {rep.template}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/80 truncate block max-w-[120px]" title={rep.chainOfCustody.hashSha256}>
                    {rep.chainOfCustody.hashSha256.slice(0, 12)}...
                  </span>
                </TableCell>
                <TableCell className="text-[11px] text-muted-foreground font-mono">
                  {new Date(rep.generatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-emerald-950/40 text-emerald-400 border-emerald-800 text-[10px] font-bold"
                  >
                    READY (SIGNED)
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    {onViewReport ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewReport(rep.id)}
                        className="h-7 text-xs px-2.5 gap-1 text-foreground hover:text-cyan-400"
                      >
                        <Eye className="size-3.5" /> View
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-7 text-xs px-2.5 gap-1 text-foreground hover:text-cyan-400"
                      >
                        <Link to="/app/reports/$id/view" params={{ id: rep.id }}>
                          <Eye className="size-3.5" /> View
                        </Link>
                      </Button>
                    )}

                    <DownloadMenu doc={rep} userRole={userRole} />

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(rep)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      title="Share link"
                    >
                      <Share2 className="size-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerateClick(rep.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      title="Regenerate"
                    >
                      <RefreshCw className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
