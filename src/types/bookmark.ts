export type BookmarkCategory = "technical" | "entertainment" | "other";

export type ContentType =
  | "article"
  | "video"
  | "reel"
  | "social"
  | "image"
  | "other";

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  category: BookmarkCategory;
  contentType: ContentType;
  sourceApp: string;
  thumbnailUrl: string | null;
  createdAt: number;
  tags: string[];
}

export interface SharePayload {
  url?: string;
  text?: string;
  title?: string;
  sourceApp?: string;
  thumbnailUrl?: string;
}
