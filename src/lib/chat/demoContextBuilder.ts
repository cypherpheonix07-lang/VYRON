/**
 * PROJECT BRAHMA — DEMO CONTEXT BUILDER (FL-03-C STEP 1)
 * Builds contextual prompt using seeded data exclusively — zero Supabase queries.
 */

import { DEMO_PROJECT } from "@/data/demo/demoProject";
import { DEMO_GATE_RESULTS } from "@/data/demo/demoGateResults";
import { DEMO_SCAN_RESULTS } from "@/data/demo/demoScanResults";
import { DEMO_BLUEPRINT_NODES } from "@/data/demo/demoBlueprint";

export interface DemoChatContext {
  systemPrompt: string;
  projectName: string;
  domain: string;
  healthScore: number;
}

export function buildDemoChatContext(domain = "fintech"): DemoChatContext {
  const failingGates = DEMO_GATE_RESULTS.filter((g) => !g.passed);

  const systemPrompt = `You are the PROJECT BRAHMA Demo AI Assistant.
You are demonstrating BRAHMA capabilities using a synthetic enterprise benchmark:
"${DEMO_PROJECT.name}" (Domain: ${domain.toUpperCase()}).

HEALTH STATUS: ${DEMO_PROJECT.healthScore}/100 (RELEASE BLOCKED)

GATE FAILURES:
${failingGates.map((g) => `- ${g.gate_name}: Score ${g.score}/${g.threshold} (${g.evidence})`).join("\n")}

SCAN FINDINGS:
- Total: ${DEMO_SCAN_RESULTS.totalFindings} findings (8 HIGH security, 15 high cyclomatic CCN)
- Highest CCN: 34 (process_multi_currency_settlement in payment/processor.py)
- Architecture: 12 distributed microservices connected via gRPC and HTTP/2

DEMO IMMERSION RULES:
- Explain findings and architecture realistically.
- If asked about real user data, explicitly clarify that Demo Mode operates in a safe synthetic sandbox.
- Use provenance markers [cite:label:source:sha256] for factual architecture claims.`;

  return {
    systemPrompt,
    projectName: DEMO_PROJECT.name,
    domain,
    healthScore: DEMO_PROJECT.healthScore,
  };
}
