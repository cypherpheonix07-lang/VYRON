/**
 * PROJECT BRAHMA — Deterministic PRNG Mock Engine & Data Fabric
 * Seeded PRNG: mulberry32
 * Named Seeds:
 *  - ALPHA: Balanced, typical healthy production workload
 *  - BETA: Critical security vulnerabilities, failed release gates
 *  - GAMMA: Cold start / empty state across all surfaces
 *  - DELTA: Low requirement clarity, failed build/analysis states
 *  - EPSILON: Scale testing (long names, zero coverage edges, pagination stress)
 */

export type NamedSeed = "ALPHA" | "BETA" | "GAMMA" | "DELTA" | "EPSILON";

export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedToNumeric(seedName: NamedSeed | string): number {
  switch (seedName) {
    case "ALPHA":
      return 133701;
    case "BETA":
      return 987654;
    case "GAMMA":
      return 424242;
    case "DELTA":
      return 777123;
    case "EPSILON":
      return 555888;
    default: {
      let hash = 0;
      for (let i = 0; i < seedName.length; i++) {
        hash = (hash << 5) - hash + seedName.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash) || 1;
    }
  }
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin" | "reviewer";
  avatar: string;
  department: string;
  status: "active" | "invited" | "suspended";
}

export interface MockProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  ownerId: string;
  ownerName: string;
  status:
    | "healthy"
    | "medium"
    | "critical"
    | "low_clarity"
    | "no_repo"
    | "generating"
    | "failed"
    | "published";
  healthScore: number;
  securityScore: number;
  riskScore: number;
  clarityScore: number;
  testCoverage: number;
  codeComplexityAvg: number;
  vulnerabilityCount: number;
  cweList: string[];
  nodesCount: number;
  orphanNodesCount: number;
  missingFkCount: number;
  unauthenticatedRoutesCount: number;
  createdAt: string;
  updatedAt: string;
  repoUrl?: string;
  branch?: string;
}

export interface MockAuthEvent {
  id: string;
  userId: string;
  userEmail: string;
  event: string;
  method: string;
  status: "success" | "failed";
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  ip: string;
  city: string;
  country: string;
  timestamp: string;
}

export interface MockAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
  timestamp: string;
  status: "SUCCESS" | "OVERRIDDEN" | "BLOCKED";
}

export class BrahmaMockEngine {
  private prng: () => number;
  public seed: NamedSeed;

  constructor(seed: NamedSeed = "ALPHA") {
    this.seed = seed;
    this.prng = mulberry32(seedToNumeric(seed));
  }

  private rand(): number {
    return this.prng();
  }

  private randInt(min: number, max: number): number {
    return Math.floor(this.rand() * (max - min + 1)) + min;
  }

  private randPick<T>(arr: T[]): T {
    return arr[this.randInt(0, arr.length - 1)]!;
  }

  public getUsers(): MockUser[] {
    const baseTeam: MockUser[] = [
      {
        id: "usr-puli-01",
        name: "Puli Phanindhra",
        email: "puli.phanindhra@brahma.dev",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        department: "IV CSBS 'B' - Team 19",
        status: "active",
      },
      {
        id: "usr-vishal-m-02",
        name: "Vishal Madhavan",
        email: "vishal.madhavan@brahma.dev",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        department: "IV CSBS 'B' - Team 19",
        status: "active",
      },
      {
        id: "usr-vishal-s-03",
        name: "Vishal S",
        email: "vishal.s@brahma.dev",
        role: "reviewer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        department: "IV CSBS 'B' - Team 19",
        status: "active",
      },
      {
        id: "usr-fac-dr-mehta",
        name: "Dr. Arjun Mehta",
        email: "faculty.advisor@brahma.dev",
        role: "faculty",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        department: "Department of CSBS",
        status: "active",
      },
    ];

    if (this.seed === "GAMMA") {
      return baseTeam.slice(0, 1);
    }

    if (this.seed === "EPSILON") {
      const extraLongNamedUsers: MockUser[] = Array.from({ length: 15 }).map((_, i) => ({
        id: `usr-eps-long-${i}`,
        name: `Constantinople-Alexandros Bartholomew Maximilian von Hohenzollern-Sigmaringen the ${i + 1}th`,
        email: `constantinople.alexandros.bartholomew.maximilian.von.hohenzollern.${i}@enterprise-cluster.brahma.dev`,
        role: i % 3 === 0 ? "admin" : i % 2 === 0 ? "reviewer" : "student",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        department: "Extreme Scale Distributed Architecture Evaluation Group",
        status: "active",
      }));
      return [...baseTeam, ...extraLongNamedUsers];
    }

    return baseTeam;
  }

