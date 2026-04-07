import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/ai_services";
import { BlogConfig, BlogSiteConfig, GeneratedArticle } from "@/models/Blog";
import { estimateReadingTime } from "@/lib/markdown";

// ── Deterministic site config from user input ────────────────────────────────
function buildSiteConfig(config: BlogConfig): BlogSiteConfig {
  const { name, tagline, theme, contentAbout, author } = config;
  const authorName = author || name;

  return {
    // Categories
    cat1: "introduction",
    cat2: "guide",
    cat3: "advanced",
    cat1Label: "Introduction",
    cat2Label: "Guides",
    cat3Label: "Advanced",
    cat1Icon: "📚",
    cat2Icon: "🔧",
    cat3Icon: "🚀",

    // Hero
    heroBadge: `Your ${theme.toLowerCase()} resource`,
    heroTitleLine1: `Welcome to`,
    heroTitleLine2: name,
    heroSubtitle: tagline || `Tutorials, guides and tips about ${contentAbout}.`,

    // Features
    feature1Icon: "📖",
    feature1Title: "In-depth articles",
    feature1Desc: `Detailed guides to help you master ${theme.toLowerCase()}`,
    feature2Icon: "💡",
    feature2Title: "Practical tips",
    feature2Desc: `Actionable advice you can apply right away to ${contentAbout.toLowerCase().slice(0, 60)}`,
    feature3Icon: "🤖",
    feature3Title: "AI Chatbot",
    feature3Desc: `Get instant answers to your questions about ${theme.toLowerCase()}`,

    // CTA
    ctaIcon: "🚀",
    ctaTitle: `Ready to dive into ${theme}?`,
    ctaSubtitle: `Explore our articles or ask the AI chatbot for help`,

    // Chatbot
    chatbotWelcome: `Hello! 👋 I'm your AI assistant specialized in ${theme.toLowerCase()}. Ask me anything about ${contentAbout.toLowerCase()}!`,
    chatbotSuggestions: JSON.stringify([
      { text: `What is ${theme}?`, icon: "📚" },
      { text: `How do I get started with ${contentAbout.split(" ").slice(0, 4).join(" ")}?`, icon: "🏁" },
      { text: `Best practices for beginners?`, icon: "💡" },
      { text: `What tools do I need?`, icon: "🔧" },
    ]),
    chatbotHeaderDesc: `Ask your questions about ${theme.toLowerCase()} and get personalized recommendations`,
    chatPreviewSubtitle: `Ask your questions about ${theme.toLowerCase()}`,
    chatPreviewPlaceholder: `How do I get started with ${contentAbout.split(" ").slice(0, 5).join(" ")}?`,

    // Tutorials page
    tutorialsSubtitle: `Discover our complete guides about ${contentAbout.toLowerCase()}.`,

    // About
    aboutBio: `Passionate about ${theme.toLowerCase()}, I created ${name} to share knowledge and help others learn about ${contentAbout.toLowerCase()}. Whether you're a beginner or experienced, you'll find practical tutorials and in-depth guides here.`,
    authorTitle: `${theme} Enthusiast & Writer`,

    // Meta
    metaKeywords: JSON.stringify(
      [theme.toLowerCase(), ...contentAbout.toLowerCase().split(" ").slice(0, 5), "blog", "tutorials", "guide"]
        .filter((v, i, a) => a.indexOf(v) === i)
    ),
    lang: "en",
  };
}

