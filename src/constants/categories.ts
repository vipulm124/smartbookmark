import { BookmarkCategory, ContentType } from "../types/bookmark";

export const CATEGORY_CONFIG: Record<
  BookmarkCategory,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  technical: {
    label: "Technical",
    icon: "code-slash",
    color: "#38BDF8",
    bgColor: "#0C4A6E",
  },
  entertainment: {
    label: "Entertainment",
    icon: "play-circle",
    color: "#F472B6",
    bgColor: "#831843",
  },
  other: {
    label: "Other",
    icon: "bookmark",
    color: "#A78BFA",
    bgColor: "#4C1D95",
  },
};

export const CONTENT_TYPE_CONFIG: Record<
  ContentType,
  { label: string; icon: string }
> = {
  article: { label: "Article", icon: "document-text" },
  video: { label: "Video", icon: "videocam" },
  reel: { label: "Reel", icon: "film" },
  social: { label: "Social", icon: "chatbubbles" },
  image: { label: "Image", icon: "image" },
  other: { label: "Link", icon: "link" },
};
