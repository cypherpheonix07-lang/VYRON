import React, { useState } from "react";
import {
  Layers,
  Database,
  Cpu,
  Table as TableIcon,
  Play,
  Download,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FrontendBlueprintTree } from "./FrontendBlueprintTree";
import { BackendBlueprintDiagram } from "./BackendBlueprintDiagram";
import { TechStackComparator } from "./TechStackComparator";
import { MockDataPreview } from "./MockDataPreview";
import { RefinementChat } from "./RefinementChat";
import { LivePreviewFrame } from "./LivePreviewFrame";
import type { WebsiteProject } from "@/types/websiteStudio";

interface BlueprintViewerProps {
  project: WebsiteProject;
  previewHtml?: string;
  onProjectUpdated: (updated: WebsiteProject) => void;
  onNavigatePreview?: () => void;
  onNavigateExport?: () => void;
}

export const BlueprintViewer: React.FC<BlueprintViewerProps> = ({
  project,
  previewHtml,
  onProjectUpdated,
  onNavigatePreview,
  onNavigateExport,
}) => {
  const [activeTab, setActiveTab] = useState<string>("frontend");
  const [showRefinement, setShowRefinement] = useState<boolean>(false);
  const [showLivePreviewModal, setShowLivePreviewModal] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Blueprint Header */}
      <div className="p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card to-cyan-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {project.name}
            </h1>
            <Badge variant="outline" className="text-xs border-cyan-500/40 text-cyan-400 bg-cyan-500/10">
              {project.status.toUpperCase()}
            </Badge>
            {project.provenance_sha && (
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Provenance Verified
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            {project.requirements_text}
          </p>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRefinement(!showRefinement)}
            className={`text-xs border-purple-500/40 hover:bg-purple-950/20 text-purple-300 ${
              showRefinement ? "bg-purple-950/40 ring-1 ring-purple-500" : ""
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            {showRefinement ? "Close AI Refiner" : "Refine with AI"}
          </Button>

          {onNavigatePreview ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigatePreview}
              className="text-xs border-cyan-500/40 hover:bg-cyan-950/20 text-cyan-300"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-cyan-400" /> Live Preview
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLivePreviewModal(true)}
              className="text-xs border-cyan-500/40 hover:bg-cyan-950/20 text-cyan-300"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-cyan-400" /> Preview Runtime
            </Button>
          )}

          {onNavigateExport && (
            <Button
              size="sm"
              onClick={onNavigateExport}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export Codebase (ZIP)
            </Button>
          )}
        </div>
      </div>

      {/* Main Body Grid: Viewer + Optional Refinement Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={showRefinement ? "lg:col-span-8" : "lg:col-span-12"}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/40 border border-border/50 p-1">
              <TabsTrigger value="frontend" className="text-xs flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Frontend Blueprint
              </TabsTrigger>
              <TabsTrigger value="backend" className="text-xs flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-purple-400" /> Backend Architecture
              </TabsTrigger>
              <TabsTrigger value="tech" className="text-xs flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Tech Stack Rationale
              </TabsTrigger>
              <TabsTrigger value="mock" className="text-xs flex items-center gap-2">
                <TableIcon className="w-3.5 h-3.5 text-amber-400" /> Mock Seed Data
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Frontend */}
            <TabsContent value="frontend">
              {project.frontend_blueprint ? (
                <FrontendBlueprintTree blueprint={project.frontend_blueprint} />
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Frontend blueprint pending generation.
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Backend */}
            <TabsContent value="backend">
              {project.backend_blueprint ? (
                <BackendBlueprintDiagram blueprint={project.backend_blueprint} />
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Backend blueprint pending generation.
                </div>
              )}
            </TabsContent>

            {/* Tab 3: Tech Stack */}
            <TabsContent value="tech">
              {project.tech_comparison ? (
                <TechStackComparator
                  comparison={project.tech_comparison}
                  selectedStack={project.tech_stack}
                  onSelectOption={() => {}}
                  onResetRecommended={() => {}}
                />
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Tech stack comparison pending.
                </div>
              )}
            </TabsContent>

            {/* Tab 4: Mock Data */}
            <TabsContent value="mock">
              {project.mock_data && Object.keys(project.mock_data).length > 0 ? (
                <MockDataPreview
                  mockData={project.mock_data}
                  onUpdateData={(updated) =>
                    onProjectUpdated({ ...project, mock_data: updated })
                  }
                />
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Mock data pending generation.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Refinement Chat Sidebar */}
        {showRefinement && (
          <div className="lg:col-span-4 sticky top-6">
            <RefinementChat project={project} onProjectUpdated={onProjectUpdated} />
          </div>
        )}
      </div>

      {/* Live Preview Modal */}
      {showLivePreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-6xl max-h-[90vh] bg-background border border-border/80 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" /> Sandboxed Runtime Preview
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLivePreviewModal(false)}
                className="text-xs h-7"
              >
                Close Preview
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <LivePreviewFrame project={project} customHtml={previewHtml} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
