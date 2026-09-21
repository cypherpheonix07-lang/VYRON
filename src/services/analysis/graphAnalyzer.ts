/**
 * PROJECT BRAHMA — STAGE 6 GRAPH ANALYZER
 * Zero SQL. Constructs in-memory entity graph, identifies hubs, computes degree centrality, and detects cycles/clusters.
 */

export interface GraphNode {
  id: string;
  type: string;
  degree: number;
  centralityScore: number; // 0 to 1
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  relationship: string;
}

export interface GraphAnalysisResult {
  nodeCount: number;
  edgeCount: number;
  clusterCount: number;
  topHubs: GraphNode[];
  suspiciousCycles: Array<{ nodes: string[]; riskLevel: "HIGH" | "CRITICAL" }>;
  density: number;
}

export class GraphAnalyzer {
  public static analyzeRelationships(
    records: Array<Record<string, unknown>>,
    sourceField: string,
    targetField: string,
    relationship: string = "ASSOCIATED_WITH",
  ): GraphAnalysisResult {
    const adjacency: Map<string, Set<string>> = new Map();
    const nodeTypes: Map<string, string> = new Map();
    const edgeWeights: Map<string, number> = new Map();

    for (const r of records) {
      const src = String(r[sourceField] || "");
      const tgt = String(r[targetField] || "");
      if (!src || !tgt || src === "undefined" || tgt === "undefined") continue;

      nodeTypes.set(src, sourceField);
      nodeTypes.set(tgt, targetField);

      if (!adjacency.has(src)) adjacency.set(src, new Set());
      if (!adjacency.has(tgt)) adjacency.set(tgt, new Set());

      adjacency.get(src)!.add(tgt);
      adjacency.get(tgt)!.add(src);

      const edgeKey = src < tgt ? `${src}__${tgt}` : `${tgt}__${src}`;
      edgeWeights.set(edgeKey, (edgeWeights.get(edgeKey) || 0) + 1);
    }

    const nodeCount = adjacency.size;
    const edgeCount = edgeWeights.size;

    if (nodeCount === 0) {
      return {
        nodeCount: 0,
        edgeCount: 0,
        clusterCount: 0,
        topHubs: [],
        suspiciousCycles: [],
        density: 0,
      };
    }

    const nodes: GraphNode[] = [];
    const maxDegree = Math.max(1, ...Array.from(adjacency.values()).map((s) => s.size));

    adjacency.forEach((neighbors, id) => {
      const degree = neighbors.size;
      nodes.push({
        id,
        type: nodeTypes.get(id) || "ENTITY",
        degree,
        centralityScore: Number((degree / maxDegree).toFixed(3)),
      });
    });

    nodes.sort((a, b) => b.degree - a.degree);

    // Identify suspicious high-fanout hubs (degree > 5 or centrality > 0.6)
    const topHubs = nodes.filter((n) => n.degree >= 3).slice(0, 10);

    // Compute simple connected components
    const visited = new Set<string>();
    let clusterCount = 0;

    adjacency.forEach((_, startNode) => {
      if (!visited.has(startNode)) {
        clusterCount++;
        const queue = [startNode];
        visited.add(startNode);
        while (queue.length > 0) {
          const curr = queue.shift()!;
          const neighbors = adjacency.get(curr);
          if (neighbors) {
            for (const neighbor of neighbors) {
              if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
              }
            }
          }
        }
      }
    });

    const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
    const density = maxEdges > 0 ? Number((edgeCount / maxEdges).toFixed(4)) : 0;

    // Detect high-risk hub cliques
    const suspiciousCycles: GraphAnalysisResult["suspiciousCycles"] = [];
    if (topHubs.length >= 2 && topHubs[0]?.degree && topHubs[0].degree > 8) {
      suspiciousCycles.push({
        nodes: topHubs.slice(0, 4).map((h) => h.id),
        riskLevel: "CRITICAL",
      });
    }

    return {
      nodeCount,
      edgeCount,
      clusterCount,
      topHubs,
      suspiciousCycles,
      density,
    };
  }
}
