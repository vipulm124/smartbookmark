import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CATEGORY_CONFIG } from "../constants/categories";
import { colors, radius, spacing } from "../constants/theme";
import { BookmarkCategory } from "../types/bookmark";

interface CategoryFilterProps {
  selected: BookmarkCategory | "all";
  counts: Record<BookmarkCategory | "all", number>;
  onSelect: (category: BookmarkCategory | "all") => void;
}

const FILTERS: Array<{
  key: BookmarkCategory | "all";
  label: string;
  icon: string;
  color: string;
}> = [
  { key: "all", label: "All", icon: "apps", color: colors.accent },
  {
    key: "technical",
    label: "Technical",
    icon: CATEGORY_CONFIG.technical.icon,
    color: CATEGORY_CONFIG.technical.color,
  },
  {
    key: "entertainment",
    label: "Fun",
    icon: CATEGORY_CONFIG.entertainment.icon,
    color: CATEGORY_CONFIG.entertainment.color,
  },
  {
    key: "other",
    label: "Other",
    icon: CATEGORY_CONFIG.other.icon,
    color: CATEGORY_CONFIG.other.color,
  },
];

export function CategoryFilter({
  selected,
  counts,
  onSelect,
}: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const isSelected = selected === filter.key;
        return (
          <Pressable
            key={filter.key}
            testID={`filter-${filter.key}`}
            onPress={() => onSelect(filter.key)}
            style={[
              styles.chip,
              isSelected && {
                backgroundColor: filter.color + "25",
                borderColor: filter.color,
              },
            ]}
          >
            <Ionicons
              name={filter.icon as keyof typeof Ionicons.glyphMap}
              size={14}
              color={isSelected ? filter.color : colors.textSecondary}
            />
            <Text
              style={[
                styles.chipText,
                isSelected && { color: filter.color, fontWeight: "600" },
              ]}
            >
              {filter.label}
            </Text>
            <View
              style={[
                styles.countBadge,
                isSelected && { backgroundColor: filter.color + "30" },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  isSelected && { color: filter.color },
                ]}
              >
                {counts[filter.key]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border + "60",
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
