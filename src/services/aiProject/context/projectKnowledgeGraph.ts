/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Project Knowledge Graph & Relationship Engine (Phase 03)
 * Strictly ZERO Raw SQL.
 */

export type GraphNodeType =
  | "Problem"
  | "Requirement"
  | "Capability"
  | "Component"
  | "Api"
  | "DataEntity"
  | "Technology"
  | "Decision"
  | "Risk"
  | "Task"
  | "TestCase";

export type GraphEdgeType =
  | "REQUIREMENT_SATISFIED_BY"
  | "DEPENDS_ON"
  | "IMPLEMENTED_BY"
  | "TESTED_BY"
  | "AFFECTS"
  | "CONFLICTS_WITH"
  | "SUPPORTED_BY"
  | "DERIVED_FROM"
  | "REPLACED_BY";

export interface ProjectGraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  stage: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: GraphEdgeType;
  weight?: number;
}

export class ProjectKnowledgeGraph {
  private static instance: ProjectKnowledgeGraph | null = null;
  private nodes: Map<string, ProjectGraphNode> = new Map();
  private edges: Map<string, ProjectGraphEdge> = new Map();

  private constructor() {}

  public static getInstance(): ProjectKnowledgeGraph {
    if (!ProjectKnowledgeGraph.instance) {
      ProjectKnowledgeGraph.instance = new ProjectKnowledgeGraph();
    }
    return ProjectKnowledgeGraph.instance;
  }

  public upsertNode(node: ProjectGraphNode) {
    this.nodes.set(node.id, node);
  }

  public addEdge(sourceId: string, targetId: string, type: GraphEdgeType) {
    const id = `${sourceId}->${type}->${targetId}`;
    this.edges.set(id, { id, sourceId, targetId, type });
  }

  public removeNode(nodeId: string) {
    this.nodes.delete(nodeId);
    for (const [edgeId, edge] of this.edges.entries()) {
      if (edge.sourceId === nodeId || edge.targetId === nodeId) {
        this.edges.delete(edgeId);
      }
    }
  }

  public getDownstreamImpact(nodeId: string, maxDepth = 4): string[] {
    const visited = new Set<string>();
    const queue: Array<{ id: string; depth: number }> = [{ id: nodeId, depth: 0 }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth >= maxDepth) continue;

      for (const edge of this.edges.values()) {
        if (edge.sourceId === current.id && !visited.has(edge.targetId)) {
          visited.add(edge.targetId);
          queue.push({ id: edge.targetId, depth: current.depth + 1 });
        }
      }
    }

    return Array.from(visited);
  }

  public hasCycles(): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (curr: string): boolean => {
      visited.add(curr);
      recStack.add(curr);

      for (const edge of this.edges.values()) {
        if (edge.sourceId === curr) {
          if (!visited.has(edge.targetId) && dfs(edge.targetId)) return true;
          if (recStack.has(edge.targetId)) return true;
        }
      }

      recStack.delete(curr);
      return false;
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        if (dfs(nodeId)) return true;
      }
    }

    return false;
  }

  public traverseDownstream(nodeId: string, maxDepth = 4): string[] {
    return this.getDownstreamImpact(nodeId, maxDepth);
  }

  public detectCycles(): boolean {
    return this.hasCycles();
  }

  public getStats() {
    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
    };
  }

  public clear() {
    this.nodes.clear();
    this.edges.clear();
  }
}

export const projectKnowledgeGraph = ProjectKnowledgeGraph.getInstance();
