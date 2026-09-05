import {
  BookmarkCategory,
  ContentType,
} from "../types/bookmark";

export interface AICategorizationResult {
  category: BookmarkCategory;
  contentType: ContentType;
  summary?: string;
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

function getApiKey(): string | null {
  const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  return key && key.trim().length > 0 ? key.trim() : null;
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
  return getApiKey() !== null;
}

export async function categorizeWithAI(input: {
  url: string;
  title: string;
  description: string;
}): Promise<AICategorizationResult | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const prompt = `You are a smart bookmark classifier for a mobile app.

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

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You classify shared bookmarks. Respond with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    return parseAIResponse(content);
  } catch {
    return null;
  }
}
