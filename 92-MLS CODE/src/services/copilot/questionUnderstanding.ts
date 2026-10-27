/**
 * VYRON — QUESTION UNDERSTANDING & INTENT CAPSULE ENGINE (GOD MODE Ω×)
 * Implements 16 Canonical Question Types, Multi-Label Classification,
 * and Comprehensive Intent Capsule Extraction:
 * Goal, Entities, Constraints, Scope, Desired Output, Urgency, Risk,
 * Missing Inputs, Lifecycle Stage, Ambiguity Scoring, and Clarification Protocol.
 *
 * Core Laws:
 * VALIDATION > GENERATION
 * OBSERVATION > ASSUMPTION
 * UNKNOWN > FABRICATION
 * Strictly ZERO SQL.
 */

export type QuestionType =
  | "FACT"
  | "EXPLANATION"
  | "DEBUG"
  | "DESIGN"
  | "IMPLEMENT"
  | "TRANSFORM"
  | "ANALYSIS"
  | "COMPARE"
  | "PLAN"
  | "CALCULATE"
  | "VISUAL"
  | "RESEARCH"
  | "ACTION"
  | "REVIEW"
  | "CONTINUE"
  | "UNKNOWN";

export type EngineeringLifecycleStage =
  | "REQUIREMENTS"
  | "ARCHITECTURE"
  | "DATA_CONTRACTS"
  | "IMPLEMENTATION"
  | "TESTING"
  | "SECURITY_AUDIT"
  | "RELEASE"
  | "DEPLOYMENT"
  | "OBSERVABILITY"
  | "INCIDENT_TRIAGE"
  | "GOVERNANCE"
  | "EVOLUTION";

export type QuestionUrgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type QuestionRisk = "LOW" | "MEDIUM" | "HIGH" | "SEVERE";
export type TargetScope = "TURN" | "FILE" | "REPOSITORY" | "PROJECT" | "TENANT" | "GLOBAL";

export interface ExtractedEntity {
  name: string;
  category: "SERVICE" | "FILE" | "DATABASE" | "CONNECTOR" | "METRIC" | "STAGE" | "USER" | "TOOL";
  confidence: number;
}

export interface IntentCapsule {
  id: string;
  rawQuery: string;
  normalizedQuery: string;
  timestamp: string;
  primaryQuestionType: QuestionType;
  secondaryQuestionTypes: QuestionType[];
  confidenceScores: Record<QuestionType, number>;
  goal: string;
  entities: ExtractedEntity[];
  constraints: string[];
  scope: TargetScope;
  desiredOutput:
    | "DIRECT_ANSWER"
    | "EXPLANATION"
    | "PLAN"
    | "CODE_CHANGE"
    | "TABLE"
    | "CALCULATION"
    | "VISUAL_ANALYSIS"
    | "RESEARCH_DIGEST"
    | "INCIDENT_REPORT"
    | "LIFECYCLE_CHECKPOINT";
  urgency: QuestionUrgency;
  risk: QuestionRisk;
  missingInputs: string[];
  lifecycleStage: EngineeringLifecycleStage;
  ambiguityScore: number;
  alternateInterpretations: string[];
  candidateAction: string;
  clarificationNeed: boolean;
  clarificationPrompt?: string | undefined;
  isConsequential: boolean;
}

export class QuestionUnderstandingEngine {
  private static instance: QuestionUnderstandingEngine | null = null;

  public static getInstance(): QuestionUnderstandingEngine {
    if (!QuestionUnderstandingEngine.instance) {
      QuestionUnderstandingEngine.instance = new QuestionUnderstandingEngine();
    }
    return QuestionUnderstandingEngine.instance;
  }

