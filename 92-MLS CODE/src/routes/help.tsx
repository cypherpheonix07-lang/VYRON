import { createFileRoute, Link } from "@tanstack/react-router";
import React from "react";
import {
  BookOpen,
  Calculator,
  Keyboard,
  HelpCircle,
  Shield,
  Layers,
  FileCode,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrahmaLogo } from "@/components/brahma/logo";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [{ title: "Help Center & Score Glossary — PROJECT BRAHMA" }],
  }),
  component: HelpCenterPage,
});

function HelpCenterPage() {
  const scoreGlossary = [
    {
      name: "Code Health Composite",
      formula:
        "0.35 * Maintainability + 0.25 * (100 - Duplication) + 0.25 * Coverage + 0.15 * (100 - Complexity)",
      desc: "Holistic evaluation of static code quality, testing rigor, and cyclomatic risk down to the file level.",
    },
    {
      name: "Security Posture Index",
      formula: "100 - (20 * Critical_CWE + 10 * High_CWE + 4 * Medium_CWE + 1 * Low_CWE)",
      desc: "Vulnerability surface scoring mapped directly to MITRE Top 25 CWEs and OWASP standards.",
    },
    {
      name: "Traceability Integrity",
      formula: "(Linked_Requirements / Total_Requirements) * 100",
      desc: "Measures requirement completeness across architecture components, unit tests, and live KPIs.",
    },
    {
      name: "Publish Gate Readiness",
      formula: "Min(Check_1, Check_2, ..., Check_7) where Critical_Fail = 0",
      desc: "Strict boolean evaluation ensuring zero blocker-level security or test regression before release.",
    },
  ];

  const shortcuts = [
    { key: "Cmd + K / Ctrl + K", desc: "Open global command palette" },
    { key: "?", desc: "Open keyboard shortcuts cheat-sheet modal" },
    { key: "G then D", desc: "Navigate directly to Main Dashboard" },
    { key: "G then P", desc: "Navigate directly to Projects overview" },
    { key: "G then S", desc: "Navigate directly to AI Studio workspace" },
    { key: "T", desc: "Cycle between Dark / Light theme modes" },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)] p-6 md:p-12 font-sans">
      <header className="max-w-6xl mx-auto flex items-center justify-between border-b border-border/40 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <BrahmaLogo />
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            HELP & GLOSSARY
          </Badge>
        </div>
        <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs">
          <Link to="/app">Dashboard</Link>
        </Button>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Platform Guide & Formula Glossary
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Understand how mathematical scores are derived, explore keyboard shortcuts, and review
            quality governance models.
          </p>
        </div>

        {/* Score Glossary */}
        <Card className="surface">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calculator className="size-4 text-primary" /> Mathematical Score Glossary
            </CardTitle>
            <CardDescription className="text-xs">
              Every score in PROJECT BRAHMA is computed from deterministic formulas without
              arbitrary approximations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scoreGlossary.map((item) => (
                <div
                  key={item.name}
                  className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2"
                >
                  <h4 className="font-semibold text-foreground text-xs">{item.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                      Formula
                    </span>
                    <code className="block mt-1 p-2 rounded bg-black/40 text-cyan-300 font-mono text-[11px] border border-border/40 overflow-x-auto">
                      {item.formula}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="surface">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Keyboard className="size-4 text-primary" /> Power Keyboard Shortcuts
            </CardTitle>
            <CardDescription className="text-xs">
              Navigate the platform at lightning speed without lifting your hands from the keyboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {shortcuts.map((sc) => (
                <div
                  key={sc.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/30 text-xs"
                >
                  <span className="text-muted-foreground">{sc.desc}</span>
                  <kbd className="px-2 py-1 bg-black/50 border border-border/80 rounded font-mono font-bold text-foreground text-[10px]">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
