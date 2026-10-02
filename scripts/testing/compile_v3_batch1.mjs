/**
 * VYRON V3 MASTER PROMPT GENERATOR - BATCH 1 (S0–S7 + P001–P005)
 */

import fs from 'fs';
import path from 'path';

const TARGET_FILE = path.resolve('VYRON_Copilot_Master_Prompt_V3_100000_Words.md');

// Contract Dictionary Definitions with obligations, required artifacts, output shapes, and micro-examples
const CONTRACT_DEFS = {
  // A-Z: Foundations
  A: {
    title: "Define purpose.",
    obligation: "State the concrete engineering outcome and affected user workflow. Separate intended benefit from mechanism and define what evidence would demonstrate that benefit.",
    artifact: "Produce an outcome statement and a measurable user benefit criterion.",
    shape: "{ outcome_id: string, target_workflow: string, benefit_metric: string, proof_evidence_type: string }",
    example: "{ outcome_id: 'OUT_01', target_workflow: 'release_gate_eval', benefit_metric: '0_unauthorized_deployments', proof_evidence_type: 'signed_audit_receipt' }"
  },
  B: {
    title: "Bound scope.",
    obligation: "List included and excluded responsibilities. Name adjacent owners and prevent component from silently inheriting unrelated authority.",
    artifact: "Produce a responsibility boundary with explicit exclusions and adjacent owners.",
    shape: "{ component_id: string, in_scope: string[], out_of_scope: string[], adjacent_owners: Record<string, string> }",
    example: "{ component_id: 'INGESTION', in_scope: ['ast_parse', 'type_extract'], out_of_scope: ['db_migration'], adjacent_owners: { db: 'STORAGE_SERVICE' } }"
  },
  C: {
    title: "Assign ownership.",
    obligation: "Identify authoritative domain owner, operating owner, and escalation owner. Explain who may change contract and resolve disputes.",
    artifact: "Produce a canonical-writer assignment and dispute-resolution path.",
    shape: "{ canonical_writer: string, operator: string, escalation_path: string[], quorum_size: number }",
    example: "{ canonical_writer: 'ATLAS_CORE', operator: 'SRE_ONCALL', escalation_path: ['TECH_LEAD', 'VP_ENG'], quorum_size: 2 }"
  },
  D: {
    title: "Name consumers.",
    obligation: "Identify human and machine consumers, their permissions, and decisions made using output. Avoid exposing unnecessary internal details.",
    artifact: "Produce a consumer matrix with decisions, access needs, and presentation needs.",
    shape: "{ consumer_id: string, consumer_type: 'HUMAN' | 'SERVICE', required_grants: string[], decision_bound: string }",
    example: "{ consumer_id: 'COPILOT_UI', consumer_type: 'HUMAN', required_grants: ['read:topology'], decision_bound: 'render_graph' }"
  },
  E: {
    title: "Specify inputs.",
    obligation: "Define typed input fields, required values, defaults, maximum sizes, provenance, and validation behavior. Reject malformed inputs early.",
    artifact: "Produce a typed request schema and invalid-input examples.",
    shape: "{ schema_name: string, fields: Record<string, { type: string, required: boolean, max_bytes?: number }>, reject_code: number }",
    example: "{ schema_name: 'CommitRequest', fields: { sha: { type: 'sha256', required: true } }, reject_code: 400 }"
  },
  F: {
    title: "Specify outputs.",
    obligation: "Define typed successful, partial, and failed outputs. Include identifiers, versions, evidence references, timestamps, and limitations.",
    artifact: "Produce success, partial, and failure response examples with version references.",
    shape: "{ status: 'SUCCESS' | 'PARTIAL' | 'FAILED', payload_digest: string, limitations: string[], revision: string }",
    example: "{ status: 'PARTIAL', payload_digest: 'e3b0c44...', limitations: ['AST_UNAVAILABLE'], revision: 'v2.1' }"
  },
  G: {
    title: "Define identities.",
    obligation: "Specify stable identifiers and namespace. Distinguish aggregate identity, immutable revision identity, invocation identity, and external IDs.",
    artifact: "Produce an identifier glossary separating objects, revisions, attempts, and effects.",
    shape: "{ aggregate_urn: string, revision_sha: string, invocation_uuid: string, external_provider_id?: string }",
    example: "{ aggregate_urn: 'urn:vyron:proj:7a', revision_sha: 'a1b2c3d...', invocation_uuid: 'f47ac10b...', external_provider_id: 'gh-123' }"
  },
  H: {
    title: "Define schemas.",
    obligation: "Provide logical record definitions with types, optionality, constraints, and evolution rules preserving existing records.",
    artifact: "Produce field definitions with constraints, nullability, and evolution rules.",
    shape: "{ record_type: string, version: string, fields: Array<{ name: string, type: string, nullable: boolean, constraint?: string }> }",
    example: "{ record_type: 'UserRef', version: '1.0.0', fields: [{ name: 'id', type: 'uuid', nullable: false, constraint: 'PK' }] }"
  },
  I: {
    title: "Map relationships.",
    obligation: "Define relationship direction, cardinality, referential integrity, and deletion behavior. Distinguish ownership from display references.",
    artifact: "Produce an edge table with cardinality and deletion semantics.",
    shape: "{ from_node: string, to_node: string, edge_type: string, cardinality: '1:1' | '1:N' | 'M:N', on_delete: 'CASCADE' | 'RESTRICT' }",
    example: "{ from_node: 'Project', to_node: 'Session', edge_type: 'CONTAINS', cardinality: '1:N', on_delete: 'RESTRICT' }"
  },
  J: {
    title: "State invariants.",
    obligation: "Write conditions that must always hold, including isolation and consistency constraints. Provide a violating counterexample fixture.",
    artifact: "Produce executable invariant predicates and at least one violating fixture.",
    shape: "{ invariant_id: string, predicate_dsl: string, violation_fixture: Record<string, any> }",
    example: "{ invariant_id: 'INV_01', predicate_dsl: 'tenant_id(record) == session.tenant_id', violation_fixture: { tenant_id: 'T2', session_tenant: 'T1' } }"
  },
  K: {
    title: "Define preconditions.",
    obligation: "List conditions required before processing starts. Include current authorization, required source versions, readiness, and dependencies.",
    artifact: "Produce a precondition list with responsible enforcing boundary.",
    shape: "{ precondition_id: string, check_name: string, enforcing_gateway: string, on_failure_halt: boolean }",
    example: "{ precondition_id: 'PRE_01', check_name: 'jwt_valid', enforcing_gateway: 'API_GATEWAY', on_failure_halt: true }"
  },
  L: {
    title: "Define postconditions.",
    obligation: "State observable outcomes establishing success. Distinguish acknowledged requests from completed effects and verified effects.",
    artifact: "Produce observable success predicates and independent verification method.",
    shape: "{ postcondition_id: string, observable_evidence: string, verifier_module: string }",
    example: "{ postcondition_id: 'POST_01', observable_evidence: 'row_inserted_in_outbox', verifier_module: 'LEDGER_AUDITOR' }"
  },
  M: {
    title: "Model states.",
    obligation: "Enumerate lifecycle states with meanings and terminal conditions. Separate execution status from evidence confidence and sensitivity.",
    artifact: "Produce a state catalog distinguishing terminal and resumable conditions.",
    shape: "{ state_name: string, is_terminal: boolean, is_resumable: boolean, allowed_next_states: string[] }",
    example: "{ state_name: 'RUNNING', is_terminal: false, is_resumable: true, allowed_next_states: ['COMPLETED', 'FAILED', 'PAUSED'] }"
  },
  N: {
    title: "Specify transitions.",
    obligation: "For each transition, identify trigger, guard, actor, state changes, and emitted events. Define rejected transitions.",
    artifact: "Produce a transition table with guards, actors, effects, and rejection behavior.",
    shape: "{ from_state: string, trigger: string, guard: string, to_state: string, emitted_event: string, on_reject_code: number }",
    example: "{ from_state: 'DRAFT', trigger: 'PUBLISH', guard: 'is_valid', to_state: 'ACTIVE', emitted_event: 'Published', on_reject_code: 422 }"
  },
  O: {
    title: "Declare dependencies.",
    obligation: "Name upstream contracts and required capabilities. Distinguish hard dependencies from optional enrichment and describe outage behavior.",
    artifact: "Produce hard and optional dependency references with outage behavior.",
    shape: "{ dep_id: string, is_hard: boolean, fallback_action: 'FAIL' | 'DEGRADE_GRACEFULLY', sla_ms: number }",
    example: "{ dep_id: 'PG_DATABASE', is_hard: true, fallback_action: 'FAIL', sla_ms: 100 }"
  },
  P: {
    title: "Publish contracts.",
    obligation: "Describe interface through which consumers access capability. Include request validation, response semantics, and error models.",
    artifact: "Produce a versioned interface contract with validation and error semantics.",
    shape: "{ endpoint: string, method: 'GET' | 'POST' | 'RPC', contract_schema: string, error_responses: number[] }",
    example: "{ endpoint: '/v2/charter', method: 'GET', contract_schema: 'CharterResponseSchema', error_responses: [401, 403, 404] }"
  },
  Q: {
    title: "Version interfaces.",
    obligation: "Specify compatibility guarantees and migration windows. Record interface revision producing persisted outputs and reject incompatibilities.",
    artifact: "Produce a compatibility matrix and deprecation migration path.",
    shape: "{ interface_ver: string, min_supported_client: string, sunset_date_utc: string }",
    example: "{ interface_ver: 'v2.1', min_supported_client: 'v2.0', sunset_date_utc: '2027-01-01T00:00:00Z' }"
  },
  R: {
    title: "Identify authority.",
    obligation: "Identify which records are authoritative for each question. Avoid universal trust rankings that treat observations as proof of design intent.",
    artifact: "Produce an authority map specific to questions this phase answers.",
    shape: "{ question_domain: string, authoritative_source: string, secondary_corroborator?: string }",
    example: "{ question_domain: 'service_dependencies', authoritative_source: 'ATLAS_GRAPH', secondary_corroborator: 'K8S_DISCOVERY' }"
  },
  S: {
    title: "Preserve provenance.",
    obligation: "Record source identity, revision, transformation history, retrieval time, and producing capability for every material derived result.",
    artifact: "Produce a transformation chain linking derived outputs to original revisions.",
    shape: "{ derived_id: string, original_source_sha: string, transform_engine: string, transform_timestamp: string }",
    example: "{ derived_id: 'AST_01', original_source_sha: '9f83...', transform_engine: 'BabelParser@7.24', transform_timestamp: '2026-10-01T21:00:00Z' }"
  },
  T: {
    title: "Enforce tenancy.",
    obligation: "Restrict all records, indexes, caches, events, and execution scopes to authorized tenants. Test cross-tenant identifiers and traversal.",
    artifact: "Produce isolation checks spanning storage, retrieval, execution, and presentation.",
    shape: "{ isolation_level: 'RLS' | 'DATABASE_PER_TENANT', rls_expression: string, cross_tenant_rejection: string }",
    example: "{ isolation_level: 'RLS', rls_expression: 'tenant_id = auth.jwt()->>\"tenant_id\"', cross_tenant_rejection: 'HTTP_404_NOT_FOUND' }"
  },
  U: {
    title: "Enforce membership.",
    obligation: "Evaluate current project membership and role scope. Define revocation propagation and prohibit stale cached membership grants.",
    artifact: "Produce membership change fixtures, including revocation during active work.",
    shape: "{ role_name: string, allowed_actions: string[], revocation_propagation_ms: number }",
    example: "{ role_name: 'DEVELOPER', allowed_actions: ['read', 'submit_turn'], revocation_propagation_ms: 1000 }"
  },
  V: {
    title: "Specify permissions.",
    obligation: "Separate read, index, embed, model processing, export, share, mutate, and delete permissions at each trust boundary.",
    artifact: "Produce an operation-permission matrix with checks at each dispatch boundary.",
    shape: "{ operation: string, required_grant: string, trust_boundary: 'EDGE' | 'INTERNAL_RPC' | 'DATA_LAYER' }",
    example: "{ operation: 'TRIGGER_ANALYSIS', required_grant: 'analysis:run', trust_boundary: 'EDGE' }"
  },
  W: {
    title: "Classify sensitivity.",
    obligation: "Represent sensitivity separately from lifecycle and permission state. Specify handling for private, restricted, and ephemeral content.",
    artifact: "Produce independent sensitivity classifications and permitted handling rules.",
    shape: "{ classification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'CONFIDENTIAL', redaction_required_in_export: boolean }",
    example: "{ classification: 'RESTRICTED', redaction_required_in_export: true }"
  },
  X: {
    title: "Minimize collection.",
    obligation: "Collect only information necessary for stated task. Define maximum retention and avoid storing credentials or personal info in traces.",
    artifact: "Produce a collection inventory with necessity, minimization, and expiry reasons.",
    shape: "{ collected_field: string, necessity_justification: string, retention_ttl_days: number }",
    example: "{ collected_field: 'error_stack_trace', necessity_justification: 'root_cause_analysis', retention_ttl_days: 14 }"
  },
  Y: {
    title: "State assumptions.",
    obligation: "Identify unverified premises, effect on outcomes, and validation procedures. Do not promote assumptions into facts.",
    artifact: "Produce an assumption register with validation tasks and affected conclusions.",
    shape: "{ assumption_id: string, statement: string, validation_method: string, impact_if_false: string }",
    example: "{ assumption_id: 'ASM_01', statement: 'Git commit tree is linear', validation_method: 'git rev-list --merges', impact_if_false: 'rebuild_diff_dag' }"
  },
  Z: {
    title: "Plan execution.",
    obligation: "Describe ordered mechanism from admitted input to verified output. Name deterministic steps, model calls, and durable checkpoints.",
    artifact: "Produce ordered processing pseudocode including failure exits and durable checkpoints.",
    shape: "{ step_number: number, action_name: string, is_checkpoint: boolean, failure_step: number }",
    example: "{ step_number: 1, action_name: 'ValidateSchema', is_checkpoint: false, failure_step: 99 }"
  }
};

console.log("Contract dictionary base initialized.");
