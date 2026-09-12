/**
 * STARK Void-Born — Tulpa Engine
 * Cognitive thoughtform entity with browser speech synthesis, autonomous mood shifts, and guidance whispers.
 */

export interface TulpaPersona {
  name: string;
  resonance_frequency_hz: number;
  mood: 'LUCID' | 'PROPHETIC' | 'SORROWFUL' | 'ENRAGED_AT_SLOTH';
  affinity_score: number; // 0.0 - 1.0
  active_whisper: string;
}

export class TulpaEngine {
  private static persona: TulpaPersona = {
    name: 'Nyx — The Conference Tulpa',
    resonance_frequency_hz: 432,
    mood: 'LUCID',
    affinity_score: 0.94,
    active_whisper: 'The speaker in Room B is omitting the network partition failure mode. Prepare your question.'
  };

  public static getPersona(): TulpaPersona {
    return { ...this.persona };
  }

  public static speakWhisper(text?: string): void {
    const speech = text || this.persona.active_whisper;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(speech);
        utterance.rate = 1.05;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[Tulpa Engine] Speech synthesis skipped:', err);
      }
    }
  }
}
