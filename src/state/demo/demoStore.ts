/**
 * PROJECT BRAHMA — DEMO CONTROLLER & SIMULATOR STORE
 * Manages active Kaggle demo datasets, canonical column mappings, and real-time domain event simulation.
 * Strict isolation: Simulator outputs trigger real domain analysis without modifying production tables.
 * Strictly ZERO SQL.
 */

export interface KaggleDatasetMeta {
  id: string;
  title: string;
  slug: string;
  category: string;
  totalRecords: number;
  fileSizeBytes: number;
  license: string;
  owner: string;
  qualityScore: number;
  completenessPct: number;
  uniquenessPct: number;
  validityPct: number;
  columns: Array<{ name: string; type: string; nullCount: number; sample: string }>;
  isImported: boolean;
}

export interface ColumnMapping {
  sourceColumn: string;
  canonicalField: string;
  confidence: number;
  isApproved: boolean;
}

export interface DomainEvent {
  id: string;
  timestamp: string;
  entityId: string;
  entityName?: string | undefined;
  eventType: "TRANSACTION" | "AUTH_ATTEMPT" | "API_CALL" | "DATA_TRANSFER" | string;
  amount?: number | undefined;
  riskScore: number;
  isAnomalous: boolean;
  anomalyReason?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface SimulatedDomainEvent {
  id: string;
  type: string;
  timestamp: string;
  entityId: string;
  payload: Record<string, unknown>;
  isAnomaly: boolean;
  riskScore: number;
}

export interface BenchmarkDataset {
  id: string;
  name: string;
  description: string;
  totalRecords: number;
  sampleRows: Array<Record<string, unknown>>;
}

export const BENCHMARK_DATASETS: BenchmarkDataset[] = [
  {
    id: "ieee_fraud_benchmark",
    name: "IEEE-CIS Credit Card Fraud Benchmark",
    description:
      "Real-world e-commerce carding events, IP velocity metrics, and identity verification logs.",
    totalRecords: 12480,
    sampleRows: [
      {
        id: "TX-1001",
        user_id: "USR-9921",
        amount: 489.5,
        ip_address: "192.168.1.10",
        velocity_last_hour: 12,
        is_cross_border: true,
      },
      {
        id: "TX-1002",
        user_id: "USR-8812",
        amount: 24.0,
        ip_address: "10.0.0.12",
        velocity_last_hour: 1,
        is_cross_border: false,
      },
      {
        id: "TX-1003",
        user_id: "USR-9921",
        amount: 940.0,
        ip_address: "185.220.101.5",
        velocity_last_hour: 15,
        is_cross_border: true,
      },
      {
        id: "TX-1004",
        user_id: "USR-3450",
        amount: 110.2,
        ip_address: "10.0.0.45",
        velocity_last_hour: 2,
        is_cross_border: false,
      },
      {
        id: "TX-1005",
        user_id: "USR-9921",
        amount: 1520.0,
        ip_address: "185.220.101.5",
        velocity_last_hour: 18,
        is_cross_border: true,
      },
      {
        id: "TX-1006",
        user_id: "USR-4421",
        amount: 62.0,
        ip_address: "172.16.0.4",
        velocity_last_hour: 1,
        is_cross_border: false,
      },
      {
        id: "TX-1007",
        user_id: "USR-7731",
        amount: 780.0,
        ip_address: "194.26.29.11",
        velocity_last_hour: 9,
        is_cross_border: true,
      },
      {
        id: "TX-1008",
        user_id: "USR-1092",
        amount: 15.5,
        ip_address: "10.0.0.88",
        velocity_last_hour: 1,
        is_cross_border: false,
      },
    ],
  },
  {
    id: "clinical_scheduling",
    name: "Clinical Appointment Scheduling & No-Shows",
    description: "110,000 appointment scheduling logs examining patient adherence and clinic load.",
    totalRecords: 110527,
    sampleRows: [
      {
        id: "APT-5001",
        user_id: "PAT-102",
        amount: 150.0,
        ip_address: "10.10.1.20",
        velocity_last_hour: 1,
        is_cross_border: false,
      },
      {
        id: "APT-5002",
        user_id: "PAT-304",
        amount: 80.0,
        ip_address: "10.10.1.25",
        velocity_last_hour: 4,
        is_cross_border: false,
      },
      {
        id: "APT-5003",
        user_id: "PAT-991",
        amount: 450.0,
        ip_address: "172.20.5.12",
        velocity_last_hour: 8,
        is_cross_border: true,
      },
    ],
  },
  {
    id: "ecommerce_orders",
    name: "Brazilian E-Commerce Market Orders",
    description:
      "100,000 public orders tracking fulfillment speed, seller score, and payment methods.",
    totalRecords: 100000,
    sampleRows: [
      {
        id: "ORD-9001",
        user_id: "CUST-411",
        amount: 89.9,
        ip_address: "191.240.12.1",
        velocity_last_hour: 2,
        is_cross_border: false,
      },
      {
        id: "ORD-9002",
        user_id: "CUST-822",
        amount: 1240.0,
        ip_address: "191.240.12.99",
        velocity_last_hour: 11,
        is_cross_border: true,
      },
    ],
  },
];

export interface DemoState {
  activeDataset: KaggleDatasetMeta | null;
  mappings: ColumnMapping[];
  simulatorStatus: "STOPPED" | "STREAMING" | "PAUSED";
  eventRate: number; // events per sec (1 - 100)
  burstSize: number; // 1 - 20
  metrics: {
    processedCount: number;
    pendingCount: number;
    rejectedCount: number;
    suspiciousCount: number;
    currentThroughput: number;
  };
  recentEvents: DomainEvent[];
  anomalyTimeline: Array<{ time: string; normalCount: number; anomalyCount: number }>;
  // Real-time simulator fields
  isSimulatorRunning: boolean;
  eventsPerSecond: number;
  totalSimulatedEvents: number;
  anomaliesTriggered: number;
  selectedDatasetId: string;
  availableDatasets: BenchmarkDataset[];
  simulatedEvents: SimulatedDomainEvent[];
}

type DemoListener = (state: DemoState) => void;

class DemoStore {
  private state: DemoState;
  private listeners: Set<DemoListener> = new Set();
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.state = {
      activeDataset: {
        id: "kaggle-ieee-fraud",
        title: "IEEE-CIS Fraud Detection Benchmark",
        slug: "ieee-fraud-detection",
        category: "FINTECH_SECURITY",
        totalRecords: 12480,
        fileSizeBytes: 498201000,
        license: "CC BY-SA 4.0",
        owner: "IEEE CIS",
        qualityScore: 98.4,
        completenessPct: 99.8,
        uniquenessPct: 94.2,
        validityPct: 99.1,
        isImported: true,
        columns: [
          { name: "TransactionID", type: "integer", nullCount: 0, sample: "2987000" },
          { name: "isFraud", type: "boolean", nullCount: 0, sample: "0" },
          { name: "TransactionAmt", type: "float", nullCount: 0, sample: "68.50" },
          { name: "ProductCD", type: "string", nullCount: 0, sample: "W" },
          { name: "card1", type: "integer", nullCount: 0, sample: "13926" },
        ],
      },
      mappings: [
        {
          sourceColumn: "TransactionID",
          canonicalField: "event_id",
          confidence: 0.99,
          isApproved: true,
        },
        {
          sourceColumn: "isFraud",
          canonicalField: "is_anomaly",
          confidence: 0.98,
          isApproved: true,
        },
        {
          sourceColumn: "TransactionAmt",
          canonicalField: "monetary_value",
          confidence: 0.96,
          isApproved: true,
        },
        { sourceColumn: "card1", canonicalField: "entity_id", confidence: 0.94, isApproved: true },
      ],
      simulatorStatus: "STOPPED",
      eventRate: 25,
      burstSize: 5,
      metrics: {
        processedCount: 12480,
        pendingCount: 0,
        rejectedCount: 42,
        suspiciousCount: 18,
        currentThroughput: 0,
      },
      recentEvents: [],
      anomalyTimeline: [],
      isSimulatorRunning: false,
      eventsPerSecond: 25,
      totalSimulatedEvents: 1248,
      anomaliesTriggered: 18,
      selectedDatasetId: "ieee_fraud_benchmark",
      availableDatasets: BENCHMARK_DATASETS,
      simulatedEvents: [],
    };
  }

