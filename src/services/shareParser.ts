import { ShareIntent } from "expo-share-intent";
import { SharePayload } from "../types/bookmark";

export function parseShareIntent(shareIntent: ShareIntent): SharePayload {
  const url =
    shareIntent.webUrl ||
    shareIntent.text?.match(/https?:\/\/[^\s]+/)?.[0] ||
    undefined;

  const text = shareIntent.text || shareIntent.webUrl || "";
  const title = shareIntent.meta?.title || undefined;
  const sourceApp = shareIntent.meta?.["com.apple.UIKit.activity.applicationBundleId"] as
    | string
    | undefined;

  const thumbnailUrl =
    shareIntent.files?.[0]?.path ||
    shareIntent.meta?.["og:image"] ||
    undefined;

  return { url, text, title, sourceApp, thumbnailUrl };
}

export function formatSourceApp(sourceApp?: string): string {
  if (!sourceApp) return "Unknown app";

  const knownApps: Record<string, string> = {
    "com.burbn.instagram": "Instagram",
    "com.google.ios.youtube": "YouTube",
    "com.google.android.youtube": "YouTube",
    "com.twitter.android": "X (Twitter)",
    "com.atebits.Tweetie2": "X (Twitter)",
    "com.zhiliaoapp.musically": "TikTok",
    "com.ss.android.ugc.trill": "TikTok",
    "com.reddit.Reddit": "Reddit",
    "com.linkedin.LinkedIn": "LinkedIn",
    "com.apple.mobilesafari": "Safari",
    "com.android.chrome": "Chrome",
    "org.mozilla.firefox": "Firefox",
    "com.facebook.Facebook": "Facebook",
    "com.medium.reader": "Medium",
    "com.github.android": "GitHub",
  };

  return knownApps[sourceApp] || sourceApp.split(".").pop() || "Unknown app";
}