// ── Fallback articles ────────────────────────────────────────────────────────
function getFallbackArticles(config: BlogConfig, today: string): GeneratedArticle[] {
  const author = config.author || config.name;
  const topic = config.contentAbout;
  const theme = config.theme;

  return [
    {
      slug: "getting-started-guide",
      title: `Getting Started with ${theme}`,
      excerpt: `A complete beginner's guide to ${topic}. Everything you need to know to get started today.`,
      date: today,
      category: "introduction",
      tags: ["beginner", "guide", "introduction"],
      keywords: [theme.toLowerCase(), "beginner", "getting started"],
      author,
      content: `# Getting Started with ${theme}\n\nWelcome! This guide walks you through everything about **${topic}**.\n\n## What is ${theme}?\n\n${theme} covers ${topic}. Whether you're a complete beginner or strengthening your foundations, this is the perfect starting point.\n\n## Why It Matters\n\nUnderstanding ${topic} opens up possibilities:\n\n- **Practical skills** you can apply immediately\n- **Deep knowledge** that compounds over time\n- **Community** of passionate practitioners\n- **Opportunities** in a growing field\n\n## Core Concepts\n\n### 1. The Basics\n\nEvery journey starts with fundamentals. Start simple — pick one concept, master it, move to the next.\n\n### 2. Setting Up\n\nGet your environment ready:\n\n1. **Research** available tools\n2. **Choose** the simplest one that works\n3. **Configure** with sensible defaults\n4. **Test** before moving on\n\n### 3. First Steps\n\nOnce set up, start with the smallest possible task. Success builds momentum.\n\n## Common Mistakes\n\n- **Trying to learn too fast** — depth beats breadth\n- **Skipping fundamentals** — shortcuts haunt you later\n- **Working in isolation** — find a community early\n- **Fear of mistakes** — errors teach the fastest\n\n## Next Steps\n\nYou have a solid foundation. Check our how-to guide for hands-on practice. The most important step is to **start today**.`,
      readingTime: 4,
    },
    {
      slug: "complete-how-to-guide",
      title: `How to Master ${topic}: A Step-by-Step Guide`,
      excerpt: `A practical walkthrough for mastering ${topic} from setup to first results.`,
      date: today,
      category: "guide",
      tags: ["how-to", "tutorial", "step-by-step"],
      keywords: [topic.toLowerCase().slice(0, 30), "how to", "tutorial"],
      author,
      content: `# How to Master ${topic}: A Step-by-Step Guide\n\nThis hands-on guide takes you through working with **${topic}** — from setup to real results.\n\n## Before You Begin\n\n- A clear goal in mind\n- 1-2 hours of focused time\n- A notebook for progress tracking\n\n## Step 1: Plan Your Approach\n\n1. **What outcome do I want?** Be specific.\n2. **What resources do I have?**\n3. **How will I measure success?**\n\n### Your Roadmap\n\n- **Week 1** — learn fundamentals, set up environment\n- **Week 2** — complete your first project\n- **Week 3** — iterate and improve\n- **Week 4** — share work, get feedback\n\n## Step 2: Set Up Your Environment\n\n### Essential Tools\n\n- **Clean workspace** — reduce distractions\n- **Version control** — track changes\n- **Documentation** — write down what and why\n\n> **Pro tip:** Start with the simplest configuration possible.\n\n## Step 3: Execute Your First Project\n\n1. Start with **tiny scope**\n2. **Build it** — don't overthink\n3. **Evaluate** results\n4. **Document** learnings\n5. **Iterate** on next project\n\n## Step 4: Troubleshoot\n\n- **Isolate** the problem\n- **Research** similar issues\n- **Experiment** one change at a time\n- **Ask for help** after 30 minutes\n\n## You're Ready\n\nFollow these steps consistently and you'll see real progress within weeks.`,
      readingTime: 5,
    },
    {
      slug: "advanced-tips-and-best-practices",
      title: `Advanced Tips & Best Practices for ${theme}`,
      excerpt: `Level up your ${topic} skills with expert techniques and pro strategies.`,
      date: today,
      category: "advanced",
      tags: ["advanced", "tips", "best-practices"],
      keywords: [theme.toLowerCase(), "advanced", "tips", "best practices"],
      author,
      content: `# Advanced Tips & Best Practices for ${theme}\n\nYou've got the basics down. Here's what separates good from great in **${topic}**.\n\n## The Mindset Shift\n\nBeginners ask *"how?"*. Advanced practitioners ask *"should I?"*\n\nBiggest gains come from:\n\n1. **Elimination** — remove what doesn't serve your goals\n2. **Automation** — systematize repetitive work\n3. **Leverage** — find the 20% that produces 80% of results\n\n## Technique #1: Systems Thinking\n\nStop thinking about tasks. Build **systems** — repeatable processes with consistent results.\n\n- Document every process you repeat 3+ times\n- Identify bottlenecks\n- Remove or automate each one\n- Measure results\n\n## Technique #2: Deep Work\n\n> Block 2-4 hour sessions for your most important work. Guard them fiercely.\n\n- Turn off notifications during deep work\n- Batch shallow tasks into one period per day\n- Schedule deep work during peak energy\n\n## Technique #3: Deliberate Practice\n\n1. **Work at the edge** of your ability\n2. **Get immediate feedback**\n3. **Focus on weaknesses**\n4. **Repeat with corrections**\n\n## Common Advanced Mistakes\n\n- **Complexity bias** — simple often beats sophisticated\n- **Tool obsession** — configuring vs. doing\n- **Ignoring fundamentals** — root causes are almost always basic\n\n## The Long Game\n\nReal mastery takes years. The key trait: **consistency over intensity**. Show up every day.`,
      readingTime: 5,
    },
  ];
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: BlogConfig = await request.json();
    const { name, tagline, theme, contentAbout, author } = body;

    if (!name || !theme || !contentAbout) {
      return NextResponse.json(
        { error: "Missing required fields: name, theme, contentAbout" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const authorName = author || name;

    // Build site config deterministically
    const siteConfig = buildSiteConfig(body);

    // Generate articles with AI
    const systemPrompt = `You are a professional blog content writer and SEO expert.
You write engaging, well-structured blog articles in proper Markdown format.
You always respond with valid JSON only — no extra text, no markdown fences around the JSON.`;

    const userPrompt = `Create exactly 3 high-quality blog articles for:

Blog Name: "${name}"
Tagline: "${tagline || ""}"
Theme: "${theme}"
Content Focus: "${contentAbout}"
Author: "${authorName}"
Date: ${today}

Categories (pick most fitting per article):
- "introduction" — beginner / overview
- "guide" — step-by-step how-to
- "advanced" — tips, best practices, deep dives

Requirements per article:
- 700-1000 words of rich markdown (## for sections, ### for sub-sections)
- Bold key terms, use lists where appropriate
- Engaging opening, practical content, no fluff

Respond ONLY with a JSON array of 3 objects:
[
  {
    "slug": "url-friendly-slug",
    "title": "Compelling Title",
    "excerpt": "One compelling sentence (max 160 chars)",
    "date": "${today}",
    "coverImage": "/images/covers/article-1.svg",
    "category": "introduction",
    "tags": ["tag1", "tag2", "tag3"],
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "author": "${authorName}",
    "content": "Full markdown content..."
  }
]

- Article 1: category = "introduction", coverImage = "/images/covers/article-1.svg"
- Article 2: category = "guide", coverImage = "/images/covers/article-2.svg"
- Article 3: category = "advanced", coverImage = "/images/covers/article-3.svg"
- Return ONLY the raw JSON array`;

    let articles: GeneratedArticle[];
    let usedFallback = false;

    try {
      const rawResponse = await generateCompletion(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        { maxTokens: 5000, temperature: 0.72 }
      );

      let jsonStr = rawResponse.trim();
      jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      try {
        articles = JSON.parse(jsonStr);
      } catch {
        jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");
        articles = JSON.parse(jsonStr);
      }

      if (!Array.isArray(articles) || articles.length === 0) {
        throw new Error("Invalid response structure");
      }
    } catch (aiError) {
      console.warn("AI generation failed, using fallback articles:", aiError);
      articles = getFallbackArticles(body, today);
      usedFallback = true;
    }

    // Normalise
    articles = articles.slice(0, 3).map((article, i) => ({
      ...article,
      readingTime: estimateReadingTime(article.content || ""),
      date: article.date || today,
      slug: article.slug || `article-${i + 1}`,
      coverImage: article.coverImage || `/images/covers/article-${i + 1}.svg`,
      author: article.author || authorName,
    }));

    return NextResponse.json({
      articles,
      siteConfig,
      success: true,
      usedFallback,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed", success: false },
      { status: 500 }
    );
  }
}
