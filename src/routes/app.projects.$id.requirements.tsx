import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Shield,
  FileCheck2,
  ArrowRight,
  Plus,
  RefreshCw,
  Edit3,
  Bot,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { copilotStore } from "@/state/copilot/copilotStore";

export const Route = createFileRoute("/app/projects/$id/requirements")({
  head: () => ({
    meta: [
      { title: "Atomic Requirements Engineering — VYRON" },
      {
        name: "description",
        content:
          "Normalized, testable atomic requirements with Gherkin acceptance criteria, automated ambiguity detection, and architecture traceability.",
      },
    ],
  }),
  component: RequirementsWorkspacePage,
});

export type ReqCategory = "FUNCTIONAL" | "NON_FUNCTIONAL" | "SECURITY" | "COMPLIANCE";
export type ReqPriority = "MUST" | "SHOULD" | "COULD" | "WONT";
export type ReqStatus = "APPROVED" | "IN_REVIEW" | "DRAFT" | "REJECTED";

export interface AcceptanceCriterion {
  id: string;
  given: string;
  when: string;
  then: string;
  verified: boolean;
}

export interface AtomicRequirement {
  id: string;
  title: string;
  description: string;
  category: ReqCategory;
  priority: ReqPriority;
  status: ReqStatus;
  source: string;
  revision: string;
  owner: string;
  acceptanceCriteria: AcceptanceCriterion[];
  traceability: {
    components: string[];
    tests: string[];
    gates: string[];
  };
  quality: {
    atomicity: number; // 0-100%
    testability: number; // 0-100%
    completeness: number; // 0-100%
    isAmbiguous?: boolean;
    ambiguityNotes?: string;
    isDuplicate?: boolean;
    duplicateOf?: string;
  };
}

