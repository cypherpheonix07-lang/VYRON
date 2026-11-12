import React from "react";
import { VYRON_FIVE_THEMES, type VyronTheme } from "@/styles/vyron-auth-tokens";
import { cn } from "@/lib/utils";

interface VyronPaletteGradientCardProps {
  themeId: VyronTheme;
  isActive?: boolean;
  onSelect?: ((themeId: VyronTheme) => void) | undefined;
  className?: string;
}

export function VyronPaletteGradientCard({
  themeId,
  isActive = false,
  onSelect,
  className,
}: VyronPaletteGradientCardProps) {
  const theme = VYRON_FIVE_THEMES[themeId] || VYRON_FIVE_THEMES.navy;

  return (
    <div
      role={onSelect ? "button" : "region"}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(themeId)}
      onKeyDown={(e) => {
        if (onSelect && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(themeId);
        }
      }}
      aria-label={`${theme.name} Palette Card`}
      className={cn(
        "group relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden select-none",
        isActive
          ? "border-primary ring-2 ring-primary/40 shadow-xl"
          : "border-border/60 hover:border-primary/50 shadow-md",
        onSelect && "cursor-pointer hover:-translate-y-0.5",
        className,
      )}
      style={{
        backgroundColor: theme.bg,
      }}
    >
      {/* 3-Panel Signature Composition */}
      <div className="grid grid-cols-12 h-28 sm:h-32 w-full p-2 gap-1.5">
        {/* Left Panel: Vertical Gradient from Accent to Dark Surface */}
        <div
          className="col-span-3 rounded-lg flex items-end p-2 transition-transform duration-300 group-hover:scale-[1.02]"
          style={{
            background: `linear-gradient(180deg, ${theme.primary} 0%, ${theme.surface} 100%)`,
          }}
          title="Gradient Accent to Surface"
        >
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/90 drop-shadow-sm">
            Gradient
          </span>
        </div>

        {/* Center Panel: Solid/Dominant Accent Color with Theme Name */}
        <div
          className="col-span-6 rounded-lg flex flex-col items-center justify-center p-3 text-center transition-transform duration-300 group-hover:scale-[1.02] shadow-inner"
          style={{
            backgroundColor: theme.primary,
            color: theme.primaryForeground,
          }}
        >
          <span className="text-xs sm:text-sm font-black tracking-tight uppercase font-mono">
            {theme.name}
          </span>
          <span className="text-[10px] font-semibold opacity-90 mt-0.5 line-clamp-1">
            {theme.id}
          </span>
        </div>

        {/* Right Panel: Reverse Gradient from Dark Surface to Accent */}
        <div
          className="col-span-3 rounded-lg flex items-end justify-end p-2 transition-transform duration-300 group-hover:scale-[1.02]"
          style={{
            background: `linear-gradient(180deg, ${theme.surface} 0%, ${theme.primary} 100%)`,
          }}
          title="Reverse Gradient Surface to Accent"
        >
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/90 drop-shadow-sm">
            Reverse
          </span>
        </div>
      </div>

      {/* Narrative Footer */}
      <div className="px-3.5 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground truncate font-sans max-w-[80%]">
          {theme.identity}
        </span>
        <span className="font-mono text-[10px] font-bold text-primary shrink-0">
          {theme.primary}
        </span>
      </div>
    </div>
  );
}

export function VyronFiveThemeShowcaseGrid({
  currentTheme,
  onSelectTheme,
}: {
  currentTheme?: VyronTheme;
  onSelectTheme?: (theme: VyronTheme) => void;
}) {
  const themeKeys: VyronTheme[] = [
    "navy",
    "royal-smoke",
    "obsidian-glow",
    "neon-dusk",
    "emerald-dark",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {themeKeys.map((key) => (
        <VyronPaletteGradientCard
          key={key}
          themeId={key}
          isActive={currentTheme === key}
          onSelect={onSelectTheme}
        />
      ))}
    </div>
  );
}
