import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  Zap,
  RotateCw,
  Sliders,
  DollarSign,
  HelpCircle,
  Database,
  Plug,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, ScoreBar } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/app/admin/models")({
  head: () => ({
    meta: [
      { title: "Models Config Router — PROJECT BRAHMA" },
      {
        name: "description",
        content: "AI backend model allocations, costs cap thresholds, and key rotations.",
      },
    ],
  }),
  component: AdminModelsPage,
});

const defaultModels = [
  {
    id: "mod-1",
    task: "Requirement parsing",
    model: "Gemini 1.5 Pro",
    fallback: "Claude 3.5 Sonnet",
    temp: 0.1,
    maxTokens: 4096,
  },
  {
    id: "mod-2",
    task: "Architecture generation",
    model: "Gemini 1.5 Pro",
    fallback: "Claude 3.5 Sonnet",
    temp: 0.2,
    maxTokens: 8192,
  },
  {
    id: "mod-3",
    task: "Code editing generation",
    model: "Claude 3.5 Sonnet",
    fallback: "GPT-4o",
    temp: 0.3,
    maxTokens: 4096,
  },
  {
    id: "mod-4",
    task: "Security static analysis",
    model: "Gemini 1.5 Flash",
    fallback: "Claude 3.5 Sonnet",
    temp: 0.0,
    maxTokens: 2048,
  },
];

function AdminModelsPage() {
  const [models, setModels] = useState(defaultModels);
  const [costCap, setCostCap] = useState("500");
  const [autoFallback, setAutoFallback] = useState(true);
  const [cacheAI, setCacheAI] = useState(true);

  // Edit states
  const [editId, setEditId] = useState<string | null>(null);
  const [editModel, setEditModel] = useState("");
  const [editFallback, setEditFallback] = useState("");

  const handleSaveRow = (id: string) => {
    setModels((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, model: editModel, fallback: editFallback };
      }),
    );
    setEditId(null);
    toast.success("Routing preference saved.");
  };

  const handleRotateKeys = () => {
    const confirm = window.confirm(
      "Are you sure you want to rotate all API provider credentials keys?",
    );
    if (confirm) {
      toast.success("Rotation completed", {
        description: "New authorization credentials generated for Gemini and OpenAI platforms.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Warning for Budgets */}
      {parseFloat(costCap) > 400 && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-[var(--warning)]/40 bg-[var(--warning)]/10 px-4 py-3 text-sm"
        >
          <Sliders className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" aria-hidden="true" />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">AI spend is reaching boundaries.</span>{" "}
            Monthly cost cap threshold is configured to ${costCap}. Spend is currently at $392.15
            (78%).
          </p>
        </div>
      )}

      {/* Provider cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Gemini Pro API", "Connected", "$142.18 spend", "112k requests"],
          ["Anthropic API", "Connected", "$184.22 spend", "48k requests"],
          ["OpenAI API", "Disconnected", "$0.00 spend", "0 requests"],
        ].map(([name, status, spend, requests]) => {
          const isConnected = status === "Connected";
          return (
            <Card key={name} className="surface">
              <CardContent className="pt-4 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded bg-secondary text-primary shrink-0">
                      <Sparkles className="size-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">{name}</h4>
                      <p className="text-[9px] text-muted-foreground font-mono mt-0.5">
                        API KEY MASKED
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-[var(--success)]" : "bg-zinc-600"}`}
                    />
                    <span className="text-[9px] text-muted-foreground">{status}</span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-border/40 pt-2 text-[10px]">
                  <span className="text-muted-foreground">{spend}</span>
                  <span className="text-muted-foreground">{requests}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Model routing table */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Task Model Routing"
            description="Allocate specific LLM nodes per compiler behavior step."
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Studio Action</TableHead>
                  <TableHead>Primary Model</TableHead>
                  <TableHead>Fallback Model</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((item) => {
                  const isEditing = editId === item.id;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs font-semibold">{item.task}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            className="h-7 text-xs px-2"
                            value={editModel}
                            onChange={(e) => setEditModel(e.target.value)}
                          />
                        ) : (
                          <Badge variant="secondary" className="text-[9px]">
                            {item.model}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            className="h-7 text-xs px-2"
                            value={editFallback}
                            onChange={(e) => setEditFallback(e.target.value)}
                          />
                        ) : (
                          <Badge variant="outline" className="text-[9px]">
                            {item.fallback}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-[10px]"
                              onClick={() => setEditId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="h-6 text-[10px] bg-primary text-primary-foreground"
                              onClick={() => handleSaveRow(item.id)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] text-primary"
                            onClick={() => {
                              setEditId(item.id);
                              setEditModel(item.model);
                              setEditFallback(item.fallback);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </SectionCard>
        </div>

        {/* Right: Global controllers */}
        <div className="space-y-6">
          <SectionCard
            title="Cost & Cache Settings"
            description="Tune LLM consumption configurations."
          >
            <div className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="cost-limit-cap">Monthly Spend Cap ($ USD)</Label>
                <Input
                  id="cost-limit-cap"
                  type="number"
                  className="h-8 text-xs font-mono"
                  value={costCap}
                  onChange={(e) => setCostCap(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <div>
                  <p className="text-xs font-semibold">Auto-fallback on timeouts</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Route requests immediately to backup models.
                  </p>
                </div>
                <Switch
                  checked={autoFallback}
                  onCheckedChange={setAutoFallback}
                  aria-label="Auto-fallback on timeouts toggle"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <div>
                  <p className="text-xs font-semibold">Cache responses to save tokens</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Saves duplicate compilations requests.
                  </p>
                </div>
                <Switch
                  checked={cacheAI}
                  onCheckedChange={setCacheAI}
                  aria-label="Cache responses toggle"
                />
              </div>
            </div>
          </SectionCard>

          <Button
            variant="outline"
            className="w-full text-xs text-[var(--critical)] border-[var(--critical)]/20 hover:bg-[var(--critical)]/10"
            onClick={handleRotateKeys}
          >
            Rotate All Provider Keys
          </Button>
        </div>
      </div>
    </div>
  );
}
