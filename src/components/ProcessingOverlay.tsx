import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CATEGORY_CONFIG, CONTENT_TYPE_CONFIG } from "../constants/categories";
import { colors, radius, spacing } from "../constants/theme";
import { BookmarkCategory, ContentType } from "../types/bookmark";

interface ProcessingOverlayProps {
  title: string;
  category?: BookmarkCategory;
  contentType?: ContentType;
}

export function ProcessingOverlay({
  title,
  category,
  contentType,
}: ProcessingOverlayProps) {
  const categoryConfig = category ? CATEGORY_CONFIG[category] : null;
  const contentConfig = contentType ? CONTENT_TYPE_CONFIG[contentType] : null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.accentLight} />
        <Text style={styles.heading}>Saving bookmark…</Text>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        {categoryConfig && contentConfig && (
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                { backgroundColor: categoryConfig.bgColor },
              ]}
            >
              <Ionicons
                name={categoryConfig.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={categoryConfig.color}
              />
              <Text style={[styles.badgeText, { color: categoryConfig.color }]}>
                {categoryConfig.label}
              </Text>
            </View>
            <View style={styles.badge}>
              <Ionicons
                name={contentConfig.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.badgeTextSecondary}>
                {contentConfig.label}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.hint}>Analyzing content and sorting…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  badgeTextSecondary: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
