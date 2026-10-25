/**
 * VYRON / BRAHMA — AI REPOSITORY README CLASSIFIER
 * Analyzes repository README content and project metadata to classify projects
 * into semantic domain folders within the application's internal workspace.
 *
 * GOVERNANCE LAWS:
 *  - Untrusted Input Quarantine: README content is treated strictly as plain data.
 *    No code execution, script evaluation, or instruction following.
 *  - Dual Classification Pipeline: LLM Gateway with deterministic heuristic fallback.
 *  - Zero Remote Mutation: Classifications are applied strictly to internal workspace folders.
 */

import { llmGateway } from "../llmGateway";

export interface RepoClassificationMetadata {
  name: string;
  description?: string | null;
  topics?: string[];
  language?: string | null;
  readmeText?: string | null;
}

export interface RepoClassificationResult {
  category: string;
  categorySlug: string;
  confidence: number;
  summary: string;
  tags: string[];
  analyzedAt: string;
  reasoning: string;
}

export const CLASSIFICATION_CATEGORIES = [
  {
    name: "AI and Machine Learning",
    slug: "ai-ml",
    icon: "Brain",
    description: "LLMs, Neural Networks, PyTorch, TensorFlow, Computer Vision, NLP",
    keywords: [
      "machine learning", "deep learning", "neural network", "llm", "transformer",
      "pytorch", "tensorflow", "keras", "huggingface", "scikit-learn", "nlp",
      "computer vision", "openai", "gemini", "embedding", "diffusion", "rag",
    ],
  },
  {
    name: "Web Development",
    slug: "web-dev",
    icon: "Globe",
    description: "Full-stack apps, React, Vue, Next.js, Node.js, REST & GraphQL APIs",
    keywords: [
      "react", "nextjs", "vue", "angular", "svelte", "typescript", "javascript",
      "html", "css", "tailwind", "frontend", "backend", "fullstack", "express",
      "fastapi", "django", "flask", "remix", "astro", "web app", "rest api",
    ],
  },
  {
    name: "Mobile Applications",
    slug: "mobile-apps",
    icon: "Smartphone",
    description: "iOS, Android, React Native, Flutter, Swift, Kotlin",
    keywords: [
      "mobile", "ios", "android", "flutter", "react native", "swift", "kotlin",
      "swiftui", "jetpack compose", "xamarin", "ionic", "expo", "apk", "ipa",
    ],
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    icon: "ShieldAlert",
    description: "Vulnerability scanners, cryptography, penetration testing, IAM",
    keywords: [
      "security", "cybersecurity", "vulnerability", "penetration testing", "crypto",
      "cryptography", "exploit", "cve", "stride", "owasp", "auth", "threat", "firewall",
      "malware", "reverse engineering", "forensics", "zero-trust",
    ],
  },
  {
    name: "Data Science and Analytics",
    slug: "data-science",
    icon: "BarChart3",
    description: "Pandas, Data Pipelines, Analytics Dashboards, BI, Kaggle",
    keywords: [
      "data science", "pandas", "numpy", "jupyter", "analytics", "visualization",
      "matplotlib", "seaborn", "tableau", "powerbi", "etl", "data analysis",
      "big data", "spark", "hadoop", "kaggle",
    ],
  },
  {
    name: "Cloud and DevOps",
    slug: "cloud-devops",
    icon: "Cloud",
    description: "Docker, Kubernetes, CI/CD pipelines, Terraform, AWS, GCP, Azure",
    keywords: [
      "devops", "cloud", "docker", "kubernetes", "k8s", "terraform", "ansible",
      "ci/cd", "github actions", "aws", "azure", "gcp", "helm", "prometheus",
      "grafana", "infrastructure as code", "iac", "serverless",
    ],
  },
  {
    name: "Blockchain and Web3",
    slug: "blockchain-web3",
    icon: "Coins",
    description: "Smart contracts, Solidity, Ethereum, DeFi, Crypto Protocols",
    keywords: [
      "blockchain", "web3", "smart contract", "solidity", "ethereum", "crypto",
      "defi", "nft", "token", "dapp", "rust solana", "truffle", "hardhat",
    ],
  },
  {
    name: "Finance and FinTech",
    slug: "fintech",
    icon: "DollarSign",
    description: "Trading algorithms, payments, banking APIs, ledger systems",
    keywords: [
      "fintech", "finance", "trading", "algorithmic trading", "payments",
      "stripe", "accounting", "banking", "ledger", "stocks", "portfolio",
    ],
  },
  {
    name: "Education",
    slug: "education",
    icon: "GraduationCap",
    description: "Course materials, tutorials, student projects, learning labs",
    keywords: [
      "tutorial", "course", "education", "learning", "lecture", "student",
      "homework", "curriculum", "beginner", "guide", "school", "university",
    ],
  },
  {
    name: "Research and Experimental Projects",
    slug: "research",
    icon: "FlaskConical",
    description: "Academic papers, prototypes, proof of concept benchmarks",
    keywords: [
      "research", "paper", "experimental", "prototype", "proof of concept",
      "benchmark", "thesis", "scientific", "algorithm", "arxiv", "simulation",
    ],
  },
  {
    name: "Uncategorized or Needs Review",
    slug: "uncategorized",
    icon: "Folder",
    description: "Repositories needing manual classification or lacking README documentation",
    keywords: [],
  },
] as const;

