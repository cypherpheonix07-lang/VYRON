/**
 * PROJECT BRAHMA — FIXTURE STORE (PHASE J.1, J.2)
 * High-fidelity domain sample dataset repository.
 * Zero SQL. Zero mutation. Pure in-memory simulation repository.
 */

import healthcareFixture from "@/lib/demo-fixtures/healthcare-sample.json";
import fintechFixture from "@/lib/demo-fixtures/fintech-sample.json";
import ecommerceFixture from "@/lib/demo-fixtures/ecommerce-sample.json";
import edtechFixture from "@/lib/demo-fixtures/edtech-sample.json";
import saasFixture from "@/lib/demo-fixtures/saas-sample.json";
import { BrahmaIntelligenceError } from "@/lib/errors/brahmaErrors";

export interface FixtureProject {
  id: string;
  name: string;
  description: string;
  domain: string;
  language: string;
  stars: number;
  lastScan: string;
  healthScore: number;
  status: string;
  repoUrl: string;
  _isDemo?: boolean;
}

export interface FixtureRequirement {
  id: string;
  module: string;
  title: string;
  desc: string;
  priority: string;
  status: string;
  _isDemo?: boolean;
}

export interface FixtureBlueprintNode {
  id: string;
  name: string;
  type: string;
  desc: string;
  _isDemo?: boolean;
}

export interface FixtureBlueprintEdge {
  id: string;
  source: string;
  target: string;
  _isDemo?: boolean;
}

export interface FixtureFinding {
  id: string;
  type: string;
  file: string;
  function?: string;
  value?: number;
  threshold?: number;
  line?: number;
  desc?: string;
  severity?: string;
  cwe?: string;
  _isDemo?: boolean;
}

export interface FixtureVulnerability {
  id: string;
  cwe: string;
  severity: string;
  score: number;
  title: string;
  desc: string;
  _isDemo?: boolean;
}

export interface FixtureTest {
  id: string;
  name: string;
  suite: string;
  status: string;
  duration_ms: number;
  _isDemo?: boolean;
}

export interface FixtureReport {
  id: string;
  title: string;
  date: string;
  summary: string;
  gateStatus: string;
  _isDemo?: boolean;
}

export interface FixtureActivityEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  status: string;
  _isDemo?: boolean;
}

export interface FixtureCommit {
  hash: string;
  author: string;
  message: string;
  timestamp: string;
  _isDemo?: boolean;
}

export interface FixtureSet {
  domain: string;
  project: FixtureProject;
  requirements: FixtureRequirement[];
  blueprintNodes: FixtureBlueprintNode[];
  blueprintEdges: FixtureBlueprintEdge[];
  codeFindings: FixtureFinding[];
  vulnerabilities: FixtureVulnerability[];
  tests: FixtureTest[];
  reports: FixtureReport[];
  activityEvents: FixtureActivityEvent[];
  commits: FixtureCommit[];
}

export type DomainFixture = FixtureSet;

function tagDemo<T extends object>(items: T[]): T[] {
  return items.map((item) => ({ ...item, _isDemo: true }));
}

class FixtureStore {
  private static instance: FixtureStore | null = null;
  private fixtures: Map<string, FixtureSet> = new Map();

  private constructor() {
    this.register("healthcare", healthcareFixture as unknown as FixtureSet);
    this.register("fintech", fintechFixture as unknown as FixtureSet);
    this.register("ecommerce", ecommerceFixture as unknown as FixtureSet);
    this.register("edtech", edtechFixture as unknown as FixtureSet);
    this.register("saas", saasFixture as unknown as FixtureSet);
  }

  public static getInstance(): FixtureStore {
    if (!FixtureStore.instance) {
      FixtureStore.instance = new FixtureStore();
    }
    return FixtureStore.instance;
  }

  private register(domain: string, data: FixtureSet) {
    const tagged: FixtureSet = {
      ...data,
      domain,
      project: { ...data.project, _isDemo: true },
      requirements: tagDemo(data.requirements || []),
      blueprintNodes: tagDemo(data.blueprintNodes || []),
      blueprintEdges: tagDemo(data.blueprintEdges || []),
      codeFindings: tagDemo(data.codeFindings || []),
      vulnerabilities: tagDemo(data.vulnerabilities || []),
      tests: tagDemo(data.tests || []),
      reports: tagDemo(data.reports || []),
      activityEvents: tagDemo(data.activityEvents || []),
      commits: tagDemo(data.commits || []),
    };
    this.fixtures.set(domain.toLowerCase(), tagged);
  }

  public get(domain: string): FixtureSet {
    const normalized = (domain || "").toLowerCase().trim();
    const match = this.fixtures.get(normalized);
    if (match) {
      return match;
    }

    // Default fallback to fintech (FinLedger flagship demo)
    const fallback = this.fixtures.get("fintech");
    if (!fallback) {
      throw new BrahmaIntelligenceError(
        "BRA-603",
        `Demo fixture store corrupted. No fixtures loaded for domain '${domain}'.`
      );
    }
    return fallback;
  }

  public list(): string[] {
    return Array.from(this.fixtures.keys());
  }

  public search(query: string): FixtureSet[] {
    const q = (query || "").toLowerCase().trim();
    if (!q) return Array.from(this.fixtures.values());

    return Array.from(this.fixtures.values()).filter((fix) => {
      return (
        fix.domain.toLowerCase().includes(q) ||
        fix.project.name.toLowerCase().includes(q) ||
        fix.project.description.toLowerCase().includes(q)
      );
    });
  }
}

export const fixtureStore = FixtureStore.getInstance();
