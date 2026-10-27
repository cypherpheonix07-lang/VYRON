/**
 * VYRON — TRANSACTIONAL OUTBOX ENGINE (IMAGE 04 PATTERN)
 * GOD MODE vULTIMA ΩΩΩΩΩΩΩΩ
 * Atomic State + Outbox Persistence, Asynchronous Relay, Idempotent Consumers,
 * Deduplication Cache, Dead Letter Queue (DLQ), and Replay Reconciliation.
 * Strictly ZERO Raw SQL.
 */

export type OutboxEventStatus = "PENDING" | "RELAYED" | "PROCESSED" | "FAILED" | "DLQ";

export interface OutboxEvent<T = unknown> {
  eventId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: T;
  correlationId: string;
  causationId?: string | undefined;
  idempotencyKey: string;
  status: OutboxEventStatus;
  retryCount: number;
  maxRetries: number;
  errorReason?: string | undefined;
  createdAt: string;
  relayedAt?: string | undefined;
  processedAt?: string | undefined;
}

export interface BusinessEntity {
  id: string;
  version: number;
  data: Record<string, unknown>;
  updatedAt: string;
}

export class TransactionalOutboxEngine {
  private static instance: TransactionalOutboxEngine | null = null;
  private businessStore: Map<string, BusinessEntity> = new Map();
  private outboxStore: Map<string, OutboxEvent> = new Map();
  private processedIdempotencyKeys: Set<string> = new Set();
  private deadLetterQueue: OutboxEvent[] = [];
  private eventHandlers: Map<string, Array<(event: OutboxEvent) => Promise<boolean>>> = new Map();

  private constructor() {
    this.registerCoreEventHandlers();
  }

  public static getInstance(): TransactionalOutboxEngine {
    if (!TransactionalOutboxEngine.instance) {
      TransactionalOutboxEngine.instance = new TransactionalOutboxEngine();
    }
    return TransactionalOutboxEngine.instance;
  }

  private registerCoreEventHandlers(): void {
    this.subscribe("PROJECT_DEPLOYED", async (event) => {
      // Idempotent handler for deployment confirmation
      return true;
    });

    this.subscribe("GATE_EVALUATED", async (event) => {
      // Idempotent handler for gate evaluation broadcast
      return true;
    });
  }

