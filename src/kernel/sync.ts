/**
 * STARK Conference Cognition Kernel — Offline-First CRDT Sync Layer
 * State-based Operation Log (op-log), Vector Clock causality, and Last-Write-Wins (LWW) conflict merging.
 */

import { starkDB, type DatabaseRow } from './db';

export interface VectorClock {
  node_id: string;
  counter: number;
  updated_at: string;
}

export interface CRDTOpLogEntry {
  op_id: string;
  node_id: string;
  clock_counter: number;
  timestamp: string;
  entity_type: string;
  entity_id: string;
  action: 'UPSERT' | 'DELETE';
  payload: DatabaseRow;
}

export interface SyncBundle {
  source_node_id: string;
  vector_clock: VectorClock;
  ops: CRDTOpLogEntry[];
  exported_at: string;
}

export class CRDTSyncManager {
  private static localNodeId: string = this.getOrInitNodeId();
  private static localCounter = 0;
  private static opLog: CRDTOpLogEntry[] = [];

  private static getOrInitNodeId(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      let id = window.localStorage.getItem('stark_crdt_node_id');
      if (!id) {
        id = `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        window.localStorage.setItem('stark_crdt_node_id', id);
      }
      return id;
    }
    return `node_ephemeral_${Date.now()}`;
  }

  public static recordMutation(entityType: string, entityId: string, action: 'UPSERT' | 'DELETE', payload: DatabaseRow): CRDTOpLogEntry {
    this.localCounter++;
    const entry: CRDTOpLogEntry = {
      op_id: `op_${this.localNodeId}_${this.localCounter}`,
      node_id: this.localNodeId,
      clock_counter: this.localCounter,
      timestamp: new Date().toISOString(),
      entity_type: entityType,
      entity_id: entityId,
      action,
      payload
    };
    this.opLog.push(entry);
    return entry;
  }

  public static exportSyncBundle(): SyncBundle {
    return {
      source_node_id: this.localNodeId,
      vector_clock: {
        node_id: this.localNodeId,
        counter: this.localCounter,
        updated_at: new Date().toISOString()
      },
      ops: [...this.opLog],
      exported_at: new Date().toISOString()
    };
  }

  public static mergeSyncBundle(bundle: SyncBundle): {
    applied_count: number;
    conflicts_resolved: number;
  } {
    let applied = 0;
    let conflicts = 0;

    for (const op of bundle.ops) {
      const existing = starkDB.findById<DatabaseRow>(op.entity_type, op.entity_id);
      if (!existing) {
        if (op.action === 'UPSERT') {
          starkDB.insert(op.entity_type, op.entity_id, op.payload);
          applied++;
        }
      } else {
        // Last-Write-Wins based on ISO timestamp comparison
        const existingTime = new Date((existing['updated_at'] as string) || (existing['created_at'] as string) || 0).getTime();
        const incomingTime = new Date(op.timestamp).getTime();

        if (incomingTime >= existingTime) {
          conflicts++;
          if (op.action === 'UPSERT') {
            starkDB.update(op.entity_type, op.entity_id, op.payload);
            applied++;
          } else {
            starkDB.delete(op.entity_type, op.entity_id);
            applied++;
          }
        }
      }
    }

    return { applied_count: applied, conflicts_resolved: conflicts };
  }
}
