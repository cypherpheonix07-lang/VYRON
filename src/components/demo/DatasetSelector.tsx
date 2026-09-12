/**
 * PROJECT BRAHMA — DATASET SELECTOR COMPONENT (FL-02-C)
 * Modal / dropdown selector to swap active domain fixture or connect external Kaggle datasets.
 */

import React, { useState } from "react";
import { Database, Sparkles, Check, ChevronRight } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { fixtureStore, FixtureSet } from "@/services/fixtureStore";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DatasetSelector({ className = "" }: { className?: string }) {
  const { demoDomain, activate } = useDemoMode();
  const [open, setOpen] = useState(false);
  const [domainKeys] = useState<string[]>(() => fixtureStore.list());

  const handleSelectDomain = (domain: string) => {
    activate("demo-project-brahma-showcase", domain);
    setOpen(false);
    toast.success(`Active demo benchmark switched to: ${domain.toUpperCase()}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer ${className}`}
        >
          <Database className="size-3 text-cyan-400" />
          <span>Domain: {demoDomain || "fintech"}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-xl bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-amber-400" />
            <span>Select Architecture Benchmark Domain</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Switch synthetic data profiles to test domain-specific compliance rules (PCI-DSS, HIPAA, FERPA, SOC2).
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2.5 mt-3">
          {domainKeys.map((domainKey) => {
            const fixture: FixtureSet = fixtureStore.get(domainKey);
            const isSelected = (demoDomain || "fintech").toLowerCase() === domainKey.toLowerCase();
            return (
              <div
                key={domainKey}
                onClick={() => handleSelectDomain(domainKey)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold capitalize text-zinc-100">{domainKey}</span>
                    <Badge variant="outline" className="text-[10px] text-zinc-400">
                      {fixture.requirements?.length || 15} reqs
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-zinc-400">
                      {fixture.blueprintNodes?.length || 12} nodes
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400">{fixture.project?.description}</p>
                </div>

                {isSelected ? (
                  <Check className="size-4 text-amber-400 shrink-0" />
                ) : (
                  <ChevronRight className="size-4 text-zinc-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
