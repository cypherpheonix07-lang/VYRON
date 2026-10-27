/**
 * VYRON — OPENAI BACKEND SENTINEL INCIDENT & ALERT STORE
 * Manages live backend alerts, defect classifications, root cause mappings,
 * and postcondition evidence records.
 * Strictly ZERO Raw SQL.
 */

export type DefectSeverity = "LOW" | "MEDIUM" | "HIGH" | "ULTRA_HIGH";

export type IncidentStatus =
  | "DETECTED"
  | "LOCALIZING"
  | "REPRODUCING"
  | "CONTAINED"
  | "REMEDIATING"
  | "VERIFYING"
  | "CLOSED";

export interface RootCauseChain {
  trigger: string;
  firstObservableSymptom: string;
  firstIncorrectState: string;
  violatedInvariant: string;
  responsibleComponent: string;
  contributingConditions: string[];
  detectionGap: string;
  rootCause: string;
  blastRadius: "LOCAL_ISOLATED" | "BOUNDED_SERVICE" | "TENANT_WIDE" | "SYSTEMIC";
  containment: string;
  remediationPlan: string;
  regressionProof: string;
  postconditionEvidenceId: string;
  closureEvidenceId: string;
}

export interface SentinelIncident {
  incidentId: string;
  severity: DefectSeverity;
  status: IncidentStatus;
  firstSeen: string;
  lastSeen: string;
  environment: "PRODUCTION" | "STAGING" | "CANARY" | "SANDBOX";
  tenantScope: string;
  affectedComponent: string;
  affectedData: string;
  title: string;
  description: string;
  expectedBehavior: string;
  observedBehavior: string;
  firstIncorrectTransition: string;
  rootCauseChain?: RootCauseChain;
  traceIds: string[];
  eventIds: string[];
  evidenceIds: string[];
  approvalTicketId?: string;
  remediationCandidateId?: string;
  freshness: "LIVE" | "FRESH" | "DELAYED" | "STALE";
  epistemicClassification: "OBSERVED_FACT" | "DERIVED_FACT" | "HYPOTHESIS" | "VERIFIED_RESULT";
}

class SentinelIncidentStoreEngine {
  private incidents: Map<string, SentinelIncident> = new Map();
  private listeners: Set<(incidents: SentinelIncident[]) => void> = new Set();

  constructor() {
    this.seedBaselineIncidents();
  }

  public getIncidents(): SentinelIncident[] {
    return Array.from(this.incidents.values()).sort(
      (a, b) => new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime()
    );
  }

  public getIncident(id: string): SentinelIncident | undefined {
    return this.incidents.get(id);
  }

  public registerIncident(incident: SentinelIncident): void {
    this.incidents.set(incident.incidentId, incident);
    this.notify();
  }

  public updateIncidentStatus(id: string, status: IncidentStatus, patch: Partial<SentinelIncident> = {}): void {
    const existing = this.incidents.get(id);
    if (!existing) return;

    this.incidents.set(id, {
      ...existing,
      ...patch,
      status,
      lastSeen: new Date().toISOString(),
    });
    this.notify();
  }

  public subscribe(cb: (incidents: SentinelIncident[]) => void): () => void {
    this.listeners.add(cb);
    cb(this.getIncidents());
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    const list = this.getIncidents();
    for (const listener of this.listeners) {
      listener(list);
    }
  }

  private seedBaselineIncidents(): void {
    // Clean initial healthy state with 1 resolved calibration incident
    const baselineIncident: SentinelIncident = {
      incidentId: "INC-CALIB-001",
      severity: "LOW",
      status: "CLOSED",
      firstSeen: new Date(Date.now() - 3600000).toISOString(),
      lastSeen: new Date(Date.now() - 1800000).toISOString(),
      environment: "SANDBOX",
      tenantScope: "global",
      affectedComponent: "EventOutboxRelay",
      affectedData: "synthetic_heartbeat_payload",
      title: "Synthetic Outbox Micro-Jitter Calibrated",
      description: "Observed 18ms jitter in sandbox outbox delivery during cold-start boot.",
      expectedBehavior: "Outbox delivery latency sub-20ms under all cold start conditions.",
      observedBehavior: "Outbox delivery latency spiked to 38ms during initial worker spawn.",
      firstIncorrectTransition: "Worker pool spin-up delayed queue consumption by 18ms.",
      traceIds: ["tr-calib-1790424001"],
      eventIds: ["ev-outbox-001"],
      evidenceIds: ["ev-proof-calib-998"],
      freshness: "FRESH",
      epistemicClassification: "VERIFIED_RESULT",
      rootCauseChain: {
        trigger: "Worker cold spawn under zero traffic",
        firstObservableSymptom: "Outbox delivery took 38ms instead of 15ms",
        firstIncorrectState: "Worker concurrency warm-pool was idle",
        violatedInvariant: "Outbox latency <= 25ms SLO",
        responsibleComponent: "WorkerPoolAutoscaler",
        contributingConditions: ["Cold JVM / Node process startup", "Lazy connection pool init"],
        detectionGap: "No pre-warmed idle worker maintained",
        rootCause: "Worker pool min_idle set to 0 instead of 1 in sandbox configuration",
        blastRadius: "LOCAL_ISOLATED",
        containment: "Set sandbox min_idle to 1 worker",
        remediationPlan: "Pre-warm connection pool on bootstrap",
        regressionProof: "100 iterations of outbox write showed 12ms steady latency",
        postconditionEvidenceId: "ev-post-calib-101",
        closureEvidenceId: "ev-close-calib-102",
      },
    };

    this.incidents.set(baselineIncident.incidentId, baselineIncident);
  }
}

export const sentinelIncidentStore = new SentinelIncidentStoreEngine();
