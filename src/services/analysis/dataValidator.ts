/**
 * PROJECT BRAHMA — STAGE 2 DATA VALIDATOR & CONTRACT CHECKER
 * Zero SQL. Pure functional contract assertions, null tolerances, and distribution sanity checks.
 */

export interface ValidationRule {
  column: string;
  type: "number" | "string" | "boolean" | "date";
  maxNullFraction: number;
  min?: number | undefined;
  max?: number | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  totalRecords: number;
  violationCount: number;
  conformityRate: number;
  columnMetrics: Record<
    string,
    { nullCount: number; invalidTypeCount: number; outOfRangeCount: number }
  >;
  summary: string;
}

export class DataValidator {
  public static validate(
    records: Array<Record<string, unknown>>,
    rules: ValidationRule[],
  ): ValidationResult {
    const totalRecords = records.length;
    if (totalRecords === 0) {
      return {
        isValid: true,
        totalRecords: 0,
        violationCount: 0,
        conformityRate: 1.0,
        columnMetrics: {},
        summary: "No records to validate.",
      };
    }

    let totalViolations = 0;
    const columnMetrics: ValidationResult["columnMetrics"] = {};

    for (const rule of rules) {
      const col = rule.column;
      columnMetrics[col] = { nullCount: 0, invalidTypeCount: 0, outOfRangeCount: 0 };

      for (const record of records) {
        const val = record[col];

        // Null check
        if (val === null || val === undefined || val === "") {
          columnMetrics[col].nullCount++;
          continue;
        }

        // Type check
        if (rule.type === "number") {
          const num = typeof val === "number" ? val : Number(val);
          if (isNaN(num)) {
            columnMetrics[col].invalidTypeCount++;
            totalViolations++;
          } else {
            if (rule.min !== undefined && num < rule.min) {
              columnMetrics[col].outOfRangeCount++;
              totalViolations++;
            }
            if (rule.max !== undefined && num > rule.max) {
              columnMetrics[col].outOfRangeCount++;
              totalViolations++;
            }
          }
        } else if (rule.type === "string") {
          if (typeof val !== "string") {
            columnMetrics[col].invalidTypeCount++;
            totalViolations++;
          }
        }
      }

      const nullFraction = columnMetrics[col].nullCount / totalRecords;
      if (nullFraction > rule.maxNullFraction) {
        totalViolations += columnMetrics[col].nullCount;
      }
    }

    const maxPossibleChecks = totalRecords * rules.length;
    const conformityRate =
      maxPossibleChecks > 0 ? Math.max(0, 1 - totalViolations / maxPossibleChecks) : 1.0;

    return {
      isValid: conformityRate >= 0.95,
      totalRecords,
      violationCount: totalViolations,
      conformityRate: Number(conformityRate.toFixed(4)),
      columnMetrics,
      summary: `Validated ${totalRecords} records against ${rules.length} contract rules. Conformity: ${(conformityRate * 100).toFixed(1)}%.`,
    };
  }
}
