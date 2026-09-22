import { Stack } from "expo-router";
import { ShareIntentProvider } from "expo-share-intent";
import { StatusBar } from "expo-status-bar";
import { colors } from "../src/constants/theme";

export default function RootLayout() {
  return (
    <ShareIntentProvider
      options={{
        resetOnBackground: true,
        onResetShareIntent: () => {},
      }}
    >
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="shareintent"
          options={{ title: "Save Bookmark", presentation: "modal" }}
        />
        <Stack.Screen
          name="bookmark/[id]"
          options={{ title: "Bookmark" }}
        />
      </Stack>
    </ShareIntentProvider>
  );
}
