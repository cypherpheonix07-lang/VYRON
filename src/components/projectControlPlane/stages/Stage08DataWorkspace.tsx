/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Stage 08: Data Architecture & Governance Workspace
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import { Database, Plus, Sparkles, Shield, Key, FileCheck, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAiProject } from "@/state/aiProject/aiProjectStore";
import { DataEntity } from "@/types/aiProjectControlPlane";

export const Stage08DataWorkspace: React.FC = () => {
  const { state, executeStage, isExecuting, addManualDataEntity } = useAiProject();
  const data = state.data;

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [ownerModule, setOwnerModule] = useState("core");
  const [sensitivity, setSensitivity] = useState<DataEntity["sensitivity"]>("internal");
  const [retention, setRetention] = useState<DataEntity["retentionPeriod"]>("1y");

  const handleSynthesize = () => {
    executeStage("08_DATA");
  };

  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addManualDataEntity({
      name: name.trim(),
      description: desc.trim() || "Domain data entity.",
      ownerModule,
      fields: [
        { name: "id", type: "uuid", isPrimary: true, isNullable: false, description: "Primary unique identifier" },
        { name: "created_at", type: "timestamptz", isPrimary: false, isNullable: false, description: "Creation timestamp" },
        { name: "updated_at", type: "timestamptz", isPrimary: false, isNullable: false, description: "Last updated timestamp" },
      ],
      relationships: [],
      sensitivity,
      retentionPeriod: retention,
      auditRequired: sensitivity === "restricted_pii" || sensitivity === "confidential",
    });

    setName("");
    setDesc("");
    setShowAddForm(false);
  };

  const getSensitivityBadge = (sens: DataEntity["sensitivity"]) => {
    switch (sens) {
      case "restricted_pii":
        return "border-rose-500/40 text-rose-400 bg-rose-500/10";
      case "confidential":
        return "border-amber-500/40 text-amber-400 bg-amber-500/10";
      case "internal":
        return "border-blue-500/40 text-blue-400 bg-blue-500/10";
      default:
        return "border-emerald-500/40 text-emerald-400 bg-emerald-500/10";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-400" />
                Data Architecture & Governance Model
              </CardTitle>
              <CardDescription>
                Models persistent domain entities, field schemas, multi-tenant RLS isolation, retention windows, and privacy classifications.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs h-8 border-border/70 text-muted-foreground hover:text-foreground gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Entity
              </Button>
              <Button
                size="sm"
                onClick={handleSynthesize}
                disabled={isExecuting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                Synthesize Schemas
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Manual Entity Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateEntity}
              className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3"
            >
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Define Domain Data Entity
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Entity Name (e.g. AuditLogEntry)"
                  className="bg-background/60 border-border/80 text-xs h-8"
                  required
                />
                <select
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value as DataEntity["sensitivity"])}
                  className="bg-background/60 border border-border/80 rounded-md px-2 text-xs h-8 text-foreground"
                >
                  <option value="internal">Internal (Org Scoped)</option>
                  <option value="confidential">Confidential (Privileged)</option>
                  <option value="restricted_pii">Restricted PII / Health</option>
                  <option value="public">Public Domain</option>
                </select>
                <select
                  value={retention}
                  onChange={(e) => setRetention(e.target.value as DataEntity["retentionPeriod"])}
                  className="bg-background/60 border border-border/80 rounded-md px-2 text-xs h-8 text-foreground"
                >
                  <option value="1y">1 Year Retention</option>
                  <option value="7y">7 Years (Compliance)</option>
                  <option value="permanent">Permanent / Immutable</option>
                  <option value="90d">90 Days Ephemeral</option>
                </select>
              </div>
              <Textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Entity description and storage responsibilities..."
                className="bg-background/60 border-border/80 text-xs resize-none h-14"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs h-7"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-7">
                  Save Entity
                </Button>
              </div>
            </form>
          )}

          {/* Entities Grid */}
          {data.entities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.entities.map((entity) => (
                <div
                  key={entity.id}
                  className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-3 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-foreground">{entity.name}</span>
                        <Badge variant="outline" className={`text-[10px] font-mono uppercase ${getSensitivityBadge(entity.sensitivity)}`}>
                          {entity.sensitivity.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{entity.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0 font-mono">
                      {entity.retentionPeriod}
                    </Badge>
                  </div>

                  {/* Schema Fields Table */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Normalized Fields ({entity.fields.length}):
                    </span>
                    <div className="border border-border/50 rounded-lg overflow-hidden bg-background/50 text-[11px]">
                      {entity.fields.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-center justify-between px-2.5 py-1 border-b border-border/40 last:border-0 font-mono">
                          <div className="flex items-center gap-1.5">
                            {f.isPrimary && <Key className="h-2.5 w-2.5 text-amber-400" />}
                            <span className="text-foreground font-semibold">{f.name}</span>
                          </div>
                          <span className="text-muted-foreground text-[10px]">{f.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Governance Flags */}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-emerald-400" />
                      <span>RLS: Tenant Isolated</span>
                    </div>
                    {entity.auditRequired && (
                      <div className="flex items-center gap-1 text-amber-400">
                        <FileCheck className="h-3 w-3" />
                        <span>Audit Log Required</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Database className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-xs text-muted-foreground">
                No data entities configured yet. Synthesize relational schemas and RLS policies from project requirements.
              </p>
              <Button size="sm" onClick={handleSynthesize} disabled={isExecuting} className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Synthesize Schemas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
