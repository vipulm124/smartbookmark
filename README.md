# Smart Bookmark

A mobile app that receives shared links from any app (Instagram, YouTube, Chrome, etc.) and uses **AI** to automatically sort them into **Technical**, **Entertainment**, or **Other** categories.

## Features

- **Share from any app** — appears in the system Share sheet on iOS and Android
- **AI categorization** — OpenAI analyzes shared content and picks the right category
- **Smart fallback** — rule-based classifier runs automatically when no API key is set
- **Content type detection** — identifies articles, videos, reels, social posts, and images
- **Category filters** — browse all bookmarks or filter by category
- **Offline-first** — all bookmarks stored locally with SQLite

## How it works

1. Open any app (Instagram, YouTube, Safari, Chrome, etc.)
2. Tap **Share** on a post, reel, video, or article
3. Select **Smart Bookmark** from the share sheet
4. AI analyzes the content and saves it to the right category automatically

## AI setup

The app supports multiple AI providers. It auto-detects the first configured key, preferring cheaper options:

| Provider | Default model | Cost | Get a key |
|----------|--------------|------|-----------|
| **Groq** (recommended) | `llama-3.1-8b-instant` | Free tier available | [console.groq.com](https://console.groq.com/keys) |
| **Google Gemini** | `gemini-2.0-flash-lite` | ~$0.075/1M tokens | [aistudio.google.com](https://aistudio.google.com/apikey) |
| **OpenRouter** | `google/gemma-2-9b-it:free` | Free models available | [openrouter.ai](https://openrouter.ai/keys) |
| **OpenAI** | `gpt-4o-mini` | ~$0.15/1M tokens | [platform.openai.com](https://platform.openai.com/api-keys) |

Create a `.env` file (see `.env.example`):

```bash
# Easiest — Groq free tier with a small Llama model
EXPO_PUBLIC_GROQ_API_KEY=gsk_your-key-here

# Or force a specific provider:
# EXPO_PUBLIC_AI_PROVIDER=gemini
# EXPO_PUBLIC_GEMINI_API_KEY=your-key-here
```

Without any API key, the app falls back to the built-in rule-based classifier.

## Tech stack

- **React Native** + **Expo SDK 57**
- **Expo Router** for navigation
- **expo-share-intent** for receiving shares from other apps
- **expo-sqlite** for local storage
- **OpenAI API** (or Groq / Gemini / OpenRouter) for AI categorization with rules-based fallback

## Getting started

### Prerequisites

- Node.js 18+
- OpenAI API key (recommended for best categorization)
- For device testing: a **development build** (Expo Go does not support share intents)

### Install

```bash
npm install
cp .env.example .env   # add your OpenAI API key
```

### Run (development build required for share intent)

```bash
npx expo prebuild
npx expo run:android   # or run:ios on macOS
```

### Web preview (UI only)

```bash
npx expo start --web
# Click "Load demo bookmarks" on the home screen
```

### Run tests

```bash
npm test
npm run lint
```

## Categorization logic

| Method | When used |
|--------|-----------|
| **AI** (Groq, Gemini, OpenRouter, or OpenAI) | When any provider API key is set |
| **Rules fallback** | No API key, or if the AI request fails |

AI considers the URL, title, and description to classify into Technical, Entertainment, or Other.

## Project structure

```
app/                  # Expo Router screens
  index.tsx           # Home — bookmark list with category filters
  shareintent.tsx     # Handles incoming shares + AI categorization
  bookmark/[id].tsx   # Bookmark detail view
src/
  services/
    ai/
      providers.ts    # Multi-provider config (Groq, Gemini, etc.)
    aiCategorizer.ts  # AI classifier with auto provider detection
    categorizer.ts    # Rules fallback + share processing
    storage.ts        # SQLite persistence
```

## Building for production

Use [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npx eas build --platform android
npx eas build --platform ios
```

## License

MIT
