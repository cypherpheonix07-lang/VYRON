import React, { useState, useMemo, type ReactNode } from "react";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchKey?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  bulkActions?: (selectedRows: T[]) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Filter records...",
  pageSize = 10,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no matching rows to display in this table.",
  onRowClick,
  bulkActions,
  className,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // Filter
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchKey) return data;
    return data.filter((item: T) => {
      const val = (item as Record<string, unknown>)[searchKey];
      return String(val ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a: T, b: T) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (sortOrder === "asc")
        return (aVal as string | number) > (bVal as string | number) ? 1 : -1;
      return (aVal as string | number) < (bVal as string | number) ? 1 : -1;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      const newSet = new Set<string | number>();
      paginatedData.forEach((row) => {
        if (row.id !== undefined) newSet.add(row.id);
      });
      setSelectedIds(newSet);
    }
  };

  const handleSelectRow = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const selectedRows = useMemo(() => {
    return data.filter((item) => item.id !== undefined && selectedIds.has(item.id));
  }, [data, selectedIds]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {searchKey && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-card/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {bulkActions && selectedRows.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selectedRows.length} selected</span>
            {bulkActions(selectedRows)}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold">
                {bulkActions && (
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 && selectedIds.size === paginatedData.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-border text-primary focus:ring-primary size-3.5"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      "p-3 select-none",
                      col.sortable && "cursor-pointer hover:text-foreground transition-colors",
                      col.className,
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable &&
                        sortKey === col.key &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/40 animate-pulse">
                    {bulkActions && (
                      <td className="p-3">
                        <div className="size-3.5 bg-muted rounded" />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="p-3">
                        <div className="h-4 bg-muted/70 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (bulkActions ? 1 : 0)}
                    className="p-8 text-center text-muted-foreground"
                  >
                    <p className="font-semibold text-xs text-foreground">{emptyTitle}</p>
                    <p className="text-[11px] mt-1">{emptyDescription}</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={row.id ?? idx}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-border/40 hover:bg-muted/30 transition-colors",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {bulkActions && (
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={row.id !== undefined && selectedIds.has(row.id)}
                          onChange={(e) =>
                            row.id !== undefined &&
                            handleSelectRow(row.id, e.nativeEvent as unknown as React.MouseEvent)
                          }
                          className="rounded border-border text-primary focus:ring-primary size-3.5"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn("p-3 text-foreground", col.className)}>
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[col.key] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-t border-border bg-card/20 text-xs text-muted-foreground">
            <span>
              Page {currentPage} of {totalPages} ({sortedData.length} records)
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                type="button"
                className="p-1 rounded-md hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                type="button"
                className="p-1 rounded-md hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
