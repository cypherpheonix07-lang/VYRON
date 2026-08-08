import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Boxes,
  Braces,
  Check,
  FileBarChart2,
  GitBranch,
  Github,
  LayoutDashboard,
  ListChecks,
  Menu,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  X,
} from "lucide-react";
import { useState } from "react";

import { BrahmaLogo } from "@/components/brahma/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PROJECT BRAHMA — From raw idea to validated software blueprint" },
      {
        name: "description",
        content:
          "Blueprint-driven requirements, architecture, code health, security and delivery risk analysis mapped to business impact — in one engineering intelligence platform.",
      },
      {
        property: "og:title",
        content: "PROJECT BRAHMA — From raw idea to validated software blueprint",
      },
      {
        property: "og:description",
        content:
          "AI requirement analysis, architecture generation, code health, security review, risk prediction and business impact mapping.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: ListChecks,
    title: "Requirement Intelligence",
    body: "Extracts functional and non-functional requirements, actors, modules, constraints and entities with a confidence score on every item.",
  },
  {
    icon: Network,
    title: "Architecture Generator",
    body: "Produces a service topology, database schema and API contract from validated requirements — not a generic template.",
  },
  {
    icon: Target,
    title: "Business KPI Mapper",
    body: "Connects each module to cost, time, quality and risk exposure so engineering trade-offs are argued in business terms.",
  },
  {
    icon: Activity,
    title: "Code Health Engine",
    body: "Scores maintainability, cyclomatic complexity, duplication, coverage and dependency risk down to the file level.",
  },
  {
    icon: ShieldCheck,
    title: "Security Reviewer",
    body: "Flags injection, broken authorization, secret exposure and vulnerable dependencies with CWE references and fixes.",
  },
  {
    icon: TrendingUp,
    title: "Delivery Risk Predictor",
    body: "Combines requirement clarity, debt and velocity into a delivery risk score with an expected schedule impact.",
  },
  {
    icon: FileBarChart2,
    title: "Report Generator",
    body: "Academic, technical and executive reports generated from live analysis data, exportable as PDF.",
  },
  {
    icon: LayoutDashboard,
    title: "Engineering Dashboard",
    body: "One executive view of portfolio health, security posture and release readiness across every project.",
  },
];

const steps = [
  { title: "Input idea or requirement", body: "Paste a project brief, upload an SRS, or dictate the idea." },
  { title: "AI extracts structured requirements", body: "Requirements, actors, modules and constraints with confidence scores." },
  { title: "Generate architecture blueprint", body: "Services, data model, API routes and recommendations." },
  { title: "Analyze code and security", body: "Connect a repository for health metrics and vulnerability findings." },
  { title: "Predict risk and business impact", body: "Delivery risk, technical debt and KPI impact you can present." },
];

