import { Link, createFileRoute } from "@tanstack/react-router";
import { FileBarChart2, Download, Search, Share2, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateReportPdf } from "@/lib/api";

import { PageHeader, SectionCard, StatCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Platform Reports — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Executive PDF blueprints, security audits, and risk assessment exports.",
      },
    ],
  }),
  component: ReportsPage,
});

const mockReports = [
  {
    id: "rep-1",
    name: "Aurora Payments Security Audit",
    type: "Security Scan",
    date: "2026-08-07",
    status: "Ready",
    size: "2.4 MB",
  },
  {
    id: "rep-2",
    name: "MediSync Requirement Clarity Mapping",
    type: "Requirement Spec",
    date: "2026-08-05",
    status: "Ready",
    size: "1.8 MB",
  },
  {
    id: "rep-3",
    name: "Smart Campus Risk & Business Impact",
    type: "Executive Summary",
    date: "2026-08-02",
    status: "Ready",
    size: "4.1 MB",
  },
];

function ReportsPage() {
  const [reports] = useState(mockReports);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  const filtered = reports.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDownload = async (item: (typeof mockReports)[0]) => {
    setDownloading(item.id);
    toast.info(`Compiling report ${item.name}...`);

    let requirements = null;
    let securityIssues = null;
    let complexitySummary = null;
    let healthScore = 95;

    try {
      const storedReqs = localStorage.getItem("brahma_last_generated_requirements");
      if (storedReqs) {
        requirements = JSON.parse(storedReqs);
      }

      const storedRepo = localStorage.getItem("brahma_last_repo_analysis");
      if (storedRepo) {
        const repoData = JSON.parse(storedRepo);
        securityIssues = [
          ...(repoData.security_findings || []),
          ...(repoData.eslint_findings || []),
          ...(repoData.semgrep_findings || []),
        ];
        complexitySummary = {
          file_count: repoData.complexity?.length || 0,
          avg_complexity: repoData.complexity?.length
            ? repoData.complexity.reduce(
                (sum: number, x: { avg_complexity: number }) => sum + x.avg_complexity,
                0,
              ) / repoData.complexity.length
            : 0,
        };
        healthScore = repoData.overall_health_score || 95;
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const pdfBlob = await generateReportPdf(item.id, {
        title: item.name,
        description: `This PDF report details the structural requirements decomposition and quality health score vector for ${item.name}.`,
        health_score: healthScore,
        requirements,
        security_issues: securityIssues || [],
        complexity_summary: complexitySummary,
      });

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${item.name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded ${item.name} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("PDF generation failed. Real engine backend may be down.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Reports"
        description="Download and share compiled analysis reports, security audits, and requirements mappings."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total reports" value={reports.length} icon={FileBarChart2} />
        <StatCard label="Shared reports" value="2" icon={Share2} hint="External link enabled" />
        <StatCard label="Draft reports" value="0" icon={FileBarChart2} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative min-w-0 flex-1 max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search reports by project name..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          size="sm"
          className="bg-primary text-primary-foreground text-xs h-9"
          onClick={() => toast.info("Report generation started.")}
        >
          <Plus className="mr-1.5 size-4" /> Create Report
        </Button>
      </div>

      <SectionCard
        title="Generated Archives"
        description="Immutable records of workspace analysis snapshots."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Title</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Generation Date</TableHead>
              <TableHead>Archive Size</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-xs font-semibold text-foreground">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[9px]">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.date}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.size}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={downloading === item.id}
                    className="h-7 w-7 text-primary"
                    onClick={() => handleDownload(item)}
                    aria-label="Download report"
                  >
                    {downloading === item.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
