import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, FileText, Code2, FileCode, Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ReportDocument } from "@/types/report";
import {
  exportToMarkdown,
  exportToLatex,
  exportToJson,
  triggerDownload,
} from "@/services/reportCompiler";

interface DownloadMenuProps {
  doc: ReportDocument;
  userRole?: string;
}

export const DownloadMenu: React.FC<DownloadMenuProps> = ({ doc, userRole = "admin" }) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const isReviewer = userRole.toLowerCase() === "reviewer";

  const handleExport = async (format: "pdf" | "md" | "tex" | "json") => {
    if (isReviewer) {
      toast.error("Reviewer Access Restricted: Read-only permission. Exporting documents is restricted to Owner/Faculty/Admin.", {
        duration: 4000,
      });
      return;
    }

    setExporting(format);
    toast.info(`Preparing ${format.toUpperCase()} export for ${doc.title}...`);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanFilename = `PROJECT_BRAHMA_Executive_Report_${doc.id}`;

    try {
      if (format === "pdf") {
        window.print();
        toast.success("Print dialog opened. Select 'Save as PDF' with A4 paper size.");
      } else if (format === "md") {
        const md = exportToMarkdown(doc);
        triggerDownload(md, `${cleanFilename}.md`, "text/markdown");
        toast.success("Markdown report downloaded successfully.");
      } else if (format === "tex") {
        const tex = exportToLatex(doc);
        triggerDownload(tex, `${cleanFilename}.tex`, "text/x-tex");
        toast.success("IEEE LaTeX template downloaded successfully.");
      } else if (format === "json") {
        const json = exportToJson(doc);
        triggerDownload(json, `${cleanFilename}.json`, "application/json");
        toast.success("Raw ReportDocument JSON downloaded for verification.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to export report format.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 font-semibold shadow-md text-xs"
        >
          {exporting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Download className="size-3.5" />
          )}
          <span>Download Report</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
        <DropdownMenuLabel className="text-xs text-slate-400 font-medium">
          Select Export Format
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 text-xs py-2 gap-2.5"
        >
          <Printer className="size-4 text-rose-400" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-200">PDF Document (.pdf)</span>
            <span className="text-[10px] text-slate-400">Print styled A4 paginated paper</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("md")}
          className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 text-xs py-2 gap-2.5"
        >
          <FileText className="size-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-200">Markdown (.md)</span>
            <span className="text-[10px] text-slate-400">Complete formatted document</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("tex")}
          className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 text-xs py-2 gap-2.5"
        >
          <FileCode className="size-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-200">LaTeX Source (.tex)</span>
            <span className="text-[10px] text-slate-400">IEEE conference paper template</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("json")}
          className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 text-xs py-2 gap-2.5"
        >
          <Code2 className="size-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-200">Raw Data JSON (.json)</span>
            <span className="text-[10px] text-slate-400">Deterministic verification payload</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
