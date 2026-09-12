/**
 * PROJECT BRAHMA — STAGE 5 ANOMALY DETECTOR
 * Zero SQL. Implements IQR (Interquartile Range) boundary evaluation and Isolation-style scoring.
 */

export interface AnomalyItem {
  recordIndex: number;
  entityId: string;
  field: string;
  value: number;
  expectedRange: [number, number];
  anomalyScore: number; // 0 to 100
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  reason: string;
}

export interface AnomalyDetectionResult {
  totalEvaluated: number;
  anomaliesDetected: number;
  anomalyRate: number;
  topAnomalies: AnomalyItem[];
  iqrBounds: Record<
    string,
    { q1: number; median: number; q3: number; lowerBound: number; upperBound: number }
  >;
}

export class AnomalyDetector {
  public static detectNumericAnomalies(
    records: Array<Record<string, unknown>>,
    numericFields: string[],
    entityIdField: string = "id",
  ): AnomalyDetectionResult {
    const totalEvaluated = records.length;
    const anomalies: AnomalyItem[] = [];
    const iqrBounds: AnomalyDetectionResult["iqrBounds"] = {};

    if (totalEvaluated === 0) {
      return {
        totalEvaluated: 0,
        anomaliesDetected: 0,
        anomalyRate: 0,
        topAnomalies: [],
        iqrBounds: {},
      };
    }

    for (const field of numericFields) {
      const values: number[] = [];
      for (const r of records) {
        const val = Number(r[field]);
        if (!isNaN(val)) values.push(val);
      }

      if (values.length < 4) continue;

      values.sort((a, b) => a - b);

      const q1Index = Math.floor(values.length * 0.25);
      const medianIndex = Math.floor(values.length * 0.5);
      const q3Index = Math.floor(values.length * 0.75);

      const q1 = values[q1Index] ?? 0;
      const median = values[medianIndex] ?? 0;
      const q3 = values[q3Index] ?? 0;
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      iqrBounds[field] = { q1, median, q3, lowerBound, upperBound };

      // Evaluate records
      records.forEach((record, idx) => {
        const val = Number(record[field]);
        if (isNaN(val)) return;

        if (val < lowerBound || val > upperBound) {
          const deviation = val > upperBound ? val - upperBound : lowerBound - val;
          const scale = iqr > 0 ? iqr : 1;
          const normalizedDeviation = deviation / scale;

          let severity: AnomalyItem["severity"] = "LOW";
          let score = Math.min(100, Math.round(50 + normalizedDeviation * 15));

          if (normalizedDeviation > 3.0) {
            severity = "CRITICAL";
            score = Math.min(100, Math.round(85 + normalizedDeviation * 3));
          } else if (normalizedDeviation > 1.5) {
            severity = "HIGH";
            score = Math.min(84, Math.round(70 + normalizedDeviation * 5));
          } else {
            severity = "MEDIUM";
          }

          anomalies.push({
            recordIndex: idx,
            entityId: String(record[entityIdField] || `REC-${idx}`),
            field,
            value: val,
            expectedRange: [lowerBound, upperBound],
            anomalyScore: score,
            severity,
            reason: `Value ${val} exceeds IQR threshold [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}] by ${normalizedDeviation.toFixed(1)}x`,
          });
        }
      });
    }

    // Sort descending by anomaly score
    anomalies.sort((a, b) => b.anomalyScore - a.anomalyScore);

    return {
      totalEvaluated,
      anomaliesDetected: anomalies.length,
      anomalyRate: Number(
        (anomalies.length / (totalEvaluated * numericFields.length || 1)).toFixed(4),
      ),
      topAnomalies: anomalies.slice(0, 25),
      iqrBounds,
    };
  }
}
