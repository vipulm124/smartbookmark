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

Create a `.env` file (see `.env.example`):

```bash
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key-here
```

The app uses `gpt-4o-mini` for fast, low-cost categorization. Without an API key, it falls back to the built-in rule-based classifier.

## Tech stack

- **React Native** + **Expo SDK 57**
- **Expo Router** for navigation
- **expo-share-intent** for receiving shares from other apps
- **expo-sqlite** for local storage
- **OpenAI API** for AI categorization with rules-based fallback

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
| **AI (OpenAI)** | When `EXPO_PUBLIC_OPENAI_API_KEY` is set |
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
    aiCategorizer.ts  # OpenAI-powered classifier
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