const stack = [
  { name: "React 19 + TypeScript", note: "Typed, server-rendered UI" },
  { name: "Tailwind CSS", note: "Token-driven design system" },
  { name: "Recharts", note: "Engineering data visualization" },
  { name: "React Flow", note: "Interactive architecture canvas" },
  { name: "LLM Analysis Layer", note: "Requirement + code reasoning" },
  { name: "PostgreSQL", note: "Blueprint and analysis storage" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#technology", label: "Technology" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <BrahmaLogo />
        <nav className="ml-6 hidden items-center gap-6 md:flex" aria-label="Sections">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">
              Get Started <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
        </Button>
      </div>
      {open ? (
        <div className="border-t border-border/70 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-[0.35]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <Badge variant="outline" className="rounded-full border-primary/40 bg-primary/10 text-primary">
            <Sparkles className="size-3" aria-hidden /> Blueprint-driven engineering intelligence
          </Badge>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            From raw idea to <span className="text-gradient">validated software blueprint.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            PROJECT BRAHMA turns a project brief into structured requirements, generates a reviewable
            architecture, analyzes code health and security, predicts delivery risk, and maps every
            technical issue to its business impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/app/projects/new">
                Create Project <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/app">View Demo Dashboard</Link>
            </Button>
          </div>
          <dl className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "61", v: "Projects monitored" },
              { k: "1,432", v: "Analyses executed" },
              { k: "84", v: "Avg. health score" },
              { k: "318", v: "Reports generated" },
            ].map((s) => (
              <div key={s.v} className="surface rounded-xl px-4 py-4">
                <dt className="text-2xl font-semibold tabular-nums">{s.k}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--warning)]">
              The problem
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Projects start unvalidated and stay that way
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Requirements live in chat threads, architecture is drawn once and forgotten, code
              quality is checked by a linter nobody reads, and security review happens the week
              before release. Nothing connects to the business outcome the project was funded for.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              { t: "Fragmented tooling", d: "Docs, diagrams, linters, scanners and spreadsheets that never share context." },
              { t: "No requirement validation", d: "Ambiguity is discovered in sprint 4, not on day one." },
              { t: "Invisible technical debt", d: "Complexity grows with no owner and no cost attached." },
              { t: "Late security findings", d: "Critical issues surface after the release candidate is cut." },
            ].map((p) => (
              <li key={p.t} className="surface rounded-xl p-4">
                <p className="text-sm font-medium">{p.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">The solution</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            One unified engineering intelligence platform
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Braces, t: "Validated blueprint first", d: "Every project begins with structured, scored requirements and a generated architecture your reviewers can challenge." },
              { icon: BarChart3, t: "Continuous quality signal", d: "Code health, security posture and delivery risk recalculated on every analysis run." },
              { icon: Boxes, t: "Business alignment built in", d: "Findings are ranked by business impact, so the highest-value fix is always at the top." },
            ].map((s) => (
              <Card key={s.t} className="surface">
                <CardContent className="pt-2">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary">
                    <s.icon className="size-4" aria-hidden />
                  </span>
                  <p className="mt-4 font-medium">{s.t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Eight engines, one blueprint
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Each engine writes back into the same project blueprint, so requirements, architecture,
          code and business impact stay in sync.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="surface transition-colors hover:border-primary/40">
              <CardContent className="pt-2">
                <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                  <f.icon className="size-4" aria-hidden />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
          <ol className="mt-10 grid gap-4 lg:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title} className="surface relative rounded-xl p-5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/12 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <p className="mt-3 text-sm font-medium">{s.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Technology */}
      <section id="technology" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Technology</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A typed, accessible frontend over an analysis pipeline built for reproducible output.
              Every score is derived from a deterministic rule set, so two reviewers see the same
              numbers.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Deterministic scoring model", "Traceable requirement-to-module mapping", "Exportable blueprint and report artifacts"].map(
                (t) => (
                  <li key={t} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--success)]" aria-hidden />
                    {t}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {stack.map((s) => (
              <div key={s.name} className="surface rounded-xl px-4 py-4">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/60">
        <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-20 text-center sm:px-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ background: "var(--gradient-hero)" }}
            aria-hidden
          />
          <div className="relative">
            <Workflow className="mx-auto size-8 text-primary" aria-hidden />
            <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              Start your next project with a blueprint, not a guess
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Create a project, paste your idea, and get a validated requirement set, architecture
              and risk profile in one pass.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/app">View Demo Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-card/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <BrahmaLogo />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Blueprint-driven requirements, architecture, health monitoring and business impact
              mapping for software teams.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Product</p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground">How it works</a></li>
              <li><Link to="/app" className="hover:text-foreground">Demo dashboard</Link></li>
              <li><Link to="/app/projects/new" className="hover:text-foreground">New project</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Resources</p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li><a href="#technology" className="hover:text-foreground">Technology</a></li>
              <li><a href="#features" className="hover:text-foreground">Scoring model</a></li>
              <li><Link to="/app/reports" className="hover:text-foreground">Report samples</Link></li>
              <li><Link to="/app/settings" className="hover:text-foreground">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Documentation & contact</p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <GitBranch className="size-3.5" aria-hidden /> docs.brahma.dev
              </li>
              <li className="flex items-center gap-2">
                <Github className="size-3.5" aria-hidden /> github.com/project-brahma
              </li>
              <li>hello@brahma.dev</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
          © 2026 PROJECT BRAHMA. Built for engineering teams that ship with evidence.
        </div>
      </footer>
    </div>
  );
}
