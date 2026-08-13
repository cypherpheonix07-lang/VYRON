import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  Search,
  Filter,
  FileCode,
  FileText,
  FileSpreadsheet,
  Layers,
  Database,
  Trash2,
  ExternalLink,
  Loader2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/app/exports")({
  head: () => ({
    meta: [
      { title: "Export Center — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Download system blueprints, OpenAPI documentation, and audit records.",
      },
    ],
  }),
  component: ExportCenterPage,
});

interface ExportArtifact {
  id: string;
  name: string;
  project: string;
  type: "Blueprint" | "Report" | "Schema" | "API Docs" | "Test Plan";
  format: "JSON" | "PDF" | "CSV" | "Markdown" | "OpenAPI";
  size: string;
  expiryDate: string;
  status: "Completed" | "Generating" | "Expired" | "Failed";
}

const initialArtifacts: ExportArtifact[] = [
  {
    id: "art-1",
    name: "Aurora Payments Gateway Blueprint Spec",
    project: "Aurora Payments",
    type: "Blueprint",
    format: "JSON",
    size: "442 KB",
    expiryDate: "Expires in 12 days",
    status: "Completed",
  },
  {
    id: "art-2",
    name: "MediSync Customer Database Schema",
    project: "MediSync",
    type: "Schema",
    format: "CSV",
    size: "84 KB",
    expiryDate: "Expires in 4 days",
    status: "Completed",
  },
  {
    id: "art-3",
    name: "Smart Campus Security Audit Report",
    project: "Smart Campus",
    type: "Report",
    format: "PDF",
    size: "3.2 MB",
    expiryDate: "Never expires",
    status: "Completed",
  },
  {
    id: "art-4",
    name: "AI Attendance System OpenAPI Spec",
    project: "AI Attendance",
    type: "API Docs",
    format: "OpenAPI",
    size: "128 KB",
    expiryDate: "Generating...",
    status: "Generating",
  },
  {
    id: "art-5",
    name: "Hospital Booking System Test Strategy",
    project: "Hospital Booking",
    type: "Test Plan",
    format: "Markdown",
    size: "0 KB",
    expiryDate: "Expired",
    status: "Expired",
  },
];

function ExportCenterPage() {
  const [artifacts, setArtifacts] = useState<ExportArtifact[]>(initialArtifacts);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleDownload = (art: ExportArtifact) => {
    if (art.status === "Expired") {
      toast.error("Artifact expired", {
        description: "This temporary file has expired. Please regenerate it.",
      });
      return;
    }
    toast.success(`Download started: ${art.name}.${art.format.toLowerCase()}`);
  };

  const handleRegenerate = (id: string) => {
    setGeneratingId(id);
    toast.info("Regenerating artifact file payload...");
    setTimeout(() => {
      setArtifacts((prev) =>
        prev.map((art) =>
          art.id === id
            ? { ...art, status: "Completed", size: "256 KB", expiryDate: "Expires in 14 days" }
            : art,
        ),
      );
      setGeneratingId(null);
      toast.success("Artifact regenerated successfully.");
    }, 1500);
  };

  const filtered = artifacts.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.project.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Export Center"
        description="Unified vault for downloading compiled architectural blueprints, schema specifications, and PDF reports."
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Blueprint", "Report", "Schema", "API Docs", "Test Plan"].map((t) => (
            <Button
              key={t}
              size="sm"
              variant={typeFilter === t ? "default" : "outline"}
              className="h-7 text-[10px] font-semibold"
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </Button>
          ))}
        </div>

        <div className="relative min-w-0 max-w-xs flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search exports..."
            className="pl-9 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <SectionCard
        title="Workspace Outputs Library"
        description="Temporary download payloads and specifications."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artifact Name</TableHead>
              <TableHead>Project Scope</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Payload Size</TableHead>
              <TableHead>Retention / Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.name}</p>
                    <p className="text-[9px] text-muted-foreground font-mono mt-0.5 uppercase">
                      Format: {item.format}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.project}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[9px] font-mono">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {item.size}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2.5">
                  <Calendar className="size-3.5" /> {item.expiryDate}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] px-2 rounded-full",
                      item.status === "Completed" &&
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      item.status === "Generating" &&
                        "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                      item.status === "Expired" &&
                        "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
                      item.status === "Failed" && "bg-red-500/10 text-red-400 border-red-500/20",
                    )}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.status === "Completed" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-primary"
                      onClick={() => handleDownload(item)}
                      aria-label="Download artifact"
                    >
                      <Download className="size-4" />
                    </Button>
                  ) : item.status === "Generating" ? (
                    <Loader2 className="size-4 animate-spin text-cyan-400" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] text-primary"
                      disabled={generatingId === item.id}
                      onClick={() => handleRegenerate(item.id)}
                    >
                      {generatingId === item.id ? (
                        <Loader2 className="size-3 animate-spin mr-1" />
                      ) : (
                        "Regenerate"
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