const INITIAL_REQUIREMENTS: AtomicRequirement[] = [
  {
    id: "REQ-001",
    title: "Idempotent Payment Settlement Webhook Ingestion",
    description:
      "The webhook ingestion gateway must deduplicate payment events by idempotent idempotency_key with exactly-once processing guarantees within a 24-hour replay window.",
    category: "FUNCTIONAL",
    priority: "MUST",
    status: "APPROVED",
    source: "Core Financial Architecture §4.1",
    revision: "rev-2.1",
    owner: "Settlement Platform Lead",
    acceptanceCriteria: [
      {
        id: "AC-001-1",
        given: "A webhook request with previously ingested transaction_uuid 4f1a..8b",
        when: "The ingress gateway receives the duplicated payload within 86400 seconds",
        then: "The service returns HTTP 200 with cached signature without executing secondary bank transfers",
        verified: true,
      },
      {
        id: "AC-001-2",
        given: "A webhook request with missing idempotency key header",
        when: "Payload validation is executed",
        then: "Request is rejected with HTTP 400 Bad Request and error code ERR_MISSING_IDEMPOTENCY_TOKEN",
        verified: true,
      },
    ],
    traceability: {
      components: ["srv-settlement", "gw-ingress", "db-ledger"],
      tests: ["TEST-IDEM-01", "TEST-SETTLE-04"],
      gates: ["GATE-SCOPE-01", "GATE-ARCH-01"],
    },
    quality: {
      atomicity: 98,
      testability: 96,
      completeness: 94,
    },
  },
  {
    id: "REQ-002",
    title: "Sub-150ms P99 Latency for Realtime Balance Resolution",
    description:
      "Global balance queries executed through the read-model caching layer must respond under 150 milliseconds at the 99th percentile across 10,000 sustained queries per second.",
    category: "NON_FUNCTIONAL",
    priority: "MUST",
    status: "APPROVED",
    source: "Performance SLA Contract §2.4",
    revision: "rev-1.8",
    owner: "Distributed SRE Team",
    acceptanceCriteria: [
      {
        id: "AC-002-1",
        given: "10,000 concurrent tenant balance query requests per second across 3 zones",
        when: "Measured over a continuous 15-minute load testing window",
        then: "99% of requests return HTTP 200 within 150ms wall-clock duration",
        verified: true,
      },
      {
        id: "AC-002-2",
        given: "Primary redis cluster failover event",
        when: "Fallback read replica is engaged",
        then: "P99 latency does not degrade beyond 250ms during the 3-second election window",
        verified: false,
      },
    ],
    traceability: {
      components: ["cache-redis-tier", "srv-balance-read"],
      tests: ["PERF-BENCH-02"],
      gates: ["GATE-RUNTIME-01"],
    },
    quality: {
      atomicity: 92,
      testability: 95,
      completeness: 90,
    },
  },
  {
    id: "REQ-003",
    title: "Multi-Tenant Row Level Security (RLS) Isolation",
    description:
      "All PostgreSQL tables containing tenant-scoped transactions must enforce parameterized auth.uid() and tenant_id RLS filters preventing cross-tenant leakage.",
    category: "SECURITY",
    priority: "MUST",
    status: "APPROVED",
    source: "Zero-Trust Security Baseline §1.2",
    revision: "rev-3.0",
    owner: "Security Architecture Lead",
    acceptanceCriteria: [
      {
        id: "AC-003-1",
        given: "An authenticated JWT belonging to tenant alpha-corp",
        when: "A query requests records where tenant_id is beta-corp",
        then: "Postgres returns an empty result set (0 rows) and logs an audit boundary event",
        verified: true,
      },
      {
        id: "AC-003-2",
        given: "An unauthenticated public query probe",
        when: "Accessing public.ledger_entries directly",
        then: "Postgres yields permission denied with zero exposed rows",
        verified: true,
      },
    ],
    traceability: {
      components: ["db-postgres", "policy-rls-mesh"],
      tests: ["TEST-RLS-MULTI-TENANT-01", "TEST-AUTH-ISOLATION"],
      gates: ["GATE-SEC-01"],
    },
    quality: {
      atomicity: 100,
      testability: 100,
      completeness: 98,
    },
  },
  {
    id: "REQ-004",
    title: "Cryptographic SHA-256 Ledger Audit Trail Retention",
    description:
      "Every financial ledger state transition must produce an immutable cryptographic digest linking the previous block hash and payload for regulatory audit custody.",
    category: "COMPLIANCE",
    priority: "SHOULD",
    status: "IN_REVIEW",
    source: "SOC2 Type II & PCI-DSS Invariants",
    revision: "rev-1.0",
    owner: "Compliance Officer",
    acceptanceCriteria: [
      {
        id: "AC-004-1",
        given: "A committed balance adjustment transaction",
        when: "The ledger block is sealed",
        then: "A SHA-256 fingerprint matching sha256(prev_hash + block_payload) is recorded in immutable storage",
        verified: false,
      },
    ],
    traceability: {
      components: ["srv-audit-custody", "storage-immutable-s3"],
      tests: ["TEST-AUDIT-CUSTODY-01"],
      gates: ["GATE-COMPLIANCE-01"],
    },
    quality: {
      atomicity: 90,
      testability: 92,
      completeness: 88,
    },
  },
  {
    id: "REQ-005",
    title: "Fast Scalable User Profile Updating Workflow",
    description:
      "User settings and profile modifications should be very fast, seamless, and scalable across all regions.",
    category: "FUNCTIONAL",
    priority: "COULD",
    status: "DRAFT",
    source: "Unreviewed UX Note",
    revision: "rev-0.1",
    owner: "Frontend Contractor",
    acceptanceCriteria: [],
    traceability: {
      components: ["ui-settings"],
      tests: [],
      gates: [],
    },
    quality: {
      atomicity: 40,
      testability: 35,
      completeness: 45,
      isAmbiguous: true,
      ambiguityNotes:
        "Contains unquantified subjective descriptors ('very fast', 'seamless', 'scalable') without latency bounds, SLA, or acceptance criteria.",
    },
  },
];

