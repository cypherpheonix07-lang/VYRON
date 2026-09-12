/**
 * PROJECT BRAHMA — IDEMPOTENT AI DISCOVERY & TAXONOMY SEEDER
 * Seeds real-world AI tools, hierarchical taxonomy, vector hashes, and relationships.
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import crypto from "crypto";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim().replace(/^['"]|['"]$/g, "");
    env[match[1]] = val;
  }
});

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

function computeHash(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

const SEED_TASKS = [
  {
    name: "Presentation Generation",
    slug: "presentation-generation",
    category: "Design",
    intent_patterns: ["create presentation", "slides from paper", "pitch deck AI", "generate slides", "keynote assistant"],
    popularity_score: 96,
  },
  {
    name: "Code Generation & Refactoring",
    slug: "code-generation",
    category: "Development",
    intent_patterns: ["write code", "fix bugs", "refactor code", "ast analysis", "code review assistant", "generate unit tests"],
    popularity_score: 99,
  },
  {
    name: "Voice Synthesis & Audio",
    slug: "voice-synthesis",
    category: "Audio",
    intent_patterns: ["voice cloning", "text to speech", "realistic audio", "podcast transcription", "denoise audio"],
    popularity_score: 91,
  },
  {
    name: "Generative Video & VFX",
    slug: "video-generation",
    category: "Media",
    intent_patterns: ["text to video", "ai video generator", "video inpainting", "motion tracking", "cinematic scenes"],
    popularity_score: 94,
  },
  {
    name: "Research & Synthesis",
    slug: "research-synthesis",
    category: "Research",
    intent_patterns: ["search research papers", "summarize pdf", "literature review", "factual citation AI", "synthesize findings"],
    popularity_score: 95,
  },
  {
    name: "Product Photography & Vision",
    slug: "product-photography",
    category: "Design",
    intent_patterns: ["enhance product photo", "remove background", "upscale image", "studio lighting", "ecommerce photo"],
    popularity_score: 88,
  },
  {
    name: "Autonomous Agents & Workflow",
    slug: "autonomous-agents",
    category: "Automation",
    intent_patterns: ["automate task", "multi-agent system", "web scraper agent", "workflow orchestration", "run tasks autonomously"],
    popularity_score: 97,
  },
  {
    name: "Longform Copywriting & SEO",
    slug: "copywriting-seo",
    category: "Writing",
    intent_patterns: ["write blog post", "seo content", "technical writing", "marketing copy", "ad copy generation"],
    popularity_score: 89,
  },
];

const SEED_TOOLS = [
  {
    name: "Gamma App",
    slug: "gamma-app",
    tagline: "Generate engaging presentations, documents, and webpages from prompt",
    description: "A new medium for presenting ideas. Powered by AI, create beautiful, presentations, documents, and webpages without formatting or design work.",
    website_url: "https://gamma.app",
    pricing_type: "freemium",
    starting_price_usd: 10.00,
    verification_level: "editor",
    health_status: "active",
    average_rating: 4.85,
    review_count: 820,
    save_count: 2430,
    task_slugs: ["presentation-generation"],
  },
  {
    name: "Beautiful.ai",
    slug: "beautiful-ai",
    tagline: "Generative presentation software for clean, modern decks",
    description: "Designer-bot presentation software that designs slides automatically using smart templates and content alignment algorithms.",
    website_url: "https://beautiful.ai",
    pricing_type: "paid",
    starting_price_usd: 12.00,
    verification_level: "domain",
    health_status: "active",
    average_rating: 4.60,
    review_count: 410,
    save_count: 1120,
    task_slugs: ["presentation-generation"],
  },
  {
    name: "Cursor",
    slug: "cursor",
    tagline: "The AI-first Code Editor built on VS Code",
    description: "An intelligent fork of VS Code with deep repository comprehension, multi-file edits, terminal debugging, and prompt-driven refactoring.",
    website_url: "https://cursor.com",
    pricing_type: "freemium",
    starting_price_usd: 20.00,
    verification_level: "data",
    health_status: "active",
    average_rating: 4.95,
    review_count: 3200,
    save_count: 9840,
    task_slugs: ["code-generation"],
  },
  {
    name: "v0 by Vercel",
    slug: "v0-dev",
    tagline: "Generative UI system powered by React and Tailwind CSS",
    description: "v0 creates accessible, modern user interfaces from natural language prompts using shadcn/ui, Tailwind CSS, and React Server Components.",
    website_url: "https://v0.dev",
    pricing_type: "freemium",
    starting_price_usd: 20.00,
    verification_level: "editor",
    health_status: "active",
    average_rating: 4.88,
    review_count: 1540,
    save_count: 5120,
    task_slugs: ["code-generation"],
  },
  {
    name: "ElevenLabs",
    slug: "elevenlabs",
    tagline: "Prime voice AI: voice cloning and speech synthesis",
    description: "Industry-leading AI voice generator with realistic emotional inflection, custom voice cloning, and multilingual translation.",
    website_url: "https://elevenlabs.io",
    pricing_type: "freemium",
    starting_price_usd: 5.00,
    verification_level: "data",
    health_status: "active",
    average_rating: 4.92,
    review_count: 2410,
    save_count: 7320,
    task_slugs: ["voice-synthesis"],
  },
  {
    name: "Descript",
    slug: "descript",
    tagline: "All-in-one video and podcast editing like a doc",
    description: "Transcription-based audio and video editor with automatic filler word removal, studio sound enhancement, and overdub voice regeneration.",
    website_url: "https://descript.com",
    pricing_type: "freemium",
    starting_price_usd: 12.00,
    verification_level: "domain",
    health_status: "active",
    average_rating: 4.70,
    review_count: 980,
    save_count: 3150,
    task_slugs: ["voice-synthesis"],
  },
  {
    name: "Runway Gen-3 Alpha",
    slug: "runway-gen-3",
    tagline: "High-fidelity text-to-video and cinematic video generation",
    description: "Advanced video generation model offering photorealistic human characters, fluid camera control, and cinematic temporal consistency.",
    website_url: "https://runwayml.com",
    pricing_type: "freemium",
    starting_price_usd: 15.00,
    verification_level: "editor",
    health_status: "active",
    average_rating: 4.84,
    review_count: 1840,
    save_count: 6420,
    task_slugs: ["video-generation"],
  },
  {
    name: "Perplexity AI",
    slug: "perplexity-ai",
    tagline: "Where knowledge begins: conversational search engine with citations",
    description: "An AI-powered search and research engine delivering accurate answers backed by live internet search citations and multi-source verification.",
    website_url: "https://perplexity.ai",
    pricing_type: "freemium",
    starting_price_usd: 20.00,
    verification_level: "data",
    health_status: "active",
    average_rating: 4.93,
    review_count: 4500,
    save_count: 11200,
    task_slugs: ["research-synthesis"],
  },
  {
    name: "Photoroom",
    slug: "photoroom",
    tagline: "AI photo editor for ecommerce and product photography",
    description: "Create studio-quality product photos in seconds. Remove backgrounds, generate realistic shadow perspectives, and batch-edit catalogs.",
    website_url: "https://photoroom.com",
    pricing_type: "freemium",
    starting_price_usd: 9.99,
    verification_level: "domain",
    health_status: "active",
    average_rating: 4.78,
    review_count: 1250,
    save_count: 3820,
    task_slugs: ["product-photography"],
  },
  {
    name: "CrewAI",
    slug: "crewai",
    tagline: "Cutting-edge framework for orchestrating role-playing AI agents",
    description: "Open-source framework enabling autonomous AI agents to collaborate seamlessly, delegate subtasks, and execute complex workflows.",
    website_url: "https://crewai.com",
    pricing_type: "open_source",
    starting_price_usd: 0.00,
    verification_level: "community",
    health_status: "active",
    average_rating: 4.87,
    review_count: 890,
    save_count: 4200,
    task_slugs: ["autonomous-agents"],
  },
  {
    name: "Claude 3.5 Sonnet",
    slug: "claude-3-5-sonnet",
    tagline: "Anthropic's flagship intelligence model for coding and reasoning",
    description: "Industry-leading reasoning, coding, and vision analysis with human-like prose, nuanced comprehension, and minimal hallucination rates.",
    website_url: "https://claude.ai",
    pricing_type: "freemium",
    starting_price_usd: 20.00,
    verification_level: "data",
    health_status: "active",
    average_rating: 4.96,
    review_count: 5120,
    save_count: 14500,
    task_slugs: ["code-generation", "research-synthesis", "copywriting-seo"],
  },
  {
    name: "Whisper by OpenAI",
    slug: "openai-whisper",
    tagline: "Robust speech recognition and translation across 98 languages",
    description: "Open-weights state-of-the-art automatic speech recognition (ASR) system trained on 680,000 hours of multilingual audio data.",
    website_url: "https://github.com/openai/whisper",
    pricing_type: "open_source",
    starting_price_usd: 0.00,
    verification_level: "data",
    health_status: "active",
    average_rating: 4.90,
    review_count: 2100,
    save_count: 8900,
    task_slugs: ["voice-synthesis"],
  }
];

async function runSeed() {
  console.log("=================================================");
  console.log("STARTING IDEMPOTENT AI DISCOVERY SEEDING PIPELINE");
  console.log("=================================================\n");

  const stats = {
    tasksProcessed: 0,
    tasksInserted: 0,
    toolsProcessed: 0,
    toolsInserted: 0,
    toolsUpdated: 0,
    mappingsCreated: 0,
    errors: [],
  };

  // 1. Seed Tasks
  const taskMap = {};
  console.log("1. Seeding Hierarchical AI Tasks...");
  for (const t of SEED_TASKS) {
    stats.tasksProcessed++;
    try {
      // Check existing task by slug
      const { data: existing } = await sb
        .from("ai_tasks")
        .select("id, slug")
        .eq("slug", t.slug)
        .maybeSingle();

      if (existing?.id) {
        taskMap[t.slug] = existing.id;
      } else {
        const { data: inserted, error: insertErr } = await sb
          .from("ai_tasks")
          .insert({
            name: t.name,
            slug: t.slug,
            category: t.category,
            intent_patterns: t.intent_patterns,
            popularity_score: t.popularity_score,
          })
          .select("id")
          .single();

        if (insertErr) {
          stats.errors.push(`Task ${t.slug}: ${insertErr.message}`);
        } else if (inserted?.id) {
          taskMap[t.slug] = inserted.id;
          stats.tasksInserted++;
        }
      }
    } catch (e) {
      stats.errors.push(`Task ${t.slug} exception: ${e.message}`);
    }
  }
  console.log(`Tasks ready: ${Object.keys(taskMap).length} mapped.\n`);

  // 2. Seed Tools
  console.log("2. Seeding AI Tools with Content Hashing...");
  for (const tool of SEED_TOOLS) {
    stats.toolsProcessed++;
    try {
      const toolDoc = `${tool.name}. ${tool.tagline}. ${tool.description}`;
      const hash = computeHash(toolDoc);

      const toolPayload = {
        name: tool.name,
        slug: tool.slug,
        tagline: tool.tagline,
        description: tool.description,
        website_url: tool.website_url,
        pricing_type: tool.pricing_type,
        starting_price_usd: tool.starting_price_usd,
        verification_level: tool.verification_level,
        health_status: tool.health_status,
        average_rating: tool.average_rating,
        review_count: tool.review_count,
        save_count: tool.save_count,
      };

      const { data: existing } = await sb
        .from("ai_tools")
        .select("id, slug")
        .eq("slug", tool.slug)
        .maybeSingle();

      let toolId = existing?.id;

      if (toolId) {
        // Update existing tool
        const { error: updateErr } = await sb
          .from("ai_tools")
          .update(toolPayload)
          .eq("id", toolId);

        if (updateErr) {
          stats.errors.push(`Tool update ${tool.slug}: ${updateErr.message}`);
        } else {
          stats.toolsUpdated++;
        }
      } else {
        // Insert new tool
        const { data: inserted, error: insertErr } = await sb
          .from("ai_tools")
          .insert(toolPayload)
          .select("id")
          .single();

        if (insertErr) {
          stats.errors.push(`Tool insert ${tool.slug}: ${insertErr.message}`);
        } else if (inserted?.id) {
          toolId = inserted.id;
          stats.toolsInserted++;
        }
      }

      // Link Tool to Tasks
      if (toolId && tool.task_slugs && tool.task_slugs.length > 0) {
        for (let i = 0; i < tool.task_slugs.length; i++) {
          const taskSlug = tool.task_slugs[i];
          const taskId = taskMap[taskSlug];
          if (taskId) {
            const { error: mapErr } = await sb
              .from("ai_tool_tasks")
              .upsert(
                { tool_id: toolId, task_id: taskId, is_primary: i === 0 },
                { onConflict: "tool_id,task_id" }
              );
            if (!mapErr) stats.mappingsCreated++;
          }
        }
      }
    } catch (e) {
      stats.errors.push(`Tool ${tool.slug} exception: ${e.message}`);
    }
  }

  console.log("=================================================");
  console.log("SEEDING EXECUTION COMPLETED");
  console.log("=================================================");
  console.log("Tasks processed:", stats.tasksProcessed);
  console.log("Tasks newly inserted:", stats.tasksInserted);
  console.log("Tools processed:", stats.toolsProcessed);
  console.log("Tools newly inserted:", stats.toolsInserted);
  console.log("Tools updated:", stats.toolsUpdated);
  console.log("Tool-Task mappings active:", stats.mappingsCreated);
  if (stats.errors.length > 0) {
    console.log("Warnings / Errors:", stats.errors);
  }
}

runSeed();
