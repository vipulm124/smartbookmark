import * as SQLite from "expo-sqlite";
import { Bookmark, BookmarkCategory } from "../types/bookmark";

const DB_NAME = "smartbookmark.db";

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY NOT NULL,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL,
        content_type TEXT NOT NULL,
        source_app TEXT NOT NULL DEFAULT '',
        thumbnail_url TEXT,
        created_at INTEGER NOT NULL,
        tags TEXT NOT NULL DEFAULT '[]'
      );
      CREATE INDEX IF NOT EXISTS idx_bookmarks_category ON bookmarks(category);
      CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);
    `);
  }
  return db;
}

function rowToBookmark(row: Record<string, unknown>): Bookmark {
  return {
    id: row.id as string,
    url: row.url as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as BookmarkCategory,
    contentType: row.content_type as Bookmark["contentType"],
    sourceApp: row.source_app as string,
    thumbnailUrl: (row.thumbnail_url as string) || null,
    createdAt: row.created_at as number,
    tags: JSON.parse((row.tags as string) || "[]"),
  };
}

export async function saveBookmark(
  bookmark: Omit<Bookmark, "id" | "createdAt"> & { id?: string }
): Promise<Bookmark> {
  const database = await getDb();
  const id = bookmark.id || `bm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = Date.now();

  await database.runAsync(
    `INSERT INTO bookmarks (id, url, title, description, category, content_type, source_app, thumbnail_url, created_at, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      bookmark.url,
      bookmark.title,
      bookmark.description,
      bookmark.category,
      bookmark.contentType,
      bookmark.sourceApp,
      bookmark.thumbnailUrl,
      createdAt,
      JSON.stringify(bookmark.tags),
    ]
  );

  return { ...bookmark, id, createdAt };
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  const database = await getDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM bookmarks ORDER BY created_at DESC"
  );
  return rows.map((row) => rowToBookmark(row as Record<string, unknown>));
}

export async function getBookmarksByCategory(
  category: BookmarkCategory
): Promise<Bookmark[]> {
  const database = await getDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM bookmarks WHERE category = ? ORDER BY created_at DESC",
    [category]
  );
  return rows.map((row) => rowToBookmark(row as Record<string, unknown>));
}

export async function getBookmarkById(id: string): Promise<Bookmark | null> {
  const database = await getDb();
  const row = await database.getFirstAsync(
    "SELECT * FROM bookmarks WHERE id = ?",
    [id]
  );
  return row ? rowToBookmark(row as Record<string, unknown>) : null;
}

export async function deleteBookmark(id: string): Promise<void> {
  const database = await getDb();
  await database.runAsync("DELETE FROM bookmarks WHERE id = ?", [id]);
}

export async function updateBookmarkCategory(
  id: string,
  category: BookmarkCategory
): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    "UPDATE bookmarks SET category = ? WHERE id = ?",
    [category, id]
  );
}

export async function getBookmarkCounts(): Promise<
  Record<BookmarkCategory, number> & { total: number }
> {
  const database = await getDb();
  const rows = await database.getAllAsync(
    "SELECT category, COUNT(*) as count FROM bookmarks GROUP BY category"
  );

  const counts: Record<BookmarkCategory, number> & { total: number } = {
    technical: 0,
    entertainment: 0,
    other: 0,
    total: 0,
  };

  for (const row of rows) {
    const { category, count } = row as { category: BookmarkCategory; count: number };
    counts[category] = count;
    counts.total += count;
  }

  return counts;
}
