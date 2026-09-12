/**
 * PROJECT BRAHMA — USE KAGGLE DATASETS HOOK (FL-02-C STEP 3)
 * React hook querying software engineering datasets via secure proxy with client caching.
 */

import { useState, useEffect, useCallback } from "react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { searchDatasets, downloadFile, KaggleDataset, getDatasetFiles } from "@/lib/kaggle/api";

const CACHE_KEY = "brahma_kaggle_datasets_cache";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CachedData {
  timestamp: number;
  datasets: KaggleDataset[];
}

export function useKaggleDatasets(initialQuery = "software engineering code quality metrics") {
  const { isDemo } = useDemoMode();
  const [query, setQuery] = useState(initialQuery);
  const [datasets, setDatasets] = useState<KaggleDataset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<KaggleDataset | null>(null);
  const [sampleRows, setSampleRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load datasets with 30m cache
  const fetchDatasets = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);

    // Check sessionStorage cache
    if (typeof window !== "undefined") {
      try {
        const cachedStr = sessionStorage.getItem(`${CACHE_KEY}_${searchQuery}`);
        if (cachedStr) {
          const parsed: CachedData = JSON.parse(cachedStr);
          if (Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.datasets.length > 0) {
            setDatasets(parsed.datasets);
            setSelectedDataset(parsed.datasets[0] || null);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Cache miss
      }
    }

    try {
      const results = await searchDatasets(searchQuery);
      setDatasets(results);
      if (results.length > 0) {
        setSelectedDataset(results[0] || null);
      }
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            `${CACHE_KEY}_${searchQuery}`,
            JSON.stringify({ timestamp: Date.now(), datasets: results })
          );
        } catch {
          // Storage full
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets(query);
  }, [fetchDatasets, query]);

  const selectDataset = useCallback((dataset: KaggleDataset) => {
    setSelectedDataset(dataset);
    setSampleRows([]);
  }, []);

  const loadSampleData = useCallback(async (dataset: KaggleDataset): Promise<string[][]> => {
    setIsLoading(true);
    try {
      const files = await getDatasetFiles(dataset.ref);
      const csvFile = files.find((f) => f.name.endsWith(".csv")) || files[0];
      const fileName = csvFile ? csvFile.name : "metrics.csv";

      const rawCsv = await downloadFile(dataset.ref, fileName);
      const rows = rawCsv
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean)
        .map((r) => r.split(","));

      setSampleRows(rows);
      return rows;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isDemo,
    query,
    setQuery,
    datasets,
    isLoading,
    selectedDataset,
    selectDataset,
    loadSampleData,
    sampleRows,
    error,
    refresh: () => fetchDatasets(query),
  };
}