  public getProjects(): MockProject[] {
    if (this.seed === "GAMMA") {
      return [];
    }

    const projects: MockProject[] = [
      {
        id: "proj-01-brahma",
        name:
          this.seed === "EPSILON"
            ? "PROJECT BRAHMA: Blueprint-driven Requirements Architecture Health Monitoring Agent Platform System"
            : "Project Brahma Insights Engine",
        slug: "brahma-insights",
        description:
          "Autonomous software blueprint extraction, static code health, and security governance engine.",
        ownerId: "usr-puli-01",
        ownerName: "Puli Phanindhra",
        status:
          this.seed === "BETA" ? "critical" : this.seed === "DELTA" ? "low_clarity" : "healthy",
        healthScore: this.seed === "BETA" ? 42 : this.seed === "DELTA" ? 64 : 94,
        securityScore: this.seed === "BETA" ? 28 : this.seed === "DELTA" ? 72 : 98,
        riskScore: this.seed === "BETA" ? 89 : this.seed === "DELTA" ? 61 : 12,
        clarityScore: this.seed === "DELTA" ? 44 : 96,
        testCoverage: this.seed === "BETA" ? 24 : this.seed === "EPSILON" ? 0 : 88,
        codeComplexityAvg: this.seed === "BETA" ? 38 : 14,
        vulnerabilityCount: this.seed === "BETA" ? 11 : 0,
        cweList:
          this.seed === "BETA"
            ? ["CWE-89 (SQLi)", "CWE-79 (XSS)", "CWE-287 (Auth Bypass)", "CWE-306"]
            : [],
        nodesCount: 14,
        orphanNodesCount: this.seed === "BETA" ? 3 : 0,
        missingFkCount: this.seed === "BETA" ? 2 : 0,
        unauthenticatedRoutesCount: this.seed === "BETA" ? 4 : 0,
        createdAt: "2026-08-01T09:00:00Z",
        updatedAt: "2026-08-14T22:30:00Z",
        repoUrl: "https://github.com/cypherpheonix07-lang/brahma-insights",
        branch: "main",
      },
      {
        id: "proj-02-cognexus",
        name: "Cognexus Causal Graph Orchestrator",
        slug: "cognexus-causal",
        description: "Multi-agent causal inference and business KPI mapping platform.",
        ownerId: "usr-vishal-m-02",
        ownerName: "Vishal Madhavan",
        status: this.seed === "DELTA" ? "failed" : "healthy",
        healthScore: 88,
        securityScore: 91,
        riskScore: 18,
        clarityScore: 90,
        testCoverage: 82,
        codeComplexityAvg: 16,
        vulnerabilityCount: 1,
        cweList: ["CWE-200 (Info Exposure)"],
        nodesCount: 11,
        orphanNodesCount: 0,
        missingFkCount: 0,
        unauthenticatedRoutesCount: 0,
        createdAt: "2026-08-03T11:00:00Z",
        updatedAt: "2026-08-14T19:00:00Z",
        repoUrl: "https://github.com/cypherpheonix07-lang/cognexus",
        branch: "main",
      },
      {
        id: "proj-03-chimera",
        name: "Chimera Cyber Deception & MITRE ATT&CK Engine",
        slug: "chimera-defense",
        description: "Adaptive cyber deception honey-grid with forensic chain of custody tracking.",
        ownerId: "usr-vishal-s-03",
        ownerName: "Vishal S",
        status: "published",
        healthScore: 96,
        securityScore: 99,
        riskScore: 8,
        clarityScore: 98,
        testCoverage: 94,
        codeComplexityAvg: 11,
        vulnerabilityCount: 0,
        cweList: [],
        nodesCount: 12,
        orphanNodesCount: 0,
        missingFkCount: 0,
        unauthenticatedRoutesCount: 0,
        createdAt: "2026-07-15T08:00:00Z",
        updatedAt: "2026-08-10T14:20:00Z",
        repoUrl: "https://github.com/cypherpheonix07-lang/chimera-defense",
        branch: "release-v2.1",
      },
    ];

    if (this.seed === "EPSILON") {
      for (let i = 4; i <= 14; i++) {
        projects.push({
          id: `proj-${i}-scale`,
          name: `Automated Scale Microservice Cluster Node #${i} with Ultra-High Throughput Telemetry`,
          slug: `microservice-scale-node-${i}`,
          description: `Synthetic scale microservice node for high-density load testing and cluster resilience assessment.`,
          ownerId: "usr-puli-01",
          ownerName: "Puli Phanindhra",
          status: i % 4 === 0 ? "critical" : i % 3 === 0 ? "medium" : "healthy",
          healthScore: (85 + i * 2) % 100,
          securityScore: (75 + i * 3) % 100,
          riskScore: (20 + i * 4) % 100,
          clarityScore: (60 + i * 5) % 100,
          testCoverage: i % 2 === 0 ? 0 : 75,
          codeComplexityAvg: 10 + (i % 15),
          vulnerabilityCount: i % 3 === 0 ? 3 : 0,
          cweList: i % 3 === 0 ? ["CWE-79", "CWE-89"] : [],
          nodesCount: 8 + (i % 6),
          orphanNodesCount: i % 5 === 0 ? 1 : 0,
          missingFkCount: 0,
          unauthenticatedRoutesCount: 0,
          createdAt: "2026-08-05T00:00:00Z",
          updatedAt: "2026-08-14T10:00:00Z",
        });
      }
    }

    return projects;
  }

