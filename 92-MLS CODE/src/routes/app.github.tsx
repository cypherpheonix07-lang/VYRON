import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GitHubDashboard } from "@/components/github/GitHubDashboard";
import { EngineeringPortfolio, VibePlatformHub, CrossPlatformLineageGraph } from "@/components/ecosystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Layers, GitBranch, FolderGit2 } from "lucide-react";

export const Route = createFileRoute("/app/github")({
  head: () => ({
    meta: [
      { title: "Engineering Portfolio & Vibe Ecosystem — VYRON" },
      {
        name: "description",
        content: "Continuous GitHub repository discovery, vibe-coding auto-connect, and cross-platform lineage control plane.",
      },
    ],
  }),
  component: AppGitHubPage,
});

function AppGitHubPage() {
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <div className="space-y-6 p-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card/70 border border-border/60 p-1 rounded-xl">
          <TabsTrigger value="portfolio" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Github className="w-3.5 h-3.5" />
            Engineering Portfolio
          </TabsTrigger>
          <TabsTrigger value="vibe" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Layers className="w-3.5 h-3.5" />
            Vibe-Coding Hub
          </TabsTrigger>
          <TabsTrigger value="lineage" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <GitBranch className="w-3.5 h-3.5" />
            Cross-Platform Lineage DAG
          </TabsTrigger>
          <TabsTrigger value="explorer" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <FolderGit2 className="w-3.5 h-3.5" />
            Repository Tree Explorer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="mt-6">
          <EngineeringPortfolio />
        </TabsContent>

        <TabsContent value="vibe" className="mt-6">
          <VibePlatformHub />
        </TabsContent>

        <TabsContent value="lineage" className="mt-6">
          <CrossPlatformLineageGraph />
        </TabsContent>

        <TabsContent value="explorer" className="mt-6">
          <GitHubDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

