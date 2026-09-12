import { useState } from "react";
import { FolderGit2, Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { Project } from "@/hooks/useProjects";

interface ProjectScopeSelectorProps {
  selectedProjectId: string;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

export function ProjectScopeSelector({
  selectedProjectId,
  projects,
  onSelectProject,
}: ProjectScopeSelectorProps) {
  const [search, setSearch] = useState("");

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 border-border/80 bg-card/60 text-xs font-medium hover:bg-card"
        >
          <FolderGit2 className="size-3.5 text-primary" />
          <span className="truncate max-w-[150px]">
            {selectedProjectId === "all" ? "All Projects Scope" : selectedProject?.name || "Selected Project"}
          </span>
          <ChevronDown className="size-3 text-muted-foreground ml-auto opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 p-2 text-xs">
        <DropdownMenuLabel className="text-[10px] font-mono uppercase text-muted-foreground flex items-center justify-between">
          <span>Filter By Scope</span>
          <span className="font-mono">{projects.length} Total</span>
        </DropdownMenuLabel>

        {/* Search input inside dropdown */}
        <div className="relative my-1 px-1">
          <Search className="absolute left-2.5 top-2 size-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter projects..."
            className="h-7 text-xs pl-7"
          />
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-60 overflow-y-auto space-y-0.5">
          {/* Global Workspace Option */}
          <DropdownMenuItem
            onClick={() => onSelectProject("all")}
            className="flex items-center justify-between py-1.5 px-2 cursor-pointer text-xs rounded"
          >
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span className="font-medium text-foreground">All Workspace Projects</span>
            </div>
            {selectedProjectId === "all" && <Check className="size-3 text-primary" />}
          </DropdownMenuItem>

          {filteredProjects.map((p) => {
            const isSelected = selectedProjectId === p.id;
            return (
              <DropdownMenuItem
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className="flex items-center justify-between py-1.5 px-2 cursor-pointer text-xs rounded"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`size-2 rounded-full shrink-0 ${
                      p.health_score >= 85
                        ? "bg-emerald-400"
                        : p.health_score >= 70
                        ? "bg-amber-400"
                        : "bg-red-400"
                    }`}
                  />
                  <span className="font-medium text-foreground truncate">{p.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {p.health_score}
                  </span>
                  {isSelected && <Check className="size-3 text-primary" />}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
