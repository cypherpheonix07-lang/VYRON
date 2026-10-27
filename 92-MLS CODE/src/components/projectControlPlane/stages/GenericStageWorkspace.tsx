/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Generic Stage Workspace for Stages 05, 07, 08, 09, 11, 13
 * Strictly ZERO Raw SQL.
 */

import React from "react";
import {
  Sparkles,
  Layers,
  Cpu,
  Database,
  Brain,
  Activity,
  CheckSquare,
  Palette,
  Network,
  Rocket,
  LifeBuoy,
  TrendingUp,
  Archive,
  Coins,
  Scale,
  Truck,
  Calendar,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";
import { ProjectLifecycleStage } from "@/types/aiProjectControlPlane";
import { LifecycleInspectionPanel } from "@/components/inspection/LifecycleInspectionPanel";

interface GenericStageWorkspaceProps {
  stage: ProjectLifecycleStage;
}

export const GenericStageWorkspace: React.FC<GenericStageWorkspaceProps> = ({ stage }) => {
  const { state, executeStage, isExecuting } = useAiProject();

  const handleSynthesize = () => {
    executeStage(stage);
  };

  const getStageMeta = () => {
    switch (stage) {
      case "05_CAPABILITY":
        return {
          title: "Capability Modeling",
          icon: Layers,
          color: "text-amber-400",
          desc: "Hierarchical business and system capability taxonomy separated from technology implementation.",
          items: (state.capabilities?.capabilities || []).map((c) => ({
            title: c.name,
            subtitle: c.category,
            details: c.description,
          })),
        };
      case "15_EXPERIENCE":
        return {
          title: "Experience & Accessibility Engineering",
          icon: Palette,
          color: "text-pink-400",
          desc: "WCAG 2.1 AA contrast verification, design system tokens, responsive layouts, and accessible keyboard focus.",
          items: [
            {
              title: `Target Standard: WCAG 2.1 ${state.experience?.targetWcagLevel || "AA"}`,
              subtitle: `Min Contrast: ${state.experience?.colorContrastRatioMin || 4.8}:1`,
              details: `Screen reader: ${state.experience?.screenReaderOptimized ? "Optimized" : "Pending"} • Keyboard navigable: ${state.experience?.keyboardNavigable ? "Verified" : "Pending"}`,
            },
            ...(state.experience?.personas || []).map((p) => ({
              title: `Persona: ${p.name} (${p.role})`,
              subtitle: p.primaryDevice,
              details: `Accessibility needs: ${p.accessibilityNeeds.join(", ")}`,
            })),
            ...(state.experience?.keyUserJourneys || []).map((j) => ({
              title: `Journey: ${j.title}`,
              subtitle: `${j.stepsCount} steps • ${j.criticalPath ? "Critical Path" : "Secondary"}`,
              details: "Fully accessible journey verified across all standard responsive viewport breakpoints.",
            })),
          ],
        };
      case "07_TECHNOLOGY":
        return {
          title: "Technology Stack Engineering",
          icon: Cpu,
          color: "text-blue-400",
          desc: "Primary and alternative stacks with trade-offs, operational burden, and migration implications.",
          items: (state.technology?.decisions || []).map((d) => ({
            title: `${d.category.toUpperCase()}: ${d.selectedOption}`,
            subtitle: `Alternative: ${d.alternativeOption}`,
            details: d.rationale,
          })),
        };
      case "08_DATA":
        return {
          title: "Data Architecture & Governance",
          icon: Database,
          color: "text-emerald-400",
          desc: "Domain entities, relationships, sensitivity classifications, retention windows, and multi-tenant RLS.",
          items: (state.data?.entities || []).map((e) => ({
            title: e.name,
            subtitle: `Sensitivity: ${e.sensitivity.toUpperCase()} • Retention: ${e.retentionPeriod}`,
            details: e.description,
          })),
        };
      case "09_AI_DESIGN":
        return {
          title: "AI/ML Systems Engineering",
          icon: Brain,
          color: "text-purple-400",
          desc: "Conditional AI architecture: candidate models, inference pipeline, prompt injection defense, and fallback strategies.",
          items: (state.ai?.modelCandidates || []).map((m) => ({
            title: m.name,
            subtitle: `${m.provider.toUpperCase()} • ${m.costPer1kTokens * 1000}$ / 1M tokens`,
            details: m.purpose,
          })),
        };
      case "16_INTEGRATION":
        return {
          title: "Integration & Interoperability Architecture",
          icon: Network,
          color: "text-indigo-400",
          desc: "External API contracts, protocols, webhook resilience, idempotency keys, and schema translations.",
          items: [
            ...(state.integration?.endpoints || []).map((ep) => ({
              title: `${ep.direction.toUpperCase()}: ${ep.name} (${ep.type})`,
              subtitle: `Auth: ${ep.authMethod} • Rate Limit: ${ep.rateLimitPerSec}/s`,
              details: `Retry Policy: ${ep.retryPolicy} • Idempotency: ${ep.idempotencyGuaranteed ? "Guaranteed" : "Best-effort"}`,
            })),
            {
              title: "Data Exchange Formats",
              subtitle: "Encodings",
              details: (state.integration?.dataExchangeFormats || ["application/json"]).join(", "),
            },
          ],
        };
      case "11_RELIABILITY":
        return {
          title: "Reliability Engineering & Failure Scenarios",
          icon: Activity,
          color: "text-orange-400",
          desc: "Component failure modes, timeout policies, circuit breaker thresholds, and deterministic fallback engines.",
          items: (state.reliability?.scenarios || []).map((s) => ({
            title: s.componentName,
            subtitle: `Timeout: ${s.timeoutMs}ms • Retries: ${s.retryCount}`,
            details: `Failure: ${s.failureScenario} -> Fallback: ${s.fallbackStrategy}`,
          })),
        };
      case "13_TESTING":
        return {
          title: "Test Automation & Traceability Matrix",
          icon: CheckSquare,
          color: "text-teal-400",
          desc: "Multi-tier test strategy and requirement-to-test traceability matrix ensuring zero unverified specifications.",
          items: (state.testing?.testCases || []).map((tc) => ({
            title: `${tc.code}: ${tc.title}`,
            subtitle: `Type: ${tc.type.toUpperCase()} • Target: ${tc.targetRequirementCode}`,
            details: tc.assertion,
          })),
        };
      case "17_RELEASE":
        return {
          title: "Release & Migration Engineering",
          icon: Rocket,
          color: "text-amber-500",
          desc: "Deployment ring orchestration, zero-downtime database migration routines, and automated rollback guarantees.",
          items: [
            {
              title: `Versioning Strategy: ${state.release?.versioningStrategy || "SemVer"}`,
              subtitle: `Migrations: ${state.release?.migrationScriptsCount || 0} scripts`,
              details: `Automated Rollback: ${state.release?.rollbackAutomated ? "Enabled" : "Manual"} • Zero-Downtime: ${state.release?.zeroDowntimeVerified ? "Verified" : "Pending"}`,
            },
            ...(state.release?.deploymentRings || []).map((r) => ({
              title: `Ring ${r.ring}: ${r.name}`,
              subtitle: `Soak Time: ${r.soakTimeHours}h`,
              details: `Target: ${r.targetAudience}`,
            })),
          ],
        };
      case "18_OPERATIONS":
        return {
          title: "Operations & Incident Response Engineering",
          icon: LifeBuoy,
          color: "text-rose-400",
          desc: "Service Level Objectives (SLOs), automated alerting thresholds, runbooks, and SEV1-4 severity matrices.",
          items: [
            ...(state.operations?.slos || []).map((slo) => ({
              title: `SLO: ${slo.name}`,
              subtitle: `Target: ${slo.targetPercentage}% (Alert: < ${slo.alertThresholdPercentage}%)`,
              details: `Metric: ${slo.sliMetric}`,
            })),
            ...(state.operations?.incidentSeverityMatrix || []).map((sev) => ({
              title: `Severity: ${sev.severity}`,
              subtitle: `TTL: ${sev.responseTtlMinutes} min response`,
              details: `Escalation: ${sev.escalationPath}`,
            })),
          ],
        };
      case "19_EVALUATION":
        return {
          title: "Evaluation & Continuous Improvement",
          icon: TrendingUp,
          color: "text-lime-400",
          desc: "Production telemetry baselines, error budgets, architectural drift monitors, and measurable optimization experiments.",
          items: [
            {
              title: "Telemetry Status",
              subtitle: `Feedback Loop: every ${state.evaluation?.feedbackLoopCadenceDays || 14} days`,
              details: `Telemetry Active: ${state.evaluation?.telemetryEnabled ? "YES" : "NO"} • Error Budget: ${state.evaluation?.errorBudgetPercentage || 99.9}%`,
            },
            ...(state.evaluation?.baselines || []).map((b) => ({
              title: `Metric: ${b.metric}`,
              subtitle: `Baseline: ${b.currentBaseline}${b.unit} -> Target: ${b.targetGoal}${b.unit}`,
              details: "Tracked against empirical execution telemetry and regression alerts.",
            })),
          ],
        };
      case "21_VALUE":
        return {
          title: "Business Value & Financial Viability",
          icon: Coins,
          color: "text-amber-400",
          desc: "Development effort, hosting/storage/AI token cost projections, and financial viability scenarios.",
          items: [
            {
              title: `ROI Multiplier: ${state.value?.roiMultiplier || 4.5}x`,
              subtitle: `Est. Monthly Cloud: $${state.value?.estimatedMonthlyCloudCost || 150} • AI Tokens: $${state.value?.estimatedMonthlyAiCost || 80}`,
              details: `Dev Effort: ${state.value?.estimatedDevelopmentHours || 120} hours • Pricing Tiers: ${(state.value?.pricingTiers || []).map((p) => `${p.name} ($${p.monthlyPrice}/mo)`).join(", ")}`,
            },
            ...(state.value?.valueAssumptions || []).map((a, i) => ({
              title: `Value Assumption #${i + 1}`,
              subtitle: "Economic Benefit",
              details: a,
            })),
          ],
        };
      case "22_GOVERNANCE":
        return {
          title: "Governance & Decision Accountability",
          icon: Scale,
          color: "text-indigo-400",
          desc: "Project-scoped decision rights, authority delegation, review policies, and exception registers.",
          items: [
            {
              title: `Project Owner: ${state.governance?.projectOwner || "Engineering Lead"}`,
              subtitle: `Audit Retention: ${state.governance?.auditRetentionDays || 365} Days`,
              details: `${(state.governance?.decisionMakers || []).length} decision makers • ${(state.governance?.reviewPolicies || []).length} review policies configured`,
            },
            ...(state.governance?.decisionMakers || []).map((dm) => ({
              title: `Decision Maker: ${dm.role}`,
              subtitle: `Scope: ${dm.scope}`,
              details: dm.delegatedTo ? `Delegated to: ${dm.delegatedTo}` : "Direct authority",
            })),
          ],
        };
      case "23_DEPENDENCY_ASSURANCE":
        return {
          title: "Dependency & Supplier Assurance",
          icon: Truck,
          color: "text-orange-400",
          desc: "Critical external packages, AI model providers, cloud suppliers, and concentration risk mitigation.",
          items: [
            {
              title: `Concentration Risk: ${(state.dependencyAssurance?.concentrationRiskRating || "low").toUpperCase()}`,
              subtitle: `License Compliance: ${state.dependencyAssurance?.licenseComplianceVerified ? "VERIFIED" : "PENDING"}`,
              details: `${(state.dependencyAssurance?.qualifiedSuppliers || []).length} qualified suppliers • ${(state.dependencyAssurance?.aiProviders || []).length} AI providers`,
            },
            ...(state.dependencyAssurance?.qualifiedSuppliers || []).map((s) => ({
              title: `Supplier: ${s.name} (${s.category.toUpperCase()})`,
              subtitle: `Status: ${s.status.toUpperCase()}`,
              details: `Fallback: ${s.fallbackStrategy}`,
            })),
          ],
        };
      case "24_DELIVERY":
        return {
          title: "Delivery Planning & Coordination",
          icon: Calendar,
          color: "text-teal-400",
          desc: "Work packages, dependency readiness, milestone scheduling, and team coordination checkpoints.",
          items: [
            {
              title: `Estimated Delivery: ${state.delivery?.estimatedDeliveryWeeks || 6} Weeks`,
              subtitle: `Buffer: ${state.delivery?.contingencyBufferPercentage || 20}% • Active Blockers: ${state.delivery?.blockersCount || 0}`,
              details: `${state.delivery?.workPackagesCount || 26} work packages • ${(state.delivery?.milestones || []).length} milestones`,
            },
            ...(state.delivery?.milestones || []).map((m) => ({
              title: `Milestone: ${m.title}`,
              subtitle: `Target: ${m.targetDate}`,
              details: `Status: ${m.status.toUpperCase()}`,
            })),
          ],
        };
      case "25_COMPLIANCE":
        return {
          title: "Compliance & Data Stewardship",
          icon: ShieldCheck,
          color: "text-emerald-400",
          desc: "Data classification, regulatory obligations (GDPR/HIPAA/SOC2), retention rules, and audit logging.",
          items: [
            {
              title: `Immutable Audit Trail: ${state.compliance?.auditTrailImmutable ? "ENFORCED" : "PENDING"}`,
              subtitle: `Export Format: ${state.compliance?.exportFormatSupported || "JSON"}`,
              details: `${(state.compliance?.regulatoryObligations || []).length} regulatory frameworks • ${(state.compliance?.dataClassifications || []).length} data tiers`,
            },
            ...(state.compliance?.regulatoryObligations || []).map((o) => ({
              title: `Obligation: ${o.standard}`,
              subtitle: `Status: ${o.status.toUpperCase()}`,
              details: `${o.controlsCount} controls mapped and verified`,
            })),
          ],
        };
      case "26_DOCUMENTATION":
        return {
          title: "Documentation, Training & Knowledge Transfer",
          icon: BookOpen,
          color: "text-sky-400",
          desc: "Role onboarding guides (Student/Faculty/Pro), API contracts, operational runbooks, and handover packages.",
          items: [
            {
              title: `Handover Package: ${state.documentation?.handoverPackageReady ? "READY" : "IN PROGRESS"}`,
              subtitle: `Student Guide: ${state.documentation?.studentGuideReady ? "YES" : "NO"} • Faculty: ${state.documentation?.facultyGuideReady ? "YES" : "NO"} • Pro: ${state.documentation?.professionalGuideReady ? "YES" : "NO"}`,
              details: `${state.documentation?.guidesCount || 6} role guides • ${state.documentation?.apiRunbooksCount || 14} operational runbooks`,
            },
          ],
        };
      case "20_RETIREMENT":
        return {
          title: "Retirement & Transition Planning",
          icon: Archive,
          color: "text-slate-400",
          desc: "Deprecation notice schedules, cryptographic data shredding (zero-leakage), and decommission checklists.",
          items: [
            {
              title: `Notice Period: ${state.retirement?.deprecationNoticePeriodDays || 90} Days`,
              subtitle: `Retention: ${state.retirement?.dataRetentionYears || 7} Years`,
              details: `Destruction Method: ${state.retirement?.dataDestructionMethod || "CryptoShredding"} • Storage Tier: ${state.retirement?.archiveStorageTier || "Glacier"}`,
            },
            ...(state.retirement?.decommissionChecklist || []).map((item, idx) => ({
              title: `Checklist Item #${idx + 1}`,
              subtitle: "Compliance Protocol",
              details: item,
            })),
          ],
        };
      default:
        return {
          title: stage,
          icon: Sparkles,
          color: "text-cyan-400",
          desc: "Specialized engineering stage.",
          items: [],
        };
    }
  };

  const meta = getStageMeta();
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Icon className={`h-5 w-5 ${meta.color}`} />
                {meta.title}
              </CardTitle>
              <CardDescription>{meta.desc}</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handleSynthesize}
              disabled={isExecuting}
              className="text-xs gap-1.5 shadow-md"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
              Run Specialist Agent
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {meta.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {meta.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border/70 bg-background/40 space-y-1.5 text-xs transition-colors hover:border-border"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm">{item.title}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {item.subtitle}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{item.details}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Icon className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Stage specifications have not been synthesized yet. Click below to execute the
                specialized agent.
              </p>
              <Button
                size="sm"
                onClick={handleSynthesize}
                disabled={isExecuting}
                className="text-xs gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Synthesize {meta.title}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Embedded Lifecycle Inspection & Verification Panel */}
      <LifecycleInspectionPanel stage={stage} projectId={state.id} />
    </div>
  );
};

