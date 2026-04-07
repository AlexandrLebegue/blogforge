import axios from 'axios';

const OPENROUTER_API_BASE_URL = 'https://openrouter.ai/api/v1';
const AI_MODEL = 'mistralai/mistral-small-24b-instruct-2501:free';

const openRouterApi = axios.create({
  baseURL: OPENROUTER_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': '{{BLOG_NAME}} AI Assistant',
  },
});

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const generateCompletion = async (
  messages: OpenRouterMessage[],
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<string> => {
  try {
    const request: OpenRouterRequest = {
      model: AI_MODEL,
      messages,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
    };

    const response = await openRouterApi.post<OpenRouterResponse>('/chat/completions', request);

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No completion choices returned from OpenRouter API');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating completion with OpenRouter:', error);
    throw error;
  }
};

const openrouterService = { generateCompletion };
export default openrouterService;
