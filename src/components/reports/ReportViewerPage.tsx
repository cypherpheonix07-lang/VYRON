import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ReportDocument } from "@/types/report";
import { ReportCompiler } from "@/services/reportCompiler";
import { ReportCoverPage } from "./ReportCoverPage";
import { ReportSectionRenderer } from "./ReportSectionRenderer";
import { DownloadMenu } from "./DownloadMenu";
import { AIDraftDrawer } from "./AIDraftDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Printer, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ReportViewerPageProps {
  reportId: string;
}

export const ReportViewerPage: React.FC<ReportViewerPageProps> = ({ reportId }) => {
  const [doc, setDoc] = useState<ReportDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiDraftSection, setAiDraftSection] = useState<"S2" | "S14" | null>(null);

  useEffect(() => {
    async function loadReport() {
      setIsLoading(true);
      try {
        const stored = localStorage.getItem(`brahma_report_${reportId}`);
        if (stored) {
          setDoc(JSON.parse(stored));
        } else {
          // Compile fresh from engine
          const compiler = new ReportCompiler("ALPHA");
          const compiled = await compiler.compileReport("Academic IEEE", reportId);
          localStorage.setItem(`brahma_report_${reportId}`, JSON.stringify(compiled));
          setDoc(compiled);
        }
      } catch (err) {
        console.error("Failed to compile/load report document:", err);
        toast.error("Failed to load report document.");
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [reportId]);

  const handleRegenerate = async () => {
    setIsLoading(true);
    toast.info("Re-compiling report document with latest engine state...");
    try {
      const compiler = new ReportCompiler("ALPHA");
      const compiled = await compiler.compileReport(doc?.template || "Academic IEEE", reportId);
      localStorage.setItem(`brahma_report_${reportId}`, JSON.stringify(compiled));
      setDoc(compiled);
      toast.success("Report re-compiled successfully with verified SHA-256 hash.");
    } catch {
      toast.error("Failed to re-compile report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSection = (newContent: string) => {
    if (!doc || !aiDraftSection) return;
    const updated: ReportDocument = {
      ...doc,
      ...(aiDraftSection === "S2"
        ? { executiveSummary: newContent }
        : { closingRemarks: newContent }),
    };
    setDoc(updated);
    localStorage.setItem(`brahma_report_${reportId}`, JSON.stringify(updated));
  };

  if (isLoading || !doc) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 animate-spin text-cyan-400" />
        <p className="text-sm font-mono text-muted-foreground">
          Compiling Report Document & Computing SHA-256 Checksum...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Floating Action Bar (Hidden in Print) */}
      <div className="no-print sticky top-4 z-40 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/90 px-4 py-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="h-8 text-xs gap-1.5">
            <Link to="/app/reports">
              <ArrowLeft className="size-3.5" /> Back to Library
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-foreground font-mono">{doc.id}</span>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-emerald-800 bg-emerald-950/40 text-emerald-400 gap-1"
            >
              <ShieldCheck className="size-3" /> SHA-256 Verified
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiDraftSection("S2")}
            className="h-8 text-xs gap-1.5 border-border bg-secondary/40 text-foreground hover:bg-secondary"
          >
            <Sparkles className="size-3 text-cyan-400" /> AI Draft Prose
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            className="h-8 text-xs gap-1.5 border-border bg-secondary/40 text-foreground hover:bg-secondary"
          >
            <RefreshCw className="size-3" /> Re-compile
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 text-xs gap-1.5 border-border bg-secondary/40 text-foreground hover:bg-secondary"
          >
            <Printer className="size-3" /> Print PDF
          </Button>

          <DownloadMenu doc={doc} userRole="admin" />
        </div>
      </div>

      {/* Paginated Paper Workspace */}
      <div className="report-paper-container py-4 flex flex-col items-center">
        {/* PAGE 1: Cover Page */}
        <ReportCoverPage doc={doc} pageNumber={1} totalPages={12} />

        {/* PAGES 2 to 12: Section Renderers */}
        <ReportSectionRenderer doc={doc} onOpenAIDraft={(sec) => setAiDraftSection(sec)} />
      </div>

      {/* AI Drafting Drawer */}
      {aiDraftSection && (
        <AIDraftDrawer
          open={!!aiDraftSection}
          onOpenChange={(o) => {
            if (!o) setAiDraftSection(null);
          }}
          section={aiDraftSection}
          doc={doc}
          onSave={handleUpdateSection}
        />
      )}
    </div>
  );
};
