/**
 * PROJECT BRAHMA — ENGINEERING KNOWLEDGE GRAPH
 * Unified relationship graph connecting architectural, code, requirement, security,
 * test, release, decision, and mission entities across the platform.
 * Supports pathfinding, transitive impact subgraphs, and Copilot queries.
 * Strictly ZERO SQL.
 */

export type EntityType =
  | "project"
  | "blueprint"
  | "architecture_node"
  | "requirement"
  | "file"
  | "commit"
  | "pull_request"
  | "api"
  | "service"
  | "dependency"
  | "test"
  | "vulnerability"
  | "finding"
  | "analysis_run"
  | "dataset"
  | "decision"
  | "mission"
  | "release";

export type KnowledgeGraphNodeType = EntityType;

export type EdgeType =
  | "PROVENANCE"
  | "IMPACTS"
  | "DEPENDS_ON"
  | "IMPLEMENTS"
  | "VERIFIES"
  | "MITIGATES"
  | "DRIFT_FROM"
  | "CAUSED_BY";

export interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  metadata: Record<string, unknown>;
  healthScore?: number | undefined;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string | undefined;
  weight?: number | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface GraphExportData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export class EngineeringKnowledgeGraph {
  private static instance: EngineeringKnowledgeGraph | null = null;
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private adjacency: Map<string, Set<string>> = new Map();
  private reverseAdjacency: Map<string, Set<string>> = new Map();

  private constructor() {
    this.seedDefaultKnowledgeGraph();
  }

  public static getInstance(): EngineeringKnowledgeGraph {
    if (!EngineeringKnowledgeGraph.instance) {
      EngineeringKnowledgeGraph.instance = new EngineeringKnowledgeGraph();
    }
    return EngineeringKnowledgeGraph.instance;
  }

  public addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
    if (!this.adjacency.has(node.id)) {
      this.adjacency.set(node.id, new Set());
    }
    if (!this.reverseAdjacency.has(node.id)) {
      this.reverseAdjacency.set(node.id, new Set());
    }
  }

  public addEdge(edge: GraphEdge): void {
    this.edges.set(edge.id, edge);

    if (!this.adjacency.has(edge.source)) {
      this.adjacency.set(edge.source, new Set());
    }
    this.adjacency.get(edge.source)!.add(edge.target);

    if (!this.reverseAdjacency.has(edge.target)) {
      this.reverseAdjacency.set(edge.target, new Set());
    }
    this.reverseAdjacency.get(edge.target)!.add(edge.source);
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getNeighbors(nodeId: string): { outgoing: GraphNode[]; incoming: GraphNode[] } {
    const outgoingIds = this.adjacency.get(nodeId) || new Set();
    const incomingIds = this.reverseAdjacency.get(nodeId) || new Set();

    const outgoing = Array.from(outgoingIds)
      .map((id) => this.nodes.get(id))
      .filter((n): n is GraphNode => n !== undefined);

    const incoming = Array.from(incomingIds)
      .map((id) => this.nodes.get(id))
      .filter((n): n is GraphNode => n !== undefined);

    return { outgoing, incoming };
  }

  /**
   * Breadth-first shortest path search between two entities in the knowledge graph.
   */
  public findPath(sourceId: string, targetId: string): string[] | null {
    if (!this.nodes.has(sourceId) || !this.nodes.has(targetId)) return null;
    if (sourceId === targetId) return [sourceId];

    const visited = new Set<string>([sourceId]);
    const queue: Array<{ id: string; path: string[] }> = [{ id: sourceId, path: [sourceId] }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = this.adjacency.get(current.id) || new Set();

      for (const neighborId of neighbors) {
        if (neighborId === targetId) {
          return [...current.path, targetId];
        }
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push({ id: neighborId, path: [...current.path, neighborId] });
        }
      }
    }

    return null;
  }

  public findShortestPath(sourceId: string, targetId: string): string[] | null {
    return this.findPath(sourceId, targetId);
  }

  /**
   * Computes transitive blast radius subgraph starting from a changed or vulnerable node.
   */
  public getImpactSubgraph(rootId: string, maxDepth = 3): GraphExportData {
    const visitedNodes = new Set<string>();
    const matchedEdges: GraphEdge[] = [];
    const queue: Array<{ id: string; depth: number }> = [{ id: rootId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (visitedNodes.has(id)) continue;
      visitedNodes.add(id);

      if (depth >= maxDepth) continue;

      const neighbors = this.adjacency.get(id) || new Set();
      for (const neighborId of neighbors) {
        // find connecting edge
        for (const edge of this.edges.values()) {
          if (edge.source === id && edge.target === neighborId) {
            matchedEdges.push(edge);
            break;
          }
        }
        if (!visitedNodes.has(neighborId)) {
          queue.push({ id: neighborId, depth: depth + 1 });
        }
      }
    }

    const matchedNodes = Array.from(visitedNodes)
      .map((nId) => this.nodes.get(nId))
      .filter((n): n is GraphNode => n !== undefined);

    return { nodes: matchedNodes, edges: matchedEdges };
  }

  public getSubgraph(rootId: string, maxDepth = 3): GraphExportData {
    return this.getImpactSubgraph(rootId, maxDepth);
  }

  public exportGraphData(): GraphExportData {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
    };
  }

  private seedDefaultKnowledgeGraph(): void {
    // 1. Projects & Blueprints
    this.addNode({ id: "proj-brahma", type: "project", label: "Aurora Payments Gateway", metadata: { domain: "Fintech" }, healthScore: 91 });
    this.addNode({ id: "bp-brahma", type: "blueprint", label: "Aurora Enterprise Architecture Blueprint", metadata: { version: "2.4.0" } });
    this.addEdge({ id: "e_proj_bp", source: "proj-brahma", target: "bp-brahma", type: "PROVENANCE", label: "governed_by" });

    // 2. Services & Architecture Nodes
    this.addNode({ id: "srv-gateway", type: "service", label: "API Gateway Service", metadata: { protocol: "HTTPS/REST", port: 8080 } });
    this.addNode({ id: "srv-auth", type: "service", label: "Authentication & GoTrue", metadata: { authType: "JWT" } });
    this.addNode({ id: "srv-settlement", type: "service", label: "Settlement Orchestration Service", metadata: { runtime: "NodeJS" } });
    this.addNode({ id: "srv-risk", type: "service", label: "Composite Risk Engine", metadata: { framework: "FastAPI" } });
    this.addNode({ id: "db-postgres", type: "architecture_node", label: "Supabase PostgreSQL Database", metadata: { db: "postgres" } });

    this.addEdge({ id: "e_bp_gw", source: "bp-brahma", target: "srv-gateway", type: "IMPLEMENTS" });
    this.addEdge({ id: "e_bp_settle", source: "bp-brahma", target: "srv-settlement", type: "IMPLEMENTS" });
    this.addEdge({ id: "e_gw_auth", source: "srv-gateway", target: "srv-auth", type: "DEPENDS_ON" });
    this.addEdge({ id: "e_gw_settle", source: "srv-gateway", target: "srv-settlement", type: "DEPENDS_ON" });
    this.addEdge({ id: "e_settle_risk", source: "srv-settlement", target: "srv-risk", type: "DEPENDS_ON" });
    this.addEdge({ id: "e_settle_db", source: "srv-settlement", target: "db-postgres", type: "DEPENDS_ON" });

    // 3. Requirements (EARS)
    this.addNode({ id: "req-pci-01", type: "requirement", label: "FR-01 Tokenize cardholder data before persistence", metadata: { priority: "CRITICAL" } });
    this.addNode({ id: "req-idem-02", type: "requirement", label: "FR-02 Retry failed settlements with idempotency keys", metadata: { priority: "HIGH" } });
    this.addEdge({ id: "e_settle_req1", source: "srv-settlement", target: "req-pci-01", type: "IMPLEMENTS" });
    this.addEdge({ id: "e_settle_req2", source: "srv-settlement", target: "req-idem-02", type: "IMPLEMENTS" });

    // 4. APIs & Endpoints
    this.addNode({ id: "api-settlements-post", type: "api", label: "POST /v2/settlements/execute", metadata: { auth: "Bearer" } });
    this.addNode({ id: "api-auth-verify", type: "api", label: "GET /v1/auth/verify", metadata: { rateLimit: "100/min" } });
    this.addEdge({ id: "e_settle_api", source: "srv-settlement", target: "api-settlements-post", type: "IMPLEMENTS" });
    this.addEdge({ id: "e_auth_api", source: "srv-auth", target: "api-auth-verify", type: "IMPLEMENTS" });

    // 5. Tests
    this.addNode({ id: "test-settle-unit", type: "test", label: "Settlement Idempotency Test Suite", metadata: { passRate: 1.0 } });
    this.addEdge({ id: "e_test_req2", source: "test-settle-unit", target: "req-idem-02", type: "VERIFIES" });
    this.addEdge({ id: "e_test_api", source: "test-settle-unit", target: "api-settlements-post", type: "VERIFIES" });

    // 6. Security Vulnerability & Finding
    this.addNode({ id: "vuln-cwe-89", type: "vulnerability", label: "CWE-89: SQL Injection Risk in billing query builder", metadata: { severity: "HIGH" }, riskLevel: "HIGH" });
    this.addEdge({ id: "e_vuln_settle", source: "vuln-cwe-89", target: "srv-settlement", type: "IMPACTS" });

    // 7. Release Gates & Decisions
    this.addNode({ id: "rel-v24", type: "release", label: "Production Release v2.4.0", metadata: { targetDate: "2026-09-15" } });
    this.addNode({ id: "dec-adr-12", type: "decision", label: "ADR-12: Enforce strict distributed idempotency keys", metadata: { status: "ACCEPTED" } });
    this.addEdge({ id: "e_dec_settle", source: "dec-adr-12", target: "srv-settlement", type: "IMPACTS" });
    this.addEdge({ id: "e_rel_settle", source: "rel-v24", target: "srv-settlement", type: "DEPENDS_ON" });
  }
}

export const engineeringKnowledgeGraph = EngineeringKnowledgeGraph.getInstance();
