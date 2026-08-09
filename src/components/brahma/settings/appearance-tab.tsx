import { useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme, type Theme } from "@/lib/auth";
import { cn } from "@/lib/utils";

const themes: { id: Theme; label: string; hint: string }[] = [
  { id: "dark", label: "Dark", hint: "Default" },
  { id: "light", label: "Light", hint: "High ambient light" },
  { id: "system", label: "System", hint: "Follow OS setting" },
];

const accents = [
  { id: "cyan", label: "Cyan", color: "#22D3EE" },
  { id: "indigo", label: "Indigo", color: "#6366F1" },
  { id: "amber", label: "Amber", color: "#F59E0B" },
];

function MiniPreview({ scheme, accent }: { scheme: "dark" | "light"; accent: string }) {
  const dark = scheme === "dark";
  return (
    <div
      className="rounded-lg border p-2"
      style={{
        backgroundColor: dark ? "#0B1220" : "#F8FAFC",
        borderColor: dark ? "#1E293B" : "#E2E8F0",
      }}
    >
      <div className="flex gap-2">
        <div className="w-8 space-y-1">
          <div className="h-1.5 rounded" style={{ backgroundColor: accent }} />
          <div className="h-1.5 rounded" style={{ backgroundColor: dark ? "#1E293B" : "#E2E8F0" }} />
          <div className="h-1.5 rounded" style={{ backgroundColor: dark ? "#1E293B" : "#E2E8F0" }} />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="h-2 w-2/3 rounded" style={{ backgroundColor: dark ? "#334155" : "#CBD5E1" }} />
          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-6 rounded"
                style={{
                  backgroundColor: dark ? "#111C2E" : "#FFFFFF",
                  border: `1px solid ${dark ? "#1E293B" : "#E2E8F0"}`,
                }}
              />
            ))}
          </div>
          <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: accent, opacity: 0.7 }} />
        </div>
      </div>
    </div>
  );
}

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [accent, setAccent] = useState("cyan");
  const [density, setDensity] = useState<"Comfortable" | "Compact">("Comfortable");
  const [sidebar, setSidebar] = useState<"Expanded" | "Collapsed">("Expanded");

  const accentColor = accents.find((a) => a.id === accent)?.color ?? "#22D3EE";
  const previewScheme: "dark" | "light" = theme === "light" ? "light" : "dark";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <SectionCard title="Theme" description="Applies immediately across the workspace.">
          <div className="grid gap-3 sm:grid-cols-3">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTheme(t.id);
                  toast.success(`${t.label} theme applied`);
                }}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  theme === t.id ? "border-primary bg-primary/8" : "border-border hover:bg-accent/40",
                )}
              >
                <MiniPreview scheme={t.id === "light" ? "light" : "dark"} accent={accentColor} />
                <p className="mt-2 text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.hint}</p>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Accent" description="Used for primary actions, links and active states.">
          <div className="flex flex-wrap gap-3">
            {accents.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setAccent(a.id);
                  toast.success(`${a.label} accent selected`);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                  accent === a.id ? "border-primary bg-primary/8" : "border-border hover:bg-accent/40",
                )}
              >
                <span className="size-3.5 rounded-full" style={{ backgroundColor: a.color }} aria-hidden />
                {a.label}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Layout" description="Density and sidebar behaviour for this account.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Density</Label>
              <div className="flex gap-2">
                {(["Comfortable", "Compact"] as const).map((d) => (
                  <Button
                    key={d}
                    size="sm"
                    variant={density === d ? "default" : "outline"}
                    onClick={() => {
                      setDensity(d);
                      toast.success(`${d} density applied`);
                    }}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sidebar on load</Label>
              <div className="flex gap-2">
                {(["Expanded", "Collapsed"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={sidebar === s ? "default" : "outline"}
                    onClick={() => {
                      setSidebar(s);
                      toast.success(`Sidebar ${s.toLowerCase()} by default`);
                    }}
                  >
                    {s} by default
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setTheme("dark");
                setAccent("cyan");
                setDensity("Comfortable");
                setSidebar("Expanded");
                toast.success("Appearance reset to defaults");
              }}
            >
              Reset appearance
            </Button>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Live preview" description="Reflects your current selections.">
        <div className="space-y-3">
          <MiniPreview scheme={previewScheme} accent={accentColor} />
          <dl className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <dt>Theme</dt>
              <dd className="text-foreground">{theme}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Accent</dt>
              <dd className="text-foreground">{accent}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Density</dt>
              <dd className="text-foreground">{density}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Sidebar</dt>
              <dd className="text-foreground">{sidebar}</dd>
            </div>
          </dl>
        </div>
      </SectionCard>
    </div>
  );
}
