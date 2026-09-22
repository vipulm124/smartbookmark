import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CATEGORY_CONFIG, CONTENT_TYPE_CONFIG } from "../constants/categories";
import { colors, radius, spacing } from "../constants/theme";
import { Bookmark } from "../types/bookmark";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onPress: () => void;
}

export function BookmarkCard({ bookmark, onPress }: BookmarkCardProps) {
  const categoryConfig = CATEGORY_CONFIG[bookmark.category];
  const contentConfig = CONTENT_TYPE_CONFIG[bookmark.contentType];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: categoryConfig.bgColor },
          ]}
        >
          <Ionicons
            name={categoryConfig.icon as keyof typeof Ionicons.glyphMap}
            size={12}
            color={categoryConfig.color}
          />
          <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
            {categoryConfig.label}
          </Text>
        </View>
        <View style={styles.typeBadge}>
          <Ionicons
            name={contentConfig.icon as keyof typeof Ionicons.glyphMap}
            size={12}
            color={colors.textSecondary}
          />
          <Text style={styles.typeText}>{contentConfig.label}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {bookmark.title}
      </Text>

      {bookmark.description && bookmark.description !== bookmark.title && (
        <Text style={styles.description} numberOfLines={2}>
          {bookmark.description}
        </Text>
      )}

      {bookmark.url && (
        <Text style={styles.url} numberOfLines={1}>
          {bookmark.url}
        </Text>
      )}

      <View style={styles.footer}>
        {bookmark.sourceApp && (
          <Text style={styles.source}>via {bookmark.sourceApp}</Text>
        )}
        <Text style={styles.date}>
          {new Date(bookmark.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
  },
  typeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  url: {
    fontSize: 12,
    color: colors.accentLight,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  source: {
    fontSize: 11,
    color: colors.textMuted,
  },
  date: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
