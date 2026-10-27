/**
 * PROJECT BRAHMA — PRICING ENGINE & DYNAMIC COST FORMULA
 * Sourced dynamically from llm_routing with exact token cost computation.
 *
 * COST FORMULA:
 * estimate_usd = Σ over enabled ai_tasks of:
 *   (avg_tokens[task] / 1000) × price_per_1k[task from llm_routing chain[0]]
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { LlmRoutingEntry, AiTasks } from "@/types/wizard";

/**
 * Authoritative fallback pricing catalog if table is pending DDL
 */
export const DEFAULT_LLM_PRICING: Record<
  string,
  { name: string; avgTokens: number; pricePer1k: number; model: string }
> = {
  requirement_extraction: {
    name: "Requirement Extraction",
    avgTokens: 2500,
    pricePer1k: 0.00015,
    model: "openai/gpt-4o-mini",
  },
  architecture_generation: {
    name: "Architecture Synthesis",
    avgTokens: 6000,
    pricePer1k: 0.003,
    model: "anthropic/claude-3.5-sonnet",
  },
  code_review: {
    name: "AST Code Review & Complexity",
    avgTokens: 4000,
    pricePer1k: 0.00015,
    model: "openai/gpt-4o-mini",
  },
  test_generation: {
    name: "Unit & Integration Test Gen",
    avgTokens: 3500,
    pricePer1k: 0.00015,
    model: "openai/gpt-4o-mini",
  },
  report_prose: {
    name: "Audit Report Prose & Cryptography",
    avgTokens: 5000,
    pricePer1k: 0.003,
    model: "anthropic/claude-3.5-sonnet",
  },
  copilot: {
    name: "Autonomous Architecture Copilot",
    avgTokens: 4500,
    pricePer1k: 0.00015,
    model: "openai/gpt-4o-mini",
  },
};

/**
 * Fetches routing pricing catalog from llm_routing table in Supabase
 */
export async function getLlmRoutingPricing(): Promise<
  Record<string, { name: string; avgTokens: number; pricePer1k: number; model: string }>
> {
  try {
    const { data, error } = await supabase.from("llm_routing").select("*").eq("active", true);

    if (error || !data || data.length === 0) {
      return DEFAULT_LLM_PRICING;
    }

    const map: Record<
      string,
      { name: string; avgTokens: number; pricePer1k: number; model: string }
    > = {};
    for (const item of data as LlmRoutingEntry[]) {
      const firstChain = Array.isArray(item.chain) && item.chain[0] ? item.chain[0] : null;
      map[item.task] = {
        name: item.task_name,
        avgTokens: item.avg_tokens,
        pricePer1k: firstChain?.price_per_1k ?? (Number(item.price_per_1k) || 0.0015),
        model: firstChain?.model ?? item.model ?? "gpt-4o-mini",
      };
    }
    return map;
  } catch {
    return DEFAULT_LLM_PRICING;
  }
}

/**
 * TanStack Query Hook: usePricingCatalog
 */
export function usePricingCatalog() {
  return useQuery({
    queryKey: ["llm-routing-pricing"],
    queryFn: getLlmRoutingPricing,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * 3.5 Exact Cost Calculation Function:
 * Computes USD estimate with millicent precision.
 */
export function calculateEstimateUsd(
  aiTasks: AiTasks,
  pricingTable: Record<string, { avgTokens: number; pricePer1k: number }> = DEFAULT_LLM_PRICING,
): number {
  let total = 0;

  for (const [taskKey, isEnabled] of Object.entries(aiTasks)) {
    if (isEnabled && pricingTable[taskKey]) {
      const { avgTokens, pricePer1k } = pricingTable[taskKey];
      const taskCost = (avgTokens / 1000) * pricePer1k;
      total += taskCost;
    }
  }

  // Round to 4 decimal places for display accuracy
  return Math.round(total * 10000) / 10000;
}

/**
 * Computes per-task breakdown for estimate card
 */
export function getTaskCostBreakdown(
  aiTasks: AiTasks,
  pricingTable: Record<
    string,
    { name: string; avgTokens: number; pricePer1k: number; model: string }
  > = DEFAULT_LLM_PRICING,
): Array<{ task: string; name: string; model: string; avgTokens: number; costUsd: number }> {
  const breakdown: Array<{
    task: string;
    name: string;
    model: string;
    avgTokens: number;
    costUsd: number;
  }> = [];

  for (const [taskKey, isEnabled] of Object.entries(aiTasks)) {
    if (isEnabled && pricingTable[taskKey]) {
      const item = pricingTable[taskKey];
      const costUsd = Math.round((item.avgTokens / 1000) * item.pricePer1k * 10000) / 10000;
      breakdown.push({
        task: taskKey,
        name: item.name,
        model: item.model,
        avgTokens: item.avgTokens,
        costUsd,
      });
    }
  }

  return breakdown;
}
