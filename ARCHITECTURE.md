# Gramin Saathi - Architecture Documentation

## Overview

Gramin Saathi is a **Progressive Web App (PWA)** designed as a digital financial companion for rural India. It's built with a mobile-first, offline-first architecture to work reliably in low-connectivity areas.

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Recharts** | Data visualization |

### Backend & Data
| Technology | Purpose |
|------------|---------|
| **Firebase Auth** | User authentication (Email, Google) |
| **Firestore** | Cloud database |
| **IndexedDB (Dexie.js)** | Local offline storage |

### PWA & Offline
| Technology | Purpose |
|------------|---------|
| **vite-plugin-pwa** | Service worker generation |
| **Workbox** | Caching strategies |
| **Web Speech API** | Voice recognition & TTS |

### External APIs
| API | Purpose |
|-----|---------|
| **data.gov.in** | Mandi (market) prices |
| **OpenWeatherMap** | Weather forecasts |
| **Google Gemini** | AI assistant (Saathi) |

---

## Directory Structure

```
gramin-saathi/
├── public/                    # Static assets
│   ├── _redirects            # Netlify redirects
│   ├── favicon.svg           # App icon
│   └── site.webmanifest      # PWA manifest
├── src/
│   ├── components/
│   │   ├── custom-ui/        # Reusable UI components
│   │   │   └── NavigationElements.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── ui/               # Base UI components
│   │   │   └── OfflineIndicator.tsx
│   │   └── views/            # Page views
│   │       ├── HomeView.tsx
│   │       ├── KhataView.tsx
│   │       ├── SaathiView.tsx
│   │       ├── MandiView.tsx
│   │       ├── YojanaView.tsx
│   │       ├── SeekhoView.tsx
│   │       ├── WeatherView.tsx
│   │       ├── CalculatorView.tsx
│   │       ├── TranslatorView.tsx
│   │       ├── CommunityView.tsx
│   │       ├── ProfileView.tsx
│   │       └── AuthView.tsx
│   ├── lib/
│   │   ├── firebase-config.ts    # Firebase initialization
│   │   ├── translations.ts       # i18n strings (Hindi/English)
│   │   ├── offline-db.ts         # IndexedDB with Dexie
│   │   ├── sync-manager.ts       # Background sync logic
│   │   ├── voice-processor.ts    # Web Speech API wrapper
│   │   └── useOffline.ts         # React hooks for offline
│   ├── contexts/
│   │   └── LanguageContext.tsx
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── vite.config.ts            # Vite + PWA config
├── tailwind.config.ts        # Tailwind config
└── package.json
```

---

## Core Architecture Patterns

### 1. Single Page Application (SPA)
- Client-side routing via state management
- No page reloads between views
- URL sync with `window.history.pushState`

### 2. Offline-First Architecture
```
┌─────────────────┐     ┌─────────────────┐
│   User Action   │────▶│  Check Online?  │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
            ┌───────────────┐         ┌───────────────┐
            │   Online      │         │   Offline     │
            │ Fetch API     │         │ Use IndexedDB │
            │ Save to Cache │         │ Queue Changes │
            └───────────────┘         └───────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │    Display to User      │
                    └─────────────────────────┘
```

### 3. Service Worker Caching

| Content Type | Strategy | TTL |
|--------------|----------|-----|
| Static assets (JS, CSS) | Cache-First | Indefinite |
| Google Fonts | Cache-First | 1 year |
| Mandi API | Network-First | 1 hour |
| Weather API | Network-First | 30 min |
| Images | Cache-First | 30 days |

### 4. State Management
- React `useState` for local state
- Firebase for persistent cloud state
- IndexedDB for offline persistence
- Context API for global state (language, theme)

---

## Data Flow

### Authentication Flow
```
User ──▶ Firebase Auth ──▶ Get UID ──▶ Load Profile from Firestore
                                             │
                                             ▼
                              ┌──────────────────────────┐
                              │ Try Cache First (Fast)   │
                              │ Then Network (Fresh)     │
                              └──────────────────────────┘
```

### Mandi Prices Flow
```
User Search ──▶ fetchMandiPrices() ──▶ data.gov.in API
                                             │
                          ┌──────────────────┴──────────────────┐
                          ▼                                     ▼
                    Has Search?                            No Search
                    Fuzzy Filter                          API Pagination
                    Local Paginate                        (15/page)
                          │                                     │
                          └──────────────────┬──────────────────┘
                                             ▼
                                    Display Results
                                    Cache in IndexedDB
```

### Offline Transaction Sync
```
User adds expense ──▶ Save to IndexedDB ──▶ Queue sync action
                            │
                            ▼
              ┌─────────────────────────────┐
              │ On Connection Restored:     │
              │ 1. Check pending queue      │
              │ 2. Push to Firestore        │
              │ 3. Mark as synced           │
              │ 4. Clear from queue         │
              └─────────────────────────────┘
```

---

## Component Hierarchy

```
<GraminSaathiOS>
├── <LandingPage />              # Pre-login landing
├── <AuthView />                 # Login/Signup
├── <OnboardingView />           # First-time setup
└── [Authenticated]
    ├── <aside> (Sidebar)
    │   ├── Logo
    │   ├── <NavItem /> × 7
    │   ├── Utilities Dropdown
    │   │   ├── Mandi
    │   │   ├── Weather
    │   │   ├── Calculator
    │   │   └── Translator
    │   └── <IdentityMiniCard />
    └── <main>
        ├── <header> (Mobile only)
        └── <View> (one of:)
            ├── HomeView
            ├── KhataView
            ├── SaathiView
            ├── YojanaView
            ├── CommunityView
            ├── SeekhoView
            ├── MandiView
            ├── WeatherView
            ├── CalculatorView
            ├── TranslatorView
            └── ProfileView
```

---

## Security Considerations

1. **Authentication**: Firebase Auth with email verification
2. **Data Privacy**: Personal data stored locally in IndexedDB
3. **API Keys**: Environment variables (not in source)
4. **HTTPS**: Required for service workers
5. **CSP**: Content Security Policy headers

---

## Performance Optimizations

1. **Code Splitting**: Vite automatic chunks (vendor, firebase, ui)
2. **Lazy Loading**: Views loaded on demand
3. **Image Optimization**: SVG icons, compressed images
4. **Caching**: Aggressive service worker caching
5. **Local Pagination**: Fuzzy search paginates locally (no API calls)

---

## Deployment

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Redirects: `public/_redirects` (SPA fallback)

### Environment Variables Required
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_WEATHER_API_KEY
VITE_MANDI_API_KEY
VITE_GEMINI_API_KEY
```
