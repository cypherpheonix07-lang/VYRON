import React from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  DollarSign,
  Activity,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DiscoveryFilters as IDiscoveryFilters,
  AITask,
  PricingType,
  VerificationLevel,
  ToolHealthStatus,
} from "@/types/discovery";

interface DiscoveryFiltersProps {
  filters: IDiscoveryFilters;
  onChange: (filters: IDiscoveryFilters) => void;
  tasks: AITask[];
  categories: string[];
}

export function DiscoveryFilters({ filters, onChange, tasks, categories }: DiscoveryFiltersProps) {
  const handleReset = () => {
    onChange({
      pricing: "all",
      verification: "all",
      healthStatus: "all",
      hasApi: false,
      sortBy: "relevance",
    });
  };

  const isFiltered =
    Boolean(filters.category && filters.category !== "All") ||
    (filters.pricing && filters.pricing !== "all") ||
    (filters.verification && filters.verification !== "all") ||
    (filters.healthStatus && filters.healthStatus !== "all") ||
    filters.hasApi ||
    (filters.sortBy && filters.sortBy !== "relevance");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card/40 border border-border/60 mb-6 backdrop-blur-sm text-xs">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex items-center gap-1.5 font-semibold text-muted-foreground mr-1">
          <SlidersHorizontal className="size-3.5 text-primary" /> Filters:
        </span>

        {/* Category Filter */}
        <Select
          value={filters.category || "All"}
          onValueChange={(val) => {
            const next = { ...filters };
            if (val === "All") {
              delete next.category;
            } else {
              next.category = val;
            }
            onChange(next);
          }}
        >
          <SelectTrigger className="h-8 text-xs bg-background/80 w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pricing Filter */}
        <Select
          value={filters.pricing || "all"}
          onValueChange={(val: PricingType | "all") => onChange({ ...filters, pricing: val })}
        >
          <SelectTrigger className="h-8 text-xs bg-background/80 w-[130px]">
            <SelectValue placeholder="Pricing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Pricing</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="freemium">Freemium</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="open_source">Open Source</SelectItem>
          </SelectContent>
        </Select>

        {/* Verification Filter */}
        <Select
          value={filters.verification || "all"}
          onValueChange={(val: VerificationLevel | "all") =>
            onChange({ ...filters, verification: val })
          }
        >
          <SelectTrigger className="h-8 text-xs bg-background/80 w-[140px]">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Verification</SelectItem>
            <SelectItem value="data">Data Verified</SelectItem>
            <SelectItem value="editor">Editor Choice</SelectItem>
            <SelectItem value="domain">Domain Checked</SelectItem>
            <SelectItem value="community">Community</SelectItem>
          </SelectContent>
        </Select>

        {/* Health Status Filter */}
        <Select
          value={filters.healthStatus || "all"}
          onValueChange={(val: ToolHealthStatus | "all") =>
            onChange({ ...filters, healthStatus: val })
          }
        >
          <SelectTrigger className="h-8 text-xs bg-background/80 w-[135px]">
            <SelectValue placeholder="Telemetry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Telemetry</SelectItem>
            <SelectItem value="healthy">Active / Healthy</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="warning">Warning / Throttle</SelectItem>
          </SelectContent>
        </Select>

        {/* API Availability Toggle */}
        <Button
          type="button"
          variant={filters.hasApi ? "secondary" : "outline"}
          size="sm"
          onClick={() => onChange({ ...filters, hasApi: !filters.hasApi })}
          className="h-8 px-2.5 text-xs gap-1.5"
        >
          <Terminal className="size-3" />
          <span>Has API</span>
        </Button>
      </div>

      {/* Sorting & Reset */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-muted-foreground text-[11px]">Sort:</span>
        <Select
          value={filters.sortBy || "relevance"}
          onValueChange={(val: NonNullable<IDiscoveryFilters["sortBy"]>) =>
            onChange({ ...filters, sortBy: val })
          }
        >
          <SelectTrigger className="h-8 text-xs bg-background/80 w-[160px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance (Hybrid)</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="popular">Most Saved</SelectItem>
            <SelectItem value="health">Telemetry Health</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
