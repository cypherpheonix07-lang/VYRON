/**
 * VYRON — P13: CODE INTELLIGENCE & AST SEMANTIC GRAPH
 * Multi-file abstract syntax tree semantic modeling, dependency graphing,
 * cyclomatic complexity metrics, and symbol reference analysis.
 * Strictly ZERO operational raw SQL.
 */

export interface AstSymbolNode {
  name: string;
  kind: "CLASS" | "FUNCTION" | "INTERFACE" | "TYPE" | "VARIABLE";
  filePath: string;
  startLine: number;
  endLine: number;
  cyclomaticComplexity: number;
  referencedSymbols: string[];
}

export interface FileAstRecord {
  filePath: string;
  totalLines: number;
  symbols: AstSymbolNode[];
  importedFiles: string[];
  exportedSymbols: string[];
}

export class AstSemanticGraphEngine {
  private static readonly FILE_STORE: Map<string, FileAstRecord> = new Map();

  public static registerFile(record: FileAstRecord): void {
    this.FILE_STORE.set(record.filePath, record);
  }

  public static getFile(filePath: string): FileAstRecord | undefined {
    return this.FILE_STORE.get(filePath);
  }

  public static getAllFiles(): FileAstRecord[] {
    return Array.from(this.FILE_STORE.values());
  }

  public static getHighComplexitySymbols(threshold: number = 15): AstSymbolNode[] {
    const highComplexity: AstSymbolNode[] = [];
    for (const file of this.FILE_STORE.values()) {
      for (const sym of file.symbols) {
        if (sym.cyclomaticComplexity >= threshold) {
          highComplexity.push(sym);
        }
      }
    }
    return highComplexity;
  }

  public static findDeadSymbols(): AstSymbolNode[] {
    const allReferences = new Set<string>();
    for (const file of this.FILE_STORE.values()) {
      for (const sym of file.symbols) {
        for (const ref of sym.referencedSymbols) {
          allReferences.add(ref);
        }
      }
    }

    const deadSymbols: AstSymbolNode[] = [];
    for (const file of this.FILE_STORE.values()) {
      for (const sym of file.symbols) {
        // If not exported and not referenced anywhere in recorded graph
        if (!file.exportedSymbols.includes(sym.name) && !allReferences.has(sym.name)) {
          deadSymbols.push(sym);
        }
      }
    }
    return deadSymbols;
  }

  public static calculateModuleHealthScore(filePath: string): { score: number; file?: FileAstRecord | undefined } {
    const file = this.FILE_STORE.get(filePath);
    if (!file) return { score: 1.0, file: undefined };

    let totalCcn = 0;
    for (const sym of file.symbols) {
      totalCcn += sym.cyclomaticComplexity;
    }
    const avgCcn = file.symbols.length > 0 ? totalCcn / file.symbols.length : 1;
    // Normalized score: 1.0 is lowest complexity, drops towards 0 as complexity rises > 20
    const score = Math.max(0, Math.min(1, 1 - (avgCcn - 1) / 20));

    return {
      score: Math.round(score * 100) / 100,
      file
    };
  }
}
