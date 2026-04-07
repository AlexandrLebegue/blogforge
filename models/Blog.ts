// ── User input from the form ──────────────────────────────────────────────────
export interface BlogConfig {
  name: string;
  tagline: string;
  theme: string;
  primaryColor: string;
  contentAbout: string;
  author: string;
}

// ── AI-generated site configuration (fills template tokens) ──────────────────
export interface BlogSiteConfig {
  // Categories
  cat1: string;           // slug e.g. "introduction"
  cat2: string;           // slug e.g. "guide"
  cat3: string;           // slug e.g. "advanced"
  cat1Label: string;      // display e.g. "Introduction"
  cat2Label: string;
  cat3Label: string;
  cat1Icon: string;       // emoji e.g. "🏗️"
  cat2Icon: string;
  cat3Icon: string;

  // Hero section
  heroBadge: string;          // e.g. "Your intelligent assistant"
  heroTitleLine1: string;     // e.g. "Your guide to"
  heroTitleLine2: string;     // e.g. "Home Automation"
  heroSubtitle: string;       // e.g. "Tutorials, guides and tips..."

  // Feature cards (3)
  feature1Icon: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Icon: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Icon: string;
  feature3Title: string;
  feature3Desc: string;

  // CTA section
  ctaIcon: string;
  ctaTitle: string;
  ctaSubtitle: string;

  // Chatbot
  chatbotWelcome: string;
  chatbotSuggestions: string;   // JSON array string: [{"text":"...","icon":"🏠"},...]
  chatbotHeaderDesc: string;
  chatPreviewSubtitle: string;
  chatPreviewPlaceholder: string;

  // Tutorials page
  tutorialsSubtitle: string;

  // About page
  aboutBio: string;
  authorTitle: string;        // e.g. "Software Engineer"

  // Meta
  metaKeywords: string;       // JSON array string: ["keyword1","keyword2",...]
  lang: string;               // e.g. "en"
}

// ── Generated article ────────────────────────────────────────────────────────
export interface GeneratedArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage?: string;
  category: string;
  tags: string[];
  keywords: string[];
  author: string;
  content: string;
  readingTime?: number;
}

// ── Full generation result ───────────────────────────────────────────────────
export interface GenerationResult {
  blogConfig: BlogConfig;
  siteConfig: BlogSiteConfig;
  articles: GeneratedArticle[];
}

// ── Preset colors ────────────────────────────────────────────────────────────
export const PRESET_COLORS = [
  { name: "Indigo", primary: "#6366F1", hover: "#4F46E5", light: "#EEF2FF", rgb: "99, 102, 241" },
  { name: "Violet", primary: "#8B5CF6", hover: "#7C3AED", light: "#F5F3FF", rgb: "139, 92, 246" },
  { name: "Rose", primary: "#F43F5E", hover: "#E11D48", light: "#FFF1F2", rgb: "244, 63, 94" },
  { name: "Sky", primary: "#0EA5E9", hover: "#0284C7", light: "#F0F9FF", rgb: "14, 165, 233" },
  { name: "Emerald", primary: "#10B981", hover: "#059669", light: "#ECFDF5", rgb: "16, 185, 129" },
  { name: "Amber", primary: "#F59E0B", hover: "#D97706", light: "#FFFBEB", rgb: "245, 158, 11" },
  { name: "Orange", primary: "#F97316", hover: "#EA580C", light: "#FFF7ED", rgb: "249, 115, 22" },
  { name: "Teal", primary: "#14B8A6", hover: "#0D9488", light: "#F0FDFA", rgb: "20, 184, 166" },
  { name: "Pink", primary: "#EC4899", hover: "#DB2777", light: "#FDF2F8", rgb: "236, 72, 153" },
  { name: "Slate", primary: "#475569", hover: "#334155", light: "#F8FAFC", rgb: "71, 85, 105" },
];

export const BLOG_THEMES = [
  "Technology & Programming",
  "Travel & Adventure",
  "Food & Cooking",
  "Health & Wellness",
  "Business & Entrepreneurship",
  "Art & Design",
  "Science & Education",
  "Finance & Investing",
  "Gaming & Entertainment",
  "Personal Development",
  "Fashion & Lifestyle",
  "Parenting & Family",
  "Environment & Sustainability",
  "Sports & Fitness",
  "Music & Culture",
];
