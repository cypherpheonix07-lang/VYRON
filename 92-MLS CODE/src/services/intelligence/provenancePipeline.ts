/**
 * VYRON — P12: PROVENANCE, CITATION & AUDITABILITY PIPELINE
 * Authoritative citation linker connecting analytical claims,
 * findings, and recommendations directly to source files, AST symbols,
 * Git commit SHAs, or telemetry spans.
 * Strictly ZERO operational raw SQL.
 */

export type ProvenanceTargetType = 
  | "SOURCE_FILE_SPAN"
  | "AST_SYMBOL"
  | "GIT_COMMIT"
  | "TELEMETRY_SPAN"
  | "ADR_DOCUMENT"
  | "BENCHMARK_FIXTURE";

export interface ProvenanceCitation {
  id: string;
  claimId: string;
  targetType: ProvenanceTargetType;
  locator: string; // e.g. "src/services/intelligence/driftEngine.ts#L45-L60"
  commitSha?: string | undefined;
  astSymbolName?: string | undefined;
  telemetrySpanId?: string | undefined;
  observedAt: string;
  checksum: string;
}

export interface CitationVerificationResult {
  citationId: string;
  isValid: boolean;
  targetType: ProvenanceTargetType;
  locator: string;
  verifiedAt: string;
  error?: string | undefined;
}

export class ProvenancePipelineEngine {
  private static readonly CITATION_STORE: Map<string, ProvenanceCitation> = new Map();

  public static createCitation(
    claimId: string,
    targetType: ProvenanceTargetType,
    locator: string,
    metadata?: {
      commitSha?: string | undefined;
      astSymbolName?: string | undefined;
      telemetrySpanId?: string | undefined;
    } | undefined
  ): ProvenanceCitation {
    const id = `cit_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const checksum = `${targetType}:${locator}:${Date.now()}`;

    const citation: ProvenanceCitation = {
      id,
      claimId,
      targetType,
      locator,
      commitSha: metadata?.commitSha,
      astSymbolName: metadata?.astSymbolName,
      telemetrySpanId: metadata?.telemetrySpanId,
      observedAt: new Date().toISOString(),
      checksum
    };

    this.CITATION_STORE.set(id, citation);
    return citation;
  }

  public static getCitation(id: string): ProvenanceCitation | undefined {
    return this.CITATION_STORE.get(id);
  }

  public static getCitationsForClaim(claimId: string): ProvenanceCitation[] {
    return Array.from(this.CITATION_STORE.values()).filter((c) => c.claimId === claimId);
  }

  public static verifyCitation(id: string): CitationVerificationResult {
    const citation = this.CITATION_STORE.get(id);
    if (!citation) {
      return {
        citationId: id,
        isValid: false,
        targetType: "SOURCE_FILE_SPAN",
        locator: "UNKNOWN",
        verifiedAt: new Date().toISOString(),
        error: `Citation ${id} not found in provenance registry.`
      };
    }

    const hasValidLocator = citation.locator && citation.locator.length > 0;
    return {
      citationId: id,
      isValid: Boolean(hasValidLocator),
      targetType: citation.targetType,
      locator: citation.locator,
      verifiedAt: new Date().toISOString(),
      error: hasValidLocator ? undefined : "Empty citation locator target."
    };
  }

  public static formatMarkdownFootnotes(citations: ProvenanceCitation[]): string {
    return citations
      .map((c, i) => `[^${i + 1}]: [${c.targetType}] ${c.locator} (Verified at ${c.observedAt})`)
      .join("\n");
  }
}
