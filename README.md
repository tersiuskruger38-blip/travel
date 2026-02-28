# NYC Travel Companion — Expo App

A smart, mobile-first travel companion for Ters & Suzanne's NYC trip (March 13-18, 2026).

## Features
- 📅 Day-by-day itinerary with 45+ curated places
- 📍 Filterable places database with categories & distances
- 🎪 Events calendar (NBA, NHL, St. Patrick's Day, concerts)
- ✈️ Flight tracking with key timing warnings
- 🗽 NYC Survival Guide (transport, tipping, neighborhoods)
- 💬 AI chatbot (Claude-powered) with full trip context
- ✅ Check-off & notes that persist across sessions
- 🌙 Dark mode support

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

Scan the QR code with Expo Go on your phone.

## Publish to Expo (share via QR code)

### 1. Login to Expo
```bash
npx eas login
```

### 2. Publish an update (instant, no build needed)
```bash
npx eas update --branch preview --message "NYC Travel Companion v1"
```

This gives you a **shareable QR code** — scan it with Expo Go.

### 3. Or: Build a standalone APK / IPA
```bash
# Android APK (can install directly)
npx eas build --platform android --profile preview

# iOS Simulator build
npx eas build --platform ios --profile preview
```

## Run on specific platforms

```bash
# iOS (requires Mac + Xcode)
npx expo run:ios

# Android (requires Android Studio)
npx expo run:android

# Web browser
npx expo start --web
```

## Project Structure
```
app/
  _layout.tsx         # Root layout
  chat.tsx            # AI chatbot (fullscreen modal)
  (tabs)/
    _layout.tsx       # Tab navigation
    index.tsx         # Itinerary tab
    places.tsx        # All places tab
    events.tsx        # Events tab
    flights.tsx       # Flights tab
    guide.tsx         # Survival guide tab
src/
  data/appData.ts     # All trip data (places, itinerary, flights, events, guide)
  hooks/useStorage.ts # AsyncStorage persistence hook
  components/Shared.tsx # Shared UI components
  theme.ts            # Color theme constants
```
