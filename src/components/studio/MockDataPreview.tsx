import React, { useState } from "react";
import {
  Table as TableIcon,
  Search,
  Plus,
  RefreshCw,
  Download,
  Check,
  Edit2,
  Database,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { MockDataPayload } from "@/types/websiteStudio";

interface MockDataPreviewProps {
  mockData: MockDataPayload;
  onUpdateData?: ((updated: MockDataPayload) => void) | undefined;
  onRegenerateTable?: ((tableName: string) => void) | undefined;
}

export const MockDataPreview: React.FC<MockDataPreviewProps> = ({
  mockData,
  onUpdateData,
  onRegenerateTable,
}) => {
  const tableNames = Object.keys(mockData);
  const [activeTab, setActiveTab] = useState<string>(tableNames[0] || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingCell, setEditingCell] = useState<{ rowIdx: number; colKey: string } | null>(null);
  const [localData, setLocalData] = useState<MockDataPayload>(mockData);

  // Sync if prop updates
  React.useEffect(() => {
    setLocalData(mockData);
    if (!activeTab && tableNames.length > 0 && tableNames[0]) {
      setActiveTab(tableNames[0]);
    }
  }, [mockData, tableNames, activeTab]);

  const currentRows = (activeTab ? localData[activeTab] : undefined) || [];
  const firstRow = currentRows[0];
  const columns = firstRow ? Object.keys(firstRow) : [];

  const filteredRows = currentRows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCellChange = (rowIdx: number, colKey: string, newValue: string) => {
    const updatedRows = [...currentRows];
    let parsedVal: any = newValue;

    // Type coercion if numeric or boolean
    if (!isNaN(Number(newValue)) && newValue.trim() !== "") {
      parsedVal = Number(newValue);
    } else if (newValue.toLowerCase() === "true") {
      parsedVal = true;
    } else if (newValue.toLowerCase() === "false") {
      parsedVal = false;
    }

    const rowToUpdate = updatedRows[rowIdx];
    if (rowToUpdate) {
      updatedRows[rowIdx] = {
        ...rowToUpdate,
        [colKey]: parsedVal,
      };
    }

    const updatedAll = {
      ...localData,
      [activeTab]: updatedRows,
    };

    setLocalData(updatedAll);
    if (onUpdateData) {
      onUpdateData(updatedAll);
    }
    setEditingCell(null);
    toast.success("Cell updated successfully");
  };

  const handleDownloadTableJson = () => {
    const jsonStr = JSON.stringify(currentRows, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}_mock_data.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${activeTab}_mock_data.json`);
  };

  const totalRowCount = Object.values(localData).reduce((sum, r) => sum + r.length, 0);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              Relational Seed & Mock Data Engine
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                {totalRowCount} Total Rows
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Realistic database seed data maintaining foreign-key referential integrity across all tables.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search table rows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-background/50"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTableJson}
            className="text-xs h-8 border-border/60 hover:bg-card"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Table JSON
          </Button>
        </div>
      </div>

      {/* Tabs per Table */}
      {tableNames.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/40 border border-border/50">
            {tableNames.map((tbl) => (
              <TabsTrigger key={tbl} value={tbl} className="text-xs flex items-center gap-2">
                <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono">{tbl}</span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                  {(localData[tbl] || []).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="rounded-xl border border-border/60 overflow-hidden bg-card/30">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/60 text-muted-foreground text-[11px] font-semibold">
                      <th className="p-3 w-12 text-center">#</th>
                      {columns.map((col) => (
                        <th key={col} className="p-3 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span>{col}</span>
                            {col.endsWith("_id") && (
                              <Badge variant="outline" className="text-[9px] py-0 px-1 border-purple-500/40 text-purple-400">
                                FK
                              </Badge>
                            )}
                            {col === "id" && (
                              <Badge variant="outline" className="text-[9px] py-0 px-1 border-amber-500/40 text-amber-400">
                                PK
                              </Badge>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + 1} className="p-6 text-center text-muted-foreground">
                          No matching records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-card/60 transition-colors">
                          <td className="p-3 text-center text-muted-foreground font-mono text-[10px]">
                            {rIdx + 1}
                          </td>
                          {columns.map((col) => {
                            const val = row[col];
                            const isEditing =
                              editingCell?.rowIdx === rIdx && editingCell?.colKey === col;
                            const isFk = col.endsWith("_id");
                            const isPk = col === "id";

                            return (
                              <td
                                key={col}
                                onClick={() => setEditingCell({ rowIdx: rIdx, colKey: col })}
                                className="p-3 font-mono text-[11px] max-w-xs truncate cursor-pointer group"
                              >
                                {isEditing ? (
                                  <input
                                    type="text"
                                    defaultValue={String(val ?? "")}
                                    autoFocus
                                    onBlur={(e) => handleCellChange(rIdx, col, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleCellChange(rIdx, col, (e.target as HTMLInputElement).value);
                                      } else if (e.key === "Escape") {
                                        setEditingCell(null);
                                      }
                                    }}
                                    className="w-full bg-background border border-cyan-500 rounded px-1.5 py-0.5 text-xs text-foreground focus:outline-none"
                                  />
                                ) : (
                                  <div className="flex items-center justify-between gap-1">
                                    <span
                                      className={
                                        isPk
                                          ? "text-amber-400"
                                          : isFk
                                          ? "text-purple-400"
                                          : typeof val === "number"
                                          ? "text-emerald-400"
                                          : "text-slate-300"
                                      }
                                    >
                                      {typeof val === "object" ? JSON.stringify(val) : String(val ?? "")}
                                    </span>
                                    <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 text-muted-foreground shrink-0" />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
