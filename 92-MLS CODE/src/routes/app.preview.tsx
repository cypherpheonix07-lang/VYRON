import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { EvidenceAwareEngineeringTheater } from "@/components/preview/EvidenceAwareEngineeringTheater";
import { PreviewEngine } from "@/components/preview/PreviewEngine";
import { BrahmaExplanatorySurfaces } from "@/components/brahma/ExplanatorySurfaces";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Layers, BookOpen } from "lucide-react";

export const Route = createFileRoute("/app/preview")({
  head: () => ({
    meta: [
      { title: "Evidence-Aware Engineering Theater — VYRON" },
      {
        name: "description",
        content: "Synchronized 10-layer engineering theater, live AST provenance inspection, and truth-bound architecture surfaces.",
      },
    ],
  }),
  component: AppPreviewPage,
});

function AppPreviewPage() {
  const [activeTab, setActiveTab] = useState("theater");

  return (
    <div className="space-y-6 p-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card/70 border border-border/60 p-1 rounded-xl">
          <TabsTrigger
            value="theater"
            className="text-xs flex items-center gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            10-Layer Engineering Theater
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="text-xs flex items-center gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            <Layers className="w-3.5 h-3.5" />
            AI Vibe Ecosystem Matrix
          </TabsTrigger>
          <TabsTrigger
            value="explanatory"
            className="text-xs flex items-center gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            <BookOpen className="w-3.5 h-3.5" />
            14 Explanatory Architecture Surfaces
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theater" className="mt-6">
          <EvidenceAwareEngineeringTheater />
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <PreviewEngine />
        </TabsContent>

        <TabsContent value="explanatory" className="mt-6">
          <BrahmaExplanatorySurfaces />
        </TabsContent>
      </Tabs>
    </div>
  );
}
