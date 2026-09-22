import { saveBookmark } from "./storage";
import { BookmarkCategory, ContentType } from "../types/bookmark";

const DEMO_BOOKMARKS = [
  {
    url: "https://github.com/facebook/react",
    title: "React — A JavaScript library for building user interfaces",
    description: "Open source UI library for web and native apps",
    category: "technical" as BookmarkCategory,
    contentType: "other" as ContentType,
    sourceApp: "Chrome",
    thumbnailUrl: null,
    tags: ["technical", "other", "github"],
  },
  {
    url: "https://stackoverflow.com/questions/12345/how-to-use-react-hooks",
    title: "How to use React hooks effectively?",
    description: "javascript react hooks useState useEffect programming",
    category: "technical" as BookmarkCategory,
    contentType: "article" as ContentType,
    sourceApp: "Safari",
    thumbnailUrl: null,
    tags: ["technical", "article", "stackoverflow"],
  },
  {
    url: "https://www.instagram.com/reel/ABC123xyz/",
    title: "Funny dance reel — viral trending",
    description: "Check out this hilarious reel!",
    category: "entertainment" as BookmarkCategory,
    contentType: "reel" as ContentType,
    sourceApp: "Instagram",
    thumbnailUrl: null,
    tags: ["entertainment", "reel", "instagram"],
  },
  {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Never Gonna Give You Up — Music Video",
    description: "Classic music video entertainment",
    category: "entertainment" as BookmarkCategory,
    contentType: "video" as ContentType,
    sourceApp: "YouTube",
    thumbnailUrl: null,
    tags: ["entertainment", "video", "youtube"],
  },
  {
    url: "https://dev.to/someone/building-a-rest-api-with-nodejs",
    title: "Building a REST API with Node.js",
    description: "Tutorial on backend development and API design",
    category: "technical" as BookmarkCategory,
    contentType: "article" as ContentType,
    sourceApp: "Chrome",
    thumbnailUrl: null,
    tags: ["technical", "article", "dev"],
  },
  {
    url: "https://www.tiktok.com/@user/video/123456",
    title: "Cooking hack you need to try",
    description: "Quick recipe viral trending lifestyle",
    category: "entertainment" as BookmarkCategory,
    contentType: "reel" as ContentType,
    sourceApp: "TikTok",
    thumbnailUrl: null,
    tags: ["entertainment", "reel", "tiktok"],
  },
  {
    url: "https://example.com/random-article",
    title: "Interesting article about local news",
    description: "A general article shared from a friend",
    category: "other" as BookmarkCategory,
    contentType: "article" as ContentType,
    sourceApp: "Messages",
    thumbnailUrl: null,
    tags: ["other", "article", "example"],
  },
];

export async function seedDemoBookmarks(): Promise<number> {
  let count = 0;
  for (const bookmark of DEMO_BOOKMARKS) {
    await saveBookmark(bookmark);
    count++;
  }
  return count;
}
