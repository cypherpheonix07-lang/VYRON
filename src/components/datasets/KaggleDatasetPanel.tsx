import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Database,
  Download,
  Star,
  CheckCircle,
  ExternalLink,
  Play,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Bot,
  Layers,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { KaggleConnector, KaggleDatasetMetadata } from "@/services/connectors/kaggleConnector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { analysisOrchestrator } from "@/services/orchestrator/analysisOrchestrator";
import { useAnalysisStream } from "@/state/analysis/useAnalysisStream";
import { useCopilot } from "@/state/copilot/useCopilot";
import { InlineCopilotAssistant } from "@/components/copilot/InlineCopilotAssistant";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function KaggleDatasetPanel({ className }: { className?: string }) {
  const [datasets, setDatasets] = useState<KaggleDatasetMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDataset, setSelectedDataset] = useState<KaggleDatasetMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isRunning } = useAnalysisStream();
  const { setDrawerOpen, sendMessage } = useCopilot();

  const loadDatasets = useCallback(async (q: string, cat?: string) => {
    setIsLoading(true);
    try {
      const res = await KaggleConnector.searchDatasets(q, cat);
      setDatasets(res);
      setSelectedDataset((prev) => {
        if (!prev) return res[0] ?? null;
        const exists = res.find((d) => d.ref === prev.ref);
        return exists || (res[0] ?? null);
      });
    } catch (err) {
      console.error("Failed to load Kaggle datasets:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDatasets(searchQuery, selectedCategory);
  }, [loadDatasets, searchQuery, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void loadDatasets(searchQuery, selectedCategory);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
  };

  const handleRunAnalysisOnDataset = async (dataset: KaggleDatasetMetadata) => {
    try {
      toast.info(`Priming 12-stage analysis for ${dataset.title}...`);
      await analysisOrchestrator.runPipeline({
        datasetId: dataset.ref,
        datasetName: dataset.title,
        speedMultiplier: 1.5,
      });
      toast.success("Analysis pipeline initiated.");
    } catch (err) {
      console.error("Failed to run analysis:", err);
      toast.error("Failed to start pipeline.");
    }
  };

  const handleAskCopilotAboutDataset = (dataset: KaggleDatasetMetadata) => {
    setDrawerOpen(true);
    sendMessage(
      `Inspect the ${dataset.title} (${dataset.ref}) dataset. Its usability rating is ${dataset.usabilityRating * 10}/10 with compatibility score ${dataset.pipelineCompatibility.score}%. What anomalies, correlations, and risks can the 12-stage engine extract from its columns: ${dataset.columns.map((c) => c.name).join(", ")}?`,
    );
  };

  const categories = [
    "ALL",
    "Fraud Analytics",
    "Healthcare Operations",
    "Logistics & Commerce",
    "Software Engineering",
    "Cybersecurity & Governance",
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Database className="size-5 text-primary" />
              <span>Kaggle Dataset Discovery & Ingestion Hub</span>
            </h2>
            <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              VERIFIED REPLICAS
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover verified external benchmark datasets, inspect column schemas and quality contracts, and ingest directly into the 12-stage analysis engine.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets, columns, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-secondary/60 border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button type="submit" size="sm" className="text-xs">
            Search
          </Button>
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap",
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground border border-border/40",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Embedded Contextual Copilot Intelligence */}
      <InlineCopilotAssistant pageContext="datasets" />

      {/* Dataset Grid & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Dataset Cards */}
        <div className="lg:col-span-6 space-y-3">
          {datasets.map((d) => {
            const isSelected = selectedDataset?.ref === d.ref;
            return (
              <div
                key={d.ref}
                onClick={() => setSelectedDataset(d)}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer space-y-2.5",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5 ring-1 ring-primary/30"
                    : "border-border/40 bg-card/50 hover:bg-card/80",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{d.title}</h3>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
                        {d.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{d.ref}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary text-primary shrink-0">
                    Rating: {d.usabilityRating * 10}/10
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">{d.subtitle}</p>

                {/* Quality & Compatibility Chips */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    <ShieldCheck className="size-3" />
                    <span>Quality: {d.qualityMetrics.completenessPct}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                    <Zap className="size-3" />
                    <span>Pipeline: {d.pipelineCompatibility.score}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/20 text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>{(d.totalBytes / (1024 * 1024)).toFixed(1)} MB</span>
                    <span>{d.downloadCount.toLocaleString()} downloads</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAskCopilotAboutDataset(d);
                      }}
                      className="h-7 text-xs font-medium hover:bg-secondary text-foreground gap-1 px-2"
                    >
                      <Bot className="size-3 text-primary" />
                      <span>Copilot</span>
                    </Button>
                    <Button
                      size="sm"
                      disabled={isRunning}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRunAnalysisOnDataset(d);
                      }}
                      className="h-7 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                    >
                      <Play className="size-3 fill-current" />
                      <span>Run Analysis</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Schema Inspector & Quality Gauge */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4 shadow-sm">
          {selectedDataset ? (
            <>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/30">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span>Schema Contract & Compatibility</span>
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {selectedDataset.title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAskCopilotAboutDataset(selectedDataset)}
                    className="text-xs border-border/80 gap-1.5"
                  >
                    <Sparkles className="size-3 text-primary" />
                    <span>Inspect</span>
                  </Button>
                  <Button
                    size="sm"
                    disabled={isRunning}
                    onClick={() => handleRunAnalysisOnDataset(selectedDataset)}
                    className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
                  >
                    <Play className="size-3 fill-current" />
                    <span>Analyze</span>
                  </Button>
                </div>
              </div>

              {/* Quality Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-secondary/30 border border-border/40 text-center">
                <div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Completeness</div>
                  <div className="text-sm font-bold text-foreground">{selectedDataset.qualityMetrics.completenessPct}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Uniqueness</div>
                  <div className="text-sm font-bold text-foreground">{selectedDataset.qualityMetrics.uniquenessPct}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Validity</div>
                  <div className="text-sm font-bold text-foreground">{selectedDataset.qualityMetrics.validityPct}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Consistency</div>
                  <div className="text-sm font-bold text-foreground">{selectedDataset.qualityMetrics.consistencyPct}%</div>
                </div>
              </div>

              {/* Compatibility Assessment Box */}
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <span>12-Stage Pipeline Suitability: {selectedDataset.pipelineCompatibility.score}%</span>
                  </span>
                  <span className="text-[10px] font-mono text-primary font-bold">
                    {selectedDataset.pipelineCompatibility.supportedStages.length} / 12 Stages
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {selectedDataset.pipelineCompatibility.notes}
                </p>
              </div>

              {/* Column Schema List */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                  <span>Column Contract ({selectedDataset.columns.length} Fields)</span>
                  <span>Inferred Type</span>
                </div>
                <div className="divide-y divide-border/20 max-h-[300px] overflow-y-auto pr-1">
                  {selectedDataset.columns.map((col) => (
                    <div key={col.name} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-medium text-foreground">{col.name}</span>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          Samples: {col.sampleValues.join(", ")}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-secondary text-primary uppercase">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-muted-foreground">
              Select a dataset on the left to inspect its schema and quality profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
