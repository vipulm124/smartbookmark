import {
  BookmarkCategory,
  ContentType,
  SharePayload,
} from "../types/bookmark";

const TECHNICAL_DOMAINS = [
  "github.com",
  "gitlab.com",
  "stackoverflow.com",
  "stackexchange.com",
  "dev.to",
  "hackernoon.com",
  "arxiv.org",
  "npmjs.com",
  "pypi.org",
  "docs.",
  "developer.",
  "readthedocs",
  "mdn.",
  "w3.org",
  "freecodecamp.org",
  "leetcode.com",
  "hackerrank.com",
  "kaggle.com",
  "towardsdatascience.com",
  "infoq.com",
  "techcrunch.com",
  "theverge.com/tech",
  "wired.com",
  "arxiv.org",
  "scholar.google",
  "medium.com/@",
  "substack.com",
  "notion.so",
  "figma.com",
  "vercel.com",
  "netlify.com",
  "aws.amazon.com",
  "cloud.google.com",
  "learn.microsoft.com",
  "digitalocean.com",
  "hashnode.dev",
  "css-tricks.com",
  "smashingmagazine.com",
];

const ENTERTAINMENT_DOMAINS = [
  "youtube.com",
  "youtu.be",
  "instagram.com",
  "tiktok.com",
  "netflix.com",
  "spotify.com",
  "soundcloud.com",
  "twitch.tv",
  "reddit.com/r/funny",
  "reddit.com/r/memes",
  "reddit.com/r/entertainment",
  "imdb.com",
  "9gag.com",
  "buzzfeed.com",
  "vimeo.com",
  "dailymotion.com",
  "pinterest.com",
  "snapchat.com",
  "facebook.com/watch",
  "twitter.com",
  "x.com",
  "threads.net",
];

const TECHNICAL_KEYWORDS = [
  "tutorial",
  "documentation",
  "api",
  "programming",
  "coding",
  "developer",
  "javascript",
  "typescript",
  "python",
  "react",
  "algorithm",
  "database",
  "kubernetes",
  "docker",
  "machine learning",
  "artificial intelligence",
  "software",
  "engineering",
  "framework",
  "library",
  "open source",
  "github",
  "stack overflow",
  "how to build",
  "deep dive",
  "architecture",
  "devops",
  "cloud",
  "security",
  "cybersecurity",
  "data science",
  "backend",
  "frontend",
  "fullstack",
  "css",
  "html",
  "node",
  "rust",
  "golang",
  "java",
  "swift",
  "kotlin",
];

const ENTERTAINMENT_KEYWORDS = [
  "funny",
  "meme",
  "comedy",
  "music",
  "movie",
  "trailer",
  "gaming",
  "gameplay",
  "vlog",
  "dance",
  "celebrity",
  "entertainment",
  "viral",
  "trending",
  "reel",
  "shorts",
  "podcast",
  "sports",
  "highlights",
  "recipe",
  "cooking",
  "travel",
  "lifestyle",
  "fashion",
  "beauty",
  "prank",
  "challenge",
  "asmr",
  "reaction",
];

function extractUrl(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/i);
  return urlMatch ? urlMatch[0] : null;
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function getPathname(url: string): string {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return "";
  }
}

export function detectContentType(url: string, text: string): ContentType {
  const hostname = getHostname(url);
  const pathname = getPathname(url);
  const combined = `${url} ${text}`.toLowerCase();

  if (
    hostname.includes("instagram.com") &&
    (pathname.includes("/reel") || pathname.includes("/reels"))
  ) {
    return "reel";
  }

  if (
    hostname.includes("tiktok.com") ||
    combined.includes("reel") ||
    combined.includes("/shorts")
  ) {
    return "reel";
  }

  if (
    hostname.includes("youtube.com") ||
    hostname.includes("youtu.be") ||
    hostname.includes("vimeo.com") ||
    hostname.includes("twitch.tv") ||
    hostname.includes("dailymotion.com")
  ) {
    return "video";
  }

  if (
    hostname.includes("twitter.com") ||
    hostname.includes("x.com") ||
    hostname.includes("threads.net") ||
    hostname.includes("linkedin.com/posts") ||
    hostname.includes("facebook.com")
  ) {
    return "social";
  }

  if (
    /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i.test(url) ||
    hostname.includes("imgur.com") ||
    hostname.includes("pinterest.com/pin")
  ) {
    return "image";
  }

  if (
    hostname.includes("medium.com") ||
    hostname.includes("substack.com") ||
    hostname.includes("blog.") ||
    pathname.includes("/article") ||
    pathname.includes("/post") ||
    pathname.includes("/news")
  ) {
    return "article";
  }

  return "other";
}

function scoreKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((score, keyword) => {
    return lower.includes(keyword) ? score + 1 : score;
  }, 0);
}

function scoreDomains(url: string, domains: string[]): number {
  const hostname = getHostname(url);
  const fullUrl = url.toLowerCase();
  return domains.reduce((score, domain) => {
    if (hostname.includes(domain) || fullUrl.includes(domain)) {
      return score + 2;
    }
    return score;
  }, 0);
}

export function categorizeContent(
  url: string,
  title: string,
  description: string
): BookmarkCategory {
  const combinedText = `${title} ${description} ${url}`;

  const techScore =
    scoreDomains(url, TECHNICAL_DOMAINS) +
    scoreKeywords(combinedText, TECHNICAL_KEYWORDS);
  const entertainmentScore =
    scoreDomains(url, ENTERTAINMENT_DOMAINS) +
    scoreKeywords(combinedText, ENTERTAINMENT_KEYWORDS);

  if (techScore > entertainmentScore && techScore >= 2) {
    return "technical";
  }

  if (entertainmentScore > techScore && entertainmentScore >= 2) {
    return "entertainment";
  }

  if (techScore === entertainmentScore && techScore > 0) {
    const contentType = detectContentType(url, combinedText);
    if (contentType === "article") return "technical";
    if (contentType === "video" || contentType === "reel") {
      return "entertainment";
    }
  }

  return "other";
}

export function generateTitle(url: string, text: string, metaTitle?: string): string {
  if (metaTitle && metaTitle.trim().length > 0) {
    return metaTitle.trim();
  }

  const cleanText = text
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanText.length >= 5 && cleanText.length <= 120) {
    return cleanText;
  }

  const hostname = getHostname(url);
  if (hostname) {
    const parts = getPathname(url)
      .split("/")
      .filter(Boolean)
      .map((part) => decodeURIComponent(part).replace(/[-_]/g, " "));

    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      if (lastPart.length > 3 && lastPart.length < 80) {
        return `${capitalize(hostname.split(".")[0])}: ${capitalize(lastPart)}`;
      }
    }

    return `Shared from ${capitalize(hostname.split(".")[0])}`;
  }

  return cleanText.slice(0, 80) || "Shared bookmark";
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function extractTags(
  url: string,
  title: string,
  category: BookmarkCategory,
  contentType: ContentType
): string[] {
  const tags = new Set<string>();
  tags.add(category);
  tags.add(contentType);

  const hostname = getHostname(url);
  if (hostname) {
    const mainDomain = hostname.split(".").slice(-2, -1)[0] || hostname;
    tags.add(mainDomain);
  }

  return Array.from(tags);
}

export function processSharePayload(payload: SharePayload): {
  url: string;
  title: string;
  description: string;
  category: BookmarkCategory;
  contentType: ContentType;
  tags: string[];
} {
  const url =
    payload.url ||
    (payload.text ? extractUrl(payload.text) : null) ||
    "";

  const text = payload.text || "";
  const title = generateTitle(url, text, payload.title);
  const description = text.replace(url, "").trim() || title;
  const contentType = detectContentType(url, text);
  const category = categorizeContent(url, title, description);
  const tags = extractTags(url, title, category, contentType);

  return { url, title, description, category, contentType, tags };
}