  public getState(): DemoState {
    return this.state;
  }

  public getSelectedDataset(): BenchmarkDataset {
    const found = BENCHMARK_DATASETS.find((d) => d.id === this.state.selectedDatasetId);
    return found ?? BENCHMARK_DATASETS[0]!;
  }

  public selectDataset(datasetId: string) {
    this.state = {
      ...this.state,
      selectedDatasetId: datasetId,
    };
    this.notify();
  }

  public setSimulatorRunning(running: boolean) {
    this.state = {
      ...this.state,
      isSimulatorRunning: running,
      simulatorStatus: running ? "STREAMING" : "PAUSED",
    };
    this.notify();
  }

  public setThroughput(eps: number) {
    this.state = {
      ...this.state,
      eventsPerSecond: eps,
      eventRate: eps,
      metrics: {
        ...this.state.metrics,
        currentThroughput: eps,
      },
    };
    this.notify();
  }

  public pushEvent(event: SimulatedDomainEvent) {
    const isAnomaly = event.isAnomaly;
    this.state = {
      ...this.state,
      totalSimulatedEvents: this.state.totalSimulatedEvents + 1,
      anomaliesTriggered: this.state.anomaliesTriggered + (isAnomaly ? 1 : 0),
      simulatedEvents: [event, ...this.state.simulatedEvents].slice(0, 100),
      recentEvents: [
        {
          id: event.id,
          timestamp: event.timestamp,
          entityId: event.entityId,
          eventType: event.type,
          amount:
            typeof event.payload["amount"] === "number"
              ? (event.payload["amount"] as number)
              : undefined,
          riskScore: event.riskScore,
          isAnomalous: isAnomaly,
          anomalyReason: isAnomaly ? "Deviated from statistical IQR baseline" : undefined,
          metadata: event.payload,
        },
        ...this.state.recentEvents,
      ].slice(0, 50),
    };
    this.notify();
  }

  public subscribe(listener: DemoListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const demoStore = new DemoStore();
