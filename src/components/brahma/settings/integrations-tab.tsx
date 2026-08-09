import { CheckCircle2, Eye, EyeOff, Loader2, Plug, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brahma/primitives";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  integrations as seedIntegrations,
  webhookDeliveries,
  webhookEvents,
  type Integration,
  type IntegrationStatus,
} from "@/lib/settings-data";

const dotClass: Record<IntegrationStatus, string> = {
  Connected: "bg-[var(--success)]",
  "Not connected": "bg-muted-foreground/60",
  Error: "bg-[var(--critical)]",
};

function StatusPill({ status }: { status: IntegrationStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn("size-2 rounded-full", dotClass[status])} aria-hidden />
      {status}
    </span>
  );
}

export function IntegrationCard({
  integration,
  onManage,
  onConnect,
}: {
  integration: Integration;
  onManage: () => void;
  onConnect: () => void;
}) {
  return (
    <Card className="surface gap-0 py-4">
      <CardContent className="px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/12 text-xs font-semibold uppercase text-primary">
              {integration.name.slice(0, 2)}
            </span>
            <div>
              <p className="text-sm font-medium">{integration.name}</p>
              <p className="text-xs text-muted-foreground">{integration.category}</p>
            </div>
          </div>
          {integration.status === "Error" ? (
            <Badge variant="outline" className="rounded-full border-[var(--critical)]/40 bg-[var(--critical)]/12 text-[var(--critical)]">
              Action needed
            </Badge>
          ) : null}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <StatusPill status={integration.status} />
            <p className="mt-1 truncate text-xs text-muted-foreground">Last sync: {integration.lastSync}</p>
          </div>
          {integration.status === "Not connected" ? (
            <Button size="sm" onClick={onConnect}>
              Connect
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onManage}>
              Manage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WebhookPanel() {
  const [url, setUrl] = useState("https://ops.brahma.dev/hooks/analysis");
  const [selected, setSelected] = useState<string[]>(["analysis.completed", "security.alert"]);
  const [reveal, setReveal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wh-url">Endpoint URL</Label>
        <Input id="wh-url" value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Events</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {webhookEvents.map((e) => (
            <label key={e.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              <Checkbox
                checked={selected.includes(e.id)}
                onCheckedChange={(v) =>
                  setSelected((prev) => (v ? [...prev, e.id] : prev.filter((x) => x !== e.id)))
                }
              />
              <span className="font-mono text-xs">{e.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Signing secret</Label>
        <div className="flex items-center gap-2">
          <Input readOnly value={reveal ? "whsec_9fa2c81be74d3b7e2a01c5" : "whsec_••••••••b7e2"} className="font-mono" />
          <Button variant="outline" size="icon" onClick={() => setReveal((r) => !r)} aria-label="Toggle secret visibility">
            {reveal ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </Button>
        </div>
      </div>
      <div>
        <Label className="mb-2 block">Delivery log</Label>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Retry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhookDeliveries.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{d.time}</TableCell>
                  <TableCell className="font-mono text-xs">{d.event}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full",
                        d.status === 200
                          ? "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]"
                          : "border-[var(--critical)]/40 bg-[var(--critical)]/12 text-[var(--critical)]",
                      )}
                    >
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={d.status === 200}
                      onClick={() => toast.success(`Redelivered ${d.event}`)}
                    >
                      <RefreshCw className="size-3.5" aria-hidden /> Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export function IntegrationsTab() {
  const [items, setItems] = useState<Integration[]>(seedIntegrations);
  const [active, setActive] = useState<Integration | null>(null);
  const [testing, setTesting] = useState(false);
  const [disconnecting, setDisconnecting] = useState<Integration | null>(null);
  const [env, setEnv] = useState("Production");

  return (
    <div className="space-y-4">
      <SectionCard
        title="Connected services"
        description="Integrations feed analysis inputs and alert delivery. Keys are stored encrypted."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((i) => (
            <IntegrationCard
              key={i.id}
              integration={i}
              onManage={() => setActive(i)}
              onConnect={() => {
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === i.id ? { ...x, status: "Connected", lastSync: "Just now" } : x,
                  ),
                );
                toast.success(`${i.name} connected`);
              }}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Webhooks" description="Push BRAHMA events into your own operations tooling.">
        <WebhookPanel />
      </SectionCard>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{active?.name ?? "Integration"}</SheetTitle>
            <SheetDescription>{active?.category ?? ""} integration settings</SheetDescription>
          </SheetHeader>
          {active ? (
            <div className="space-y-5 px-4 pb-6">
              <div className="space-y-2">
                <Label>Account</Label>
                <Input readOnly value={active.account} />
              </div>
              <div className="space-y-2">
                <Label>API key / token</Label>
                <Input readOnly value={active.keyMask} className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <Select value={env} onValueChange={setEnv}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Staging">Staging</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scopes and permissions</Label>
                <ul className="space-y-1">
                  {active.scopes.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-4 text-[var(--success)]" aria-hidden />
                      <span className="font-mono text-xs">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {active.status === "Error" ? (
                <div className="flex items-start gap-2 rounded-lg border border-[var(--critical)]/30 bg-[var(--critical)]/8 p-3 text-sm">
                  <XCircle className="mt-0.5 size-4 shrink-0 text-[var(--critical)]" aria-hidden />
                  <p className="text-muted-foreground">
                    Last request returned 403 invalid_api_key. Re-authorize the account to resume syncing.
                  </p>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={testing}
                  onClick={() => {
                    setTesting(true);
                    setTimeout(() => {
                      setTesting(false);
                      if (active.status === "Error") toast.error(`${active.name}: 403 invalid_api_key`);
                      else toast.success(`${active.name} connection healthy`);
                    }, 1100);
                  }}
                >
                  {testing ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plug className="size-4" aria-hidden />}
                  Test connection
                </Button>
                <Button variant="outline" className="text-[var(--critical)]" onClick={() => setDisconnecting(active)}>
                  Disconnect
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!disconnecting} onOpenChange={(o) => !o && setDisconnecting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--critical)]">Disconnect integration?</AlertDialogTitle>
            <AlertDialogDescription>
              {disconnecting
                ? `Analyses that depend on ${disconnecting.name} will fail until it is reconnected.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[var(--critical)] text-white hover:bg-[var(--critical)]/90"
              onClick={() => {
                if (!disconnecting) return;
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === disconnecting.id ? { ...x, status: "Not connected", lastSync: "Never" } : x,
                  ),
                );
                toast.success(`${disconnecting.name} disconnected`);
                setDisconnecting(null);
                setActive(null);
              }}
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
