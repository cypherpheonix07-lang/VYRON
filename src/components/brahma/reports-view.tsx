import { Download, FileBarChart2, FilePlus2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SectionCard, StatusBadge } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "@tanstack/react-router";
import { generateReportPdf } from "@/lib/api";
import { getProject, reports } from "@/lib/mock-data";

const previewSections = [
  [
    "Executive summary",
    "Health 91/100, security 88/100, delivery risk low. Two critical findings remain open.",
  ],
  [
    "Requirements",
    "24 functional and 11 non-functional requirements extracted at 93% average clarity.",
  ],
  [
    "Architecture",
    "Nine components, five tables, seven API routes; four recommendations pending review.",
  ],
  ["Code health", "Maintainability 78, duplication 4.6%, coverage 67% across 48,213 lines."],
  ["Security", "6 findings: 2 critical, 1 high, 2 medium, 1 low, all with CWE references."],
  ["Risk", "Delivery risk 46/100 with an expected 14-day slip at current velocity."],
  [
    "Business impact",
    "₹18.4L projected rework cost; audit module carries the highest business weight.",
  ],
  ["Recommendations", "Five prioritized actions ordered by business value per engineering hour."],
];

export function ReportsView() {
  const { id } = useParams({ strict: false });
  const project = getProject(id || "brahma-core");
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleGeneratePdf = async () => {
    setGenerating(true);
    try {
      // 1. Load active requirements from localStorage
      let requirements = null;
      try {
        const storedReqs = localStorage.getItem("brahma_last_generated_requirements");
        if (storedReqs) {
          requirements = JSON.parse(storedReqs);
        }
      } catch (e) {
        console.error("Failed to parse stored requirements for PDF", e);
      }

      // 2. Load active security & complexity from localStorage
      let securityIssues = null;
      let complexitySummary = null;
      let healthScore = project.healthScore; // fallback

      try {
        const storedRepo = localStorage.getItem("brahma_last_repo_analysis");
        if (storedRepo) {
          const parsedRepo = JSON.parse(storedRepo);

          // Map backend security findings to format expected by ReportInput
          const allFindings = [
            ...(parsedRepo.security_findings || []),
            ...(parsedRepo.eslint_findings || []),
            ...(parsedRepo.semgrep_findings || []),
          ];
          // Limit findings in the PDF report to the top 100 to prevent ReportLab table calculation hang
          securityIssues = allFindings.slice(0, 100);

          // Calculate complexity summary
          if (parsedRepo.complexity && parsedRepo.complexity.length > 0) {
            const avgComplexity =
              parsedRepo.complexity.reduce(
                (sum: number, c: { avg_complexity: number }) => sum + c.avg_complexity,
                0,
              ) / parsedRepo.complexity.length;
            const totalLines = parsedRepo.complexity.reduce(
              (sum: number, c: { nloc: number }) => sum + c.nloc,
              0,
            );
            complexitySummary = {
              avg_complexity: avgComplexity,
              total_lines: totalLines,
            };
          }

          if (parsedRepo.overall_health_score !== undefined) {
            healthScore = parsedRepo.overall_health_score;
          }
        }
      } catch (e) {
        console.error("Failed to parse stored repo analysis for PDF", e);
      }

      // 3. Call PDF endpoint
      const reportData = {
        title: project.name,
        description: project.description,
        health_score: healthScore,
        requirements,
        security_issues: securityIssues,
        complexity_summary: complexitySummary,
      };

      const pdfBlob = await generateReportPdf(id || "brahma-core", reportData);

      // 4. Download file in browser
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `brahma-report-${id || "brahma-core"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report generated and downloaded successfully", {
        description: `brahma-report-${id || "brahma-core"}.pdf`,
      });
    } catch (err) {
      console.error("Failed to generate PDF", err);
      toast.error("Failed to generate PDF report from backend");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <SectionCard
        title="Generated reports"
        description="Academic, technical and executive outputs built from live analysis data."
        action={
          <Button size="sm" disabled={generating} onClick={handleGeneratePdf}>
            {generating ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden /> Generating…
              </>
            ) : (
              <>
                <FilePlus2 className="size-4" aria-hidden /> Generate report
              </>
            )}
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Pages</TableHead>
                <TableHead className="hidden lg:table-cell">Generated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[240px]">
                    <p className="truncate font-medium">{r.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{r.id}</p>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                    {r.type}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="hidden tabular-nums md:table-cell">
                    {r.pages || "—"}
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground lg:table-cell">
                    {r.generated}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setPreview(true)}>
                        <FileBarChart2 className="size-4" aria-hidden /> Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={r.status !== "Completed"}
                        onClick={handleGeneratePdf}
                      >
                        <Download className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report preview</DialogTitle>
            <DialogDescription>
              Executive Summary — Aurora Payments Gateway, August 2026
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewSections.map(([title, body]) => (
              <section key={title} className="rounded-xl border border-border/70 p-4">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </section>
            ))}
          </div>
          <Button onClick={handleGeneratePdf}>
            <Download className="size-4" aria-hidden /> Download PDF
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
