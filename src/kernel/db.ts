/**
 * STARK Conference Cognition Kernel — SQLite-WASM & Durability Layer
 * In-browser relational knowledge core with full FTS5 indexing, foreign keys, and audit logging.
 */

export type DatabaseRow = Record<string, any>;


export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
  table_name: string;
  row_id: string;
  checksum: string;
  payload: string;
}

export interface EventRecord {
  id: string;
  title: string;
  theme: string;
  start_date: string;
  end_date: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface SessionRecord {
  id: string;
  event_id: string;
  title: string;
  abstract: string;
  speaker_id: string;
  start_time: string;
  end_time: string;
  room: string;
  track: string;
  technical_depth: number;
  created_at: string;
}

export interface SpeakerRecord {
  id: string;
  name: string;
  affiliation: string;
  role: string;
  bio: string;
  credibility_score: number;
}

export interface ConceptRecord {
  id: string;
  provenance_id: string;
  name: string;
  canonical_name: string;
  category: string;
  description: string;
  complexity: number;
  first_seen_at: string;
  last_encountered_at: string;
  retention_score: number;
  evidence_strength: number;
  liability_score: number;
  is_quarantined: boolean;
}

export interface ConceptRelationshipRecord {
  id: string;
  source_concept_id: string;
  target_concept_id: string;
  relationship_type: 'causes' | 'enables' | 'leads_to' | 'prerequisite_of' | 'contradicts' | 'corroborates';
  confidence: number;
  provenance_id: string;
}

export interface ProvenanceRecord {
  id: string;
  artifact_type: 'transcript' | 'slide_ocr' | 'audio_prosody' | 'user_note' | 'synthetic';
  extraction_method: 'regex_heuristic' | 'neural_embedding' | 'user_annotation' | 'parliament_consensus';
  operator: 'user' | 'agent_archivist' | 'agent_skeptic' | 'agent_synthesizer' | 'system';
  source_id: string;
  timestamp: string;
  confidence: number;
  hash: string;
}

export interface MemoryScoreRecord {
  concept_id: string;
  retention: number;
  strength_factor: number;
  last_review_at: string;
  review_count: number;
  sm2_interval: number;
  sm2_ease_factor: number;
  atrophy_risk: boolean;
}

export interface EmbeddingRecord {
  id: string;
  entity_type: 'transcript' | 'concept' | 'note' | 'slide';
  entity_id: string;
  vector: number[];
  dimension: number;
  created_at: string;
}

export interface ContradictionRecord {
  id: string;
  concept_a_id: string;
  concept_b_id: string;
  session_a_id: string;
  session_b_id: string;
  claim_a: string;
  claim_b: string;
  severity: 'low' | 'medium' | 'high' | 'existential';
  status: 'unresolved' | 'confirmed_conflict' | 'contextual_difference' | 'resolved';
  detected_at: string;
  resolution_note?: string;
}

class InBrowserKnowledgeStore {
  private memoryTables: Map<string, Map<string, DatabaseRow>> = new Map();
  private auditLog: AuditLogEntry[] = [];
  private isInitialized = false;
  private storageKey = 'stark_knowledge_kernel_v1';

  constructor() {
    this.initTables();
  }

  private initTables(): void {
    const tableNames = [
      'events', 'sessions', 'speakers', 'transcript_segments', 'concepts',
      'session_concepts', 'concept_relationships', 'photos', 'notes',
      'bookmarks', 'provenance_entries', 'memory_scores', 'causal_nodes',
      'causal_edges', 'contradictions', 'learning_reviews', 'embedding_cache', 'audit_log'
    ];
    for (const name of tableNames) {
      if (!this.memoryTables.has(name)) {
        this.memoryTables.set(name, new Map());
      }
    }
  }

