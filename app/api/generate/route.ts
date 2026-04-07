import { NextRequest, NextResponse } from "next/server";
import { BlogConfig, BlogSiteConfig } from "@/models/Blog";

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

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: BlogConfig = await request.json();
    const { name, theme, contentAbout } = body;

    if (!name || !theme || !contentAbout) {
      return NextResponse.json(
        { error: "Missing required fields: name, theme, contentAbout" },
        { status: 400 }
      );
    }

    const siteConfig = buildSiteConfig(body);

    return NextResponse.json({ siteConfig, success: true });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed", success: false },
      { status: 500 }
    );
  }
}
