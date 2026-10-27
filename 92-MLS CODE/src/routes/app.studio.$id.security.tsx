import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Filter,
  CheckSquare,
  Lock,
  Loader2,
  AlertOctagon,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, ScoreBar } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/studio/$id/security")({
  head: () => ({
    meta: [
      { title: "Security Studio — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Review code vulnerabilities, dependency checks, and compliance audits.",
      },
    ],
  }),
  component: SecurityStudioPage,
});

const mockVulnerabilities = [
  {
    id: "SEC-1",
    title: "SQL Injection vulnerability in search query",
    severity: "High",
    cwe: "CWE-89",
    location: "server/routes/api.py:L14",
    desc: "User query input is concatenated directly into SQL execution strings instead of parameterization.",
    solution: "Use raw sql bind parameters or parameterize database executions.",
  },
  {
    id: "SEC-2",
    title: "Unrestricted file upload types allowed",
    severity: "Medium",
    cwe: "CWE-434",
    location: "server/routes/api.py:L82",
    desc: "Target path accepts uploads without validating content headers or MIME signatures.",
    solution: "Filter upload extensions against whitelist arrays and verify binary file types.",
  },
  {
    id: "SEC-3",
    title: "CORS policy wildcard configuration",
    severity: "Low",
    cwe: "CWE-942",
    location: "package.json",
    desc: "Access-Control-Allow-Origin header is set to wildcard '*' in staging configs.",
    solution: "Define specific domain whitelist arrays inside settings file.",
  },
];

function SecurityStudioPage() {
  const { id } = Route.useParams();

  const [activeSeverity, setActiveSeverity] = useState("All");
  const [vulns, setVulns] = useState(mockVulnerabilities);
  const [fixingId, setFixingId] = useState<string | null>(null);

  const filtered =
    activeSeverity === "All" ? vulns : vulns.filter((v) => v.severity === activeSeverity);

  const handleFixWithAI = async (vulnId: string) => {
    setFixingId(vulnId);
    toast.info("Generating security patch code...", {
      description: "Refactoring AST syntax tree.",
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFixingId(null);
    setVulns((prev) => prev.filter((v) => v.id !== vulnId));
    toast.success("Vulnerability resolved!", {
      description: "AI refactored parameterized queries and verified AST syntax rules.",
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="surface lg:col-span-2">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                Security Health Score
              </span>
              <Badge className="bg-[var(--success)] text-white text-[9px]">A- Grade</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">94/100</p>
              <span className="text-xs text-muted-foreground">3 unresolved findings</span>
            </div>
            <ScoreBar value={94} />
          </CardContent>
        </Card>

        <Card className="surface">
          <CardContent className="pt-4 space-y-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Critical Issues
            </span>
            <p className="text-2xl font-bold text-muted-foreground/30">0</p>
            <p className="text-[10px] text-muted-foreground">Requires immediate patch</p>
          </CardContent>
        </Card>

        <Card className="surface">
          <CardContent className="pt-4 space-y-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              High Issues
            </span>
            <p className="text-2xl font-bold text-[var(--critical)]">
              {vulns.filter((v) => v.severity === "High").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Resolving takes priority</p>
          </CardContent>
        </Card>

        <Card className="surface">
          <CardContent className="pt-4 space-y-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Medium/Low Issues
            </span>
            <p className="text-2xl font-bold text-[var(--warning)]">
              {vulns.filter((v) => v.severity === "Medium" || v.severity === "Low").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Improvement suggestions</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShieldAlert className="size-5 text-[var(--critical)]" /> Vulnerability Audits
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automatic code scans mapped against common CVE and CWE patterns.
          </p>
        </div>

        {/* Severity filters */}
        <div className="flex gap-2">
          <div className="flex items-center bg-secondary/50 p-0.5 rounded border border-border/40 shrink-0">
            {["All", "High", "Medium", "Low"].map((sev) => (
              <Button
                key={sev}
                variant={activeSeverity === sev ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-3 text-[10px]"
                onClick={() => setActiveSeverity(sev)}
              >
                {sev}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="findings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
          <TabsTrigger value="findings" className="text-xs">
            Security Findings
          </TabsTrigger>
          <TabsTrigger value="owasp" className="text-xs">
            OWASP Compliance Checklist
          </TabsTrigger>
        </TabsList>

        {/* FINDINGS TAB */}
        <TabsContent value="findings" className="space-y-4 outline-none">
          <SectionCard title="Active Vulnerability Log" description="Unresolved security findings.">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                <ShieldCheck className="size-8 text-[var(--success)] mx-auto mb-2" />
                No vulnerabilities match the current filter.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead>Vulnerability Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>CWE ID</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <>
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge
                            className={`rounded-full text-[9px] ${
                              item.severity === "High" &&
                              "bg-[var(--critical)]/10 text-[var(--critical)] border-[var(--critical)]"
                            } ${
                              item.severity === "Medium" &&
                              "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]"
                            } ${
                              item.severity === "Low" &&
                              "bg-blue-500/10 text-blue-400 border-blue-500"
                            }`}
                            variant="outline"
                          >
                            {item.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-semibold">{item.title}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.location}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.cwe}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            disabled={fixingId === item.id}
                            className="h-7 text-[10px] bg-primary text-primary-foreground"
                            onClick={() => handleFixWithAI(item.id)}
                          >
                            {fixingId === item.id ? (
                              <Loader2 className="size-3 animate-spin mr-1" />
                            ) : (
                              <Zap className="size-3 mr-1" />
                            )}
                            Fix with AI
                          </Button>
                        </TableCell>
                      </TableRow>
                      {/* Collapsible Details */}
                      <TableRow key={`${item.id}-details`}>
                        <TableCell colSpan={5} className="bg-secondary/10 px-6 py-4">
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="font-semibold text-muted-foreground">
                                Description:
                              </span>
                              <p className="text-muted-foreground mt-0.5 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-muted-foreground">
                                Remediation:
                              </span>
                              <p className="text-[var(--success)] mt-0.5 leading-relaxed font-mono">
                                {item.solution}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            )}
          </SectionCard>
        </TabsContent>

        {/* OWASP TAB */}
        <TabsContent value="owasp" className="space-y-4 outline-none">
          <SectionCard
            title="OWASP Top 10 Readiness Check"
            description="Verify checklist parameters mapped to system routes."
          >
            <div className="space-y-3">
              {(
                [
                  ["A01:2026", "Broken Access Control", "Wired workspace endpoint guards", true],
                  [
                    "A02:2026",
                    "Cryptographic Failures",
                    "SSL verification and key masking checks",
                    true,
                  ],
                  [
                    "A03:2026",
                    "Injection",
                    "SQL parameterized checks (1 finding remaining)",
                    false,
                  ],
                  ["A04:2026", "Insecure Design", "Threat modeling review complete", true],
                  [
                    "A05:2026",
                    "Security Misconfiguration",
                    "Strict CORS filters defined in code",
                    true,
                  ],
                  ["A06:2026", "Vulnerable Components", "Checking out-of-date npm packages", true],
                ] as const
              ).map(([id, title, desc, passed]) => (
                <div
                  key={id}
                  className="flex items-start justify-between border-b border-border/40 py-3 last:border-0"
                >
                  <div className="flex gap-3">
                    <span className="grid size-6 place-items-center rounded bg-secondary/80 text-[10px] font-mono text-muted-foreground shrink-0 mt-0.5">
                      {id}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">{title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`rounded-full text-[9px] px-2 ${
                      passed
                        ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]"
                        : "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]"
                    }`}
                  >
                    {passed ? "Verified" : "Attention Required"}
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
