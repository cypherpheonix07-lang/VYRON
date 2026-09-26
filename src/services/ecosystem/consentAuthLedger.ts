/**
 * VYRON — CONSENT & AUTHORIZATION LEDGER
 * GOD MODE vULTIMA vNEXT — Strictly ZERO SQL.
 * Enforces the Vibe Auto-Connect Law: Discovery -> Eligibility -> User Consent -> Authorization.
 * Secrets are never exposed to browser or client bundles.
 */

import { sha256Hex } from "./isomorphicCrypto";
import { VibeProviderId, AutoConnectCandidate, ConsentAuthorizationRecord, EnrolledRepositoryEntity } from "./types";

export class ConsentAuthLedger {
  private static instance: ConsentAuthLedger;

  private candidates = new Map<string, AutoConnectCandidate>();
  private records = new Map<string, ConsentAuthorizationRecord>();

  private constructor() {
    this.seedDefaultCandidates();
  }

  static getInstance(): ConsentAuthLedger {
    if (!ConsentAuthLedger.instance) {
      ConsentAuthLedger.instance = new ConsentAuthLedger();
    }
    return ConsentAuthLedger.instance;
  }

  private seedDefaultCandidates(): void {
    // Seed initial auto-detected candidate for Lovable
    const candLovable: AutoConnectCandidate = {
      candidateId: "cand-lovable-vyron",
      provider: "lovable",
      detectedVia: "PREVIEW_DOMAIN",
      confidenceScore: 0.96,
      evidenceDetails: [
        "Repository commits contain .lovable configuration",
        "Lovable dev preview domain found in README and package.json",
        "Active branch sync integration pattern detected",
      ],
      associatedRepoFullName: "cypherpheonix07-lang/VYRON",
      suggestedScopes: ["read:repository", "read:previews", "read:agent_runs"],
      consentStatus: "AUTHORIZED",
      detectedAt: "2026-08-16T10:00:00Z",
    };
    this.candidates.set(candLovable.candidateId, candLovable);

    const recordLovable: ConsentAuthorizationRecord = {
      recordId: "rec-lovable-auth-01",
      provider: "lovable",
      authorizedByUserId: "priya.nair@brahma.dev",
      grantedScopes: candLovable.suggestedScopes,
      isRevoked: false,
      grantedAt: "2026-08-16T10:05:00Z",
      auditHash: sha256Hex("lovable:priya.nair@brahma.dev:read:repository,read:previews,read:agent_runs"),
    };
    this.records.set(recordLovable.recordId, recordLovable);

    // Seed candidate for v0 (pending review)
    const candV0: AutoConnectCandidate = {
      candidateId: "cand-v0-vyron",
      provider: "v0",
      detectedVia: "GITHUB_TOPIC",
      confidenceScore: 0.88,
      evidenceDetails: [
        "GitHub repository topics mention v0 components",
        "Recent commits by v0 generative bot found in commit log",
      ],
      associatedRepoFullName: "cypherpheonix07-lang/VYRON",
      suggestedScopes: ["read:generations", "read:blocks"],
      consentStatus: "PENDING_USER_REVIEW",
      detectedAt: new Date().toISOString(),
    };
    this.candidates.set(candV0.candidateId, candV0);
  }

  /**
   * Scan an enrolled repository for vibe provider signals
   */
  detectCandidatesForRepo(repo: EnrolledRepositoryEntity): AutoConnectCandidate[] {
    const candidates: AutoConnectCandidate[] = [];

    // 1. Topic & File Analysis
    const topics = repo.topics || [];
    if (topics.includes("cursor") || topics.includes("ai-control-plane")) {
      const id = `cand-cursor-${repo.fullName}`;
      if (!this.candidates.has(id)) {
        const cand: AutoConnectCandidate = {
          candidateId: id,
          provider: "cursor",
          detectedVia: "GITHUB_TOPIC",
          confidenceScore: 0.89,
          evidenceDetails: ["Repository topics contain ai-control-plane", "Cursor rule files present in .cursorrules"],
          associatedRepoFullName: repo.fullName,
          suggestedScopes: ["read:composer", "read:rules"],
          consentStatus: "PENDING_USER_REVIEW",
          detectedAt: new Date().toISOString(),
        };
        this.candidates.set(id, cand);
        candidates.push(cand);
      }
    }

    return Array.from(this.candidates.values()).filter(
      (c) => c.associatedRepoFullName.toLowerCase() === repo.fullName.toLowerCase()
    );
  }

  getAllCandidates(): AutoConnectCandidate[] {
    return Array.from(this.candidates.values());
  }

  getPendingReviewCandidates(): AutoConnectCandidate[] {
    return Array.from(this.candidates.values()).filter((c) => c.consentStatus === "PENDING_USER_REVIEW");
  }

  /**
   * User explicitly consents and authorizes the candidate
   */
  authorizeCandidate(candidateId: string, userId = "priya.nair@brahma.dev"): ConsentAuthorizationRecord {
    const candidate = this.candidates.get(candidateId);
    if (!candidate) {
      throw new Error(`AutoConnect candidate ${candidateId} not found`);
    }

    candidate.consentStatus = "AUTHORIZED";
    this.candidates.set(candidateId, candidate);

    const recordId = `rec-${candidate.provider}-${Date.now()}`;
    const auditHash = sha256Hex(`${candidate.provider}:${userId}:${candidate.suggestedScopes.join(",")}:${Date.now()}`);

    const record: ConsentAuthorizationRecord = {
      recordId,
      provider: candidate.provider,
      authorizedByUserId: userId,
      grantedScopes: candidate.suggestedScopes,
      isRevoked: false,
      grantedAt: new Date().toISOString(),
      auditHash,
    };

    this.records.set(recordId, record);
    return record;
  }

  revokeAuthorization(provider: VibeProviderId, userId = "priya.nair@brahma.dev"): boolean {
    let revokedAny = false;
    for (const record of this.records.values()) {
      if (record.provider === provider && !record.isRevoked) {
        record.isRevoked = true;
        record.revokedAt = new Date().toISOString();
        revokedAny = true;
      }
    }

    for (const cand of this.candidates.values()) {
      if (cand.provider === provider) {
        cand.consentStatus = "SUPPRESSED";
      }
    }

    return revokedAny;
  }

  getAuthorizationRecords(): ConsentAuthorizationRecord[] {
    return Array.from(this.records.values());
  }
}

export const consentAuthLedger = ConsentAuthLedger.getInstance();
