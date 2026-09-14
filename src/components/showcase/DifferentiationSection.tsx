import { DIFFERENTIATION_MATRIX } from "./showcaseData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Minus, Scale, Sparkles, X } from "lucide-react";

export function DifferentiationSection() {
  return (
    <section className="py-20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
            <Scale className="size-3.5" />
            <span>Product Differentiation • Architectural Comparison</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Why PROJECT BRAHMA is Different
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Existing tools solve isolated slices of the software lifecycle. Linters check syntax, APM monitors servers, and
            generic AI bots generate snippets. Brahma is the unified engineering intelligence platform connecting{" "}
            <strong className="text-foreground">intent, blueprint, code, tests, and authoritative release gates</strong>.
          </p>
        </div>

        {/* COMPARISON TABLE */}
        <div className="rounded-2xl border border-border/80 bg-card/90 shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/70 bg-secondary/40">
                  <th className="p-4 font-mono uppercase tracking-wider text-muted-foreground w-1/5">
                    Engineering Dimension
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider text-muted-foreground w-1/5">
                    Traditional Linters
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider text-muted-foreground w-1/5">
                    APM & Observability
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider text-muted-foreground w-1/5">
                    Generic AI Chatbots
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider text-primary font-bold w-1/5 bg-primary/10 border-l border-primary/30">
                    PROJECT BRAHMA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {DIFFERENTIATION_MATRIX.map((row) => (
                  <tr key={row.dimension} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-bold text-foreground align-top">{row.dimension}</td>
                    <td className="p-4 text-muted-foreground align-top leading-relaxed">
                      {row.traditionalLinters}
                    </td>
                    <td className="p-4 text-muted-foreground align-top leading-relaxed">
                      {row.apmObservability}
                    </td>
                    <td className="p-4 text-muted-foreground align-top leading-relaxed">
                      {row.genericAIChatbots}
                    </td>
                    <td className="p-4 text-foreground/95 font-medium align-top leading-relaxed bg-primary/5 border-l border-primary/30">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{row.projectBrahma}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