  public getAuthEvents(): MockAuthEvent[] {
    if (this.seed === "GAMMA") return [];

    const count = this.seed === "EPSILON" ? 45 : 12;
    const browsers = ["Chrome 128.0", "Firefox 130.0", "Safari 17.5", "Edge 128.0"];
    const osList = ["Windows 11 x64", "macOS Sonoma 14.6", "Ubuntu Linux 24.04"];
    const cities = [
      { city: "Chennai", country: "India", ip: "49.204.112.45" },
      { city: "Bengaluru", country: "India", ip: "106.51.78.90" },
      { city: "San Francisco", country: "United States", ip: "198.51.100.24" },
    ];

    const events: MockAuthEvent[] = [];
    for (let i = 0; i < count; i++) {
      const geo = cities[i % cities.length] || {
        ip: "127.0.0.1",
        city: "Bengaluru",
        country: "India",
      };
      const isFailedCluster = this.seed === "BETA" && i >= 2 && i <= 5;
      events.push({
        id: `auth-evt-${i + 1}`,
        userId: i % 2 === 0 ? "usr-puli-01" : "usr-vishal-m-02",
        userEmail: i % 2 === 0 ? "puli.phanindhra@brahma.dev" : "vishal.madhavan@brahma.dev",
        event: isFailedCluster ? "failed_password" : "signed_in",
        method: isFailedCluster ? "Password (Repeated)" : i % 3 === 0 ? "GitHub OAuth" : "Password",
        status: isFailedCluster ? "failed" : "success",
        deviceType: i % 4 === 0 ? "mobile" : "desktop",
        browser: browsers[i % browsers.length] || "Chrome",
        os: osList[i % osList.length] || "macOS",
        ip: geo.ip,
        city: geo.city,
        country: geo.country,
        timestamp: new Date(Date.now() - i * 86400000 * 0.6).toISOString(),
      });
    }
    return events;
  }

  public getAuditLogs(): MockAuditLog[] {
    if (this.seed === "GAMMA") return [];

    return [
      {
        id: "audit-01",
        userId: "usr-puli-01",
        action: "PUBLISH_OVERRIDE",
        resource: "proj-01-brahma",
        details:
          "Manual typed override authorized for security release gate bypass: 'PROD_HOTFIX_SEC_APPROVED'",
        ip: "49.204.112.45",
        timestamp: "2026-08-14T21:40:00Z",
        status: "OVERRIDDEN",
      },
      {
        id: "audit-02",
        userId: "usr-vishal-m-02",
        action: "GITHUB_INTEGRATION_SYNC",
        resource: "repo:cypherpheonix07-lang/brahma-insights",
        details: "Signed webhook verified (SHA256). Pulled commit 8f9b2c1 on branch main.",
        ip: "106.51.78.90",
        timestamp: "2026-08-14T20:15:00Z",
        status: "SUCCESS",
      },
      {
        id: "audit-03",
        userId: "usr-puli-01",
        action: "BLUEPRINT_GENERATION",
        resource: "proj-01-brahma",
        details: "Generated 14-node architecture graph with AST Tree-sitter validation.",
        ip: "49.204.112.45",
        timestamp: "2026-08-14T18:00:00Z",
        status: "SUCCESS",
      },
    ];
  }
}
