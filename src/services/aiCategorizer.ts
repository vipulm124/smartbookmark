import {
  BookmarkCategory,
  ContentType,
} from "../types/bookmark";
import {
  AI_PROVIDERS,
  AIProvider,
  buildClassificationPrompt,
  getProviderEndpoint,
  SYSTEM_PROMPT,
} from "./ai/providers";

export interface AICategorizationResult {
  category: BookmarkCategory;
  contentType: ContentType;
  summary?: string;
  provider?: AIProvider;
  model?: string;
}

const VALID_CATEGORIES: BookmarkCategory[] = [
  "technical",
  "entertainment",
  "other",
];

const VALID_CONTENT_TYPES: ContentType[] = [
  "article",
  "video",
  "reel",
  "social",
  "image",
  "other",
];

/** Provider priority: cheapest/fastest first */
const PROVIDER_PRIORITY: AIProvider[] = [
  "groq",
  "gemini",
  "openrouter",
  "openai",
];

const PROVIDER_KEY_ENV: Record<AIProvider, string> = {
  groq: "EXPO_PUBLIC_GROQ_API_KEY",
  gemini: "EXPO_PUBLIC_GEMINI_API_KEY",
  openrouter: "EXPO_PUBLIC_OPENROUTER_API_KEY",
  openai: "EXPO_PUBLIC_OPENAI_API_KEY",
};

function getEnv(key: string): string | null {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : null;
}

function getConfiguredProvider(): {
  provider: AIProvider;
  apiKey: string;
  model?: string;
} | null {
  const explicit = getEnv("EXPO_PUBLIC_AI_PROVIDER") as AIProvider | null;
  const modelOverride = getEnv("EXPO_PUBLIC_AI_MODEL");

  if (explicit && AI_PROVIDERS[explicit]) {
    const apiKey = getEnv(PROVIDER_KEY_ENV[explicit]);
    if (apiKey) return { provider: explicit, apiKey, model: modelOverride ?? undefined };
  }

  // Auto-detect: use first provider with a configured key (cheapest first)
  for (const id of PROVIDER_PRIORITY) {
    const apiKey = getEnv(PROVIDER_KEY_ENV[id]);
    if (apiKey) return { provider: id, apiKey, model: modelOverride ?? undefined };
  }

  // Legacy: single EXPO_PUBLIC_OPENAI_API_KEY without provider set
  const legacyKey = getEnv("EXPO_PUBLIC_OPENAI_API_KEY");
  if (legacyKey && !explicit) {
    return { provider: "openai", apiKey: legacyKey, model: modelOverride ?? undefined };
  }

  return null;
}

function parseAIResponse(content: string): AICategorizationResult | null {
  try {
    const parsed = JSON.parse(content) as {
      category?: string;
      contentType?: string;
      summary?: string;
    };

    if (
      !parsed.category ||
      !VALID_CATEGORIES.includes(parsed.category as BookmarkCategory)
    ) {
      return null;
    }

    const contentType = VALID_CONTENT_TYPES.includes(
      parsed.contentType as ContentType
    )
      ? (parsed.contentType as ContentType)
      : "other";

    return {
      category: parsed.category as BookmarkCategory,
      contentType,
      summary: parsed.summary?.trim() || undefined,
    };
  } catch {
    return null;
  }
}

export function isAICategorizationAvailable(): boolean {
  return getConfiguredProvider() !== null;
}

export function getActiveProviderInfo(): {
  provider: AIProvider;
  model: string;
  label: string;
} | null {
  const config = getConfiguredProvider();
  if (!config) return null;
  const providerConfig = AI_PROVIDERS[config.provider];
  return {
    provider: config.provider,
    model: config.model ?? providerConfig.defaultModel,
    label: providerConfig.label,
  };
}

async function callProvider(
  providerId: AIProvider,
  apiKey: string,
  model: string,
  input: { url: string; title: string; description: string }
): Promise<AICategorizationResult | null> {
  const provider = AI_PROVIDERS[providerId];
  const userPrompt = buildClassificationPrompt(input);
  const endpoint = getProviderEndpoint(provider, model, apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: provider.buildHeaders(apiKey),
    body: JSON.stringify(
      provider.buildBody(model, SYSTEM_PROMPT, userPrompt)
    ),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const content = provider.extractContent(data);
  if (!content) return null;

  const result = parseAIResponse(content);
  if (!result) return null;

  return { ...result, provider: providerId, model };
}

export async function categorizeWithAI(input: {
  url: string;
  title: string;
  description: string;
}): Promise<AICategorizationResult | null> {
  const config = getConfiguredProvider();
  if (!config) return null;

  const providerConfig = AI_PROVIDERS[config.provider];
  const model = config.model ?? providerConfig.defaultModel;

  try {
    return await callProvider(config.provider, config.apiKey, model, input);
  } catch {
    return null;
  }
}
