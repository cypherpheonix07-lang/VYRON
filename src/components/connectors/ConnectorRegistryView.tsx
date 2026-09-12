import React, { useState, useEffect } from "react";
import {
  Plug,
  Shield,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Clock,
  Activity,
  FileText,
} from "lucide-react";
import {
  connectorStore,
  ConnectorState,
  ConnectorTool,
  AuditLogEntry,
} from "@/state/connectors/connectorStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConnectorRegistryView({ className }: { className?: string }) {
  const [connectors, setConnectors] = useState<ConnectorState[]>(() =>
    connectorStore.getConnectors(),
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => connectorStore.getAuditLogs());
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>("kaggle");

  useEffect(() => {
    return connectorStore.subscribe((state) => {
      setConnectors(Object.values(state.connectors));
      setAuditLogs([...state.auditLogs]);
    });
  }, []);

  const selectedConnector = connectors.find((c) => c.id === selectedConnectorId) || connectors[0];

  const handleToggleConnector = (id: string, currentEnabled: boolean) => {
    connectorStore.toggleConnector(id, !currentEnabled);
  };

  const handleToggleToolAuth = (connectorId: string, toolName: string, currentAuth: boolean) => {
    connectorStore.setToolAuthorization(connectorId, toolName, !currentAuth);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Plug className="size-5 text-primary" />
            <span>MCP Connector Registry & Authorization Governance</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage Model Context Protocol (MCP) integrations with granular READ/WRITE and
            SAFE/HIGH-IMPACT authorization controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Connected Services:</span>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/20 text-primary">
            {connectors.filter((c) => c.isEnabled).length} / {connectors.length} ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Connector Cards */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Registered Connectors
          </h3>
          {connectors.map((c) => {
            const isSelected = c.id === selectedConnectorId;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedConnectorId(c.id)}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer space-y-2",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                    : "border-border/40 bg-card/50 hover:bg-card/80",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-secondary text-primary font-bold text-xs">
                      {c.type.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {c.tools.length} exposed MCP tools
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleConnector(c.id, c.isEnabled);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold border transition-colors",
                      c.isEnabled
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-zinc-800 text-zinc-500 border-zinc-700",
                    )}
                  >
                    {c.isEnabled ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">{c.description}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Tool Authorization Matrix & Audit Log */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tool Permissions */}
          {selectedConnector && (
            <div className="p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/30">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Shield className="size-4 text-primary" />
                    <span>Tool Authorizations: {selectedConnector.name}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Toggle fine-grained execution permission per tool
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border/20">
                {selectedConnector.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">{tool.name}</span>
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[10px] font-bold font-mono",
                            tool.access === "READ"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30",
                          )}
                        >
                          {tool.access}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[10px] font-bold font-mono",
                            tool.impact === "SAFE"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30",
                          )}
                        >
                          {tool.impact}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">{tool.description}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleToggleToolAuth(selectedConnector.id, tool.name, tool.isAuthorized)
                      }
                      className={cn(
                        "h-7 text-xs font-semibold shrink-0 gap-1",
                        tool.isAuthorized
                          ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                          : "border-zinc-700 text-zinc-500 hover:bg-zinc-800",
                      )}
                    >
                      {tool.isAuthorized ? (
                        <>
                          <Unlock className="size-3" /> Authorized
                        </>
                      ) : (
                        <>
                          <Lock className="size-3" /> Locked
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Logs */}
          <div className="p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Connector Audit Trail</h3>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {auditLogs.length} logged calls
              </span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No connector tool executions recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg border border-border/30 bg-background/40 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">{log.toolName}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {log.connectorId}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        Hash:{" "}
                        {log.verificationHash ? log.verificationHash.slice(0, 16) + "..." : "none"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {log.durationMs}ms
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded font-mono text-[10px] font-bold",
                          log.status === "SUCCESS"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30",
                        )}
                      >
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
