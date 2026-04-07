import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import fs from "fs";
import path from "path";
import { GenerationResult } from "@/models/Blog";
import { articleToMarkdown } from "@/lib/markdown";

// ── Color utilities ──────────────────────────────────────────────────────────
function darkenHex(hex: string, amount = 20): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = Math.max(0, parseInt(result[1], 16) - amount);
  const g = Math.max(0, parseInt(result[2], 16) - amount);
  const b = Math.max(0, parseInt(result[3], 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ── Recursively list all files in a directory ────────────────────────────────
function walkDir(dir: string, base: string = dir): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath, base));
    } else {
      results.push(path.relative(base, fullPath));
    }
  }
  return results;
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const result: GenerationResult = await request.json();
    const { blogConfig, siteConfig, articles } = result;

    const zip = new JSZip();
    const primary = blogConfig.primaryColor || "#6366F1";
    const primaryDark = darkenHex(primary, 25);
    const blogSlug = blogConfig.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // ── Build token replacement map ────────────────────────────────────────
    const tokens: Record<string, string> = {
      // Core
      "{{BLOG_NAME}}": blogConfig.name,
      "{{BLOG_SLUG}}": blogSlug,
      "{{BLOG_TAGLINE}}": blogConfig.tagline || siteConfig.heroSubtitle,
      "{{AUTHOR_NAME}}": blogConfig.author || blogConfig.name,
      "{{ACCENT_COLOR}}": primary,
      "{{ACCENT_COLOR_DARK}}": primaryDark,
      "{{THEME}}": blogConfig.theme,
      "{{CONTENT_ABOUT}}": blogConfig.contentAbout,
      "{{LANG}}": siteConfig.lang,
      "{{META_KEYWORDS}}": siteConfig.metaKeywords,

      // Categories
      "{{CAT1}}": siteConfig.cat1,
      "{{CAT2}}": siteConfig.cat2,
      "{{CAT3}}": siteConfig.cat3,
      "{{CAT1_LABEL}}": siteConfig.cat1Label,
      "{{CAT2_LABEL}}": siteConfig.cat2Label,
      "{{CAT3_LABEL}}": siteConfig.cat3Label,
      "{{CAT1_ICON}}": siteConfig.cat1Icon,
      "{{CAT2_ICON}}": siteConfig.cat2Icon,
      "{{CAT3_ICON}}": siteConfig.cat3Icon,

      // Hero
      "{{HERO_BADGE}}": siteConfig.heroBadge,
      "{{HERO_TITLE_LINE1}}": siteConfig.heroTitleLine1,
      "{{HERO_TITLE_LINE2}}": siteConfig.heroTitleLine2,
      "{{HERO_SUBTITLE}}": siteConfig.heroSubtitle,

      // Features
      "{{FEATURE1_ICON}}": siteConfig.feature1Icon,
      "{{FEATURE1_TITLE}}": siteConfig.feature1Title,
      "{{FEATURE1_DESC}}": siteConfig.feature1Desc,
      "{{FEATURE2_ICON}}": siteConfig.feature2Icon,
      "{{FEATURE2_TITLE}}": siteConfig.feature2Title,
      "{{FEATURE2_DESC}}": siteConfig.feature2Desc,
      "{{FEATURE3_ICON}}": siteConfig.feature3Icon,
      "{{FEATURE3_TITLE}}": siteConfig.feature3Title,
      "{{FEATURE3_DESC}}": siteConfig.feature3Desc,

      // CTA
      "{{CTA_ICON}}": siteConfig.ctaIcon,
      "{{CTA_TITLE}}": siteConfig.ctaTitle,
      "{{CTA_SUBTITLE}}": siteConfig.ctaSubtitle,

      // Chatbot
      "{{CHATBOT_WELCOME}}": siteConfig.chatbotWelcome,
      "{{CHATBOT_SUGGESTIONS}}": siteConfig.chatbotSuggestions,
      "{{CHATBOT_HEADER_DESC}}": siteConfig.chatbotHeaderDesc,
      "{{CHAT_PREVIEW_SUBTITLE}}": siteConfig.chatPreviewSubtitle,
      "{{CHAT_PREVIEW_PLACEHOLDER}}": siteConfig.chatPreviewPlaceholder,

      // Tutorials
      "{{TUTORIALS_SUBTITLE}}": siteConfig.tutorialsSubtitle,

      // About
      "{{ABOUT_BIO}}": siteConfig.aboutBio,
      "{{AUTHOR_TITLE}}": siteConfig.authorTitle,
    };

    // ── Read output_template/ and add to zip with token substitution ───────
    const templateDir = path.join(process.cwd(), "output_template");
    const templateFiles = walkDir(templateDir);

    for (const relPath of templateFiles) {
      const fullPath = path.join(templateDir, relPath);
      // Normalize path separators for zip
      const zipPath = relPath.replace(/\\/g, "/");

      // Read file as buffer first to check if binary
      const buf = fs.readFileSync(fullPath);

      // Check if text-like file (by extension)
      const ext = path.extname(relPath).toLowerCase();
      const textExtensions = [
        ".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".json",
        ".md", ".html", ".svg", ".txt", ".env", ".example",
        ".yaml", ".yml", ".sh", ".mjs",
      ];
      const isTextLike = textExtensions.includes(ext)
        || relPath.endsWith(".gitignore")
        || relPath.endsWith(".env.example");

      if (isTextLike) {
        let content = buf.toString("utf-8");
        // Replace all tokens
        for (const [token, value] of Object.entries(tokens)) {
          // Use split+join for global replace (safe with special chars)
          content = content.split(token).join(value);
        }
        zip.file(zipPath, content);
      } else {
        // Binary file — add as-is
        zip.file(zipPath, buf);
      }
    }

    // ── Add content/*.md article files ─────────────────────────────────────
    const contentFolder = zip.folder("content")!;
    for (const article of articles) {
      contentFolder.file(`${article.slug}.md`, articleToMarkdown(article));
    }

    // ── Generate SVG cover images for articles ─────────────────────────────
    const publicImages = zip.folder("public")!.folder("images")!.folder("covers")!;
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const hue = (i * 120 + 200) % 360;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
  <defs>
    <linearGradient id="g${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primary};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:hsl(${hue},70%,45%);stop-opacity:0.9" />
    </linearGradient>
  </defs>
  <rect width="800" height="400" rx="16" fill="url(#g${i})"/>
  <text x="400" y="180" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle" opacity="0.95">${escapeXml(article.title.slice(0, 50))}</text>
  <text x="400" y="230" font-family="Arial,sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.7">${escapeXml(blogConfig.name)}</text>
  <text x="400" y="320" font-family="Arial,sans-serif" font-size="48" text-anchor="middle" opacity="0.3" fill="white">${siteConfig.cat1Icon}</text>
</svg>`;
      publicImages.file(`article-${i + 1}.svg`, svg);
    }

    // ── Generate zip ───────────────────────────────────────────────────────
    const uint8Array = await zip.generateAsync({ type: "uint8array" });

    return new Response(uint8Array.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${blogSlug}-blog.zip"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed" },
      { status: 500 }
    );
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
