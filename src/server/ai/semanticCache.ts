/**
 * PROJECT BRAHMA — SEMANTIC & EXACT CACHE 2.0
 * High-performance SHA-256 cache with project isolation and mode partitioning.
 * Guarantees Demo simulation state never contaminates Live production state.
 * Strictly ZERO SQL.
 */

import crypto from "crypto";
import { InferenceResponse } from "./types";

interface CacheEntry {
  response: InferenceResponse;
  expiresAt: number;
  projectId?: string | undefined;
  mode: "NORMAL" | "DEMO";
  createdAt: string;
}

export class SemanticCache {
  private static instance: SemanticCache | null = null;
  private cache: Map<string, CacheEntry> = new Map();
  private hits = 0;
  private misses = 0;
  private totalSavedCostUsd = 0;

  private constructor() {}

  public static getInstance(): SemanticCache {
    if (!SemanticCache.instance) {
      SemanticCache.instance = new SemanticCache();
    }
    return SemanticCache.instance;
  }

  public computeKey(
    task: string,
    prompt: string | unknown,
    projectId: string = "global",
    mode: "NORMAL" | "DEMO" = "NORMAL",
  ): string {
    const jsonStr = typeof prompt === "string" ? prompt : JSON.stringify(prompt);
    const hash = crypto.createHash("sha256").update(jsonStr).digest("hex");
    return `${mode}:${projectId}:${task}:${hash}`;
  }

  public get(key: string): InferenceResponse | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    this.totalSavedCostUsd += entry.response.usage.estimatedCostUsd || 0.0001;

    // Return cloned response with cacheHit = true and cost = 0
    return {
      ...entry.response,
      cacheHit: true,
      latencyMs: 1, // Cache replay resolves in 1ms
      usage: {
        ...entry.response.usage,
        estimatedCostUsd: 0.0,
      },
    };
  }

  public set(
    key: string,
    response: InferenceResponse,
    ttlHours: number = 24,
    projectId?: string,
    mode: "NORMAL" | "DEMO" = "NORMAL",
  ): void {
    if (ttlHours <= 0 || !response.ok) return;

    this.cache.set(key, {
      response,
      expiresAt: Date.now() + ttlHours * 3600 * 1000,
      projectId,
      mode,
      createdAt: new Date().toISOString(),
    });
  }

  public getMetrics() {
    return {
      totalEntries: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRatio: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
      totalSavedCostUsd: this.totalSavedCostUsd,
    };
  }

  public clear(): void {
    this.cache.clear();
  }

  public invalidateProject(projectId: string): void {
    for (const [k, v] of this.cache.entries()) {
      if (v.projectId === projectId) {
        this.cache.delete(k);
      }
    }
  }
}

export const semanticCache = SemanticCache.getInstance();
