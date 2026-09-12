import React, { useState } from "react";
import JSZip from "jszip";
import {
  Download,
  Package,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  FileCode,
  Sparkles,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import type { WebsiteProject } from "@/types/websiteStudio";
import { compileExportFiles, computeProvenanceSha } from "@/lib/websiteSynthesis";

interface ExportPanelProps {
  project: WebsiteProject;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ project }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [provenanceSha, setProvenanceSha] = useState<string | null>(
    project.provenance_sha || null
  );

  const checklist = [
    {
      title: "Requirements & User Flows",
      desc: `${project.requirements_text?.length || 0} characters specified`,
      ready: Boolean(project.requirements_text && project.requirements_text.length >= 15),
    },
    {
      title: "Visual Tokens & Design System",
      desc: project.design_system?.presetName || "Obsidian Cyan",
      ready: Boolean(project.design_system),
    },
    {
      title: "Scored Tech Stack Architecture",
      desc: `${project.tech_stack?.frontend || "Next.js"} + ${project.tech_stack?.backend || "Edge"}`,
      ready: Boolean(project.tech_stack),
    },
    {
      title: "Frontend & Backend Blueprints",
      desc: `${project.frontend_blueprint?.pages?.length || 5} pages, ${project.backend_blueprint?.apiRoutes?.length || 5} API routes`,
      ready: Boolean(project.frontend_blueprint && project.backend_blueprint),
    },
    {
      title: "Relational Seed & Mock Data",
      desc: `${Object.keys(project.mock_data || {}).length} tables with FK integrity`,
      ready: Boolean(project.mock_data && Object.keys(project.mock_data).length > 0),
    },
  ];

  const allReady = checklist.every((c) => c.ready);

  const handleCopyCommands = () => {
    const cmds = `unzip ${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-export.zip\ncd ${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-export\nnpm install\nnpm run dev`;
    navigator.clipboard.writeText(cmds);
    setCopiedCmd(true);
    toast.success("Terminal run commands copied!");
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      let files: Record<string, string> = {};
      let sha = "";

      try {
        const { data, error } = await supabase.functions.invoke("website-export", {
          body: {
            project_id: project.id,
            project_data: project,
          },
        });
        if (data?.ok && data.files) {
          files = data.files;
          sha = data.provenance_sha;
        }
      } catch (e) {
        console.warn("[ExportPanel] Edge function fallback:", e);
      }

      if (Object.keys(files).length === 0) {
        files = compileExportFiles(project);
        sha = await computeProvenanceSha(files);
      }

      setProvenanceSha(sha);

      // Assemble browser ZIP via JSZip
      const zip = new JSZip();
      for (const [filePath, content] of Object.entries(files)) {
        zip.file(filePath, content);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const filename = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-export.zip`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(downloadUrl);

      toast.success(`Downloaded ${filename} successfully!`);
    } catch (err: any) {
      console.error("[ExportPanel] Error:", err);
      toast.error(err?.message || "Failed to download ZIP archive.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card to-cyan-950/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Production Codebase Export
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Compile and download a self-contained, turnkey codebase archive for {project.name}.
            </p>
          </div>
        </div>

        <Button
          onClick={handleExportZip}
          disabled={!allReady || isExporting}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold px-5 shadow-lg shadow-cyan-500/20"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Bundling Codebase ZIP..." : "Download Export Bundle (ZIP)"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Readiness Checklist */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-4">
          <h3 className="font-semibold text-sm text-foreground flex items-center justify-between">
            <span>Pre-Export Readiness Checklist</span>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              {checklist.filter((c) => c.ready).length}/5 Passed
            </Badge>
          </h3>

          <div className="divide-y divide-border/40">
            {checklist.map((item, idx) => (
              <div key={idx} className="py-3 flex items-start gap-3 text-xs">
                <div className="mt-0.5 shrink-0">
                  {item.ready ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Codebase File Manifest */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-4">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <FileCode className="w-4 h-4 text-purple-400" /> Archive Bundle Structure
          </h3>

          <div className="p-3.5 rounded-xl border border-border/50 bg-background/60 font-mono text-[11px] space-y-1 text-muted-foreground">
            <p className="text-cyan-400 font-semibold">📁 {project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/</p>
            <p className="pl-4">├── 📄 package.json <span className="text-[10px] text-muted-foreground">(Vite + React 19)</span></p>
            <p className="pl-4">├── 📄 vite.config.ts</p>
            <p className="pl-4">├── 📄 index.html</p>
            <p className="pl-4">├── 📁 src/</p>
            <p className="pl-8">├── 📄 main.tsx & App.tsx</p>
            <p className="pl-8">├── 📁 pages/ <span className="text-[10px] text-muted-foreground">(5 full routes)</span></p>
            <p className="pl-8">└── 📁 components/ <span className="text-[10px] text-muted-foreground">(11 components)</span></p>
            <p className="pl-4">├── 📁 migrations/001_init.sql <span className="text-[10px] text-muted-foreground">(RLS DDL)</span></p>
            <p className="pl-4">├── 📁 seed/seed.sql <span className="text-[10px] text-muted-foreground">(50+ rows)</span></p>
            <p className="pl-4">├── 📄 Dockerfile & docker-compose.yml</p>
            <p className="pl-4">└── 📄 README.md</p>
          </div>

          {/* Provenance Vault Signature */}
          {provenanceSha && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Cryptographic Provenance SHA-256
              </div>
              <p className="font-mono text-[10px] text-slate-300 break-all">{provenanceSha}</p>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Run Guide */}
      <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> Local Execution Instructions
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCommands}
            className="text-xs h-7 border-border/60 hover:bg-card"
          >
            {copiedCmd ? (
              <>
                <Check className="w-3 h-3 mr-1.5 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1.5" /> Copy Terminal Snippet
              </>
            )}
          </Button>
        </div>

        <pre className="p-4 rounded-xl border border-border/50 bg-background/90 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
{`# 1. Unzip downloaded bundle
unzip ${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-export.zip
cd ${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-export

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev`}
        </pre>
      </div>
    </div>
  );
};
