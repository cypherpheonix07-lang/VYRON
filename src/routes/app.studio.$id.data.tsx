import { createFileRoute } from "@tanstack/react-router";
import {
  Database,
  Plus,
  Trash,
  Play,
  Upload,
  Download,
  Share2,
  Table as TableIcon,
  Tag,
  Key,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { schemaTables } from "@/lib/mock-data";

export const Route = createFileRoute("/app/studio/$id/data")({
  head: () => ({
    meta: [
      { title: "Data Studio — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Visual database schema editor, seed data, and relation builders.",
      },
    ],
  }),
  component: DataStudioPage,
});

function DataStudioPage() {
  const { id } = Route.useParams();

  const [activeTableIndex, setActiveTableIndex] = useState(0);
  const activeTable = schemaTables[activeTableIndex] || schemaTables[0]!;

  const [schemaFields, setSchemaFields] = useState<typeof activeTable.fields>(activeTable.fields);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");

  interface SeedRow {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  // Mock seed data rows
  const [seedRows, setSeedRows] = useState<SeedRow[]>([
    { id: "1", name: "Priya Nair", email: "priya@brahma.dev", role: "Admin" },
    { id: "2", name: "Puli Phanindhra", email: "puli@brahma.dev", role: "Editor" },
    { id: "3", name: "Vishal Madhavan", email: "vishal@brahma.dev", role: "Editor" },
  ]);

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) {
      toast.error("Please enter a field name.");
      return;
    }
    const newField = { name: newFieldName, type: newFieldType, pk: false, rel: "" };
    setSchemaFields((prev) => [...prev, newField]);
    setNewFieldName("");
    toast.success(`Field '${newFieldName}' added to schema.`);
  };

  const handleAddRow = () => {
    const newRow = {
      id: String(seedRows.length + 1),
      name: "New User",
      email: "new@brahma.dev",
      role: "Editor",
    };
    setSeedRows((prev) => [...prev, newRow]);
    toast.success("New seed row appended.");
  };

  const handleDeleteRow = (rowId: string) => {
    setSeedRows((prev) => prev.filter((r) => r.id !== rowId));
    toast.info("Seed row deleted.");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Side: Tables List */}
        <div className="space-y-4">
          <SectionCard title="Data Tables" description="Schema catalogs.">
            <div className="space-y-1">
              {schemaTables.map((tbl, idx) => {
                const isActive = idx === activeTableIndex;
                return (
                  <button
                    key={tbl.name}
                    type="button"
                    onClick={() => {
                      setActiveTableIndex(idx);
                      setSchemaFields(tbl.fields);
                    }}
                    className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-xl border text-left transition-colors ${
                      isActive
                        ? "border-primary bg-primary/8 text-primary font-semibold"
                        : "border-border/60 hover:bg-secondary/40 hover:text-foreground text-muted-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <TableIcon className="size-3.5 shrink-0" /> {tbl.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {tbl.fields.length} columns
                    </span>
                  </button>
                );
              })}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-4 border-dashed border-border/80 hover:border-primary/40"
            >
              <Plus className="mr-1 size-3.5" /> Create New Table
            </Button>
          </SectionCard>
        </div>

        {/* Right Side: Editors */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="schema" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50">
              <TabsTrigger value="schema" className="text-xs">
                Schema Editor
              </TabsTrigger>
              <TabsTrigger value="seed" className="text-xs">
                Seed Data
              </TabsTrigger>
              <TabsTrigger value="mapping" className="text-xs">
                Business Mapping
              </TabsTrigger>
            </TabsList>

            {/* SCHEMA EDITOR TAB */}
            <TabsContent value="schema" className="space-y-4 outline-none">
              <SectionCard
                title={`Schema Definition: ${activeTable.name}`}
                description="Modify fields, data types, and structural relationships."
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Constraint</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schemaFields.map((field) => (
                      <TableRow key={field.name}>
                        <TableCell className="font-mono text-xs font-semibold">
                          {field.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-full text-[9px]">
                            {field.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {field.name === "id" ? (
                            <span className="flex items-center gap-1 text-primary">
                              <Key className="size-3" /> PRIMARY KEY
                            </span>
                          ) : (
                            field.rel || "None"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Add Field Form */}
                <form
                  onSubmit={handleAddField}
                  className="flex gap-2 items-end mt-4 pt-4 border-t border-border/60"
                >
                  <div className="grid gap-1.5 flex-1 max-w-xs">
                    <Label htmlFor="field-name" className="text-[10px]">
                      Field Name
                    </Label>
                    <Input
                      id="field-name"
                      placeholder="e.g. phone_number"
                      className="h-8 text-xs font-mono"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-1.5 w-36">
                    <Label htmlFor="field-type" className="text-[10px]">
                      Field Type
                    </Label>
                    <select
                      id="field-type"
                      className="h-8 text-xs border border-border bg-background rounded-lg px-2 text-foreground font-mono outline-none"
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value)}
                    >
                      {[
                        "text",
                        "number",
                        "boolean",
                        "date",
                        "email",
                        "url",
                        "image",
                        "file",
                        "relation",
                        "enum",
                        "json",
                      ].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 bg-primary hover:bg-primary/95 text-primary-foreground"
                  >
                    <Plus className="mr-1 size-3.5" /> Add Field
                  </Button>
                </form>
              </SectionCard>
            </TabsContent>

            {/* SEED DATA TAB */}
            <TabsContent value="seed" className="space-y-4 outline-none">
              <SectionCard
                title="Table Seed Data"
                description="Populate and verify database entry constraints prior to production builds."
                action={
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => toast.info("Imported seed CSV data.")}
                    >
                      <Upload className="mr-1 size-3" /> Import CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => toast.info("Exported seed data JSON.")}
                    >
                      <Download className="mr-1 size-3" /> Export CSV
                    </Button>
                  </div>
                }
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seedRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {row.id}
                        </TableCell>
                        <TableCell className="text-xs">{row.name}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {row.email}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[9px]">
                            {row.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-400"
                            onClick={() => handleDeleteRow(row.id)}
                          >
                            <Trash className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-dashed border-border/80"
                  onClick={handleAddRow}
                >
                  <Plus className="mr-1 size-3.5" /> Add Seed Row
                </Button>
              </SectionCard>
            </TabsContent>

            {/* BUSINESS MAPPING TAB */}
            <TabsContent value="mapping" className="space-y-4 outline-none">
              <SectionCard
                title="Business KPI Alignment"
                description="Link table structures directly to corporate KPIs and process logic mapping."
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-3 border border-border/60 p-4 rounded-xl surface">
                    <span className="grid size-8 place-items-center rounded bg-primary/10 text-primary shrink-0">
                      <ShieldCheck className="size-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">
                        Compliance Guard Mapping
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        Each modification to this table triggers an automatic audit trail logged
                        under events that feeds directly to compliance KPI scorecards.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border border-border/60 rounded-xl p-4 surface">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono font-semibold">
                        Assigned Process KPI
                      </span>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        Active User Count Metrics
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Calculates core workspace subscription plans usage logs.
                      </p>
                    </div>

                    <div className="border border-border/60 rounded-xl p-4 surface">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono font-semibold">
                        Validation Rules active
                      </span>
                      <ul className="text-xs space-y-1 mt-2 text-muted-foreground">
                        <li className="flex items-center gap-1.5">
                          <Check className="size-3.5 text-primary shrink-0" /> email matches RFC
                          5322
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="size-3.5 text-primary shrink-0" /> name contains no
                          numeric characters
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
