import React from "react";
import type { ReportDocument } from "@/types/report";
import { MetricStatusTable } from "./MetricStatusTable";
import { MetricSourceTooltip } from "./MetricSourceTooltip";
import { ReportTOC } from "./ReportTOC";
import { Sparkles } from "lucide-react";

interface ReportSectionRendererProps {
  doc: ReportDocument;
  onOpenAIDraft?: (section: "S2" | "S14") => void;
}

const TOTAL_PAGES = 12;

function PageWrapper({ pageNumber, children }: { pageNumber: number; children: React.ReactNode }) {
  return (
    <div className="report-paper-page">
      <div className="space-y-4 font-sans text-xs text-slate-800 leading-relaxed">{children}</div>
      <div className="border-t border-slate-200 pt-2 mt-auto flex justify-between items-center text-[10px] font-mono text-slate-400">
        <span>PROJECT BRAHMA — Executive Summary Report 2026–2027</span>
        <span>
          Page {pageNumber} of {TOTAL_PAGES}
        </span>
      </div>
    </div>
  );
}

export const ReportSectionRenderer: React.FC<ReportSectionRendererProps> = ({
  doc,
  onOpenAIDraft,
}) => {
  return (
    <div className="space-y-6">
      {/* PAGE 2: Table of Contents & Executive Summary & S3 Dashboard */}
      <PageWrapper pageNumber={2}>
        <ReportTOC />

        <div id="sec-s2" className="pt-2">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1 mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              S2. Executive Summary
            </h2>
            {onOpenAIDraft && (
              <button
                onClick={() => onOpenAIDraft("S2")}
                className="no-print text-[11px] text-cyan-700 hover:text-cyan-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="size-3" /> AI Draft Assist
              </button>
            )}
          </div>
          <p className="text-justify text-slate-700 leading-relaxed font-serif text-[12px]">
            {doc.executiveSummary}
          </p>
        </div>

        <div id="sec-s3" className="pt-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S3. Key Performance Dashboard
          </h2>

          <div className="grid grid-cols-3 gap-2 my-2 font-mono text-center">
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Projects Evaluated</span>
              <span className="text-base font-bold text-slate-900">
                <MetricSourceTooltip
                  value={doc.kpis.projectsAnalyzed}
                  source="Live aggregation of all project records in Brahma database"
                />
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">
                Blueprints Generated
              </span>
              <span className="text-base font-bold text-slate-900">
                <MetricSourceTooltip
                  value={doc.kpis.blueprintsGenerated}
                  source="M2 Architecture Generator successfully synthesized DAGs"
                />
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Avg Health Score</span>
              <span className="text-base font-bold text-emerald-700">
                <MetricSourceTooltip
                  value={`${doc.kpis.avgHealthScore}/100`}
                  source="Derived formula: 100 - (0.35*v(G) + 0.40*(100-Cov) + 0.25*DebtRatio)"
                />
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Findings Flagged</span>
              <span className="text-base font-bold text-rose-700">
                <MetricSourceTooltip
                  value={doc.kpis.findingsFlagged}
                  source="Aggregated Semgrep SAST CWEs, missing foreign keys, and orphan nodes"
                />
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Publish-Block Rate</span>
              <span className="text-base font-bold text-amber-700">
                <MetricSourceTooltip
                  value={doc.kpis.publishBlockRate}
                  source="Enforced 7-check Release Gate rejection percentage on critical seeds"
                />
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Telemetry Capture</span>
              <span className="text-base font-bold text-slate-900">
                <MetricSourceTooltip
                  value={doc.kpis.signInCaptureRate}
                  source="Percentage of auth attempts logged with IP, browser, and device"
                />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="font-semibold text-[10px] uppercase text-slate-600 block mb-1">
                Figure 1: Weekly Project Throughput (N=312)
              </span>
              <div className="flex items-end gap-2 h-16 pt-2 px-2 border-b border-slate-200">
                {doc.charts.weeklyAnalyses.map((w, idx) => (
                  <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      style={{ height: `${(w.count / 100) * 100}%` }}
                      className="w-full bg-cyan-700 rounded-t"
                    />
                    <span className="text-[9px] text-slate-500 font-mono">W{idx + 1}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 mt-1 italic">
                Caption: Ingestion volume across 5-week CSBS evaluation cohorts.
              </p>
            </div>

            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="font-semibold text-[10px] uppercase text-slate-600 block mb-1">
                Figure 2: Risk Profile Distribution
              </span>
              <div className="space-y-1.5 pt-1">
                {doc.charts.riskDistribution.map((r) => (
                  <div key={r.category}>
                    <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-0.5">
                      <span>{r.category}</span>
                      <span>
                        {r.percentage}% ({r.count})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${r.percentage}%` }}
                        className={`h-full ${
                          r.percentage > 50
                            ? "bg-emerald-600"
                            : r.percentage > 25
                              ? "bg-amber-600"
                              : "bg-rose-600"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 mt-2 italic">
                Caption: Categorization of analyzed repositories by M7 Risk Predictor.
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 3: S4 Problem Statement & S5 System Architecture */}
      <PageWrapper pageNumber={3}>
        <div id="sec-s4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S4. Problem Statement & Tooling Gap
          </h2>
          <p className="text-justify leading-relaxed text-slate-700 font-serif text-[12px]">
            {doc.problemStatement}
          </p>
        </div>

        <div id="sec-s5" className="pt-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S5. System Architecture & Module Pipeline
          </h2>
          <p className="text-slate-600 mb-2">
            PROJECT BRAHMA organizes automated engineering intelligence across eight sequential
            modules (M1–M8) operating under strict state contracts:
          </p>

          <table className="report-table">
            <thead>
              <tr>
                <th className="w-12">Phase</th>
                <th>Module Name</th>
                <th>Primary Analysis Engine</th>
                <th>Standard Output Artifact</th>
              </tr>
            </thead>
            <tbody>
              {doc.systemArchitecture.map((m) => (
                <tr key={m.phase}>
                  <td className="font-mono font-bold text-slate-800">{m.phase}</td>
                  <td className="font-semibold text-slate-900">{m.moduleName}</td>
                  <td className="text-slate-600 font-mono text-[10px]">{m.primaryEngine}</td>
                  <td className="text-slate-700 font-mono text-[10px]">{m.outputArtifact}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded mt-2">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
              End-to-End Execution Data Flow:
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
              Inbound Webhook / Spec &rarr; M1 Entity Parsing &rarr; M2 React Flow Graph & Schema
              &rarr; M3 KPI Matrix &rarr; M4 Tree-sitter Complexity &rarr; M5 Semgrep SAST CWE
              &rarr; M6 Symbolic Test Suite &rarr; M7 Risk Score &rarr; M8 Deterministic 7-Check
              Release Gate &rarr; SHA-256 Signed Attestation.
            </p>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 4: S6 Core Innovations & Explainability */}
      <PageWrapper pageNumber={4}>
        <div id="sec-s6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S6. Core Technical Innovations
          </h2>

          <div className="space-y-3">
            {doc.coreInnovations.map((c) => (
              <div key={c.title} className="bg-slate-50 border border-slate-200 p-3 rounded">
                <h3 className="font-bold text-xs text-slate-900 mb-1">{c.title}</h3>
                <div className="grid grid-cols-1 gap-1 text-[11px]">
                  <p>
                    <span className="font-semibold text-slate-700">What:</span> {c.what}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Why:</span> {c.why}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">How:</span> {c.how}
                  </p>
                  <p className="text-slate-500 font-mono text-[10px] pt-0.5">
                    <span className="font-semibold text-slate-700">Evidence:</span> {c.evidence}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-slate-100 p-3 rounded mt-3 font-mono text-[11px]">
            <span className="text-cyan-400 font-bold uppercase block mb-1">
              Deterministic Mathematical Scoring Formulas:
            </span>
            <p className="text-slate-300">
              Health = 100 - [ 0.35 &times; v(G) + 0.40 &times; (100 - TestCoverage) + 0.25 &times;
              TechDebtRatio ]
            </p>
            <p className="text-slate-300 pt-1">
              Security = 100 - &sum; [ SeverityWeight(CWE_i) &times; ExploitabilityIndex(CWE_i) ]
            </p>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 5: S7 Technology Stack */}
      <PageWrapper pageNumber={5}>
        <div id="sec-s7">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S7. Technology Stack & Architectural Decision Register
          </h2>
          <p className="text-slate-600 mb-2">
            The platform architecture rejects monolithic, opaque runtimes in favor of verifiable
            cloud-native primitives:
          </p>

          <table className="report-table">
            <thead>
              <tr>
                <th>Architectural Layer</th>
                <th>Selected Technology</th>
                <th>Rejected Alternatives</th>
                <th>Technical Justification</th>
              </tr>
            </thead>
            <tbody>
              {doc.techStack.map((t) => (
                <tr key={t.layer}>
                  <td className="font-bold text-slate-900">{t.layer}</td>
                  <td className="font-mono text-emerald-800 font-semibold">{t.chosenTech}</td>
                  <td className="font-mono text-slate-500 text-[10px]">{t.rejectedTech}</td>
                  <td className="text-slate-700 leading-snug">{t.justification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageWrapper>

      {/* PAGE 6: S8 Performance Metrics (Target vs Achieved) */}
      <PageWrapper pageNumber={6}>
        <div id="sec-s8">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1 mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              S8. Systematic Performance Metrics (Target vs. Achieved)
            </h2>
            <span className="text-[10px] font-mono text-slate-500">
              Integrity Rule: Unmeasured values marked PENDING in App. D
            </span>
          </div>

          <MetricStatusTable metrics={doc.metricsRegister} />

          <p className="text-[10px] text-slate-500 italic mt-2">
            Note: Hovering over any achieved metric in the web viewer exposes its exact mathematical
            selector and benchmark dataset.
          </p>
        </div>
      </PageWrapper>

      {/* PAGE 7: S9 Comparative Analysis */}
      <PageWrapper pageNumber={7}>
        <div id="sec-s9">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S9. Comparative Analysis
          </h2>

          <h3 className="font-bold text-xs text-slate-900 mt-2 mb-1">
            Table A: Capability vs. Cohort-Typical Student Capstones
          </h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Evaluation Dimension</th>
                <th>Standard Cohort Capstone</th>
                <th>PROJECT BRAHMA</th>
              </tr>
            </thead>
            <tbody>
              {doc.comparativeAnalysis.cohortMatrix.map((r) => (
                <tr key={r.dimension}>
                  <td className="font-bold text-slate-900">{r.dimension}</td>
                  <td className="text-slate-600">{r.cohortTypical}</td>
                  <td className="font-semibold text-cyan-900">{r.brahmaPlatform}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="font-bold text-xs text-slate-900 mt-4 mb-1">
            Table B: Comparison vs. Commercial AI Code Platforms
          </h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Feature Dimension</th>
                <th>AI Builders (Lovable, Bolt.new, v0)</th>
                <th>In-Editor (Cursor, Copilot)</th>
                <th>PROJECT BRAHMA</th>
              </tr>
            </thead>
            <tbody>
              {doc.comparativeAnalysis.industryMatrix.map((r) => (
                <tr key={r.dimension}>
                  <td className="font-bold text-slate-900">{r.dimension}</td>
                  <td className="text-slate-600">{r.aiBuilders}</td>
                  <td className="text-slate-600">{r.inEditorAssistants}</td>
                  <td className="font-semibold text-cyan-900">{r.brahmaPlatform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageWrapper>

      {/* PAGE 8: S10 Security Posture & Compliance */}
      <PageWrapper pageNumber={8}>
        <div id="sec-s10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S10. Security Posture, Row-Level Security & Compliance
          </h2>

          <div className="space-y-2.5">
            {doc.securityCompliance.map((s) => (
              <div key={s.layer} className="bg-slate-50 border border-slate-200 p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 text-xs">{s.layer}</span>
                  <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-semibold">
                    {s.mechanism}
                  </span>
                </div>
                <p className="text-[11px] text-slate-700">{s.implementationDetail}</p>
                <p className="text-[10px] text-emerald-700 font-mono mt-1">
                  &bull; Verification: {s.verificationEvidence}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 9: S11 Empirical Evaluation & Evidence */}
      <PageWrapper pageNumber={9}>
        <div id="sec-s11">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S11. Empirical Evaluation, Study Design & Evidence
          </h2>
          <div className="space-y-3 text-[11px] text-slate-700 leading-relaxed font-serif">
            <p>
              <span className="font-bold font-sans text-slate-900">Benchmark Datasets:</span>{" "}
              {doc.evaluationEvidence.datasets}
            </p>
            <p>
              <span className="font-bold font-sans text-slate-900">Evaluation Methodology:</span>{" "}
              {doc.evaluationEvidence.methodology}
            </p>
            <p>
              <span className="font-bold font-sans text-slate-900">Baseline Comparison:</span>{" "}
              {doc.evaluationEvidence.baselineComparison}
            </p>
            <p>
              <span className="font-bold font-sans text-slate-900">Threats to Validity:</span>{" "}
              {doc.evaluationEvidence.threatsToValidity}
            </p>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 10: S12 Academic Publication & Role Fit */}
      <PageWrapper pageNumber={10}>
        <div id="sec-s12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S12. Academic Publication & Competency Placement Strategy
          </h2>

          <h3 className="font-bold text-xs text-slate-900 mt-2 mb-1">
            Target Academic Conference Venues
          </h3>
          <div className="space-y-2">
            {doc.publicationPlacement.paperAngles.map((p) => (
              <div key={p.title} className="bg-slate-50 border border-slate-200 p-2.5 rounded">
                <span className="font-bold text-slate-900 text-xs block">{p.title}</span>
                <span className="text-[10px] text-cyan-800 font-mono font-semibold block">
                  Target Venue: {p.targetVenue}
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Core Focus: {p.coreFocus}
                </span>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-xs text-slate-900 mt-4 mb-1">
            Industry Competency & Engineering Placement Matrix
          </h3>
          <div className="space-y-2">
            {doc.publicationPlacement.roleFits.map((r) => (
              <div key={r.member} className="bg-slate-50 border border-slate-200 p-2.5 rounded">
                <span className="font-bold text-slate-900 text-xs block">{r.member}</span>
                <span className="text-[10px] text-emerald-800 font-mono font-semibold block">
                  Target Role: {r.targetRole}
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Demonstrated Competencies: {r.competencies}
                </span>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 11: S13 Future Scope & S14 Conclusion */}
      <PageWrapper pageNumber={11}>
        <div id="sec-s13">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            S13. Future Research Scope & Roadmap (FS-1 to FS-6)
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {doc.futureScope.map((f) => (
              <div key={f.id} className="bg-slate-50 border border-slate-200 p-2 rounded">
                <span className="font-bold text-slate-900 text-xs block">
                  {f.id}: {f.title}
                </span>
                <span className="text-[10px] text-slate-600 block my-0.5">{f.description}</span>
                <span className="text-[9px] font-mono text-cyan-800 block">
                  Milestone: {f.technicalMilestone}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div id="sec-s14" className="pt-3">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1 mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              S14. Conclusion & Key Achievements
            </h2>
            {onOpenAIDraft && (
              <button
                onClick={() => onOpenAIDraft("S14")}
                className="no-print text-[11px] text-cyan-700 hover:text-cyan-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="size-3" /> AI Draft Assist
              </button>
            )}
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 font-serif">
            {doc.conclusionBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <p className="text-justify leading-relaxed text-slate-800 font-serif text-[12px] pt-2 italic font-semibold">
            “{doc.closingRemarks}”
          </p>
        </div>
      </PageWrapper>

      {/* PAGE 12: Appendices A-E */}
      <PageWrapper pageNumber={12}>
        <div id="sec-appendices">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Appendices & Evidence Register
          </h2>

          <div className="space-y-2 text-[10px]">
            <div>
              <h4 className="font-bold text-slate-900 uppercase">Appendix A: Platform Route Map</h4>
              <p className="text-slate-600 font-mono">{doc.appendices.aRouteMap.join(" | ")}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase">
                Appendix B: Component Inventory
              </h4>
              <p className="text-slate-600 font-mono">
                {doc.appendices.bComponentInventory.join(" | ")}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase">
                Appendix C: Database Schema & RLS Summary
              </h4>
              <p className="text-slate-600 font-mono">{doc.appendices.cSqlSchemaSummary}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase">
                Appendix D: Evidence Gaps & Measurement Plans
              </h4>
              <div className="space-y-1 mt-1">
                {doc.appendices.dEvidenceGaps.map((g) => (
                  <div
                    key={g.metricName}
                    className="bg-slate-50 p-1.5 rounded border border-slate-200 font-mono"
                  >
                    <span className="font-bold text-slate-800">{g.metricName}</span>
                    <p className="text-slate-600">{g.plan}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase">
                Appendix E: Academic References (IEEE Format)
              </h4>
              <p className="text-slate-600 font-mono leading-tight">
                [1] E. Gamma et al., Design Patterns, Addison-Wesley, 1994. [2] M. Fowler,
                Refactoring, Addison-Wesley, 2018. [3] T. J. McCabe, "A Complexity Measure," IEEE
                TSE, 1976. [4] J. Brooke, "SUS: A Quick and Dirty Usability Scale," 1996. [5] OWASP
                Foundation, "OWASP Top Ten Web Application Security Risks," 2021.
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};
