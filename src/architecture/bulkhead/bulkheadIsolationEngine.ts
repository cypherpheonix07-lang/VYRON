/**
 * VYRON — BULKHEAD ISOLATION ENGINE (IMAGE 03 PATTERN)
 * GOD MODE vULTIMA ΩΩΩΩΩΩΩΩ
 * Resource Pool Isolation, Concurrency Limits, Tenant Fairness & Blast-Radius Containment.
 * Prevents cascading dependency failures across DB, AI, Realtime, Workers, Providers, and Release.
 * Strictly ZERO Raw SQL.
 */

export type BulkheadPoolId =
  | "DATABASE_POOL"
  | "AI_LLM_POOL"
  | "REALTIME_FANOUT_POOL"
  | "BACKGROUND_WORKER_POOL"
  | "EXTERNAL_PROVIDER_POOL"
  | "RELEASE_OPERATIONS_POOL";

export interface BulkheadPoolConfig {
  id: BulkheadPoolId;
  name: string;
  maxConcurrency: number;
  maxQueueCapacity: number;
  maxTenantSharePct: number; // max % of capacity a single tenant can consume
  timeoutMs: number;
}

export interface BulkheadPoolStats {
  id: BulkheadPoolId;
  name: string;
  activeCount: number;
  maxConcurrency: number;
  queuedCount: number;
  maxQueueCapacity: number;
  rejectedTotal: number;
  utilizationPct: number;
  tenantAllocation: Record<string, number>;
}

export class BulkheadIsolationEngine {
  private static instance: BulkheadIsolationEngine | null = null;
  private pools: Map<BulkheadPoolId, BulkheadPoolConfig> = new Map();
  private activeAllocations: Map<BulkheadPoolId, Map<string, number>> = new Map();
  private activeTotals: Map<BulkheadPoolId, number> = new Map();
  private queuedTotals: Map<BulkheadPoolId, number> = new Map();
  private rejectedTotals: Map<BulkheadPoolId, number> = new Map();

  private constructor() {
    this.initializePools();
  }

  public static getInstance(): BulkheadIsolationEngine {
    if (!BulkheadIsolationEngine.instance) {
      BulkheadIsolationEngine.instance = new BulkheadIsolationEngine();
    }
    return BulkheadIsolationEngine.instance;
  }

  private initializePools(): void {
    const defaultPools: BulkheadPoolConfig[] = [
      {
        id: "DATABASE_POOL",
        name: "Database Connection Pool",
        maxConcurrency: 30,
        maxQueueCapacity: 50,
        maxTenantSharePct: 35,
        timeoutMs: 5000,
      },
      {
        id: "AI_LLM_POOL",
        name: "AI / LLM Agent Execution Pool",
        maxConcurrency: 10,
        maxQueueCapacity: 20,
        maxTenantSharePct: 30,
        timeoutMs: 25000,
      },
      {
        id: "REALTIME_FANOUT_POOL",
        name: "WebSocket Realtime Fanout Pool",
        maxConcurrency: 100,
        maxQueueCapacity: 200,
        maxTenantSharePct: 40,
        timeoutMs: 10000,
      },
      {
        id: "BACKGROUND_WORKER_POOL",
        name: "Background Job Worker Pool",
        maxConcurrency: 8,
        maxQueueCapacity: 40,
        maxTenantSharePct: 25,
        timeoutMs: 60000,
      },
      {
        id: "EXTERNAL_PROVIDER_POOL",
        name: "External Egress API Pool (GitHub/Cloudflare)",
        maxConcurrency: 15,
        maxQueueCapacity: 30,
        maxTenantSharePct: 35,
        timeoutMs: 10000,
      },
      {
        id: "RELEASE_OPERATIONS_POOL",
        name: "Release & Rollback Critical Pool",
        maxConcurrency: 5,
        maxQueueCapacity: 10,
        maxTenantSharePct: 50,
        timeoutMs: 45000,
      },
    ];

    for (const pool of defaultPools) {
      this.pools.set(pool.id, pool);
      this.activeAllocations.set(pool.id, new Map());
      this.activeTotals.set(pool.id, 0);
      this.queuedTotals.set(pool.id, 0);
      this.rejectedTotals.set(pool.id, 0);
    }
  }

  /**
   * Attempts to acquire an execution slot in a specific bulkhead pool.
   */
  public acquireSlot(
    poolId: BulkheadPoolId,
    tenantId: string
  ): { acquired: boolean; reason?: string } {
    const config = this.pools.get(poolId);
    if (!config) return { acquired: false, reason: "UNKNOWN_POOL" };

    const currentTotal = this.activeTotals.get(poolId) || 0;
    const tenantMap = this.activeAllocations.get(poolId) || new Map();
    const currentTenantCount = tenantMap.get(tenantId) || 0;

    // Check pool capacity
    if (currentTotal >= config.maxConcurrency) {
      const rejected = (this.rejectedTotals.get(poolId) || 0) + 1;
      this.rejectedTotals.set(poolId, rejected);
      return {
        acquired: false,
        reason: `Bulkhead pool '${config.name}' capacity reached (${config.maxConcurrency} active)`,
      };
    }

    // Check tenant fairness limit
    const maxTenantSlots = Math.max(1, Math.floor(config.maxConcurrency * (config.maxTenantSharePct / 100)));
    if (currentTenantCount >= maxTenantSlots) {
      const rejected = (this.rejectedTotals.get(poolId) || 0) + 1;
      this.rejectedTotals.set(poolId, rejected);
      return {
        acquired: false,
        reason: `Tenant '${tenantId}' exceeded fairness quota (${currentTenantCount}/${maxTenantSlots} slots)`,
      };
    }

    // Grant slot
    tenantMap.set(tenantId, currentTenantCount + 1);
    this.activeTotals.set(poolId, currentTotal + 1);
    return { acquired: true };
  }

  /**
   * Releases an execution slot upon task completion.
   */
  public releaseSlot(poolId: BulkheadPoolId, tenantId: string): void {
    const currentTotal = this.activeTotals.get(poolId) || 0;
    const tenantMap = this.activeAllocations.get(poolId);
    if (!tenantMap) return;

    const currentTenantCount = tenantMap.get(tenantId) || 0;
    if (currentTenantCount > 0) {
      tenantMap.set(tenantId, currentTenantCount - 1);
    }

    if (currentTotal > 0) {
      this.activeTotals.set(poolId, currentTotal - 1);
    }
  }

  /**
   * Returns snapshot statistics across all bulkhead pools.
   */
  public getPoolStats(): BulkheadPoolStats[] {
    const result: BulkheadPoolStats[] = [];

    for (const [poolId, config] of this.pools.entries()) {
      const active = this.activeTotals.get(poolId) || 0;
      const queued = this.queuedTotals.get(poolId) || 0;
      const rejected = this.rejectedTotals.get(poolId) || 0;
      const tenantMap = this.activeAllocations.get(poolId) || new Map();

      const tenantAlloc: Record<string, number> = {};
      tenantMap.forEach((count, tenant) => {
        if (count > 0) tenantAlloc[tenant] = count;
      });

      result.push({
        id: poolId,
        name: config.name,
        activeCount: active,
        maxConcurrency: config.maxConcurrency,
        queuedCount: queued,
        maxQueueCapacity: config.maxQueueCapacity,
        rejectedTotal: rejected,
        utilizationPct: Math.round((active / config.maxConcurrency) * 100),
        tenantAllocation: tenantAlloc,
      });
    }

    return result;
  }
}

export const bulkheadIsolation = BulkheadIsolationEngine.getInstance();
