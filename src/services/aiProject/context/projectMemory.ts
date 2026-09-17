/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * 7-Tier Project Memory Subsystem (Phase 03)
 * Strictly ZERO Raw SQL.
 */

export interface AdrRecord {
  id: string;
  number: number;
  title: string;
  status: "proposed" | "accepted" | "superseded" | "rejected";
  context: string;
  decision: string;
  alternatives: string[];
  consequences: string[];
  affectedComponents: string[];
  createdAt: string;
}

export interface EvidenceRecord {
  id: string;
  claim: string;
  type: "fact" | "inference" | "assumption" | "recommendation";
  source: string;
  confidence: number;
  verified: boolean;
}

export interface ProjectMemorySnapshot {
  version: number;
  timestamp: string;
  summary: string;
  stateHash: string;
}

export class ProjectMemory {
  private static instance: ProjectMemory | null = null;

  // 7 Memory Tiers
  private shortTermMemory: string[] = [];
  private workflowLog: string[] = [];
  private adrStore: Map<string, AdrRecord> = new Map();
  private evidenceStore: Map<string, EvidenceRecord> = new Map();
  private historicalSnapshots: ProjectMemorySnapshot[] = [];
  private semanticIndex: Map<string, string[]> = new Map();

  private constructor() {}

  public static getInstance(): ProjectMemory {
    if (!ProjectMemory.instance) {
      ProjectMemory.instance = new ProjectMemory();
    }
    return ProjectMemory.instance;
  }

  // Tier 1: Short-Term
  public addInteraction(turn: string) {
    this.shortTermMemory.push(turn);
    if (this.shortTermMemory.length > 20) this.shortTermMemory.shift();
  }

  // Tier 2: Workflow
  public logWorkflowTransition(from: string, to: string, reason: string) {
    this.workflowLog.push(`[${new Date().toISOString()}] Transition ${from} -> ${to}: ${reason}`);
  }

  // Tier 4: ADR Engine
  public recordAdr(adr: AdrRecord) {
    this.adrStore.set(adr.id, adr);
  }

  public listAdrs(): AdrRecord[] {
    return Array.from(this.adrStore.values());
  }

  // Tier 5: Evidence
  public recordEvidence(evidence: EvidenceRecord) {
    this.evidenceStore.set(evidence.id, evidence);
  }

  public listEvidence(): EvidenceRecord[] {
    return Array.from(this.evidenceStore.values());
  }

  // Tier 6: Historical Snapshots
  public recordSnapshot(snapshot: ProjectMemorySnapshot) {
    this.historicalSnapshots.push(snapshot);
  }

  public getSnapshots(): ProjectMemorySnapshot[] {
    return [...this.historicalSnapshots];
  }

  // Tier 7: Semantic Index
  public indexConcept(keyword: string, referenceIds: string[]) {
    this.semanticIndex.set(keyword.toLowerCase(), referenceIds);
  }

  public searchConcepts(query: string): string[] {
    const terms = query.toLowerCase().split(/\s+/);
    const results = new Set<string>();
    for (const term of terms) {
      const match = this.semanticIndex.get(term);
      if (match) match.forEach((id) => results.add(id));
    }
    return Array.from(results);
  }
}

export const projectMemory = ProjectMemory.getInstance();
