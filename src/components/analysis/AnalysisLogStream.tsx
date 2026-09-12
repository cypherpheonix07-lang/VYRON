/**
 * PROJECT BRAHMA — LONG CONTEXT VIRTUALIZED LOG STREAM (PHASE G.1, G.2, G.3)
 * High-performance virtualized log console using react-window FixedSizeList.
 * 28px row height, 10,000+ entries capacity, debounced search, severity filters,
 * and auto-scroll with pause & "N new entries" indicator pill.
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import * as ReactWindowModule from "react-window";

// Interop for react-window v1/v2 export differences
const List = ((ReactWindowModule as any).List || (ReactWindowModule as any).FixedSizeList) as React.ComponentType<any>;
import { Search, ArrowDown, ShieldAlert, CheckCircle, Info, AlertTriangle } from "lucide-react";

export type LogSeverity = "info" | "success" | "warning" | "critical";

export interface LogEntry {
  id: string;
  timestamp: string;
  stageName: string;
  message: string;
  severity: LogSeverity;
}

export interface AnalysisLogStreamProps {
  logs?: LogEntry[];
  height?: number;
  className?: string;
}

const ROW_HEIGHT = 28;

export function AnalysisLogStream({
  logs = [],
  height = 420,
  className = "",
}: AnalysisLogStreamProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSeverities, setSelectedSeverities] = useState<Record<LogSeverity, boolean>>({
    info: true,
    success: true,
    warning: true,
    critical: true,
  });

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const listRef = useRef<any>(null);
  const prevLogsLengthRef = useRef(logs.length);

  // Debounce search query by 200ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter logs by search and severity
  const filteredLogs = useMemo(() => {
    return logs.filter((entry) => {
      if (!selectedSeverities[entry.severity]) return false;
      if (!debouncedSearch) return true;
      return (
        entry.message.toLowerCase().includes(debouncedSearch) ||
        entry.stageName.toLowerCase().includes(debouncedSearch) ||
        entry.timestamp.includes(debouncedSearch)
      );
    });
  }, [logs, debouncedSearch, selectedSeverities]);

  // Handle auto-scroll and unread pill
  useEffect(() => {
    const newLogsCount = logs.length - prevLogsLengthRef.current;
    prevLogsLengthRef.current = logs.length;

    if (newLogsCount > 0) {
      if (isAtBottom) {
        if (listRef.current && filteredLogs.length > 0) {
          listRef.current.scrollToItem(filteredLogs.length - 1, "end");
        }
      } else {
        setUnreadCount((prev) => prev + newLogsCount);
      }
    }
  }, [logs.length, isAtBottom, filteredLogs.length]);

  const scrollToBottom = () => {
    if (listRef.current && filteredLogs.length > 0) {
      listRef.current.scrollToItem(filteredLogs.length - 1, "end");
    }
    setIsAtBottom(true);
    setUnreadCount(0);
  };

  const handleScroll = ({
    scrollOffset,
    scrollUpdateWasRequested,
  }: {
    scrollOffset: number;
    scrollUpdateWasRequested: boolean;
  }) => {
    if (scrollUpdateWasRequested) return;

    const totalHeight = filteredLogs.length * ROW_HEIGHT;
    const distanceFromBottom = totalHeight - (scrollOffset + height);

    if (distanceFromBottom < 40) {
      setIsAtBottom(true);
      setUnreadCount(0);
    } else {
      setIsAtBottom(false);
    }
  };

  const toggleSeverity = (sev: LogSeverity) => {
    setSelectedSeverities((prev) => ({ ...prev, [sev]: !prev[sev] }));
  };

  // Helper to highlight matching text in yellow
  const renderHighlightedText = useCallback(
    (text: string) => {
      if (!debouncedSearch) return text;
      const parts = text.split(new RegExp(`(${debouncedSearch})`, "gi"));
      return parts.map((part, i) =>
        part.toLowerCase() === debouncedSearch ? (
          <mark key={i} className="bg-yellow-400/30 text-yellow-200 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      );
    },
    [debouncedSearch]
  );

  const getSeverityBadge = (sev: LogSeverity) => {
    switch (sev) {
      case "critical":
        return <span className="text-rose-400 font-bold">[CRIT]</span>;
      case "warning":
        return <span className="text-amber-400 font-medium">[WARN]</span>;
      case "success":
        return <span className="text-emerald-400 font-medium">[PASS]</span>;
      default:
        return <span className="text-zinc-500">[INFO]</span>;
    }
  };

  // Virtual Row Renderer
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const entry = filteredLogs[index];
    if (!entry) return null;

    return (
      <div
        style={style}
        className={`flex items-center gap-2 px-3 text-[11px] font-mono border-b border-zinc-900/60 hover:bg-zinc-900/60 transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${
          entry.severity === "critical"
            ? "bg-rose-950/20 text-rose-200"
            : entry.severity === "warning"
            ? "bg-amber-950/10 text-zinc-200"
            : "text-zinc-300"
        }`}
      >
        <span className="text-zinc-500 shrink-0 select-none">
          {entry.timestamp.slice(11, 19)}
        </span>
        <span className="shrink-0">{getSeverityBadge(entry.severity)}</span>
        <span className="text-cyan-400 shrink-0 font-medium select-none">
          [{entry.stageName}]
        </span>
        <span className="truncate">{renderHighlightedText(entry.message)}</span>
      </div>
    );
  };

  return (
    <div className={`relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden ${className}`}>
      {/* Top Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs">
        {/* Search input */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-zinc-950 border border-zinc-700/80 rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Severity filter toggles */}
        <div className="flex items-center gap-2">
          {(["info", "success", "warning", "critical"] as LogSeverity[]).map((sev) => (
            <label
              key={sev}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono cursor-pointer border select-none transition-colors ${
                selectedSeverities[sev]
                  ? sev === "critical"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : sev === "warning"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : sev === "success"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700"
                  : "bg-zinc-950 text-zinc-600 border-zinc-800 opacity-60"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedSeverities[sev]}
                onChange={() => toggleSeverity(sev)}
                className="sr-only"
              />
              <span className="capitalize">{sev}</span>
            </label>
          ))}
        </div>

        <div className="text-[10px] font-mono text-zinc-400 ml-auto">
          {filteredLogs.length} / {logs.length} entries
        </div>
      </div>

      {/* Virtualized Log Body */}
      <div className="relative flex-1 bg-zinc-950">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500 font-mono">
            No log entries match the active filters.
          </div>
        ) : (
          <List
            ref={listRef}
            height={height}
            itemCount={filteredLogs.length}
            itemSize={ROW_HEIGHT}
            width="100%"
            overscanCount={10}
            onScroll={handleScroll}
          >
            {Row}
          </List>
        )}

        {/* "N new entries" Pill when user has scrolled up */}
        {!isAtBottom && unreadCount > 0 && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500 text-zinc-950 font-bold text-xs shadow-lg hover:bg-cyan-400 transition-all animate-bounce cursor-pointer"
          >
            <ArrowDown className="size-3.5" />
            <span>{unreadCount} new entries</span>
          </button>
        )}
      </div>
    </div>
  );
}
