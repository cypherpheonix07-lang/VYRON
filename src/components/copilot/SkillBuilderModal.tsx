/**
 * VYRON — SKILL BUILDER & INTERNET INGESTION MODAL (GOD MODE vNEXT)
 * Directives: 558-589, 590-625, 626-648, 649-677
 *
 * Dedicated control surface for:
 * 1. Custom Skill Factory (Natural language synthesis + 9-stage validation)
 * 2. Internet Skill Discovery & Ingestion (Trust classifier + security scan)
 * 3. Skill Registry & Version Management (Rollback + dependency checks)
 *
 * Strictly ZERO SQL.
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Sparkles,
  Search,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Power,
  Globe,
  Plus,
  Play,
  Check,
  X,
  Clock,
  Cpu,
} from "lucide-react";
import {
  skillRegistry,
  GovernedSkill,
  skillFactory,
  internetSkillIngestion,
  InternetSkillSearchResult,
  SkillIngestionInspection,
  ValidationStageResult,
} from "@/services/skills";
import { useCopilot } from "@/state/copilot/useCopilot";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SkillBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkillBuilderModal({ isOpen, onClose }: SkillBuilderModalProps) {
  const { mode } = useCopilot();
  const [activeTab, setActiveTab] = useState<"create" | "discover" | "registry">("create");
  const [skillsList, setSkillsList] = useState<GovernedSkill[]>(() => skillRegistry.listSkills());

  // Factory state
  const [skillName, setSkillName] = useState("");
  const [skillPurpose, setSkillPurpose] = useState("");
  const [skillDomain, setSkillDomain] = useState("Security");
  const [restrictions, setRestrictions] = useState("Read-only inspection, zero external credential leaks.");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [validationStages, setValidationStages] = useState<ValidationStageResult[]>([]);

  // Discover state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<InternetSkillSearchResult[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<SkillIngestionInspection | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);

  useEffect(() => {
    return skillRegistry.subscribe((updated) => {
      setSkillsList(updated);
    });
  }, []);

  useEffect(() => {
    if (activeTab === "discover") {
      void internetSkillIngestion.searchApprovedSkillIndex(searchQuery).then(setSearchResults);
    }
  }, [activeTab, searchQuery]);

  const handleSynthesizeCustomSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim() || !skillPurpose.trim() || isSynthesizing) return;

    setIsSynthesizing(true);
    toast.loading("Running 9-Stage Validation in Skill Sandbox...", { id: "skill-build" });
    try {
      const res = await skillFactory.buildCustomSkill({
        name: skillName,
        purpose: skillPurpose,
        domain: skillDomain,
        restrictions: [restrictions],
      });

      setValidationStages(res.validationStages);
      toast.dismiss("skill-build");

      if (res.success && res.skillBlueprint) {
        toast.success(`Skill '${res.skillBlueprint.name}' synthesized and staged in DRAFT!`);
        setSkillName("");
        setSkillPurpose("");
        setActiveTab("registry");
      } else {
        toast.error(`Validation failed: ${res.errors.join("; ")}`);
      }
    } catch (err: unknown) {
      toast.dismiss("skill-build");
      toast.error(`Synthesis error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleInspectExternalSkill = async (item: InternetSkillSearchResult) => {
    setIsInspecting(true);
    toast.loading(`Evaluating trust & security for ${item.title}...`, { id: "inspect-skill" });
    try {
      const inspection = await internetSkillIngestion.inspectAndExtractSkill({
        sourceUrl: item.sourceUrl,
        publisher: item.publisher,
        titleOverride: item.title,
      });
      setSelectedInspection(inspection);
      toast.dismiss("inspect-skill");
      toast.success(`Security Score: ${inspection.securityScore}/100 [Trust: ${inspection.trustLevel}]`);
    } catch {
      toast.dismiss("inspect-skill");
      toast.error("Failed to inspect skill source.");
    } finally {
      setIsInspecting(false);
    }
  };

  const handleInstallInspectedSkill = async () => {
    if (!selectedInspection?.normalizedSkill) return;
    try {
      await internetSkillIngestion.approveAndInstallImportedSkill(selectedInspection.normalizedSkill);
      toast.success(`Skill '${selectedInspection.normalizedSkill.name}' installed into workspace!`);
      setSelectedInspection(null);
      setActiveTab("registry");
    } catch (err: unknown) {
      toast.error(`Installation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleToggleSkillState = async (skill: GovernedSkill) => {
    try {
      if (skill.status === "ACTIVE") {
        skillRegistry.disableSkill(skill.skillId);
        toast.info(`Skill '${skill.name}' disabled.`);
      } else {
        await skillRegistry.activateSkill(skill.skillId);
        toast.success(`Skill '${skill.name}' activated following sandbox verification.`);
      }
    } catch (err: unknown) {
      toast.error(`Action failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 flex flex-col bg-card/95 backdrop-blur-2xl border border-border/80 shadow-2xl rounded-2xl overflow-hidden font-sans">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-border/50 bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/30 text-primary">
                <Layers className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Skill Runtime & Capability Package Factory
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Governed engineering packages with 14 test classes, trust classification & dependency graphs.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              GOD MODE vNEXT
            </Badge>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 pt-3">
            {[
              { id: "create", label: "Create Custom Skill", icon: Plus },
              { id: "discover", label: "Discover & Ingest", icon: Globe },
              { id: "registry", label: `Active Registry (${skillsList.length})`, icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as never)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: CREATE CUSTOM SKILL */}
          {activeTab === "create" && (
            <div className="space-y-4">
              <form onSubmit={handleSynthesizeCustomSkill} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-mono font-bold text-foreground">Skill Name</label>
                    <input
                      type="text"
                      placeholder="e.g. GraphQL Query Depth & Complexity Auditor"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl bg-secondary/50 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-foreground">Engineering Domain</label>
                    <select
                      value={skillDomain}
                      onChange={(e) => setSkillDomain(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-secondary/50 border border-border/60 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Security">Security</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Data Quality">Data Quality</option>
                      <option value="Performance">Performance</option>
                      <option value="Compliance">Compliance</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-foreground">
                    Purpose & Inspection Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what this skill inspects, what rules it evaluates, and expected evidence..."
                    value={skillPurpose}
                    onChange={(e) => setSkillPurpose(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-secondary/50 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-foreground">Safety Restrictions</label>
                  <input
                    type="text"
                    value={restrictions}
                    onChange={(e) => setRestrictions(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-secondary/50 border border-border/60 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary text-[11px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Air-gapped 9-stage validation runs automatically in sandbox before staging.
                  </span>
                  <Button
                    type="submit"
                    disabled={isSynthesizing || !skillName.trim() || !skillPurpose.trim()}
                    className="text-xs font-mono font-bold gap-1.5 bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  >
                    <Sparkles className="size-3.5" />
                    <span>{isSynthesizing ? "Synthesizing..." : "Synthesize Skill Blueprint"}</span>
                  </Button>
                </div>
              </form>

              {/* Validation Stages Output */}
              {validationStages.length > 0 && (
                <div className="p-3.5 rounded-xl bg-background/50 border border-border/50 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-foreground">
                    9-Stage Sandbox Validation Results:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono">
                    {validationStages.map((stg) => (
                      <div
                        key={stg.stageNumber}
                        className={cn(
                          "p-2 rounded-lg border",
                          stg.status === "PASSED" && "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
                          stg.status === "FAILED" && "border-destructive/30 bg-destructive/5 text-destructive",
                          stg.status === "WARNING" && "border-amber-500/30 bg-amber-500/5 text-amber-300",
                        )}
                      >
                        <div className="font-bold flex items-center gap-1">
                          {stg.status === "PASSED" ? <Check className="size-3" /> : <AlertTriangle className="size-3" />}
                          <span>Stage {stg.stageNumber}: {stg.stageName}</span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-[9px] truncate">{stg.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DISCOVER & INGEST INTERNET SKILLS */}
          {activeTab === "discover" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search internet skills by capability (e.g. Terraform, GraphQL, Docker SBOM, Kafka)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-secondary/50 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              {selectedInspection && (
                <div className="p-4 rounded-xl border border-primary/40 bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground font-mono">
                        Source Security Review: {selectedInspection.sourceUrl}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-mono",
                            selectedInspection.trustLevel === "TRUSTED" && "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
                            selectedInspection.trustLevel === "VERIFIED" && "text-blue-400 border-blue-500/40 bg-blue-500/10",
                            selectedInspection.trustLevel === "COMMUNITY" && "text-amber-400 border-amber-500/40 bg-amber-500/10",
                          )}
                        >
                          Trust: {selectedInspection.trustLevel}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                          Score: {selectedInspection.securityScore}/100
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedInspection(null)}
                        className="h-8 text-xs font-mono"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={!selectedInspection.canProceedToReview}
                        onClick={handleInstallInspectedSkill}
                        className="h-8 text-xs font-mono font-bold bg-primary text-primary-foreground gap-1"
                      >
                        <Check className="size-3.5" />
                        <span>Approve & Install</span>
                      </Button>
                    </div>
                  </div>

                  {selectedInspection.detectedRisks.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-[11px] font-mono text-destructive space-y-1">
                      <span className="font-bold flex items-center gap-1">
                        <AlertTriangle className="size-3" />
                        <span>Risk Flags Detected:</span>
                      </span>
                      {selectedInspection.detectedRisks.map((r, idx) => (
                        <p key={idx}>• {r}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.map((item) => (
                  <div
                    key={item.suggestedSlug}
                    className="p-3.5 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-all flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-bold text-foreground text-xs">{item.title}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-mono uppercase",
                            item.trustLevel === "TRUSTED" && "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
                            item.trustLevel === "VERIFIED" && "text-blue-400 border-blue-500/40 bg-blue-500/10",
                            item.trustLevel === "COMMUNITY" && "text-amber-400 border-amber-500/40 bg-amber-500/10",
                          )}
                        >
                          {item.trustLevel}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-border/30">
                      <span className="text-muted-foreground">{item.publisher}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isInspecting}
                        onClick={() => handleInspectExternalSkill(item)}
                        className="h-7 text-[10px] font-mono gap-1 border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Shield className="size-2.5" />
                        <span>Inspect & Review</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVE REGISTRY & VERSIONING */}
          {activeTab === "registry" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-border/40">
                <span className="text-xs font-mono text-muted-foreground">
                  Total Installed Skills: <strong className="text-foreground">{skillsList.length}</strong>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Air-gapped sandbox verification enforced
                </span>
              </div>

              <div className="space-y-2.5">
                {skillsList.map((skill) => (
                  <div
                    key={skill.skillId}
                    className="p-3.5 rounded-xl border border-border/50 bg-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-xs">{skill.name}</span>
                        <Badge variant="outline" className="text-[9px] font-mono">
                          v{skill.version}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-mono uppercase",
                            skill.status === "ACTIVE" && "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
                            skill.status === "DRAFT" && "border-amber-500/40 text-amber-300 bg-amber-500/10",
                            skill.status === "DISABLED" && "border-zinc-500/40 text-zinc-400",
                          )}
                        >
                          {skill.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground max-w-xl line-clamp-1">
                        {skill.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/80">
                        <span>Domain: {skill.domain}</span>
                        <span>•</span>
                        <span>Source: {skill.provenance.sourceType}</span>
                        <span>•</span>
                        <span>Required Connectors: {skill.requiredConnectors.join(", ") || "None"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleSkillState(skill)}
                        className={cn(
                          "h-7 text-xs font-mono gap-1 font-bold",
                          skill.status === "ACTIVE"
                            ? "border-destructive/40 text-destructive hover:bg-destructive/10"
                            : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10",
                        )}
                      >
                        <Power className="size-3" />
                        <span>{skill.status === "ACTIVE" ? "Disable" : "Activate"}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
