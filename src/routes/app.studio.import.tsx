import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  FileText,
  Github,
  Image,
  Loader2,
  Mic,
  Plus,
  Play,
  Upload,
  Globe,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/studio/import")({
  head: () => ({
    meta: [
      { title: "Import Source — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Import project requirements and assets from external sources.",
      },
    ],
  }),
  component: ImportPage,
});

function ImportPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("github");
  const [loading, setLoading] = useState(false);

  // GitHub States
  const [repoUrl, setRepoUrl] = useState("");
  const [connected, setConnected] = useState(false);

  // Figma States
  const [figmaUrl, setFigmaUrl] = useState("");
  const [figmaExtracted, setFigmaExtracted] = useState(false);

  // Screenshot States
  const [screenshotName, setScreenshotName] = useState<string | null>(null);

  // Document States
  const [docName, setDocName] = useState<string | null>(null);

  // Voice States
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Sync tab with search parameters if any
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleImport = async (source: string) => {
    setLoading(true);
    toast.success("Processing imported content...", {
      description: `Analyzing ${source} structures and mappings.`,
    });
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setLoading(false);
    toast.success("Import parsed successfully", {
      description: "Requirements added to draft blueprint.",
    });
    // Redirect to plan page using the first mock project ID
    navigate({ to: "/app/studio/$id/plan", params: { id: "brahma-core" } });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Studio Workspace"
        description="Feed requirements, source codes, design files, or transcripts into Brahma's extraction engine."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className="w-full justify-start overflow-x-auto border-b border-border bg-transparent p-0"
          aria-label="Import workspace options"
        >
          <TabsTrigger
            value="github"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Github className="mr-2 size-4" /> GitHub
          </TabsTrigger>
          <TabsTrigger
            value="figma"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <FileText className="mr-2 size-4" /> Figma
          </TabsTrigger>
          <TabsTrigger
            value="screenshot"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Image className="mr-2 size-4" /> Screenshot
          </TabsTrigger>
          <TabsTrigger
            value="srs"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Upload className="mr-2 size-4" /> SRS/PDF
          </TabsTrigger>
          <TabsTrigger
            value="voice"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Mic className="mr-2 size-4" /> Voice Input
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* GITHUB TAB */}
          <TabsContent value="github" className="space-y-4 outline-none">
            <SectionCard
              title="Import GitHub Repository"
              description="Analyze existing file trees, code health, and structural dependencies."
            >
              <div className="grid gap-4 max-w-xl">
                <div className="flex items-center justify-between border border-border rounded-xl p-4 surface">
                  <div className="flex items-center gap-3">
                    <Github className="size-5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">GitHub Integration Status</p>
                      <p className="text-xs text-muted-foreground">
                        {connected
                          ? "Connected as priya.nair@brahma.dev"
                          : "Authenticate to read repositories."}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setConnected(!connected);
                      toast.info(connected ? "GitHub account disconnected" : "GitHub connected");
                    }}
                  >
                    {connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="git-url">Repository URL</Label>
                  <Input
                    id="git-url"
                    placeholder="https://github.com/organization/project"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                </div>

                <Button
                  onClick={() => handleImport("GitHub Repository")}
                  disabled={loading || !repoUrl.trim()}
                  className="w-fit"
                >
                  {loading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 size-4" />
                  )}{" "}
                  Import Repository
                </Button>
              </div>
            </SectionCard>
          </TabsContent>

          {/* FIGMA TAB */}
          <TabsContent value="figma" className="space-y-4 outline-none">
            <SectionCard
              title="Import Figma File"
              description="Convert design frames into structured component outline cards."
            >
              <div className="grid gap-4 max-w-xl">
                <div className="grid gap-2">
                  <Label htmlFor="figma-url">Figma File URL</Label>
                  <Input
                    id="figma-url"
                    placeholder="https://www.figma.com/file/..."
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                  />
                </div>

                {figmaUrl.trim() && !figmaExtracted && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFigmaExtracted(true);
                      toast.success("Detected 12 UI components!");
                    }}
                  >
                    Scan UI Components
                  </Button>
                )}

                {figmaExtracted && (
                  <div className="border border-border p-4 rounded-xl space-y-2 surface">
                    <p className="text-xs font-semibold text-primary">Detected Nodes:</p>
                    <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                      <li>HeaderNavbar (Frame)</li>
                      <li>SidebarNavigation (Frame)</li>
                      <li>PricingGrid (Card)</li>
                      <li>ActivityFeed (List)</li>
                    </ul>
                  </div>
                )}

                <Button
                  onClick={() => handleImport("Figma file")}
                  disabled={loading || !figmaUrl.trim()}
                  className="w-fit"
                >
                  {loading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 size-4" />
                  )}{" "}
                  Generate Components
                </Button>
              </div>
            </SectionCard>
          </TabsContent>

          {/* SCREENSHOT TAB */}
          <TabsContent value="screenshot" className="space-y-4 outline-none">
            <SectionCard
              title="Upload Interface Screenshot"
              description="Upload visual UI layouts and have Brahma extract matching code."
            >
              <div className="grid gap-4 max-w-xl">
                <label className="surface border-2 border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-primary/40 transition-colors">
                  <Image className="size-8 text-primary mb-2" />
                  <span className="text-sm font-semibold">
                    {screenshotName ?? "Select Screenshot image"}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) =>
                      setScreenshotName(e.target.files?.[0]?.name ?? "dashboard_mockup.png")
                    }
                  />
                </label>

                {screenshotName && (
                  <Button
                    onClick={() => handleImport("Screenshot image")}
                    disabled={loading}
                    className="w-fit"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Play className="mr-2 size-4" />
                    )}{" "}
                    Generate Component Code
                  </Button>
                )}
              </div>
            </SectionCard>
          </TabsContent>

          {/* SRS TAB */}
          <TabsContent value="srs" className="space-y-4 outline-none">
            <SectionCard
              title="Upload Requirement Document"
              description="Extract structured functional and non-functional requirements from text briefs."
            >
              <div className="grid gap-4 max-w-xl">
                <label className="surface border-2 border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-primary/40 transition-colors">
                  <FileText className="size-8 text-primary mb-2" />
                  <span className="text-sm font-semibold">{docName ?? "Select SRS document"}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PDF, DOCX, MD up to 15MB
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) =>
                      setDocName(e.target.files?.[0]?.name ?? "SRS_specification_v1.pdf")
                    }
                  />
                </label>

                {docName && (
                  <Button
                    onClick={() => handleImport("SRS Document")}
                    disabled={loading}
                    className="w-fit"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Play className="mr-2 size-4" />
                    )}{" "}
                    Parse Requirements
                  </Button>
                )}
              </div>
            </SectionCard>
          </TabsContent>

          {/* VOICE TAB */}
          <TabsContent value="voice" className="space-y-4 outline-none">
            <SectionCard
              title="Dictate Requirements"
              description="Record a verbal brief of your product ideas to convert into structured lists."
            >
              <div className="grid gap-4 max-w-xl">
                <div className="flex items-center gap-4">
                  <Button
                    variant={recording ? "destructive" : "outline"}
                    className="h-12 w-12 rounded-full p-0 flex items-center justify-center shrink-0"
                    onClick={() => {
                      setRecording(!recording);
                      if (!recording) {
                        setTranscript("Listening...");
                        setTimeout(() => {
                          setTranscript(
                            "We need a secure checkout pipeline for credit cards and mobile wallets with audit log files restricted to ap-south-1 region.",
                          );
                        }, 2500);
                      }
                    }}
                  >
                    <Mic className={`size-5 ${recording ? "animate-pulse" : ""}`} />
                  </Button>
                  <div>
                    <p className="text-sm font-semibold">
                      {recording ? "Recording audio..." : "Record verbal brief"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Click the microphone to start.
                    </p>
                  </div>
                </div>

                {transcript && (
                  <div className="space-y-4">
                    <div className="border border-border p-4 rounded-xl surface font-mono text-xs">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Transcript Preview:
                      </p>
                      <p className="mt-1 text-foreground leading-relaxed">{transcript}</p>
                    </div>
                    <Button
                      onClick={() => handleImport("Voice Transcripts")}
                      disabled={loading}
                      className="w-fit"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Play className="mr-2 size-4" />
                      )}{" "}
                      Convert to Blueprint
                    </Button>
                  </div>
                )}
              </div>
            </SectionCard>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
