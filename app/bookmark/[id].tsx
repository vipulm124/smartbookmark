import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import {
  CATEGORY_CONFIG,
  CONTENT_TYPE_CONFIG,
} from "../../src/constants/categories";
import { colors, radius, spacing } from "../../src/constants/theme";
import {
  deleteBookmark,
  getBookmarkById,
  updateBookmarkCategory,
} from "../../src/services/storage";
import { Bookmark, BookmarkCategory } from "../../src/types/bookmark";

const CATEGORIES: BookmarkCategory[] = [
  "technical",
  "entertainment",
  "other",
];

export default function BookmarkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);

  const loadBookmark = useCallback(async () => {
    if (!id) return;
    const result = await getBookmarkById(id);
    setBookmark(result);
  }, [id]);

  useEffect(() => {
    loadBookmark();
  }, [loadBookmark]);

  const handleOpen = async () => {
    if (!bookmark?.url) return;
    try {
      await WebBrowser.openBrowserAsync(bookmark.url);
    } catch {
      Linking.openURL(bookmark.url);
    }
  };

  const handleCategoryChange = async (category: BookmarkCategory) => {
    if (!bookmark) return;
    await updateBookmarkCategory(bookmark.id, category);
    setBookmark({ ...bookmark, category });
  };

  const handleDelete = () => {
    if (!bookmark) return;
    Alert.alert(
      "Delete bookmark",
      "Are you sure you want to remove this bookmark?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteBookmark(bookmark.id);
            router.back();
          },
        },
      ]
    );
  };

  if (!bookmark) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  const categoryConfig = CATEGORY_CONFIG[bookmark.category];
  const contentConfig = CONTENT_TYPE_CONFIG[bookmark.contentType];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.badges}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: categoryConfig.bgColor },
          ]}
        >
          <Ionicons
            name={categoryConfig.icon as keyof typeof Ionicons.glyphMap}
            size={16}
            color={categoryConfig.color}
          />
          <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
            {categoryConfig.label}
          </Text>
        </View>
        <View style={styles.typeBadge}>
          <Ionicons
            name={contentConfig.icon as keyof typeof Ionicons.glyphMap}
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.typeText}>{contentConfig.label}</Text>
        </View>
      </View>

      <Text style={styles.title}>{bookmark.title}</Text>

      {bookmark.description && bookmark.description !== bookmark.title && (
        <Text style={styles.description}>{bookmark.description}</Text>
      )}

      {bookmark.url && (
        <Pressable style={styles.urlCard} onPress={handleOpen}>
          <Ionicons name="link" size={18} color={colors.accentLight} />
          <Text style={styles.url} numberOfLines={2}>{bookmark.url}</Text>
          <Ionicons name="open-outline" size={18} color={colors.textMuted} />
        </Pressable>
      )}

      <View style={styles.meta}>
        {bookmark.sourceApp && (
          <MetaRow icon="phone-portrait-outline" label="Shared from" value={bookmark.sourceApp} />
        )}
        <MetaRow
          icon="calendar-outline"
          label="Saved"
          value={new Date(bookmark.createdAt).toLocaleString()}
        />
      </View>

      <Text style={styles.sectionTitle}>Recategorize</Text>
      <View style={styles.categoryPicker}>
        {CATEGORIES.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const isActive = bookmark.category === cat;
          return (
            <Pressable
              key={cat}
              testID={`recategorize-${cat}`}
              onPress={() => handleCategoryChange(cat)}
              style={[
                styles.categoryOption,
                isActive && {
                  borderColor: config.color,
                  backgroundColor: config.bgColor + "60",
                },
              ]}
            >
              <Ionicons
                name={config.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={isActive ? config.color : colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryOptionText,
                  isActive && { color: config.color },
                ]}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {bookmark.url && (
        <Pressable style={styles.openButton} onPress={handleOpen}>
          <Ionicons name="globe-outline" size={20} color={colors.text} />
          <Text style={styles.openButtonText}>Open in browser</Text>
        </Pressable>
      )}

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
        <Text style={styles.deleteText}>Delete bookmark</Text>
      </Pressable>
    </ScrollView>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metaRow}>
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={16}
        color={colors.textMuted}
      />
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  typeText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 32,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  urlCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  url: {
    flex: 1,
    fontSize: 13,
    color: colors.accentLight,
  },
  meta: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  metaLabel: {
    fontSize: 13,
    color: colors.textMuted,
    width: 90,
  },
  metaValue: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categoryPicker: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryOption: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border + "40",
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  openButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.md,
  },
  deleteText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: "500",
  },
});
