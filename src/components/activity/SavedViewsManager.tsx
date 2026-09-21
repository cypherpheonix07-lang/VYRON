import { useState, useEffect } from "react";
import { Bookmark, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { ActivityFilterState, SavedViewPreset } from "@/types/activity";

const STORAGE_KEY = "brahma_activity_saved_views";

const DEFAULT_PRESETS: SavedViewPreset[] = [
  {
    id: "preset-gates",
    name: "Release Gates & Overrides",
    filters: {
      eventType: "gate_evaluation",
      severity: "all",
      projectId: "all",
      timeRange: "all",
      mode: "stream",
      density: "comfortable",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "preset-criticals",
    name: "Critical & Security Alerts",
    filters: {
      eventType: "all",
      severity: "critical",
      projectId: "all",
      timeRange: "7d",
      mode: "stream",
      density: "compact",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "preset-pulse",
    name: "WorkPulse Health Matrix",
    filters: {
      eventType: "all",
      severity: "all",
      projectId: "all",
      timeRange: "24h",
      mode: "pulse",
      density: "comfortable",
    },
    createdAt: new Date().toISOString(),
  },
];

interface SavedViewsManagerProps {
  currentFilters: ActivityFilterState;
  onApplyPreset: (preset: SavedViewPreset) => void;
}

export function SavedViewsManager({ currentFilters, onApplyPreset }: SavedViewsManagerProps) {
  const [presets, setPresets] = useState<SavedViewPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPresets(JSON.parse(saved));
      } else {
        setPresets(DEFAULT_PRESETS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRESETS));
      }
    } catch {
      setPresets(DEFAULT_PRESETS);
    }
  }, []);

  const saveCurrentView = () => {
    if (!newPresetName.trim()) {
      toast.error("Please enter a name for the view preset.");
      return;
    }

    const { search, ...restFilters } = currentFilters;
    const newPreset: SavedViewPreset = {
      id: "view-" + Date.now(),
      name: newPresetName.trim(),
      filters: restFilters,
      createdAt: new Date().toISOString(),
    };

    const updated = [newPreset, ...presets];
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNewPresetName("");
    setIsAdding(false);
    toast.success(`Saved view "${newPreset.name}" successfully!`);
  };

  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success("View preset removed.");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Bookmark className="size-3.5 text-primary" />
          <span>Saved Views</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 text-xs">
        <DropdownMenuLabel className="text-[11px] font-mono uppercase text-muted-foreground">
          Workspace View Presets
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-52 overflow-y-auto space-y-1">
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => onApplyPreset(preset)}
              className="flex items-center justify-between py-1.5 px-2 cursor-pointer text-xs group"
            >
              <span className="font-medium text-foreground truncate">{preset.name}</span>
              <button
                onClick={(e) => deletePreset(preset.id, e)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 p-0.5 rounded transition-opacity"
              >
                <Trash2 className="size-3" />
              </button>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {isAdding ? (
          <div className="pt-2 space-y-2">
            <Input
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="e.g. Daily Standup Feed"
              className="h-7 text-xs"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveCurrentView()}
            />
            <div className="flex gap-1.5">
              <Button size="sm" onClick={saveCurrentView} className="h-7 flex-1 text-xs">
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full justify-start h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-3" />
            Save Current View
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
