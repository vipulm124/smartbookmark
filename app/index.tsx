import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookmarkCard } from "../src/components/BookmarkCard";
import { CategoryFilter } from "../src/components/CategoryFilter";
import { EmptyState } from "../src/components/EmptyState";
import { colors, spacing } from "../src/constants/theme";
import { seedDemoBookmarks } from "../src/services/demoData";
import { getAllBookmarks, getBookmarkCounts } from "../src/services/storage";
import { Bookmark, BookmarkCategory } from "../src/types/bookmark";

export default function HomeScreen() {
  const router = useRouter();
  const { hasShareIntent } = useShareIntentContext();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filter, setFilter] = useState<BookmarkCategory | "all">("all");
  const [counts, setCounts] = useState<
    Record<BookmarkCategory | "all", number>
  >({
    all: 0,
    technical: 0,
    entertainment: 0,
    other: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadBookmarks = useCallback(async () => {
    const [all, bookmarkCounts] = await Promise.all([
      getAllBookmarks(),
      getBookmarkCounts(),
    ]);
    setBookmarks(all);
    setCounts({
      all: bookmarkCounts.total,
      technical: bookmarkCounts.technical,
      entertainment: bookmarkCounts.entertainment,
      other: bookmarkCounts.other,
    });
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    if (hasShareIntent) {
      router.replace("/shareintent");
    }
  }, [hasShareIntent, router]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  const filteredBookmarks =
    filter === "all"
      ? bookmarks
      : bookmarks.filter((b) => b.category === filter);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Smart Bookmark</Text>
          <Text style={styles.subtitle}>
            Share from any app — AI sorts it for you
          </Text>
        </View>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>SB</Text>
        </View>
      </View>

      <CategoryFilter
        selected={filter}
        counts={counts}
        onSelect={setFilter}
      />

      <FlatList
        data={filteredBookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookmarkCard
            bookmark={item}
            onPress={() => router.push(`/bookmark/${item.id}`)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          filteredBookmarks.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={
          <EmptyState
            filter={filter}
            onLoadDemo={async () => {
              await seedDemoBookmarks();
              await loadBookmarks();
            }}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accentLight}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  listEmpty: {
    flexGrow: 1,
  },
});
