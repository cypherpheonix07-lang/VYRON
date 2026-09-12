import React, { useState } from "react";
import {
  Database,
  Route,
  Terminal,
  ShieldCheck,
  HardDrive,
  Copy,
  Check,
  Key,
  Lock,
  ArrowRight,
  ExternalLink,
  Code2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { BackendBlueprint, SchemaTable, ApiRouteEndpoint } from "@/types/websiteStudio";

interface BackendBlueprintDiagramProps {
  blueprint: BackendBlueprint;
}

export const BackendBlueprintDiagram: React.FC<BackendBlueprintDiagramProps> = ({ blueprint }) => {
  const [copiedDdl, setCopiedDdl] = useState(false);
  const [selectedTable, setSelectedTable] = useState<SchemaTable | null>(
    blueprint.databaseSchema.tables[0] || null
  );

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(blueprint.sqlDdl);
    setCopiedDdl(true);
    toast.success("SQL DDL copied to clipboard!");
    setTimeout(() => setCopiedDdl(false), 2000);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">GET</Badge>;
      case "POST":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] font-mono">POST</Badge>;
      case "PUT":
      case "PATCH":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] font-mono">{method}</Badge>;
      case "DELETE":
        return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px] font-mono">DEL</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-mono">{method}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stat Strip */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              Backend Architecture & Storage Blueprint
              <Badge variant="outline" className="text-[10px] border-purple-500/40 text-purple-400 bg-purple-500/10">
                {blueprint.runtime}
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Declarative API contracts, PostgreSQL DDL schemas with RLS, and role access models.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {blueprint.apiRoutes.length} Endpoints
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {blueprint.databaseSchema.tables.length} Relational Tables
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList className="bg-muted/40 border border-border/50">
          <TabsTrigger value="routes" className="text-xs flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5" /> API Routes ({blueprint.apiRoutes.length})
          </TabsTrigger>
          <TabsTrigger value="erd" className="text-xs flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Schema & ERD ({blueprint.databaseSchema.tables.length})
          </TabsTrigger>
          <TabsTrigger value="ddl" className="text-xs flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> PostgreSQL DDL
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Auth & Environment
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: API Routes Table */}
        <TabsContent value="routes" className="space-y-4">
          <div className="rounded-xl border border-border/60 overflow-hidden bg-card/30">
            <div className="grid grid-cols-12 bg-muted/40 p-3 text-[11px] font-semibold text-muted-foreground border-b border-border/50">
              <span className="col-span-2">Method</span>
              <span className="col-span-4">Endpoint Path</span>
              <span className="col-span-4">Handler & Summary</span>
              <span className="col-span-2 text-right">Protection</span>
            </div>
            <div className="divide-y divide-border/40">
              {blueprint.apiRoutes.map((route, idx) => (
                <div key={idx} className="grid grid-cols-12 p-3 items-center text-xs hover:bg-card/50 transition-colors">
                  <div className="col-span-2">{getMethodBadge(route.method)}</div>
                  <div className="col-span-4 font-mono font-medium text-foreground text-xs">
                    {route.path}
                  </div>
                  <div className="col-span-4 space-y-0.5">
                    <p className="font-semibold text-foreground text-[11px]">{route.handlerName}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{route.summary}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    {route.authRequired ? (
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/10">
                        <Lock className="w-2.5 h-2.5 mr-1" /> Auth Required
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        Public
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Schema & ERD */}
        <TabsContent value="erd" className="space-y-6">
          {/* Relational Relationships Banner */}
          {blueprint.databaseSchema.relationships.length > 0 && (
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
              <span className="font-semibold text-foreground block mb-2">Relational Foreign Key Map:</span>
              <div className="flex flex-wrap gap-2">
                {blueprint.databaseSchema.relationships.map((rel, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/60 border border-border/60 font-mono text-[11px]">
                    <span className="text-cyan-400">{rel.fromTable}.{rel.fromCol}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-purple-400">{rel.toTable}.{rel.toCol}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blueprint.databaseSchema.tables.map((table) => {
              const isSelected = selectedTable?.name === table.name;
              return (
                <div
                  key={table.name}
                  onClick={() => setSelectedTable(table)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-purple-500/80 bg-purple-950/20 ring-1 ring-purple-500/40 shadow-lg"
                      : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm font-mono text-foreground flex items-center gap-2">
                      <Database className="w-4 h-4 text-purple-400" />
                      {table.name}
                    </h4>
                    <Badge variant="secondary" className="text-[10px]">
                      {table.columns.length} Cols
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{table.description}</p>

                  {/* Columns List */}
                  <div className="space-y-1 pt-2 border-t border-border/40 font-mono text-[11px]">
                    {table.columns.map((col, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between py-0.5">
                        <span className="flex items-center gap-1">
                          {col.isPrimary && <Key className="w-2.5 h-2.5 text-amber-400" />}
                          <span className={col.isPrimary ? "font-bold text-amber-300" : "text-foreground"}>
                            {col.name}
                          </span>
                        </span>
                        <span className="text-muted-foreground text-[10px]">{col.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 3: SQL DDL */}
        <TabsContent value="ddl" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">PostgreSQL 16 Schema Definition</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyDdl}
              className="text-xs h-7 border-border/60 hover:bg-card"
            >
              {copiedDdl ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy SQL DDL
                </>
              )}
            </Button>
          </div>

          <pre className="p-4 rounded-xl border border-border/60 bg-background/80 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {blueprint.sqlDdl}
          </pre>
        </TabsContent>

        {/* Tab 4: Security & Environment */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Auth & Storage Specs */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border/60 bg-card/40 space-y-3">
                <h4 className="font-semibold text-xs text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authentication Strategy
                </h4>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p><span className="text-foreground font-medium">Provider:</span> {blueprint.authModel.provider}</p>
                  <p><span className="text-foreground font-medium">Session Strategy:</span> {blueprint.authModel.sessionStrategy}</p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-foreground font-medium">Defined Roles:</span>
                    {blueprint.authModel.roles.map((r, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[10px]">{r}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-card/40 space-y-3">
                <h4 className="font-semibold text-xs text-foreground flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-cyan-400" /> Storage Architecture
                </h4>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p><span className="text-foreground font-medium">Max Upload Size:</span> {(blueprint.storagePlan.maxUploadSizeBytes / 1048576).toFixed(0)} MB</p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-foreground font-medium">Storage Buckets:</span>
                    {blueprint.storagePlan.buckets.map((b, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] font-mono border-cyan-500/30 text-cyan-400">{b}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Environment Variables Required */}
            <div className="p-4 rounded-xl border border-border/60 bg-card/40 space-y-3">
              <h4 className="font-semibold text-xs text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" /> Required Environment Variables
              </h4>
              <div className="divide-y divide-border/40">
                {blueprint.environmentVariables.map((env, idx) => (
                  <div key={idx} className="py-2 flex items-start justify-between text-xs">
                    <div>
                      <span className="font-mono font-medium text-foreground text-[11px] block">{env.key}</span>
                      <span className="text-[10px] text-muted-foreground">{env.description}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {env.secret && <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400">Secret</Badge>}
                      {env.required ? (
                        <Badge variant="secondary" className="text-[9px]">Required</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px]">Optional</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
