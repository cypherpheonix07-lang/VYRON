/**
 * STARK Apocalypse — Knowledge Gladiator Arena
 * Real-time adversarial concept duels and rapid-fire rebuttal showdowns.
 */

export interface GladiatorDuelRound {
  round_number: number;
  concept_name: string;
  opponent_claim: string;
  rebuttal_options: Array<{ id: string; text: string; score_awarded: number; is_knockout: boolean }>;
  time_limit_seconds: number;
}

export class KnowledgeGladiatorArena {
  public static initDuel(opponentName = 'Gladiator Claude-Prime'): GladiatorDuelRound[] {
    return [
      {
        round_number: 1,
        concept_name: 'CRDT vs OT',
        opponent_claim: 'Operational Transformation is strictly superior to CRDTs because it requires zero metadata overhead on wire.',
        time_limit_seconds: 20,
        rebuttal_options: [
          {
            id: 'r_1',
            text: 'OT requires a centralized sequencing server, introducing a single point of failure and preventing true offline peer-to-peer convergence.',
            score_awarded: 100,
            is_knockout: true
          },
          {
            id: 'r_2',
            text: 'CRDTs have cute names so everyone likes them better.',
            score_awarded: 0,
            is_knockout: false
          }
        ]
      }
    ];
  }
}
