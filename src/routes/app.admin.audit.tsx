import { createFileRoute } from "@tanstack/react-router";
import { Terminal, Download, Filter, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auditLog } from "@/lib/mock-data";

export const Route = createFileRoute("/app/admin/audit")({
  head: () => ({
    meta: [
      { title: "Audit Trail Ledger — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Platform administrative events, authorization records, and publish audits.",
      },
    ],
  }),
  component: AdminAuditPage,
});

const defaultPayloads: Record<string, string> = {
  "1": '{\n  "actor": "Priya Nair",\n  "action": "Generated software blueprint",\n  "target": "Smart Campus Portal",\n  "ip": "192.168.1.142",\n  "timestamp": "2026-08-09T10:14:00Z",\n  "details": {\n    "clarity_score": 92,\n    "risk_exposure": "low",\n    "modules": ["auth", "database", "analytics"]\n  }\n}',
  "2": '{\n  "actor": "Brahma AI",\n  "action": "Security scan cleared",\n  "target": "server/routes/api.py",\n  "ip": "127.0.0.1",\n  "timestamp": "2026-08-09T09:42:00Z",\n  "details": {\n    "remediations": ["CWE-89 SQLi"],\n    "code_health": 100\n  }\n}',
  "3": '{\n  "actor": "Puli Phanindhra",\n  "action": "Modified workspace files",\n  "target": "src/routes/login.tsx",\n  "ip": "192.168.1.18",\n  "timestamp": "2026-08-09T08:30:00Z",\n  "details": {\n    "lines_added": 12,\n    "lines_removed": 1\n  }\n}',
  "4": '{\n  "actor": "Priya Nair",\n  "action": "API Key created",\n  "target": "brh_live_••••••••",\n  "ip": "192.168.1.142",\n  "timestamp": "2026-08-09T06:12:00Z",\n  "details": {\n    "scope": ["read", "analyze"],\n    "expiry": "never"\n  }\n}',
};

function AdminAuditPage() {
  const [logs] = useState(auditLog);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = logs.filter((log) => {
    return (
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleExport = () => {
    toast.success("CSV export initiated", {
      description: "Platform audit ledger download will begin shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative min-w-0 flex-1 max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search audit trail by actor or action..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button size="sm" variant="outline" onClick={handleExport} className="text-xs h-9">
          <Download className="mr-1.5 size-4" /> Export CSV
        </Button>
      </div>

      <SectionCard
        title="Platform Audit Ledger"
        description="Immutable security log track records. Click row to inspect payloads."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Actor / User</TableHead>
              <TableHead>Event Action</TableHead>
              <TableHead>Resource Target</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => {
              const isExpanded = expandedId === log.id;
              const payload =
                defaultPayloads[log.id] || '{\n  "details": "No payload data available"\n}';
              return (
                <>
                  <TableRow
                    key={log.id}
                    className="cursor-pointer hover:bg-secondary/20"
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  >
                    <TableCell>
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                        <Terminal className="size-3 shrink-0" aria-hidden />
                        <span className="truncate">{log.actor}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {log.action}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {log.target}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      {log.time}
                    </TableCell>
                  </TableRow>

                  {/* Expanded Payload Inspector */}
                  {isExpanded && (
                    <TableRow key={`${log.id}-payload`}>
                      <TableCell colSpan={5} className="bg-zinc-950 p-4 border-y border-border/40">
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                            Raw JSON Action Event Payload
                          </span>
                          <pre className="font-mono text-[10px] text-indigo-400 bg-black/40 p-3 rounded-lg border border-border/20 leading-relaxed overflow-x-auto select-all max-h-48 scrollbar-thin">
                            {payload}
                          </pre>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
