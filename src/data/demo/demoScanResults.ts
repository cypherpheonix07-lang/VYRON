/**
 * PROJECT BRAHMA — DEMO SCAN RESULTS (FL-02-B STEP 2)
 * High-fidelity synthetic scan findings: 47 findings across FinLedger microservices.
 * Breakdown: 15 high-complexity (CCN 16-34), 8 HIGH security (Bandit B101, B106, B303), 24 MEDIUM findings.
 */

export interface CodeFinding {
  id: string;
  file: string;
  line: number;
  column?: number;
  severity: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  category: "Security" | "Complexity" | "Reliability" | "Compliance";
  ruleId: string;
  message: string;
  cwe?: string;
  ccn?: number;
  snippet?: string;
  remediation?: string;
}

export interface DemoScanResult {
  scanId: string;
  projectId: string;
  timestamp: string;
  totalFindings: number;
  findings: CodeFinding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    avgCCN: number;
    maxCCN: number;
    scannedFiles: number;
    scannedLines: number;
  };
}

// 15 High-Complexity Findings (CCN 16 - 34)
const complexityFindings: CodeFinding[] = [
  {
    id: "CCN-01",
    file: "finledger/payment/processor.py",
    line: 142,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 34,
    message: "Function `process_multi_currency_settlement` exceeds cyclomatic threshold (CCN 34 > 15).",
    snippet: "def process_multi_currency_settlement(batch, routing_table, fx_stream, flags): ...",
    remediation: "Decompose into separate pipeline stages: validation, FX conversion, and ledger commitment.",
  },
  {
    id: "CCN-02",
    file: "finledger/risk/engine.py",
    line: 88,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 29,
    message: "Function `evaluate_transaction_risk` has excessive decision branching (CCN 29 > 15).",
    snippet: "def evaluate_transaction_risk(tx, history, sanctions_list, velocity_rules): ...",
    remediation: "Apply Chain of Responsibility pattern for sequential risk rule evaluators.",
  },
  {
    id: "CCN-03",
    file: "finledger/ledger/journal.py",
    line: 215,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 26,
    message: "Method `reconcile_double_entry_balance` contains nested condition depth 6 (CCN 26).",
    snippet: "def reconcile_double_entry_balance(account_id, journal_entries, snapshot_id): ...",
    remediation: "Extract balance accumulation and account state verification into distinct pure functions.",
  },
  {
    id: "CCN-04",
    file: "finledger/auth/token_manager.py",
    line: 95,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 24,
    message: "Function `validate_m2m_delegation_chain` exceeds cognitive threshold (CCN 24).",
    snippet: "def validate_m2m_delegation_chain(token, required_scopes, client_registry): ...",
    remediation: "Simplify scope hierarchy traversal with a recursive descent predicate.",
  },
  {
    id: "CCN-05",
    file: "finledger/gateway/proxy.py",
    line: 178,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 23,
    message: "Function `route_incoming_request` has 18 distinct return statements (CCN 23).",
    snippet: "async def route_incoming_request(request, circuit_breakers, tenant_catalog): ...",
    remediation: "Replace cascading match logic with dynamic routing table map.",
  },
  {
    id: "CCN-06",
    file: "finledger/compliance/pci_dss.py",
    line: 112,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 22,
    message: "Function `audit_cardholder_data_environment` complex AST branch (CCN 22).",
    snippet: "def audit_cardholder_data_environment(node_map, flow_spec, cipher_suites): ...",
    remediation: "Separate network topology checks from encryption protocol auditing.",
  },
  {
    id: "CCN-07",
    file: "finledger/payment/settlement_batch.py",
    line: 64,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 21,
    message: "Method `execute_ach_clearing` contains high cyclomatic density (CCN 21).",
    snippet: "def execute_ach_clearing(batch_id, gateway_creds, nsf_retries): ...",
    remediation: "Encapsulate ACH gateway protocol handling into dedicated adapter class.",
  },
  {
    id: "CCN-08",
    file: "finledger/risk/velocity.py",
    line: 130,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 20,
    message: "Function `calculate_sliding_window_velocity` exceeds complexity threshold (CCN 20).",
    snippet: "def calculate_sliding_window_velocity(account_id, intervals, bounds): ...",
    remediation: "Leverage Redis time-series aggregation to reduce client-side branch calculation.",
  },
  {
    id: "CCN-09",
    file: "finledger/ledger/hash_chain.py",
    line: 52,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 19,
    message: "Method `verify_merkle_tree_integrity` contains deep conditional loops (CCN 19).",
    snippet: "def verify_merkle_tree_integrity(root_hash, leaf_proofs, block_index): ...",
    remediation: "Extract cryptographic leaf sibling pair verification to helper routine.",
  },
  {
    id: "CCN-10",
    file: "finledger/payment/refund_engine.py",
    line: 82,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 19,
    message: "Function `dispute_arbitration_handler` has complex branching (CCN 19).",
    snippet: "def dispute_arbitration_handler(chargeback_id, reason_code, evidence_bundle): ...",
    remediation: "Map reason codes to dispute handlers using a strategy registry.",
  },
  {
    id: "CCN-11",
    file: "finledger/auth/crypto_signer.py",
    line: 140,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 18,
    message: "Function `verify_hsm_signature_bundle` contains high branch count (CCN 18).",
    snippet: "def verify_hsm_signature_bundle(payload, signature, pubkey_cert): ...",
    remediation: "Refactor certificate chain validation out of payload signature check.",
  },
  {
    id: "CCN-12",
    file: "finledger/reports/generator.py",
    line: 230,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 17,
    message: "Function `render_quarterly_reconciliation` exceeds readability limit (CCN 17).",
    snippet: "def render_quarterly_reconciliation(quarter, fiscal_year, entity_id): ...",
    remediation: "Split quarterly computation into individual month aggregate builders.",
  },
  {
    id: "CCN-13",
    file: "finledger/gateway/rate_limiter.py",
    line: 76,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 17,
    message: "Method `evaluate_burst_and_tier_quota` complex boolean expressions (CCN 17).",
    snippet: "def evaluate_burst_and_tier_quota(client_id, ip_addr, cost_weight): ...",
    remediation: "Delegate token bucket subtraction to Lua script running in Redis.",
  },
  {
    id: "CCN-14",
    file: "finledger/compliance/aml_scanner.py",
    line: 98,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 16,
    message: "Function `match_pep_and_sanction_records` exceeds branching standard (CCN 16).",
    snippet: "def match_pep_and_sanction_records(subject_name, dob, nationality, aliases): ...",
    remediation: "Use fuzzy index search pipeline instead of cascading python string heuristics.",
  },
  {
    id: "CCN-15",
    file: "finledger/payment/fee_calculator.py",
    line: 45,
    severity: "HIGH",
    category: "Complexity",
    ruleId: "AST-CCN-HIGH",
    ccn: 16,
    message: "Function `calculate_interchange_plus_markup` exceeds CCN 15 (CCN 16).",
    snippet: "def calculate_interchange_plus_markup(card_type, tier, volume_mrr, country): ...",
    remediation: "Use declarative fee schedule lookup table rather than nested conditions.",
  },
];

