# VYRON GRAPH DIFF & REVISION VERSIONING SPECIFICATION
## GOD MODE vULTIMA ΩΩΩΩΩΩΩΩ — TOPOLOGY REVISION COMPARISON & CHANGE PROPAGATION

---

### 1. Executive Summary & Philosophy
In an engineering control plane, code diffs (`git diff`) only capture textual modifications; they fail to represent architectural, data, or release gate consequences. 

The **VYRON Graph Diff Engine** computes structural and semantic differences between any two graph revision snapshots ($R_{\text{base}}$ vs $R_{\text{target}}$):
- What nodes were added or removed?
- What attributes (state, health, evidence, freshness) were modified?
- What causal dependencies (edges) were added or severed?
- Which Release Gates are impacted?
- What is the transitive downstream blast radius?

---

### 2. Diff Algorithm & Complexity
The diff engine operates in $\mathcal{O}(|V| + |E|)$ time:
1. **Node Set Difference**: Compares node IDs in $R_{\text{base}}$ and $R_{\text{target}}$ to identify additions and deletions.
2. **Deep Attribute Inspection**: For matching node IDs, detects modifications across:
   - `label` changes
   - `revision` increments
   - `state` transitions (`ACTIVE` -> `FAILED` / `DEPRECATED`)
   - `healthScore` degradation
   - `freshness` updates (`LIVE` -> `STALE`)
   - `evidenceIds` list changes
3. **Edge Set Difference**: Identifies added or severed causal relationships.
4. **Causal Blast Radius Traversal**: Downstream descendants of all modified nodes are collected and mapped to bound release gates.

---

### 3. GraphDiffResult Interface
```ts
export interface GraphDiffResult {
  baseRevision: number;
  targetRevision: number;
  addedNodes: BlueprintGraphNode[];
  removedNodes: BlueprintGraphNode[];
  modifiedNodes: Array<{
    nodeId: string;
    before: Partial<BlueprintGraphNode>;
    after: Partial<BlueprintGraphNode>;
    changes: string[];
  }>;
  addedEdges: BlueprintGraphEdge[];
  removedEdges: BlueprintGraphEdge[];
  affectedGateIds: string[];
  transitiveImpactedNodeIds: string[];
}
```

---

### 4. Visual Presentation & UI Highlighting
When comparing two revisions in the Blueprint Canvas:
- **Green Outline / Glow**: Added nodes & edges in target revision.
- **Red Strikethrough / Dashed**: Removed nodes & edges from base revision.
- **Amber Border Pulse**: Modified nodes with attribute deltas.
- **Yellow Edge Highlight**: Severed or re-routed critical path dependencies.
- **Gate Rail Filter**: Filters the Release Gate checklist to show only gates directly or transitively affected by the diff.
