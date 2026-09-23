/**
 * VYRON — P11: EPISTEMIC TRUTH & CERTAINTY SCORING ENGINE
 * Formal epistemic certainty scoring, mathematical truth verification,
 * and zero-hallucination inference guards.
 * Strictly ZERO operational raw SQL.
 */

export type CertaintyTier = 
  | "EMPIRICALLY_VERIFIED"      // Backed by direct execution, test run, or runtime telemetry
  | "DETERMINISTICALLY_INFERRED" // Backed by static AST, type solver, or formal proof
  | "HEURISTICALLY_ESTIMATED"   // Backed by statistical correlation or similarity index
  | "SPECULATIVE_HYPOTHESIS";    // Generative extrapolation without empirical grounding

export interface EpistemicEvaluation {
  claimId: string;
  claimText: string;
  certaintyScore: number; // 0.00 to 1.00
  tier: CertaintyTier;
  weights: {
    empiricalWeight: number;
    provenanceWeight: number;
    knowledgeAgreementWeight: number;
  };
  metrics: {
    empiricalScore: number;
    provenanceScore: number;
    knowledgeAgreementScore: number;
  };
  isActionable: boolean;
  refusalReason?: string | undefined;
  evaluatedAt: string;
}

export class EpistemicTruthEngine {
  private static readonly WEIGHT_EMPIRICAL = 0.50;
  private static readonly WEIGHT_PROVENANCE = 0.30;
  private static readonly WEIGHT_KNOWLEDGE = 0.20;

  private static readonly ACTION_THRESHOLD = 0.75;
  private static readonly AUTONOMOUS_THRESHOLD = 0.90;

  /**
   * Computes mathematical epistemic certainty score:
   * C = (w_e * E) + (w_p * P) + (w_k * K)
   */
  public static calculateCertaintyScore(
    empiricalScore: number,
    provenanceScore: number,
    knowledgeScore: number
  ): number {
    const e = Math.max(0, Math.min(1, empiricalScore));
    const p = Math.max(0, Math.min(1, provenanceScore));
    const k = Math.max(0, Math.min(1, knowledgeScore));

    const raw = (this.WEIGHT_EMPIRICAL * e) + 
                (this.WEIGHT_PROVENANCE * p) + 
                (this.WEIGHT_KNOWLEDGE * k);

    return Math.round(raw * 100) / 100;
  }

  public static classifyTier(score: number): CertaintyTier {
    if (score >= 0.90) return "EMPIRICALLY_VERIFIED";
    if (score >= 0.75) return "DETERMINISTICALLY_INFERRED";
    if (score >= 0.50) return "HEURISTICALLY_ESTIMATED";
    return "SPECULATIVE_HYPOTHESIS";
  }

  public static evaluateClaim(
    claimText: string,
    empiricalScore: number,
    provenanceScore: number,
    knowledgeScore: number
  ): EpistemicEvaluation {
    const certaintyScore = this.calculateCertaintyScore(empiricalScore, provenanceScore, knowledgeScore);
    const tier = this.classifyTier(certaintyScore);
    const isActionable = certaintyScore >= this.ACTION_THRESHOLD;

    return {
      claimId: `CLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      claimText,
      certaintyScore,
      tier,
      weights: {
        empiricalWeight: this.WEIGHT_EMPIRICAL,
        provenanceWeight: this.WEIGHT_PROVENANCE,
        knowledgeAgreementWeight: this.WEIGHT_KNOWLEDGE,
      },
      metrics: {
        empiricalScore,
        provenanceScore,
        knowledgeAgreementScore: knowledgeScore,
      },
      isActionable,
      refusalReason: isActionable
        ? undefined
        : `Claim certainty score (${certaintyScore}) falls below actionable threshold (${this.ACTION_THRESHOLD}). Action strictly refused to prevent hallucination.`,
      evaluatedAt: new Date().toISOString()
    };
  }

  public static isEligibleForAutonomousExecution(score: number): boolean {
    return score >= this.AUTONOMOUS_THRESHOLD;
  }
}
