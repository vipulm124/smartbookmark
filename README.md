# Smart Bookmark

A mobile app that receives shared links from any app (Instagram, YouTube, Chrome, etc.) and automatically sorts them into **Technical**, **Entertainment**, or **Other** categories.

## Features

- **Share from any app** — appears in the system Share sheet on iOS and Android
- **Smart categorization** — analyzes URLs, domains, and text to auto-sort bookmarks
- **Content type detection** — identifies articles, videos, reels, social posts, and images
- **Manual override** — recategorize any bookmark from the detail screen
- **Offline-first** — all bookmarks stored locally with SQLite

## How it works

1. Open any app (Instagram, YouTube, Safari, Chrome, etc.)
2. Tap **Share** on a post, reel, video, or article
3. Select **Smart Bookmark** from the share sheet
4. The app analyzes the content and saves it to the right category

## Tech stack

- **React Native** + **Expo SDK 57**
- **Expo Router** for navigation
- **expo-share-intent** for receiving shares from other apps
- **expo-sqlite** for local storage
- Rule-based categorization engine (domain + keyword analysis)

## Getting started

### Prerequisites

- Node.js 18+
- For device testing: [Expo Go](https://expo.dev/go) won't work for share intents — you need a **development build**

### Install

```bash
npm install
```

### Run (development build required for share intent)

Share intents require native code. Build and run on a device:

```bash
# Generate native projects
npx expo prebuild

# Run on Android
npx expo run:android

# Run on iOS (macOS required)
npx expo run:ios
```

### Run tests

```bash
node scripts/test-categorizer.mjs
npm run lint
```

## Categorization logic

| Signal | Examples |
|--------|----------|
| **Technical** | github.com, stackoverflow.com, dev.to, docs sites, programming keywords |
| **Entertainment** | youtube.com, instagram.com/reel, tiktok.com, memes, music, gaming |
| **Other** | Everything else |

Content types are detected separately: `article`, `video`, `reel`, `social`, `image`, `other`.

## Project structure

```
app/                  # Expo Router screens
  index.tsx           # Home — bookmark list with category filters
  shareintent.tsx     # Handles incoming shares
  bookmark/[id].tsx   # Bookmark detail + recategorize
src/
  components/         # UI components
  constants/          # Theme and category config
  services/
    categorizer.ts    # Smart sorting engine
    storage.ts        # SQLite persistence
    shareParser.ts    # Parse share intent payloads
  types/              # TypeScript types
```

## Building for production

Use [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npx eas build --platform android
npx eas build --platform ios
```

## License

MIT
