# 🌾 Gramin Saathi

**Digital Financial Companion for Rural India**

A Progressive Web App (PWA) designed to empower rural farmers and communities with financial literacy, government scheme access, market prices, and AI-powered assistance - all in Hindi and English.

---

## ✨ Key Features

### 💰 Khata (Digital Ledger)
Track income and expenses with voice input support. Works offline and syncs when connected.

### 🤖 Saathi AI
Intelligent assistant powered by Gemini AI. Ask questions about farming, schemes, finances in Hindi or English.

### 📊 Mandi Prices
Live market prices from 30,000+ mandis across India. Fuzzy search for any market, district, or crop.

### 🏛️ Yojana (Government Schemes)
Discover eligible schemes like PM-KISAN, PMFBY, KCC with Hindi/English explanations and application guidance.

### 📚 Seekho (Learn)
Financial literacy modules with quizzes. Track progress and earn certificates.

### 🌤️ Mausam (Weather)
5-day weather forecasts with farming recommendations.

### 🧮 Calculator
Financial calculators for loans, interest, crop yield, unit conversions.

### 🌐 Translator
Hindi ↔ English translation with voice support.

### 👥 Community
Discussion forums and agricultural articles.

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-repo/gramin-saathi.git
cd gramin-saathi

# Install dependencies
npm install

# Create .env file with API keys (see .env.example)

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📱 Progressive Web App

- **Install on any device** - Works as native app on Android, iOS, Windows
- **Offline-first** - All features work without internet
- **Auto-sync** - Data syncs when back online
- **Fast loading** - Service worker caches assets

---

## 🔧 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **PWA**: Vite PWA Plugin, Workbox
- **APIs**: data.gov.in (Mandi), OpenWeather, Google Gemini
- **Offline**: IndexedDB (Dexie.js), Web Speech API

---

## 🌐 Languages

- English (EN)
- Hindi (हिंदी)

---

## 🎨 Themes

- **Ocean** (Default) - Dark teal theme
- **Light** - Clean white theme  
- **Dark** - Pure dark theme

---

## 📁 Project Structure

```
src/
├── components/
│   ├── views/          # Page components
│   ├── ui/             # UI elements
│   └── custom-ui/      # Navigation, cards
├── lib/
│   ├── firebase-config.ts
│   ├── offline-db.ts
│   ├── translations.ts
│   └── voice-processor.ts
└── App.tsx
```

---

## 🔐 Environment Variables

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_WEATHER_API_KEY=xxx
VITE_MANDI_API_KEY=xxx
VITE_GEMINI_API_KEY=xxx
```

---

## 📄 License

MIT License - Free for personal and commercial use.

---

## 🤝 Contributing

Contributions welcome! Please read our contribution guidelines.

---

## 📞 Support

For support, email support@graminsaathi.in or join our Discord community.

---

**Made with ❤️ for Rural India**
