import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { notificationGroups } from "@/lib/settings-data";

type Channel = "In-app" | "Email" | "Slack";

export function NotificationsTab() {
  const [state, setState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of notificationGroups) for (const i of g.items) initial[i.id] = i.on;
    return initial;
  });
  const [channels, setChannels] = useState<Record<string, Channel>>({
    analysis: "In-app",
    security: "Slack",
    reports: "Email",
    risk: "Email",
    system: "Email",
  });
  const [quiet, setQuiet] = useState({ from: "22:00", to: "07:30" });
  const [saved, setSaved] = useState(false);

  const persist = () => {
    setSaved(true);
    toast.success("Notification preferences saved");
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-4">
      <SectionCard
        title="Notification preferences"
        description="Choose what BRAHMA tells you about, and where it lands."
        action={
          saved ? (
            <span className="inline-flex items-center gap-1 text-xs text-[var(--success)]">
              <Check className="size-3.5" aria-hidden /> Saved
            </span>
          ) : null
        }
      >
        <div className="space-y-6">
          {notificationGroups.map((group, idx) => (
            <div key={group.id}>
              {idx > 0 ? <Separator className="mb-6" /> : null}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">{group.label}</h3>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Channel</Label>
                  <Select
                    value={channels[group.id] ?? "In-app"}
                    onValueChange={(v) => {
                      setChannels((c) => ({ ...c, [group.id]: v as Channel }));
                      persist();
                    }}
                  >
                    <SelectTrigger className="h-8 w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In-app">In-app</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Slack">Slack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
                  >
                    <Label htmlFor={item.id} className="text-sm font-normal">
                      {item.label}
                    </Label>
                    <Switch
                      id={item.id}
                      checked={state[item.id] ?? false}
                      onCheckedChange={(v) => {
                        setState((s) => ({ ...s, [item.id]: v }));
                        persist();
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Quiet hours" description="Non-critical alerts are held until quiet hours end.">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="q-from">From</Label>
            <Input
              id="q-from"
              type="time"
              value={quiet.from}
              onChange={(e) => setQuiet((q) => ({ ...q, from: e.target.value }))}
              className="w-32"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-to">To</Label>
            <Input
              id="q-to"
              type="time"
              value={quiet.to}
              onChange={(e) => setQuiet((q) => ({ ...q, to: e.target.value }))}
              className="w-32"
            />
          </div>
          <Button variant="outline" onClick={persist}>
            Save quiet hours
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Critical security alerts always bypass quiet hours.
        </p>
      </SectionCard>
    </div>
  );
}
