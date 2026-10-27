/**
 * PROJECT BRAHMA — STEP 3: AUDIENCE & TARGET USER PERSONAS
 * Features TargetUserCombobox 5-State Machine & PersonaPriorityRanker
 *
 * STATE MACHINE:
 *   states: closed | open | filtering | creating | invalid
 *   transitions:
 *     focus/click -> open
 *     type -> filtering (debounce 150ms)
 *     Enter on unknown label -> creating (sanitize: strip <>&"'/\ + controls, <=40 chars, case-insensitive dedupe) -> closed
 *     invalid on >12 chips or empty label (aria-live announcement)
 *   Keyboard: ArrowUp/Down navigate, Enter select/create, Backspace remove last, Escape close
 *   Custom chips: violet ring + "custom" micro-badge
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Users,
  Search,
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Accessibility,
  Check,
  AlertCircle,
} from "lucide-react";
import type { WizardPayload, TargetUser, ProjectPersona } from "@/types/wizard";
import { usePersonas } from "@/services/catalogService";
import { sanitizePersonaLabel } from "@/lib/wizardSchemas";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface Step3Props {
  payload: WizardPayload;
  onChange: (patch: Partial<WizardPayload>) => void;
  errors: Record<string, string>;
}

type ComboboxState = "closed" | "open" | "filtering" | "creating" | "invalid";

export const Step3Audience: React.FC<Step3Props> = ({ payload, onChange, errors }) => {
  const { data: catalogPersonas = [] } = usePersonas();

  // State Machine variables
  const [comboboxState, setComboboxState] = useState<ComboboxState>("closed");
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [announcement, setAnnouncement] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter catalog personas based on input (excluding already selected)
  const availablePersonas = useMemo(() => {
    const q = inputValue.toLowerCase().trim();
    const selectedLabels = new Set(payload.target_users.map((u) => u.label.toLowerCase()));

    return catalogPersonas.filter((p: ProjectPersona) => {
      const matches =
        !q || p.label.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const notSelected = !selectedLabels.has(p.label.toLowerCase());
      return matches && notSelected;
    });
  }, [catalogPersonas, inputValue, payload.target_users]);

  // Is current typed query a new custom persona?
  const isCustomCandidate = useMemo(() => {
    const clean = sanitizePersonaLabel(inputValue);
    if (!clean) return false;
    const existsInCatalog = catalogPersonas.some(
      (p: ProjectPersona) => p.label.toLowerCase() === clean.toLowerCase(),
    );
    const existsInSelected = payload.target_users.some(
      (u) => u.label.toLowerCase() === clean.toLowerCase(),
    );
    return !existsInCatalog && !existsInSelected;
  }, [inputValue, catalogPersonas, payload.target_users]);

  // Debounced transition to 'filtering' state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setComboboxState(val.trim() ? "filtering" : "open");
      setHighlightedIndex(0);
    }, 150);
  };

  // Add target user persona (handles sanitize, dedupe, priority, and max 12 limit)
  const addPersona = (label: string, custom = false, slug?: string) => {
    const sanitized = sanitizePersonaLabel(label);
    if (!sanitized) {
      setComboboxState("invalid");
      setAnnouncement("Cannot add empty persona label.");
      return;
    }

    if (payload.target_users.length >= 12) {
      setComboboxState("invalid");
      setAnnouncement("Maximum 12 target personas limit reached.");
      return;
    }

    // Case-insensitive deduplication
    if (payload.target_users.some((u) => u.label.toLowerCase() === sanitized.toLowerCase())) {
      setComboboxState("invalid");
      setAnnouncement(`Persona "${sanitized}" is already attached.`);
      return;
    }

    setComboboxState("creating");
    const newUser: TargetUser = {
      label: sanitized,
      slug: slug || sanitized.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      custom,
      priority: payload.target_users.length + 1,
    };

    const updated = [...payload.target_users, newUser].map((u, i) => ({ ...u, priority: i + 1 }));
    onChange({ target_users: updated });

    setInputValue("");
    setComboboxState("closed");
    setAnnouncement(`Added persona: ${sanitized}. Total: ${updated.length}`);
  };

  const removePersona = (index: number) => {
    const removedLabel = payload.target_users[index]?.label;
    const updated = payload.target_users
      .filter((_, i) => i !== index)
      .map((u, i) => ({ ...u, priority: i + 1 }));

    onChange({ target_users: updated });
    setAnnouncement(`Removed persona: ${removedLabel}.`);
  };

  // 2.4 Reordering / Priority Ranker (Array order = priority persisted)
  const movePriority = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= payload.target_users.length) return;

    const copy = [...payload.target_users];
    const [moved] = copy.splice(fromIndex, 1);
    if (!moved) return;
    copy.splice(toIndex, 0, moved);

    const reprioritized = copy.map((u, i) => ({ ...u, priority: i + 1 }));
    onChange({ target_users: reprioritized });
    setAnnouncement(`Moved ${moved.label} to priority ${toIndex + 1}.`);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (comboboxState === "closed") setComboboxState("open");
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, availablePersonas.length + (isCustomCandidate ? 0 : -1)),
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < availablePersonas.length) {
        const selected = availablePersonas[highlightedIndex];
        if (selected) {
          addPersona(selected.label, false, selected.slug);
        }
      } else if (isCustomCandidate) {
        addPersona(inputValue, true);
      }
    } else if (e.key === "Backspace" && !inputValue && payload.target_users.length > 0) {
      removePersona(payload.target_users.length - 1);
    } else if (e.key === "Escape") {
      setComboboxState("closed");
      setHighlightedIndex(-1);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setComboboxState("closed");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-8">
      {/* Aria-Live Region for State Machine Feedback */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* TargetUserCombobox Shell */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="target-user-input" className="text-sm font-medium">
            Target User Personas (1 to 12) <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              {payload.target_users.length} / 12 personas
            </span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-mono uppercase ${
                comboboxState === "invalid"
                  ? "bg-destructive/20 text-destructive font-bold"
                  : comboboxState === "open" || comboboxState === "filtering"
                    ? "bg-primary/20 text-primary font-semibold"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              State: {comboboxState}
            </span>
          </div>
        </div>

        {/* Selected Persona Badges + Combobox Input */}
        <div
          className={`relative min-h-[46px] rounded-xl border p-2 transition-all ${
            comboboxState === "invalid" || errors["target_users"]
              ? "border-destructive ring-2 ring-destructive/20 bg-destructive/5"
              : comboboxState !== "closed"
                ? "border-primary ring-2 ring-primary/30 bg-card"
                : "border-border/70 bg-card/40 hover:border-border"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {payload.target_users.map((user, idx) => (
              <span
                key={user.label}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border transition-all ${
                  user.custom
                    ? "border-violet-500/60 bg-violet-950/40 text-violet-200 ring-2 ring-violet-500/40"
                    : "border-border/70 bg-secondary/80 text-secondary-foreground"
                }`}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black/40 text-[10px] font-mono">
                  {user.priority}
                </span>
                <span>{user.label}</span>
                {user.custom && (
                  <span className="rounded bg-violet-600/60 px-1 py-0.2 text-[9px] font-mono uppercase tracking-wider text-white">
                    custom
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePersona(idx)}
                  className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={`Remove persona ${user.label}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}

            {payload.target_users.length < 12 && (
              <div className="relative flex-1 min-w-[160px]">
                <input
                  ref={inputRef}
                  id="target-user-input"
                  type="text"
                  placeholder={
                    payload.target_users.length === 0
                      ? "Select or type new persona (e.g. Lead Architect)..."
                      : "Add another persona..."
                  }
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={() => setComboboxState("open")}
                  onKeyDown={handleKeyDown}
                  className="h-8 w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  role="combobox"
                  aria-expanded={comboboxState === "open" || comboboxState === "filtering"}
                  aria-haspopup="listbox"
                  aria-controls="personas-dropdown-list"
                />
              </div>
            )}
          </div>
        </div>

        {errors["target_users"] && (
          <p className="text-xs text-destructive font-medium" role="alert">
            {errors["target_users"]}
          </p>
        )}

        {/* Combobox Dropdown Listbox */}
        {(comboboxState === "open" || comboboxState === "filtering") && (
          <div
            ref={dropdownRef}
            id="personas-dropdown-list"
            role="listbox"
            className="absolute z-50 mt-1 w-full max-w-xl rounded-xl border border-border/80 bg-popover/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95"
          >
            <div className="px-2 py-1 text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              {inputValue ? "Matching Personas" : "Recommended Engineering Personas"}
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1">
              {availablePersonas.map((persona: ProjectPersona, idx: number) => {
                const isHighlighted = idx === highlightedIndex;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    role="option"
                    aria-selected={isHighlighted}
                    onClick={() => addPersona(persona.label, false, persona.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      isHighlighted
                        ? "bg-primary/20 text-primary font-medium"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="truncate">
                        <span className="font-medium text-foreground">{persona.label}</span>
                        <span className="ml-2 text-[10px] text-muted-foreground font-mono">
                          ({persona.category})
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Priority #{persona.default_priority}
                    </span>
                  </button>
                );
              })}

              {/* Custom Persona Option with Sanitation Preview */}
              {isCustomCandidate && (
                <button
                  type="button"
                  role="option"
                  aria-selected={highlightedIndex === availablePersonas.length}
                  onClick={() => addPersona(inputValue, true)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs border border-violet-500/40 bg-violet-950/20 text-violet-200 transition-colors ${
                    highlightedIndex === availablePersonas.length
                      ? "ring-2 ring-violet-500/60"
                      : "hover:bg-violet-950/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-violet-400" />
                    <span>
                      Create custom persona:{" "}
                      <strong>&quot;{sanitizePersonaLabel(inputValue)}&quot;</strong>
                    </span>
                  </div>
                  <span className="rounded bg-violet-600/80 px-1.5 py-0.5 text-[9px] font-mono uppercase text-white">
                    custom
                  </span>
                </button>
              )}

              {availablePersonas.length === 0 && !isCustomCandidate && (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  No matching personas found. Type a label and press Enter to create custom.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2.4 PersonaPriorityRanker */}
      {payload.target_users.length > 0 && (
        <div className="space-y-3 rounded-xl border border-border/60 bg-muted/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Persona Priority Ranking</h3>
              <p className="text-xs text-muted-foreground">
                Reorder selected target users to set requirement weight and persona-specific
                security constraints.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">Alt+Arrow to Reorder</span>
          </div>

          <div className="space-y-2">
            {payload.target_users.map((user, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === payload.target_users.length - 1;
              return (
                <div
                  key={user.label}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.altKey && e.key === "ArrowUp") {
                      e.preventDefault();
                      movePriority(idx, "up");
                    } else if (e.altKey && e.key === "ArrowDown") {
                      e.preventDefault();
                      movePriority(idx, "down");
                    }
                  }}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-card/70 px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-xs font-mono font-bold text-secondary-foreground">
                      #{user.priority}
                    </span>
                    <span className="font-semibold text-foreground">{user.label}</span>
                    {user.custom && (
                      <span className="rounded bg-violet-600/20 text-violet-300 border border-violet-500/40 px-1.5 py-0.5 text-[9px] font-mono uppercase">
                        custom
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => movePriority(idx, "up")}
                      disabled={isFirst}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label={`Move ${user.label} priority up`}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => movePriority(idx, "down")}
                      disabled={isLast}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label={`Move ${user.label} priority down`}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accessibility Switch */}
      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/40 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-secondary-foreground">
            <Accessibility className="h-5 w-5" />
          </div>
          <div>
            <Label htmlFor="accessibility-switch" className="text-sm font-semibold cursor-pointer">
              WCAG 2.1 AA / Section 508 Accessibility Gate
            </Label>
            <p className="text-xs text-muted-foreground">
              Enforces automated contrast, ARIA landmarks, screen reader audits, and keyboard
              navigation testing.
            </p>
          </div>
        </div>
        <Switch
          id="accessibility-switch"
          checked={payload.accessibility}
          onCheckedChange={(val) => onChange({ accessibility: val })}
        />
      </div>
    </div>
  );
};