// 8 HIGH Security Findings (Bandit B101, B106, B303, CWE-798, CWE-327, CWE-287, CWE-319, CWE-20)
const highSecurityFindings: CodeFinding[] = [
  {
    id: "SEC-HIGH-01",
    file: "finledger/auth/token_manager.py",
    line: 48,
    severity: "HIGH",
    category: "Security",
    ruleId: "B106:hardcoded_password_funcarg",
    cwe: "CWE-798",
    message: "Hardcoded fallback JWT signing secret detected in fallback configuration.",
    snippet: "JWT_SECRET = os.getenv('JWT_SECRET', 'finledger_dev_fallback_secret_xyz')",
    remediation: "Throw configuration exception if JWT_SECRET is not present in runtime environment.",
  },
  {
    id: "SEC-HIGH-02",
    file: "finledger/payment/processor.py",
    line: 210,
    severity: "HIGH",
    category: "Security",
    ruleId: "B101:assert_used",
    cwe: "CWE-617",
    message: "Use of assert in production transaction state validation can be bypassed with -O flag.",
    snippet: "assert tx_context.account_balance >= amount, 'Insufficient balance'",
    remediation: "Replace assert statement with explicit `if` check and raise `InsufficientFundsError`.",
  },
  {
    id: "SEC-HIGH-03",
    file: "finledger/ledger/hash_chain.py",
    line: 38,
    severity: "HIGH",
    category: "Security",
    ruleId: "B303:md5",
    cwe: "CWE-327",
    message: "Insecure hashing algorithm MD5 utilized for internal ledger node checksum indexing.",
    snippet: "node_digest = hashlib.md5(block_content).hexdigest()",
    remediation: "Replace MD5 with SHA-256 (`hashlib.sha256(block_content).hexdigest()`).",
  },
  {
    id: "SEC-HIGH-04",
    file: "finledger/gateway/proxy.py",
    line: 114,
    severity: "HIGH",
    category: "Security",
    ruleId: "B104:hardcoded_bind_all_interfaces",
    cwe: "CWE-200",
    message: "Gateway server configured to bind to 0.0.0.0 without mTLS termination enforcement.",
    snippet: "uvicorn.run(app, host='0.0.0.0', port=8443, ssl_keyfile=None)",
    remediation: "Bind to internal interface and enforce TLS context certificates.",
  },
  {
    id: "SEC-HIGH-05",
    file: "finledger/auth/session.py",
    line: 72,
    severity: "HIGH",
    category: "Security",
    ruleId: "CWE-287:improper_authentication",
    cwe: "CWE-287",
    message: "Session token entropy insufficient (< 128 bits) during rapid merchant re-authentication.",
    snippet: "session_id = f'{client_id}_{int(time.time())}_{random.randint(1000, 9999)}'",
    remediation: "Use `secrets.token_urlsafe(32)` to generate cryptographically random session tokens.",
  },
  {
    id: "SEC-HIGH-06",
    file: "finledger/payment/card_vault.py",
    line: 89,
    severity: "HIGH",
    category: "Security",
    ruleId: "CWE-319:cleartext_transmission",
    cwe: "CWE-319",
    message: "Cardholder primary account numbers (PAN) logged in unmasked plain text during debug level.",
    snippet: "logger.debug(f'Submitting tokenization for PAN: {raw_card.number}')",
    remediation: "Sanitize card number using `mask_pan(raw_card.number)` showing only last 4 digits.",
  },
  {
    id: "SEC-HIGH-07",
    file: "finledger/risk/engine.py",
    line: 195,
    severity: "HIGH",
    category: "Security",
    ruleId: "CWE-20:improper_input_validation",
    cwe: "CWE-20",
    message: "Deserialization of untrusted payload parameters in risk telemetry webhook callback.",
    snippet: "payload_obj = pickle.loads(request.get_body())",
    remediation: "Replace pickle with strict Pydantic model validation and JSON deserialization.",
  },
  {
    id: "SEC-HIGH-08",
    file: "finledger/compliance/export.py",
    line: 58,
    severity: "HIGH",
    category: "Security",
    ruleId: "B608:hardcoded_sql_expressions",
    cwe: "CWE-89",
    message: "Possible SQL injection vector via string interpolation in dynamic export query.",
    snippet: "query = f'SELECT * FROM ledger_audit WHERE client_id = \"{client_param}\"'",
    remediation: "Use parameterized query binds: `SELECT * FROM ledger_audit WHERE client_id = :client_id`.",
  },
];

