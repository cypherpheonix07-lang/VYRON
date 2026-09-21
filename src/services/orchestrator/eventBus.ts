/**
 * PROJECT BRAHMA — PIPELINE EVENT BUS
 * Provides lightweight PubSub/SSE-compatible telemetry streaming for live analysis runs and simulators.
 */

export interface PipelineEvent<T = unknown> {
  type:
    | "STAGE_START"
    | "STAGE_PROGRESS"
    | "STAGE_COMPLETE"
    | "STAGE_ERROR"
    | "FINDING_EMITTED"
    | "TELEMETRY_TICK";
  stageId?: number | undefined;
  timestamp: string;
  payload: T;
}

type EventListener<T = unknown> = (event: PipelineEvent<T>) => void;

class PipelineEventBus {
  private listeners: Map<string, Set<EventListener<unknown>>> = new Map();

  public on<T>(eventType: PipelineEvent["type"], callback: EventListener<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback as EventListener<unknown>);

    return () => {
      this.listeners.get(eventType)?.delete(callback as EventListener<unknown>);
    };
  }

  public emit<T>(type: PipelineEvent["type"], payload: T, stageId?: number) {
    const event: PipelineEvent<T> = {
      type,
      stageId,
      timestamp: new Date().toISOString(),
      payload,
    };

    const specificListeners = this.listeners.get(type);
    if (specificListeners) {
      specificListeners.forEach((fn) => {
        try {
          fn(event);
        } catch (e) {
          console.error(`Error in event listener for ${type}:`, e);
        }
      });
    }
  }

  public clear() {
    this.listeners.clear();
  }
}

export const pipelineEventBus = new PipelineEventBus();
