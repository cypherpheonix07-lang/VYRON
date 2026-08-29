/**
 * STARK Apocalypse — Existential Risk & Skill Obsolescence
 * Extinction clock countdowns, skill half-life curves, and vulnerability indexes.
 */

export interface SkillObsolescenceMetric {
  skill_name: string;
  half_life_months: number;
  extinction_risk_percentage: number;
  replacement_technology: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class SkillObsolescenceMonitor {
  public static getObsolescenceMetrics(): SkillObsolescenceMetric[] {
    return [
      {
        skill_name: 'Manual Webpack Tuning & Bundling',
        half_life_months: 6,
        extinction_risk_percentage: 92,
        replacement_technology: 'Vite / Turbopack / Native Rust Bundlers',
        urgency: 'HIGH'
      },
      {
        skill_name: 'Traditional REST CRUD Boilerplate',
        half_life_months: 12,
        extinction_risk_percentage: 78,
        replacement_technology: 'tRPC / Type-Safe Server Functions & GraphQL Mesh',
        urgency: 'HIGH'
      },
      {
        skill_name: 'Ad-Hoc Unstructured Prompting',
        half_life_months: 8,
        extinction_risk_percentage: 86,
        replacement_technology: 'Deterministic Symbolic Pipelines & Structured Schemas',
        urgency: 'HIGH'
      },
      {
        skill_name: 'Distributed Database Partitioning',
        half_life_months: 36,
        extinction_risk_percentage: 24,
        replacement_technology: 'Autonomous Consensus Storage Engines',
        urgency: 'LOW'
      }
    ];
  }
}
