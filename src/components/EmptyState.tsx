import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../constants/theme";

interface EmptyStateProps {
  filter: string;
  onLoadDemo?: () => void;
}

export function EmptyState({ filter, onLoadDemo }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="share-outline" size={40} color={colors.accentLight} />
      </View>
      <Text style={styles.title}>No bookmarks yet</Text>
      <Text style={styles.subtitle}>
        {filter === "all"
          ? "Share a link, video, reel, or article from any app and Smart Bookmark will sort it for you."
          : `No ${filter} bookmarks yet. Share something and we'll categorize it automatically.`}
      </Text>
      <View style={styles.steps}>
        <Step number={1} text="Open any app (Instagram, YouTube, Chrome…)" />
        <Step number={2} text='Tap Share and choose "Smart Bookmark"' />
        <Step number={3} text="We auto-sort into Technical, Fun, or Other" />
      </View>

      {onLoadDemo && filter === "all" && (
        <Pressable style={styles.demoButton} onPress={onLoadDemo} testID="load-demo">
          <Ionicons name="sparkles" size={18} color={colors.text} />
          <Text style={styles.demoButtonText}>Load demo bookmarks</Text>
        </Pressable>
      )}
    </View>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  steps: {
    width: "100%",
    gap: spacing.md,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accentLight,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  demoButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
});