// 24 MEDIUM Security Findings
const mediumSecurityFindings: CodeFinding[] = Array.from({ length: 24 }).map((_, i) => {
  const index = i + 1;
  const files = [
    "finledger/gateway/cors.py",
    "finledger/auth/jwt_validator.py",
    "finledger/payment/idempotency.py",
    "finledger/ledger/snapshots.py",
    "finledger/risk/heuristics.py",
    "finledger/reports/csv_writer.py",
  ];
  const file = files[i % files.length] || "finledger/payment/processor.py";
  return {
    id: `SEC-MED-${index.toString().padStart(2, "0")}`,
    file,
    line: 20 + i * 8,
    severity: "MEDIUM" as const,
    category: "Security" as const,
    ruleId: i % 2 === 0 ? "B301:pickle" : "B501:request_with_no_cert_validation",
    cwe: i % 2 === 0 ? "CWE-502" : "CWE-295",
    message: `Security finding ${index}: Verify cryptographic parameters and TLS verification policy in ${file}.`,
    remediation: "Ensure TLS verify=True and avoid non-cryptographic pseudo-random generators.",
  };
});

export const DEMO_SCAN_FINDINGS: CodeFinding[] = [
  ...complexityFindings,
  ...highSecurityFindings,
  ...mediumSecurityFindings,
];

export const DEMO_SCAN_RESULTS: DemoScanResult = {
  scanId: "scan-finledger-20260910-1423",
  projectId: "demo-project-brahma-showcase",
  timestamp: "2026-09-10T14:23:00Z",
  totalFindings: DEMO_SCAN_FINDINGS.length,
  findings: DEMO_SCAN_FINDINGS,
  summary: {
    critical: 0,
    high: 23, // 15 CCN + 8 Security
    medium: 24,
    low: 0,
    avgCCN: 18.3,
    maxCCN: 34,
    scannedFiles: 42,
    scannedLines: 14890,
  },
};
