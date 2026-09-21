/**
 * PROJECT BRAHMA — DISCOVERY SERVICE
 * Orchestrates Supabase database queries for AI tools and hierarchical tasks,
 * falls back gracefully to deterministic seed catalog, and provides intent resolution.
 */

import { supabase } from "@/lib/supabase";
import { AITool, AITask, DiscoveryFilters, DiscoverySearchResponse } from "@/types/discovery";
import { deconstructUserIntent, rankAITools } from "./semanticSearch";

/**
 * Hardened Fallback Catalog matching the 12 tools and 8 tasks seeded in Supabase
 */
export const FALLBACK_TASKS: AITask[] = [
  {
    id: "task-1",
    name: "Presentation Generation",
    slug: "presentation-generation",
    category: "Design & Presentation",
    intent_patterns: [
      "create slides",
      "pitch deck",
      "powerpoint generator",
      "turn doc into presentation",
    ],
    popularity_score: 94,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-2",
    name: "Code Generation & Architecture",
    slug: "code-generation",
    category: "Software Development",
    intent_patterns: [
      "write code",
      "fix bug",
      "refactor typescript",
      "create react component",
      "generate api",
    ],
    popularity_score: 98,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-3",
    name: "Voice Cloning & Speech Synthesis",
    slug: "voice-synthesis",
    category: "Audio & Speech",
    intent_patterns: [
      "clone voice",
      "text to speech",
      "ai voiceover",
      "generate speech",
      "podcast editing",
    ],
    popularity_score: 91,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-4",
    name: "Cinematic Video Generation",
    slug: "video-generation",
    category: "Video & Motion",
    intent_patterns: [
      "text to video",
      "ai video clips",
      "motion graphics",
      "video rendering",
      "cinematic b-roll",
    ],
    popularity_score: 96,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-5",
    name: "Research Synthesis & Verification",
    slug: "research-synthesis",
    category: "Knowledge & Research",
    intent_patterns: [
      "research paper summary",
      "fact check",
      "academic literature review",
      "search with citations",
    ],
    popularity_score: 95,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-6",
    name: "Product Photography & Background AI",
    slug: "product-photography",
    category: "Design & Media",
    intent_patterns: [
      "remove background",
      "ecommerce product photo",
      "studio lighting ai",
      "product mockups",
    ],
    popularity_score: 87,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-7",
    name: "Autonomous Multi-Agent Orchestration",
    slug: "autonomous-agents",
    category: "Autonomous Systems",
    intent_patterns: [
      "ai agents",
      "multi-agent team",
      "crew ai",
      "autonomous workflow",
      "llm orchestration",
    ],
    popularity_score: 93,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-8",
    name: "Technical Copywriting & SEO",
    slug: "copywriting-seo",
    category: "Content & Strategy",
    intent_patterns: [
      "write blog post",
      "seo content",
      "technical writing",
      "marketing copy",
      "ad copy generation",
    ],
    popularity_score: 89,
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_TOOLS: AITool[] = [
  {
    id: "tool-gamma",
    name: "Gamma App",
    slug: "gamma-app",
    tagline: "Generate engaging presentations, documents, and webpages from prompt",
    description:
      "A new medium for presenting ideas. Powered by AI, create beautiful, presentations, documents, and webpages without formatting or design work.",
    website_url: "https://gamma.app",
    pricing_type: "freemium",
    starting_price_usd: 10.0,
    verification_level: "editor",
    health_status: "healthy",
    average_rating: 4.85,
    review_count: 820,
    save_count: 2430,
    last_verified_at: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Presentation Generation",
    category: "Design & Presentation",
    capabilities: ["AI Slide Layouts", "Card Flow", "PDF/PPTX Export", "Interactive Embeds"],
    modalities: ["Text", "Presentations", "Documents"],
    platforms: ["Web"],
    has_api: true,
    latency_ms: 210,
    http_status: 200,
  },
  {
    id: "tool-beautiful-ai",
    name: "Beautiful.ai",
    slug: "beautiful-ai",
    tagline: "Generative presentation software for clean, modern decks",
    description:
      "Designer-bot presentation software that designs slides automatically using smart templates and content alignment algorithms.",
    website_url: "https://beautiful.ai",
    pricing_type: "paid",
    starting_price_usd: 12.0,
    verification_level: "domain",
    health_status: "healthy",
    average_rating: 4.6,
    review_count: 410,
    save_count: 1120,
    last_verified_at: new Date(Date.now() - 7200000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Presentation Generation",
    category: "Design & Presentation",
    capabilities: ["Smart Slide Templates", "Auto-Formatting", "Team Branding"],
    modalities: ["Presentations"],
    platforms: ["Web"],
    has_api: false,
    latency_ms: 310,
    http_status: 200,
  },
  {
    id: "tool-cursor",
    name: "Cursor",
    slug: "cursor",
    tagline: "The AI-first Code Editor built on VS Code",
    description:
      "An intelligent fork of VS Code with deep repository comprehension, multi-file edits, terminal debugging, and prompt-driven refactoring.",
    website_url: "https://cursor.com",
    pricing_type: "freemium",
    starting_price_usd: 20.0,
    verification_level: "data",
    health_status: "healthy",
    average_rating: 4.95,
    review_count: 3200,
    save_count: 9840,
    last_verified_at: new Date(Date.now() - 1800000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Code Generation & Architecture",
    category: "Software Development",
    capabilities: ["Repo Context indexing", "Multi-file composer", "Terminal auto-fix"],
    modalities: ["Code", "Text"],
    platforms: ["macOS", "Windows", "Linux"],
    has_api: false,
    latency_ms: 120,
    http_status: 200,
  },
  {
    id: "tool-v0",
    name: "v0 by Vercel",
    slug: "v0-dev",
    tagline: "Generative UI system powered by React and Tailwind CSS",
    description:
      "v0 creates accessible, modern user interfaces from natural language prompts using shadcn/ui, Tailwind CSS, and React Server Components.",
    website_url: "https://v0.dev",
    pricing_type: "freemium",
    starting_price_usd: 20.0,
    verification_level: "editor",
    health_status: "healthy",
    average_rating: 4.88,
    review_count: 1540,
    save_count: 5120,
    last_verified_at: new Date(Date.now() - 2500000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Code Generation & Architecture",
    category: "Software Development",
    capabilities: ["React Generation", "Tailwind CSS", "shadcn/ui", "Live Preview"],
    modalities: ["Code", "UI"],
    platforms: ["Web"],
    has_api: true,
    latency_ms: 190,
    http_status: 200,
  },
  {
    id: "tool-elevenlabs",
    name: "ElevenLabs",
    slug: "elevenlabs",
    tagline: "Prime voice AI: voice cloning and speech synthesis",
    description:
      "Industry-leading AI voice generator with realistic emotional inflection, custom voice cloning, and multilingual translation.",
    website_url: "https://elevenlabs.io",
    pricing_type: "freemium",
    starting_price_usd: 5.0,
    verification_level: "data",
    health_status: "healthy",
    average_rating: 4.92,
    review_count: 2410,
    save_count: 7320,
    last_verified_at: new Date(Date.now() - 900000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Voice Cloning & Speech Synthesis",
    category: "Audio & Speech",
    capabilities: ["Emotional Cadence", "Instant Voice Clone", "Speech-to-Speech", "Dubbing"],
    modalities: ["Audio", "Voice"],
    platforms: ["Web", "API"],
    has_api: true,
    latency_ms: 140,
    http_status: 200,
  },
  {
    id: "tool-descript",
    name: "Descript",
    slug: "descript",
    tagline: "All-in-one video and podcast editing like a doc",
    description:
      "Transcription-based audio and video editor with automatic filler word removal, studio sound enhancement, and overdub voice regeneration.",
    website_url: "https://descript.com",
    pricing_type: "freemium",
    starting_price_usd: 12.0,
    verification_level: "domain",
    health_status: "healthy",
    average_rating: 4.7,
    review_count: 980,
    save_count: 3150,
    last_verified_at: new Date(Date.now() - 5400000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Voice Cloning & Speech Synthesis",
    category: "Audio & Speech",
    capabilities: [
      "Overdub AI Voice",
      "Filler Word Removal",
      "Studio Sound",
      "Automatic Transcription",
    ],
    modalities: ["Audio", "Video"],
    platforms: ["macOS", "Windows", "Web"],
    has_api: false,
    latency_ms: 280,
    http_status: 200,
  },
  {
    id: "tool-runway",
    name: "Runway Gen-3 Alpha",
    slug: "runway-gen-3",
    tagline: "High-fidelity text-to-video and cinematic video generation",
    description:
      "Advanced video generation model offering photorealistic human characters, fluid camera control, and cinematic temporal consistency.",
    website_url: "https://runwayml.com",
    pricing_type: "freemium",
    starting_price_usd: 15.0,
    verification_level: "editor",
    health_status: "healthy",
    average_rating: 4.84,
    review_count: 1840,
    save_count: 6420,
    last_verified_at: new Date(Date.now() - 1200000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Cinematic Video Generation",
    category: "Video & Motion",
    capabilities: ["Motion Brush", "Camera Controls", "Gen-3 Alpha Model", "Lip Sync"],
    modalities: ["Video", "Image"],
    platforms: ["Web", "iOS"],
    has_api: true,
    latency_ms: 220,
    http_status: 200,
  },
  {
    id: "tool-perplexity",
    name: "Perplexity AI",
    slug: "perplexity-ai",
    tagline: "Where knowledge begins: conversational search engine with citations",
    description:
      "An AI-powered search and research engine delivering accurate answers backed by live internet search citations and multi-source verification.",
    website_url: "https://perplexity.ai",
    pricing_type: "freemium",
    starting_price_usd: 20.0,
    verification_level: "data",
    health_status: "healthy",
    average_rating: 4.93,
    review_count: 4500,
    save_count: 11200,
    last_verified_at: new Date(Date.now() - 600000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Research Synthesis & Verification",
    category: "Knowledge & Research",
    capabilities: [
      "Pro Search reasoning",
      "Academic mode",
      "Source citations",
      "Collection organizing",
    ],
    modalities: ["Text", "Web"],
    platforms: ["Web", "iOS", "Android"],
    has_api: true,
    latency_ms: 110,
    http_status: 200,
  },
  {
    id: "tool-photoroom",
    name: "Photoroom",
    slug: "photoroom",
    tagline: "AI photo editor for ecommerce and product photography",
    description:
      "Create studio-quality product photos in seconds. Remove backgrounds, generate realistic shadow perspectives, and batch-edit catalogs.",
    website_url: "https://photoroom.com",
    pricing_type: "freemium",
    starting_price_usd: 9.99,
    verification_level: "domain",
    health_status: "healthy",
    average_rating: 4.78,
    review_count: 1250,
    save_count: 3820,
    last_verified_at: new Date(Date.now() - 4000000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Product Photography & Background AI",
    category: "Design & Media",
    capabilities: [
      "AI Shadow Generation",
      "Background Cutout",
      "Batch Processing",
      "Ecommerce Presets",
    ],
    modalities: ["Image"],
    platforms: ["Web", "iOS", "Android", "API"],
    has_api: true,
    latency_ms: 205,
    http_status: 200,
  },
  {
    id: "tool-crewai",
    name: "CrewAI",
    slug: "crewai",
    tagline: "Cutting-edge framework for orchestrating role-playing AI agents",
    description:
      "Open-source framework enabling autonomous AI agents to collaborate seamlessly, delegate subtasks, and execute complex workflows.",
    website_url: "https://crewai.com",
    pricing_type: "open_source",
    starting_price_usd: 0.0,
    verification_level: "community",
    health_status: "healthy",
    average_rating: 4.87,
    review_count: 890,
    save_count: 4200,
    last_verified_at: new Date(Date.now() - 8640000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Autonomous Multi-Agent Orchestration",
    category: "Autonomous Systems",
    capabilities: ["Hierarchical Processes", "LangChain/LlamaIndex tools", "Memory persistence"],
    modalities: ["Code", "Agents"],
    platforms: ["Python", "CLI"],
    has_api: true,
    latency_ms: 180,
    http_status: 200,
  },
  {
    id: "tool-claude",
    name: "Claude 3.5 Sonnet",
    slug: "claude-3-5-sonnet",
    tagline: "Anthropic's flagship intelligence model for coding and reasoning",
    description:
      "Industry-leading reasoning, coding, and vision analysis with human-like prose, nuanced comprehension, and minimal hallucination rates.",
    website_url: "https://claude.ai",
    pricing_type: "freemium",
    starting_price_usd: 20.0,
    verification_level: "data",
    health_status: "healthy",
    average_rating: 4.96,
    review_count: 5120,
    save_count: 14500,
    last_verified_at: new Date(Date.now() - 450000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Code Generation & Architecture",
    category: "Software Development",
    capabilities: ["Artifacts UI", "Vision Analysis", "200k Context Window", "Low Hallucination"],
    modalities: ["Text", "Code", "Vision"],
    platforms: ["Web", "iOS", "Android", "API"],
    has_api: true,
    latency_ms: 95,
    http_status: 200,
  },
  {
    id: "tool-whisper",
    name: "Whisper by OpenAI",
    slug: "openai-whisper",
    tagline: "Robust speech recognition and translation across 98 languages",
    description:
      "Open-weights state-of-the-art automatic speech recognition (ASR) system trained on 680,000 hours of multilingual audio data.",
    website_url: "https://github.com/openai/whisper",
    pricing_type: "open_source",
    starting_price_usd: 0.0,
    verification_level: "data",
    health_status: "healthy",
    average_rating: 4.9,
    review_count: 2100,
    save_count: 8900,
    last_verified_at: new Date(Date.now() - 10000000).toISOString(),
    created_at: new Date().toISOString(),
    primary_task: "Voice Cloning & Speech Synthesis",
    category: "Audio & Speech",
    capabilities: ["Multilingual ASR", "Timestamp alignment", "Noise resilience", "Open Weights"],
    modalities: ["Audio", "Speech"],
    platforms: ["Python", "C++", "API"],
    has_api: true,
    latency_ms: 130,
    http_status: 200,
  },
];

class DiscoveryService {
  private cachedTools: AITool[] | null = null;
  private cachedTasks: AITask[] | null = null;

  /**
   * Fetches all registered AI tasks
   */
  async getTasks(): Promise<AITask[]> {
    if (this.cachedTasks) return this.cachedTasks;

    try {
      const { data, error } = await supabase
        .from("ai_tasks")
        .select("*")
        .order("popularity_score", { ascending: false });

      if (!error && data && data.length > 0) {
        this.cachedTasks = data as AITask[];
        return this.cachedTasks;
      }
    } catch {
      // Fallback
    }

    this.cachedTasks = FALLBACK_TASKS;
    return this.cachedTasks;
  }

  /**
   * Fetches all registered AI tools with category and primary tasks resolved
   */
  async getTools(): Promise<AITool[]> {
    if (this.cachedTools) return this.cachedTools;

    try {
      const { data, error } = await supabase.from("ai_tools").select(`
          *,
          ai_tool_tasks (
            is_primary,
            ai_tasks (
              name,
              category,
              slug
            )
          )
        `);

      if (!error && data && data.length > 0) {
        interface ToolDbRow extends AITool {
          ai_tool_tasks?: Array<{
            is_primary?: boolean;
            ai_tasks?: {
              name?: string;
              category?: string;
              slug?: string;
            } | null;
          }>;
        }

        const mapped: AITool[] = (data as unknown as ToolDbRow[]).map((t) => {
          const primaryRel = t.ai_tool_tasks?.find((r) => r.is_primary) || t.ai_tool_tasks?.[0];
          const taskObj = primaryRel?.ai_tasks;

          return {
            ...t,
            health_status: t.health_status === "active" ? "healthy" : t.health_status,
            primary_task: taskObj?.name || t.primary_task || "General Intelligence",
            category: taskObj?.category || t.category || "General",
            capabilities: t.capabilities || [
              "Automated Processing",
              "Task Orchestration",
              "Production Ready",
            ],
            modalities: t.modalities || ["Text", "Web"],
            platforms: t.platforms || ["Web"],
            has_api: t.has_api ?? true,
            latency_ms: t.latency_ms ?? 190,
            http_status: t.http_status ?? 200,
          };
        });

        this.cachedTools = mapped;
        return this.cachedTools;
      }
    } catch {
      // Fallback
    }

    this.cachedTools = FALLBACK_TOOLS;
    return this.cachedTools;
  }

  /**
   * Primary Search Pipeline: Intent -> Vector Similarity -> Filter -> Rerank
   */
  async search(query: string, filters: DiscoveryFilters = {}): Promise<DiscoverySearchResponse> {
    const startTime = performance.now();
    const tools = await this.getTools();
    const tasks = await this.getTasks();

    const intent = deconstructUserIntent(query);
    const rankedResults = rankAITools(query, tools, filters, intent);

    const executionTimeMs = Math.round(performance.now() - startTime);

    // Nearby categories for zero or sparse results
    const nearbyCategories = Array.from(new Set(tasks.map((t) => t.category))).slice(0, 4);
    const suggestedRefinements = [
      "Include open-source models with offline deployment",
      `Filter by verified ${intent.primaryTask} tools`,
      "Search for production API endpoints with <200ms latency",
    ];

    // Record zero-result queries for taxonomy learning
    if (rankedResults.length === 0 && query.trim().length > 0) {
      this.logZeroResultSearch(query, filters);
    }

    return {
      query,
      intent,
      matchedTasks: tasks.filter(
        (t) =>
          t.name.toLowerCase().includes(intent.primaryTask.toLowerCase()) ||
          t.category.toLowerCase() === intent.category.toLowerCase(),
      ),
      results: rankedResults,
      totalCount: rankedResults.length,
      executionTimeMs,
      suggestedRefinements,
      nearbyCategories,
    };
  }

  /**
   * Logs zero-result searches to enhance future taxonomy definitions
   */
  logZeroResultSearch(query: string, filters: DiscoveryFilters) {
    console.info(`[DISCOVERY_TELEMETRY:ZERO_RESULT] Query: "${query}"`, {
      filters,
      timestamp: new Date().toISOString(),
    });
  }
}

export const discoveryService = new DiscoveryService();
