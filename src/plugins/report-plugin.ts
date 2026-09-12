/**
 * PROJECT BRAHMA — REPORT PLUGIN (PHASE B.4)
 * MCP Tool "generate_report": Compiles architectural intelligence reports.
 */

import { PluginTool, PluginContext, ToolResult } from "./types";
import { fixtureStore } from "@/services/fixtureStore";

export const reportPluginTool: PluginTool = {
  name: "generate_report",
  description: "Compiles formal architectural, regulatory, and code quality assessment reports with gate verdicts.",
  inputSchema: {
    type: "object",
    properties: {
      projectId: { type: "string", description: "Project ID to generate report for" },
      template: {
        type: "string",
        description: "Report template: 'executive', 'security', 'architecture', 'pci_dss', 'hipaa'",
      },
    },
    required: ["projectId"],
  },
  handler: async (args: unknown, ctx: PluginContext): Promise<ToolResult> => {
    const { projectId, template = "executive" } =
      (args as { projectId: string; template?: string }) || {};

    if (ctx.isDemo) {
      const fix = fixtureStore.get("fintech");
      const sampleRep = fix.reports[0] || {
        id: "rep-demo-01",
        title: "Executive Architecture & Release Gate Report",
        date: new Date().toISOString().split("T")[0],
        summary: "Assessment of 7 release gates with 47 detected issues.",
        gateStatus: "BLOCKED",
      };

      const markdownContent = `# ${sampleRep.title}
**Project:** ${fix.project.name} (${projectId})
**Date:** ${sampleRep.date}
**Overall Status:** ${sampleRep.gateStatus} (RELEASE BLOCKED)

## Executive Summary
${sampleRep.summary}

### Gate Verification Status
- **Security Gate:** FAILED (Score: 45/80, 8 HIGH severity vulnerabilities)
- **AST Complexity:** FAILED (Score: 61/70, Average CCN: 18.3 > 15.0)
- **Test Coverage:** PASSED (Score: 72/70, 40 unit/integration tests)
- **Schema Validation:** PASSED (Score: 100/100, 0 violations)
- **Documentation:** PASSED (Score: 81/70)
- **Performance Budget:** PASSED (Score: 77/70, Sub-50ms P99)
- **Licensure & IP:** PASSED (Score: 100/100, Apache-2.0 / MIT compliant)

## Top Remediation Actions
1. **PCI-DSS Cleartext PAN Logging** in \`finledger/payment/card_tokenizer.py:74\` (CWE-312).
2. **SQL Injection in Reconciliation** in \`finledger/ledger/reconciliation_query.py:112\` (CWE-89).
3. **Refactor God Method** \`process_multi_currency_split_settlement\` (CCN: 34).
`;

      return {
        isError: false,
        content: [
          {
            type: "text",
            value: `Generated ${template} report for '${fix.project.name}'. Release Verdict: BLOCKED.`,
            metadata: { gateVerdict: "BLOCKED", reportId: sampleRep.id },
          },
          {
            type: "artifact",
            value: markdownContent,
            metadata: {
              artifactType: "markdown",
              title: sampleRep.title,
            },
          },
          {
            type: "citation",
            value: "cite:sha256:rep-fin-01-audit-token",
            metadata: {
              sha256: "rep00000000000000000000000000000000000000000000000000000000",
              label: "Audit Vault Release Token",
              source: "BrahmaReportCompiler",
            },
          },
        ],
      };
    }

    // Live mode: call PDF/Markdown generation Edge function or backend
    try {
      const { data, error } = await ctx.supabase.functions.invoke("website-export", {
        body: { project_id: projectId, template },
      });

      if (error) {
        return {
          isError: true,
          content: [{ type: "text", value: `Failed to compile live report: ${error.message}` }],
        };
      }

      return {
        isError: false,
        content: [
          { type: "text", value: "Live report compiled successfully." },
          {
            type: "artifact",
            value: typeof data === "string" ? data : JSON.stringify(data, null, 2),
            metadata: { artifactType: "markdown", title: "Project Report" },
          },
        ],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", value: `Report compiler error: ${msg}` }],
      };
    }
  },
};
