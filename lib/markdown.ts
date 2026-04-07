import { GeneratedArticle } from "@/models/Blog";

/**
 * Render a GeneratedArticle as a full .md file string (with frontmatter)
 */
export function articleToMarkdown(article: GeneratedArticle): string {
  const frontmatter = [
    "---",
    `title: "${article.title.replace(/"/g, '\\"')}"`,
    `excerpt: "${article.excerpt.replace(/"/g, '\\"')}"`,
    `date: "${article.date}"`,
    `category: "${article.category}"`,
    `tags: [${article.tags.map((t) => `"${t}"`).join(", ")}]`,
    `keywords: [${article.keywords.map((k) => `"${k}"`).join(", ")}]`,
    `author: "${article.author}"`,
    "---",
    "",
  ].join("\n");

  return frontmatter + article.content;
}

/**
 * Parse markdown content — convert to simple HTML for preview
 */
export function parseMarkdownToHtml(md: string): string {
  let html = md
    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/^```[^\n]*\n?/, "").replace(/\n?```$/, "");
      return `<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Blockquote
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Unordered lists
    .replace(/^[\-\*] (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // HR
    .replace(/^---$/gm, "<hr />")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Paragraphs (double newlines)
    .replace(/\n\n(?!<)/g, "</p><p>")
    // Line breaks
    .replace(/\n(?!<)/g, "<br />");

  // Wrap consecutive li in ul
  html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
  // Fix double-wrapped ul
  html = html.replace(/<ul><ul>/g, "<ul>").replace(/<\/ul><\/ul>/g, "</ul>");

  return `<p>${html}</p>`;
}

/**
 * Estimate reading time
 */
export function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
