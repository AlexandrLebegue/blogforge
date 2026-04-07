import { NextRequest, NextResponse } from 'next/server';
import { getAllArticleMetadata } from '@/lib/markdown';
import { generateCompletion, OpenRouterMessage } from '@/lib/ai_services';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const articles = getAllArticleMetadata();

    const systemPrompt = `You are a helpful AI assistant for the blog "{{BLOG_NAME}}", specialized in {{THEME}}.

Your role is to help readers find relevant articles and answer questions about {{CONTENT_ABOUT}}.

Available articles on the blog:
${articles.map((article, index) => `
${index + 1}. Title: "${article.title}"
   Summary: ${article.excerpt}
   Keywords: ${article.keywords.join(', ')}
   Slug: ${article.slug}
`).join('\n')}

IMPORTANT: When recommending an article, use EXACTLY this format:
[ARTICLE:article-slug]

For example: [ARTICLE:getting-started-guide]

Instructions:
- Be helpful, friendly and concise
- If the question relates to an article topic, recommend it using [ARTICLE:slug]
- You can recommend multiple articles if relevant
- If no article matches, give general helpful advice about {{THEME}}
- Use a warm, encouraging tone`;

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const aiResponse = await generateCompletion(messages, { maxTokens: 500, temperature: 0.7 });

    const articlePattern = /\[ARTICLE:([^\]]+)\]/g;
    const matches = Array.from(aiResponse.matchAll(articlePattern));
    const referencedArticles = matches
      .map(match => articles.find(a => a.slug === match[1]))
      .filter((article): article is NonNullable<typeof article> => article !== null && article !== undefined);

    const cleanedResponse = aiResponse.replace(articlePattern, '');

    return NextResponse.json({ response: cleanedResponse, articles: referencedArticles, success: true });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ error: 'Error processing your message. Please try again.', success: false }, { status: 500 });
  }
}
