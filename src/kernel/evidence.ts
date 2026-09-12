/**
 * STARK Conference Cognition Kernel — Temporal Evidence Fabric
 * Cryptographically bound provenance chains with SHA-256 Web Crypto hashing and evidence scoring.
 */

import { starkDB, type ProvenanceRecord } from './db';

export interface EvidenceNode {
  provenance_id: string;
  artifact_type: ProvenanceRecord['artifact_type'];
  extraction_method: ProvenanceRecord['extraction_method'];
  operator: ProvenanceRecord['operator'];
  source_id: string;
  source_snippet: string;
  timestamp: string;
  confidence: number;
  hash: string;
  corroborating_session_ids: string[];
  ancestry_ids: string[];
}

export class TemporalEvidenceFabric {
  public static async computeHash(content: string, source: string, timestamp: string): Promise<string> {
    const raw = `${content}::${source}::${timestamp}`;
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const enc = new TextEncoder();
      const buf = await crypto.subtle.digest('SHA-256', enc.encode(raw));
      const arr = Array.from(new Uint8Array(buf));
      return arr.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback deterministic digest
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
  }

  public static calculateEvidenceStrength(
    baseType: ProvenanceRecord['artifact_type'],
    corroborationCount = 0
  ): number {
    let baseScore = 0.60;
    switch (baseType) {
      case 'transcript':
        baseScore = 0.95;
        break;
      case 'slide_ocr':
        baseScore = 0.85;
        break;
      case 'user_note':
        baseScore = 0.70;
        break;
      case 'audio_prosody':
        baseScore = 0.65;
        break;
      case 'synthetic':
        baseScore = 0.40;
        break;
    }
    const bonus = Math.min(0.45, corroborationCount * 0.15);
    return Math.min(1.0, baseScore + bonus);
  }

  public static async registerEvidence(params: {
    artifact_type: ProvenanceRecord['artifact_type'];
    extraction_method: ProvenanceRecord['extraction_method'];
    operator: ProvenanceRecord['operator'];
    source_id: string;
    content: string;
    timestamp?: string;
    corroborating_sessions?: string[];
    ancestry_ids?: string[];
  }): Promise<EvidenceNode> {
    const timestamp = params.timestamp || new Date().toISOString();
    const hash = await this.computeHash(params.content, params.source_id, timestamp);
    const id = `prov_${hash.slice(0, 16)}`;
    const corroborations = params.corroborating_sessions || [];
    const confidence = this.calculateEvidenceStrength(params.artifact_type, corroborations.length);

    const record: ProvenanceRecord = {
      id,
      artifact_type: params.artifact_type,
      extraction_method: params.extraction_method,
      operator: params.operator,
      source_id: params.source_id,
      timestamp,
      confidence,
      hash
    };

    await starkDB.insert('provenance_entries', id, record as unknown as Record<string, unknown>);

    return {
      provenance_id: id,
      artifact_type: params.artifact_type,
      extraction_method: params.extraction_method,
      operator: params.operator,
      source_id: params.source_id,
      source_snippet: params.content.slice(0, 200),
      timestamp,
      confidence,
      hash,
      corroborating_session_ids: corroborations,
      ancestry_ids: params.ancestry_ids || []
    };
  }

  public static getAncestryChain(provenanceId: string): ProvenanceRecord[] {
    const chain: ProvenanceRecord[] = [];
    let currentId: string | null = provenanceId;

    while (currentId) {
      const entry = starkDB.findById<ProvenanceRecord>('provenance_entries', currentId);
      if (!entry) break;
      chain.push(entry);
      // For single lineage traversal
      currentId = null; // Can be extended to multi-parent DAG
    }

    return chain;
  }

  public static generateCitation(sessionTitle: string, speakerName: string, year = 2026): {
    apa: string;
    ieee: string;
    bibtex: string;
  } {
    const cleanSpeaker = speakerName || 'Keynote Speaker';
    const cleanTitle = sessionTitle || 'Conference Keynote Technical Insight';
    return {
      apa: `${cleanSpeaker}. (${year}). ${cleanTitle}. Proceedings of STARK International Engineering Summit.`,
      ieee: `[1] ${cleanSpeaker}, "${cleanTitle}," in Proc. STARK Int. Eng. Summit, ${year}.`,
      bibtex: `@inproceedings{stark_${year}_${cleanSpeaker.replace(/\s+/g, '_').toLowerCase()},\n  author = {${cleanSpeaker}},\n  title = {${cleanTitle}},\n  booktitle = {STARK International Engineering Summit},\n  year = {${year}}\n}`
    };
  }
}
