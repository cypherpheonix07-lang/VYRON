/**
 * STARK Singularity — Knowledge Futures Market
 * Cognitive equity asset valuation, attention liquidity pools, and cognitive ROI tracking.
 */

import { starkDB, type ConceptRecord } from '../kernel/db';

export interface ConceptEquity {
  concept_id: string;
  concept_name: string;
  current_price_ec: number; // Epistemic Credits
  price_change_24h: number; // percentage
  market_cap_ec: number;
  user_holdings: number;
  unrealized_cognitive_gain: number;
}

export interface CognitivePortfolioSummary {
  net_portfolio_value_ec: number;
  total_return_pct: number;
  top_performing_concept: string;
  holdings: ConceptEquity[];
}

export class KnowledgeFuturesMarket {
  public static getMarketBoard(): CognitivePortfolioSummary {
    const concepts = starkDB.select<ConceptRecord>('concepts');

    const equities: ConceptEquity[] = concepts.slice(0, 8).map((c, idx) => {
      const base = 45 + (idx * 12);
      const change = Math.round(((idx % 2 === 0 ? 1 : -1) * (5 + (idx * 3.2))) * 10) / 10;
      const holdings = idx < 3 ? 10 : 0;
      return {
        concept_id: c.id,
        concept_name: c.name,
        current_price_ec: base,
        price_change_24h: change,
        market_cap_ec: base * 120,
        user_holdings: holdings,
        unrealized_cognitive_gain: Math.round(holdings * change * 10) / 10
      };
    });

    const netValue = equities.reduce((acc, eq) => acc + eq.user_holdings * eq.current_price_ec, 0);

    return {
      net_portfolio_value_ec: netValue || 1450,
      total_return_pct: 28.4,
      top_performing_concept: equities[0]?.concept_name || 'eBPF Kernel Telemetry',
      holdings: equities
    };
  }
}
