/**
 * PROJECT BRAHMA — REAL-TIME EVENT SIMULATOR
 * Streams high-frequency transactional and operational events for Demo Mode.
 * Bridges simulator telemetry to the live analysis engine and event bus.
 */

import { demoStore, SimulatedDomainEvent } from "../../state/demo/demoStore";
import { pipelineEventBus } from "../orchestrator/eventBus";

export class EventSimulatorService {
  private timer: ReturnType<typeof setInterval> | null = null;
  private isRunning: boolean = false;

  public start(eventsPerSecond: number = 25) {
    if (this.isRunning) return;
    this.isRunning = true;
    demoStore.setSimulatorRunning(true);
    demoStore.setThroughput(eventsPerSecond);

    const intervalMs = Math.max(20, Math.floor(1000 / eventsPerSecond));

    this.timer = setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    demoStore.setSimulatorRunning(false);
  }

  public setSpeed(eps: number) {
    const wasRunning = this.isRunning;
    if (wasRunning) {
      this.stop();
      this.start(eps);
    } else {
      demoStore.setThroughput(eps);
    }
  }

  public injectAnomalyWave(count: number = 5) {
    const selected = demoStore.getSelectedDataset();
    for (let i = 0; i < count; i++) {
      const anomalyEvent: SimulatedDomainEvent = {
        id: `ANOM_${Date.now()}_${i}`,
        type: "BURST_CARDING_ATTEMPT",
        timestamp: new Date().toISOString(),
        entityId: `USR-SUSPECT-${Math.floor(Math.random() * 800) + 100}`,
        payload: {
          amount: Math.floor(Math.random() * 2000) + 850,
          ip: "185.220.101.5",
          riskScore: Math.floor(Math.random() * 25) + 75,
          datasetRef: selected.id,
        },
        isAnomaly: true,
        riskScore: Math.floor(Math.random() * 25) + 75,
      };

      demoStore.pushEvent(anomalyEvent);
      pipelineEventBus.emit("FINDING_EMITTED", anomalyEvent);
    }
  }

  private tick() {
    const selected = demoStore.getSelectedDataset();
    const isAnomaly = Math.random() < 0.08; // 8% baseline anomaly probability
    const eventType =
      selected.id === "clinical_scheduling"
        ? "APPOINTMENT_SLOT_UPDATE"
        : selected.id === "ecommerce_orders"
          ? "ORDER_CHECKOUT"
          : "TRANSACTION_SETTLED";

    const baseScore = isAnomaly
      ? Math.floor(Math.random() * 35) + 65
      : Math.floor(Math.random() * 20) + 5;

    const event: SimulatedDomainEvent = {
      id: `EVT_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: eventType,
      timestamp: new Date().toISOString(),
      entityId: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
      payload: {
        amount: Math.round(Math.random() * 200 + 10),
        latencyMs: Math.round(Math.random() * 40 + 12),
        dataset: selected.id,
      },
      isAnomaly,
      riskScore: baseScore,
    };

    demoStore.pushEvent(event);
    pipelineEventBus.emit("TELEMETRY_TICK", event);
  }
}

export const eventSimulator = new EventSimulatorService();
