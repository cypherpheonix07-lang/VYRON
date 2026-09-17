/**
 * VYRON — CONNECTOR MARKETPLACE SEARCH & FILTER ENGINE (GOD MODE vNEXT)
 * Directives: 794-815, 1537-1548, 1935-1944
 *
 * Provides fast, indexed search across the 70+ connector catalog:
 * - Full-text and semantic keyword matching (email, CRM, analytics, storage, observability, etc.).
 * - Multi-dimensional filtering by Category, Status badge, and Connection state.
 * - Zero secrets exposed. Strictly ZERO SQL.
 */

import {
  NormalizedConnectorDef,
  ConnectorCategory,
  ConnectorBadgeStatus,
} from "./connectorCatalog";
import { connectorFabric } from "./connectorFabric";

export interface ConnectorSearchFilters {
  query?: string;
  category?: ConnectorCategory | "ALL";
  statusBadge?: ConnectorBadgeStatus | "ALL";
  connectionStatus?: "ALL" | "CONNECTED" | "NOT_CONNECTED";
  authType?: string;
}

export class ConnectorMarketplace {
  private static instance: ConnectorMarketplace | null = null;

  public static getInstance(): ConnectorMarketplace {
    if (!ConnectorMarketplace.instance) {
      ConnectorMarketplace.instance = new ConnectorMarketplace();
    }
    return ConnectorMarketplace.instance;
  }

  /**
   * Evaluates semantic keyword synonyms to match capabilities (Directive 1537-1548).
   */
  private expandQueryKeywords(q: string): string[] {
    const lower = q.toLowerCase().trim();
    const keywords = [lower];

    const synonymMap: Record<string, string[]> = {
      email: ["gmail", "resend", "outlook", "mail", "communication"],
      crm: ["salesforce", "hubspot", "zoho", "leads", "contacts"],
      analytics: ["posthog", "datadog", "bigquery", "snowflake", "metrics", "events"],
      storage: ["google drive", "box", "dropbox", "files", "documents"],
      design: ["figma", "canva", "miro", "adobe", "excalidraw", "gamma"],
      research: ["pubmed", "consensus", "elicit", "scite", "kaggle", "papers", "hugging face"],
      observability: ["datadog", "sentry", "apm", "alerts", "exceptions"],
      deployment: ["vercel", "netlify", "railway", "cloudflare"],
      "project management": ["linear", "jira", "asana", "clickup", "trello", "issues"],
      vcs: ["github", "git", "commits", "repository"],
    };

    for (const [concept, matches] of Object.entries(synonymMap)) {
      if (lower.includes(concept)) {
        keywords.push(...matches);
      }
    }

    return keywords;
  }

  /**
   * Searches and filters connectors.
   */
  public search(filters: ConnectorSearchFilters = {}): NormalizedConnectorDef[] {
    const all = connectorFabric.listConnectors();
    const q = (filters.query || "").trim();
    const keywords = q ? this.expandQueryKeywords(q) : [];

    return all.filter((conn) => {
      // 1. Category filter
      if (filters.category && filters.category !== "ALL" && conn.category !== filters.category) {
        return false;
      }

      // 2. Status Badge filter
      if (filters.statusBadge && filters.statusBadge !== "ALL" && conn.statusBadge !== filters.statusBadge) {
        return false;
      }

      // 3. Connection state filter
      if (filters.connectionStatus === "CONNECTED" && !conn.isConnected) return false;
      if (filters.connectionStatus === "NOT_CONNECTED" && conn.isConnected) return false;

      // 4. Query match
      if (keywords.length > 0) {
        const target = `${conn.name} ${conn.provider} ${conn.category} ${conn.description} ${conn.capabilitySummary} ${conn.toolsProvided.join(" ")}`.toLowerCase();
        const matches = keywords.some((kw) => target.includes(kw));
        if (!matches) return false;
      }

      return true;
    });
  }

  /**
   * Returns list of available categories and counts.
   */
  public getCategoriesWithCounts(): Array<{ category: ConnectorCategory | "ALL"; count: number }> {
    const all = connectorFabric.listConnectors();
    const map: Record<string, number> = {};

    all.forEach((c) => {
      map[c.category] = (map[c.category] || 0) + 1;
    });

    const list: Array<{ category: ConnectorCategory | "ALL"; count: number }> = [
      { category: "ALL", count: all.length },
    ];

    Object.entries(map).forEach(([cat, count]) => {
      list.push({ category: cat as ConnectorCategory, count });
    });

    return list;
  }
}

export const connectorMarketplace = ConnectorMarketplace.getInstance();