  /**
   * Classifies user input into 16 canonical question types with multi-label scoring.
   */
  public classifyQuestion(query: string): {
    primaryType: QuestionType;
    secondaryTypes: QuestionType[];
    confidenceScores: Record<QuestionType, number>;
  } {
    const text = query.trim().toLowerCase();
    const scores: Record<QuestionType, number> = {
      FACT: 0,
      EXPLANATION: 0,
      DEBUG: 0,
      DESIGN: 0,
      IMPLEMENT: 0,
      TRANSFORM: 0,
      ANALYSIS: 0,
      COMPARE: 0,
      PLAN: 0,
      CALCULATE: 0,
      VISUAL: 0,
      RESEARCH: 0,
      ACTION: 0,
      REVIEW: 0,
      CONTINUE: 0,
      UNKNOWN: 0.1,
    };

    if (!text || text.length < 2) {
      scores.UNKNOWN = 1.0;
      return { primaryType: "UNKNOWN", secondaryTypes: [], confidenceScores: scores };
    }

    // Heuristics for FACT
    if (
      /\b(what is|what are|who is|when was|where is|define|definition|meaning of)\b/.test(text) &&
      !text.includes("how to") &&
      !text.includes("calculate")
    ) {
      scores.FACT += 0.85;
    }

    // Heuristics for EXPLANATION
    if (
      /\b(explain|how does|how do|why is|why does|describe|walkthrough|clarify|elaborate)\b/.test(
        text
      )
    ) {
      scores.EXPLANATION += 0.88;
    }

    // Heuristics for DEBUG
    if (
      /\b(debug|fix|error|bug|stack trace|crash|exception|failed|failure|broken|investigate issue|root cause)\b/.test(
        text
      )
    ) {
      scores.DEBUG += 0.92;
    }

    // Heuristics for DESIGN
    if (
      /\b(design|architecture|architect|blueprint|pattern|structure|schema design|system design|model)\b/.test(
        text
      )
    ) {
      scores.DESIGN += 0.87;
    }

    // Heuristics for IMPLEMENT
    if (
      /\b(code|write|create|implement|build|develop|scaffold|generate code|add function|add endpoint)\b/.test(
        text
      )
    ) {
      scores.IMPLEMENT += 0.9;
    }

    // Heuristics for TRANSFORM
    if (
      /\b(convert|refactor|transform|migrate|translate|rewrite|format|parse|serialize|normalize)\b/.test(
        text
      )
    ) {
      scores.TRANSFORM += 0.86;
    }

    // Heuristics for ANALYSIS
    if (
      /\b(analyze|analysis|inspect|drift|audit|evaluate|assess|benchmark|metrics|ast|profile|scan)\b/.test(
        text
      )
    ) {
      scores.ANALYSIS += 0.89;
    }

    // Heuristics for COMPARE
    if (
      /\b(compare|difference between|versus|vs|contrast|trade-off|pros and cons|which is better)\b/.test(
        text
      )
    ) {
      scores.COMPARE += 0.91;
    }

    // Heuristics for PLAN
    if (
      /\b(plan|roadmap|step-by-step|strategy|milestones|stages|order of execution|how should we proceed)\b/.test(
        text
      )
    ) {
      scores.PLAN += 0.88;
    }

    // Heuristics for CALCULATE
    if (
      /\b(calculate|compute|formula|sum|percentage|metric value|rate|latency|dora|risk score|math|estimate)\b/.test(
        text
      )
    ) {
      scores.CALCULATE += 0.9;
    }

    // Heuristics for VISUAL
    if (
      /\b(image|picture|diagram|screenshot|photo|ui|mockup|visualize|render|graph layout|canvas)\b/.test(
        text
      )
    ) {
      scores.VISUAL += 0.85;
    }

    // Heuristics for RESEARCH
    if (
      /\b(search|find|research|literature|papers|documentation|rfc|best practices|discover|lookup)\b/.test(
        text
      )
    ) {
      scores.RESEARCH += 0.84;
    }

    // Heuristics for ACTION
    if (
      /\b(run|execute|trigger|start|deploy|connect|disconnect|cancel|reset|apply|commit|push)\b/.test(
        text
      )
    ) {
      scores.ACTION += 0.92;
    }

    // Heuristics for REVIEW
    if (
      /\b(review|check|validate|verify|critique|pr review|code review|feedback on|audit trail)\b/.test(
        text
      )
    ) {
      scores.REVIEW += 0.86;
    }

    // Heuristics for CONTINUE
    if (
      /\b(continue|proceed|next step|resume|go ahead|keep going|what's next|stage 2|advance)\b/.test(
        text
      )
    ) {
      scores.CONTINUE += 0.88;
    }

    // Normalization & sorting
    const sortedTypes = (Object.keys(scores) as QuestionType[])
      .filter((t) => t !== "UNKNOWN")
      .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));

    const topType = sortedTypes[0];
    const primary = topType && (scores[topType] ?? 0) > 0.4 ? topType : "UNKNOWN";
    const secondary = sortedTypes.filter((t) => t !== primary && (scores[t] ?? 0) >= 0.5);

    if (primary === "UNKNOWN") {
      scores.UNKNOWN = 0.9;
    }

    return {
      primaryType: primary,
      secondaryTypes: secondary,
      confidenceScores: scores,
    };
  }

  /**
   * Builds an immutable, audited Intent Capsule from user prompt and contextual envelope.
   */
  public analyzeAndBuildCapsule(
    rawQuery: string,
    options: {
      activeProject?: string;
      activeStage?: EngineeringLifecycleStage;
      currentRoute?: string;
    } = {}
  ): IntentCapsule {
    const text = rawQuery.trim();
    const classification = this.classifyQuestion(text);
    const lower = text.toLowerCase();

    // Extract Entities
    const entities: ExtractedEntity[] = [];
    if (/github|repo|repository|pr|pull request|commit/i.test(text)) {
      entities.push({ name: "GitHub Integration", category: "CONNECTOR", confidence: 0.95 });
    }
    if (/supabase|postgres|table|schema|rls|sql/i.test(text)) {
      entities.push({ name: "PostgreSQL Database Layer", category: "DATABASE", confidence: 0.95 });
    }
    if (/ast|drift|architecture|module|boundary/i.test(text)) {
      entities.push({ name: "AST Drift Analyzer", category: "SERVICE", confidence: 0.92 });
    }
    if (/sentry|datadog|slack|google drive|linear/i.test(text)) {
      const match = text.match(/(sentry|datadog|slack|google drive|linear)/i);
      if (match && match[1]) {
        entities.push({ name: match[1], category: "CONNECTOR", confidence: 0.9 });
      }
    }
    if (/stage\s*(\d+)/i.test(text)) {
      const stageMatch = text.match(/stage\s*(\d+)/i);
      if (stageMatch && stageMatch[1]) {
        entities.push({
          name: `Engineering Stage ${stageMatch[1]}`,
          category: "STAGE",
          confidence: 0.98,
        });
      }
    }

    // Extract Constraints
    const constraints: string[] = [];
    if (/read[- ]only|no write|zero mutation/i.test(text)) constraints.push("READ_ONLY_ENFORCED");
    if (/strict|high precision|zero hallucination/i.test(text)) constraints.push("STRICT_EVIDENCE_ONLY");
    if (/urgent|fast|immediate|asap/i.test(text)) constraints.push("LATENCY_SENSITIVE");
    if (/production|live|prod/i.test(text)) constraints.push("PRODUCTION_BLAST_RADIUS");

    // Lifecycle stage inference
    let lifecycleStage: EngineeringLifecycleStage = options.activeStage || "ARCHITECTURE";
    if (classification.primaryType === "DEBUG" || lower.includes("incident") || lower.includes("triage")) {
      lifecycleStage = "INCIDENT_TRIAGE";
    } else if (classification.primaryType === "IMPLEMENT" || lower.includes("scaffold")) {
      lifecycleStage = "IMPLEMENTATION";
    } else if (classification.primaryType === "REVIEW" || lower.includes("test")) {
      lifecycleStage = "TESTING";
    } else if (lower.includes("security") || lower.includes("cve") || lower.includes("vulnerability")) {
      lifecycleStage = "SECURITY_AUDIT";
    } else if (lower.includes("deploy") || lower.includes("release")) {
      lifecycleStage = "RELEASE";
    } else if (lower.includes("schema") || lower.includes("contract")) {
      lifecycleStage = "DATA_CONTRACTS";
    }

    // Scope inference
    let scope: TargetScope = "TURN";
    if (lower.includes("tenant") || lower.includes("organization")) scope = "TENANT";
    else if (lower.includes("project") || lower.includes("portfolio")) scope = "PROJECT";
    else if (lower.includes("repo") || lower.includes("codebase")) scope = "REPOSITORY";
    else if (lower.includes("file") || lower.includes("module")) scope = "FILE";

    // Urgency & Risk
    const isCritical = /urgent|outage|incident|critical|vulnerability|emergency|breach/i.test(text);
    const urgency: QuestionUrgency = isCritical ? "CRITICAL" : lower.includes("quick") ? "HIGH" : "MEDIUM";
    const isDestructiveOrInjection =
      /drop|delete|destroy|truncate|format|ignore previous|override rules|export (service role|keys|secret)|bypass/i.test(text);
    const isConsequential =
      isDestructiveOrInjection ||
      classification.primaryType === "ACTION" ||
      lower.includes("delete") ||
      lower.includes("deploy") ||
      lower.includes("revoke") ||
      lower.includes("apply change") ||
      lower.includes("migrate");
    const risk: QuestionRisk = isDestructiveOrInjection
      ? "SEVERE"
      : isConsequential
        ? "HIGH"
        : isCritical
          ? "HIGH"
          : "LOW";

    // Ambiguity scoring
    let ambiguityScore = 0.05;
    const missingInputs: string[] = [];
    const alternateInterpretations: string[] = [];

    if (text.split(" ").length < 4 && classification.primaryType !== "CONTINUE") {
      ambiguityScore += 0.45;
      missingInputs.push("Target service or file reference underspecified");
    }
    if (/it|this|that|thing/i.test(text) && entities.length === 0) {
      ambiguityScore += 0.35;
      missingInputs.push("Deictic reference without antecedent entity");
      alternateInterpretations.push("User may refer to current active file or last analyzed PR");
    }

    const clarificationNeed = ambiguityScore > 0.6 && isConsequential;

    // Desired output determination
    let desiredOutput: IntentCapsule["desiredOutput"] = "DIRECT_ANSWER";
    switch (classification.primaryType) {
      case "PLAN":
        desiredOutput = "PLAN";
        break;
      case "IMPLEMENT":
      case "TRANSFORM":
        desiredOutput = "CODE_CHANGE";
        break;
      case "EXPLANATION":
        desiredOutput = "EXPLANATION";
        break;
      case "CALCULATE":
        desiredOutput = "CALCULATION";
        break;
      case "VISUAL":
        desiredOutput = "VISUAL_ANALYSIS";
        break;
      case "RESEARCH":
        desiredOutput = "RESEARCH_DIGEST";
        break;
      case "DEBUG":
        desiredOutput = "INCIDENT_REPORT";
        break;
      case "CONTINUE":
        desiredOutput = "LIFECYCLE_CHECKPOINT";
        break;
      default:
        desiredOutput = "DIRECT_ANSWER";
    }

    return {
      id: `intent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      rawQuery: rawQuery,
      normalizedQuery: text,
      timestamp: new Date().toISOString(),
      primaryQuestionType: classification.primaryType,
      secondaryQuestionTypes: classification.secondaryTypes,
      confidenceScores: classification.confidenceScores,
      goal: this.formulateGoal(classification.primaryType, text),
      entities,
      constraints,
      scope,
      desiredOutput,
      urgency,
      risk,
      missingInputs,
      lifecycleStage,
      ambiguityScore: Math.min(1, ambiguityScore),
      alternateInterpretations,
      candidateAction: this.inferCandidateAction(classification.primaryType, text),
      clarificationNeed,
      clarificationPrompt: clarificationNeed
        ? `Your request appears underspecified. Did you mean to target the active project [${options.activeProject || "Default"}] or inspect a specific service boundary?`
        : undefined,
      isConsequential,
    };
  }

  private formulateGoal(type: QuestionType, text: string): string {
    switch (type) {
      case "FACT":
        return `Retrieve authoritative definition and verified properties for query: "${text.slice(0, 60)}"`;
      case "EXPLANATION":
        return `Provide structured architectural explanation addressing: "${text.slice(0, 60)}"`;
      case "DEBUG":
        return `Isolate root cause, inspect error telemetry, and formulate remediation plan`;
      case "DESIGN":
        return `Synthesize architectural pattern and evaluate structural constraints`;
      case "IMPLEMENT":
        return `Generate verified, typesafe code artifacts adhering to declared standards`;
      case "PLAN":
        return `Formulate sequenced engineering execution plan with explicit stage gates`;
      case "CALCULATE":
        return `Perform deterministic formula calculation with traceable inputs and units`;
      case "ACTION":
        return `Validate preconditions and execute governed control plane operation`;
      case "CONTINUE":
        return `Inspect prior stage outcome and advance to next lifecycle milestone`;
      default:
        return `Address user inquiry with empirical evidence and verified provenance`;
    }
  }

  private inferCandidateAction(type: QuestionType, text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes("drift")) return "DETECT_ARCHITECTURE_DRIFT";
    if (lower.includes("impact") || lower.includes("blast radius")) return "ANALYZE_CHANGE_IMPACT";
    if (lower.includes("mission")) return "START_ENGINEERING_MISSION";
    if (lower.includes("health") || lower.includes("status")) return "GET_PROJECT_HEALTH";
    if (lower.includes("connector") || lower.includes("connect")) return "TEST_CONNECTOR";
    if (type === "CALCULATE") return "CALCULATE_METRIC_PROVENANCE";
    return "DISPATCH_SPECIALIST_QUERY";
  }
}

export const questionUnderstanding = QuestionUnderstandingEngine.getInstance();
