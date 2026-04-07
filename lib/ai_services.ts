export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1";
const AI_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

export async function generateCompletion(
  messages: OpenRouterMessage[],
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const res = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Blog Generator AI",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      max_tokens: options.maxTokens ?? 2000,
      temperature: options.temperature ?? 0.75,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || content.trim() === "") {
    throw new Error("Empty response from AI");
  }
  return content;
}
