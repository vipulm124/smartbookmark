import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bookmark, BookmarkCategory } from "../types/bookmark";

const STORAGE_KEY = "smartbookmark_bookmarks";

async function readAll(): Promise<Bookmark[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Bookmark[];
}

async function writeAll(bookmarks: Bookmark[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export async function saveBookmark(
  bookmark: Omit<Bookmark, "id" | "createdAt"> & { id?: string }
): Promise<Bookmark> {
  const bookmarks = await readAll();
  const id = bookmark.id || `bm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = Date.now();
  const saved: Bookmark = { ...bookmark, id, createdAt };
  bookmarks.unshift(saved);
  await writeAll(bookmarks);
  return saved;
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  const bookmarks = await readAll();
  return bookmarks.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getBookmarksByCategory(
  category: BookmarkCategory
): Promise<Bookmark[]> {
  const bookmarks = await getAllBookmarks();
  return bookmarks.filter((b) => b.category === category);
}

export async function getBookmarkById(id: string): Promise<Bookmark | null> {
  const bookmarks = await readAll();
  return bookmarks.find((b) => b.id === id) ?? null;
}

export async function deleteBookmark(id: string): Promise<void> {
  const bookmarks = await readAll();
  await writeAll(bookmarks.filter((b) => b.id !== id));
}

export async function updateBookmarkCategory(
  id: string,
  category: BookmarkCategory
): Promise<void> {
  const bookmarks = await readAll();
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index >= 0) {
    bookmarks[index] = { ...bookmarks[index], category };
    await writeAll(bookmarks);
  }
}

export async function getBookmarkCounts(): Promise<
  Record<BookmarkCategory, number> & { total: number }
> {
  const bookmarks = await readAll();
  const counts: Record<BookmarkCategory, number> & { total: number } = {
    technical: 0,
    entertainment: 0,
    other: 0,
    total: bookmarks.length,
  };
  for (const bookmark of bookmarks) {
    counts[bookmark.category]++;
  }
  return counts;
}
