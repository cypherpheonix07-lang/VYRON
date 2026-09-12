/**
 * STARK Inferno — The Seven Deadly Sins of Conference Cognition
 * Algorithmic detection of epistemic hubris, slothful decay, and hoarding sins.
 */

import { starkDB, type ConceptRecord, type ContradictionRecord } from '../kernel/db';

export interface EpistemicSin {
  sin_name: 'PRIDE' | 'SLOTH' | 'LUST' | 'GLUTTONY' | 'WRATH' | 'ENVY' | 'GREED';
  severity_level: number; // 0 - 10
  manifestation: string;
  penance_remedy: string;
}

export class SevenDeadlySinsEngine {
  public static diagnoseSins(): EpistemicSin[] {
    const concepts = starkDB.select<ConceptRecord>('concepts');
    const contradictions = starkDB.select<ContradictionRecord>('contradictions', c => c.status === 'unresolved');
    const sins: EpistemicSin[] = [];

    // Check Sloth (high atrophy count)
    const atrophied = concepts.filter(c => (c.retention_score || 1.0) < 0.35);
    if (atrophied.length > 2) {
      sins.push({
        sin_name: 'SLOTH',
        severity_level: 8,
        manifestation: `${atrophied.length} concepts have collapsed into cognitive atrophy due to neglected spaced review.`,
        penance_remedy: 'Clear at least 5 daily SM-2 flashcards immediately.'
      });
    }

    // Check Gluttony (hoarding too many concepts)
    if (concepts.length > 120) {
      sins.push({
        sin_name: 'GLUTTONY',
        severity_level: 6,
        manifestation: `Hoarding ${concepts.length} concepts, approaching the 150 Dunbar cognitive threshold without synthesis.`,
        penance_remedy: 'Immolate or archive 3 redundant concepts.'
      });
    }

    // Check Wrath (ignoring contradictions)
    if (contradictions.length > 1) {
      sins.push({
        sin_name: 'WRATH',
        severity_level: 7,
        manifestation: `${contradictions.length} unresolved contradictions ignored out of stubborn adherence to prior dogmas.`,
        penance_remedy: 'Open the Contradiction Inspector and confirm evidence boundaries.'
      });
    }

    return sins;
  }
}
