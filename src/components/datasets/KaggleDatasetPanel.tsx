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
} from "lucide-react";
import { KaggleConnector, KaggleDatasetMetadata } from "@/services/connectors/kaggleConnector";
import { Button } from "@/components/ui/button";
import { analysisOrchestrator } from "@/services/orchestrator/analysisOrchestrator";
import { useAnalysisStream } from "@/state/analysis/useAnalysisStream";
import { InlineCopilotAssistant } from "@/components/copilot/InlineCopilotAssistant";
import { cn } from "@/lib/utils";

export function KaggleDatasetPanel({ className }: { className?: string }) {
  const [datasets, setDatasets] = useState<KaggleDatasetMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<KaggleDatasetMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isRunning } = useAnalysisStream();

  const loadDatasets = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const res = await KaggleConnector.searchDatasets(q);
      setDatasets(res);
      setSelectedDataset((prev) => (prev ? prev : (res[0] ?? null)));
    } catch (err) {
      console.error("Failed to load Kaggle datasets:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDatasets("");
  }, [loadDatasets]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDatasets(searchQuery);
  };

  const handleRunAnalysisOnDataset = async (dataset: KaggleDatasetMetadata) => {
    try {
      await analysisOrchestrator.runPipeline({
        datasetId: dataset.ref,
        datasetName: dataset.title,
        speedMultiplier: 1.5,
      });
    } catch (err) {
      console.error("Failed to run analysis:", err);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Database className="size-5 text-primary" />
            <span>Kaggle Dataset Discovery & Ingestion Hub</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover verified external datasets, inspect column contracts, and ingest directly into
            12-stage analysis
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Kaggle datasets..."
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

      {/* Embedded Contextual Copilot Intelligence */}
      <InlineCopilotAssistant pageContext="datasets" />

      {/* Dataset Grid & Schema Inspector */}
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
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                    : "border-border/40 bg-card/50 hover:bg-card/80",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{d.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{d.ref}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary text-primary">
                    Rating: {d.usabilityRating * 10}/10
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">{d.subtitle}</p>

                <div className="flex items-center justify-between pt-1 border-t border-border/20 text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>{(d.totalBytes / (1024 * 1024)).toFixed(1)} MB</span>
                    <span>{d.downloadCount.toLocaleString()} downloads</span>
                  </div>
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
            );
          })}
        </div>

        {/* Right: Schema Inspector */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
          {selectedDataset ? (
            <>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/30">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span>Schema Contract & Column Mapping</span>
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {selectedDataset.title}
                  </p>
                </div>
                <Button
                  size="sm"
                  disabled={isRunning}
                  onClick={() => handleRunAnalysisOnDataset(selectedDataset)}
                  className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Play className="size-3 mr-1.5 fill-current" />
                  Analyze Dataset
                </Button>
              </div>

              <div className="divide-y divide-border/20 max-h-[420px] overflow-y-auto pr-1">
                {selectedDataset.columns.map((col) => (
                  <div key={col.name} className="py-2.5 flex items-center justify-between text-xs">
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
            </>
          ) : (
            <div className="text-center py-12 text-xs text-muted-foreground">
              Select a dataset on the left to inspect its schema.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
