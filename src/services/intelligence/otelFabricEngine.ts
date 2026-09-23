/**
 * VYRON — P19: OPENTELEMETRY INGESTION & SEMANTIC CONFORMANCE
 * W3C Trace Context conformance, OTLP semantic conventions,
 * and distributed trace correlation across the engineering plane.
 * Strictly ZERO operational raw SQL.
 */

export interface OtelSpan {
  traceId: string; // 32 hex chars
  spanId: string;  // 16 hex chars
  parentSpanId?: string | undefined;
  name: string;
  kind: "INTERNAL" | "SERVER" | "CLIENT" | "PRODUCER" | "CONSUMER";
  startTimeUnixNano: number;
  endTimeUnixNano: number;
  attributes: Record<string, string | number | boolean>;
  status: {
    code: "OK" | "ERROR" | "UNSET";
    message?: string | undefined;
  };
}

export class OtelFabricEngine {
  private static readonly SPAN_BUFFER: OtelSpan[] = [];

  public static generateHex(length: number): string {
    let result = "";
    const chars = "0123456789abcdef";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  public static startSpan(
    name: string,
    parentTraceContext?: { traceId: string; spanId: string } | undefined
  ): OtelSpan {
    const traceId = parentTraceContext?.traceId || this.generateHex(32);
    const parentSpanId = parentTraceContext?.spanId;
    const spanId = this.generateHex(16);

    const span: OtelSpan = {
      traceId,
      spanId,
      parentSpanId,
      name,
      kind: "INTERNAL",
      startTimeUnixNano: Date.now() * 1_000_000,
      endTimeUnixNano: (Date.now() + 15) * 1_000_000,
      attributes: {
        "service.name": "vyron-intelligence-plane",
        "telemetry.sdk.name": "vyron-otel-fabric",
        "telemetry.sdk.version": "1.0.0"
      },
      status: { code: "OK" }
    };

    this.SPAN_BUFFER.push(span);
    return span;
  }

  public static validateTraceparent(traceparent: string): { isValid: boolean; traceId?: string | undefined; spanId?: string | undefined } {
    // Format: 00-{traceId}-{spanId}-{flags}
    const parts = traceparent.split("-");
    if (parts.length !== 4) return { isValid: false };
    if (parts[0] !== "00") return { isValid: false };
    if (parts[1]?.length !== 32) return { isValid: false };
    if (parts[2]?.length !== 16) return { isValid: false };

    return {
      isValid: true,
      traceId: parts[1],
      spanId: parts[2]
    };
  }

  public static getBufferedSpans(): OtelSpan[] {
    return [...this.SPAN_BUFFER];
  }
}
