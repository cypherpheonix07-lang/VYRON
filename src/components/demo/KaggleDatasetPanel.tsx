/**
 * PROJECT BRAHMA — KAGGLE DATASET PANEL (FL-02-C STEP 4)
 * Search, inspect, preview, and calibrate demo benchmarks from Kaggle public datasets.
 */

import React, { useState } from "react";
import { Search, Database, Download, Table, Sparkles, Check, ExternalLink, ShieldCheck, Tag } from "lucide-react";
import { useKaggleDatasets } from "@/hooks/useKaggleDatasets";
import { KaggleDataset, PREDEFINED_KAGGLE_QUERIES } from "@/lib/kaggle/api";
import { DEMO_SCAN_RESULTS } from "@/data/demo/demoScanResults";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function KaggleDatasetPanel({ className = "" }: { className?: string }) {
  const {
    query,
    setQuery,
    datasets,
    isLoading,
    selectedDataset,
    selectDataset,
    loadSampleData,
    sampleRows,
    error,
  } = useKaggleDatasets();

  const [calibrated, setCalibrated] = useState(false);

  const handleSelectAndLoad = async (ds: KaggleDataset) => {
    selectDataset(ds);
    const rows = await loadSampleData(ds);
    if (rows.length > 0) {
      toast.success(`Loaded ${rows.length - 1} records from ${ds.title}`);
    }
  };

  const handleCalibrateBaseline = () => {
    if (!selectedDataset || sampleRows.length < 2) return;

    // Calibrate demo scan summary using loaded dataset parameters
    DEMO_SCAN_RESULTS.summary.scannedFiles = sampleRows.length - 1;
    DEMO_SCAN_RESULTS.summary.scannedLines = (sampleRows.length - 1) * 340;
    DEMO_SCAN_RESULTS.summary.avgCCN = 18.3;

    setCalibrated(true);
    toast.success(`Demo data calibrated to Kaggle dataset: ${selectedDataset.title}`);
  };

  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-5 text-zinc-100 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="size-5 text-cyan-400" />
            <h3 className="text-base font-semibold">Kaggle Dataset Connector</h3>
            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[11px]">
              Proxied Basic Auth
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Browse and calibrate synthetic architecture evaluation with real-world software engineering corpora.
          </p>
        </div>

        {selectedDataset && (
          <a
            href={selectedDataset.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            <span>View on Kaggle</span>
            <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      {/* Search Bar & Quick Queries */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search software engineering, security, and defect datasets..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Quick query chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-zinc-500 mr-1">Suggested:</span>
          {PREDEFINED_KAGGLE_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuery(q)}
              className={`px-2 py-0.5 rounded text-[11px] border transition-colors cursor-pointer ${
                query === q
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Results Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Available Datasets ({datasets.length})
        </h4>

        {isLoading && datasets.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500">Querying Kaggle API proxy...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {datasets.map((ds) => {
              const isSelected = selectedDataset?.ref === ds.ref;
              return (
                <div
                  key={ds.ref}
                  onClick={() => selectDataset(ds)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-zinc-900 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/50"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-zinc-100 line-clamp-1">{ds.title}</h5>
                      <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                        ⭐ {Math.round(ds.usabilityRating * 100)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{ds.subtitle || ds.ref}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {(ds.totalBytes / (1024 * 1024)).toFixed(1)} MB
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAndLoad(ds);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-medium border border-cyan-500/30 transition-colors cursor-pointer"
                    >
                      <Download className="size-3" />
                      <span>Load Sample</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sample Preview Table */}
      {sampleRows.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="size-4 text-emerald-400" />
              <h4 className="text-xs font-semibold text-zinc-200">
                Sample Preview: {selectedDataset?.title} (Top {Math.min(10, sampleRows.length - 1)} rows)
              </h4>
            </div>

            <button
              type="button"
              onClick={handleCalibrateBaseline}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                calibrated
                  ? "bg-emerald-600 text-white"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 text-zinc-950 font-bold hover:brightness-110"
              }`}
            >
              {calibrated ? <Check className="size-3.5" /> : <Sparkles className="size-3.5" />}
              <span>{calibrated ? "Calibrated" : "Use as Demo Baseline"}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/80">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] text-zinc-400">
                <tr>
                  {sampleRows[0]?.map((col, idx) => (
                    <th key={idx} className="px-3 py-2 whitespace-nowrap font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {sampleRows.slice(1, 11).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-800/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap text-[11px]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
