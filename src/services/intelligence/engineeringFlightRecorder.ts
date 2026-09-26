/**
 * Engineering Flight Recorder — Continuous Causal Black-Box Recording for Engineering Operations
 */

export interface FlightRecordFrame {
  frameId: string;
  timestamp: string;
  eventType:
    | "AGENT_INTENT_FORMULATED"
    | "CODE_MODIFICATION_PROPOSED"
    | "POLICY_CHECK_EVALUATED"
    | "POSTCONDITION_VERIFIED"
    | "STATE_TRANSITION"
    | "EXTERNAL_API_MUTATION"
    | "FAILOVER_TRIGGERED"
    | "ROLLBACK_EXECUTED";
  actorId: string;
  actorType: "HUMAN_USER" | "AUTONOMOUS_AGENT" | "SRE_AUTOMATION" | "POLICY_GATE";
  context: {
    projectId?: string;
    branch?: string;
    phaseId?: string;
    environment?: string;
  };
  payload: Record<string, unknown>;
  evidenceToken: string;
  parentFrameId?: string;
}

class EngineeringFlightRecorderEngine {
  private blackBoxBuffer: FlightRecordFrame[] = [];
  private readonly maxFrames = 5000;

  public record(
    eventType: FlightRecordFrame["eventType"],
    actorType: FlightRecordFrame["actorType"],
    actorId: string,
    payload: Record<string, unknown>,
    context: FlightRecordFrame["context"] = {}
  ): FlightRecordFrame {
    const parent = this.blackBoxBuffer[this.blackBoxBuffer.length - 1];
    const frame: FlightRecordFrame = {
      frameId: `flt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      eventType,
      actorId,
      actorType,
      context,
      payload,
      evidenceToken: `ev-flt-${Date.now()}`,
      parentFrameId: parent?.frameId,
    };

    this.blackBoxBuffer.push(frame);
    if (this.blackBoxBuffer.length > this.maxFrames) {
      this.blackBoxBuffer.shift();
    }

    return frame;
  }

  public getFlightTrail(projectId?: string, limit = 100): FlightRecordFrame[] {
    if (!projectId) return this.blackBoxBuffer.slice(-limit);
    return this.blackBoxBuffer
      .filter((f) => f.context.projectId === projectId)
      .slice(-limit);
  }

  public exportBlackBoxDump(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalFrames: this.blackBoxBuffer.length,
        frames: this.blackBoxBuffer,
      },
      null,
      2
    );
  }
}

export const engineeringFlightRecorder = new EngineeringFlightRecorderEngine();
