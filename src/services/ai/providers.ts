export type AIProvider = "groq" | "gemini" | "openai" | "openrouter";

export interface ProviderConfig {
  id: AIProvider;
  label: string;
  defaultModel: string;
  endpoint: string;
  /** Approximate cost per 1M input tokens (USD) for the default model */
  costHint: string;
  keyUrl: string;
  buildHeaders: (apiKey: string) => Record<string, string>;
  buildBody: (model: string, system: string, user: string) => unknown;
  extractContent: (data: unknown) => string | null;
}

const SYSTEM_PROMPT =
  "You classify shared bookmarks. Respond with valid JSON only.";

function openAICompatibleBody(model: string, system: string, user: string) {
  return {
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
}

function extractOpenAIContent(data: unknown): string | null {
  const d = data as { choices?: Array<{ message?: { content?: string } }> };
  return d.choices?.[0]?.message?.content ?? null;
}

export const AI_PROVIDERS: Record<AIProvider, ProviderConfig> = {
  groq: {
    id: "groq",
    label: "Groq",
    defaultModel: "llama-3.1-8b-instant",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    costHint: "Free tier available — very fast",
    keyUrl: "https://console.groq.com/keys",
    buildHeaders: (key) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    }),
    buildBody: openAICompatibleBody,
    extractContent: extractOpenAIContent,
  },
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    defaultModel: "gemini-2.0-flash-lite",
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/models",
    costHint: "~$0.075/1M tokens — Google's cheapest model",
    keyUrl: "https://aistudio.google.com/apikey",
    buildHeaders: () => ({ "Content-Type": "application/json" }),
    buildBody: (_model, system, user) => ({
      contents: [{ parts: [{ text: `${system}\n\n${user}` }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
    extractContent: (data) => {
      const d = data as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      return d.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    },
  },
  openai: {
    id: "openai",
    label: "OpenAI",
    defaultModel: "gpt-4o-mini",
    endpoint: "https://api.openai.com/v1/chat/completions",
    costHint: "~$0.15/1M tokens",
    keyUrl: "https://platform.openai.com/api-keys",
    buildHeaders: (key) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    }),
    buildBody: openAICompatibleBody,
    extractContent: extractOpenAIContent,
  },
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    defaultModel: "google/gemma-2-9b-it:free",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    costHint: "Free models available via OpenRouter",
    keyUrl: "https://openrouter.ai/keys",
    buildHeaders: (key) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://smartbookmark.app",
      "X-Title": "Smart Bookmark",
    }),
    buildBody: openAICompatibleBody,
    extractContent: extractOpenAIContent,
  },
};

export function getProviderEndpoint(
  provider: ProviderConfig,
  model: string,
  apiKey: string
): string {
  if (provider.id === "gemini") {
    return `${provider.endpoint}/${model}:generateContent?key=${apiKey}`;
  }
  return provider.endpoint;
}

export function buildClassificationPrompt(input: {
  url: string;
  title: string;
  description: string;
}): string {
  return `You are a smart bookmark classifier for a mobile app.

Analyze the shared content and classify it into exactly one category and one content type.

Categories:
- technical: programming, engineering, tutorials, documentation, science, productivity tools, tech news
- entertainment: videos, reels, music, memes, gaming, sports, lifestyle, comedy, social media fun
- other: everything that does not clearly fit technical or entertainment

Content types:
- article, video, reel, social, image, other

Return JSON only:
{
  "category": "technical|entertainment|other",
  "contentType": "article|video|reel|social|image|other",
  "summary": "one short sentence explaining why"
}

Shared content:
URL: ${input.url || "(none)"}
Title: ${input.title || "(none)"}
Description: ${input.description || "(none)"}`;
}

export { SYSTEM_PROMPT };
