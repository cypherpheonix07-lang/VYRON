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
  | "REQUIRES"
  | "IMPLEMENTS"
  | "DEPENDS_ON"
  | "CALLS"
  | "EXPOSES"
  | "OWNED_BY"
  | "VALIDATED_BY"
  | "TESTED_BY"
  | "AFFECTS"
  | "VIOLATES"
  | "DERIVED_FROM"
  | "OBSERVED_BY"
  | "DEPLOYED_AS"
  | "SUPERSEDES"
  | "PROVENANCE"
  | "IMPACTS"
  | "VERIFIES"
  | "MITIGATES"
  | "DRIFT_FROM"
  | "CAUSED_BY"
  | "JUSTIFIED_BY";

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
  provenance?: string | undefined;
  confidence?: number | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface GraphExportData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CytoscapeElement {
  data: {
    id: string;
    label?: string;
    source?: string;
    target?: string;
    type?: string;
    [key: string]: unknown;
  };
}

export interface CytoscapeExport {
  elements: {
    nodes: CytoscapeElement[];
    edges: CytoscapeElement[];
  };
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

  /**
   * Dependency cycle detection using Tarjan's / DFS approach
   */
  public detectCycles(): string[][] {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[][] = [];

    const dfs = (nodeId: string, currentPath: string[]) => {
      visited.add(nodeId);
      recStack.add(nodeId);
      const neighbors = this.adjacency.get(nodeId) || new Set();

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...currentPath, neighbor]);
        } else if (recStack.has(neighbor)) {
          const cycleStart = currentPath.indexOf(neighbor);
          if (cycleStart !== -1) {
            cycles.push([...currentPath.slice(cycleStart), neighbor]);
          } else {
            cycles.push([nodeId, neighbor]);
          }
        }
      }
      recStack.delete(nodeId);
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId, [nodeId]);
      }
    }

    return cycles;
  }

  /**
   * Finds all test suites impacted by an entity modification
   */
  public findImpactedTests(entityId: string): GraphNode[] {
    const subgraph = this.getImpactSubgraph(entityId, 5);
    const impactedTests: GraphNode[] = [];

    // Directly in subgraph
    for (const node of subgraph.nodes) {
      if (node.type === "test") {
        impactedTests.push(node);
      }
    }

    // Also check reverse connections (tests that verify entities in the subgraph)
    for (const node of subgraph.nodes) {
      const rev = this.reverseAdjacency.get(node.id) || new Set();
      for (const parentId of rev) {
        const parent = this.nodes.get(parentId);
        if (parent && parent.type === "test" && !impactedTests.some(t => t.id === parent.id)) {
          impactedTests.push(parent);
        }
      }
    }

    return impactedTests;
  }

  /**
   * Finds orphaned entities with no incoming or outgoing connections
   */
  public findOrphanedEntities(): GraphNode[] {
    const orphans: GraphNode[] = [];
    for (const [id, node] of this.nodes.entries()) {
      const outCount = this.adjacency.get(id)?.size || 0;
      const inCount = this.reverseAdjacency.get(id)?.size || 0;
      if (outCount === 0 && inCount === 0) {
        orphans.push(node);
      }
    }
    return orphans;
  }

  /**
   * Cytoscape-compatible JSON export
   */
  public exportCytoscape(): CytoscapeExport {
    return {
      elements: {
        nodes: Array.from(this.nodes.values()).map(n => ({
          data: {
            id: n.id,
            label: n.label,
            type: n.type,
            healthScore: n.healthScore,
            riskLevel: n.riskLevel,
            ...n.metadata,
          },
        })),
        edges: Array.from(this.edges.values()).map(e => ({
          data: {
            id: e.id,
            source: e.source,
            target: e.target,
            type: e.type,
            label: e.label || e.type,
            weight: e.weight,
            ...e.metadata,
          },
        })),
      },
    };
  }

  /**
   * DOT / Graphviz format export
   */
  public exportDot(): string {
    let dot = "digraph AtlasEngineeringGraph {\n";
    dot += "  rankdir=LR;\n";
    dot += "  node [shape=box, style=\"rounded,filled\", color=\"#4f46e5\", fontname=\"Helvetica\"];\n";

    for (const node of this.nodes.values()) {
      const safeLabel = node.label.replace(/"/g, '\\"');
      dot += `  "${node.id}" [label="${safeLabel}\\n(${node.type})"];\n`;
    }

    for (const edge of this.edges.values()) {
      const safeType = (edge.label || edge.type).replace(/"/g, '\\"');
      dot += `  "${edge.source}" -> "${edge.target}" [label="${safeType}"];\n`;
    }

    dot += "}\n";
    return dot;
  }

  /**
   * JSON-LD format export
   */
  public exportJsonLd(): Record<string, unknown> {
    return {
      "@context": {
        "@vocab": "https://vyron.ai/schema/engineering#",
        id: "@id",
        type: "@type",
      },
      "@graph": Array.from(this.nodes.values()).map(node => ({
        "@id": node.id,
        "@type": node.type,
        name: node.label,
        healthScore: node.healthScore,
        riskLevel: node.riskLevel,
        outgoingRelations: Array.from(this.adjacency.get(node.id) || []).map(targetId => ({
          target: targetId,
        })),
      })),
    };
  }

  /**
   * Extracts relevant context subgraph for Copilot queries
   */
  public extractContextSubgraph(query: string, maxNodes = 10): GraphExportData {
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const matchedNodeIds = new Set<string>();

    for (const [id, node] of this.nodes.entries()) {
      const labelLower = node.label.toLowerCase();
      const typeLower = node.type.toLowerCase();
      if (tokens.some(t => labelLower.includes(t) || typeLower.includes(t))) {
        matchedNodeIds.add(id);
        if (matchedNodeIds.size >= maxNodes) break;
      }
    }

    if (matchedNodeIds.size === 0) {
      // Return top-level architecture components as fallback
      const fallbackNodes = Array.from(this.nodes.values()).slice(0, 5);
      return { nodes: fallbackNodes, edges: [] };
    }

    // Expand 1-hop around matched nodes
    const contextNodes = new Set<string>(matchedNodeIds);
    const contextEdges: GraphEdge[] = [];

    for (const id of matchedNodeIds) {
      const outIds = this.adjacency.get(id) || new Set();
      for (const targetId of outIds) {
        contextNodes.add(targetId);
      }
      const inIds = this.reverseAdjacency.get(id) || new Set();
      for (const sourceId of inIds) {
        contextNodes.add(sourceId);
      }
    }

    for (const edge of this.edges.values()) {
      if (contextNodes.has(edge.source) && contextNodes.has(edge.target)) {
        contextEdges.push(edge);
      }
    }

    const resultNodes = Array.from(contextNodes)
      .map(id => this.nodes.get(id))
      .filter((n): n is GraphNode => n !== undefined)
      .slice(0, maxNodes * 2);

    return { nodes: resultNodes, edges: contextEdges };
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
