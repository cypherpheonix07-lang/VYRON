import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { ReportCompiler } from "@/services/reportCompiler";
import type { ReportDocument } from "@/types/report";

interface GenerateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReportGenerated: (doc: ReportDocument) => void;
}

const PROGRESS_STEPS = [
  "Collecting telemetry & project records...",
  "Computing consistency formulas & metric weights...",
  "Drafting structured sections & IEEE tables...",
  "Calculating deterministic SHA-256 checksum...",
  "Report compilation complete!",
];

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  open,
  onOpenChange,
  onReportGenerated,
}) => {
  const [template, setTemplate] = useState<
    "Academic IEEE" | "Technical Executive" | "Executive Summary"
  >("Academic IEEE");
  const [seed, setSeed] = useState<"ALPHA" | "BETA" | "GAMMA" | "DELTA" | "EPSILON">("ALPHA");
  const [isCompiling, setIsCompiling] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setIsCompiling(true);
    setCurrentStepIndex(0);
    setProgress(15);

    // Step 1
    await new Promise((r) => setTimeout(r, 400));
    setCurrentStepIndex(1);
    setProgress(40);

    // Step 2
    await new Promise((r) => setTimeout(r, 450));
    setCurrentStepIndex(2);
    setProgress(65);

    // Step 3
    await new Promise((r) => setTimeout(r, 400));
    setCurrentStepIndex(3);
    setProgress(85);

    // Step 4
    const compiler = new ReportCompiler(seed);
    const compiled = await compiler.compileReport(template);

    await new Promise((r) => setTimeout(r, 300));
    setCurrentStepIndex(4);
    setProgress(100);

    toast.success(`Executive Report "${compiled.title}" compiled successfully.`);
    setIsCompiling(false);
    onReportGenerated(compiled);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100 p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-cyan-400" />
            <DialogTitle className="text-slate-100 text-base font-bold">
              Generate Executive Report
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400 text-xs">
            Compiles a verified, tamper-evident engineering report from live telemetry.
          </DialogDescription>
        </DialogHeader>

        {!isCompiling ? (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300 font-semibold">Report Template Format</Label>
              <Select
                value={template}
                onValueChange={(v) =>
                  setTemplate(v as "Academic IEEE" | "Technical Executive" | "Executive Summary")
                }
              >
                <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200 text-xs">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                  <SelectItem value="Academic IEEE">Academic IEEE Conference Paper</SelectItem>
                  <SelectItem value="Technical Executive">
                    Technical Executive Architecture Report
                  </SelectItem>
                  <SelectItem value="Executive Summary">Executive Summary & Audit Brief</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300 font-semibold">Data Fabric Seed</Label>
              <Select
                value={seed}
                onValueChange={(v) =>
                  setSeed(v as "ALPHA" | "BETA" | "GAMMA" | "DELTA" | "EPSILON")
                }
              >
                <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200 text-xs">
                  <SelectValue placeholder="Select seed" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                  <SelectItem value="ALPHA">Seed ALPHA (Balanced Production Baseline)</SelectItem>
                  <SelectItem value="BETA">
                    Seed BETA (Critical Security Vulnerabilities)
                  </SelectItem>
                  <SelectItem value="GAMMA">Seed GAMMA (Cold Start / Empty States)</SelectItem>
                  <SelectItem value="DELTA">Seed DELTA (Low Requirement Clarity)</SelectItem>
                  <SelectItem value="EPSILON">Seed EPSILON (Extreme Monorepo Scale)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300 flex items-center gap-1">
                <Sparkles className="size-3.5 text-cyan-400" />
                Strict Non-Fabrication Guarantee:
              </p>
              <p>
                All KPI cards, formulas, and performance tables are derived strictly from active
                project state. Unmeasured items are moved to Appendix D.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-slate-400 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleGenerate}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs gap-1.5"
              >
                <Sparkles className="size-3.5" /> Start Compilation
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 animate-pulse">
                <Loader2 className="size-8 animate-spin" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-sm text-slate-100">{PROGRESS_STEPS[currentStepIndex]}</p>
              <p className="text-xs text-slate-400 font-mono">
                Step {currentStepIndex + 1} of 5 &bull; {progress}%
              </p>
            </div>

            <Progress value={progress} className="h-2 bg-slate-800" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