export function RequirementsWorkspacePage() {
  const { id } = Route.useParams();
  const [requirements, setRequirements] = useState<AtomicRequirement[]>(() => {
    try {
      const stored = localStorage.getItem(`vyron_requirements_${id}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_REQUIREMENTS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [expandedReqs, setExpandedReqs] = useState<Record<string, boolean>>({ "REQ-001": true });

  // Normalizer State
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [normalizationModalOpen, setNormalizationModalOpen] = useState(false);
  const [proposedNormalization, setProposedNormalization] = useState<{
    original: AtomicRequirement;
    normalized: AtomicRequirement;
    detectedIssues: string[];
  } | null>(null);

  // New Requirement Dialog
  const [newReqOpen, setNewReqOpen] = useState(false);
  const [newReqTitle, setNewReqTitle] = useState("");
  const [newReqDesc, setNewReqDesc] = useState("");
  const [newReqCat, setNewReqCat] = useState<ReqCategory>("FUNCTIONAL");
  const [newReqPriority, setNewReqPriority] = useState<ReqPriority>("MUST");

  const saveRequirements = (updated: AtomicRequirement[]) => {
    setRequirements(updated);
    try {
      localStorage.setItem(`vyron_requirements_${id}`, JSON.stringify(updated));
    } catch {
      // quota or local storage restriction
    }
  };

  const toggleExpand = (reqId: string) => {
    setExpandedReqs((prev) => ({ ...prev, [reqId]: !prev[reqId] }));
  };

  const toggleCriterionVerified = (reqId: string, critId: string) => {
    const updated = requirements.map((r) => {
      if (r.id !== reqId) return r;
      const ac = r.acceptanceCriteria.map((c) =>
        c.id === critId ? { ...c, verified: !c.verified } : c,
      );
      return { ...r, acceptanceCriteria: ac };
    });
    saveRequirements(updated);
    toast.success("Acceptance criterion verification toggled.");
  };

  const handleRunNormalizer = () => {
    setIsNormalizing(true);
    toast.loading("Analyzing requirement atomicity, ambiguity, and testability...", {
      id: "norm-run",
    });

    setTimeout(() => {
      setIsNormalizing(false);
      toast.dismiss("norm-run");

      // Find an ambiguous or under-specified requirement to propose normalization
      const candidate =
        requirements.find((r) => r.quality.isAmbiguous || r.quality.atomicity < 70) ||
        requirements[requirements.length - 1];

      if (!candidate) {
        toast.info("All requirements are already highly atomic and verified.");
        return;
      }

      const issues: string[] = [];
      if (candidate.description.includes("fast"))
        issues.push("Subjective term 'fast' lacks SLA latency threshold (e.g., P95 < 200ms).");
      if (candidate.description.includes("seamless"))
        issues.push("Vague descriptor 'seamless' lacks observable verification criteria.");
      if (candidate.description.includes("scalable"))
        issues.push("Unquantified capacity target 'scalable' needs target RPS (e.g., 5,000 RPS).");
      if (candidate.acceptanceCriteria.length === 0)
        issues.push("Missing Gherkin acceptance criteria (Given/When/Then).");

      const normalized: AtomicRequirement = {
        ...candidate,
        title: "Sub-200ms User Profile Attribute Mutation Gateway",
        description:
          "The user profile service must update tenant account attributes within 200ms (P95) and replicate modifications across multi-region caches within 500ms under 2,000 RPS sustained load.",
        revision: `${candidate.revision}.1-normalized`,
        status: "IN_REVIEW",
        acceptanceCriteria: [
          {
            id: `AC-${candidate.id}-1`,
            given: "An authorized user session with valid tenant token",
            when: "Submitting a valid JSON profile patch payload",
            then: "Database persists mutation and returns HTTP 200 within 200ms",
            verified: false,
          },
          {
            id: `AC-${candidate.id}-2`,
            given: "Profile mutation exceeds max attribute schema size (64KB)",
            when: "Validation middleware processes payload",
            then: "Rejects with HTTP 422 Unprocessable Entity and logs validation error",
            verified: false,
          },
        ],
        quality: {
          atomicity: 95,
          testability: 94,
          completeness: 92,
          isAmbiguous: false,
        },
      };

      setProposedNormalization({
        original: candidate,
        normalized,
        detectedIssues: issues.length > 0 ? issues : ["Decomposed into measurable constraints."],
      });
      setNormalizationModalOpen(true);
    }, 600);
  };

  const handleApplyNormalization = () => {
    if (!proposedNormalization) return;
    const updated = requirements.map((r) =>
      r.id === proposedNormalization.original.id ? proposedNormalization.normalized : r,
    );
    saveRequirements(updated);
    setNormalizationModalOpen(false);
    toast.success(
      `Normalized ${proposedNormalization.original.id} to revision ${proposedNormalization.normalized.revision}`,
    );
  };

  const handleCreateRequirement = () => {
    if (!newReqTitle.trim() || !newReqDesc.trim()) {
      toast.error("Please enter a requirement title and description.");
      return;
    }

    const nextId = `REQ-00${requirements.length + 1}`;
    const newReq: AtomicRequirement = {
      id: nextId,
      title: newReqTitle.trim(),
      description: newReqDesc.trim(),
      category: newReqCat,
      priority: newReqPriority,
      status: "DRAFT",
      source: "Manual Operator Specification",
      revision: "rev-1.0",
      owner: "System Architect",
      acceptanceCriteria: [
        {
          id: `AC-${nextId}-1`,
          given: "Valid execution inputs within bounded parameters",
          when: "Operation is dispatched",
          then: "Expected state transition executes with verified audit receipt",
          verified: false,
        },
      ],
      traceability: {
        components: ["srv-core"],
        tests: [`TEST-${nextId}-01`],
        gates: ["GATE-SCOPE-01"],
      },
      quality: {
        atomicity: 85,
        testability: 88,
        completeness: 80,
      },
    };

    saveRequirements([newReq, ...requirements]);
    setNewReqOpen(false);
    setNewReqTitle("");
    setNewReqDesc("");
    toast.success(`Requirement ${nextId} created successfully.`);
  };

  const handleAskAther = (req: AtomicRequirement) => {
    copilotStore.openDrawer();
    copilotStore.sendMessage(
      "CHAT",
      `Analyze requirement ${req.id} ("${req.title}"): evaluate edge cases, acceptance criteria completeness, and provide recommended testing scenarios.`,
    );
  };

  // Filtered requirements
  const filteredRequirements = useMemo(() => {
    return requirements.filter((r) => {
      const matchSearch =
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "ALL" || r.category === selectedCategory;
      const matchPri = selectedPriority === "ALL" || r.priority === selectedPriority;
      const matchStat = selectedStatus === "ALL" || r.status === selectedStatus;
      return matchSearch && matchCat && matchPri && matchStat;
    });
  }, [requirements, searchQuery, selectedCategory, selectedPriority, selectedStatus]);

  // Derived Metrics
  const totalCount = requirements.length;
  const verifiedCriteriaCount = requirements.reduce(
    (acc, r) => acc + r.acceptanceCriteria.filter((c) => c.verified).length,
    0,
  );
  const totalCriteriaCount = requirements.reduce(
    (acc, r) => acc + r.acceptanceCriteria.length,
    0,
  );
  const criteriaRatio =
    totalCriteriaCount > 0 ? Math.round((verifiedCriteriaCount / totalCriteriaCount) * 100) : 0;
  const avgAtomicity = Math.round(
    requirements.reduce((acc, r) => acc + r.quality.atomicity, 0) / (totalCount || 1),
  );
  const ambiguousCount = requirements.filter((r) => r.quality.isAmbiguous).length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-card via-[#0c1427] to-card shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Engineering Lifecycle
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Project ID: {id}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <FileCheck2 className="size-6 text-cyan-400" />
              Atomic Requirements Engineering
            </h1>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Traceable, testable, and normalized requirements connected directly to system architecture components, automated test suites, and 21 predicate release gates.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={handleRunNormalizer}
              disabled={isNormalizing}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs px-4 py-2 gap-2 rounded-xl shadow-lg shadow-cyan-900/30 active:scale-95 transition-all"
            >
              <Sparkles className="size-3.5 text-cyan-200 animate-pulse" />
              Run Requirements Normalizer
            </Button>
            <Button
              onClick={() => setNewReqOpen(true)}
              variant="outline"
              className="text-xs border-border/80 hover:bg-secondary/60 gap-1.5 rounded-xl"
            >
              <Plus className="size-3.5" />
              New Requirement
            </Button>
          </div>
        </div>

        {/* 4 Grounded Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border/40">
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Total Requirements
            </p>
            <p className="text-xl font-bold text-foreground mt-0.5">{totalCount}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Canonical registry</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Average Atomicity
            </p>
            <p className="text-xl font-bold text-cyan-400 mt-0.5">{avgAtomicity}%</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Decomposition score</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Verified Criteria
            </p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">
              {verifiedCriteriaCount} / {totalCriteriaCount} ({criteriaRatio}%)
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Automated test passes</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Ambiguous / Under-specified
            </p>
            <p
              className={`text-xl font-bold mt-0.5 ${
                ambiguousCount > 0 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {ambiguousCount}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Flagged for normalization</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-xl bg-card/60 border border-border/60">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requirements by ID, title, or keywords..."
            className="pl-9 bg-background/60 border-border/50 text-xs h-9 rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-background/60 p-1 rounded-lg border border-border/50 text-xs">
            {["ALL", "FUNCTIONAL", "NON_FUNCTIONAL", "SECURITY", "COMPLIANCE"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "ALL"
                  ? "All"
                  : cat === "NON_FUNCTIONAL"
                    ? "Non-Func"
                    : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-background/60 p-1 rounded-lg border border-border/50 text-xs">
            {["ALL", "MUST", "SHOULD", "COULD"].map((pri) => (
              <button
                key={pri}
                onClick={() => setSelectedPriority(pri)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  selectedPriority === pri
                    ? "bg-violet-500/20 text-violet-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {pri === "ALL" ? "All Pri" : pri}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requirement Cards List */}
      <div className="space-y-3.5">
        {filteredRequirements.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
            <FileCheck2 className="size-10 text-muted-foreground/40 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-foreground">No matching requirements found</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              Adjust search keywords or active category filters to inspect your requirements baseline.
            </p>
          </div>
        ) : (
          filteredRequirements.map((req) => {
            const isExpanded = !!expandedReqs[req.id];
            return (
              <Card
                key={req.id}
                className={`rounded-2xl border transition-all ${
                  req.quality.isAmbiguous
                    ? "border-amber-500/40 bg-amber-500/[0.02]"
                    : "border-border/70 bg-card/60 hover:border-border"
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Top Meta Line */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-secondary text-primary border border-border/80">
                        {req.id}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          req.category === "FUNCTIONAL"
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            : req.category === "NON_FUNCTIONAL"
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                              : req.category === "SECURITY"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {req.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          req.priority === "MUST"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : req.priority === "SHOULD"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        P_{req.priority}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/80">
                        {req.revision} · {req.owner}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400">
                        Atomicity: {req.quality.atomicity}%
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAskAther(req)}
                        className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-primary px-2"
                      >
                        <Bot className="size-3 text-cyan-400" />
                        Ask ATHER
                      </Button>
                      <button
                        onClick={() => toggleExpand(req.id)}
                        className="p-1 rounded-lg hover:bg-secondary/80 text-muted-foreground"
                      >
                        {isExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{req.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {req.description}
                    </p>
                  </div>

                  {/* Ambiguity Alert if flagged */}
                  {req.quality.isAmbiguous && req.quality.ambiguityNotes && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                      <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[11px]">Ambiguity Flagged</p>
                        <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
                          {req.quality.ambiguityNotes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Traceability badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">
                      Traceability:
                    </span>
                    {req.traceability.components.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary/80 text-foreground border border-border/50"
                      >
                        comp:{c}
                      </span>
                    ))}
                    {req.traceability.tests.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      >
                        test:{t}
                      </span>
                    ))}
                    {req.traceability.gates.map((g) => (
                      <span
                        key={g}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                      >
                        gate:{g}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Acceptance Criteria */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-cyan-400" />
                          Gherkin Acceptance Criteria ({req.acceptanceCriteria.length})
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Testable Assertion Scenarios
                        </span>
                      </div>

                      {req.acceptanceCriteria.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic py-2">
                          No acceptance criteria defined yet. Run normalizer to synthesize Gherkin scenarios.
                        </p>
                      ) : (
                        <div className="space-y-2 pt-1">
                          {req.acceptanceCriteria.map((ac) => (
                            <div
                              key={ac.id}
                              className="p-3 rounded-xl bg-background/60 border border-border/50 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] text-cyan-400 font-semibold">
                                  {ac.id}
                                </span>
                                <button
                                  onClick={() => toggleCriterionVerified(req.id, ac.id)}
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 cursor-pointer transition-colors ${
                                    ac.verified
                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                      : "bg-secondary text-muted-foreground border-border/60 hover:text-foreground"
                                  }`}
                                >
                                  {ac.verified ? "PASS Verified" : "Pending Check"}
                                </button>
                              </div>
                              <p className="text-muted-foreground text-[11px] leading-relaxed">
                                <strong className="text-cyan-300">GIVEN</strong> {ac.given}
                              </p>
                              <p className="text-muted-foreground text-[11px] leading-relaxed">
                                <strong className="text-violet-300">WHEN</strong> {ac.when}
                              </p>
                              <p className="text-foreground text-[11px] leading-relaxed">
                                <strong className="text-emerald-300">THEN</strong> {ac.then}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Normalization Review Dialog (Before / After Diff) */}
      <Dialog open={normalizationModalOpen} onOpenChange={setNormalizationModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Sparkles className="size-4 text-cyan-400" />
              Requirements Normalizer — Proposed Atomic Decomposition
            </DialogTitle>
          </DialogHeader>

          {proposedNormalization && (
            <div className="space-y-4 pt-2 text-xs">
              {/* Detected Deficiencies */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                <p className="font-semibold text-xs">Detected Quality Gaps:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {proposedNormalization.detectedIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>

              {/* Before / After Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Before */}
                <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/[0.03] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Original Requirement ({proposedNormalization.original.id})
                  </span>
                  <h4 className="font-semibold text-xs text-foreground">
                    {proposedNormalization.original.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {proposedNormalization.original.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Criteria: {proposedNormalization.original.acceptanceCriteria.length} · Atomicity:{" "}
                    {proposedNormalization.original.quality.atomicity}%
                  </p>
                </div>

                {/* After */}
                <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-500/[0.04] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Proposed Atomic Decomposition ({proposedNormalization.normalized.revision})
                  </span>
                  <h4 className="font-semibold text-xs text-foreground">
                    {proposedNormalization.normalized.title}
                  </h4>
                  <p className="text-[11px] text-foreground leading-relaxed">
                    {proposedNormalization.normalized.description}
                  </p>
                  <p className="text-[10px] text-cyan-300 font-mono">
                    Criteria: {proposedNormalization.normalized.acceptanceCriteria.length} · Atomicity:{" "}
                    {proposedNormalization.normalized.quality.atomicity}%
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNormalizationModalOpen(false)}
                  className="text-xs"
                >
                  Reject Proposal
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplyNormalization}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs px-4"
                >
                  Accept & Commit Revision
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Requirement Dialog */}
      <Dialog open={newReqOpen} onOpenChange={setNewReqOpen}>
        <DialogContent className="max-w-md bg-card border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Plus className="size-4 text-cyan-400" />
              Create Atomic Requirement
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                Requirement Title
              </label>
              <Input
                value={newReqTitle}
                onChange={(e) => setNewReqTitle(e.target.value)}
                placeholder="e.g. Asynchronous Webhook Idempotency Verification"
                className="mt-1 text-xs h-8 bg-background/60"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                Formal Description & Constraints
              </label>
              <Textarea
                rows={3}
                value={newReqDesc}
                onChange={(e) => setNewReqDesc(e.target.value)}
                placeholder="Describe the precise operational expectation, latency bounds, and failure conditions..."
                className="mt-1 text-xs bg-background/60"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Category</label>
                <select
                  value={newReqCat}
                  onChange={(e) => setNewReqCat(e.target.value as ReqCategory)}
                  className="w-full mt-1 h-8 rounded-md bg-background/60 border border-border/60 text-xs px-2 text-foreground"
                >
                  <option value="FUNCTIONAL">Functional</option>
                  <option value="NON_FUNCTIONAL">Non-Functional</option>
                  <option value="SECURITY">Security</option>
                  <option value="COMPLIANCE">Compliance</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Priority</label>
                <select
                  value={newReqPriority}
                  onChange={(e) => setNewReqPriority(e.target.value as ReqPriority)}
                  className="w-full mt-1 h-8 rounded-md bg-background/60 border border-border/60 text-xs px-2 text-foreground"
                >
                  <option value="MUST">P0 (Must)</option>
                  <option value="SHOULD">P1 (Should)</option>
                  <option value="COULD">P2 (Could)</option>
                  <option value="WONT">P3 (Won't)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
              <Button variant="ghost" size="sm" onClick={() => setNewReqOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateRequirement}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4"
              >
                Create Requirement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
