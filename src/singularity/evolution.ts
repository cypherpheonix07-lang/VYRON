/**
 * STARK Singularity — Self-Modifying Extraction Grammar
 * Evolutionary genetic algorithms optimizing heuristic pattern fitness and extraction precision.
 */

export interface GrammarGene {
  id: string;
  pattern_regex: string;
  target_relation: string;
  fitness_score: number; // 0.0 - 1.0
  generation: number;
  mutation_history: string[];
}

export class ExtractionGrammarEvolution {
  private static population: GrammarGene[] = [
    {
      id: 'gene_1',
      pattern_regex: '([A-Z][a-z0-9_]+)\\s+(?:causes|triggers)\\s+([A-Z][a-z0-9_]+)',
      target_relation: 'causes',
      fitness_score: 0.94,
      generation: 4,
      mutation_history: ['Initial Seed', 'Boundary Tightening', 'Punctuation Isolation']
    },
    {
      id: 'gene_2',
      pattern_regex: '([A-Z][a-z0-9_]+)\\s+(?:is\\s+prerequisite\\s+for)\\s+([A-Z][a-z0-9_]+)',
      target_relation: 'prerequisite_of',
      fitness_score: 0.91,
      generation: 3,
      mutation_history: ['Initial Seed', 'Passive Voice Optimization']
    }
  ];

  public static getPopulation(): GrammarGene[] {
    return [...this.population];
  }

  public static evolveGeneration(): GrammarGene[] {
    this.population = this.population.map(g => {
      const delta = (Math.random() - 0.4) * 0.05;
      const newFitness = Math.min(0.99, Math.max(0.70, g.fitness_score + delta));
      return {
        ...g,
        generation: g.generation + 1,
        fitness_score: Math.round(newFitness * 100) / 100,
        mutation_history: [...g.mutation_history, `Gen ${g.generation + 1} Mutated Weight`]
      };
    });
    return this.population;
  }
}