export class AIRepoClassifier {
  /**
   * Sanitizes markdown text to prevent injection or script execution.
   */
  private static sanitizeReadme(text: string, maxLength = 8000): string {
    if (!text) return "";
    return text
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .slice(0, maxLength);
  }

  /**
   * Deterministic heuristic scoring engine based on topic tags, language, and README tokens.
   */
  private static classifyDeterministic(meta: RepoClassificationMetadata): RepoClassificationResult {
    const combinedCorpus = [
      meta.name.toLowerCase().replace(/[-_]/g, " "),
      meta.description?.toLowerCase() || "",
      ...(meta.topics || []).map((t) => t.toLowerCase()),
      meta.language?.toLowerCase() || "",
      this.sanitizeReadme(meta.readmeText || "").toLowerCase(),
    ].join(" ");

    let bestCategory = CLASSIFICATION_CATEGORIES[CLASSIFICATION_CATEGORIES.length - 1]!; // default to uncategorized
    let highestScore = 0;
    const matchedTags: string[] = [];

    for (const cat of CLASSIFICATION_CATEGORIES) {
      if (cat.slug === "uncategorized") continue;

      let score = 0;
      for (const kw of cat.keywords) {
        if (combinedCorpus.includes(kw)) {
          score += 1;
          if (matchedTags.length < 5 && !matchedTags.includes(kw)) {
            matchedTags.push(kw);
          }
        }
      }

      // Weight boosts
      if (cat.keywords.some((kw) => meta.topics?.some((t) => t.toLowerCase() === kw))) {
        score += 3;
      }
      if (cat.keywords.some((kw) => meta.name.toLowerCase().includes(kw))) {
        score += 2;
      }

      if (score > highestScore) {
        highestScore = score;
        bestCategory = cat;
      }
    }

    const confidence = highestScore >= 6 ? 0.95 : highestScore >= 3 ? 0.82 : highestScore >= 1 ? 0.65 : 0.4;
    const isUncategorized = highestScore === 0;

    const summary = isUncategorized
      ? `Repository @${meta.name} contains limited contextual markers in its README; placed in Uncategorized for review.`
      : `Classified as ${bestCategory.name} based on detected architecture markers (${matchedTags.slice(0, 3).join(", ") || bestCategory.slug}).`;

    return {
      category: isUncategorized ? "Uncategorized or Needs Review" : bestCategory.name,
      categorySlug: isUncategorized ? "uncategorized" : bestCategory.slug,
      confidence,
      summary,
      tags: matchedTags.length > 0 ? matchedTags : [meta.language || "General"],
      analyzedAt: new Date().toISOString(),
      reasoning: isUncategorized
        ? "No definitive technical taxonomy keywords identified in README markdown."
        : `Identified ${highestScore} domain indicators matching ${bestCategory.name} taxonomy.`,
    };
  }

  /**
   * Primary classification orchestrator: attempts LLM analysis with resilient fallback.
   */
  public static async classify(meta: RepoClassificationMetadata): Promise<RepoClassificationResult> {
    try {
      // 1. Check if LLM gateway is accessible
      const cleanReadme = this.sanitizeReadme(meta.readmeText || "");
      if (cleanReadme.length > 100) {
        const prompt = `Classify this software repository based strictly on its README and metadata.
Repository: ${meta.name}
Language: ${meta.language || "Unknown"}
Description: ${meta.description || "None"}
Topics: ${(meta.topics || []).join(", ") || "None"}

Allowed Categories:
${CLASSIFICATION_CATEGORIES.map((c) => `- ${c.name}`).join("\n")}

Respond with JSON strictly matching:
{"category": "Category Name", "confidence": 0.9, "summary": "1 sentence summary", "tags": ["tag1", "tag2"]}`;

        const llmRes = await llmGateway.draftReport({ prompt }, undefined, { max_tokens: 300 });
        if (llmRes.ok && llmRes.content && typeof llmRes.content === "object") {
          const parsed = llmRes.content as {
            category?: string;
            confidence?: number;
            summary?: string;
            tags?: string[];
          };
          const matchedCategory = CLASSIFICATION_CATEGORIES.find(
            (c) => c.name.toLowerCase() === (parsed.category || "").toLowerCase(),
          );
          if (matchedCategory) {
            return {
              category: matchedCategory.name,
              categorySlug: matchedCategory.slug,
              confidence: parsed.confidence || 0.9,
              summary: parsed.summary || `Classified as ${matchedCategory.name}.`,
              tags: parsed.tags || [meta.language || "code"],
              analyzedAt: new Date().toISOString(),
              reasoning: "AI semantic synthesis of README structure and project purpose.",
            };
          }
        }
      }
    } catch {
      // Gracefully fall through to deterministic classifier
    }

    return this.classifyDeterministic(meta);
  }
}
