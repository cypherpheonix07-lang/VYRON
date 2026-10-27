/**
 * VYRON — P14: ARCHITECTURE DRIFT & DEPENDENCY BOUNDARY GOVERNOR
 * Layered boundary verification, architectural fitness functions,
 * cyclic dependency detection, and drift violation reporting.
 * Strictly ZERO operational raw SQL.
 */

export interface LayerBoundaryRule {
  id: string;
  sourcePattern: string; // Regex or prefix, e.g. "src/components/"
  forbiddenTargets: string[]; // Forbidden prefixes, e.g. ["src/server/"]
  ruleName: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
}

export interface DriftViolation {
  ruleId: string;
  sourceFile: string;
  targetImport: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  message: string;
  detectedAt: string;
}

export class ArchitectureDriftGovernor {
  private static readonly RULES: LayerBoundaryRule[] = [
    {
      id: "RULE-LAYER-01",
      sourcePattern: "src/components/",
      forbiddenTargets: ["src/server/nitro", "src/server/database"],
      ruleName: "Client UI Layer Fence",
      severity: "CRITICAL"
    },
    {
      id: "RULE-LAYER-02",
      sourcePattern: "src/types/",
      forbiddenTargets: ["src/services/", "src/components/"],
      ruleName: "Pure Type Independence",
      severity: "HIGH"
    },
    {
      id: "RULE-LAYER-03",
      sourcePattern: "src/services/",
      forbiddenTargets: ["src/components/"],
      ruleName: "Service Inversion Boundary",
      severity: "HIGH"
    }
  ];

  public static evaluateImport(sourceFile: string, targetImport: string): DriftViolation | null {
    for (const rule of this.RULES) {
      if (sourceFile.startsWith(rule.sourcePattern)) {
        for (const forbidden of rule.forbiddenTargets) {
          if (targetImport.startsWith(forbidden)) {
            return {
              ruleId: rule.id,
              sourceFile,
              targetImport,
              severity: rule.severity,
              message: `Architectural boundary violation: ${sourceFile} is forbidden from importing ${targetImport} under rule ${rule.ruleName}`,
              detectedAt: new Date().toISOString()
            };
          }
        }
      }
    }
    return null;
  }

  public static detectCycles(edges: Array<{ from: string; to: string }>): string[][] {
    const adjList = new Map<string, string[]>();
    for (const edge of edges) {
      if (!adjList.has(edge.from)) adjList.set(edge.from, []);
      adjList.get(edge.from)!.push(edge.to);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[][] = [];

    const dfs = (node: string, path: string[]) => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = adjList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recStack.has(neighbor)) {
          const cycleStart = path.indexOf(neighbor);
          if (cycleStart !== -1) {
            cycles.push(path.slice(cycleStart));
          }
        }
      }

      recStack.delete(node);
    };

    for (const node of adjList.keys()) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    return cycles;
  }

  public static getFitnessScore(violationsCount: number, cycleCount: number): number {
    const base = 100;
    const penalty = (violationsCount * 10) + (cycleCount * 25);
    return Math.max(0, base - penalty);
  }
}
