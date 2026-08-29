/**
 * STARK Singularity — Epistemic Debt & Liability Tracker
 * Financialized epistemic debt ledger, compounding ignorance interest rates, and liquidation workflows.
 */

import { starkDB, type ConceptRecord, type ContradictionRecord } from '../kernel/db';

export interface EpistemicDebtItem {
  id: string;
  category: 'unverified_concept' | 'unresolved_contradiction' | 'memory_atrophy' | 'borrowed_authority';
  title: string;
  debt_amount: number; // in "Epistemic Credits" (EC)
  accrued_interest: number;
  liquidation_action: string;
}

export interface EpistemicBalanceSheet {
  total_debt: number;
  total_assets: number;
  epistemic_solvency_ratio: number;
  compounding_rate_daily: number;
  items: EpistemicDebtItem[];
  liquidation_plan: string[];
}

export class EpistemicLiabilityTracker {
  public static calculateBalanceSheet(): EpistemicBalanceSheet {
    const concepts = starkDB.select<ConceptRecord>('concepts');
    const contradictions = starkDB.select<ContradictionRecord>('contradictions', c => c.status === 'unresolved');
    const items: EpistemicDebtItem[] = [];

    let totalDebt = 0;
    let totalAssets = concepts.length * 10;

    // 1. Unresolved Contradictions
    for (const c of contradictions) {
      const debtVal = 25;
      const interest = 5;
      totalDebt += debtVal + interest;
      items.push({
        id: `debt_contra_${c.id}`,
        category: 'unresolved_contradiction',
        title: `Unresolved conflict: ${c.claim_a.slice(0, 40)}...`,
        debt_amount: debtVal,
        accrued_interest: interest,
        liquidation_action: `Review and confirm contextual difference in Contradiction Inspector.`
      });
    }

    // 2. Memory Atrophy (< 0.3 retention)
    for (const c of concepts) {
      if ((c.retention_score || 1.0) < 0.35) {
        const debtVal = 15;
        const interest = 3;
        totalDebt += debtVal + interest;
        items.push({
          id: `debt_atrophy_${c.id}`,
          category: 'memory_atrophy',
          title: `Atrophy Risk: ${c.name}`,
          debt_amount: debtVal,
          accrued_interest: interest,
          liquidation_action: `Complete SM-2 spaced review card for ${c.name}.`
        });
      }
    }

    const solvency = totalAssets > 0
      ? Math.max(0, Math.min(2.0, Math.round(((totalAssets - totalDebt) / totalAssets) * 100) / 100))
      : 1.0;

    return {
      total_debt: totalDebt,
      total_assets: totalAssets,
      epistemic_solvency_ratio: solvency,
      compounding_rate_daily: 0.045,
      items,
      liquidation_plan: [
        'Resolve all high-severity cross-session contradictions (est. 4 mins)',
        'Clear daily SM-2 active recall queue (est. 6 mins)',
        'Add forensic notes to unannotated keynote bookmarks (est. 5 mins)'
      ]
    };
  }
}