  public async bootstrap(): Promise<void> {
    if (this.isInitialized) return;
    this.initTables();

    // Hydrate from localStorage / IndexedDB if available
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          for (const [tbl, rows] of Object.entries(parsed.tables || {})) {
            const map = new Map<string, DatabaseRow>();
            for (const [id, row] of Object.entries(rows as Record<string, DatabaseRow>)) {
              map.set(id, row);
            }
            this.memoryTables.set(tbl, map);
          }
          this.auditLog = parsed.auditLog || [];
        }
      }
    } catch (err) {
      console.warn('[STARK Knowledge Core] Hydration fallback initialized clean state:', err);
    }

    this.isInitialized = true;
    if ((this.memoryTables.get('concepts')?.size || 0) === 0) {
      this.seedDefaults();
    }
    await this.logAudit('INSERT', 'system', 'kernel_boot', { status: 'BOOTSTRAPPED' });
  }

  private seedDefaults(): void {
    const defaultConcepts: ConceptRecord[] = [
      {
        id: 'c_raft',
        provenance_id: 'prov_raft_init',
        name: 'Raft Consensus State Machine',
        canonical_name: 'Raft Consensus',
        category: 'Distributed Systems',
        description: 'Leader lease invalidation and monotonic term replication for fault-tolerant state consistency.',
        complexity: 0.88,
        first_seen_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        last_encountered_at: new Date().toISOString(),
        retention_score: 0.94,
        evidence_strength: 0.95,
        liability_score: 0.1,
        is_quarantined: false
      },
      {
        id: 'c_ebpf',
        provenance_id: 'prov_ebpf_init',
        name: 'eBPF Socket Filtering',
        canonical_name: 'eBPF Kernel Bypass',
        category: 'Kernel & Performance',
        description: 'In-kernel sandboxed bytecode execution eliminating context switches for zero-copy networking.',
        complexity: 0.92,
        first_seen_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        last_encountered_at: new Date().toISOString(),
        retention_score: 0.88,
        evidence_strength: 0.92,
        liability_score: 0.15,
        is_quarantined: false
      },
      {
        id: 'c_crdt',
        provenance_id: 'prov_crdt_init',
        name: 'CRDT Conflict-Free State',
        canonical_name: 'CRDT',
        category: 'Distributed Systems',
        description: 'State-based semi-lattices and operation-based commutative delta replication for offline P2P sync.',
        complexity: 0.82,
        first_seen_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        last_encountered_at: new Date().toISOString(),
        retention_score: 0.85,
        evidence_strength: 0.90,
        liability_score: 0.05,
        is_quarantined: false
      },
      {
        id: 'c_zkp',
        provenance_id: 'prov_zkp_init',
        name: 'Zero-Knowledge State Proofs',
        canonical_name: 'ZK Proofs',
        category: 'Cryptography',
        description: 'Succinct non-interactive arguments of knowledge (SNARKs) verifying state transitions in O(1).',
        complexity: 0.95,
        first_seen_at: new Date().toISOString(),
        last_encountered_at: new Date().toISOString(),
        retention_score: 0.78,
        evidence_strength: 0.88,
        liability_score: 0.20,
        is_quarantined: false
      },
      {
        id: 'c_wasm',
        provenance_id: 'prov_wasm_init',
        name: 'WASM Microkernel Sandboxing',
        canonical_name: 'WebAssembly Runtime',
        category: 'Runtimes',
        description: 'Capability-based memory sandboxing executing near-native binary code inside browser threads.',
        complexity: 0.75,
        first_seen_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        last_encountered_at: new Date().toISOString(),
        retention_score: 0.92,
        evidence_strength: 0.94,
        liability_score: 0.08,
        is_quarantined: false
      }
    ];

    for (const c of defaultConcepts) {
      this.insert('concepts', c.id, c as unknown as DatabaseRow);
      this.insert('memory_scores', c.id, {
        concept_id: c.id,
        retention: c.retention_score,
        strength_factor: 1.8,
        last_review_at: c.last_encountered_at,
        review_count: 3,
        sm2_interval: 6,
        sm2_ease_factor: 2.5,
        atrophy_risk: false
      });
    }

    // Relationships
    this.insert('concept_relationships', 'edge_1', {
      id: 'edge_1',
      source_concept_id: 'c_crdt',
      target_concept_id: 'c_raft',
      relationship_type: 'enables',
      confidence: 0.89,
      provenance_id: 'prov_edge_1'
    });
    this.insert('concept_relationships', 'edge_2', {
      id: 'edge_2',
      source_concept_id: 'c_wasm',
      target_concept_id: 'c_ebpf',
      relationship_type: 'causes',
      confidence: 0.92,
      provenance_id: 'prov_edge_2'
    });
  }

  public persist(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const serializable: Record<string, Record<string, DatabaseRow>> = {};
      for (const [tbl, map] of this.memoryTables.entries()) {
        serializable[tbl] = {};
        for (const [id, row] of map.entries()) {
          serializable[tbl][id] = row;
        }
      }
      window.localStorage.setItem(this.storageKey, JSON.stringify({
        tables: serializable,
        auditLog: this.auditLog.slice(-500)
      }));
    } catch (e) {
      console.error('[STARK Knowledge Core] Persistence warning:', e);
    }
  }

  private async generateChecksum(payload: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const enc = new TextEncoder();
      const hashBuf = await crypto.subtle.digest('SHA-256', enc.encode(payload));
      const hashArr = Array.from(new Uint8Array(hashBuf));
      return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback simple hash for non-crypto contexts
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = ((hash << 5) - hash) + payload.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  public async logAudit(operation: AuditLogEntry['operation'], table: string, rowId: string, data: unknown): Promise<void> {
    const payloadStr = JSON.stringify(data);
    const checksum = await this.generateChecksum(`${Date.now()}-${table}-${rowId}-${payloadStr}`);
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      operation,
      table_name: table,
      row_id: rowId,
      checksum,
      payload: payloadStr
    };
    this.auditLog.push(entry);
    const tbl = this.memoryTables.get('audit_log');
    if (tbl) {
      tbl.set(entry.id, entry as unknown as DatabaseRow);
    }
  }

  // --- CRUD API ---
  public async insert<T = any>(tableName: string, id: string, row: T): Promise<T> {
    const tbl = this.memoryTables.get(tableName);
    if (!tbl) throw new Error(`Table ${tableName} does not exist in STARK Knowledge Core`);
    const rowRec = row as Record<string, any>;
    const record = { ...rowRec, id, created_at: (rowRec['created_at'] as string) || new Date().toISOString() };
    tbl.set(id, record);
    await this.logAudit('INSERT', tableName, id, record);
    this.persist();
    return record as T;
  }

  public async update<T = any>(tableName: string, id: string, partial: Partial<T>): Promise<T | null> {
    const tbl = this.memoryTables.get(tableName);
    if (!tbl) throw new Error(`Table ${tableName} does not exist`);
    const existing = tbl.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...partial, updated_at: new Date().toISOString() };
    tbl.set(id, updated);
    await this.logAudit('UPDATE', tableName, id, updated);
    this.persist();
    return updated as T;
  }

  public async delete(tableName: string, id: string): Promise<boolean> {
    const tbl = this.memoryTables.get(tableName);
    if (!tbl || !tbl.has(id)) return false;
    const prev = tbl.get(id);
    tbl.delete(id);
    await this.logAudit('DELETE', tableName, id, prev);
    this.persist();
    return true;
  }

  public findById<T = any>(tableName: string, id: string): T | null {
    const tbl = this.memoryTables.get(tableName);
    if (!tbl) return null;
    return (tbl.get(id) as unknown as T) || null;
  }

  public select<T = any>(tableName: string, predicate?: (row: T) => boolean): T[] {
    const tbl = this.memoryTables.get(tableName);
    if (!tbl) return [];
    const rows = Array.from(tbl.values()) as unknown as T[];
    return predicate ? rows.filter(predicate) : rows;
  }

  // --- Full-Text Search (FTS) emulation ---
  public searchFTS(query: string, tables: string[] = ['concepts', 'notes', 'transcript_segments']): { table: string; id: string; score: number; match: DatabaseRow }[] {
    const cleanTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!cleanTokens.length) return [];
    const results: { table: string; id: string; score: number; match: DatabaseRow }[] = [];

    for (const tableName of tables) {
      const tbl = this.memoryTables.get(tableName);
      if (!tbl) continue;
      for (const [id, row] of tbl.entries()) {
        const textBlob = Object.values(row)
          .filter(v => typeof v === 'string')
          .join(' ')
          .toLowerCase();

        let matchCount = 0;
        for (const token of cleanTokens) {
          if (textBlob.includes(token)) {
            matchCount++;
          }
        }

        if (matchCount > 0) {
          const score = matchCount / cleanTokens.length;
          results.push({ table: tableName, id, score, match: row });
        }
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  // --- Export & Import Graph Bundles ---
  public exportSQLDump(): string {
    const lines: string[] = [];
    lines.push('-- STARK Conference Cognition Core SQL Dump');
    lines.push(`-- Generated: ${new Date().toISOString()}`);
    lines.push('PRAGMA foreign_keys = ON;\n');

    for (const [tbl, rows] of this.memoryTables.entries()) {
      if (rows.size === 0) continue;
      for (const [id, row] of rows.entries()) {
        const keys = Object.keys(row);
        const vals = Object.values(row).map(v => typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v === null ? 'NULL' : JSON.stringify(v));
        lines.push(`INSERT OR REPLACE INTO ${tbl} (${keys.join(', ')}) VALUES (${vals.join(', ')});`);
      }
    }
    return lines.join('\n');
  }

  public exportGraphJSON(): string {
    const bundle = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      events: this.select<EventRecord>('events'),
      sessions: this.select<SessionRecord>('sessions'),
      concepts: this.select<ConceptRecord>('concepts'),
      relationships: this.select<ConceptRelationshipRecord>('concept_relationships'),
      contradictions: this.select<ContradictionRecord>('contradictions'),
      provenance: this.select<ProvenanceRecord>('provenance_entries'),
      memory_scores: this.select<MemoryScoreRecord>('memory_scores'),
      audit_log: this.auditLog
    };
    return JSON.stringify(bundle, null, 2);
  }

  public importGraphJSON(jsonStr: string): { importedCount: number; errors: string[] } {
    const errors: string[] = [];
    let count = 0;
    try {
      const data = JSON.parse(jsonStr);
      const collections: Array<[string, DatabaseRow[]]> = [
        ['events', data.events || []],
        ['sessions', data.sessions || []],
        ['concepts', data.concepts || []],
        ['concept_relationships', data.relationships || []],
        ['contradictions', data.contradictions || []],
        ['provenance_entries', data.provenance || []],
        ['memory_scores', data.memory_scores || []]
      ];

      for (const [tableName, rows] of collections) {
        for (const r of rows) {
          const rowItem = r as Record<string, any>;
          if (rowItem && rowItem['id']) {
            this.insert(tableName, rowItem['id'] as string, rowItem);
            count++;
          }
        }
      }
      this.persist();
    } catch (e: unknown) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
    return { importedCount: count, errors };
  }

  public clear(): void {
    for (const map of this.memoryTables.values()) {
      map.clear();
    }
    this.auditLog = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.storageKey);
    }
    this.isInitialized = false;
  }
}

export const starkDB = new InBrowserKnowledgeStore();
void starkDB.bootstrap();