  /**
   * Atomic Transaction: Commits business entity mutation and outbox event atomically.
   */
  public atomicCommit<T>(params: {
    entityId: string;
    entityData: Record<string, unknown>;
    aggregateType: string;
    eventType: string;
    payload: T;
    correlationId: string;
    idempotencyKey: string;
  }): { success: boolean; eventId: string; entity: BusinessEntity } {
    const now = new Date().toISOString();

    // Check duplicate idempotency key
    if (this.processedIdempotencyKeys.has(params.idempotencyKey)) {
      const existingEntity = this.businessStore.get(params.entityId) || {
        id: params.entityId,
        version: 1,
        data: params.entityData,
        updatedAt: now,
      };
      return {
        success: true,
        eventId: `IDEMPOTENT_REUSE_${params.idempotencyKey}`,
        entity: existingEntity,
      };
    }

    const currentEntity = this.businessStore.get(params.entityId);
    const newVersion = (currentEntity?.version || 0) + 1;

    const updatedEntity: BusinessEntity = {
      id: params.entityId,
      version: newVersion,
      data: { ...(currentEntity?.data || {}), ...params.entityData },
      updatedAt: now,
    };

    const eventId = `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const outboxRecord: OutboxEvent<T> = {
      eventId,
      aggregateType: params.aggregateType,
      aggregateId: params.entityId,
      eventType: params.eventType,
      payload: params.payload,
      correlationId: params.correlationId,
      idempotencyKey: params.idempotencyKey,
      status: "PENDING",
      retryCount: 0,
      maxRetries: 3,
      createdAt: now,
    };

    // Atomic write into memory maps (in production backed by DB transaction)
    this.businessStore.set(params.entityId, updatedEntity);
    this.outboxStore.set(eventId, outboxRecord as OutboxEvent);
    this.processedIdempotencyKeys.add(params.idempotencyKey);

    return {
      success: true,
      eventId,
      entity: updatedEntity,
    };
  }

  /**
   * Helper for tests & workflows: Commits mutation with transactional outbox and returns typed outbox event
   */
  public async commitWithOutbox<T>(
    aggregateType: string,
    entityData: Record<string, unknown>,
    eventType: string,
    payload: T,
    idempotencyKey: string,
    entityId: string = `entity-${Date.now()}`
  ): Promise<{ success: boolean; outboxEvent: OutboxEvent<T>; entity: BusinessEntity }> {
    const isDuplicate = this.processedIdempotencyKeys.has(idempotencyKey);
    const res = this.atomicCommit({
      entityId,
      entityData,
      aggregateType,
      eventType,
      payload,
      correlationId: `corr-${Date.now()}`,
      idempotencyKey,
    });
    const outboxEvent: OutboxEvent<T> = (this.outboxStore.get(res.eventId) as unknown as OutboxEvent<T>) || {
      eventId: res.eventId,
      aggregateType,
      aggregateId: entityId,
      eventType,
      payload,
      correlationId: `corr-${Date.now()}`,
      idempotencyKey,
      status: isDuplicate ? "PROCESSED" : "PENDING",
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString(),
    };
    return {
      success: res.success,
      outboxEvent,
      entity: res.entity,
    };
  }

  /**
   * Registers an event consumer handler.
   */
  public subscribe(eventType: string, handler: (event: OutboxEvent) => Promise<boolean>): void {
    const list = this.eventHandlers.get(eventType) || [];
    list.push(handler);
    this.eventHandlers.set(eventType, list);
  }

  /**
   * Asynchronous Relay Runner: Relays pending events to subscribers and manages delivery state machine.
   */
  public async relayPendingEvents(): Promise<{ relayedCount: number; failedCount: number }> {
    let relayedCount = 0;
    let failedCount = 0;

    for (const event of this.outboxStore.values()) {
      if (event.status === "PENDING" || event.status === "FAILED") {
        if (event.retryCount >= event.maxRetries) {
          event.status = "DLQ";
          this.deadLetterQueue.push(event);
          failedCount++;
          continue;
        }

        const handlers = this.eventHandlers.get(event.eventType) || [];
        event.status = "RELAYED";
        event.relayedAt = new Date().toISOString();

        try {
          let allSuccess = true;
          for (const handler of handlers) {
            const ok = await handler(event);
            if (!ok) allSuccess = false;
          }

          if (allSuccess) {
            event.status = "PROCESSED";
            event.processedAt = new Date().toISOString();
            relayedCount++;
          } else {
            event.status = "FAILED";
            event.retryCount += 1;
            event.errorReason = "Handler returned partial failure";
            failedCount++;
          }
        } catch (err: unknown) {
          event.status = "FAILED";
          event.retryCount += 1;
          event.errorReason = err instanceof Error ? err.message : String(err);
          failedCount++;
        }
      }
    }

    return { relayedCount, failedCount };
  }

  /**
   * Replays an event from the Dead Letter Queue.
   */
  public async replayDlqEvent(eventId: string): Promise<boolean> {
    const idx = this.deadLetterQueue.findIndex((e) => e.eventId === eventId);
    if (idx === -1) return false;

    const event = this.deadLetterQueue[idx];
    if (!event) return false;

    event.status = "PENDING";
    event.retryCount = 0;
    delete event.errorReason;

    this.deadLetterQueue.splice(idx, 1);
    this.outboxStore.set(eventId, event);
    await this.relayPendingEvents();
    return true;
  }

  public getOutboxEvents(): OutboxEvent[] {
    return Array.from(this.outboxStore.values());
  }

  public getDlqEvents(): OutboxEvent[] {
    return [...this.deadLetterQueue];
  }

  public getBusinessEntity(entityId: string): BusinessEntity | undefined {
    return this.businessStore.get(entityId);
  }
}

export const transactionalOutbox = TransactionalOutboxEngine.getInstance();
