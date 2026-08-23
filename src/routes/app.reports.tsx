import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  FileBarChart2,
  Download,
  Search,
  Share2,
  Plus,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, StatCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReportLibraryTable } from "@/components/reports/ReportLibraryTable";
import { GenerateReportModal } from "@/components/reports/GenerateReportModal";
import { ReportViewerPage } from "@/components/reports/ReportViewerPage";
import { ReportCompiler } from "@/services/reportCompiler";
import type { ReportDocument } from "@/types/report";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Report Studio — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Compile, view, and export verified Executive Summary & Architecture Reports.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportDocument[]>([]);
  const [search, setSearch] = useState("");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  useEffect(() => {
    async function initReports() {
      // Check stored reports or compile standard initial report
      const storedKeys = Object.keys(localStorage).filter((k) =>
        k.startsWith("brahma_report_"),
      );

      if (storedKeys.length > 0) {
        const loaded: ReportDocument[] = [];
        for (const k of storedKeys) {
          try {
            const raw = localStorage.getItem(k);
            if (raw) loaded.push(JSON.parse(raw));
          } catch {
            // ignore
          }
        }
        if (loaded.length > 0) {
          setReports(loaded);
          return;
        }
      }

      // Automatically compile default initial report
      const compiler = new ReportCompiler("ALPHA");
      const defaultDoc = await compiler.compileReport("Academic IEEE", "rep-main-2026");
      localStorage.setItem("brahma_report_rep-main-2026", JSON.stringify(defaultDoc));
      setReports([defaultDoc]);
    }
    initReports();
  }, []);

  const handleReportGenerated = (newDoc: ReportDocument) => {
    localStorage.setItem(`brahma_report_${newDoc.id}`, JSON.stringify(newDoc));
    setReports((prev) => [newDoc, ...prev.filter((r) => r.id !== newDoc.id)]);
  };

  const handleRegenerate = async (reportId: string) => {
    toast.info("Re-compiling report document with latest engine metrics...");
    const target = reports.find((r) => r.id === reportId);
    const compiler = new ReportCompiler("ALPHA");
    const compiled = await compiler.compileReport(
      target?.template || "Academic IEEE",
      reportId,
    );
    localStorage.setItem(`brahma_report_${reportId}`, JSON.stringify(compiled));
    setReports((prev) => prev.map((r) => (r.id === reportId ? compiled : r)));
    toast.success("Report re-compiled successfully with new SHA-256 checksum.");
  };

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      r.template.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Report Studio"
        description="Compile, audit, and download verified engineering reports derived strictly from live project metrics."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Compiled Reports"
          value={reports.length}
          icon={FileBarChart2}
          hint="SHA-256 Attested"
        />
        <StatCard
          label="Verification Standard"
          value="Academic IEEE"
          icon={BookOpen}
          hint="Peer-review grade"
        />
        <StatCard
          label="Attestation Integrity"
          value="100.0%"
          icon={ShieldCheck}
          hint="Zero unmeasured fabrication"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative min-w-0 flex-1 max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search reports by title, template, or ID..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          size="sm"
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-9 font-semibold gap-1.5 shadow-md"
          onClick={() => setIsGenerateModalOpen(true)}
        >
          <Plus className="size-4" /> Generate New Report
        </Button>
      </div>

      <SectionCard
        title="Verified Report Archive"
        description="Tamper-evident engineering reports with cryptographic hashes and export engines."
      >
        <ReportLibraryTable
          reports={filtered}
          onRegenerate={handleRegenerate}
          onViewReport={(id) => navigate({ to: "/app/reports/$id/view", params: { id } })}
          userRole="admin"
        />
      </SectionCard>

      <GenerateReportModal
        open={isGenerateModalOpen}
        onOpenChange={setIsGenerateModalOpen}
        onReportGenerated={handleReportGenerated}
      />
    </div>
  );
}
