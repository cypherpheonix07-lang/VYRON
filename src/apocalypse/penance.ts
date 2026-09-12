/**
 * STARK Apocalypse — Penance Protocol
 * Agent personality degradation from cognitive neglect and restorative penance rituals.
 */

export interface PenanceStatus {
  is_penance_required: boolean;
  agent_mood: 'REVERENT' | 'DISAPPOINTED' | 'HOSTILE_CONTEMPT' | 'SILENT_PROTEST';
  sins_accumulated: string[];
  required_quiz_streak: number;
  current_quiz_streak: number;
}

export class PenanceProtocolManager {
  private static status: PenanceStatus = {
    is_penance_required: false,
    agent_mood: 'REVERENT',
    sins_accumulated: [],
    required_quiz_streak: 5,
    current_quiz_streak: 2
  };

  public static getStatus(): PenanceStatus {
    return { ...this.status };
  }

  public static recordSin(sinDescription: string): void {
    this.status.sins_accumulated.push(sinDescription);
    this.status.is_penance_required = true;
    this.status.agent_mood = 'HOSTILE_CONTEMPT';
  }

  public static submitPenanceQuiz(isPerfect: boolean): PenanceStatus {
    if (isPerfect) {
      this.status.current_quiz_streak++;
      if (this.status.current_quiz_streak >= this.status.required_quiz_streak) {
        this.status.is_penance_required = false;
        this.status.agent_mood = 'REVERENT';
        this.status.sins_accumulated = [];
      }
    } else {
      this.status.current_quiz_streak = 0;
    }
    return { ...this.status };
  }
}
