import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProcessingOverlay } from "../src/components/ProcessingOverlay";
import { CATEGORY_CONFIG } from "../src/constants/categories";
import { colors, radius, spacing } from "../src/constants/theme";
import { processSharePayload } from "../src/services/categorizer";
import { formatSourceApp, parseShareIntent } from "../src/services/shareParser";
import { saveBookmark } from "../src/services/storage";
import { BookmarkCategory } from "../src/types/bookmark";

export default function ShareIntentScreen() {
  const router = useRouter();
  const { hasShareIntent, shareIntent, resetShareIntent } =
    useShareIntentContext();

  const [processing, setProcessing] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewCategory, setPreviewCategory] = useState<BookmarkCategory>();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!hasShareIntent || !shareIntent || saved) return;

    const handleShare = async () => {
      setProcessing(true);

      try {
        const payload = parseShareIntent(shareIntent);
        const processed = await processSharePayload(payload);
        const sourceApp = formatSourceApp(payload.sourceApp);

        setPreviewTitle(processed.title);
        setPreviewCategory(processed.category);

        await saveBookmark({
          url: processed.url,
          title: processed.title,
          description: processed.description,
          category: processed.category,
          contentType: processed.contentType,
          sourceApp,
          thumbnailUrl: payload.thumbnailUrl || null,
          tags: processed.tags,
        });

        setSaved(true);
        resetShareIntent();

        const categoryLabel = CATEGORY_CONFIG[processed.category].label;
        const methodLabel =
          processed.categorizedBy === "ai" ? "AI sorted" : "Auto-sorted";
        Alert.alert(
          "Bookmark saved!",
          `${methodLabel} into ${categoryLabel}`,
          [
            {
              text: "View bookmarks",
              onPress: () => router.replace("/"),
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        Alert.alert(
          "Could not save",
          "Something went wrong while saving this bookmark.",
          [{ text: "OK", onPress: () => router.replace("/") }]
        );
      } finally {
        setProcessing(false);
      }
    };

    handleShare();
  }, [hasShareIntent, shareIntent, saved, resetShareIntent, router]);

  if (!hasShareIntent && !processing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No shared content</Text>
          <Text style={styles.emptyText}>
            Use the Share button in another app and select Smart Bookmark.
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.buttonText}>Go to bookmarks</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {processing && (
        <ProcessingOverlay
          title={previewTitle || "Shared content"}
          category={previewCategory}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
});
