// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo, createContext, useContext } from 'react';
import { 
  Home, 
  Wallet, 
  Sprout, 
  BookOpen, 
  User, 
  Mic, 
  Send, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Leaf, 
  Languages, 
  Save, 
  Wifi, 
  WifiOff,
  MapPin, 
  ShieldCheck, 
  Tractor, 
  Settings, 
  LogOut, 
  Sparkles,
  Loader,
  Volume2,
  Camera,
  History,
  Plus,
  Eye,
  EyeOff,
  Chrome,
  Trash2,
  FileText,
  ArrowLeftRight,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Shield,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Check,
  Filter,
  Download,
  Search,
  Type,
  Store,
  Cloud,
  Droplet,
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  Calculator,
  CalendarDays,
  BarChart3,
  PlayCircle,
  Users
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signOut,
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  deleteDoc,
  enableIndexedDbPersistence,
  getDocFromCache,
  limit
} from 'firebase/firestore';
import { 
  getVertexAI, 
  getGenerativeModel,
  HarmBlockThreshold,
  HarmCategory
} from '@firebase/vertexai';

// --- Mocks for Environment Variables ---
// (Removed as we now use real config)
const __initial_auth_token = "";

/**
 * ==========================================================================================
 * CONFIGURATION & THEME ENGINE
 * ==========================================================================================
 */

// --- CSS Variables for Design System ---
const themeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  :root {
    /* Ocean Blue Palette (Default) */
    --bg-main: #011627;
    --bg-glass: #0a1e2e;
    --bg-card: #0d2137;
    --bg-card-hover: rgba(65, 234, 212, 0.1);
    --bg-input: #132d42;
    
    --primary: #41ead4;
    --primary-glow: rgba(65, 234, 212, 0.4);
    --secondary: #0ea5e9;
    --accent: #3b82f6;
    
    --text-main: #fdfffc;
    --text-muted: #94a3b8;
    --border: rgba(65, 234, 212, 0.2);
    
    --success: #22c55e;
    --danger: #ff0022;
    --white: #ffffff;

    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 1rem;
    
    --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
    --shadow-neon: 0 0 10px rgba(65, 234, 212, 0.3), 0 0 20px rgba(65, 234, 212, 0.2);
    --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --backdrop: blur(20px) saturate(150%);
  }

  /* Light Theme */
  body.theme-light {
    --bg-main: #f8fafc;
    --bg-glass: #ffffff;
    --bg-card: #ffffff;
    --bg-card-hover: rgba(59, 130, 246, 0.1);
    --bg-input: #f1f5f9;
    
    --primary: #3b82f6;
    --primary-glow: rgba(59, 130, 246, 0.4);
    --secondary: #0ea5e9;
    --accent: #6366f1;
    
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    
    --success: #22c55e;
    --danger: #ef4444;
    
    --shadow-glass: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-neon: 0 4px 14px 0 rgba(59, 130, 246, 0.2);
  }
  
  body.theme-light {
    background-color: var(--bg-main);
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%),
      radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.08), transparent 25%);
  }
  
  body.theme-light select, 
  body.theme-light input[type="text"], 
  body.theme-light input[type="email"], 
  body.theme-light input[type="password"], 
  body.theme-light textarea {
    background-color: #f1f5f9 !important;
    color: #0f172a !important;
    border: 1px solid #e2e8f0 !important;
  }
  
  body.theme-light select option {
    background-color: #ffffff !important;
    color: #0f172a !important;
  }
  
  body.theme-light ::-webkit-scrollbar-track { background: #f1f5f9; }
  body.theme-light ::-webkit-scrollbar-thumb { background: #cbd5e1; }
  body.theme-light ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  /* Dark Theme (OLED Black with Green/Blue) */
  body.theme-dark {
    --bg-main: #000000;
    --bg-glass: #0a0a0a;
    --bg-card: #121212;
    --bg-card-hover: rgba(34, 197, 94, 0.15);
    --bg-input: #1a1a1a;
    
    --primary: #22c55e;
    --primary-glow: rgba(34, 197, 94, 0.4);
    --secondary: #0ea5e9;
    --accent: #3b82f6;
    
    --text-main: #fafafa;
    --text-muted: #a1a1aa;
    --border: rgba(34, 197, 94, 0.25);
    
    --success: #22c55e;
    --danger: #ef4444;
    
    --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
    --shadow-neon: 0 0 15px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.2);
  }
  
  body.theme-dark {
    background-color: #000000;
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(34, 197, 94, 0.1), transparent 25%),
      radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.1), transparent 25%);
  }

  /* Route Progress Bar */
  .route-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    z-index: 9999;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px var(--primary-glow);
  }

  /* Skip to main content (Accessibility) */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary);
    color: black;
    padding: 8px 16px;
    z-index: 10000;
    font-weight: 600;
    transition: top 0.3s;
  }
  .skip-link:focus {
    top: 0;
  }

  /* Focus visible for accessibility */
  *:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  
  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  body {
    background-color: var(--bg-main);
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(14, 165, 233, 0.15), transparent 25%),
      radial-gradient(circle at 85% 30%, rgba(65, 234, 212, 0.15), transparent 25%);
    background-attachment: fixed;
    color: var(--text-main);
    font-family: 'Space Grotesk', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    letter-spacing: -0.02em;
  }

  /* Glass Utils */
  .glass {
    background: var(--bg-card);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-glass);
  }
  
  .glass-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .glass-hover:hover {
    background: var(--bg-card-hover);
    transform: translateY(-2px) scale(1.01);
    box-shadow: var(--shadow-neon);
    border-color: var(--primary);
  }

  /* White Button Utils */
  .btn-white {
    background-color: var(--white) !important;
    color: black !important;
    font-weight: 700;
    transition: all 0.2s ease;
  }
  .btn-white:hover {
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  /* Bento Grid Utils */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 0.75rem;
    padding: 0;
  }
  @media (min-width: 768px) {
    .bento-grid {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(4, minmax(200px, auto));
      gap: 1.5rem;
      padding: 1.5rem;
    }
  }
  .bento-col-1 { grid-column: span 1; }
  .bento-col-2 { grid-column: span 2; }
  .bento-col-3 { grid-column: span 3; }
  .bento-row-1 { grid-row: span 1; }
  .bento-row-2 { grid-row: span 2; }

  /* Dropdown dark styling */
  select, input[type="text"], input[type="email"], input[type="password"], textarea {
    background-color: #1e293b !important;
    color: #f1f5f9 !important;
    border: 1px solid #334155 !important;
  }
  select option {
    background-color: #1e293b !important;
    color: #f1f5f9 !important;
  }
  
  /* Thin dark scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #64748b; }
  
  /* Sunlight Mode (High Contrast) */
  body.sunlight-mode {
    --bg-main: #000000;
    --bg-card: #1a1a1a;
    --bg-glass: #141414;
    --bg-input: #262626;
    --bg-card-hover: #333333;
    --text-main: #ffffff;
    --text-muted: #d1d5db;
    --border: #404040;
    --primary: #10b981;
    --secondary: #3b82f6;
    --success: #22c55e;
    --danger: #ef4444;
    filter: contrast(1.2) brightness(1.1);
  }
`;

import { TRANSLATIONS } from './lib/translations';
import { handleAuthError, mockUser, mockProfile } from './lib/mockFirebase';
import LandingPage from './components/LandingPage';

/**
 * ==========================================================================================
 * FIREBASE SETUP
 * ==========================================================================================
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence (ignore errors if already enabled)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence unavailable: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence not supported in this browser');
  }
});

const appId = 'gramin-saathi';

// ==================== VERTEX AI SETUP ====================
const vertexAI = getVertexAI(app, { location: 'us-central1' });
const translationModel = getGenerativeModel(vertexAI, {
  model: 'gemini-2.0-flash-lite-001',
  generationConfig: {
    temperature: 0,
    topK: 1,
    candidateCount: 1,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
});

// ==================== GEMINI API QUOTA MANAGEMENT ====================
const API_QUOTA_KEY = 'gemini_api_quota';
const DAILY_LIMIT = 50; // Max requests per day
const RATE_LIMIT_MS = 2000; // Min 2 seconds between requests
let lastApiCall = 0;
const responseCache = new Map();

function checkApiQuota() {
  const today = new Date().toDateString();
  const quota = JSON.parse(localStorage.getItem(API_QUOTA_KEY) || '{}');
  
  if (quota.date !== today) {
    // Reset daily quota
    quota.date = today;
    quota.count = 0;
    localStorage.setItem(API_QUOTA_KEY, JSON.stringify(quota));
  }
  
  return quota.count < DAILY_LIMIT;
}

function incrementApiQuota() {
  const quota = JSON.parse(localStorage.getItem(API_QUOTA_KEY) || '{}');
  quota.count = (quota.count || 0) + 1;
  localStorage.setItem(API_QUOTA_KEY, JSON.stringify(quota));
}

function getRemainingQuota() {
  const quota = JSON.parse(localStorage.getItem(API_QUOTA_KEY) || '{}');
  return DAILY_LIMIT - (quota.count || 0);
}

async function callGeminiWithQuota(url, body, cacheKey = null) {
  // Check cache first
  if (cacheKey && responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }
  
  // Check quota
  if (!checkApiQuota()) {
    throw new Error('Daily API quota exceeded. Please try again tomorrow.');
  }
  
  // Rate limiting
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  if (timeSinceLastCall < RATE_LIMIT_MS) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastCall));
  }
  
  lastApiCall = Date.now();
  incrementApiQuota();
  
  const response = await fetch(url, body);
  const data = await response.json();
  
  // Cache response if cacheKey provided
  if (cacheKey && data) {
    responseCache.set(cacheKey, data);
    // Limit cache size
    if (responseCache.size > 100) {
      const firstKey = responseCache.keys().next().value;
      responseCache.delete(firstKey);
    }
  }
  
  return data;
}
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Gemini API Key
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // OpenWeather API Key

/**
 * ==========================================================================================
 * UTILITY: SHARE FUNCTIONS
 * ==========================================================================================
 */
const shareContent = async (title, text, url = null) => {
  const shareData = { title, text };
  if (url) shareData.url = url;
  
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Share failed:', err);
    }
  }
  
  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(`${title}\n\n${text}${url ? `\n\n${url}` : ''}`);
    alert('Copied to clipboard! Share via WhatsApp or any app.');
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
};

/**
 * ==========================================================================================
 * UTILITY: VOICE FUNCTIONS
 * ==========================================================================================
 */
const speakText = (text, lang = 'en') => {
  if (!('speechSynthesis' in window)) return false;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Map language codes to speech synthesis languages
  const langMap = {
    'hi': 'hi-IN',
    'pa': 'pa-IN', // Punjabi
    'te': 'te-IN', // Telugu
    'ta': 'ta-IN', // Tamil
    'kn': 'kn-IN', // Kannada
    'ml': 'ml-IN', // Malayalam
    'gu': 'gu-IN', // Gujarati
    'mr': 'mr-IN', // Marathi
    'bn': 'bn-IN', // Bengali
    'en': 'en-IN'
  };
  
  utterance.lang = langMap[lang] || 'en-IN';
  utterance.rate = 0.85; // Slower for better clarity
  utterance.pitch = 1;
  utterance.volume = 1;
  
  // Try to find a voice for the language
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith(langMap[lang]?.split('-')[0]));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  window.speechSynthesis.speak(utterance);
  return true;
};

const startVoiceRecognition = (onResult, lang = 'en') => {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    return null;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };
  
  recognition.start();
  return recognition;
};

// Attach to window for global access
window.startVoiceRecognition = startVoiceRecognition;

/**
 * Generate dummy transactions for demo/new users
 * Creates realistic farming transactions over the past 30 days
 */
const generateDummyTransactions = (lang = 'en') => {
  const incomeItems = lang === 'en' 
    ? ['Sold wheat', 'Milk sale', 'Vegetable sale', 'Rice sold', 'Crop sale', 'Dairy income', 'Sold mangoes', 'Government subsidy', 'Farm labor payment']
    : ['गेहूं बेचा', 'दूध बिक्री', 'सब्जी बिक्री', 'चावल बेचा', 'फसल बिक्री', 'डेयरी आय', 'आम बेचे', 'सरकारी सब्सिडी', 'खेत मजदूरी'];
  
  const expenseItems = lang === 'en'
    ? ['Seeds purchase', 'Fertilizer', 'Diesel for pump', 'Labor wages', 'Pesticides', 'Equipment repair', 'Electricity bill', 'Transport cost', 'Animal feed', 'Irrigation expense']
    : ['बीज खरीदे', 'खाद', 'पंप डीज़ल', 'मजदूरी', 'कीटनाशक', 'उपकरण मरम्मत', 'बिजली बिल', 'परिवहन खर्च', 'पशु चारा', 'सिंचाई खर्च'];

  const transactions = [];
  const today = new Date();
  
  // Generate 15-25 random transactions over past 30 days
  const numTransactions = Math.floor(Math.random() * 11) + 15;
  
  for (let i = 0; i < numTransactions; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0);
    
    const isIncome = Math.random() > 0.45; // 55% chance of expense
    const items = isIncome ? incomeItems : expenseItems;
    const description = items[Math.floor(Math.random() * items.length)];
    
    // Generate realistic amounts
    let amount;
    if (isIncome) {
      // Income: ₹500 - ₹15000
      amount = Math.floor(Math.random() * 14500) + 500;
      // Round to nearest 100 for larger amounts
      if (amount > 1000) amount = Math.round(amount / 100) * 100;
    } else {
      // Expense: ₹100 - ₹5000
      amount = Math.floor(Math.random() * 4900) + 100;
      // Round to nearest 50
      amount = Math.round(amount / 50) * 50;
    }
    
    transactions.push({
      id: `demo-${i}-${Date.now()}`,
      description,
      amount: amount.toString(),
      type: isIncome ? 'income' : 'expense',
      category: 'general',
      date: { toDate: () => date },
      displayDate: date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      }),
      isDemo: true
    });
  }
  
  // Sort by date descending
  transactions.sort((a, b) => b.date.toDate() - a.date.toDate());
  
  return transactions;
};

// PART 2 GOES HERE
/**
 * ==========================================================================================
 * COMPONENT: APP ROOT
 * ==========================================================================================
 */

export default function GraminSaathiOS() {
  // Global State
  const [user, setUser] = useState(null);
  // Theme: 'blue' (default), 'dark', 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'blue');
  const [lang, setLang] = useState('en');
  const [fontSize, setFontSize] = useState('normal'); // normal, large, xlarge
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sunlightMode, setSunlightMode] = useState(localStorage.getItem('sunlight_mode') === 'true');
  const [voiceEnabled, setVoiceEnabled] = useState('speechSynthesis' in window);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar toggle
  const [showAuth, setShowAuth] = useState(false); // For showing auth view from landing page
  const [routeLoading, setRouteLoading] = useState(false); // Route transition progress bar
  const [loadProgress, setLoadProgress] = useState(0); // Progress bar percentage
  
  // Apply theme to body
  useEffect(() => {
    document.body.classList.remove('theme-blue', 'theme-dark', 'theme-light');
    if (theme !== 'blue') {
      document.body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);
  
  // Theme toggle function (cycles: blue -> light -> dark -> blue)
  const cycleTheme = () => {
    setTheme(prev => {
      if (prev === 'blue') return 'light';
      if (prev === 'light') return 'dark';
      return 'blue';
    });
  };
  
  // Get initial view from URL pathname
  const getInitialView = () => {
    const pathname = window.location.pathname.slice(1); // Remove leading /
    // Support both 'home' (legacy) and 'dashboard' routes
    if (pathname === 'home') return 'dashboard';
    const validViews = ['dashboard', 'khata', 'yojana', 'saathi', 'seekho', 'identity', 'mandi', 'mausam', 'calculator', 'translator', 'community'];
    if (validViews.includes(pathname)) return pathname;
    // If user is logged in and on root, go to dashboard, otherwise onboarding
    return 'onboarding';
  };
  
  // Navigation State
  const [currentView, setCurrentView] = useState(getInitialView()); // onboarding, home, khata, saathi, yojana, seekho, profile
  
  // Helper to change view and close mobile sidebar with progress bar
  const handleViewChange = (view) => {
    if (view === currentView) return;
    
    // Show progress bar animation
    setRouteLoading(true);
    setLoadProgress(0);
    
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 50);
    
    // After short delay, complete transition
    setTimeout(() => {
      setCurrentView(view);
      setSidebarOpen(false);
      setLoadProgress(100);
      
      // Hide progress bar after animation completes
      setTimeout(() => {
        setRouteLoading(false);
        setLoadProgress(0);
      }, 200);
    }, 150);
  };
  
  // Data State
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Initialize route on mount to handle page refresh
  useEffect(() => {
    const pathname = window.location.pathname.slice(1);
    const validViews = ['dashboard', 'khata', 'yojana', 'saathi', 'seekho', 'identity', 'mandi', 'mausam', 'calculator', 'translator', 'community'];
    
    // Handle legacy 'home' route - redirect to 'dashboard'
    if (pathname === 'home') {
      window.history.replaceState(null, '', '/dashboard');
      setCurrentView('dashboard');
      return;
    }
    
    // Restore view from URL if valid
    if (validViews.includes(pathname)) {
      setCurrentView(pathname);
    } else if (pathname === '') {
      // Root path - will be set based on login state
      setCurrentView(user ? 'dashboard' : 'landing');
    }
  }, [user]);

  // Update URL when view changes using History API
  useEffect(() => {
    if (currentView !== 'onboarding' && currentView !== 'landing') {
      window.history.pushState(null, '', `/${currentView}`);
    } else if (currentView === 'landing') {
      window.history.pushState(null, '', `/`);
    }
  }, [currentView]);
  
  // Listen for popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.slice(1);
      // Support both 'home' (legacy) and 'dashboard' routes
      if (pathname === 'home') {
        setCurrentView('dashboard');
        return;
      }
      const validViews = ['dashboard', 'khata', 'yojana', 'saathi', 'seekho', 'identity', 'mandi', 'mausam', 'calculator', 'translator', 'community'];
      if (validViews.includes(pathname)) {
        setCurrentView(pathname);
      } else if (pathname === '') {
        // Root path - show landing if not logged in
        setCurrentView(user ? 'dashboard' : 'landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);
  
  // Sunlight mode effect
  useEffect(() => {
    if (sunlightMode) {
      document.body.classList.add('sunlight-mode');
    } else {
      document.body.classList.remove('sunlight-mode');
    }
    localStorage.setItem('sunlight_mode', sunlightMode);
  }, [sunlightMode]);
  
  // Toggle sunlight mode
  const toggleSunlightMode = () => {
    setSunlightMode(!sunlightMode);
  };
  
  // Load user settings from Firebase
  const loadUserSettings = async (uid) => {
    try {
      const settingsRef = doc(db, 'artifacts', appId, 'users', uid, 'settings', 'preferences');
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        if (data.language) setLang(data.language);
        if (data.fontSize) setFontSize(data.fontSize);
      }
      setSettingsLoaded(true);
    } catch (err) {
      console.error('Error loading settings:', err);
      setSettingsLoaded(true);
    }
  };

  // Save user settings to Firebase
  const saveUserSettings = async (settings) => {
    if (!user) return;
    try {
      const settingsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'preferences');
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  // Initialize Auth & Theme
  useEffect(() => {
    // 1. Auth (Persistence)
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
        // No auto-login anonymously
      } catch (err) {
        console.error("Auth init error", err);
      }
    };
    initAuth();

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        loadProfile(u.uid);
        loadUserSettings(u.uid);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    // 2. Theme (Enforced)
    document.documentElement.setAttribute('data-theme', 'dark');

    // 3. Online Status
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      unsubAuth();
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  // Theme Toggle Handler
  // Theme toggle removed - Cyberpunk enforced

  // Language Toggle Handler
  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    saveUserSettings({ language: newLang });
  };

  // Font Size Handler
  const changeFontSize = (size) => {
    setFontSize(size);
    saveUserSettings({ fontSize: size });
  };

  // Helper to get translated string
  const t = (key) => TRANSLATIONS[lang][key] || key;

  // Font size CSS classes
  const fontSizeClass = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : fontSize === 'xlarge' ? 'text-xl' : 'text-base';

  // Load User Profile with timeout
  const loadProfile = async (uid) => {
    setLoading(true);
    
    // Helper function to add timeout to a promise
    const withTimeout = (promise, ms) => {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), ms)
      );
      return Promise.race([promise, timeout]);
    };
    
    try {
      // Check if Firebase is configured
      if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "") {
        console.warn("Firebase not configured - using demo mode");
        setCurrentView('onboarding');
        setLoading(false);
        return;
      }
      
      const docRef = doc(db, 'artifacts', appId, 'users', uid, 'profile', 'main');
      
      // Try to get from cache first for instant load
      try {
        const cachedDoc = await getDocFromCache(docRef);
        if (cachedDoc.exists() && cachedDoc.data()?.name) {
          setProfile(cachedDoc.data());
          // Only change view if on onboarding, preserve current route
          if (currentView === 'onboarding') {
            const pathname = window.location.pathname.slice(1);
            const validViews = ['home', 'khata', 'yojana', 'saathi', 'seekho', 'identity', 'mandi', 'mausam', 'calculator', 'community'];
            setCurrentView(validViews.includes(pathname) ? pathname : 'home');
          }
          setLoading(false);
          return;
        }
      } catch (cacheErr) {
        // Cache miss is expected, continue to network
      }
      
      // Try network with 3 second timeout (faster fallback)
      const docSnap = await withTimeout(getDoc(docRef), 3000);
      if (docSnap.exists() && docSnap.data()?.name) {
        // Profile exists and has a name
        setProfile(docSnap.data());
        // Only change view if on onboarding, preserve current route
        if (currentView === 'onboarding') {
          const pathname = window.location.pathname.slice(1);
          const validViews = ['home', 'khata', 'yojana', 'saathi', 'seekho', 'identity', 'mandi', 'mausam', 'calculator', 'community'];
          setCurrentView(validViews.includes(pathname) ? pathname : 'home');
        }
      } else {
        // No valid profile - show onboarding
        setCurrentView('onboarding');
      }
    } catch (e) {
      // Silently handle timeout/offline - just show onboarding
      if (e.message !== 'timeout') {
        console.warn("Profile load:", e.message);
      }
      setCurrentView('onboarding');
    }
    setLoading(false);
  };

  // Render Logic
  if (loading) return (
    <>
      <style>{themeStyles}</style>
      <div className="flex items-center justify-center h-screen bg-[var(--bg-main)] text-[var(--primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
    </div>
    </>
  );

  // Show Landing Page or Auth View for non-logged-in users (full width, no constraints)
  if (!user && !showAuth) {
    return (
      <>
        <style>{themeStyles}</style>
        <LandingPage 
          onGetStarted={() => setShowAuth(true)} 
          lang={lang} 
          toggleLang={toggleLang} 
        />
      </>
    );
  }

  if (!user && showAuth) {
    return (
      <>
        <style>{themeStyles}</style>
        <AuthView onLogin={() => {}} t={t} lang={lang} toggleLang={toggleLang} />
      </>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden transition-colors duration-500 ${fontSizeClass}`}>
      <style>{themeStyles}</style>
      
      {/* Route Progress Bar */}
      {routeLoading && (
        <div 
          className="route-progress" 
          style={{ width: `${loadProgress}%` }}
          role="progressbar"
          aria-valuenow={loadProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page loading"
        />
      )}
      
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        {lang === 'en' ? 'Skip to main content' : 'मुख्य सामग्री पर जाएं'}
      </a>
      
      {currentView === 'onboarding' ? (
         <OnboardingView 
           user={user} 
           db={db} 
           appId={appId} 
           onComplete={() => {
             loadProfile(user.uid);
             // Go to current URL route or dashboard if on root
             const pathname = window.location.pathname.slice(1);
             if (pathname === 'home') {
               setCurrentView('dashboard');
               return;
             }
             const validViews = ['dashboard', 'khata', 'yojana', 'saathi', 'seekho', 'identity', 'mandi', 'mausam', 'calculator', 'translator', 'community'];
             setCurrentView(validViews.includes(pathname) ? pathname : 'dashboard');
           }}
           t={t}
           lang={lang}
           toggleLang={toggleLang}
         />
      ) : (
        <>
          {/* Glass Sidebar (Desktop & Mobile) */}
          {/* Sidebar Overlay for Mobile */}
          {sidebarOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <aside className={`flex flex-col glass overflow-hidden transition-all duration-300 ease-out fixed left-0 top-0 bottom-0 z-50 ${
            sidebarOpen 
              ? 'w-80 translate-x-0 shadow-2xl' 
              : 'w-0 -translate-x-full'
          } md:relative md:w-72 md:h-full md:translate-x-0 md:m-4 md:rounded-3xl md:shadow-none`}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="p-6 flex items-center gap-3 border-b border-[var(--border)] bg-white/5 backdrop-blur-sm">
              <img src="/favicon.svg" alt="Gramin Saathi" className="w-10 h-10 rounded-xl shadow-lg" />
              <h1 className="font-bold text-xl tracking-tight text-[var(--text-main)]">
                {lang === 'en' ? 'Gramin' : 'ग्रामीण'} <span className="text-[var(--primary)]">Saathi</span>
              </h1>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2" role="navigation" aria-label={lang === 'en' ? 'Main navigation' : 'मुख्य नेविगेशन'}>
              <NavItem active={currentView === 'dashboard'} onClick={() => handleViewChange('dashboard')} icon={Home} label={t('nav_home')} />
              <NavItem active={currentView === 'khata'} onClick={() => handleViewChange('khata')} icon={Wallet} label={t('nav_khata')} />
              <NavItem active={currentView === 'saathi'} onClick={() => handleViewChange('saathi')} icon={Sprout} label={t('nav_saathi')} />
              <NavItem active={currentView === 'mandi'} onClick={() => handleViewChange('mandi')} icon={Store} label={lang === 'en' ? 'Mandi' : 'मंडी'} />
              <NavItem active={currentView === 'yojana'} onClick={() => handleViewChange('yojana')} icon={ShieldCheck} label={t('nav_yojana')} />
              <NavItem active={currentView === 'seekho'} onClick={() => handleViewChange('seekho')} icon={BookOpen} label={t('nav_seekho')} />
              <NavItem active={currentView === 'mausam'} onClick={() => handleViewChange('mausam')} icon={Cloud} label={lang === 'en' ? 'Weather' : 'मौसम'} />
              <NavItem active={currentView === 'calculator'} onClick={() => handleViewChange('calculator')} icon={Calculator} label={lang === 'en' ? 'Calculator' : 'कैलकुलेटर'} />
              <NavItem active={currentView === 'translator'} onClick={() => handleViewChange('translator')} icon={ArrowLeftRight} label={lang === 'en' ? 'Translator' : 'अनुवादक'} />
              <NavItem active={currentView === 'community'} onClick={() => handleViewChange('community')} icon={MessageCircle} label={lang === 'en' ? 'Community' : 'समुदाय'} />
            </nav>

            <div className="p-4 border-t border-[var(--border)] space-y-3 bg-black/10 backdrop-blur-md">
              <IdentityMiniCard profile={profile} onClick={() => handleViewChange('profile')} t={t} />
              <div className="flex gap-2">
                 <button onClick={toggleLang} className="flex-1 p-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors flex justify-center font-bold border border-[var(--border)]" aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}>
                   {lang === 'en' ? 'HI' : 'EN'}
                 </button>
                 <button 
                   onClick={cycleTheme} 
                   className="p-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors flex items-center justify-center border border-[var(--border)] min-w-[40px]"
                   title={theme === 'blue' ? 'Ocean Theme' : theme === 'light' ? 'Light Theme' : 'Dark Theme'}
                   aria-label={`Current theme: ${theme}. Click to change theme.`}
                 >
                   {theme === 'blue' ? <Droplet size={18} /> : theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                 </button>
                 <button 
                   onClick={toggleSunlightMode} 
                   className="p-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors flex items-center justify-center border border-[var(--border)]"
                   title="Sunlight Mode (High Contrast)"
                   aria-label={sunlightMode ? 'Disable sunlight mode' : 'Enable sunlight mode for outdoor visibility'}
                 >
                   {sunlightMode ? '☀️' : '🔆'}
                 </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main id="main-content" className="flex-1 w-screen md:w-auto h-full overflow-hidden flex flex-col relative" role="main" aria-label={lang === 'en' ? 'Main content' : 'मुख्य सामग्री'}>
            
            {/* Mobile Header (Glass) */}
            <header className="md:hidden h-16 glass rounded-none flex items-center justify-between px-4 z-10 shrink-0">
               <button 
                 onClick={() => setSidebarOpen(!sidebarOpen)}
                 className="p-2 rounded-lg bg-[var(--bg-input)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
               >
                 <Menu size={20} />
               </button>
               <div className="flex items-center gap-2">
                 <img src="/favicon.svg" alt="Gramin Saathi" className="w-8 h-8 rounded-lg" />
                 <span className="font-bold text-lg text-[var(--text-main)]">{t('app_name')}</span>
               </div>
               <div className="flex items-center gap-3">
                 <button onClick={toggleLang} className="text-[var(--text-main)] font-bold text-xs bg-[var(--bg-input)] px-2 py-1 rounded-lg border border-[var(--border)]">
                    {lang === 'en' ? 'HI' : 'EN'}
                 </button>
               </div>
            </header>

            {/* Scrollable Content */}
            <div className={`flex-1 overflow-x-hidden p-4 md:p-6 md:pt-8 ${currentView === 'saathi' ? 'overflow-auto' : 'overflow-y-auto'}`}>
               {currentView === 'dashboard' && <HomeView user={user} profile={profile} db={db} appId={appId} t={t} lang={lang} setView={handleViewChange} />}
               {currentView === 'khata' && <KhataView user={user} db={db} appId={appId} t={t} lang={lang} />}
               {currentView === 'saathi' && <SaathiView user={user} profile={profile} db={db} appId={appId} t={t} lang={lang} />}
               {currentView === 'mandi' && <MandiView lang={lang} />}
               {currentView === 'yojana' && <YojanaView t={t} lang={lang} user={user} db={db} appId={appId} />}
               {currentView === 'calculator' && <CalculatorView user={user} db={db} appId={appId} t={t} lang={lang} />}
               {currentView === 'seekho' && <SeekhoView t={t} lang={lang} user={user} db={db} appId={appId} />}
               {currentView === 'mausam' && <WeatherView t={t} lang={lang} setView={handleViewChange} profile={profile} />}
               {currentView === 'translator' && <TranslatorView lang={lang} user={user} db={db} appId={appId} />}
               {currentView === 'community' && <CommunityView lang={lang} user={user} db={db} appId={appId} profile={profile} />}
               {currentView === 'profile' && <ProfileView user={user} profile={profile} db={db} appId={appId} t={t} loadProfile={loadProfile} lang={lang} fontSize={fontSize} changeFontSize={changeFontSize} />}
            </div>


          </main>
        </>
      )}
    </div>
  );
}

/**
 * ==========================================================================================
 * SUB-COMPONENTS
 * ==========================================================================================
 */

const GlassCard = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`glass p-5 rounded-3xl ${className}`}>
    {children}
  </div>
);

const BentoCard = ({ children, colSpan = 1, rowSpan = 1, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`glass rounded-xl md:rounded-3xl p-3 md:p-6 relative overflow-hidden group transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border-t border-white/10
    ${colSpan === 2 ? 'md:col-span-2' : colSpan === 3 ? 'md:col-span-3' : 'md:col-span-1'}
    ${rowSpan === 2 ? 'md:row-span-2' : 'md:row-span-1'}
    ${className}`}
  >
    {children}
  </div>
);

// Skeleton Loading Components
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-[var(--bg-glass)] rounded ${className}`} />
);

const SkeletonCard = () => (
  <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-5 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

const SkeletonTransaction = () => (
  <div className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <Skeleton className="h-5 w-16" />
  </div>
);

const SkeletonBlogPost = () => (
  <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-4 flex gap-4">
    <Skeleton className="w-32 h-32 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-2 mt-3">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

function NavItem({ active, onClick, icon: Icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
        active 
        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg shadow-emerald-500/20' 
        : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
      }`}
    >
      <Icon size={20} className={active ? "animate-pulse" : ""} />
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg" />}
    </button>
  );
}

function MobileNavItem({ active, onClick, icon: Icon, label, isMain }) {
  if (isMain) {
    return (
      <button 
        onClick={onClick}
        className={`relative -top-6 flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-transform active:scale-95 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white border-4 border-[var(--bg-main)]`}
      >
        <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></span>
        <Icon size={24} className="relative z-10" />
      </button>
    );
  }
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-14 gap-1 ${
        active ? 'text-[var(--primary)] transform -translate-y-1' : 'text-[var(--text-muted)]'
      } transition-all duration-300`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      {active && <span className="w-1 h-1 rounded-full bg-[var(--primary)] mt-1" />}
    </button>
  );
}

function IdentityMiniCard({ profile, onClick, t }) {
  if (!profile) return null;
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors border border-transparent hover:border-[var(--border)]"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--secondary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white/10">
        {profile.name?.charAt(0) || 'U'}
      </div>
      <div className="overflow-hidden">
        <p className="text-sm font-bold text-[var(--text-main)] truncate">{profile.name}</p>
        <p className="text-xs text-[var(--text-muted)] truncate">{profile.village}</p>
      </div>
    </div>
  );
}

/**
 * ==========================================================================================
 * COMPONENT: WEATHER WIDGET
 * ==========================================================================================
 */
function WeatherWidget({ lang, setView }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user's location
        if (!navigator.geolocation) {
          setError('Geolocation not supported');
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.cod === 200) {
              setWeather(data);
            } else {
              setError('Failed to fetch weather');
            }
            setLoading(false);
          },
          (err) => {
            console.error('Location error:', err);
            // Fallback to Delhi coordinates
            fetchWeatherByCity('Delhi');
          }
        );
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to load weather');
        setLoading(false);
      }
    };

    const fetchWeatherByCity = async (city) => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
          setWeather(data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <BentoCard className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
        <div className="animate-pulse space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-32" />
        </div>
      </BentoCard>
    );
  }

  if (error || !weather) {
    return null;
  }

  const getWeatherIcon = (code) => {
    if (code >= 200 && code < 300) return '⛈️';
    if (code >= 300 && code < 400) return '🌦️';
    if (code >= 500 && code < 600) return '🌧️';
    if (code >= 600 && code < 700) return '❄️';
    if (code >= 700 && code < 800) return '🌫️';
    if (code === 800) return '☀️';
    if (code > 800) return '☁️';
    return '🌤️';
  };

  const weatherCode = weather.weather[0]?.id || 800;
  const isRainy = weatherCode >= 500 && weatherCode < 600;

  return (
    <BentoCard onClick={() => setView('mausam')} className={`cursor-pointer group hover:border-blue-500/50 transition-all bg-gradient-to-br ${isRainy ? 'from-blue-500/10 to-indigo-500/10 border-blue-500/20' : 'from-amber-500/10 to-orange-500/10 border-amber-500/20'} border !p-3 md:!p-4`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] text-[var(--text-muted)] font-medium mb-0.5">{lang === 'en' ? 'Weather' : 'मौसम'}</p>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl md:text-3xl">{getWeatherIcon(weatherCode)}</span>
            <div>
              <p className="text-xl md:text-2xl font-bold text-[var(--text-main)]">{Math.round(weather.main.temp)}°C</p>
              <p className="text-[10px] text-[var(--text-muted)] capitalize">{weather.weather[0]?.description}</p>
            </div>
          </div>
        </div>
        <MapPin size={12} className="text-[var(--primary)]" />
      </div>
      
      <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-[var(--border)]">
        <div className="text-center">
          <p className="text-[9px] text-[var(--text-muted)]">{lang === 'en' ? 'Humidity' : 'नमी'}</p>
          <p className="text-xs font-bold text-[var(--primary)]">{weather.main.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-[var(--text-muted)]">{lang === 'en' ? 'Wind' : 'हवा'}</p>
          <p className="text-xs font-bold text-[var(--primary)]">{Math.round(weather.wind.speed * 3.6)}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-[var(--text-muted)]">{lang === 'en' ? 'Feels' : 'महसूस'}</p>
          <p className="text-xs font-bold text-[var(--primary)]">{Math.round(weather.main.feels_like)}°</p>
        </div>
      </div>
      
      {isRainy && (
        <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-400 font-medium flex items-center gap-1">
            <AlertTriangle size={12} />
            {lang === 'en' ? 'Rain expected - Plan accordingly' : 'बारिश की संभावना - योजना बनाएं'}
          </p>
        </div>
      )}
    </BentoCard>
  );
}

/**
 * ==========================================================================================
 * VIEW: WEATHER (MAUSAM)
 * ==========================================================================================
 */
function WeatherView({ t, lang, setView, profile }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async (retry = 0) => {
      try {
        // Check cache first (5 min expiry)
        const cached = localStorage.getItem('weather_cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setWeather(data.weather);
            setForecast(data.forecast);
            setLocation(data.location);
            setLoading(false);
            checkWeatherAlerts(data.weather);
            loadWeatherHistory();
            return;
          }
        }

        if (!navigator.geolocation) {
          setError('Geolocation not supported');
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lon: longitude });
            
            try {
              // Fetch current weather
              const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
              const weatherRes = await fetch(weatherUrl);
              const weatherData = await weatherRes.json();
              
              // Fetch 5-day forecast
              const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
              const forecastRes = await fetch(forecastUrl);
              const forecastData = await forecastRes.json();
              
              if (weatherData.cod === 200) {
                setWeather(weatherData);
                checkWeatherAlerts(weatherData);
                saveWeatherHistory(weatherData);
                
                // Cache the data
                localStorage.setItem('weather_cache', JSON.stringify({
                  data: {
                    weather: weatherData,
                    forecast: forecastData.cod === '200' ? forecastData.list.filter((item, idx) => idx % 8 === 0).slice(0, 5) : [],
                    location: { lat: latitude, lon: longitude }
                  },
                  timestamp: Date.now()
                }));
              } else if (retry < 2) {
                // Retry on failure
                setTimeout(() => {
                  setRetryCount(retry + 1);
                  fetchWeatherData(retry + 1);
                }, 2000);
                return;
              } else {
                setError('Failed to fetch weather. Invalid API key or service unavailable.');
              }
              
              if (forecastData.cod === '200') {
                const dailyForecast = forecastData.list.filter((item, idx) => idx % 8 === 0).slice(0, 5);
                setForecast(dailyForecast);
              }
              
              loadWeatherHistory();
              setLoading(false);
            } catch (fetchErr) {
              if (retry < 2) {
                setTimeout(() => {
                  setRetryCount(retry + 1);
                  fetchWeatherData(retry + 1);
                }, 2000);
              } else {
                throw fetchErr;
              }
            }
          },
          (err) => {
            console.error('Location error:', err);
            setError('Please enable location access for weather data');
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to load weather data. Please check your API key.');
        setLoading(false);
      }
    };

    const checkWeatherAlerts = (weatherData) => {
      const newAlerts = [];
      const temp = weatherData.main.temp;
      const weatherCode = weatherData.weather[0]?.id || 800;
      const windSpeed = weatherData.wind.speed * 3.6;
      
      // Severe weather alerts
      if (weatherCode >= 200 && weatherCode < 300) {
        newAlerts.push({ type: 'danger', message: lang === 'en' ? 'Thunderstorm Warning - Stay Indoors!' : 'गरज चेतावनी - घर के अंदर रहें!' });
      }
      if (temp > 40) {
        newAlerts.push({ type: 'warning', message: lang === 'en' ? 'Extreme Heat - Avoid outdoor work 11am-4pm' : 'अत्यधिक गर्मी - 11am-4pm बाहर काम न करें' });
      }
      if (temp < 5) {
        newAlerts.push({ type: 'warning', message: lang === 'en' ? 'Frost Warning - Protect sensitive crops' : 'पाला चेतावनी - संवेदनशील फसलों की रक्षा करें' });
      }
      if (windSpeed > 40) {
        newAlerts.push({ type: 'warning', message: lang === 'en' ? 'High Wind Alert - Secure equipment' : 'तेज हवा चेतावनी - उपकरण सुरक्षित करें' });
      }
      if (weatherCode >= 500 && weatherCode < 600) {
        newAlerts.push({ type: 'info', message: lang === 'en' ? 'Good day to skip irrigation' : 'सिंचाई छोड़ने के लिए अच्छा दिन' });
      } else if (weatherCode === 800 && temp < 35) {
        newAlerts.push({ type: 'success', message: lang === 'en' ? 'Perfect weather for spraying pesticides' : 'कीटनाशक छिड़काव के लिए बेहतरीन मौसम' });
      }
      
      setAlerts(newAlerts);
    };

    const saveWeatherHistory = (weatherData) => {
      const history = JSON.parse(localStorage.getItem('weather_history') || '[]');
      const today = new Date().toDateString();
      
      // Don't save duplicate for same day
      if (history.length > 0 && new Date(history[history.length - 1].date).toDateString() === today) {
        return;
      }
      
      history.push({
        date: new Date().toISOString(),
        temp: weatherData.main.temp,
        condition: weatherData.weather[0]?.main,
        humidity: weatherData.main.humidity,
        rainfall: weatherData.rain?.['1h'] || 0
      });
      
      // Keep only last 7 days
      if (history.length > 7) history.shift();
      localStorage.setItem('weather_history', JSON.stringify(history));
    };

    const loadWeatherHistory = () => {
      const history = JSON.parse(localStorage.getItem('weather_history') || '[]');
      setWeatherHistory(history);
    };

    fetchWeatherData();
  }, [lang]);

  const getWeatherIcon = (code) => {
    if (code >= 200 && code < 300) return '⛈️';
    if (code >= 300 && code < 400) return '🌦️';
    if (code >= 500 && code < 600) return '🌧️';
    if (code >= 600 && code < 700) return '❄️';
    if (code >= 700 && code < 800) return '🌫️';
    if (code === 800) return '☀️';
    if (code > 800) return '☁️';
    return '🌤️';
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto animate-in fade-in duration-700 p-6">
        <div className="space-y-6">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto animate-in fade-in duration-700 p-6">
        <div className="text-center py-20">
          <AlertTriangle size={64} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">{lang === 'en' ? 'Weather Data Unavailable' : 'मौसम डेटा उपलब्ध नहीं'}</h2>
          <p className="text-[var(--text-muted)] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            {lang === 'en' ? 'Retry' : 'पुनः प्रयास करें'}
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const weatherCode = weather.weather[0]?.id || 800;
  const isRainy = weatherCode >= 500 && weatherCode < 600;
  const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full md:max-w-7xl md:mx-auto animate-in fade-in duration-700 space-y-3 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-[var(--text-main)] mb-1">
            {lang === 'en' ? 'Weather' : 'मौसम'}
          </h1>
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-[var(--text-muted)]">
            <MapPin size={14} />
            <span>{weather.name}, {weather.sys.country}</span>
          </div>
        </div>
        <button
          onClick={() => {
            const text = `Weather in ${weather.name}: ${Math.round(weather.main.temp)}°C, ${weather.weather[0]?.description}. Humidity: ${weather.main.humidity}%, Wind: ${weather.wind.speed} m/s`;
            if (window.shareContent) {
              window.shareContent('Weather Update', text, window.location.href);
            }
          }}
          className="p-2 md:p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
          title={lang === 'en' ? 'Share Weather' : 'मौसम शेयर करें'}
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Current Weather - Large Card */}
      <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-8 bg-gradient-to-br ${isRainy ? 'from-blue-500 via-blue-600 to-indigo-600' : 'from-orange-400 via-amber-500 to-yellow-500'} text-white shadow-xl md:shadow-2xl`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div className="flex items-center gap-3 md:gap-6">
              <span className="text-5xl md:text-8xl">{getWeatherIcon(weatherCode)}</span>
              <div>
                <p className="text-4xl md:text-7xl font-bold tracking-tight">{Math.round(weather.main.temp)}°</p>
                <p className="text-sm md:text-xl mt-1 md:mt-2 capitalize opacity-90">{weather.weather[0]?.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-75 mb-0.5">{lang === 'en' ? 'Feels like' : 'महसूस'}</p>
              <p className="text-xl md:text-3xl font-bold">{Math.round(weather.main.feels_like)}°</p>
            </div>
          </div>

          {/* Alert Banner */}
          {isRainy && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/30">
              <div className="flex items-center gap-2 md:gap-3">
                <AlertTriangle size={20} />
                <div>
                  <p className="font-bold text-sm md:text-base">{lang === 'en' ? 'Rain Expected' : 'बारिश की संभावना'}</p>
                  <p className="text-xs md:text-sm opacity-90">{lang === 'en' ? 'Plan accordingly' : 'योजना बनाएं'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 md:p-4">
          <div className="flex items-center gap-1.5 mb-1 md:mb-2 text-[var(--text-muted)]">
            <Droplets size={14} />
            <span className="text-xs font-medium">{lang === 'en' ? 'Humidity' : 'नमी'}</span>
          </div>
          <p className="text-xl md:text-3xl font-bold text-[var(--text-main)]">{weather.main.humidity}%</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 md:p-4">
          <div className="flex items-center gap-1.5 mb-1 md:mb-2 text-[var(--text-muted)]">
            <Wind size={14} />
            <span className="text-xs font-medium">{lang === 'en' ? 'Wind' : 'हवा'}</span>
          </div>
          <p className="text-xl md:text-3xl font-bold text-[var(--text-main)]">{Math.round(weather.wind.speed * 3.6)}</p>
          <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-0.5">km/h {getWindDirection(weather.wind.deg)}</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 md:p-4">
          <div className="flex items-center gap-1.5 mb-1 md:mb-2 text-[var(--text-muted)]">
            <Gauge size={14} />
            <span className="text-xs font-medium">{lang === 'en' ? 'Pressure' : 'दबाव'}</span>
          </div>
          <p className="text-xl md:text-3xl font-bold text-[var(--text-main)]">{weather.main.pressure}</p>
          <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-0.5">hPa</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 md:p-4">
          <div className="flex items-center gap-1.5 mb-1 md:mb-2 text-[var(--text-muted)]">
            <Eye size={14} />
            <span className="text-xs font-medium">{lang === 'en' ? 'Visibility' : 'दृश्यता'}</span>
          </div>
          <p className="text-xl md:text-3xl font-bold text-[var(--text-main)]">{(weather.visibility / 1000).toFixed(1)}</p>
          <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-0.5">km</p>
        </div>
      </div>

      {/* Sun Times */}
      {/* Sunrise/Sunset */}
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-3 md:p-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-orange-500/20">
              <Sunrise size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-medium">{lang === 'en' ? 'Sunrise' : 'सूर्योदय'}</p>
              <p className="text-lg md:text-2xl font-bold text-[var(--text-main)]">{sunrise}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-3 md:p-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-indigo-500/20">
              <Sunset size={18} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-medium">{lang === 'en' ? 'Sunset' : 'सूर्यास्त'}</p>
              <p className="text-lg md:text-2xl font-bold text-[var(--text-main)]">{sunset}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl md:rounded-2xl p-3 md:p-6">
          <h2 className="text-base md:text-xl font-bold text-[var(--text-main)] mb-3">
            {lang === 'en' ? '5-Day Forecast' : '5-दिन का पूर्वानुमान'}
          </h2>
          <div className="grid grid-cols-5 gap-1.5 md:gap-4">
            {forecast.map((day, idx) => {
              const date = new Date(day.dt * 1000);
              const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
              const dayCode = day.weather[0]?.id || 800;
              
              return (
                <div key={idx} className="text-center p-1.5 md:p-4 rounded-lg md:rounded-xl bg-[var(--bg-glass)] border border-[var(--border)]">
                  <p className="text-[10px] md:text-sm font-bold text-[var(--text-main)] mb-1">{dayName}</p>
                  <span className="text-xl md:text-4xl mb-1 block">{getWeatherIcon(dayCode)}</span>
                  <p className="text-sm md:text-xl font-bold text-[var(--text-main)]">{Math.round(day.main.temp)}°</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`rounded-xl p-4 border ${
              alert.type === 'danger' ? 'bg-red-500/10 border-red-500/30' :
              alert.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' :
              alert.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
              'bg-blue-500/10 border-blue-500/30'
            }`}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className={`${
                  alert.type === 'danger' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-orange-500' :
                  alert.type === 'success' ? 'text-green-500' :
                  'text-blue-500'
                }`} />
                <p className="text-sm font-bold text-[var(--text-main)]">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop-Specific Weather Tips */}
      {profile?.crop && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl md:rounded-2xl p-3 md:p-6">
          <div className="flex items-start gap-2 md:gap-4">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-purple-500/20">
              <Sprout size={18} className="text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-lg font-bold text-[var(--text-main)] mb-1.5">
                {lang === 'en' ? `Tips for ${profile.crop}` : `${profile.crop} टिप्स`}
              </h3>
              <ul className="space-y-1 text-xs text-[var(--text-muted)]">
                {(() => {
                  const crop = profile.crop?.toLowerCase();
                  const temp = weather.main.temp;
                  const tips = [];
                  
                  if (crop?.includes('wheat') || crop?.includes('गेहूं')) {
                    if (temp > 30) tips.push(lang === 'en' ? '• High temp may reduce grain filling - ensure adequate irrigation' : '• उच्च तापमान दाने भरने को कम कर सकता है - पर्याप्त सिंचाई सुनिश्चित करें');
                    else if (isRainy) tips.push(lang === 'en' ? '• Rain during harvest can damage grain - plan accordingly' : '• कटाई के दौरान बारिश अनाज को नुकसान पहुंचा सकती है');
                    else tips.push(lang === 'en' ? '• Good conditions for wheat growth' : '• गेहूं की वृद्धि के लिए अच्छी परिस्थितियां');
                  } else if (crop?.includes('rice') || crop?.includes('धान')) {
                    if (isRainy) tips.push(lang === 'en' ? '• Excellent for rice - maintain water level in fields' : '• धान के लिए उत्तम - खेतों में जल स्तर बनाए रखें');
                    else if (temp > 35) tips.push(lang === 'en' ? '• High temp - increase water depth to 10-15cm' : '• उच्च तापमान - पानी की गहराई 10-15 सेमी बढ़ाएं');
                    else tips.push(lang === 'en' ? '• Monitor water levels regularly' : '• नियमित रूप से जल स्तर की निगरानी करें');
                  } else if (crop?.includes('cotton') || crop?.includes('कपास')) {
                    if (temp > 35) tips.push(lang === 'en' ? '• Hot weather accelerates boll development' : '• गर्म मौसम कपास के विकास को तेज करता है');
                    if (isRainy) tips.push(lang === 'en' ? '• Excess rain may cause boll rot - ensure drainage' : '• अधिक बारिश से कपास सड़ सकती है');
                  } else if (crop?.includes('sugarcane') || crop?.includes('गन्ना')) {
                    if (temp > 32) tips.push(lang === 'en' ? '• Ideal temperature for cane growth' : '• गन्ने की वृद्धि के लिए आदर्श तापमान');
                    if (weather.main.humidity > 70) tips.push(lang === 'en' ? '• High humidity - watch for red rot disease' : '• उच्च आर्द्रता - लाल सड़ांध रोग से सावधान');
                  }
                  
                  // Generic farming tips
                  if (isRainy) {
                    tips.push(lang === 'en' ? '• Postpone irrigation activities' : '• सिंचाई गतिविधियों को स्थगित करें');
                    tips.push(lang === 'en' ? '• Check drainage systems' : '• जल निकासी प्रणाली की जांच करें');
                  } else if (temp > 35) {
                    tips.push(lang === 'en' ? '• Increase irrigation frequency' : '• सिंचाई की आवृत्ति बढ़ाएं');
                    tips.push(lang === 'en' ? '• Avoid midday field work' : '• दोपहर में खेत का काम न करें');
                  } else {
                    tips.push(lang === 'en' ? '• Ideal for spraying pesticides' : '• कीटनाशक छिड़काव के लिए आदर्श');
                    tips.push(lang === 'en' ? '• Good for fertilization' : '• उर्वरक के लिए अच्छा');
                  }
                  
                  return tips.map((tip, i) => <li key={i}>{tip}</li>);
                })()}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* General Farming Recommendations */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl md:rounded-2xl p-3 md:p-6">
        <div className="flex items-start gap-2 md:gap-4">
          <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-green-500/20">
            <Sprout size={18} className="text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-lg font-bold text-[var(--text-main)] mb-1.5">
              {lang === 'en' ? 'Recommendations' : 'सिफारिशें'}
            </h3>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              {isRainy ? (
                <>
                  <li>• {lang === 'en' ? 'Postpone irrigation' : 'सिंचाई स्थगित करें'}</li>
                  <li>• {lang === 'en' ? 'Check drainage' : 'जल निकासी जांचें'}</li>
                  <li>• {lang === 'en' ? 'Protect crops from moisture' : 'फसलों को नमी से बचाएं'}</li>
                </>
              ) : weather.main.temp > 35 ? (
                <>
                  <li>• {lang === 'en' ? 'Increase irrigation' : 'सिंचाई बढ़ाएं'}</li>
                  <li>• {lang === 'en' ? 'Provide shade' : 'छाया प्रदान करें'}</li>
                  <li>• {lang === 'en' ? 'Monitor heat stress' : 'गर्मी तनाव निगरानी'}</li>
                </>
              ) : (
                <>
                  <li>• {lang === 'en' ? 'Good for outdoor work' : 'बाहरी काम के लिए अच्छा'}</li>
                  <li>• {lang === 'en' ? 'Ideal for spraying' : 'छिड़काव के लिए आदर्श'}</li>
                  <li>• {lang === 'en' ? 'Perfect for harvesting' : 'कटाई के लिए उत्तम'}</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Weather History */}
      {weatherHistory.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl md:rounded-2xl p-3 md:p-6">
          <h2 className="text-sm md:text-xl font-bold text-[var(--text-main)] mb-2 md:mb-4">
            {lang === 'en' ? 'Weather History' : 'मौसम इतिहास'}
          </h2>
          <div className="space-y-1.5">
            {weatherHistory.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-glass)] border border-[var(--border)]">
                <div>
                  <p className="text-xs font-bold text-[var(--text-main)]">
                    {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] capitalize">{day.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--text-main)]">{Math.round(day.temp)}°</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{day.humidity}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: HOME (BENTO GRID DASHBOARD)
 * ==========================================================================================
 */
function HomeView({ user, profile, db, appId, t, lang, setView }) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [showBalanceHistory, setShowBalanceHistory] = useState(false);
  const [balanceHistory, setBalanceHistory] = useState([]);

  // Save daily balance snapshot to Firebase
  const saveBalanceSnapshot = async (balance, income, expense) => {
    if (!user || !db) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      const snapshotRef = doc(db, `artifacts/${appId}/users/${user.uid}/balance_history/${today}`);
      await setDoc(snapshotRef, {
        balance,
        income,
        expense,
        date: today,
        timestamp: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error('Error saving balance snapshot:', e);
    }
  };

  // Load balance history from Firebase
  const loadBalanceHistory = async () => {
    if (!user || !db) return;
    try {
      const historyRef = collection(db, `artifacts/${appId}/users/${user.uid}/balance_history`);
      const q = query(historyRef, orderBy('date', 'desc'), limit(30));
      const snapshot = await getDocs(q);
      const history = [];
      snapshot.forEach(doc => history.push({ id: doc.id, ...doc.data() }));
      setBalanceHistory(history);
    } catch (e) {
      console.error('Error loading balance history:', e);
    }
  };

  // Calc balance and history from Firestore
  useEffect(() => {
    // Helper to process transactions (real or demo)
    const processTransactions = (txnList) => {
      let total = 0;
      let income = 0;
      let expense = 0;
      const txns = [];
      
      txnList.forEach(item => {
        const data = item.data ? item.data() : item;
        const amount = Number(data.amount);
        if (data.type === 'income') {
          total += amount;
          income += amount;
        } else {
          total -= amount;
          expense += amount;
        }
        txns.push({
          ...data,
          id: item.id || data.id,
          timestamp: data.date?.toDate ? data.date.toDate() : new Date()
        });
      });
      
      setBalance(total);
      setTotalIncome(income);
      setTotalExpense(expense);
      setTransactions(txns);
      
      // Generate chart data for last 30 days
      const last30Days = generateChartData(txns);
      setChartData(last30Days);
      setLoading(false);
    };

    // If no user, show demo data
    if (!user) {
      const demoTransactions = generateDummyTransactions(lang);
      processTransactions(demoTransactions);
      return;
    }

    const q = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'khata'),
      orderBy('date', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
       // If user has no transactions, show demo data
       if (snapshot.docs.length === 0) {
         const demoTransactions = generateDummyTransactions(lang);
         processTransactions(demoTransactions);
         return;
       }

       let total = 0;
       let income = 0;
       let expense = 0;
       const txns = [];
       
       snapshot.docs.forEach(doc => {
         const data = doc.data();
         const amount = Number(data.amount);
         if (data.type === 'income') {
           total += amount;
           income += amount;
         } else {
           total -= amount;
           expense += amount;
         }
         txns.push({
           ...data,
           id: doc.id,
           timestamp: data.date?.toDate ? data.date.toDate() : new Date()
         });
       });
       
       setBalance(total);
       setTotalIncome(income);
       setTotalExpense(expense);
       setTransactions(txns);
       
       // Save daily balance snapshot to Firebase
       saveBalanceSnapshot(total, income, expense);
       
       // Generate chart data for last 30 days
       const last30Days = generateChartData(txns);
       setChartData(last30Days);
       setLoading(false);
    }, (err) => {
      console.error(err);
      // On error, show demo data
      const demoTransactions = generateDummyTransactions(lang);
      processTransactions(demoTransactions);
    });
    return () => unsub();
  }, [user, lang]);

  // Generate daily balance chart for last 30 days
  const generateChartData = (txns) => {
    const today = new Date();
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      // Calculate cumulative balance up to this date
      let dayBalance = 0;
      let dayIncome = 0;
      let dayExpense = 0;
      
      txns.forEach(txn => {
        const txnDate = new Date(txn.timestamp);
        txnDate.setHours(0, 0, 0, 0);
        
        if (txnDate <= date) {
          const amount = Number(txn.amount);
          if (txn.type === 'income') {
            dayBalance += amount;
          } else {
            dayBalance -= amount;
          }
        }
        
        // Track income/expense for this specific day
        if (txnDate.getTime() === date.getTime()) {
          const amount = Number(txn.amount);
          if (txn.type === 'income') {
            dayIncome += amount;
          } else {
            dayExpense += amount;
          }
        }
      });
      
      data.push({
        date: date.getDate(),
        balance: dayBalance,
        income: dayIncome,
        expense: dayExpense,
        day: date.toLocaleDateString('en-IN', { weekday: 'short' })
      });
    }
    
    return data;
  };

  const maxBalance = Math.max(...chartData.map(d => d.balance), 1);
  const minBalance = Math.min(...chartData.map(d => d.balance), 0);
  const range = maxBalance - minBalance || 1;
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 pb-20">
      
      {/* Top Section - Combined on Mobile, Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-3xl p-5 relative overflow-hidden border border-[var(--border)]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[var(--text-muted)] text-sm mb-1">{lang === 'en' ? 'Welcome back' : 'वापस स्वागत है'}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-1">
                {profile?.name?.split(' ')[0] || 'Kisan'} <span className="text-[var(--primary)]">Ji</span>
              </h1>
              <p className="text-[var(--text-muted)] text-sm flex items-center gap-2">
                <MapPin size={14} className="text-[var(--primary)]" />
                {profile?.village || 'Your Village'} • {profile?.crop || 'Crops'}
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-2xl shadow-lg text-[var(--bg-main)]">
              {profile?.name?.charAt(0) || '👤'}
            </div>
          </div>
          
          {/* Today's Activity */}
          <div className="mt-5 bg-[var(--bg-glass)] rounded-2xl p-4 border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[var(--text-muted)] text-xs">{lang === 'en' ? "Today's Activity" : 'आज की गतिविधि'}</p>
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#374151" strokeWidth="4" />
                  <circle 
                    cx="24" cy="24" r="20" 
                    fill="none" 
                    stroke="#c8e038" 
                    strokeWidth="4" 
                    strokeDasharray={`${Math.min(totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 126 : 0, 126)} 126`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--primary)]">
                  {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[var(--text-main)]">{transactions.length}</span>
              <span className="text-[var(--text-muted)] text-sm">{lang === 'en' ? 'transactions' : 'लेनदेन'}</span>
            </div>
          </div>

          {/* Balance Section - Only visible on mobile */}
          <div className="mt-4 lg:hidden bg-gradient-to-br from-[#c8e038] to-[#9ab82a] rounded-2xl p-4 text-[#0a1f1a]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet size={18} />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{t('balance')}</span>
              </div>
              <span className="text-xs font-bold bg-[#0a1f1a]/20 px-2 py-0.5 rounded-full">LIVE</span>
            </div>
            <p className="text-3xl font-bold tracking-tight mb-2">
              ₹{loading ? '...' : Math.abs(balance).toLocaleString('en-IN')}
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={14} className="opacity-70" />
                <div>
                  <p className="text-[10px] opacity-60">{lang === 'en' ? 'Income' : 'आय'}</p>
                  <p className="text-sm font-bold">₹{totalIncome.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingDown size={14} className="opacity-70" />
                <div>
                  <p className="text-[10px] opacity-60">{lang === 'en' ? 'Expense' : 'खर्च'}</p>
                  <p className="text-sm font-bold">₹{totalExpense.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card - Only visible on desktop (right side) */}
        <div className="hidden lg:block bg-gradient-to-br from-[#c8e038] to-[#9ab82a] rounded-3xl p-5 text-[#0a1f1a] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#0a1f1a]/20 rounded-xl">
                <Wallet size={20} />
              </div>
              <span className="text-xs font-bold bg-[#0a1f1a]/20 px-2 py-1 rounded-full">LIVE</span>
            </div>
            <p className="text-[#0a1f1a]/70 text-xs font-semibold uppercase tracking-wide mb-1">{t('balance')}</p>
            <p className="text-4xl font-bold tracking-tight mb-3">
              ₹{loading ? '...' : Math.abs(balance).toLocaleString('en-IN')}
            </p>
            <div className="flex gap-4">
              <div>
                <p className="text-[10px] text-[#0a1f1a]/60">{lang === 'en' ? 'Income' : 'आय'}</p>
                <p className="text-sm font-bold flex items-center gap-1">
                  <TrendingUp size={12} />
                  ₹{totalIncome.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#0a1f1a]/60">{lang === 'en' ? 'Expense' : 'खर्च'}</p>
                <p className="text-sm font-bold flex items-center gap-1">
                  <TrendingDown size={12} />
                  ₹{totalExpense.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border)]">
          <p className="text-[var(--text-muted)] text-xs mb-1">{lang === 'en' ? 'Savings Rate' : 'बचत दर'}</p>
          <p className="text-[var(--text-muted)] text-[10px]">{lang === 'en' ? 'This month' : 'इस महीने'}</p>
          <p className="text-2xl font-bold text-[var(--text-main)] mt-2">{totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%</p>
        </div>
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border)]">
          <p className="text-[var(--text-muted)] text-xs mb-1">{lang === 'en' ? 'Activity' : 'गतिविधि'}</p>
          <p className="text-[var(--text-muted)] text-[10px]">{lang === 'en' ? 'This week' : 'इस सप्ताह'}</p>
          <p className="text-2xl font-bold text-[var(--text-main)] mt-2">{transactions.length}</p>
        </div>
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 col-span-2 border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-muted)] text-xs mb-1">{lang === 'en' ? 'New schemes' : 'नई योजनाएं'}</p>
              <p className="text-[var(--text-muted)] text-[10px]">{lang === 'en' ? 'Available for you' : 'आपके लिए उपलब्ध'}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[var(--text-main)]">4 <span className="text-[var(--primary)] text-lg">▲</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[var(--text-muted)]">● PM-KISAN</span>
            <span className="text-[10px] text-[var(--text-muted)]">● {lang === 'en' ? 'Crop Insurance' : 'फसल बीमा'}</span>
          </div>
        </div>
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-3xl p-5 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[var(--text-muted)] text-xs">{lang === 'en' ? 'Weekly Overview' : 'साप्ताहिक विवरण'}</p>
              <p className="text-2xl font-bold text-[var(--text-main)]">₹{totalIncome.toLocaleString('en-IN')}</p>
            </div>
            <button onClick={() => setView('khata')} className="text-[var(--primary)] text-xs hover:underline flex items-center gap-1">
              {lang === 'en' ? 'View All' : 'सभी देखें'} <ChevronRight size={14} />
            </button>
          </div>
          
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-32 mt-4">
            {chartData.slice(-7).map((day, i) => {
              const maxVal = Math.max(...chartData.map(d => Math.max(d.income || 0, d.expense || 0)), 1);
              const height = Math.max(((day.income || 0) / maxVal) * 100, 5);
              const isToday = i === chartData.slice(-7).length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end h-24">
                    <div 
                      className={`w-full rounded-t transition-all ${isToday ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${isToday ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                    {isToday ? (lang === 'en' ? 'TODAY' : 'आज') : day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div 
            onClick={() => setView('saathi')}
            className="bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-glass)] rounded-2xl p-4 cursor-pointer hover:ring-2 hover:ring-[var(--primary)]/50 transition-all group border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                <Sparkles size={18} className="text-[var(--bg-main)]" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-main)] font-semibold text-sm">{lang === 'en' ? 'Saathi AI' : 'साथी AI'}</p>
                <p className="text-[var(--text-muted)] text-xs">{lang === 'en' ? 'Ask anything' : 'कुछ भी पूछें'}</p>
              </div>
              <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
            </div>
          </div>
          
          <div 
            onClick={() => setView('mandi')}
            className="bg-[var(--bg-card)] rounded-2xl p-4 cursor-pointer hover:ring-2 hover:ring-[var(--primary)]/50 transition-all group border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/20">
                <TrendingUp size={18} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-main)] font-semibold text-sm">{lang === 'en' ? 'Mandi Rates' : 'मंडी भाव'}</p>
                <p className="text-[var(--text-muted)] text-xs">{lang === 'en' ? 'Live prices' : 'लाइव भाव'}</p>
              </div>
              <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-orange-500 transition-colors" />
            </div>
          </div>

          <div 
            onClick={() => setView('yojana')}
            className="bg-[var(--bg-card)] rounded-2xl p-4 cursor-pointer hover:ring-2 hover:ring-[var(--primary)]/50 transition-all group border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20">
                <ShieldCheck size={18} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-main)] font-semibold text-sm">{lang === 'en' ? 'Schemes' : 'योजनाएं'}</p>
                <p className="text-[var(--text-muted)] text-xs">{lang === 'en' ? '7 available' : '7 उपलब्ध'}</p>
              </div>
              <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[var(--bg-card)] rounded-3xl p-5 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[var(--text-main)] font-semibold">{lang === 'en' ? 'Recent Transactions' : 'हाल के लेनदेन'}</p>
          <button onClick={() => setView('khata')} className="text-[var(--primary)] text-xs hover:underline">
            {lang === 'en' ? 'See all' : 'सभी देखें'}
          </button>
        </div>
        
        <div className="space-y-2">
          {transactions.slice(0, 4).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wallet size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">{lang === 'en' ? 'No transactions yet' : 'कोई लेनदेन नहीं'}</p>
            </div>
          ) : transactions.slice(0, 4).map((txn, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-glass)] hover:bg-[var(--bg-input)] transition-colors border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  txn.type === 'income' ? 'bg-[var(--primary)]/20' : 'bg-red-500/20'
                }`}>
                  {txn.type === 'income' ? (
                    <TrendingUp size={18} className="text-[var(--primary)]" />
                  ) : (
                    <TrendingDown size={18} className="text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-[var(--text-main)] text-sm font-medium">{txn.description || (txn.type === 'income' ? 'Income' : 'Expense')}</p>
                  <p className="text-[var(--text-muted)] text-xs">
                    {txn.timestamp ? new Date(txn.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Today'}
                  </p>
                </div>
              </div>
              <p className={`font-bold ${txn.type === 'income' ? 'text-[var(--primary)]' : 'text-red-500'}`}>
                {txn.type === 'income' ? '+' : '-'}₹{Number(txn.amount).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Grid - Vibrant Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button onClick={() => setView('seekho')} className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-left hover:scale-105 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white/20">
              <BookOpen size={20} className="text-white" />
            </div>
            <p className="text-white font-medium text-sm">{lang === 'en' ? 'Seekho' : 'सीखो'}</p>
          </div>
        </button>
        <button onClick={() => setView('calculator')} className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 text-left hover:scale-105 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white/20">
              <Calculator size={20} className="text-white" />
            </div>
            <p className="text-white font-medium text-sm">{lang === 'en' ? 'Calculator' : 'कैलकुलेटर'}</p>
          </div>
        </button>
        <button onClick={() => setView('mausam')} className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-4 text-left hover:scale-105 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white/20">
              <Cloud size={20} className="text-white" />
            </div>
            <p className="text-white font-medium text-sm">{lang === 'en' ? 'Weather' : 'मौसम'}</p>
          </div>
        </button>
        <button onClick={() => setView('community')} className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-4 text-left hover:scale-105 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white/20">
              <Users size={20} className="text-white" />
            </div>
            <p className="text-white font-medium text-sm">{lang === 'en' ? 'Community' : 'समुदाय'}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: KHATA (LEDGER)
 * ==========================================================================================
 */
function KhataView({ user, db, appId, t, lang }) {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('general');
  const [saving, setSaving] = useState(false);
  
  // Analytics State
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Magic AI State
  const [magicInput, setMagicInput] = useState('');
  const [magicLoading, setMagicLoading] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceField, setVoiceField] = useState(null); // 'amount' or 'desc'
  
  // Filter State
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterDateRange, setFilterDateRange] = useState('all'); // 'all', 'week', 'month', 'year'
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // If no user, load dummy demo data
    if (!user) {
      const demoTransactions = generateDummyTransactions(lang);
      setTransactions(demoTransactions);
      setIsDemoMode(true);
      return;
    }
    
    setIsDemoMode(false);
    const q = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'khata'),
      orderBy('date', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const userTransactions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      // If user has no transactions, show demo data
      if (userTransactions.length === 0) {
        const demoTransactions = generateDummyTransactions(lang);
        setTransactions(demoTransactions);
        setIsDemoMode(true);
      } else {
        setTransactions(userTransactions);
        setIsDemoMode(false);
      }
    }, (error) => {
      console.log("Firestore permission error or offline:", error);
      // On error, show demo data
      const demoTransactions = generateDummyTransactions(lang);
      setTransactions(demoTransactions);
      setIsDemoMode(true);
    });
    return () => unsub();
  }, [user, lang]);

  // Filter transactions
  const filteredTransactions = transactions.filter(tr => {
    // Type filter
    if (filterType !== 'all' && tr.type !== filterType) return false;
    
    // Date filter
    if (filterDateRange !== 'all') {
      const txnDate = tr.date?.toDate ? tr.date.toDate() : new Date();
      const now = new Date();
      const diffDays = Math.floor((now - txnDate) / (1000 * 60 * 60 * 24));
      
      if (filterDateRange === 'week' && diffDays > 7) return false;
      if (filterDateRange === 'month' && diffDays > 30) return false;
      if (filterDateRange === 'year' && diffDays > 365) return false;
    }
    
    // Search filter
    if (searchQuery && !tr.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Calculate filtered totals
  const filteredTotals = filteredTransactions.reduce((acc, tr) => {
    if (tr.type === 'income') acc.income += Number(tr.amount);
    else acc.expense += Number(tr.amount);
    return acc;
  }, { income: 0, expense: 0 });

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Type', 'Amount'];
    const rows = filteredTransactions.map(tr => [
      tr.displayDate || (tr.date?.toDate ? tr.date.toDate().toLocaleDateString() : 'N/A'),
      tr.description,
      tr.type,
      tr.amount
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `khata_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Save as template
  const saveAsTemplate = () => {
    if (!desc || !amount) return;
    const newTemplate = {
      id: Date.now(),
      description: desc,
      amount,
      type,
      category
    };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem(`templates_${user.uid}`, JSON.stringify(updated));
    setShowSaveTemplate(false);
    alert(lang === 'en' ? 'Template saved!' : 'टेम्पलेट सहेजा गया!');
  };

  // Use template
  const useTemplate = (template) => {
    setDesc(template.description);
    setAmount(template.amount);
    setType(template.type);
    setCategory(template.category || 'general');
    setShowTemplates(false);
  };

  // Delete template
  const deleteTemplate = (id) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem(`templates_${user.uid}`, JSON.stringify(updated));
  };

  // Export summary as text (for sharing)
  const exportSummary = () => {
    const summary = `${lang === 'en' ? 'Khata Summary' : 'खाता सारांश'}
${lang === 'en' ? 'Period' : 'अवधि'}: ${filterDateRange === 'all' ? (lang === 'en' ? 'All Time' : 'सभी समय') : filterDateRange}
${lang === 'en' ? 'Total Income' : 'कुल आय'}: ₹${filteredTotals.income.toLocaleString('en-IN')}
${lang === 'en' ? 'Total Expense' : 'कुल खर्च'}: ₹${filteredTotals.expense.toLocaleString('en-IN')}
${lang === 'en' ? 'Balance' : 'बैलेंस'}: ₹${(filteredTotals.income - filteredTotals.expense).toLocaleString('en-IN')}
${lang === 'en' ? 'Transactions' : 'लेनदेन'}: ${filteredTransactions.length}`;
    
    if (navigator.share) {
      navigator.share({ title: lang === 'en' ? 'Khata Summary' : 'खाता सारांश', text: summary });
    } else {
      navigator.clipboard.writeText(summary);
      alert(lang === 'en' ? 'Summary copied!' : 'सारांश कॉपी हो गया!');
    }
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!amount) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'khata'), {
        amount: Number(amount),
        description: desc || (type === 'income' ? 'Income' : 'Expense'),
        type,
        date: serverTimestamp(), // Use server timestamp for sorting
        displayDate: new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN')
      });
      setAmount('');
      setDesc('');
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const deleteTrans = async (id) => {
    if(confirm(t('delete') + '?')) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'khata', id));
    }
  };

  // ✨ Gemini Feature: AI Ledger Parser
  const handleMagicParse = async () => {
    if (!magicInput.trim()) return;
    setMagicLoading(true);
    try {
      const remaining = getRemainingQuota();
      if (remaining <= 0) {
        alert(lang === 'en' ? 'Daily API limit reached. Try again tomorrow!' : 'दैनिक API सीमा समाप्त। कल पुनः प्रयास करें!');
        setMagicLoading(false);
        return;
      }
      
      const prompt = `Analyze this transaction text: '${magicInput}'. Return ONLY a JSON object with keys: 'amount' (number), 'type' ('income' or 'expense'), 'description' (string, translated to ${lang}). If unsure, guess reasonable defaults.`;
      
      const data = await callGeminiWithQuota(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      // Clean markdown code blocks if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsed = JSON.parse(text);
      if (parsed) {
        setAmount(parsed.amount);
        setType(parsed.type?.toLowerCase() || 'expense');
        setDesc(parsed.description);
        setMagicInput('');
      }
    } catch (e) {
      console.error("Magic Parse Failed", e);
      alert(lang === 'en' ? "Could not understand. Try simpler text." : "समझ नहीं पाया। सरल पाठ का प्रयास करें।");
    }
    setMagicLoading(false);
  };
  
  // Voice Input Handler
  const handleVoiceInput = (field) => {
    setIsListening(true);
    setVoiceField(field);
    
    if (!window.startVoiceRecognition) {
      alert(lang === 'en' ? 'Voice not supported in this browser' : 'इस ब्राउज़र में आवाज समर्थित नहीं है');
      setIsListening(false);
      return;
    }
    
    window.startVoiceRecognition((result) => {
      if (field === 'amount') {
        // Extract numbers from speech
        const numbers = result.match(/\d+/g);
        if (numbers) {
          setAmount(numbers.join(''));
        }
      } else if (field === 'desc') {
        setDesc(result);
      }
      setIsListening(false);
      setVoiceField(null);
    }, lang);
  };

  return (
    <div className="w-full md:max-w-4xl md:mx-auto flex flex-col gap-3 md:gap-6 md:grid md:grid-cols-2">
      
      {/* Input Section */}
      <div className="bg-[var(--bg-card)] p-3 md:p-6 rounded-xl md:rounded-2xl shadow-[var(--shadow-card)] border border-[var(--border)]">
        <h3 className="font-bold text-sm md:text-lg mb-2 md:mb-4 text-[var(--text-main)] flex items-center gap-2">
          <Wallet className="text-[var(--primary)]" size={18} />
          {t('add_new')}
        </h3>

        {/* ✨ Magic AI Input Box */}
        <div className="mb-3 md:mb-6 p-2.5 md:p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-lg md:rounded-xl border border-[var(--accent)] border-dashed">
          <label className="text-[10px] md:text-xs font-bold text-[var(--secondary)] flex items-center gap-1 mb-1.5">
            <Sparkles size={10} /> {t('magic_add')}
          </label>
          <div className="flex gap-1.5 md:gap-2">
            <input 
              type="text" 
              value={magicInput}
              onChange={e => setMagicInput(e.target.value)}
              className="flex-1 bg-transparent border-b border-[var(--secondary)] text-xs md:text-sm p-1 focus:outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]"
              placeholder={t('magic_placeholder')}
              onKeyDown={e => e.key === 'Enter' && handleMagicParse()}
            />
            <button 
              onClick={handleMagicParse}
              disabled={magicLoading}
              className="bg-[var(--secondary)] text-white px-2 md:px-3 py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold disabled:opacity-50"
            >
              {magicLoading ? '...' : t('magic_btn')}
            </button>
          </div>
        </div>

        <form onSubmit={addTransaction} className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
             <button
               type="button"
               onClick={() => setType('income')}
               className={`p-2 md:p-3 rounded-lg border-2 font-bold text-xs md:text-sm transition-all ${type === 'income' ? 'border-[var(--success)] bg-green-50 text-[var(--success)]' : 'border-[var(--border)] text-[var(--text-muted)]'}`}
             >
               {t('income')}
             </button>
             <button
               type="button"
               onClick={() => setType('expense')}
               className={`p-2 md:p-3 rounded-lg border-2 font-bold text-xs md:text-sm transition-all ${type === 'expense' ? 'border-[var(--danger)] bg-red-50 text-[var(--danger)]' : 'border-[var(--border)] text-[var(--text-muted)]'}`}
             >
               {t('expense')}
             </button>
          </div>

          <div>
            <label className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase flex items-center justify-between">
              <span>{t('amount')}</span>
              <button
                type="button"
                onClick={() => handleVoiceInput('amount')}
                disabled={isListening}
                className="p-1 rounded-lg bg-[var(--bg-input)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                title={lang === 'en' ? 'Voice input' : 'आवाज इनपुट'}
              >
                <Mic size={12} className={isListening && voiceField === 'amount' ? 'animate-pulse' : ''} />
              </button>
            </label>
            <input 
              type="number" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--primary)] focus:outline-none py-1.5 md:py-2 text-[var(--text-main)]"
              placeholder="0"
              required
            />
          </div>

          <div>
             <label className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase flex items-center justify-between">
               <span>{t('desc')}</span>
               <button
                 type="button"
                 onClick={() => handleVoiceInput('desc')}
                 disabled={isListening}
                 className="p-1 rounded-lg bg-[var(--bg-input)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                 title={lang === 'en' ? 'Voice input' : 'आवाज इनपुट'}
               >
                 <Mic size={12} className={isListening && voiceField === 'desc' ? 'animate-pulse' : ''} />
               </button>
             </label>
             <input 
               type="text"
               value={desc}
               onChange={e => setDesc(e.target.value)} 
               className="w-full p-2 md:p-3 mt-1 rounded-lg bg-[var(--bg-input)] text-[var(--text-main)] text-sm border-none focus:ring-2 focus:ring-[var(--primary)]"
               placeholder={lang === 'en' ? "e.g. Sold seeds" : "उदा. बीज बेचे"}
             />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-3 md:py-4 bg-[var(--text-main)] text-[var(--bg-card)] rounded-lg md:rounded-xl font-bold text-sm md:text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {saving ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <Save size={18} />}
            {t('save')}
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="flex flex-col bg-[var(--bg-card)] md:bg-transparent rounded-xl md:rounded-none shadow-[var(--shadow-card)] md:shadow-none border border-[var(--border)] md:border-none">
        <div className="p-3 md:p-0 bg-[var(--bg-card)] md:bg-transparent border-b border-[var(--border)] md:border-none sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm md:text-lg text-[var(--text-main)]">{t('recent_transactions')}</h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 md:p-2 rounded-lg transition-all ${showFilters ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
              >
                <Filter size={14} />
              </button>
              <button
                onClick={exportToCSV}
                className="p-1.5 md:p-2 rounded-lg bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--primary)]"
                title={lang === 'en' ? 'Export CSV' : 'CSV निर्यात'}
              >
                <Download size={14} />
              </button>
              <button
                onClick={exportSummary}
                className="p-1.5 md:p-2 rounded-lg bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--primary)]"
                title={lang === 'en' ? 'Share Summary' : 'सारांश शेयर करें'}
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="space-y-2 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search...' : 'खोजें...'}
                  className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              
              {/* Type Filter */}
              <div className="flex gap-1.5">
                {['all', 'income', 'expense'].map(ft => (
                  <button
                    key={ft}
                    onClick={() => setFilterType(ft)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] md:text-xs font-bold transition-all ${filterType === ft ? (ft === 'income' ? 'bg-green-100 text-green-700' : ft === 'expense' ? 'bg-red-100 text-red-700' : 'bg-[var(--primary)] text-white') : 'bg-[var(--bg-input)] text-[var(--text-muted)]'}`}
                  >
                    {ft === 'all' ? (lang === 'en' ? 'All' : 'सभी') : ft === 'income' ? t('income') : t('expense')}
                  </button>
                ))}
              </div>
              
              {/* Date Range Filter */}
              <div className="flex gap-1.5">
                {['all', 'week', 'month', 'year'].map(dr => (
                  <button
                    key={dr}
                    onClick={() => setFilterDateRange(dr)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] md:text-xs font-bold transition-all ${filterDateRange === dr ? 'bg-[var(--secondary)] text-white' : 'bg-[var(--bg-input)] text-[var(--text-muted)]'}`}
                  >
                    {dr === 'all' ? (lang === 'en' ? 'All' : 'सभी') : dr === 'week' ? '7D' : dr === 'month' ? '30D' : '1Y'}
                  </button>
                ))}
              </div>
              
              {/* Filter Summary */}
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[var(--bg-glass)] text-[10px] md:text-xs">
                <span className="text-[var(--text-muted)]">
                  {filteredTransactions.length} {lang === 'en' ? 'txns' : 'लेनदेन'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">+₹{filteredTotals.income.toLocaleString('en-IN')}</span>
                  <span className="text-red-600">-₹{filteredTotals.expense.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Analytics Button */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex-1 py-1.5 md:py-2 px-2 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-300 text-[10px] md:text-xs font-bold flex items-center justify-center gap-1.5 hover:scale-105 transition-transform"
            >
              <BarChart3 size={12} />
              {lang === 'en' ? 'Analytics' : 'विश्लेषण'}
            </button>
          </div>
        </div>
        
        {/* Analytics Modal */}
        {showAnalytics && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
            <div className="bg-[var(--bg-card)] rounded-xl md:rounded-2xl p-4 md:p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm md:text-lg text-[var(--text-main)] flex items-center gap-2">
                  <BarChart3 className="text-[var(--primary)]" size={18} />
                  {lang === 'en' ? 'Analytics' : 'विश्लेषण'}
                </h3>
                <button onClick={() => setShowAnalytics(false)} className="p-1 hover:bg-[var(--bg-input)] rounded-lg">
                  <X size={18} className="text-[var(--text-muted)]" />
                </button>
              </div>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                <div className="p-2.5 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="text-[10px] md:text-xs font-bold text-green-700 dark:text-green-300 mb-0.5">{lang === 'en' ? 'Income' : 'आय'}</div>
                  <div className="text-lg md:text-2xl font-bold text-green-600">₹{filteredTotals.income.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-2.5 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20">
                  <div className="text-[10px] md:text-xs font-bold text-red-700 dark:text-red-300 mb-0.5">{lang === 'en' ? 'Expense' : 'खर्च'}</div>
                  <div className="text-lg md:text-2xl font-bold text-red-600">₹{filteredTotals.expense.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-2.5 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20">
                  <div className="text-[10px] md:text-xs font-bold text-blue-700 dark:text-blue-300 mb-0.5">{lang === 'en' ? 'Balance' : 'बैलेंस'}</div>
                  <div className={`text-lg md:text-2xl font-bold ${(filteredTotals.income - filteredTotals.expense) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    ₹{(filteredTotals.income - filteredTotals.expense).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              
              {/* Monthly Trend */}
              <div className="mb-4">
                <h4 className="font-bold text-xs md:text-sm text-[var(--text-main)] mb-2">{lang === 'en' ? '6 Months Trend' : '6 महीने का रुझान'}</h4>
                <div className="flex items-end justify-between h-28 md:h-40 gap-1.5 md:gap-2">
                  {[...Array(6)].map((_, i) => {
                    const monthDate = new Date();
                    monthDate.setMonth(monthDate.getMonth() - (5 - i));
                    const monthTransactions = transactions.filter(tr => {
                      const trDate = tr.date?.toDate ? tr.date.toDate() : new Date();
                      return trDate.getMonth() === monthDate.getMonth() && trDate.getFullYear() === monthDate.getFullYear();
                    });
                    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
                    const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
                    const maxAmount = Math.max(...transactions.map(t => Number(t.amount)), 1);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex gap-0.5">
                          <div
                            className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                            style={{ height: `${(income / maxAmount) * 80}px`, minHeight: income > 0 ? '4px' : '0' }}
                            title={`Income: ₹${income}`}
                          />
                          <div
                            className="flex-1 bg-gradient-to-t from-red-500 to-red-300 rounded-t"
                            style={{ height: `${(expense / maxAmount) * 80}px`, minHeight: expense > 0 ? '4px' : '0' }}
                            title={`Expense: ₹${expense}`}
                          />
                        </div>
                        <div className="text-[9px] md:text-xs text-[var(--text-muted)]">{monthDate.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short' })}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-3 mt-2 text-[10px] md:text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-green-500 to-green-300 rounded-sm"></div>
                    <span className="text-[var(--text-muted)]">{t('income')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-red-500 to-red-300 rounded-sm"></div>
                    <span className="text-[var(--text-muted)]">{t('expense')}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-[var(--bg-input)]">
                  <div className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] mb-0.5">{lang === 'en' ? 'Avg. Expense' : 'औसत खर्च'}</div>
                  <div className="text-base md:text-xl font-bold text-[var(--text-main)]">
                    ₹{Math.round(filteredTotals.expense / Math.max(filteredTransactions.filter(t => t.type === 'expense').length, 1)).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-[var(--bg-input)]">
                  <div className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] mb-0.5">{lang === 'en' ? 'Total Txns' : 'कुल लेनदेन'}</div>
                  <div className="text-base md:text-xl font-bold text-[var(--text-main)]">{filteredTransactions.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-3 md:p-0 space-y-2 max-h-[60vh] md:max-h-[50vh] overflow-y-auto">
          {filteredTransactions.length === 0 && (
             <div className="text-center py-8 text-[var(--text-muted)]">
               <Leaf className="mx-auto mb-2 opacity-50" size={28} />
               <p className="text-xs md:text-sm">{lang === 'en' ? (filterType !== 'all' || filterDateRange !== 'all' || searchQuery ? "No matching records." : "No records yet.") : (filterType !== 'all' || filterDateRange !== 'all' || searchQuery ? "कोई मिलान नहीं।" : "कोई रिकॉर्ड नहीं।")}</p>
             </div>
          )}
          {filteredTransactions.map(tr => (
            <div key={tr.id} className="group flex items-center justify-between p-2.5 md:p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center gap-2 md:gap-3">
                 <div className={`p-1.5 md:p-2 rounded-full ${tr.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {tr.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                 </div>
                 <div className="min-w-0">
                   <p className="font-bold text-xs md:text-sm text-[var(--text-main)] truncate">{tr.description}</p>
                   <p className="text-[10px] md:text-xs text-[var(--text-muted)]">{tr.displayDate || 'Today'}</p>
                 </div>
               </div>
               <div className="text-right flex-shrink-0">
                 <p className={`font-mono font-bold text-sm md:text-base ${tr.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                   {tr.type === 'income' ? '+' : '-'}₹{tr.amount}
                 </p>
                 <button onClick={() => deleteTrans(tr.id)} className="text-[10px] text-[var(--text-muted)] underline md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                   {t('delete')}
                 </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: CALCULATOR (Loan/KCC Calculator)
 * ==========================================================================================
 */
function CalculatorView({ user, db, appId, t, lang }) {
  const [calculatorType, setCalculatorType] = useState('kcc'); // 'kcc', 'emi', 'subsidy'
  
  // KCC Calculator State
  const [landArea, setLandArea] = useState('');
  const [cropType, setCropType] = useState('cereal');
  const [kccLimit, setKccLimit] = useState(0);
  
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('7');
  const [tenure, setTenure] = useState('12');
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  
  // Subsidy Calculator State
  const [equipmentCost, setEquipmentCost] = useState('');
  const [category, setCategory] = useState('general');
  const [subsidyAmount, setSubsidyAmount] = useState(0);
  
  // KCC Calculation (₹1.6L per hectare for cereals)
  const calculateKCC = () => {
    const area = parseFloat(landArea) || 0;
    const ratePerHectare = cropType === 'cereal' ? 160000 : cropType === 'cash' ? 200000 : 180000;
    setKccLimit(Math.round(area * ratePerHectare));
  };
  
  // EMI Calculation
  const calculateEMI = () => {
    const P = parseFloat(loanAmount) || 0;
    const r = (parseFloat(interestRate) || 0) / 12 / 100;
    const n = parseInt(tenure) || 1;
    
    if (P > 0 && r > 0 && n > 0) {
      const emiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emiValue * n;
      setEmi(Math.round(emiValue));
      setTotalInterest(Math.round(totalPayment - P));
    }
  };
  
  // Subsidy Calculation (50% for SC/ST, 40% for OBC, 30% for General)
  const calculateSubsidy = () => {
    const cost = parseFloat(equipmentCost) || 0;
    const rate = category === 'sc_st' ? 0.50 : category === 'obc' ? 0.40 : 0.30;
    setSubsidyAmount(Math.round(cost * rate));
  };
  
  return (
    <div className="w-full md:max-w-4xl md:mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 md:p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Calculator size={28} />
          {lang === 'en' ? 'Loan & Subsidy Calculator' : 'ऋण और सब्सिडी कैलकुलेटर'}
        </h2>
        <p className="opacity-90 text-sm">
          {lang === 'en' ? 'Calculate KCC limits, EMI, and subsidies' : 'केसीसी सीमा, ईएमआई और सब्सिडी की गणना करें'}
        </p>
      </div>
      
      {/* Calculator Type Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setCalculatorType('kcc')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${calculatorType === 'kcc' ? 'bg-blue-500 text-white shadow-lg' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]'}`}
        >
          {lang === 'en' ? 'KCC Limit' : 'केसीसी सीमा'}
        </button>
        <button
          onClick={() => setCalculatorType('emi')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${calculatorType === 'emi' ? 'bg-purple-500 text-white shadow-lg' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]'}`}
        >
          {lang === 'en' ? 'EMI' : 'ईएमआई'}
        </button>
        <button
          onClick={() => setCalculatorType('subsidy')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${calculatorType === 'subsidy' ? 'bg-green-500 text-white shadow-lg' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]'}`}
        >
          {lang === 'en' ? 'Subsidy' : 'सब्सिडी'}
        </button>
      </div>
      
      {/* KCC Calculator */}
      {calculatorType === 'kcc' && (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 space-y-6">
          <div>
            <label className="text-sm font-bold text-[var(--text-muted)] mb-2 block">
              {lang === 'en' ? 'Land Area (Hectares)' : 'भूमि क्षेत्र (हेक्टेयर)'}
            </label>
            <input
              type="number"
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)]"
              placeholder="0.0"
            />
          </div>
          
          <div>
            <label className="text-sm font-bold text-[var(--text-muted)] mb-2 block">
              {lang === 'en' ? 'Crop Type' : 'फसल प्रकार'}
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)]"
            >
              <option value="cereal">{lang === 'en' ? 'Cereals (Wheat, Rice)' : 'अनाज (गेहूं, धान)'}</option>
              <option value="cash">{lang === 'en' ? 'Cash Crops (Cotton, Sugarcane)' : 'नकदी फसल (कपास, गन्ना)'}</option>
              <option value="horticulture">{lang === 'en' ? 'Horticulture' : 'बागवानी'}</option>
            </select>
          </div>
          
          <button
            onClick={calculateKCC}
            className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
          >
            {lang === 'en' ? 'Calculate KCC Limit' : 'केसीसी सीमा की गणना करें'}
          </button>
          
          {kccLimit > 0 && (
            <div className="p-4 md:p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-500">
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">{lang === 'en' ? 'Your KCC Limit' : 'आपकी केसीसी सीमा'}</p>
              <p className="text-3xl md:text-4xl font-bold text-blue-600">₹{kccLimit.toLocaleString('en-IN')}</p>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                {lang === 'en' ? 'Based on' : 'आधारित'} {cropType === 'cereal' ? '₹1.6L' : cropType === 'cash' ? '₹2L' : '₹1.8L'} {lang === 'en' ? 'per hectare' : 'प्रति हेक्टेयर'}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* EMI Calculator */}
      {calculatorType === 'emi' && (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 space-y-6">
          <div>
            <label className="text-sm font-bold text-[var(--text-muted)] mb-2 block">
              {lang === 'en' ? 'Loan Amount (₹)' : 'ऋण राशि (₹)'}
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)]"
              placeholder="100000"
            />
          </div>
          
          <div>
            <label className="text-sm font-bold text-[var(--text-muted)] mb-2 block">
              {lang === 'en' ? 'Interest Rate (% per year)' : 'ब्याज दर (% प्रति वर्ष)'}
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)]"
              placeholder="7"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="text-sm font-bold text-[var(--text-muted)] mb-2 block">
              {lang === 'en' ? 'Tenure (Months)' : 'अवधि (महीने)'}
            </label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)]"
              placeholder="12"
            />
          </div>
          
          <button
            onClick={calculateEMI}
            className="w-full py-4 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors"
          >
            {lang === 'en' ? 'Calculate EMI' : 'ईएमआई की गणना करें'}
          </button>
          
          {emi > 0 && (
            <div className="space-y-3">
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-500">
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">{lang === 'en' ? 'Monthly EMI' : 'मासिक ईएमआई'}</p>
                <p className="text-4xl font-bold text-purple-600">₹{emi.toLocaleString('en-IN')}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[var(--bg-input)]">
                  <p className="text-xs text-[var(--text-muted)] mb-1">{lang === 'en' ? 'Total Payment' : 'कुल भुगतान'}</p>
                  <p className="text-xl font-bold text-[var(--text-main)]">₹{(emi * parseInt(tenure)).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-input)]">
                  <p className="text-xs text-[var(--text-muted)] mb-1">{lang === 'en' ? 'Total Interest' : 'कुल ब्याज'}</p>
                  <p className="text-xl font-bold text-red-600">₹{totalInterest.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Subsidy Calculator */}
      {calculatorType === 'subsidy' && (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 space-y-6">
          <div>
            <label className="text-sm font-bold text-[var(--text-muted)] mb-2 block">
              {lang === 'en' ? 'Equipment/Machine Cost (₹)' : 'उपकरण/मशीन लागत (₹)'}
            </label>
            <input
              type="number"
              value={equipmentCost}
              onChange={(e) => setEquipmentCost(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)]"
              placeholder="50000"
            />
          </div>
          
          <div>
            <label className="text-sm font-bold text-[var(--text-muted)] mb-2 block">
              {lang === 'en' ? 'Category' : 'श्रेणी'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)]"
            >
              <option value="general">{lang === 'en' ? 'General (30%)' : 'सामान्य (30%)'}</option>
              <option value="obc">{lang === 'en' ? 'OBC (40%)' : 'ओबीसी (40%)'}</option>
              <option value="sc_st">{lang === 'en' ? 'SC/ST (50%)' : 'अनुसूचित जाति/जनजाति (50%)'}</option>
            </select>
          </div>
          
          <button
            onClick={calculateSubsidy}
            className="w-full py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
          >
            {lang === 'en' ? 'Calculate Subsidy' : 'सब्सिडी की गणना करें'}
          </button>
          
          {subsidyAmount > 0 && (
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500">
              <p className="text-sm text-green-700 dark:text-green-300 mb-2">{lang === 'en' ? 'Subsidy Amount' : 'सब्सिडी राशि'}</p>
              <p className="text-4xl font-bold text-green-600">₹{subsidyAmount.toLocaleString('en-IN')}</p>
              <p className="text-sm text-[var(--text-main)] mt-3">
                {lang === 'en' ? 'Your contribution:' : 'आपका योगदान:'} <span className="font-bold">₹{(parseFloat(equipmentCost) - subsidyAmount).toLocaleString('en-IN')}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: SAATHI (AI CHAT)
 * ==========================================================================================
 */
function SaathiView({ user, profile, db, appId, t, lang }) {
  const [messages, setMessages] = useState([
    { role: 'model', text: t('saathi_intro').replace('{name}', profile?.name || (lang === 'en' ? 'Ji' : 'जी')) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Base64
  const [audioPlaying, setAudioPlaying] = useState(null); // Message Index
  const [chatId, setChatId] = useState(null); // Current chat session ID
  
  // Chat History from Firebase
  const [chatHistory, setChatHistory] = useState([]);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // Load chat history from Firebase
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'chats'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setChatHistory(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    }, (error) => console.log("Chat history error:", error));
    return () => unsub();
  }, [user, db, appId]);

  // Save message to Firebase
  const saveMessageToFirebase = async (userMsg, modelReply) => {
    if (!user) return;
    try {
      // Create or update chat session
      if (!chatId) {
        // Create new chat session
        const chatRef = await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'chats'), {
          title: userMsg.substring(0, 50) + (userMsg.length > 50 ? '...' : ''),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setChatId(chatRef.id);
        
        // Save messages
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'chats', chatRef.id, 'messages'), {
          role: 'user',
          text: userMsg,
          timestamp: serverTimestamp()
        });
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'chats', chatRef.id, 'messages'), {
          role: 'model',
          text: modelReply,
          timestamp: serverTimestamp()
        });
      } else {
        // Add to existing chat
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'chats', chatId, 'messages'), {
          role: 'user',
          text: userMsg,
          timestamp: serverTimestamp()
        });
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'chats', chatId, 'messages'), {
          role: 'model',
          text: modelReply,
          timestamp: serverTimestamp()
        });
        // Update chat timestamp
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'chats', chatId), {
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (e) {
      console.error("Error saving chat:", e);
    }
  };

  // Start new chat
  const startNewChat = () => {
    setChatId(null);
    setMessages([
      { role: 'model', text: t('saathi_intro').replace('{name}', profile?.name || (lang === 'en' ? 'Ji' : 'जी')) }
    ]);
  };

  // Load existing chat
  const loadChat = async (chatSessionId) => {
    if (!user) return;
    try {
      const messagesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chats', chatSessionId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(q);
      const loadedMessages = snapshot.docs.map(doc => ({
        role: doc.data().role,
        text: doc.data().text
      }));
      if (loadedMessages.length > 0) {
        setChatId(chatSessionId);
        setMessages(loadedMessages);
      }
    } catch (e) {
      console.error("Error loading chat:", e);
    }
  };

  // Delete chat from Firebase
  const deleteChat = async (e, chatSessionId) => {
    e.stopPropagation(); // Prevent triggering loadChat
    if (!user) return;
    try {
      // Delete all messages in the chat
      const messagesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chats', chatSessionId, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
      const deletePromises = messagesSnapshot.docs.map(msgDoc => deleteDoc(msgDoc.ref));
      await Promise.all(deletePromises);
      
      // Delete the chat document itself
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'chats', chatSessionId));
      
      // If currently viewing this chat, start a new one
      if (chatId === chatSessionId) {
        startNewChat();
      }
    } catch (e) {
      console.error("Error deleting chat:", e);
    }
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    
    const userMsg = input;
    const userImg = selectedImage; 
    setInput('');
    setSelectedImage(null); 
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg, image: userImg }]);
    setLoading(true);

    try {
      // Get cached weather for AI context
      const weatherCache = localStorage.getItem('weather_cache');
      let weatherContext = '';
      if (weatherCache) {
        try {
          const { data } = JSON.parse(weatherCache);
          if (data?.weather) {
            const w = data.weather;
            weatherContext = ` Current Weather: ${Math.round(w.main.temp)}°C, ${w.weather[0]?.description}, Humidity: ${w.main.humidity}%.`;
          }
        } catch (e) {
          // Ignore cache parse errors
        }
      }

      const systemInstruction = `You are Gramin Saathi, a helpful, village-friendly financial and agricultural assistant. 
      User: ${profile?.name}, Village: ${profile?.village}, Crop: ${profile?.crop}.${weatherContext}
      Language: ${lang === 'en' ? 'English (Simple)' : 'Hindi (Simple)'}.
      Capabilities:
      1. Crop Doctor: If user sends an image, diagnose crop diseases or identify objects.
      2. Finance: Short, metaphor-rich advice on saving/schemes.
      3. Weather-Aware: Consider current weather in your farming advice.
      4. Tone: Respectful ("Ji"), practical, encouraging.`;

      // Payload Construction
      const contentParts = [];
      if (userMsg) contentParts.push({ text: `User said: ${userMsg}` });
      if (userImg) {
        contentParts.push({ 
          inlineData: { 
            mimeType: "image/jpeg", 
            data: userImg.split(',')[1] 
          } 
        });
        contentParts.push({ text: "Analyze this image. If it's a crop, diagnose issues. If document, summarize." });
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: contentParts }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || t('saathi_error');
      
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      
      // Save to Firebase
      await saveMessageToFirebase(userMsg, reply);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: t('network_error') }]);
    }
    setLoading(false);
  };

  // ✨ TTS using Web Speech API (Native Browser Support) with Multi-language Support
  const playTTS = (text, index) => {
    if (!('speechSynthesis' in window)) {
      alert(lang === 'en' ? 'Text-to-speech not supported in your browser.' : 'आपके ब्राउज़र में TTS समर्थित नहीं है।');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    setAudioPlaying(index);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language codes to speech synthesis languages
    const langMap = {
      'hi': 'hi-IN',
      'pa': 'pa-IN', // Punjabi
      'te': 'te-IN', // Telugu
      'ta': 'ta-IN', // Tamil
      'kn': 'kn-IN', // Kannada
      'ml': 'ml-IN', // Malayalam
      'gu': 'gu-IN', // Gujarati
      'mr': 'mr-IN', // Marathi
      'bn': 'bn-IN', // Bengali
      'en': 'en-IN'
    };
    
    utterance.lang = langMap[lang] || 'en-IN';
    utterance.rate = 0.85; // Slower for better clarity in regional languages
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to get a voice for the language
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith(langMap[lang]?.split('-')[0])
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onend = () => setAudioPlaying(null);
    utterance.onerror = () => setAudioPlaying(null);
    
    window.speechSynthesis.speak(utterance);
  };

  // Mobile history panel state
  const [showMobileHistory, setShowMobileHistory] = useState(false);

  return (
    <div className="flex gap-2 md:gap-6 h-full max-h-full relative">
      <audio ref={audioRef} className="hidden" />
      
      {/* Mobile History Overlay */}
      {showMobileHistory && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileHistory(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--bg-main)] border-r border-[var(--border)] flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-main)] text-sm">{lang === 'en' ? 'Chat History' : 'चैट इतिहास'}</h3>
              <button onClick={() => setShowMobileHistory(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-2">
              <button onClick={() => { startNewChat(); setShowMobileHistory(false); }} className="w-full py-2 flex items-center justify-center gap-2 btn-white rounded-lg text-sm">
                <Plus size={16} />
                {lang === 'en' ? 'New Chat' : 'नई चर्चा'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase px-2 mb-2">{lang === 'en' ? 'Recent' : 'हाल की'}</div>
              {chatHistory.length === 0 ? (
                <div className="text-xs text-[var(--text-muted)] text-center py-4">
                  {lang === 'en' ? 'No conversations yet' : 'अभी तक कोई बातचीत नहीं'}
                </div>
              ) : chatHistory.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => { loadChat(item.id); setShowMobileHistory(false); }}
                  className={`p-2.5 rounded-lg cursor-pointer text-xs text-[var(--text-main)] border transition-colors group flex items-start justify-between gap-2 ${chatId === item.id ? 'bg-[var(--primary)]/20 border-[var(--primary)]' : 'hover:bg-[var(--bg-card-hover)] border-transparent'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {item.createdAt?.toDate?.()?.toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN') || ''}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => deleteChat(e, item.id)}
                    className="p-1 hover:bg-red-500/20 rounded transition-all text-[var(--text-muted)] hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 1. History Sidebar (Desktop Only) */}
      <div className="hidden md:flex flex-col w-64 glass rounded-3xl overflow-hidden shrink-0">
         <div className="p-4 border-b border-[var(--border)] bg-black/5">
           <button onClick={startNewChat} className="w-full py-2 flex items-center justify-center gap-2 btn-white rounded-xl shadow-lg hover:shadow-xl transition-all">
             <Plus size={18} />
             {lang === 'en' ? 'New Chat' : 'नई चर्चा'}
           </button>
         </div>
         <div className="flex-1 overflow-y-auto p-3 space-y-2">
           <div className="text-xs font-bold text-[var(--text-muted)] uppercase px-2 mb-2 mt-2">{lang === 'en' ? 'Recent' : 'हाल की'}</div>
           {chatHistory.length === 0 ? (
             <div className="text-xs text-[var(--text-muted)] text-center py-4">
               {lang === 'en' ? 'No conversations yet' : 'अभी तक कोई बातचीत नहीं'}
             </div>
           ) : chatHistory.map(item => (
             <div 
               key={item.id} 
               onClick={() => loadChat(item.id)}
               className={`p-3 rounded-xl cursor-pointer text-sm text-[var(--text-main)] border transition-colors group flex items-start justify-between gap-2 ${chatId === item.id ? 'bg-[var(--primary)]/20 border-[var(--primary)]' : 'hover:bg-[var(--bg-card-hover)] border-transparent hover:border-[var(--border)]'}`}
             >
               <div className="flex-1 min-w-0">
                 <div className="font-medium truncate">{item.title}</div>
                 <div className="text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">
                   {item.createdAt?.toDate?.()?.toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN') || ''}
                 </div>
               </div>
               <button 
                 onClick={(e) => deleteChat(e, item.id)}
                 className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-lg transition-all text-[var(--text-muted)] hover:text-red-500"
                 title={lang === 'en' ? 'Delete chat' : 'चैट हटाएं'}
               >
                 <Trash2 size={14} />
               </button>
             </div>
           ))}
         </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 glass rounded-xl md:rounded-3xl flex flex-col overflow-hidden relative shadow-xl md:shadow-2xl">
        
        {/* Chat Header */}
        <div className="p-2.5 md:p-4 border-b border-[var(--border)] bg-[var(--bg-glass)] backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-lg">
              <Sprout size={16} className="md:hidden" />
              <Sprout size={20} className="hidden md:block" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-main)] text-sm md:text-base">Saathi AI</h3>
              <p className="text-[10px] md:text-xs text-[var(--success)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                {t('online_mode')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={startNewChat}
              className="p-1.5 md:p-2 rounded-lg bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              title={lang === 'en' ? 'New Chat' : 'नई चर्चा'}
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={() => setShowMobileHistory(true)}
              className="md:hidden p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              <History size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6 scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
               {m.image && (
                 <img src={m.image} alt="Upload" loading="lazy" className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-xl md:rounded-2xl mb-2 border border-[var(--border)] shadow-md" />
               )}
               
               <div className={`max-w-[88%] md:max-w-[70%] p-3 md:p-5 rounded-xl md:rounded-2xl text-xs md:text-sm leading-relaxed relative shadow-sm ${
                 m.role === 'user' 
                 ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white rounded-br-none shadow-[var(--primary)]/20' 
                 : 'bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border)] rounded-bl-none'
               }`}>
                 {m.text}
                 
                 {/* TTS Button */}
                 {m.role === 'model' && (
                   <button 
                     onClick={() => playTTS(m.text, i)}
                     className="absolute -bottom-6 left-0 flex items-center gap-1 text-[var(--text-muted)] text-[10px] md:text-xs py-0.5 px-1.5 rounded hover:bg-[var(--bg-card-hover)] transition-colors"
                   >
                     {audioPlaying === i ? <Loader size={10} className="animate-spin"/> : <Volume2 size={10} />}
                     <span className="hidden md:inline">{audioPlaying === i ? t('analyzing') : t('play_audio')}</span>
                     <span className="md:hidden">{audioPlaying === i ? '...' : '🔊'}</span>
                   </button>
                 )}
               </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="bg-[var(--bg-input)] p-3 md:p-4 rounded-2xl md:rounded-3xl rounded-bl-none flex gap-1.5 items-center">
                 <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--primary)] rounded-full animate-bounce" />
                 <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--primary)] rounded-full animate-bounce delay-75" />
                 <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--primary)] rounded-full animate-bounce delay-150" />
               </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-2.5 md:p-4 bg-[var(--bg-glass)] border-t border-[var(--border)] backdrop-blur-md">
          {selectedImage && (
            <div className="mb-2 relative w-16 h-16 md:w-20 md:h-20 group">
              <img src={selectedImage} className="w-full h-full object-cover rounded-lg md:rounded-xl border border-[var(--border)] shadow-lg" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:scale-110 transition-transform"><X size={10}/></button>
            </div>
          )}

          <div className="flex gap-2 md:gap-3 items-end bg-[var(--bg-input)] p-1.5 md:p-2 rounded-2xl md:rounded-[2rem] border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all shadow-inner">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:p-3 rounded-full bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              <Camera size={18} className="md:hidden" />
              <Camera size={20} className="hidden md:block" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />

            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={t('ai_prompt')}
              className="flex-1 bg-transparent border-none focus:ring-0 text-[var(--text-main)] placeholder-[var(--text-muted)] p-1.5 md:p-2 text-sm"
            />
            
            <button 
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || loading}
              className="p-2 md:p-3 rounded-full btn-white disabled:opacity-50 hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20"
            >
              {input.trim() || selectedImage ? (
                <>
                  <Send size={18} className="md:hidden" />
                  <Send size={20} className="hidden md:block" />
                </>
              ) : (
                <>
                  <Mic size={18} className="md:hidden" />
                  <Mic size={20} className="hidden md:block" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: YOJANA (SCHEMES)
 * ==========================================================================================
 */
function YojanaView({ t, lang, user, db, appId }) {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState(new Set());
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Load bookmarked schemes from Firebase
  useEffect(() => {
    if (!user || !db) return;
    
    const loadBookmarks = async () => {
      try {
        const bookmarksRef = collection(db, `artifacts/${appId}/users/${user.uid}/bookmarked_schemes`);
        const snapshot = await getDocs(bookmarksRef);
        const bookmarked = new Set();
        snapshot.forEach(doc => bookmarked.add(parseInt(doc.id)));
        setBookmarkedSchemes(bookmarked);
      } catch (e) {
        console.error('Error loading bookmarks:', e);
      }
    };
    
    loadBookmarks();
  }, [user, db, appId]);

  // Toggle bookmark
  const toggleBookmark = async (schemeId, e) => {
    e.stopPropagation();
    if (!user || !db) return;
    
    const isBookmarked = bookmarkedSchemes.has(schemeId);
    const newBookmarks = new Set(bookmarkedSchemes);
    
    try {
      const bookmarkRef = doc(db, `artifacts/${appId}/users/${user.uid}/bookmarked_schemes/${schemeId}`);
      if (isBookmarked) {
        await deleteDoc(bookmarkRef);
        newBookmarks.delete(schemeId);
      } else {
        await setDoc(bookmarkRef, { schemeId, savedAt: new Date().toISOString() });
        newBookmarks.add(schemeId);
      }
      setBookmarkedSchemes(newBookmarks);
    } catch (e) {
      console.error('Error toggling bookmark:', e);
    }
  };
  
  // Scheme Icons & Colors mapping
  const schemeStyles = {
    1: { icon: Wallet, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
    2: { icon: TrendingUp, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
    3: { icon: Shield, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
    4: { icon: Settings, color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
    5: { icon: User, color: 'text-pink-500', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30' },
    6: { icon: Sun, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
    7: { icon: Smartphone, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
    8: { icon: Shield, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
    9: { icon: Wallet, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
    10: { icon: Settings, color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
    11: { icon: Wallet, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
    12: { icon: TrendingUp, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  };

  const tagColors = {
    'Income': 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    'Loan': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    'Insurance': 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    'Skill': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    'Women': 'bg-pink-500/20 text-pink-500 border-pink-500/30',
    'Energy': 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    'Tech': 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
  };

  const schemes = [
    {
      id: 1,
      nameEn: "PM Kisan Samman Nidhi",
      nameHi: "पीएम किसान सम्मान निधि",
      descEn: "Get ₹6000 per year directly in your bank account.",
      descHi: "अपने बैंक खाते में सीधे ₹6000 प्रति वर्ष प्राप्त करें।",
      tag: "Income",
      benefitsEn: ["₹6000 per year in 3 installments", "Direct bank transfer", "No middlemen involved"],
      benefitsHi: ["3 किस्तों में प्रति वर्ष ₹6000", "सीधे बैंक ट्रांसफर", "कोई बिचौलिया नहीं"],
      eligibilityEn: ["All land-holding farmer families", "Aadhar card linked to bank", "Cultivable land ownership"],
      eligibilityHi: ["सभी भूमिधारक किसान परिवार", "बैंक से जुड़ा आधार कार्ड", "खेती योग्य भूमि का स्वामित्व"],
      docsEn: ["Aadhar Card", "Bank Passbook", "Land Records (Khatauni)"],
      docsHi: ["आधार कार्ड", "बैंक पासबुक", "भूमि रिकॉर्ड (खतौनी)"],
      applyLink: "https://pmkisan.gov.in"
    },
    {
      id: 2,
      nameEn: "Kisan Credit Card (KCC)",
      nameHi: "किसान क्रेडिट कार्ड (केसीसी)",
      descEn: "Low interest loans (4%) for seeds and fertilizers.",
      descHi: "बीज और खाद के लिए कम ब्याज (4%) वाला ऋण।",
      tag: "Loan",
      benefitsEn: ["4% interest rate (with subsidy)", "Flexible repayment", "Crop insurance included", "Up to ₹3 lakh loan"],
      benefitsHi: ["4% ब्याज दर (सब्सिडी के साथ)", "लचीला पुनर्भुगतान", "फसल बीमा शामिल", "₹3 लाख तक का ऋण"],
      eligibilityEn: ["Farmers owning or leasing land", "Sharecroppers and tenant farmers", "Self-help groups"],
      eligibilityHi: ["भूमि के मालिक या पट्टेदार किसान", "बटाईदार और किरायेदार किसान", "स्वयं सहायता समूह"],
      docsEn: ["Aadhar Card", "Land documents", "Passport photo", "Application form"],
      docsHi: ["आधार कार्ड", "भूमि दस्तावेज", "पासपोर्ट फोटो", "आवेदन पत्र"],
      applyLink: "https://pmkisan.gov.in/KCC"
    },
    {
      id: 3,
      nameEn: "Pradhan Mantri Fasal Bima",
      nameHi: "प्रधानमंत्री फसल बीमा योजना",
      descEn: "Insurance for crop failure due to rain or drought.",
      descHi: "बारिश या सूखे के कारण फसल खराब होने का बीमा।",
      tag: "Insurance",
      benefitsEn: ["Low premium (1.5-2%)", "Full sum insured coverage", "Quick claim settlement", "Covers all crops"],
      benefitsHi: ["कम प्रीमियम (1.5-2%)", "पूर्ण बीमित राशि कवरेज", "त्वरित दावा निपटान", "सभी फसलों को कवर करता है"],
      eligibilityEn: ["All farmers growing notified crops", "Both loanee and non-loanee farmers", "Sharecroppers with land docs"],
      eligibilityHi: ["अधिसूचित फसल उगाने वाले सभी किसान", "ऋणी और गैर-ऋणी दोनों किसान", "भूमि दस्तावेजों वाले बटाईदार"],
      docsEn: ["Aadhar Card", "Bank details", "Land records", "Sowing certificate"],
      docsHi: ["आधार कार्ड", "बैंक विवरण", "भूमि रिकॉर्ड", "बुवाई प्रमाण पत्र"],
      applyLink: "https://pmfby.gov.in"
    },
    {
      id: 4,
      nameEn: "PM Vishwakarma",
      nameHi: "पीएम विश्वकर्मा",
      descEn: "Loans and skill training for traditional artisans/craftsmen.",
      descHi: "पारंपरिक कारीगरों और शिल्पकारों के लिए ऋण और कौशल प्रशिक्षण।",
      tag: "Skill",
      benefitsEn: ["₹500/day during training", "Up to ₹3 lakh loan at 5%", "Free toolkit worth ₹15,000", "PM Vishwakarma Certificate"],
      benefitsHi: ["प्रशिक्षण के दौरान ₹500/दिन", "5% पर ₹3 लाख तक का ऋण", "₹15,000 मूल्य की मुफ्त टूलकिट", "पीएम विश्वकर्मा प्रमाण पत्र"],
      eligibilityEn: ["Traditional artisans/craftsmen", "Age 18+ years", "Working in 18 identified trades"],
      eligibilityHi: ["पारंपरिक कारीगर/शिल्पकार", "आयु 18+ वर्ष", "18 पहचाने गए व्यापारों में काम करना"],
      docsEn: ["Aadhar Card", "Bank account", "Mobile number", "Trade proof"],
      docsHi: ["आधार कार्ड", "बैंक खाता", "मोबाइल नंबर", "व्यापार प्रमाण"],
      applyLink: "https://pmvishwakarma.gov.in"
    },
    {
      id: 5,
      nameEn: "Lakhpati Didi",
      nameHi: "लखपति दीदी",
      descEn: "Skill development training for women in SHGs to earn more.",
      descHi: "स्वयं सहायता समूहों में महिलाओं के लिए कौशल विकास प्रशिक्षण।",
      tag: "Women",
      benefitsEn: ["Free skill training", "Market linkage support", "Bank loan access", "Target: ₹1 lakh/year income"],
      benefitsHi: ["मुफ्त कौशल प्रशिक्षण", "बाजार संपर्क सहायता", "बैंक ऋण पहुंच", "लक्ष्य: ₹1 लाख/वर्ष आय"],
      eligibilityEn: ["Women in Self Help Groups", "Rural women 18-60 years", "Interest in entrepreneurship"],
      eligibilityHi: ["स्वयं सहायता समूहों में महिलाएं", "ग्रामीण महिलाएं 18-60 वर्ष", "उद्यमिता में रुचि"],
      docsEn: ["Aadhar Card", "SHG membership proof", "Bank account"],
      docsHi: ["आधार कार्ड", "एसएचजी सदस्यता प्रमाण", "बैंक खाता"],
      applyLink: "https://nrlm.gov.in"
    },
    {
      id: 6,
      nameEn: "PM Surya Ghar",
      nameHi: "पीएम सूर्य घर",
      descEn: "Free electricity via rooftop solar panels.",
      descHi: "छत पर सौर पैनलों के माध्यम से मुफ्त बिजली।",
      tag: "Energy",
      benefitsEn: ["300 units free electricity/month", "Subsidy up to ₹78,000", "25 year panel life", "Sell extra power to grid"],
      benefitsHi: ["300 यूनिट मुफ्त बिजली/माह", "₹78,000 तक की सब्सिडी", "25 साल पैनल जीवन", "ग्रिड को अतिरिक्त बिजली बेचें"],
      eligibilityEn: ["Residential house owner", "Valid electricity connection", "Suitable rooftop space"],
      eligibilityHi: ["आवासीय घर का मालिक", "वैध बिजली कनेक्शन", "उपयुक्त छत की जगह"],
      docsEn: ["Aadhar Card", "Electricity bill", "Bank account", "Property documents"],
      docsHi: ["आधार कार्ड", "बिजली बिल", "बैंक खाता", "संपत्ति दस्तावेज"],
      applyLink: "https://pmsuryaghar.gov.in"
    },
    {
      id: 7,
      nameEn: "Namo Drone Didi",
      nameHi: "नमो ड्रोन दीदी",
      descEn: "Drones for women to help in agriculture.",
      descHi: "कृषि में मदद करने के लिए महिलाओं के लिए ड्रोन।",
      tag: "Tech",
      benefitsEn: ["Free drone + training", "Earn ₹1 lakh+/year as drone pilot", "Agriculture spraying service", "Modern technology access"],
      benefitsHi: ["मुफ्त ड्रोन + प्रशिक्षण", "ड्रोन पायलट के रूप में ₹1 लाख+/वर्ष कमाएं", "कृषि छिड़काव सेवा", "आधुनिक तकनीक तक पहुंच"],
      eligibilityEn: ["Women from SHGs", "Age 18-50 years", "10th pass minimum", "Physical fitness"],
      eligibilityHi: ["एसएचजी से महिलाएं", "आयु 18-50 वर्ष", "न्यूनतम 10वीं पास", "शारीरिक फिटनेस"],
      docsEn: ["Aadhar Card", "10th marksheet", "SHG certificate", "Medical certificate"],
      docsHi: ["आधार कार्ड", "10वीं की मार्कशीट", "एसएचजी प्रमाण पत्र", "चिकित्सा प्रमाण पत्र"],
      applyLink: "https://agriculture.gov.in/drone"
    },
    {
      id: 8,
      nameEn: "Ayushman Bharat",
      nameHi: "आयुष्मान भारत",
      descEn: "Free health insurance of ₹5 lakh for family.",
      descHi: "परिवार के लिए ₹5 लाख का मुफ्त स्वास्थ्य बीमा।",
      tag: "Insurance",
      benefitsEn: ["₹5 lakh coverage per family/year", "Free treatment at empanelled hospitals", "Covers 1400+ medical procedures", "No age limit"],
      benefitsHi: ["₹5 लाख कवरेज प्रति परिवार/वर्ष", "सूचीबद्ध अस्पतालों में मुफ्त इलाज", "1400+ चिकित्सा प्रक्रियाओं को कवर करता है", "कोई आयु सीमा नहीं"],
      eligibilityEn: ["Families listed in SECC 2011", "Rural and urban poor", "Automatic eligibility for eligible families"],
      eligibilityHi: ["SECC 2011 में सूचीबद्ध परिवार", "ग्रामीण और शहरी गरीब", "पात्र परिवारों के लिए स्वचालित पात्रता"],
      docsEn: ["Aadhar Card", "Ration Card", "Mobile number", "Family details"],
      docsHi: ["आधार कार्ड", "राशन कार्ड", "मोबाइल नंबर", "परिवार विवरण"],
      applyLink: "https://pmjay.gov.in"
    },
    {
      id: 9,
      nameEn: "MGNREGA",
      nameHi: "मनरेगा",
      descEn: "Guaranteed 100 days employment at ₹300/day.",
      descHi: "₹300/दिन की दर से 100 दिन की गारंटी रोजगार।",
      tag: "Income",
      benefitsEn: ["100 days guaranteed work/year", "₹300+ per day wages", "Direct bank payment within 15 days", "Work near home"],
      benefitsHi: ["100 दिन गारंटी काम/वर्ष", "₹300+ प्रति दिन मजदूरी", "15 दिनों के भीतर सीधे बैंक भुगतान", "घर के पास काम"],
      eligibilityEn: ["Rural household adults", "18+ years age", "Willing to do manual work"],
      eligibilityHi: ["ग्रामीण परिवार के वयस्क", "18+ वर्ष आयु", "शारीरिक काम करने के लिए तैयार"],
      docsEn: ["Job card", "Aadhar Card", "Bank account", "Passport photo"],
      docsHi: ["जॉब कार्ड", "आधार कार्ड", "बैंक खाता", "पासपोर्ट फोटो"],
      applyLink: "https://nrega.nic.in"
    },
    {
      id: 10,
      nameEn: "Soil Health Card",
      nameHi: "मृदा स्वास्थ्य कार्ड",
      descEn: "Free soil testing to increase crop yield by 15-20%.",
      descHi: "फसल की उपज 15-20% बढ़ाने के लिए मुफ्त मिट्टी परीक्षण।",
      tag: "Skill",
      benefitsEn: ["Free soil nutrient analysis", "Customized fertilizer recommendations", "Save 15-20% on fertilizer costs", "Increase yield by 15-20%"],
      benefitsHi: ["मुफ्त मिट्टी पोषक तत्व विश्लेषण", "अनुकूलित उर्वरक सिफारिशें", "उर्वरक लागत पर 15-20% बचत", "उपज में 15-20% वृद्धि"],
      eligibilityEn: ["All farmers with cultivable land", "Both loanee and non-loanee", "Sharecroppers with permission"],
      eligibilityHi: ["खेती योग्य भूमि वाले सभी किसान", "ऋणी और गैर-ऋणी दोनों", "अनुमति वाले बटाईदार"],
      docsEn: ["Aadhar Card", "Land records", "Soil sample"],
      docsHi: ["आधार कार्ड", "भूमि रिकॉर्ड", "मिट्टी का नमूना"],
      applyLink: "https://soilhealth.dac.gov.in"
    },
    {
      id: 11,
      nameEn: "Atal Pension Yojana",
      nameHi: "अटल पेंशन योजना",
      descEn: "Guaranteed monthly pension of ₹1000-₹5000 after 60.",
      descHi: "60 के बाद ₹1000-₹5000 की गारंटी मासिक पेंशन।",
      tag: "Income",
      benefitsEn: ["Fixed pension ₹1000-₹5000/month", "Minimum ₹42-₹210 per month contribution", "Government co-contribution for eligible", "Spouse pension available"],
      benefitsHi: ["निश्चित पेंशन ₹1000-₹5000/माह", "न्यूनतम ₹42-₹210 प्रति माह योगदान", "पात्र के लिए सरकारी सह-योगदान", "जीवनसाथी पेंशन उपलब्ध"],
      eligibilityEn: ["Age 18-40 years", "Bank account holder", "Not income tax payer", "Aadhar linked"],
      eligibilityHi: ["आयु 18-40 वर्ष", "बैंक खाता धारक", "आयकर दाता नहीं", "आधार लिंक"],
      docsEn: ["Aadhar Card", "Bank account", "Mobile number"],
      docsHi: ["आधार कार्ड", "बैंक खाता", "मोबाइल नंबर"],
      applyLink: "https://npscra.nsdl.co.in/atal-pension-yojana.php"
    },
    {
      id: 12,
      nameEn: "National Livestock Mission",
      nameHi: "राष्ट्रीय पशुधन मिशन",
      descEn: "Subsidy on cattle, dairy, and poultry farming.",
      descHi: "पशुपालन, डेयरी और मुर्गी पालन पर सब्सिडी।",
      tag: "Loan",
      benefitsEn: ["25-50% subsidy on livestock", "Low interest loans available", "Free training and insurance", "Market linkage support"],
      benefitsHi: ["पशुधन पर 25-50% सब्सिडी", "कम ब्याज ऋण उपलब्ध", "मुफ्त प्रशिक्षण और बीमा", "बाजार संपर्क सहायता"],
      eligibilityEn: ["Farmers and landless laborers", "Self-help groups", "Dairy cooperatives"],
      eligibilityHi: ["किसान और भूमिहीन मजदूर", "स्वयं सहायता समूह", "डेयरी सहकारिताएं"],
      docsEn: ["Aadhar Card", "Bank account", "Land documents (if any)", "Project report"],
      docsHi: ["आधार कार्ड", "बैंक खाता", "भूमि दस्तावेज (यदि कोई हो)", "परियोजना रिपोर्ट"],
      applyLink: "https://dahd.nic.in"
    }
  ];

  // Scheme Detail Page
  if (selectedScheme) {
    const s = selectedScheme;
    const isBookmarked = bookmarkedSchemes.has(s.id);
    return (
      <div className="w-full md:max-w-3xl md:mx-auto space-y-4 pb-6">
        {/* Back Button */}
        <div className="flex items-center justify-between sticky top-0 bg-[var(--bg-main)] py-2 z-10">
          <button 
            onClick={() => setSelectedScheme(null)}
            className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            <ChevronRight className="rotate-180" size={18} />
            {lang === 'en' ? 'Back' : 'वापस'}
          </button>
          {user && (
            <button
              onClick={(e) => toggleBookmark(s.id, e)}
              className={`p-2 rounded-lg transition-all ${isBookmarked ? 'bg-amber-500 text-white' : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-amber-500'}`}
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white p-4 rounded-xl shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">{s.tag}</span>
          <h2 className="text-lg md:text-xl font-bold mt-2">{lang === 'en' ? s.nameEn : s.nameHi}</h2>
          <p className="opacity-90 mt-1 text-sm">{lang === 'en' ? s.descEn : s.descHi}</p>
        </div>

        {/* Benefits */}
        <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)]">
          <h3 className="font-bold text-sm text-[var(--primary)] mb-2 flex items-center gap-2">
            <Sparkles size={16} />
            {lang === 'en' ? 'Benefits' : 'लाभ'}
          </h3>
          <ul className="space-y-1.5">
            {(lang === 'en' ? s.benefitsEn : s.benefitsHi).map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-main)]">
                <span className="text-[var(--success)] mt-0.5">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Eligibility */}
        <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)]">
          <h3 className="font-bold text-sm text-[var(--secondary)] mb-2 flex items-center gap-2">
            <User size={16} />
            {lang === 'en' ? 'Who Can Apply' : 'कौन आवेदन कर सकता है'}
          </h3>
          <ul className="space-y-1.5">
            {(lang === 'en' ? s.eligibilityEn : s.eligibilityHi).map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                <span className="text-[var(--primary)]">•</span>
                {e}
              </li>
            ))}
          </ul>
        </div>

        {/* Documents Required */}
        <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)]">
          <h3 className="font-bold text-sm text-[var(--accent)] mb-2 flex items-center gap-2">
            <BookOpen size={16} />
            {lang === 'en' ? 'Documents Required' : 'आवश्यक दस्तावेज'}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {(lang === 'en' ? s.docsEn : s.docsHi).map((d, i) => (
              <span key={i} className="bg-[var(--bg-input)] px-2.5 py-1 rounded-lg text-xs text-[var(--text-main)] border border-[var(--border)]">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <a 
          href={s.applyLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white text-center font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-lg"
        >
          {lang === 'en' ? 'Apply Now →' : 'अभी आवेदन करें →'}
        </a>
      </div>
    );
  }

  // Filter schemes based on bookmarks toggle
  const displaySchemes = showBookmarked 
    ? schemes.filter(s => bookmarkedSchemes.has(s.id))
    : schemes;

  return (
    <div className="w-full md:max-w-3xl md:mx-auto space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white p-4 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg md:text-xl font-bold">{t('nav_yojana')}</h2>
            <p className="opacity-90 text-xs md:text-sm">{t('gov_support')}</p>
          </div>
          <ShieldCheck size={36} className="opacity-30" />
        </div>
      </div>

      {/* Bookmarks Filter */}
      {user && bookmarkedSchemes.size > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setShowBookmarked(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!showBookmarked ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]'}`}
          >
            {lang === 'en' ? 'All Schemes' : 'सभी योजनाएं'}
          </button>
          <button
            onClick={() => setShowBookmarked(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${showBookmarked ? 'bg-amber-500 text-white' : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]'}`}
          >
            <Bookmark size={12} />
            {lang === 'en' ? 'Saved' : 'सहेजा'} ({bookmarkedSchemes.size})
          </button>
        </div>
      )}

      <div className="grid gap-3">
        {displaySchemes.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
            <Bookmark size={28} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">{lang === 'en' ? 'No saved schemes yet' : 'अभी तक कोई योजना सहेजी नहीं गई'}</p>
          </div>
        ) : displaySchemes.map(s => {
          const style = schemeStyles[s.id] || schemeStyles[1];
          const SchemeIcon = style.icon;
          const tagColor = tagColors[s.tag] || 'bg-gray-500/20 text-gray-500';
          const isBookmarked = bookmarkedSchemes.has(s.id);
          
          return (
            <div 
              key={s.id} 
              onClick={() => setSelectedScheme(s)}
              className="bg-[var(--bg-card)] p-3 md:p-4 rounded-xl border border-[var(--border)] shadow-sm hover:border-[var(--primary)] hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex gap-3 items-start">
                {/* Icon */}
                <div className={`p-2.5 md:p-3 rounded-xl ${style.bgColor} ${style.color} shrink-0 group-hover:scale-105 transition-transform`}>
                  <SchemeIcon size={20} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tagColor}`}>{s.tag}</span>
                    {isBookmarked && <Bookmark size={12} className="text-amber-500" fill="currentColor" />}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-[var(--text-main)] mb-0.5 group-hover:text-[var(--primary)] transition-colors line-clamp-1">{lang === 'en' ? s.nameEn : s.nameHi}</h3>
                  <p className="text-[var(--text-muted)] text-xs line-clamp-2">{lang === 'en' ? s.descEn : s.descHi}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: TRANSLATOR (with Voice Input & TTS)
 * ==========================================================================================
 */
function TranslatorView({ lang, user, db, appId }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load translation history from Firebase
  useEffect(() => {
    if (!user || !db) return;
    
    const loadHistory = async () => {
      try {
        const historyRef = collection(db, 'artifacts', appId, 'users', user.uid, 'translations');
        const q = query(historyRef, orderBy('createdAt', 'desc'), limit(20));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
        setHistory(items);
      } catch (err) {
        console.error('Error loading translation history:', err);
      }
    };
    
    loadHistory();
  }, [user, db, appId]);

  // Save translation to history
  const saveToHistory = async (input, output, from, to) => {
    if (!user || !db || !input || !output) return;
    
    try {
      const historyRef = collection(db, 'artifacts', appId, 'users', user.uid, 'translations');
      const newItem = {
        inputText: input.slice(0, 200),
        outputText: output.slice(0, 200),
        fromLang: from,
        toLang: to,
        createdAt: serverTimestamp()
      };
      await addDoc(historyRef, newItem);
      setHistory(prev => [{ ...newItem, id: Date.now().toString() }, ...prev.slice(0, 19)]);
    } catch (err) {
      console.error('Error saving translation:', err);
    }
  };

  const languages = [
    { code: 'en', name: lang === 'en' ? 'English' : 'अंग्रेज़ी', voice: 'en-US' },
    { code: 'hi', name: lang === 'en' ? 'Hindi' : 'हिंदी', voice: 'hi-IN' },
    { code: 'mr', name: lang === 'en' ? 'Marathi' : 'मराठी', voice: 'mr-IN' },
    { code: 'gu', name: lang === 'en' ? 'Gujarati' : 'गुजराती', voice: 'gu-IN' },
    { code: 'pa', name: lang === 'en' ? 'Punjabi' : 'पंजाबी', voice: 'pa-IN' },
    { code: 'bn', name: lang === 'en' ? 'Bengali' : 'बंगाली', voice: 'bn-IN' },
    { code: 'ta', name: lang === 'en' ? 'Tamil' : 'तमिल', voice: 'ta-IN' },
    { code: 'te', name: lang === 'en' ? 'Telugu' : 'तेलुगू', voice: 'te-IN' },
  ];

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  // Voice Input (Speech-to-Text)
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(lang === 'en' ? 'Voice input not supported. Try Chrome/Edge.' : 'वॉयस इनपुट सपोर्ट नहीं है। Chrome/Edge ट्राई करें।');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    const selectedLang = languages.find(l => l.code === fromLang);
    recognition.lang = selectedLang?.voice || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Text-to-Speech
  const speakText = (text, langCode) => {
    if (!('speechSynthesis' in window)) {
      alert(lang === 'en' ? 'Text-to-speech not supported.' : 'टेक्स्ट-टू-स्पीच सपोर्ट नहीं है।');
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedLang = languages.find(l => l.code === langCode);
    utterance.lang = selectedLang?.voice || 'en-US';
    utterance.rate = 0.9;
    
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Offline dictionary for common terms
  const offlineDictionary = {
    'en_hi': {
      'farmer': 'किसान', 'crop': 'फसल', 'soil': 'मिट्टी', 'water': 'पानी', 'seed': 'बीज',
      'loan': 'ऋण', 'money': 'पैसा', 'bank': 'बैंक', 'insurance': 'बीमा', 'weather': 'मौसम',
      'rain': 'बारिश', 'harvest': 'फसल कटाई', 'tractor': 'ट्रैक्टर', 'fertilizer': 'खाद',
      'market': 'बाजार', 'price': 'कीमत', 'government': 'सरकार', 'scheme': 'योजना',
      'help': 'मदद', 'hello': 'नमस्ते', 'thank you': 'धन्यवाद', 'yes': 'हाँ', 'no': 'नहीं',
      'today': 'आज', 'tomorrow': 'कल', 'how much': 'कितना', 'where': 'कहाँ', 'when': 'कब'
    },
    'hi_en': {
      'किसान': 'farmer', 'फसल': 'crop', 'मिट्टी': 'soil', 'पानी': 'water', 'बीज': 'seed',
      'ऋण': 'loan', 'पैसा': 'money', 'बैंक': 'bank', 'बीमा': 'insurance', 'मौसम': 'weather',
      'बारिश': 'rain', 'खाद': 'fertilizer', 'बाजार': 'market', 'कीमत': 'price',
      'सरकार': 'government', 'योजना': 'scheme', 'मदद': 'help', 'नमस्ते': 'hello',
      'धन्यवाद': 'thank you', 'हाँ': 'yes', 'नहीं': 'no', 'आज': 'today', 'कल': 'tomorrow'
    }
  };

  const offlineFallback = (text) => {
    const dictKey = `${fromLang}_${toLang}`;
    const dict = offlineDictionary[dictKey] || {};
    
    // Try exact match
    const lowerText = text.toLowerCase().trim();
    if (dict[lowerText]) {
      return { text: dict[lowerText], offline: true };
    }
    
    // Try word-by-word replacement
    let result = text;
    let translated = false;
    Object.keys(dict).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      if (result.match(regex)) {
        result = result.replace(regex, dict[key]);
        translated = true;
      }
    });
    
    if (translated) {
      return { text: result + ' (Offline)', offline: true };
    }
    
    return { 
      text: lang === 'en' 
        ? 'Translation unavailable offline. Connect to internet.' 
        : 'अनुवाद ऑफ़लाइन उपलब्ध नहीं। इंटरनेट से कनेक्ट करें।',
      offline: true,
      failed: true
    };
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    
    try {
      // Try to use translation API (will work on production Vercel/Netlify)
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          from: fromLang === 'auto' ? 'auto' : fromLang,
          to: toLang
        })
      });
      
      // If API is available (production), use it
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.translatedText) {
          setOutputText(data.translatedText);
          saveToHistory(inputText, data.translatedText, fromLang, toLang);
          setLoading(false);
          return;
        }
      }
      
      // API not available or failed, use offline translation
      throw new Error('Using offline translation');
      
    } catch (e) {
      // Silently use offline translation (common in dev mode)
      const fallback = offlineFallback(inputText);
      setOutputText(fallback.text);
    }
    
    setLoading(false);
  };

  return (
    <div className="w-full md:max-w-4xl md:mx-auto space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
          <ArrowLeftRight className="text-[var(--primary)]" />
          {lang === 'en' ? 'Voice Translator' : 'वॉयस अनुवादक'}
        </h2>
        <p className="text-[var(--text-muted)]">{lang === 'en' ? 'Speak or type to translate between Indian languages' : 'भारतीय भाषाओं में अनुवाद के लिए बोलें या टाइप करें'}</p>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
        {/* Language Selectors */}
        <div className="flex items-center justify-between gap-2 md:gap-4 mb-6">
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] font-medium text-sm md:text-base"
          >
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          
          <button 
            onClick={swapLanguages}
            className="p-3 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 transition-opacity shrink-0"
          >
            <ArrowLeftRight size={20} />
          </button>
          
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] font-medium text-sm md:text-base"
          >
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        {/* Input/Output */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Input Area */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'en' ? 'Enter text or tap mic to speak...' : 'टेक्स्ट दर्ज करें या माइक टैप करें...'}
              className="w-full h-44 p-4 pb-14 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <button
                onClick={startVoiceInput}
                disabled={isListening}
                className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--bg-glass)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'}`}
              >
                <Mic size={20} />
              </button>
              {inputText && (
                <button
                  onClick={() => speakText(inputText, fromLang)}
                  disabled={isSpeaking}
                  className="p-3 rounded-full bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--primary)]"
                >
                  <Volume2 size={20} />
                </button>
              )}
            </div>
            {isListening && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <div className="text-white text-center">
                  <Mic size={40} className="mx-auto mb-2 animate-pulse" />
                  <p>{lang === 'en' ? 'Listening...' : 'सुन रहा हूं...'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Output Area */}
          <div className="relative">
            <div className="w-full h-44 p-4 pb-14 rounded-xl bg-[var(--bg-glass)] border border-[var(--border)] text-[var(--text-main)] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="animate-spin text-[var(--primary)]" size={28} />
                </div>
              ) : (
                outputText || <span className="text-[var(--text-muted)]">{lang === 'en' ? 'Translation will appear here' : 'अनुवाद यहां दिखाई देगा'}</span>
              )}
            </div>
            {outputText && !loading && (
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => speakText(outputText, toLang)}
                  disabled={isSpeaking}
                  className={`p-3 rounded-full transition-all ${isSpeaking ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-card)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'}`}
                >
                  <Volume2 size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className="mt-4 w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : <ArrowLeftRight size={18} />}
          {lang === 'en' ? 'Translate' : 'अनुवाद करें'}
        </button>

        {/* Quick Tips */}
        <div className="mt-4 p-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
            <Mic size={14} className="text-[var(--primary)]" />
            {lang === 'en' ? 'Tip: Tap the mic button to speak in your language' : 'टिप: अपनी भाषा में बोलने के लिए माइक बटन टैप करें'}
          </p>
        </div>
      </div>

      {/* History Section - Now Below Translator */}
      {user && history.length > 0 && (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-4 shadow-[var(--shadow-card)]">
          <h3 className="font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
            <History size={18} className="text-[var(--primary)]" />
            {lang === 'en' ? 'Recent Translations' : 'हाल के अनुवाद'}
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.slice(0, 15).map((item, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setInputText(item.inputText);
                  setOutputText(item.outputText);
                  setFromLang(item.fromLang);
                  setToLang(item.toLang);
                }}
                className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border)] cursor-pointer hover:border-[var(--primary)] transition-colors group"
              >
                <div className="text-xs text-[var(--text-muted)] mb-1 flex items-center justify-between">
                  <span>{languages.find(l => l.code === item.fromLang)?.name} → {languages.find(l => l.code === item.toLang)?.name}</span>
                  <span className="text-[10px]">{item.createdAt?.toDate?.()?.toLocaleDateString() || ''}</span>
                </div>
                <p className="text-sm text-[var(--text-main)] line-clamp-1">{item.inputText}</p>
                <p className="text-sm text-[var(--primary)] line-clamp-1">{item.outputText}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: BLOG (with Firebase integration, upvote/downvote, save)
 * ==========================================================================================
 */
function CommunityView({ lang, user, db, appId, profile }) {
  const [votes, setVotes] = useState({});
  const [saved, setSaved] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  
  // User Posts State
  const [userPosts, setUserPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' or 'community'
  const [articleFilter, setArticleFilter] = useState('all'); // 'all', 'loans', 'security', 'savings', 'schemes'

  // Load user posts from Firebase
  useEffect(() => {
    if (!db) return;
    
    const q = query(
      collection(db, 'artifacts', appId, 'community_posts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = [];
      snapshot.forEach(doc => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      setUserPosts(posts);
    }, (error) => {
      console.error('Error loading posts:', error);
    });
    
    return () => unsubscribe();
  }, [db, appId]);
  
  // Load comments for selected post
  useEffect(() => {
    if (!selectedPostId || !db) return;
    
    const loadComments = async () => {
      setLoadingComments(true);
      try {
        const commentsRef = collection(db, 'artifacts', appId, 'blog', String(selectedPostId), 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        const postComments = [];
        snapshot.forEach(doc => postComments.push({ id: doc.id, ...doc.data() }));
        setComments(prev => ({ ...prev, [selectedPostId]: postComments }));
      } catch (err) {
        console.error('Error loading comments:', err);
      }
      setLoadingComments(false);
    };
    
    loadComments();
  }, [selectedPostId, db, appId]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!user || !newComment.trim() || !selectedPostId) return;
    
    const comment = {
      text: newComment.trim(),
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userAvatar: user.photoURL || null,
      createdAt: serverTimestamp()
    };
    
    try {
      const commentsRef = collection(db, 'artifacts', appId, 'blog', String(selectedPostId), 'comments');
      const docRef = await addDoc(commentsRef, comment);
      
      // Add to local state immediately
      setComments(prev => ({
        ...prev,
        [selectedPostId]: [
          { id: docRef.id, ...comment, createdAt: new Date() },
          ...(prev[selectedPostId] || [])
        ]
      }));
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    if (!user || !selectedPostId) return;
    
    try {
      const commentRef = doc(db, 'artifacts', appId, 'blog', String(selectedPostId), 'comments', commentId);
      await deleteDoc(commentRef);
      
      setComments(prev => ({
        ...prev,
        [selectedPostId]: (prev[selectedPostId] || []).filter(c => c.id !== commentId)
      }));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  // Load user's votes and saves from Firebase on mount
  useEffect(() => {
    if (!user || !db) return;
    
    const loadUserInteractions = async () => {
      try {
        // Load saved posts
        const savedSnap = await getDocs(collection(db, 'artifacts', appId, 'users', user.uid, 'saved_posts'));
        const savedMap = {};
        savedSnap.forEach(doc => { savedMap[doc.id] = true; });
        setSaved(savedMap);

        // Load user's votes
        const votesSnap = await getDocs(collection(db, 'artifacts', appId, 'users', user.uid, 'votes'));
        const votesMap = {};
        votesSnap.forEach(doc => { votesMap[doc.id] = doc.data().direction; });
        setVotes(votesMap);
      } catch (err) {
        console.error('Error loading interactions:', err);
      }
    };
    
    loadUserInteractions();
  }, [user, db, appId]);

  // Load like counts for all posts
  useEffect(() => {
    if (!db) return;
    
    const loadLikeCounts = async () => {
      const counts = {};
      for (let i = 1; i <= 8; i++) {
        try {
          const likesSnap = await getDocs(collection(db, 'artifacts', appId, 'blog', String(i), 'likes'));
          counts[i] = likesSnap.size;
        } catch {
          counts[i] = 0;
        }
      }
      setLikeCounts(counts);
    };
    
    loadLikeCounts();
  }, [db, appId]);

  const authors = [
    { name: 'Ananay', avatar: 'A', color: 'bg-blue-500' },
    { name: 'Aryan', avatar: 'A', color: 'bg-green-500' },
    { name: 'Rehaan', avatar: 'R', color: 'bg-purple-500' },
    { name: 'Kanishk', avatar: 'K', color: 'bg-orange-500' },
    { name: 'Siddharth', avatar: 'S', color: 'bg-red-500' },
  ];

  const blogPosts = [
    {
      id: 1,
      author: authors[0],
      date: '23 Dec 2025',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
      title: lang === 'en' ? 'Understanding KCC: Your Gateway to Affordable Farm Loans' : 'KCC को समझें: सस्ते कृषि ऋण का द्वार',
      content: lang === 'en' 
        ? `The Kisan Credit Card (KCC) scheme, launched in 1998 by the Government of India, is one of the most revolutionary initiatives designed specifically to help farmers access affordable credit for their agricultural needs. Unlike traditional bank loans that can take weeks to process and charge interest rates of 12-15% or higher, KCC provides farmers with quick access to loans at just 7% annual interest. What makes this even more attractive is the additional 3% interest subvention provided by the government for timely repayment, effectively bringing the interest rate down to just 4% per annum.

The scheme covers a wide range of agricultural expenses including purchase of seeds, fertilizers, pesticides, and other inputs. It also provides working capital for crop production, post-harvest expenses, and even marketing of produce. According to the Reserve Bank of India's 2023 report, over 7.5 crore farmers across India have benefited from KCC, with total credit disbursement exceeding ₹8 lakh crore.

Key Benefits of KCC:
• Interest rate as low as 4% with timely repayment subsidy
• Credit limit based on land holding and crop pattern
• Flexibility to withdraw any amount up to the credit limit
• Personal accident insurance cover of ₹50,000 to ₹1 lakh
• No processing fees for loans up to ₹3 lakh
• Validity of 5 years with annual review

To apply for a KCC, visit your nearest bank branch (nationalized, cooperative, or regional rural bank) with your land ownership documents, Aadhaar card, PAN card, and two passport-sized photographs. The bank will assess your eligibility based on the Scale of Finance fixed by the District Level Technical Committee and sanction an appropriate credit limit. The entire process typically takes 2-3 weeks.

Reference: Reserve Bank of India - Priority Sector Lending Guidelines (2023), Ministry of Agriculture & Farmers Welfare - KCC Scheme Guidelines`
        : `किसान क्रेडिट कार्ड (KCC) योजना 1998 में भारत सरकार द्वारा शुरू की गई एक क्रांतिकारी पहल है। यह किसानों को सिर्फ 7% ब्याज दर पर ऋण प्रदान करती है। समय पर चुकाने पर 3% अतिरिक्त सब्सिडी मिलती है, यानी प्रभावी दर सिर्फ 4%!

मुख्य लाभ:
• समय पर भुगतान पर 4% की कम ब्याज दर
• भूमि और फसल के आधार पर क्रेडिट सीमा
• ₹50,000 से ₹1 लाख का दुर्घटना बीमा कवर
• ₹3 लाख तक के ऋण पर कोई प्रोसेसिंग शुल्क नहीं

आवेदन के लिए अपने नजदीकी बैंक में भूमि दस्तावेज, आधार कार्ड और पासपोर्ट फोटो लेकर जाएं।`,
      category: { en: 'Loans & Credit', hi: 'ऋण और क्रेडिट' },
      categoryColor: 'bg-blue-100 text-blue-700',
      initialVotes: 247
    },
    {
      id: 2,
      author: authors[1],
      date: '22 Dec 2025',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
      title: lang === 'en' ? 'STOP! How to Identify OTP & KYC Scams' : 'रुकें! OTP और KYC धोखाधड़ी कैसे पहचानें',
      content: lang === 'en'
        ? `Financial fraud targeting rural areas has increased by over 300% in the last three years, according to the Cyber Crime Prevention Wing. Scammers have become increasingly sophisticated, using official-sounding language, fake caller IDs showing bank numbers, and creating artificial urgency to trick unsuspecting farmers into sharing sensitive information. Understanding how these scams work is your first line of defense.

The most common scam involves a caller pretending to be from your bank, claiming that your KYC (Know Your Customer) documents are expiring and your account will be frozen. They'll ask you to share your OTP (One Time Password) or download a screen-sharing app like AnyDesk or TeamViewer. Once they have access, they can drain your entire bank account within minutes. Remember: No legitimate bank employee will EVER ask for your OTP, PIN, or password over the phone.

Warning Signs of a Scam Call:
• Caller creates urgency ("Your account will be blocked in 2 hours!")
• Asks for OTP, PIN, CVV, or full card number
• Requests you to download any app or click any link
• Offers too-good-to-be-true prizes or lottery winnings
• Claims to be from "RBI" or "Government" asking for advance fees
• Uses threatening language about legal action

If you receive such a call, immediately hang up and NEVER share any information. Report to the National Cyber Crime Helpline at 1930 or file a complaint at cybercrime.gov.in. Block the number and inform your family members as scammers often target multiple people in the same village. If you've already shared information, contact your bank immediately to block your account and cards.

Statistics from the Indian Cyber Crime Coordination Centre show that in 2023, rural areas reported losses of over ₹1,200 crore to such scams. The average victim loses ₹47,000 - often their entire savings. Don't become a statistic. When in doubt, visit your bank branch in person.

Reference: Indian Cyber Crime Coordination Centre Annual Report 2023, RBI Guidelines on Customer Protection`
        : `पिछले तीन वर्षों में ग्रामीण क्षेत्रों में वित्तीय धोखाधड़ी 300% से अधिक बढ़ी है। ठग बैंक कर्मचारी बनकर कॉल करते हैं और KYC अपडेट के नाम पर OTP मांगते हैं।

धोखाधड़ी के संकेत:
• कॉलर जल्दबाजी करता है
• OTP, PIN या पासवर्ड मांगता है
• कोई ऐप डाउनलोड करने को कहता है
• बड़ी राशि का इनाम या लॉटरी का झांसा देता है

अगर ऐसी कॉल आए तो तुरंत काट दें। 1930 पर रिपोर्ट करें या cybercrime.gov.in पर शिकायत दर्ज करें।`,
      category: { en: 'Security', hi: 'सुरक्षा' },
      categoryColor: 'bg-red-100 text-red-700',
      initialVotes: 189
    },
    {
      id: 3,
      author: authors[2],
      date: '21 Dec 2025',
      readTime: '9 min',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
      title: lang === 'en' ? 'The 20% Rule: Smart Saving After Harvest' : '20% नियम: फसल के बाद स्मार्ट बचत',
      content: lang === 'en'
        ? `The harvest season brings relief and joy to farming households, but it also brings a critical financial decision that can determine the family's security for the entire year. Research by the National Bank for Agriculture and Rural Development (NABARD) shows that over 73% of farmer households have zero savings, making them extremely vulnerable to any unexpected expense or crop failure. The 20% rule is a simple yet powerful habit that can transform your financial future.

The concept is straightforward: before spending a single rupee from your harvest income, set aside exactly 20% into a separate savings account. This should be done on the same day you receive payment at the mandi. Open a Basic Savings Bank Deposit (BSBD) account - these are zero-balance accounts that every bank must offer. Set up an automatic transfer if possible, so you never have to make the conscious decision to save.

Why 20% Works:
• It's a significant amount that actually builds wealth over time
• It's small enough that you can still manage regular expenses
• At typical mandi prices, 20% of 2-3 harvests can build ₹50,000+ emergency fund
• This fund can prevent distress borrowing at 36%+ interest rates
• It provides a cushion for unexpected medical expenses or crop failure

Building this habit takes discipline. The first season will be the hardest - you'll think of many "necessary" expenses that the 20% could cover. Resist the temptation. Think of this money as already spent - it doesn't exist for daily needs. Within 2-3 years, you'll have enough saved to handle most emergencies without borrowing, make investments in better equipment or seeds, and even start planning for your children's education.

Consider using the Post Office Recurring Deposit (RD) scheme which offers 6.5% interest and allows monthly deposits starting from just ₹100. The discipline of monthly deposits is often easier than one-time large savings.

Reference: NABARD All India Rural Financial Inclusion Survey 2023, India Post Savings Schemes Guidelines`
        : `फसल का मौसम खुशी लाता है, लेकिन NABARD के अनुसार 73% किसान परिवारों के पास कोई बचत नहीं है। 20% नियम इस स्थिति को बदल सकता है।

20% क्यों काम करता है:
• यह समय के साथ वास्तविक धन बनाता है
• 2-3 फसलों में ₹50,000+ का आपातकालीन कोष बन सकता है
• 36%+ ब्याज पर उधार लेने से बचाता है
• अप्रत्याशित खर्चों से सुरक्षा प्रदान करता है

डाकघर की आवर्ती जमा (RD) योजना में निवेश करें जो 6.5% ब्याज देती है।`,
      category: { en: 'Savings', hi: 'बचत' },
      categoryColor: 'bg-green-100 text-green-700',
      initialVotes: 312
    },
    {
      id: 4,
      author: authors[3],
      date: '20 Dec 2025',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
      title: lang === 'en' ? 'PM Fasal Bima: Protect Your Crops for Just 2%' : 'PM फसल बीमा: सिर्फ 2% में फसल सुरक्षा',
      content: lang === 'en'
        ? `Agriculture in India is inherently risky, with farmers facing threats from unpredictable weather, pest attacks, and natural disasters. The Pradhan Mantri Fasal Bima Yojana (PMFBY), launched in 2016, is the world's largest crop insurance scheme and provides comprehensive protection to farmers at highly subsidized premium rates. In 2023 alone, over 5.5 crore farmer applications were enrolled, covering more than 1,100 lakh hectares of farmland.

The premium structure is remarkably farmer-friendly. For Kharif crops (like paddy, cotton, bajra), the farmer pays just 2% of the sum insured. For Rabi crops (like wheat, mustard, chickpea), it's only 1.5%. For annual commercial and horticultural crops, the premium is 5%. The remaining premium - which can be as high as 15-20% of the sum insured - is shared equally between the Central and State governments. This means a farmer insuring a wheat crop worth ₹50,000 pays just ₹750 as premium.

What PMFBY Covers:
• Prevented sowing/planting risk due to deficit rainfall or adverse conditions
• Standing crop losses from non-preventable risks (drought, flood, hail, cyclone)
• Post-harvest losses up to 14 days from cutting
• Localized calamities like hailstorm, landslide, inundation
• Wild animal attacks (in some states)

The claim settlement process has been significantly improved with mandatory use of technology. Crop Cutting Experiments (CCEs) are now conducted using smartphones with geo-tagged photos, and satellite imagery is used to assess large-scale damage. Claims are directly credited to the farmer's bank account linked with Aadhaar.

To enroll, visit your bank, Primary Agricultural Credit Society (PACS), Common Service Centre (CSC), or use the official Crop Insurance Portal (pmfby.gov.in) or app before the cutoff dates - typically 2 weeks before sowing begins.

Reference: PMFBY Official Portal Statistics 2023, Ministry of Agriculture Annual Report 2022-23`
        : `प्रधानमंत्री फसल बीमा योजना (PMFBY) दुनिया की सबसे बड़ी फसल बीमा योजना है। 2023 में 5.5 करोड़ से अधिक किसान इसमें शामिल हुए।

प्रीमियम संरचना:
• खरीफ फसलों के लिए: बीमित राशि का सिर्फ 2%
• रबी फसलों के लिए: सिर्फ 1.5%
• वार्षिक वाणिज्यिक फसलों के लिए: 5%

क्या-क्या कवर होता है:
• सूखा, बाढ़, ओलावृष्टि से नुकसान
• कटाई के बाद 14 दिनों तक का नुकसान
• स्थानीय आपदाएं जैसे भूस्खलन

नामांकन के लिए बैंक, PACS या pmfby.gov.in पर जाएं।`,
      category: { en: 'Insurance', hi: 'बीमा' },
      categoryColor: 'bg-purple-100 text-purple-700',
      initialVotes: 198
    },
    {
      id: 5,
      author: authors[4],
      date: '19 Dec 2025',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
      title: lang === 'en' ? 'Soil Health Card: Boost Yield by 20% Free!' : 'मृदा स्वास्थ्य कार्ड: 20% अधिक उपज, मुफ्त!',
      content: lang === 'en'
        ? `India's agricultural productivity is significantly lower than global averages, and one of the primary reasons is the unscientific use of fertilizers. Most farmers apply fertilizers based on tradition or guesswork rather than actual soil requirements. This leads to nutrient imbalances, soil degradation, increased costs, and ultimately lower yields. The Soil Health Card (SHC) scheme, launched in 2015, addresses this problem by providing every farmer with a detailed analysis of their soil's nutrient status and customized fertilizer recommendations.

The Soil Health Card is issued once every three years and contains detailed information about 12 parameters: pH, electrical conductivity, organic carbon, and primary nutrients (nitrogen, phosphorus, potassium), secondary nutrients (sulphur), and micronutrients (zinc, iron, copper, manganese, boron). Based on these tests, the card provides crop-specific fertilizer recommendations - telling you exactly how much urea, DAP, or micronutrient mix to apply for each crop you plan to grow.

Benefits Reported by Farmers:
• 15-25% increase in yield through balanced fertilization
• 10-15% reduction in fertilizer costs
• Improved soil health and sustainability
• Better understanding of soil conditions
• Reduced environmental impact from over-fertilization

To get your Soil Health Card, collect a soil sample from your field following these steps: Take samples from 5-6 spots across the field, from a depth of 0-15 cm. Remove any debris or roots. Mix all samples thoroughly and take about 500 grams in a clean cloth or plastic bag. Label it with your name, village, and Khasra number. Submit it to your nearest Krishi Vigyan Kendra (KVK), agricultural office, or registered testing laboratory. The test is completely FREE under the government scheme.

Once you receive your card, discuss the recommendations with the agricultural extension officer at KVK. They can help you understand the results and create a customized fertilization plan for your specific crops and field conditions.

Reference: Soil Health Card Portal (soilhealth.dac.gov.in), Indian Council of Agricultural Research Studies`
        : `भारत की कृषि उत्पादकता वैश्विक औसत से काफी कम है, इसका मुख्य कारण उर्वरकों का अवैज्ञानिक उपयोग है। मृदा स्वास्थ्य कार्ड इस समस्या का समाधान करता है।

SHC में 12 मापदंडों की जानकारी होती है: pH, जैविक कार्बन, नाइट्रोजन, फास्फोरस, पोटाश, सल्फर, जिंक आदि।

किसानों द्वारा रिपोर्ट किए गए लाभ:
• 15-25% उपज में वृद्धि
• 10-15% उर्वरक लागत में कमी
• मिट्टी का स्वास्थ्य बेहतर

नमूना लेने के लिए खेत के 5-6 स्थानों से मिट्टी एकत्र करें और नजदीकी KVK में जमा करें। जांच पूरी तरह मुफ्त है।`,
      category: { en: 'Farming', hi: 'खेती' },
      categoryColor: 'bg-amber-100 text-amber-700',
      initialVotes: 276
    },
    {
      id: 6,
      author: authors[0],
      date: '18 Dec 2025',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      title: lang === 'en' ? 'UPI for Farmers: Send Money Without Fees' : 'किसानों के लिए UPI: बिना शुल्क पैसे भेजें',
      content: lang === 'en'
        ? `The Unified Payments Interface (UPI) has revolutionized digital payments in India, and farmers stand to benefit enormously from this technology. Before UPI, sending money to family members, paying suppliers, or receiving mandi payments involved expensive money transfer agents who charged ₹50-100 per transaction, or time-consuming bank visits. UPI eliminates all these costs and inconveniences - transactions are instant, free, and can be done 24/7 from your mobile phone.

UPI works by linking your bank account to a simple identifier called UPI ID (like yourname@upi). Once set up, you can send money to anyone using their phone number, UPI ID, or by scanning a QR code. Major apps like BHIM (developed by NPCI), Google Pay, PhonePe, and Paytm all support UPI. For farmers who may not be comfortable with English interfaces, BHIM is available in 13 Indian languages including Hindi, Punjabi, Gujarati, Marathi, Tamil, Telugu, and more.

Getting Started with UPI:
• Download BHIM app from Google Play Store or App Store
• Select your preferred language during setup
• Link your Aadhaar-registered mobile number (same as registered with bank)
• Select your bank and verify with ATM debit card or OTP
• Create a 6-digit UPI PIN (like an ATM PIN but for UPI)
• Your UPI ID will be automatically created

Many mandis now accept UPI payments, meaning you can receive your crop sale amount directly to your bank account without carrying cash. The PM-KISAN payments of ₹6,000 per year can also be received in accounts linked to UPI. With UPI, you can also pay for seeds, fertilizers, equipment, and other inputs directly to verified sellers without cash.

Security Tips:
• Never share your UPI PIN with anyone
• Only scan QR codes from trusted sources
• Check the receiver's name before confirming payment
• Set transaction limits in your UPI app settings

Reference: NPCI UPI Transaction Statistics 2023, RBI Digital Payments Guidelines`
        : `UPI ने भारत में डिजिटल भुगतान को बदल दिया है। पहले ₹50-100 ट्रांसफर एजेंट को देने पड़ते थे, अब UPI से मुफ्त और तुरंत पैसे भेजें।

UPI शुरू करने के चरण:
• BHIM ऐप डाउनलोड करें
• अपनी पसंद की भाषा चुनें
• बैंक से जुड़ा मोबाइल नंबर दर्ज करें
• बैंक चुनें और ATM कार्ड या OTP से वेरिफाई करें
• 6 अंकों का UPI PIN बनाएं

सुरक्षा सुझाव:
• UPI PIN किसी को न बताएं
• भुगतान से पहले प्राप्तकर्ता का नाम जांचें`,
      category: { en: 'Digital Banking', hi: 'डिजिटल बैंकिंग' },
      categoryColor: 'bg-cyan-100 text-cyan-700',
      initialVotes: 345
    },
    {
      id: 7,
      author: authors[2],
      date: '17 Dec 2025',
      readTime: '10 min',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
      title: lang === 'en' ? 'Women SHGs: Build Wealth Together' : 'महिला स्वयं सहायता समूह: मिलकर धन बनाएं',
      content: lang === 'en'
        ? `Self-Help Groups (SHGs) have emerged as one of the most powerful tools for women's financial inclusion and empowerment in rural India. The model is simple yet revolutionary: a group of 10-20 women from similar economic backgrounds come together, save small amounts regularly, and use the pooled funds to provide loans to members. Over time, these groups develop creditworthiness and can access larger bank loans at highly subsidized rates. Today, there are over 90 lakh SHGs in India, with more than 12 crore women members managing collective savings of over ₹47,000 crore.

The Deendayal Antyodaya Yojana - National Rural Livelihoods Mission (DAY-NRLM) provides extensive support to SHGs. Qualifying groups can access bank loans up to ₹20 lakh at just 4% interest (7% bank rate minus 3% government subsidy). The first loan is typically ₹1-2 lakh, scaling up with good repayment history. Many SHGs have used these funds to start successful micro-enterprises in dairy, poultry, tailoring, food processing, handicrafts, and retail.

How to Start an SHG:
• Gather 10-15 women from similar economic backgrounds in your village
• Agree on a regular meeting schedule (weekly or bi-weekly works best)
• Decide on a monthly contribution amount (₹100-500 per member is common)
• Open a savings account in the group's name at the nearest bank
• Begin maintaining minutes of meetings and financial records
• After 3-6 months of regular savings, apply for SHG registration

Success Stories from the Field:
• Kudumbashree in Kerala: 45 lakh women, ₹4,000 crore annual turnover
• Mahila Arthik Vikas Mahamandal (MAVIM) in Maharashtra: 6 lakh SHGs
• Many SHGs have graduated to Farmer Producer Organizations (FPOs)

Beyond financial benefits, SHGs provide women with confidence, decision-making power, and a support network. Members report improved status in households, greater say in family finances, and reduced domestic violence. The social capital built through these groups is often as valuable as the financial capital.

Reference: DAY-NRLM Annual Report 2022-23, NABARD SHG Bank Linkage Report`
        : `स्वयं सहायता समूह (SHGs) ग्रामीण महिलाओं के वित्तीय सशक्तिकरण का सबसे शक्तिशाली माध्यम है। आज भारत में 90 लाख से अधिक SHG हैं जिनमें 12 करोड़+ महिलाएं हैं।

DAY-NRLM के तहत SHGs को 4% ब्याज पर ₹20 लाख तक का ऋण मिलता है।

SHG कैसे शुरू करें:
• 10-15 समान आर्थिक पृष्ठभूमि वाली महिलाओं को इकट्ठा करें
• साप्ताहिक बैठक का समय तय करें
• मासिक योगदान राशि (₹100-500) तय करें
• नजदीकी बैंक में समूह के नाम खाता खोलें
• 3-6 महीने की नियमित बचत के बाद पंजीकरण के लिए आवेदन करें`,
      category: { en: 'Women Empowerment', hi: 'महिला सशक्तिकरण' },
      categoryColor: 'bg-pink-100 text-pink-700',
      initialVotes: 289
    },
    {
      id: 8,
      author: authors[4],
      date: '16 Dec 2025',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80',
      title: lang === 'en' ? 'MSP: Know Your Crop\'s True Worth' : 'MSP: अपनी फसल की असली कीमत जानें',
      content: lang === 'en'
        ? `Minimum Support Price (MSP) is the guaranteed price at which the government promises to purchase farmers' produce, ensuring that farmers don't suffer losses even when market prices fall. The Commission for Agricultural Costs and Prices (CACP) recommends MSP for 23 crops every year, taking into account cost of production, supply and demand, price trends in domestic and international markets, and a fair margin for farmers. Understanding MSP is crucial because it represents the baseline value of your hard work - no one should buy your produce below this price.

MSP Rates for Major Crops (2024-25 Marketing Season):
• Paddy (Common): ₹2,300 per quintal
• Wheat: ₹2,275 per quintal
• Mustard: ₹5,650 per quintal
• Gram (Chana): ₹5,440 per quintal
• Cotton (Medium Staple): ₹6,620 per quintal
• Maize: ₹2,225 per quintal
• Groundnut: ₹6,377 per quintal
• Soybean: ₹4,892 per quintal

To get MSP for your crops, you must sell at authorized government procurement centers, usually located at Agricultural Produce Market Committee (APMC) mandis. The procurement is done by agencies like Food Corporation of India (FCI), NAFED, Cotton Corporation of India, and state-level agencies. Registration for government procurement typically opens before the harvest season - check with your local mandi or agricultural office.

Important Points to Remember:
• MSP is NOT automatically guaranteed - you must sell to government agencies
• Private traders and mandis may offer below MSP (though it's discouraged)
• Quality specifications (moisture content, foreign matter) must be met
• Payment is made directly to bank accounts within 3-5 days of sale
• Check current MSP rates on the PM-KISAN app or by calling 1800-180-1551

If you find any trader trying to buy below MSP, you can file a complaint with the District Agriculture Officer or on the e-NAM portal. While enforcement varies, knowing your rights puts you in a stronger negotiating position.

Reference: CACP MSP Recommendations 2024-25, Ministry of Consumer Affairs Price Monitoring Division`
        : `न्यूनतम समर्थन मूल्य (MSP) वह गारंटी मूल्य है जिस पर सरकार किसानों की उपज खरीदती है। 23 फसलों के लिए MSP घोषित होता है।

2024-25 के प्रमुख MSP:
• धान: ₹2,300 प्रति क्विंटल
• गेहूं: ₹2,275 प्रति क्विंटल
• सरसों: ₹5,650 प्रति क्विंटल
• चना: ₹5,440 प्रति क्विंटल
• कपास: ₹6,620 प्रति क्विंटल

याद रखें:
• MSP पाने के लिए सरकारी एजेंसियों को बेचना जरूरी है
• गुणवत्ता मानक (नमी, अशुद्धियां) पूरे करने होंगे
• भुगतान 3-5 दिनों में सीधे बैंक खाते में होता है

MSP दरें PM-KISAN ऐप पर देखें या 1800-180-1551 पर कॉल करें।`,
      category: { en: 'Market Prices', hi: 'बाजार भाव' },
      categoryColor: 'bg-indigo-100 text-indigo-700',
      initialVotes: 234
    }
  ];

  const requireAuth = (action) => {
    if (!user) {
      alert(lang === 'en' ? `Please login to ${action} this post.` : `इस पोस्ट को ${action === 'vote' ? 'वोट' : action === 'save' ? 'सेव' : 'शेयर'} करने के लिए लॉगिन करें।`);
      return false;
    }
    return true;
  };

  const handleVote = async (postId, direction) => {
    if (!requireAuth('vote')) return;
    
    const currentVote = votes[postId] || 0;
    const newVote = currentVote === direction ? 0 : direction;
    
    // Optimistic update
    setVotes(prev => ({...prev, [postId]: newVote}));
    
    try {
      // Update user's vote record
      const voteRef = doc(db, 'artifacts', appId, 'users', user.uid, 'votes', String(postId));
      if (newVote === 0) {
        await deleteDoc(voteRef);
      } else {
        await setDoc(voteRef, { direction: newVote, updatedAt: serverTimestamp() });
      }
      
      // Update blog post like (only for likes, direction === 1)
      const likeRef = doc(db, 'artifacts', appId, 'blog', String(postId), 'likes', user.uid);
      if (newVote === 1) {
        await setDoc(likeRef, { userId: user.uid, createdAt: serverTimestamp() });
        setLikeCounts(prev => ({...prev, [postId]: (prev[postId] || 0) + 1}));
      } else if (currentVote === 1) {
        await deleteDoc(likeRef);
        setLikeCounts(prev => ({...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1)}));
      }
    } catch (err) {
      console.error('Error saving vote:', err);
      // Revert on error
      setVotes(prev => ({...prev, [postId]: currentVote}));
    }
  };

  const handleSave = async (postId) => {
    if (!requireAuth('save')) return;
    
    const isSaved = saved[postId];
    
    // Optimistic update
    setSaved(prev => ({...prev, [postId]: !isSaved}));
    
    try {
      const saveRef = doc(db, 'artifacts', appId, 'users', user.uid, 'saved_posts', String(postId));
      if (isSaved) {
        await deleteDoc(saveRef);
      } else {
        await setDoc(saveRef, { postId, savedAt: serverTimestamp() });
      }
    } catch (err) {
      console.error('Error saving post:', err);
      // Revert on error
      setSaved(prev => ({...prev, [postId]: isSaved}));
    }
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) {
      alert(lang === 'en' ? 'Please fill in all fields' : 'कृपया सभी फ़ील्ड भरें');
      return;
    }
    
    setSubmittingPost(true);
    try {
      const postData = {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        category: newPostCategory,
        authorId: user.uid,
        authorName: profile?.name || user.displayName || 'Anonymous',
        authorVillage: profile?.village || 'Unknown',
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0
      };
      
      await addDoc(collection(db, 'artifacts', appId, 'community_posts'), postData);
      
      // Reset form
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('general');
      setShowCreatePost(false);
      
      alert(lang === 'en' ? 'Post shared successfully!' : 'पोस्ट सफलतापूर्वक साझा की गई!');
    } catch (err) {
      console.error('Error creating post:', err);
      alert(lang === 'en' ? 'Failed to create post' : 'पोस्ट बनाने में विफल');
    }
    setSubmittingPost(false);
  };
  
  // Delete user post
  const handleDeletePost = async (postId, authorId) => {
    if (!user || user.uid !== authorId) return;
    
    if (!confirm(lang === 'en' ? 'Delete this post?' : 'इस पोस्ट को हटाएं?')) return;
    
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'community_posts', postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };
  
  // TTS for blog posts
  const speakPost = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-US' : 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full md:max-w-4xl md:mx-auto">
      {/* Compact Header for Mobile */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">
            {lang === 'en' ? 'Community Forum' : 'समुदाय मंच'}
          </h1>
          <p className="text-xs md:text-sm text-[var(--text-muted)]">
            {lang === 'en' ? 'Share experiences, ask questions, learn together' : 'अनुभव साझा करें, सवाल पूछें'}
          </p>
        </div>
        {user && (
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">{lang === 'en' ? 'New Post' : 'नया पोस्ट'}</span>
          </button>
        )}
      </div>
      
      {/* Compact Tabs */}
      {!selectedPostId && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'community'
                ? 'bg-[var(--primary)] text-white shadow-lg'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]'
            }`}
          >
            {lang === 'en' ? `Community Posts (${userPosts.length})` : `समुदाय पोस्ट (${userPosts.length})`}
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'articles'
                ? 'bg-[var(--primary)] text-white shadow-lg'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]'
            }`}
          >
            {lang === 'en' ? 'Articles (8)' : 'लेख (8)'}
          </button>
        </div>
      )}
      
      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 md:p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-[var(--text-main)]">
                {lang === 'en' ? 'Share Your Thoughts' : 'अपने विचार साझा करें'}
              </h3>
              <button onClick={() => setShowCreatePost(false)} className="p-1.5 hover:bg-[var(--bg-input)] rounded-lg">
                <X size={18} className="text-[var(--text-muted)]" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] mb-1.5 block">
                  {lang === 'en' ? 'Title' : 'शीर्षक'}
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder={lang === 'en' ? 'What\'s on your mind?' : 'आपके मन में क्या है?'}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  maxLength={150}
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] mb-1.5 block">
                  {lang === 'en' ? 'Category' : 'श्रेणी'}
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="general">{lang === 'en' ? 'General' : 'सामान्य'}</option>
                  <option value="problem">{lang === 'en' ? 'Problem/Issue' : 'समस्या/मुद्दा'}</option>
                  <option value="advice">{lang === 'en' ? 'Seeking Advice' : 'सलाह चाहिए'}</option>
                  <option value="success">{lang === 'en' ? 'Success Story' : 'सफलता की कहानी'}</option>
                  <option value="question">{lang === 'en' ? 'Question' : 'सवाल'}</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] mb-1.5 block">
                  {lang === 'en' ? 'Your Message' : 'आपका संदेश'}
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={lang === 'en' ? 'Share your experience, question, or issue...' : 'अपना अनुभव, सवाल या समस्या साझा करें...'}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[120px] resize-none"
                  maxLength={2000}
                />
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                  {newPostContent.length}/2000 {lang === 'en' ? 'characters' : 'अक्षर'}
                </p>
              </div>
              
              <button
                onClick={handleCreatePost}
                disabled={submittingPost}
                className="w-full py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submittingPost ? (
                  <><Loader className="animate-spin" size={16} /> {lang === 'en' ? 'Posting...' : 'पोस्ट हो रहा है...'}</>
                ) : (
                  <><Send size={16} /> {lang === 'en' ? 'Share Post' : 'पोस्ट शेयर करें'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {selectedPostId ? (
        // DETAIL VIEW
        <div>
          <button
            onClick={() => setSelectedPostId(null)}
            className="mb-4 flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
          >
            <ChevronDown className="rotate-90" size={18} />
            {lang === 'en' ? 'Back' : 'वापस जाएं'}
          </button>

          {blogPosts.map(post => {
            if (post.id !== selectedPostId) return null;
            return (
              <article key={post.id} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)] p-6">
                {/* Header */}
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${post.categoryColor}`}>
                    {lang === 'en' ? post.category.en : post.category.hi}
                  </span>
                  <h1 className="text-3xl font-bold text-[var(--text-main)] mb-4">{post.title}</h1>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-10 h-10 rounded-full ${post.author.color} flex items-center justify-center text-white font-bold`}>
                      {post.author.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-main)]">{post.author.name}</p>
                      <p className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                      </p>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div className="relative mb-6">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-96 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => speakPost(post.title + '. ' + post.content)}
                      className="absolute top-4 right-4 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      title={lang === 'en' ? 'Listen to article' : 'लेख सुनें'}
                    >
                      <Volume2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Content - Expandable */}
                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                    {post.content.length > 500 ? (
                      <>
                        {post.content.slice(0, 500)}...
                        <button 
                          onClick={() => {
                            const el = document.getElementById(`full-content-${post.id}`);
                            if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
                          }}
                          className="text-[var(--primary)] font-medium ml-2 hover:underline"
                        >
                          {lang === 'en' ? 'Read more' : 'और पढ़ें'}
                        </button>
                        <span id={`full-content-${post.id}`} style={{display: 'none'}}>
                          {post.content.slice(500)}
                        </span>
                      </>
                    ) : post.content}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleVote(post.id, 1)}
                      className={`p-2 rounded-lg transition-colors ${votes[post.id] === 1 ? 'bg-green-100 text-green-600' : 'hover:bg-[var(--bg-glass)] text-[var(--text-muted)]'}`}
                      title={lang === 'en' ? 'Like' : 'पसंद करें'}
                    >
                      <ThumbsUp size={20} />
                    </button>
                    <span className="text-sm font-medium text-[var(--text-main)] min-w-[45px]">
                      {post.initialVotes + (likeCounts[post.id] || 0)}
                    </span>
                    <button 
                      onClick={() => handleVote(post.id, -1)}
                      className={`p-2 rounded-lg transition-colors ${votes[post.id] === -1 ? 'bg-red-100 text-red-600' : 'hover:bg-[var(--bg-glass)] text-[var(--text-muted)]'}`}
                      title={lang === 'en' ? 'Dislike' : 'नापसंद करें'}
                    >
                      <ThumbsDown size={20} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleSave(post.id)}
                      className={`p-2 rounded-lg transition-colors ${saved[post.id] ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'hover:bg-[var(--bg-glass)] text-[var(--text-muted)]'}`}
                      title={lang === 'en' ? 'Save' : 'सेव करें'}
                    >
                      {saved[post.id] ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>

                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: post.title, text: post.content.slice(0, 100) });
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-muted)]"
                      title={lang === 'en' ? 'Share' : 'शेयर करें'}
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <h3 className="font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
                    <MessageCircle size={18} className="text-[var(--primary)]" />
                    {lang === 'en' ? 'Comments' : 'टिप्पणियां'} ({(comments[post.id] || []).length})
                  </h3>
                  
                  {/* Add Comment */}
                  {user ? (
                    <div className="flex gap-3 mb-4">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
                          {(user.displayName || 'U')[0]}
                        </div>
                      )}
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={lang === 'en' ? 'Write a comment...' : 'टिप्पणी लिखें...'}
                          className="w-full p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                          rows={2}
                        />
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="mt-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center gap-1"
                        >
                          <Send size={14} />
                          {lang === 'en' ? 'Post' : 'पोस्ट करें'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--text-muted)] mb-4">
                      {lang === 'en' ? 'Login to post a comment' : 'टिप्पणी करने के लिए लॉगिन करें'}
                    </p>
                  )}

                  {/* Comments List */}
                  <div className="space-y-3">
                    {loadingComments ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader className="animate-spin text-[var(--primary)]" size={20} />
                      </div>
                    ) : (comments[post.id] || []).length === 0 ? (
                      <p className="text-center text-sm text-[var(--text-muted)] py-4">
                        {lang === 'en' ? 'No comments yet. Be the first!' : 'अभी कोई टिप्पणी नहीं। पहले बनें!'}
                      </p>
                    ) : (comments[post.id] || []).map(comment => (
                      <div key={comment.id} className="flex gap-3 p-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border)]">
                        {comment.userAvatar ? (
                          <img src={comment.userAvatar} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-white font-bold text-xs">
                            {(comment.userName || 'A')[0]}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm text-[var(--text-main)]">{comment.userName}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[var(--text-muted)]">
                                {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
                              </span>
                              {user && comment.userId === user.uid && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-[var(--text-muted)]">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        // LIST VIEW
        <div>
          {activeTab === 'community' ? (
            // Community Posts
            <div>
              <div className="mb-4">
                <h2 className="text-lg md:text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                  <MessageCircle className="text-[var(--primary)]" size={20} />
                  {lang === 'en' ? 'Community Discussions' : 'समुदाय चर्चा'}
                </h2>
              </div>

              {userPosts.length === 0 ? (
                <div className="text-center py-10 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
                  <MessageCircle className="mx-auto mb-3 opacity-30 text-[var(--text-muted)]" size={40} />
                  <p className="text-sm text-[var(--text-muted)] mb-4">
                    {lang === 'en' ? 'No posts yet. Be the first to share!' : 'अभी तक कोई पोस्ट नहीं। पहले शेयर करें!'}
                  </p>
                  {user && (
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      {lang === 'en' ? 'Create First Post' : 'पहला पोस्ट बनाएं'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {userPosts.map(post => {
                    const categoryStyles = {
                      general: 'bg-gray-100 text-gray-700',
                      problem: 'bg-rose-100 text-rose-700',
                      advice: 'bg-sky-100 text-sky-700',
                      success: 'bg-emerald-100 text-emerald-700',
                      question: 'bg-violet-100 text-violet-700'
                    };
                    
                    return (
                      <article 
                        key={post.id} 
                        className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-3 shadow-sm hover:shadow-md transition-all hover:border-[var(--primary)] active:scale-[0.99]"
                      >
                        <div className="flex items-start gap-3">
                          {/* Author Avatar - smaller on mobile */}
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {(post.authorName || 'U')[0]}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div>
                                <p className="font-bold text-sm text-[var(--text-main)]">{post.authorName}</p>
                                <p className="text-[10px] md:text-xs text-[var(--text-muted)]">
                                  {post.authorVillage} • {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('en-IN') : 'Today'}
                                </p>
                              </div>
                              {user && user.uid === post.authorId && (
                                <button
                                  onClick={() => handleDeletePost(post.id, post.authorId)}
                                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title={lang === 'en' ? 'Delete' : 'हटाएं'}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>

                            {/* Category */}
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1.5 ${categoryStyles[post.category] || categoryStyles.general}`}>
                              {post.category === 'problem' ? (lang === 'en' ? 'Problem' : 'समस्या') :
                               post.category === 'advice' ? (lang === 'en' ? 'Advice' : 'सलाह') :
                               post.category === 'success' ? (lang === 'en' ? 'Success' : 'सफलता') :
                               post.category === 'question' ? (lang === 'en' ? 'Question' : 'सवाल') :
                               (lang === 'en' ? 'General' : 'सामान्य')}
                            </span>

                            {/* Title */}
                            <h3 className="font-bold text-sm md:text-base text-[var(--text-main)] mb-1 line-clamp-2">{post.title}</h3>

                            {/* Content */}
                            <p className="text-[var(--text-muted)] text-xs line-clamp-2 mb-2">{post.content}</p>

                            {/* Compact Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
                              <button 
                                onClick={() => handleVote(`user_${post.id}`, 1)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-xs ${votes[`user_${post.id}`] === 1 ? 'bg-green-100 text-green-600' : 'hover:bg-[var(--bg-glass)] text-[var(--text-muted)]'}`}
                              >
                                <ThumbsUp size={12} />
                                <span className="font-medium">{post.likesCount || 0}</span>
                              </button>
                              
                              <button 
                                onClick={() => handleVote(`user_${post.id}`, -1)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-xs ${votes[`user_${post.id}`] === -1 ? 'bg-red-100 text-red-600' : 'hover:bg-[var(--bg-glass)] text-[var(--text-muted)]'}`}
                              >
                                <ThumbsDown size={12} />
                              </button>
                              
                              <button 
                                onClick={() => setSelectedPostId(`user_${post.id}`)}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-muted)] text-xs"
                              >
                                <MessageCircle size={12} />
                                <span>{post.commentsCount || 0}</span>
                              </button>
                              
                              <button 
                                onClick={() => {
                                  if (window.shareContent) {
                                    window.shareContent(post.title, post.content, window.location.href);
                                  }
                                }}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-muted)] text-xs ml-auto"
                              >
                                <Share2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // Articles (Original Blog Posts)
            <div>
              <div className="mb-4">
                <h2 className="text-lg md:text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                  <FileText className="text-[var(--primary)]" size={20} />
                  {lang === 'en' ? 'Financial Literacy Corner' : 'वित्तीय साक्षरता कोना'}
                </h2>
              </div>

              {/* Category Filters - Subtle */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { id: 'all', label: lang === 'en' ? 'All' : 'सभी' },
                  { id: 'loans', label: lang === 'en' ? 'Loans' : 'ऋण', match: ['Loans & Credit', 'Digital Banking'] },
                  { id: 'security', label: lang === 'en' ? 'Security' : 'सुरक्षा', match: ['Security'] },
                  { id: 'savings', label: lang === 'en' ? 'Savings' : 'बचत', match: ['Savings'] },
                  { id: 'schemes', label: lang === 'en' ? 'Schemes' : 'योजनाएं', match: ['Insurance', 'Farming', 'Women Empowerment', 'Market Prices'] },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setArticleFilter(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      articleFilter === cat.id 
                        ? 'bg-[var(--primary)] text-white' 
                        : 'bg-[var(--bg-glass)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {blogPosts
                  .filter(post => {
                    if (articleFilter === 'all') return true;
                    const filterMatches = {
                      loans: ['Loans & Credit', 'Digital Banking'],
                      security: ['Security'],
                      savings: ['Savings'],
                      schemes: ['Insurance', 'Farming', 'Women Empowerment', 'Market Prices']
                    };
                    return filterMatches[articleFilter]?.includes(post.category.en);
                  })
                  .map(post => (
                  <article 
                    key={post.id} 
                    onClick={() => setSelectedPostId(post.id)}
                    className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer hover:border-[var(--primary)]/50 active:scale-[0.99] group"
                  >
                    <div className="flex gap-3 p-3">
                      {/* Image */}
                      <div className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          {/* Category Badge - Simple */}
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1.5 ${
                            post.category.en === 'Loans & Credit' ? 'bg-emerald-100 text-emerald-700' :
                            post.category.en === 'Security' ? 'bg-rose-100 text-rose-700' :
                            post.category.en === 'Savings' ? 'bg-violet-100 text-violet-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {lang === 'en' ? post.category.en : post.category.hi}
                          </span>
                          
                          {/* Title */}
                          <h3 className="font-bold text-sm md:text-base text-[var(--text-main)] mb-1 line-clamp-2 leading-snug">
                            {post.title}
                          </h3>
                          
                          {/* Content Preview - Limited to 120 chars */}
                          <p className="text-[var(--text-muted)] text-xs line-clamp-2 hidden sm:block">
                            {post.content.length > 120 ? post.content.slice(0, 120) + '...' : post.content}
                          </p>
                        </div>

                        {/* Compact Meta */}
                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-[var(--text-muted)] mt-1">
                          <div className="flex items-center gap-1">
                            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${post.author.color} flex items-center justify-center text-white text-[8px] md:text-[10px] font-bold`}>
                              {post.author.avatar}
                            </div>
                            <span>{post.author.name}</span>
                          </div>
                          <span>{post.date}</span>
                          <span className="flex items-center gap-0.5"><Clock size={10} />{post.readTime}</span>
                        </div>
                      </div>

                      {/* Action Buttons - Cleaner */}
                      <div className="flex flex-col gap-2 justify-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(post.id, 1);
                          }}
                          className={`p-2 rounded-xl transition-all ${votes[post.id] === 1 ? 'bg-emerald-500 text-white' : 'bg-[var(--bg-glass)] hover:bg-emerald-500/20 text-[var(--text-muted)]'}`}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(post.id);
                          }}
                          className={`p-2 rounded-xl transition-all ${saved[post.id] ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-glass)] hover:bg-[var(--primary)]/20 text-[var(--text-muted)]'}`}
                        >
                          {saved[post.id] ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                              navigator.share({ title: post.title, text: post.content.slice(0, 100) });
                            }
                          }}
                          className="p-2 rounded-xl bg-[var(--bg-glass)] hover:bg-sky-500/20 text-[var(--text-muted)] transition-all"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: SEEKHO (LEARN) - with completion tracking
 * ==========================================================================================
 */
function SeekhoView({ t, lang, user, db, appId }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null); // Lesson with randomized questions
  
  // New states for immediate feedback
  const [answerFeedback, setAnswerFeedback] = useState(null); // { correct: boolean, correctAnswer: number }
  const [hasAnswered, setHasAnswered] = useState(false);
  const [badges, setBadges] = useState([]);

  // Load completed lessons from Firebase on mount
  useEffect(() => {
    if (!user || !db) {
      // Fallback to localStorage for non-logged in users
      const saved = localStorage.getItem('completed_lessons');
      if (saved) setCompletedLessons(JSON.parse(saved));
      return;
    }
    
    const loadProgress = async () => {
      try {
        const lessonsSnap = await getDocs(collection(db, 'artifacts', appId, 'users', user.uid, 'lessons'));
        const lessons = [];
        lessonsSnap.forEach(doc => {
          lessons.push({ id: parseInt(doc.id), ...doc.data() });
        });
        setCompletedLessons(lessons);
      } catch (err) {
        console.error('Error loading lesson progress:', err);
        // Fallback to localStorage
        const saved = localStorage.getItem('completed_lessons');
        if (saved) setCompletedLessons(JSON.parse(saved));
      }
    };
    
    loadProgress();
  }, [user, db, appId]);
  
  // Load badges
  useEffect(() => {
    if (!user || !db) {
      const saved = localStorage.getItem(`badges_${user?.uid || 'guest'}`);
      if (saved) setBadges(JSON.parse(saved));
      return;
    }
    
    const loadBadges = async () => {
      try {
        const badgesSnap = await getDocs(collection(db, 'artifacts', appId, 'users', user.uid, 'badges'));
        const userBadges = [];
        badgesSnap.forEach(doc => userBadges.push({ id: doc.id, ...doc.data() }));
        setBadges(userBadges);
      } catch (err) {
        console.error('Error loading badges:', err);
      }
    };
    
    loadBadges();
  }, [user, db, appId]);

  // Save completed lessons to Firebase (and localStorage as backup)
  const markLessonComplete = async (lessonId, score) => {
    const lessonData = { id: lessonId, score, date: new Date().toISOString() };
    const newCompleted = [...completedLessons.filter(c => c.id !== lessonId), lessonData];
    setCompletedLessons(newCompleted);
    
    // Always save to localStorage as backup
    localStorage.setItem('completed_lessons', JSON.stringify(newCompleted));
    
    // Award badges
    await awardBadges(lessonId, score, newCompleted);
    
    // Save to Firebase if logged in
    if (user && db) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'lessons', String(lessonId)), {
          score,
          completedAt: serverTimestamp(),
          attempts: (completedLessons.find(c => c.id === lessonId)?.attempts || 0) + 1
        });
      } catch (err) {
        console.error('Error saving lesson progress:', err);
      }
    }
  };
  
  // Award badges based on achievements
  const awardBadges = async (lessonId, score, completed) => {
    const newBadges = [];
    
    // First lesson badge
    if (completed.length === 1 && !badges.find(b => b.id === 'first_lesson')) {
      newBadges.push({
        id: 'first_lesson',
        name: lang === 'en' ? 'Getting Started' : 'शुरुआत',
        icon: '🌟',
        description: lang === 'en' ? 'Completed your first lesson' : 'पहला पाठ पूरा किया',
        earnedAt: new Date().toISOString()
      });
    }
    
    // Perfect score badge
    if (score === 100 && !badges.find(b => b.id === `perfect_${lessonId}`)) {
      newBadges.push({
        id: `perfect_${lessonId}`,
        name: lang === 'en' ? 'Perfect Score' : 'परिपूर्ण स्कोर',
        icon: '🏆',
        description: lang === 'en' ? `100% on lesson ${lessonId}` : `पाठ ${lessonId} पर 100%`,
        earnedAt: new Date().toISOString()
      });
    }
    
    // All lessons completed
    if (completed.length >= 8 && !badges.find(b => b.id === 'master')) {
      newBadges.push({
        id: 'master',
        name: lang === 'en' ? 'Master Learner' : 'मास्टर शिक्षार्थी',
        icon: '🎓',
        description: lang === 'en' ? 'Completed all lessons' : 'सभी पाठ पूरे किए',
        earnedAt: new Date().toISOString()
      });
    }
    
    // High achiever (average 80%+)
    const avgScore = completed.reduce((sum, l) => sum + l.score, 0) / completed.length;
    if (avgScore >= 80 && completed.length >= 5 && !badges.find(b => b.id === 'high_achiever')) {
      newBadges.push({
        id: 'high_achiever',
        name: lang === 'en' ? 'High Achiever' : 'उच्च उपलब्धि',
        icon: '⭐',
        description: lang === 'en' ? '80%+ average score' : '80%+ औसत स्कोर',
        earnedAt: new Date().toISOString()
      });
    }
    
    if (newBadges.length > 0) {
      const updatedBadges = [...badges, ...newBadges];
      setBadges(updatedBadges);
      localStorage.setItem(`badges_${user?.uid || 'guest'}`, JSON.stringify(updatedBadges));
      
      // Save to Firebase
      if (user && db) {
        for (const badge of newBadges) {
          try {
            await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'badges', badge.id), badge);
          } catch (err) {
            console.error('Error saving badge:', err);
          }
        }
      }
      
      // Show badge notification
      setTimeout(() => {
        alert(`🎉 ${lang === 'en' ? 'New Badge Earned!' : 'नया बैज मिला!'} ${newBadges[0].icon} ${newBadges[0].name}`);
      }, 500);
    }
  };

  const getLessonCompletion = (lessonId) => {
    return completedLessons.find(c => c.id === lessonId);
  };

  // Shuffle array helper (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Question banks for each lesson (with more questions than needed)
  const questionBanks = {
    1: [ // Soil Health
      { 
        question: lang === 'en' ? 'How often should you test your soil?' : 'कितनी बार मिट्टी की जांच करनी चाहिए?',
        options: lang === 'en' ? ['Every month', 'Every season', 'Every 2-3 years', 'Never'] : ['हर महीने', 'हर मौसम', 'हर 2-3 साल', 'कभी नहीं'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'Which nutrient is responsible for leaf growth?' : 'पत्ती वृद्धि के लिए कौन सा पोषक तत्व जिम्मेदार है?',
        options: lang === 'en' ? ['Phosphorus (P)', 'Potassium (K)', 'Nitrogen (N)', 'Calcium (Ca)'] : ['फॉस्फोरस (P)', 'पोटेशियम (K)', 'नाइट्रोजन (N)', 'कैल्शियम (Ca)'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'Which nutrient helps in root development?' : 'जड़ विकास में कौन सा पोषक तत्व मदद करता है?',
        options: lang === 'en' ? ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'Iron (Fe)'] : ['नाइट्रोजन (N)', 'फॉस्फोरस (P)', 'पोटेशियम (K)', 'आयरन (Fe)'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'What is the Soil Health Card helpline number?' : 'मृदा स्वास्थ्य कार्ड हेल्पलाइन नंबर क्या है?',
        options: ['1800-180-1551', '1800-200-2000', '100', '108'],
        correct: 0
      },
      { 
        question: lang === 'en' ? 'What sample depth is recommended for soil testing?' : 'मिट्टी परीक्षण के लिए कितनी गहराई से नमूना लें?',
        options: lang === 'en' ? ['1-2 inches', '4-6 inches', '10-12 inches', '1 foot'] : ['1-2 इंच', '4-6 इंच', '10-12 इंच', '1 फुट'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'What does K stand for in NPK?' : 'NPK में K का क्या मतलब है?',
        options: lang === 'en' ? ['Kalcium', 'Potassium', 'Krypton', 'Kelp'] : ['कैल्शियम', 'पोटेशियम', 'क्रिप्टन', 'केल्प'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'Where can you get free soil testing?' : 'मुफ्त मिट्टी परीक्षण कहां होता है?',
        options: lang === 'en' ? ['Post Office', 'Krishi Vigyan Kendra', 'Railway Station', 'Hospital'] : ['डाकघर', 'कृषि विज्ञान केंद्र', 'रेलवे स्टेशन', 'अस्पताल'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'How much soil sample is needed for testing?' : 'मिट्टी परीक्षण के लिए कितना नमूना चाहिए?',
        options: ['100g', '250g', '500g', '1kg'],
        correct: 2
      }
    ],
    2: [ // Money Management
      { 
        question: lang === 'en' ? 'According to the 50-30-20 rule, how much should go to basic needs?' : '50-30-20 नियम के अनुसार, बुनियादी जरूरतों में कितना जाना चाहिए?',
        options: ['20%', '30%', '50%', '60%'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'How much should you save from harvest income?' : 'फसल आय से कितना बचत करनी चाहिए?',
        options: ['5%', '10%', '20%', '50%'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'What is a safe interest rate for agricultural loans?' : 'कृषि ऋण के लिए सुरक्षित ब्याज दर क्या है?',
        options: lang === 'en' ? ['20-25%', '15-18%', '4% (KCC)', '35%'] : ['20-25%', '15-18%', '4% (KCC)', '35%'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'What is the target for emergency fund?' : 'आपातकालीन फंड का लक्ष्य क्या है?',
        options: lang === 'en' ? ['1 month expenses', '3-6 months expenses', '1 year expenses', 'No need'] : ['1 महीने का खर्च', '3-6 महीने का खर्च', '1 साल का खर्च', 'जरूरत नहीं'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'Which is a safe option for emergency savings?' : 'आपातकालीन बचत के लिए कौन सा विकल्प सुरक्षित है?',
        options: lang === 'en' ? ['Lotteries', 'Stock trading', 'Post Office savings', 'Lending to friends'] : ['लॉटरी', 'शेयर ट्रेडिंग', 'डाकघर बचत', 'दोस्तों को उधार'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'What percentage goes to farm improvements in 50-30-20?' : '50-30-20 में खेती सुधार में कितना जाता है?',
        options: ['20%', '30%', '50%', '40%'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'What is KCC?' : 'KCC क्या है?',
        options: lang === 'en' ? ['Kisan Call Center', 'Kisan Credit Card', 'Krishi Care Card', 'Kisan Cash Card'] : ['किसान कॉल सेंटर', 'किसान क्रेडिट कार्ड', 'कृषि केयर कार्ड', 'किसान कैश कार्ड'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'When is the best time to buy farm inputs in bulk?' : 'खेती सामान थोक में कब खरीदें?',
        options: lang === 'en' ? ['Peak season', 'Off-season', 'During harvest', 'Never bulk buy'] : ['व्यस्त सीजन', 'ऑफ-सीजन', 'फसल के दौरान', 'थोक में कभी न खरीदें'],
        correct: 1
      }
    ],
    3: [ // Crop Insurance
      { 
        question: lang === 'en' ? 'What is the premium for Kharif crop insurance?' : 'खरीफ फसल बीमा का प्रीमियम कितना है?',
        options: ['1%', '2%', '5%', '10%'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'When should you register for crop insurance?' : 'फसल बीमा के लिए कब रजिस्टर करना चाहिए?',
        options: lang === 'en' ? ['After harvest', 'Before sowing', 'Anytime in year', 'After damage'] : ['फसल के बाद', 'बुवाई से पहले', 'साल में कभी भी', 'नुकसान के बाद'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'How soon must you report crop damage for insurance claim?' : 'बीमा दावे के लिए फसल नुकसान कितनी जल्दी रिपोर्ट करना चाहिए?',
        options: lang === 'en' ? ['Within 72 hours', 'Within 1 week', 'Within 1 month', 'Anytime'] : ['72 घंटे में', '1 हफ्ते में', '1 महीने में', 'कभी भी'],
        correct: 0
      },
      { 
        question: lang === 'en' ? 'What is the premium for Rabi crop insurance?' : 'रबी फसल बीमा का प्रीमियम कितना है?',
        options: ['1.5%', '2%', '2.5%', '3%'],
        correct: 0
      },
      { 
        question: lang === 'en' ? 'Which website to use for online crop insurance?' : 'ऑनलाइन फसल बीमा के लिए कौन सी वेबसाइट?',
        options: ['pmkisan.gov.in', 'pmfby.gov.in', 'kisan.gov.in', 'agri.gov.in'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'What document is NOT needed for crop insurance?' : 'फसल बीमा के लिए कौन सा दस्तावेज नहीं चाहिए?',
        options: lang === 'en' ? ['Aadhaar Card', 'Land documents', 'Passport', 'Bank Passbook'] : ['आधार कार्ड', 'जमीन दस्तावेज', 'पासपोर्ट', 'बैंक पासबुक'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'PM Fasal Bima covers which of these?' : 'PM फसल बीमा इनमें से किसे कवर करता है?',
        options: lang === 'en' ? ['Only drought', 'Only flood', 'All natural calamities', 'Only pest attack'] : ['केवल सूखा', 'केवल बाढ़', 'सभी प्राकृतिक आपदाएं', 'केवल कीट हमला'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'What should you NOT do after crop damage?' : 'फसल नुकसान के बाद क्या नहीं करना चाहिए?',
        options: lang === 'en' ? ['Take photos', 'Call helpline', 'Harvest immediately', 'Wait for surveyor'] : ['फोटो लें', 'हेल्पलाइन कॉल करें', 'तुरंत कटाई करें', 'सर्वेयर का इंतजार करें'],
        correct: 2
      }
    ],
    4: [ // Digital Banking
      { 
        question: lang === 'en' ? 'Is there any fee for UPI transactions?' : 'UPI लेनदेन के लिए कोई शुल्क है?',
        options: lang === 'en' ? ['Yes, ₹5 per transfer', 'Yes, 1% charge', 'No, completely FREE', 'Only for large amounts'] : ['हाँ, ₹5 प्रति ट्रांसफर', 'हाँ, 1% शुल्क', 'नहीं, बिल्कुल मुफ्त', 'केवल बड़ी राशि के लिए'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'What number to dial for banking without internet?' : 'इंटरनेट के बिना बैंकिंग के लिए कौन सा नंबर डायल करें?',
        options: ['*100#', '*99#', '*121#', '*123#'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'You receive a call asking for UPI PIN to "verify" your account. What should you do?' : 'खाता "वेरिफाई" करने के लिए UPI पिन मांगने वाला कॉल आया। क्या करें?',
        options: lang === 'en' ? ['Give PIN to verify', 'Share OTP only', 'Hang up immediately', 'Visit their office'] : ['वेरिफाई के लिए पिन दें', 'केवल OTP शेयर करें', 'तुरंत फोन काटें', 'उनके ऑफिस जाएं'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'How many digits in a UPI PIN?' : 'UPI पिन में कितने अंक होते हैं?',
        options: ['3', '4 or 6', '8', '10'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'Which is NOT a UPI app?' : 'कौन सा UPI ऐप नहीं है?',
        options: ['BHIM', 'PhonePe', 'WhatsApp', 'Calculator'],
        correct: 3
      },
      { 
        question: lang === 'en' ? 'UPI works on which days?' : 'UPI किन दिनों काम करता है?',
        options: lang === 'en' ? ['Only weekdays', 'Only bank days', '24/7 every day', 'Only daytime'] : ['केवल कार्य दिवस', 'केवल बैंक दिन', '24/7 हर दिन', 'केवल दिन में'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'What is safe to share for receiving money?' : 'पैसे प्राप्त करने के लिए क्या साझा करना सुरक्षित है?',
        options: lang === 'en' ? ['UPI PIN', 'OTP', 'UPI ID', 'Password'] : ['UPI पिन', 'OTP', 'UPI ID', 'पासवर्ड'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'Where should you download UPI apps from?' : 'UPI ऐप्स कहां से डाउनलोड करें?',
        options: lang === 'en' ? ['Any website', 'Friends phone', 'Official Play Store', 'Random links'] : ['कोई भी वेबसाइट', 'दोस्त का फोन', 'आधिकारिक Play Store', 'रैंडम लिंक'],
        correct: 2
      }
    ],
    5: [ // Market Prices
      { 
        question: lang === 'en' ? 'What is the MSP for wheat (2024-25)?' : 'गेहूं का MSP (2024-25) क्या है?',
        options: ['₹1,950', '₹2,100', '₹2,275', '₹2,500'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'Which days are best for selling at mandi?' : 'मंडी में बेचने के लिए कौन से दिन सबसे अच्छे हैं?',
        options: lang === 'en' ? ['Monday-Tuesday', 'Wednesday-Friday', 'Saturday-Sunday', 'Any day'] : ['सोमवार-मंगलवार', 'बुधवार-शुक्रवार', 'शनिवार-रविवार', 'कोई भी दिन'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'What is the main benefit of joining an FPO?' : 'FPO में शामिल होने का मुख्य लाभ क्या है?',
        options: lang === 'en' ? ['Free seeds', 'Better bargaining power', 'Free tractors', 'No work needed'] : ['मुफ्त बीज', 'बेहतर सौदेबाजी शक्ति', 'मुफ्त ट्रैक्टर', 'काम की जरूरत नहीं'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'What does MSP stand for?' : 'MSP का पूरा नाम क्या है?',
        options: lang === 'en' ? ['Maximum Support Price', 'Minimum Support Price', 'Market Selling Price', 'Mandi Standard Price'] : ['अधिकतम समर्थन मूल्य', 'न्यूनतम समर्थन मूल्य', 'बाजार बिक्री मूल्य', 'मंडी मानक मूल्य'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'What does FPO stand for?' : 'FPO का पूरा नाम क्या है?',
        options: lang === 'en' ? ['Farm Product Office', 'Farmer Producer Organization', 'Field Production Organization', 'Food Processing Office'] : ['फार्म प्रोडक्ट ऑफिस', 'किसान उत्पादक संगठन', 'फील्ड प्रोडक्शन संगठन', 'फूड प्रोसेसिंग ऑफिस'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'Which app shows all mandi prices?' : 'कौन सा ऐप सभी मंडी भाव दिखाता है?',
        options: ['WhatsApp', 'eNAM', 'Calculator', 'Camera'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'What helps get higher prices at mandi?' : 'मंडी में अधिक कीमत पाने में क्या मदद करता है?',
        options: lang === 'en' ? ['Selling quickly', 'Good packaging & grading', 'Selling to middlemen', 'Random selling'] : ['जल्दी बेचना', 'अच्छी पैकेजिंग और ग्रेडिंग', 'बिचौलियों को बेचना', 'बिना सोचे बेचना'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'When to check mandi prices?' : 'मंडी भाव कब देखें?',
        options: lang === 'en' ? ['After selling', 'Early morning before going', 'Never', 'Once a month'] : ['बेचने के बाद', 'जाने से पहले सुबह', 'कभी नहीं', 'महीने में एक बार'],
        correct: 1
      }
    ],
    6: [ // Fraud Prevention
      { 
        question: lang === 'en' ? 'You get SMS: "Pay ₹500 to get ₹10,000 PM Kisan bonus". What is this?' : 'SMS आया: "₹500 दें, ₹10,000 PM किसान बोनस पाएं"। यह क्या है?',
        options: lang === 'en' ? ['Real government scheme', 'Bank offer', 'Fraud/Scam', 'Insurance benefit'] : ['असली सरकारी योजना', 'बैंक ऑफर', 'धोखाधड़ी', 'बीमा लाभ'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'Someone calls saying "verify your KYC or account will be blocked". What should you do?' : 'कोई कॉल करके कहता है "KYC वेरिफाई करें वरना खाता बंद होगा"। क्या करें?',
        options: lang === 'en' ? ['Share OTP to verify', 'Give Aadhaar details', 'Hang up and call bank directly', 'Visit their office'] : ['वेरिफाई करने के लिए OTP दें', 'आधार विवरण दें', 'फोन काटें और सीधे बैंक को कॉल करें', 'उनके कार्यालय जाएं'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'What is the national cyber crime helpline number?' : 'राष्ट्रीय साइबर अपराध हेल्पलाइन नंबर क्या है?',
        options: ['100', '108', '1930', '1800'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'Which should you NEVER share?' : 'कौन सा कभी साझा नहीं करना चाहिए?',
        options: lang === 'en' ? ['Account number', 'UPI ID', 'OTP/PIN', 'IFSC code'] : ['खाता नंबर', 'UPI ID', 'OTP/पिन', 'IFSC कोड'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'What is a red flag for fraud?' : 'धोखाधड़ी का खतरे का संकेत क्या है?',
        options: lang === 'en' ? ['Official bank branch', 'Government office', 'Urgency & pressure', 'Verified apps'] : ['आधिकारिक बैंक शाखा', 'सरकारी कार्यालय', 'जल्दबाजी और दबाव', 'वेरिफाइड ऐप्स'],
        correct: 2
      },
      { 
        question: lang === 'en' ? 'Where to report cyber fraud?' : 'साइबर धोखाधड़ी की रिपोर्ट कहां करें?',
        options: ['WhatsApp', 'cybercrime.gov.in', 'Facebook', 'Instagram'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'What should you do immediately if fraud happens?' : 'धोखाधड़ी होने पर तुरंत क्या करें?',
        options: lang === 'en' ? ['Wait and see', 'Block card & call bank', 'Share OTP again', 'Ignore it'] : ['इंतजार करें', 'कार्ड ब्लॉक करें और बैंक को कॉल करें', 'OTP फिर से शेयर करें', 'अनदेखा करें'],
        correct: 1
      },
      { 
        question: lang === 'en' ? 'Banks ask for OTP over phone - True or False?' : 'बैंक फोन पर OTP मांगते हैं - सही या गलत?',
        options: lang === 'en' ? ['True, they verify', 'False, banks never ask', 'Sometimes', 'Only for big amount'] : ['सही, वे वेरिफाई करते हैं', 'गलत, बैंक कभी नहीं मांगते', 'कभी-कभी', 'केवल बड़ी राशि के लिए'],
        correct: 1
      }
    ]
  };

  const lessons = [
    {
      id: 1,
      icon: Sprout,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      duration: '10 min',
      title: lang === 'en' ? 'Understanding Soil Health' : 'मिट्टी स्वास्थ्य समझें',
      desc: lang === 'en' ? 'Learn how to test soil and choose the right fertilizers to boost crop yield.' : 'मिट्टी परीक्षण और सही खाद चुनकर फसल बढ़ाना सीखें।',
      steps: [
        {
          title: lang === 'en' ? 'Why Soil Health Matters' : 'मिट्टी स्वास्थ्य क्यों जरूरी है',
          content: lang === 'en' 
            ? 'Healthy soil = Healthy crops! Testing soil helps you understand which nutrients (N, P, K) are missing. This prevents over-fertilizing (wasting money) or under-fertilizing (poor yield).\n\n📊 Fact: Farmers using Soil Health Cards report 15-20% higher yields!\n\n🌍 Soil is a living ecosystem with billions of microorganisms that help plants absorb nutrients. When we take care of our soil, it takes care of our crops.'
            : 'स्वस्थ मिट्टी = स्वस्थ फसल! मिट्टी जांच से पता चलता है कि कौन से पोषक तत्व (N, P, K) कम हैं। इससे जरूरत से ज्यादा या कम खाद डालने से बचा जा सकता है।\n\n📊 तथ्य: मृदा स्वास्थ्य कार्ड उपयोग करने वाले किसानों को 15-20% अधिक उपज मिलती है!\n\n🌍 मिट्टी एक जीवित पारिस्थितिकी तंत्र है जिसमें अरबों सूक्ष्मजीव होते हैं जो पौधों को पोषक तत्व अवशोषित करने में मदद करते हैं।'
        },
        {
          title: lang === 'en' ? 'Understanding N-P-K' : 'N-P-K को समझें',
          content: lang === 'en'
            ? '🌱 N (Nitrogen): For leaf growth & green color - Makes plants bushy and green. Deficiency shows as yellow leaves starting from bottom.\n\n🌾 P (Phosphorus): For root development & flowering - Essential for energy transfer in plants. Deficiency causes purple/red coloring on leaves.\n\n💪 K (Potassium): For overall strength & disease resistance - Helps in water regulation and fruit quality. Deficiency shows as brown leaf edges.\n\n🔬 Secondary nutrients (Ca, Mg, S) and micronutrients (Fe, Zn, Mn, Cu, B) are also important!\n\nYour soil test will show if any of these is low. Don\'t guess - test!'
            : '🌱 N (नाइट्रोजन): पत्ती वृद्धि और हरा रंग - पौधों को घना और हरा बनाता है। कमी से निचली पत्तियां पीली होती हैं।\n\n🌾 P (फॉस्फोरस): जड़ विकास और फूल - पौधों में ऊर्जा हस्तांतरण के लिए आवश्यक। कमी से पत्तियों पर बैंगनी/लाल रंग।\n\n💪 K (पोटेशियम): समग्र शक्ति और रोग प्रतिरोध - पानी नियंत्रण और फल गुणवत्ता में मदद। कमी से पत्ती किनारे भूरे होते हैं।\n\n🔬 द्वितीयक पोषक तत्व (Ca, Mg, S) और सूक्ष्म पोषक तत्व (Fe, Zn, Mn, Cu, B) भी महत्वपूर्ण हैं!\n\nमिट्टी परीक्षण बताएगा कि कौन सा कम है। अंदाजा न लगाएं - परीक्षण करें!'
        },
        {
          title: lang === 'en' ? 'How to Get Free Soil Testing' : 'मुफ्त मिट्टी जांच कैसे करें',
          content: lang === 'en'
            ? '📍 Where to Test:\n1. Krishi Vigyan Kendra (KVK) - Every district has one!\n2. State Agricultural University labs\n3. Soil Testing Labs under government\n\n📝 How to Collect Sample:\n1. Take samples from 15-20 spots in your field\n2. Dig 4-6 inches deep (V-shape cut)\n3. Mix all samples together\n4. Take 500g from the mixture\n5. Dry in shade, not direct sunlight\n6. Pack in clean cloth bag with label\n\n📞 Helpline: 1800-180-1551 (Toll Free)\n\n⏰ Best Time: After harvest, before sowing season'
            : '📍 कहां परीक्षण करें:\n1. कृषि विज्ञान केंद्र (KVK) - हर जिले में है!\n2. राज्य कृषि विश्वविद्यालय की प्रयोगशालाएं\n3. सरकारी मृदा परीक्षण प्रयोगशालाएं\n\n📝 नमूना कैसे लें:\n1. खेत में 15-20 जगहों से नमूने लें\n2. 4-6 इंच गहराई से खोदें (V-आकार कट)\n3. सभी नमूने एक साथ मिलाएं\n4. मिश्रण से 500g लें\n5. छाया में सुखाएं, सीधी धूप में नहीं\n6. साफ कपड़े की थैली में लेबल के साथ पैक करें\n\n📞 हेल्पलाइन: 1800-180-1551 (टोल फ्री)\n\n⏰ सबसे अच्छा समय: फसल के बाद, बुवाई से पहले'
        },
        {
          title: lang === 'en' ? 'Understanding Your Soil Health Card' : 'मृदा स्वास्थ्य कार्ड समझें',
          content: lang === 'en'
            ? '📄 Your Soil Health Card Contains:\n\n1. pH Level (Acidity/Alkalinity)\n   • 6.5-7.5 = Ideal for most crops\n   • Below 6.5 = Add lime\n   • Above 7.5 = Add gypsum\n\n2. Organic Carbon (%)\n   • Above 0.75% = Good\n   • Below 0.5% = Add compost/FYM\n\n3. NPK Status (Low/Medium/High)\n   • Follow fertilizer recommendations exactly\n\n4. Micronutrient Status\n   • Zinc, Iron, Boron deficiencies common\n\n💡 Pro Tip: Take photo of card and save in your phone!'
            : '📄 आपके मृदा स्वास्थ्य कार्ड में:\n\n1. pH स्तर (अम्लता/क्षारीयता)\n   • 6.5-7.5 = अधिकांश फसलों के लिए आदर्श\n   • 6.5 से कम = चूना डालें\n   • 7.5 से अधिक = जिप्सम डालें\n\n2. कार्बनिक कार्बन (%)\n   • 0.75% से ऊपर = अच्छा\n   • 0.5% से कम = खाद/गोबर डालें\n\n3. NPK स्थिति (कम/मध्यम/अधिक)\n   • खाद की सिफारिश का सही पालन करें\n\n4. सूक्ष्म पोषक तत्व स्थिति\n   • जिंक, आयरन, बोरॉन की कमी आम है\n\n💡 प्रो टिप: कार्ड की फोटो लें और फोन में सेव करें!'
        },
        {
          title: lang === 'en' ? 'Organic Practices for Soil Health' : 'मिट्टी स्वास्थ्य के लिए जैविक तरीके',
          content: lang === 'en'
            ? '🌿 Natural Ways to Improve Soil:\n\n1. Crop Rotation: Don\'t grow same crop repeatedly\n   • Rice → Wheat → Pulses cycle\n   • Breaks pest cycles, adds nitrogen\n\n2. Green Manuring: Grow dhaincha/sunhemp, plough it back\n   • Adds nitrogen naturally\n   • Improves soil structure\n\n3. Vermicompost: Earthworm compost\n   • 5 tonnes per hectare\n   • Improves water retention\n\n4. Mulching: Cover soil with crop residue\n   • Prevents erosion\n   • Keeps soil moist & cool\n\n💰 Benefit: Save up to 25% on chemical fertilizers!'
            : '🌿 मिट्टी सुधारने के प्राकृतिक तरीके:\n\n1. फसल चक्र: एक ही फसल बार-बार न उगाएं\n   • धान → गेहूं → दाल चक्र\n   • कीट चक्र तोड़ता है, नाइट्रोजन जोड़ता है\n\n2. हरी खाद: ढैंचा/सनई उगाएं, जोत दें\n   • प्राकृतिक रूप से नाइट्रोजन जोड़े\n   • मिट्टी संरचना सुधारे\n\n3. वर्मीकम्पोस्ट: केंचुआ खाद\n   • 5 टन प्रति हेक्टेयर\n   • पानी धारण क्षमता बढ़ाए\n\n4. मल्चिंग: फसल अवशेष से मिट्टी ढकें\n   • कटाव रोकता है\n   • मिट्टी नम और ठंडी रखता है\n\n💰 लाभ: रासायनिक खाद पर 25% तक बचत!'
        }
      ]
    },
    {
      id: 2,
      icon: Wallet,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-100',
      duration: '12 min',
      title: lang === 'en' ? 'Smart Money Management' : 'स्मार्ट पैसा प्रबंधन',
      desc: lang === 'en' ? 'Master the 50-30-20 rule for farming income and build emergency funds.' : 'खेती आय के लिए 50-30-20 नियम और आपातकालीन फंड बनाना सीखें।',
      steps: [
        {
          title: lang === 'en' ? 'The 50-30-20 Rule for Farmers' : 'किसानों के लिए 50-30-20 नियम',
          content: lang === 'en'
            ? '💰 The Golden Rule of Budgeting:\n\n50% - Basic needs (seeds, fertilizer, daily expenses)\n30% - Farm improvements (tools, irrigation)\n20% - Savings & debt repayment\n\nThis ensures you don\'t spend everything at once after harvest!\n\n✨ Tip: Create separate bank accounts for each category!\n\n📌 Example: If you earn ₹1,00,000 from harvest:\n• ₹50,000 → Basic needs\n• ₹30,000 → Farm improvements\n• ₹20,000 → Savings'
            : '💰 बजट का सुनहरा नियम:\n\n50% - बुनियादी जरूरतें (बीज, खाद, रोजमर्रा खर्च)\n30% - खेती सुधार (औजार, सिंचाई)\n20% - बचत और कर्ज चुकाना\n\nइससे फसल के बाद सारा पैसा एक साथ खर्च नहीं होगा!\n\n✨ टिप: प्रत्येक श्रेणी के लिए अलग बैंक खाते बनाएं!\n\n📌 उदाहरण: अगर फसल से ₹1,00,000 कमाए:\n• ₹50,000 → बुनियादी जरूरतें\n• ₹30,000 → खेती सुधार\n• ₹20,000 → बचत'
        },
        {
          title: lang === 'en' ? 'Building Emergency Fund' : 'आपातकालीन फंड बनाना',
          content: lang === 'en'
            ? '🏦 Why You Need Emergency Fund:\n\n• Crop failure doesn\'t mean family starves\n• Medical emergencies covered\n• No need for high-interest loans\n• Mental peace during tough times\n\n🎯 Target: Save 3-6 months of expenses\n\n📍 Where to Save:\n• Post Office savings (4% interest)\n• Recurring Deposit (5-6% interest)\n• Bank Fixed Deposit (6-7% interest)\n• Sukanya Samriddhi (for daughters - 8% interest)\n\n⏰ Start Small: Even ₹500/month builds to ₹6,000/year!'
            : '🏦 आपातकालीन फंड क्यों जरूरी:\n\n• फसल खराब होने पर भी परिवार नहीं भूखा\n• चिकित्सा आपातकाल कवर\n• उच्च ब्याज वाले कर्ज की जरूरत नहीं\n• कठिन समय में मानसिक शांति\n\n🎯 लक्ष्य: 3-6 महीने के खर्च की बचत\n\n📍 कहाँ बचाएं:\n• डाकघर बचत (4% ब्याज)\n• रिकरिंग डिपॉजिट (5-6% ब्याज)\n• बैंक FD (6-7% ब्याज)\n• सुकन्या समृद्धि (बेटियों के लिए - 8% ब्याज)\n\n⏰ छोटी शुरुआत: ₹500/महीना भी ₹6,000/साल बनता है!'
        },
        {
          title: lang === 'en' ? 'Smart Saving Tricks' : 'स्मार्ट बचत ट्रिक्स',
          content: lang === 'en'
            ? '🔑 Easy Ways to Save:\n\n1. Auto-transfer 20% on mandi payment day\n2. Use cash envelope system for daily expenses\n3. Track expenses in a diary or app\n4. Avoid unnecessary purchases for first 24 hours\n5. Buy inputs in bulk during off-season\n6. Join Self Help Group (SHG) for group savings\n7. Use IPPB (India Post Payment Bank) - doorstep banking!\n\n📊 Fact: Farmers who track expenses save 30% more!\n\n💡 The "Sleep on it" Rule: Before any purchase above ₹1,000, wait 1 day. Often you\'ll realize you don\'t need it!'
            : '🔑 आसान बचत के तरीके:\n\n1. मंडी भुगतान के दिन 20% ऑटो-ट्रांसफर\n2. रोजमर्रा खर्च के लिए कैश लिफाफा सिस्टम\n3. डायरी या ऐप में खर्च ट्रैक करें\n4. पहले 24 घंटे अनावश्यक खरीदारी से बचें\n5. ऑफ-सीजन में थोक में सामान खरीदें\n6. समूह बचत के लिए SHG से जुड़ें\n7. IPPB उपयोग करें - घर पर बैंकिंग!\n\n📊 तथ्य: खर्च ट्रैक करने वाले किसान 30% अधिक बचाते हैं!\n\n💡 "सोच लो" नियम: ₹1,000 से ऊपर की खरीद से पहले 1 दिन रुकें। अक्सर लगेगा जरूरत नहीं!'
        },
        {
          title: lang === 'en' ? 'Avoiding Debt Traps' : 'कर्ज जाल से बचें',
          content: lang === 'en'
            ? '⚠️ Red Flags - Don\'t Borrow If:\n\n• Interest rate > 12% per year\n• No written agreement\n• Pressure to sign quickly\n• Promised "easy" repayment\n• Asking for blank signed cheques\n\n✅ Safe Loan Options:\n• Kisan Credit Card (KCC) - 4% interest, up to ₹3 lakh\n• SHG loans (Self Help Group) - 8-10% interest\n• PM-Kisan benefits as collateral-free\n• Bank agricultural loans - 7-9% interest\n• NABARD schemes - subsidized rates\n\n🚫 AVOID: Money lenders charging 24-60% interest!'
            : '⚠️ खतरे के संकेत - कर्ज न लें अगर:\n\n• ब्याज दर > 12% सालाना\n• लिखित समझौता नहीं\n• जल्दी साइन करने का दबाव\n• "आसान" भुगतान का वादा\n• ब्लैंक साइन चेक मांगना\n\n✅ सुरक्षित कर्ज विकल्प:\n• किसान क्रेडिट कार्ड (KCC) - 4% ब्याज, ₹3 लाख तक\n• SHG लोन - 8-10% ब्याज\n• PM-किसान लाभ बिना गारंटी के\n• बैंक कृषि ऋण - 7-9% ब्याज\n• NABARD योजनाएं - रियायती दरें\n\n🚫 बचें: 24-60% ब्याज लेने वाले साहूकारों से!'
        },
        {
          title: lang === 'en' ? 'Understanding Kisan Credit Card (KCC)' : 'किसान क्रेडिट कार्ड (KCC) समझें',
          content: lang === 'en'
            ? '💳 Kisan Credit Card Benefits:\n\n• Interest Rate: Only 4% (with timely repayment)\n• Loan Limit: Up to ₹3 lakh without collateral\n• Repayment: Flexible, based on crop cycle\n• Insurance: Free personal accident insurance\n• ATM: Withdraw cash anytime\n\n📋 Documents Required:\n1. Aadhaar Card\n2. Land documents (Khatauni/Patta)\n3. 2 passport photos\n4. Bank account\n\n🏛️ Where to Apply:\n• Any nationalized bank\n• Cooperative banks\n• Regional Rural Banks (Gramin Banks)\n\n📞 KCC Helpline: 1800-180-1551'
            : '💳 किसान क्रेडिट कार्ड के लाभ:\n\n• ब्याज दर: केवल 4% (समय पर भुगतान पर)\n• ऋण सीमा: बिना गारंटी ₹3 लाख तक\n• भुगतान: लचीला, फसल चक्र आधारित\n• बीमा: मुफ्त व्यक्तिगत दुर्घटना बीमा\n• ATM: कभी भी नकद निकालें\n\n📋 आवश्यक दस्तावेज:\n1. आधार कार्ड\n2. जमीन दस्तावेज (खतौनी/पट्टा)\n3. 2 पासपोर्ट फोटो\n4. बैंक खाता\n\n🏛️ कहां आवेदन करें:\n• कोई भी राष्ट्रीयकृत बैंक\n• सहकारी बैंक\n• क्षेत्रीय ग्रामीण बैंक\n\n📞 KCC हेल्पलाइन: 1800-180-1551'
        },
        {
          title: lang === 'en' ? 'Financial Planning Calendar' : 'वित्तीय योजना कैलेंडर',
          content: lang === 'en'
            ? '📅 Plan Your Year:\n\n🌱 Pre-Sowing (Apr-Jun/Oct-Nov):\n• Budget for seeds, fertilizers, labor\n• Apply for crop loan if needed\n• Register for crop insurance\n\n🌾 Growing Season:\n• Track daily expenses\n• Maintain emergency fund\n• Avoid unnecessary purchases\n\n💰 Post-Harvest (Nov-Jan/Apr-May):\n• Sell at best price (don\'t panic sell)\n• Repay loans immediately\n• Transfer 20% to savings\n• Pay crop insurance if due\n\n📊 Monthly Review:\n• Check bank balance\n• Review expenses\n• Adjust budget if needed'
            : '📅 अपने साल की योजना:\n\n🌱 बुवाई से पहले (अप्रैल-जून/अक्टूबर-नवंबर):\n• बीज, खाद, मजदूरी का बजट\n• जरूरत हो तो फसल ऋण लें\n• फसल बीमा में नाम लिखाएं\n\n🌾 फसल का मौसम:\n• रोजाना खर्च ट्रैक करें\n• आपातकालीन फंड रखें\n• अनावश्यक खरीदारी से बचें\n\n💰 फसल के बाद (नवंबर-जनवरी/अप्रैल-मई):\n• सबसे अच्छी कीमत पर बेचें\n• तुरंत कर्ज चुकाएं\n• 20% बचत में डालें\n• फसल बीमा प्रीमियम भरें\n\n📊 मासिक समीक्षा:\n• बैंक बैलेंस चेक करें\n• खर्च की समीक्षा करें\n• जरूरत हो तो बजट बदलें'
        }
      ]
    },
    {
      id: 3,
      icon: Shield,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      duration: '11 min',
      title: lang === 'en' ? 'Crop Insurance Essentials' : 'फसल बीमा आवश्यक',
      desc: lang === 'en' ? 'Learn how PM Fasal Bima protects your crops for just 2% premium.' : 'PM फसल बीमा से सिर्फ 2% प्रीमियम में फसल सुरक्षा पाएं।',
      steps: [
        {
          title: lang === 'en' ? 'Why Crop Insurance?' : 'फसल बीमा क्यों?',
          content: lang === 'en'
            ? '🌾 One Bad Season = Years of Loss!\n\nPM Fasal Bima Yojana (PMFBY) is the world\'s largest crop insurance scheme!\n\n✅ What It Covers:\n• Pre-sowing losses (prevented sowing)\n• Standing crop losses (drought, flood, hailstorm)\n• Post-harvest losses (cyclone within 14 days)\n• Localized calamities (hailstorm, landslide)\n• Pest & disease attacks\n• Fire & lightning damage\n\n💰 Premium: Only 2% for Kharif, 1.5% for Rabi\nGovernment pays remaining premium!\n\n📊 Fact: In 2023, farmers received ₹15,500 crore in claims!\n\n🎯 Coverage: Up to sum insured based on yield'
            : '🌾 एक खराब मौसम = सालों का नुकसान!\n\nPM फसल बीमा योजना (PMFBY) विश्व की सबसे बड़ी फसल बीमा योजना है!\n\n✅ क्या कवर होता है:\n• बुवाई से पहले नुकसान\n• खड़ी फसल नुकसान (सूखा, बाढ़, ओला)\n• कटाई के बाद नुकसान (14 दिन में चक्रवात)\n• स्थानीय आपदा (ओला, भूस्खलन)\n• कीट और रोग हमले\n• आग और बिजली गिरना\n\n💰 प्रीमियम: खरीफ 2%, रबी 1.5%\nबाकी सरकार भरती है!\n\n📊 तथ्य: 2023 में ₹15,500 करोड़ मिले!\n\n🎯 कवरेज: उपज आधारित बीमित राशि तक'
        },
        {
          title: lang === 'en' ? 'Premium & Coverage Details' : 'प्रीमियम और कवरेज विवरण',
          content: lang === 'en'
            ? '💵 Premium Structure:\n\nKharif Crops:\n• Farmer pays: 2%\n• Government pays: Remaining (avg 8-10%)\n• Example: ₹50,000 coverage → You pay ₹1,000\n\nRabi Crops:\n• Farmer pays: 1.5%\n• Government pays: Remaining\n• Example: ₹40,000 coverage → You pay ₹600\n\nHorticulture Crops:\n• Farmer pays: 5%\n\n📋 Insured Amount Based On:\n• Average yield per hectare\n• MSP or market price\n• Your landholding size\n\n⏰ Cut-off Dates:\n• Kharif: Last date of June/July\n• Rabi: Last date of December\n\n💡 Voluntary for all farmers (mandatory only for crop loan holders)'
            : '💵 प्रीमियम संरचना:\n\nखरीफ फसलें:\n• किसान भुगतान: 2%\n• सरकार भुगतान: बाकी (औसत 8-10%)\n• उदाहरण: ₹50,000 कवरेज → आप ₹1,000 दें\n\nरबी फसलें:\n• किसान भुगतान: 1.5%\n• सरकार भुगतान: बाकी\n• उदाहरण: ₹40,000 कवरेज → आप ₹600 दें\n\nबागवानी फसलें:\n• किसान भुगतान: 5%\n\n📋 बीमित राशि आधार:\n• प्रति हेक्टेयर औसत उपज\n• MSP या बाजार मूल्य\n• आपकी जमीन का आकार\n\n⏰ अंतिम तारीख:\n• खरीफ: जून/जुलाई की अंतिम तिथि\n• रबी: दिसंबर की अंतिम तिथि\n\n💡 सभी के लिए स्वैच्छिक (फसल ऋण लेने वालों के लिए अनिवार्य)'
        },
        {
          title: lang === 'en' ? 'Documents Required' : 'आवश्यक दस्तावेज',
          content: lang === 'en'
            ? '📋 Keep These Documents Ready:\n\n1️⃣ Identity Proof:\n• Aadhaar Card (must be linked to bank)\n• Voter ID\n• Driving License\n\n2️⃣ Land Documents:\n• Land ownership papers (Khatauni/Patta)\n• Lease/rent agreement (for tenant farmers)\n• Share cropping certificate (if applicable)\n\n3️⃣ Bank Details:\n• Bank Passbook (first page copy)\n• Cancelled cheque\n• Account must be Aadhaar-linked\n\n4️⃣ Farming Proof:\n• Sowing certificate from Patwari/Sarpanch\n• Previous season\'s receipts (if available)\n\n📸 Pro Tip: Take clear photos of all documents and store in phone + cloud backup!'
            : '📋 ये दस्तावेज तैयार रखें:\n\n1️⃣ पहचान प्रमाण:\n• आधार कार्ड (बैंक से लिंक होना चाहिए)\n• वोटर ID\n• ड्राइविंग लाइसेंस\n\n2️⃣ जमीन दस्तावेज:\n• जमीन स्वामित्व पत्र (खतौनी/पट्टा)\n• पट्टा/किराया समझौता (किरायेदार किसानों के लिए)\n• बटाईदार प्रमाण पत्र (यदि लागू हो)\n\n3️⃣ बैंक विवरण:\n• बैंक पासबुक (पहले पेज की कॉपी)\n• रद्द चेक\n• खाता आधार-लिंक होना चाहिए\n\n4️⃣ खेती प्रमाण:\n• पटवारी/सरपंच से बुवाई प्रमाण पत्र\n• पिछले सीजन की रसीदें (यदि उपलब्ध हो)\n\n📸 प्रो टिप: सभी दस्तावेजों की स्पष्ट फोटो लें और फोन + क्लाउड में स्टोर करें!'
        },
        {
          title: lang === 'en' ? 'How to Register - Step by Step' : 'रजिस्टर कैसे करें - चरण दर चरण',
          content: lang === 'en'
            ? '🏛️ Registration Process:\n\n📍 Option 1: Bank/CSC (Offline)\n1. Visit nearest bank branch or CSC\n2. Carry all required documents\n3. Fill application form (simple, 1 page)\n4. Submit before cut-off date\n5. Pay premium (cash/cheque/online)\n6. Get policy number & SMS\n\n💻 Option 2: Online\n1. Visit pmfby.gov.in\n2. Click "Farmer Application"\n3. Enter Aadhaar & mobile number\n4. Upload documents (PDF/JPG)\n5. Pay premium via net banking/UPI\n6. Download policy document\n\n📱 Option 3: Mobile App\n• Download "Crop Insurance" app\n• Register with Aadhaar\n• Apply in 5 minutes!\n\n⏰ IMPORTANT: Register BEFORE sowing, not after damage!\n📞 Helpline: 1800-180-1551 (Toll Free, 24x7)'
            : '🏛️ पंजीकरण प्रक्रिया:\n\n📍 विकल्प 1: बैंक/CSC (ऑफलाइन)\n1. नजदीकी बैंक शाखा या CSC जाएं\n2. सभी आवश्यक दस्तावेज ले जाएं\n3. आवेदन फॉर्म भरें (सरल, 1 पेज)\n4. अंतिम तिथि से पहले जमा करें\n5. प्रीमियम भुगतान (नकद/चेक/ऑनलाइन)\n6. पॉलिसी नंबर और SMS प्राप्त करें\n\n💻 विकल्प 2: ऑनलाइन\n1. pmfby.gov.in पर जाएं\n2. "किसान आवेदन" पर क्लिक करें\n3. आधार और मोबाइल नंबर दर्ज करें\n4. दस्तावेज अपलोड करें (PDF/JPG)\n5. नेट बैंकिंग/UPI से प्रीमियम भुगतान\n6. पॉलिसी डॉक्यूमेंट डाउनलोड करें\n\n📱 विकल्प 3: मोबाइल ऐप\n• "Crop Insurance" ऐप डाउनलोड करें\n• आधार से रजिस्टर करें\n• 5 मिनट में आवेदन करें!\n\n⏰ महत्वपूर्ण: बुवाई से पहले रजिस्टर करें, नुकसान के बाद नहीं!\n📞 हेल्पलाइन: 1800-180-1551 (टोल फ्री, 24x7)'
        },
        {
          title: lang === 'en' ? 'How to File a Claim' : 'दावा कैसे दर्ज करें',
          content: lang === 'en'
            ? '⏰ CRITICAL: Report Within 72 Hours of Damage!\n\n📞 Immediate Steps:\n1. Call 1800-180-1551 IMMEDIATELY\n2. Note down complaint number\n3. Inform insurance company & bank\n\n📱 Report Through App:\n• Open Crop Insurance app\n• Go to "Report Crop Loss"\n• Upload damage photos/videos\n• Mark location on map\n• Submit instantly!\n\n📸 Document Everything:\n• Take multiple photos from different angles\n• Record video walking through field\n• Show damaged vs undamaged areas\n• Include date/time stamp\n\n🚫 DON\'T:\n• Harvest damaged area before survey\n• Remove damaged crops\n• Start replanting immediately\n\n✅ DO:\n• Keep copy of complaint receipt\n• Wait for surveyor visit (within 72 hrs)\n• Cooperate fully with surveyor\n• Keep policy number handy\n\n💰 Claim disbursed directly to bank within 2-3 weeks after survey!'
            : '⏰ महत्वपूर्ण: नुकसान के 72 घंटे में रिपोर्ट करें!\n\n📞 तुरंत के कदम:\n1. तुरंत 1800-180-1551 कॉल करें\n2. शिकायत नंबर नोट करें\n3. बीमा कंपनी और बैंक को सूचित करें\n\n📱 ऐप के माध्यम से रिपोर्ट:\n• Crop Insurance ऐप खोलें\n• "फसल नुकसान रिपोर्ट" पर जाएं\n• नुकसान की फोटो/वीडियो अपलोड करें\n• मैप पर स्थान चिह्नित करें\n• तुरंत सबमिट करें!\n\n📸 सब कुछ दस्तावेज करें:\n• अलग-अलग कोणों से कई फोटो लें\n• खेत में घूमते हुए वीडियो रिकॉर्ड करें\n• क्षतिग्रस्त बनाम अक्षतिग्रस्त क्षेत्र दिखाएं\n• तारीख/समय स्टैंप शामिल करें\n\n🚫 मत करें:\n• सर्वेक्षण से पहले क्षतिग्रस्त क्षेत्र की कटाई\n• क्षतिग्रस्त फसलें हटाना\n• तुरंत दोबारा बुवाई शुरू करना\n\n✅ करें:\n• शिकायत रसीद की कॉपी रखें\n• सर्वेयर की यात्रा का इंतजार करें (72 घंटे में)\n• सर्वेयर के साथ पूरी तरह सहयोग करें\n• पॉलिसी नंबर तैयार रखें\n\n💰 दावा सीधे बैंक में 2-3 हफ्ते में जमा हो जाएगा!'
        },
        {
          title: lang === 'en' ? 'Common Mistakes to Avoid' : 'बचने योग्य सामान्य गलतियाँ',
          content: lang === 'en'
            ? '❌ Top 5 Mistakes Farmers Make:\n\n1️⃣ Registering AFTER Damage\n• Insurance is NOT a cure, it\'s prevention\n• Must register before sowing season\n\n2️⃣ Wrong Mobile Number\n• All alerts come via SMS\n• Keep active, Aadhaar-linked number\n\n3️⃣ Incomplete Documents\n• Missing any document = Claim rejection\n• Keep everything ready beforehand\n\n4️⃣ Not Reporting in Time\n• 72-hour window is strict\n• Delayed report = No claim\n\n5️⃣ Harvesting Before Survey\n• Surveyor needs to see actual damage\n• Don\'t touch damaged area!\n\n✅ Success Tips:\n• Save helpline (1800-180-1551) in phone NOW\n• Keep policy number in wallet\n• Take photos of healthy crop at sowing\n• Join farmer WhatsApp groups for alerts\n• Renew every season without gap'
            : '❌ किसान करते हैं ये 5 गलतियां:\n\n1️⃣ नुकसान के बाद रजिस्टर करना\n• बीमा इलाज नहीं, रोकथाम है\n• बुवाई सीजन से पहले रजिस्टर करना जरूरी\n\n2️⃣ गलत मोबाइल नंबर\n• सभी अलर्ट SMS से आते हैं\n• सक्रिय, आधार-लिंक नंबर रखें\n\n3️⃣ अधूरे दस्तावेज\n• कोई भी दस्तावेज गायब = दावा अस्वीकार\n• सब कुछ पहले से तैयार रखें\n\n4️⃣ समय पर रिपोर्ट न करना\n• 72 घंटे की विंडो सख्त है\n• देरी से रिपोर्ट = कोई दावा नहीं\n\n5️⃣ सर्वेक्षण से पहले कटाई\n• सर्वेयर को वास्तविक नुकसान देखना होता है\n• क्षतिग्रस्त क्षेत्र को छुएं नहीं!\n\n✅ सफलता टिप्स:\n• अभी हेल्पलाइन (1800-180-1551) फोन में सेव करें\n• पॉलिसी नंबर बटुए में रखें\n• बुवाई पर स्वस्थ फसल की फोटो लें\n• अलर्ट के लिए किसान WhatsApp ग्रुप से जुड़ें\n• बिना गैप हर सीजन नवीनीकरण करें'
        }
      ]
    },
    {
      id: 4,
      icon: Smartphone,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      duration: '10 min',
      title: lang === 'en' ? 'Digital Banking Basics' : 'डिजिटल बैंकिंग मूल बातें',
      desc: lang === 'en' ? 'Learn UPI, BHIM, and online banking to save time and money.' : 'UPI, BHIM और ऑनलाइन बैंकिंग सीखें, समय और पैसा बचाएं।',
      steps: [
        {
          title: lang === 'en' ? 'What is UPI?' : 'UPI क्या है?',
          content: lang === 'en'
            ? '📱 UPI = Unified Payments Interface\n\nIndia\'s revolutionary instant payment system!\n\n✅ Benefits:\n• 100% FREE transfers (₹0 charges)\n• Works 24/7/365 - even on holidays\n• Send up to ₹1 lakh instantly\n• No bank forms or paperwork\n• Works with all banks\n• Instant mandi/shop payments\n• Works offline too (*99# USSD)\n\n🚀 Speed: Money reaches in 2-3 seconds!\n\n💡 10+ billion UPI transactions monthly in India!\n\n🌟 Perfect For Farmers:\n• Receive mandi payments instantly\n• Pay for seeds/fertilizers\n• Send money home to family\n• Collect payments from customers'
            : '📱 UPI = यूनिफाइड पेमेंट्स इंटरफेस\n\nभारत की क्रांतिकारी त्वरित भुगतान प्रणाली!\n\n✅ लाभ:\n• 100% मुफ्त ट्रांसफर (₹0 शुल्क)\n• 24/7/365 काम करता है - छुट्टी पर भी\n• तुरंत ₹1 लाख तक भेजें\n• बैंक फॉर्म या कागजी कार्रवाई नहीं\n• सभी बैंकों के साथ काम करता है\n• तुरंत मंडी/दुकान भुगतान\n• ऑफलाइन भी काम करता है (*99# USSD)\n\n🚀 गति: पैसा 2-3 सेकंड में पहुंचता है!\n\n💡 भारत में हर महीने 10+ अरब UPI लेनदेन!\n\n🌟 किसानों के लिए एकदम सही:\n• तुरंत मंडी भुगतान प्राप्त करें\n• बीज/खाद के लिए भुगतान करें\n• परिवार को घर पैसे भेजें\n• ग्राहकों से भुगतान एकत्र करें'
        },
        {
          title: lang === 'en' ? 'Setting Up UPI - Complete Guide' : 'UPI सेटअप - पूर्ण गाइड',
          content: lang === 'en'
            ? '🔧 Step-by-Step UPI Setup:\n\n📱 Choose Your App:\n• BHIM (Government app - most secure)\n• PhonePe\n• Google Pay (GPay)\n• Paytm\n• Bank\'s own UPI app\n\n📥 Installation Process:\n1. Download from Play Store ONLY\n2. Grant SMS & Phone permissions\n3. Enter mobile number (must be linked to bank)\n4. OTP verification\n\n🏦 Link Bank Account:\n1. Select your bank from list\n2. Account auto-detected via mobile\n3. Create UPI PIN (4 or 6 digits)\n   • You\'ll need last 6 digits of debit card\n   • Card expiry date\n4. Your UPI ID created: name@bankname\n\n✨ Practice Tips:\n• Start with ₹10 transfers to family\n• Send to yourself between accounts\n• Check transaction history daily\n• Enable transaction alerts'
            : '🔧 चरण-दर-चरण UPI सेटअप:\n\n📱 अपना ऐप चुनें:\n• BHIM (सरकारी ऐप - सबसे सुरक्षित)\n• PhonePe\n• Google Pay (GPay)\n• Paytm\n• बैंक का अपना UPI ऐप\n\n📥 इंस्टॉलेशन प्रक्रिया:\n1. केवल Play Store से डाउनलोड करें\n2. SMS और Phone अनुमति दें\n3. मोबाइल नंबर दर्ज करें (बैंक से लिंक होना चाहिए)\n4. OTP वेरिफिकेशन\n\n🏦 बैंक खाता लिंक करें:\n1. सूची से अपना बैंक चुनें\n2. मोबाइल के माध्यम से खाता ऑटो-पता\n3. UPI पिन बनाएं (4 या 6 अंक)\n   • डेबिट कार्ड के अंतिम 6 अंक चाहिए\n   • कार्ड की समाप्ति तिथि\n4. आपकी UPI ID बनी: name@bankname\n\n✨ अभ्यास टिप्स:\n• परिवार को ₹10 ट्रांसफर से शुरू करें\n• खातों के बीच खुद को भेजें\n• रोज लेनदेन इतिहास चेक करें\n• लेनदेन अलर्ट सक्षम करें'
        },
        {
          title: lang === 'en' ? 'How to Send & Receive Money' : 'पैसे कैसे भेजें और प्राप्त करें',
          content: lang === 'en'
            ? '💸 Sending Money (3 Easy Ways):\n\n1️⃣ Using Mobile Number:\n• Open UPI app\n• Enter receiver\'s mobile number\n• Enter amount\n• Add note (optional)\n• Enter UPI PIN → Done!\n\n2️⃣ Using UPI ID:\n• Enter: name@bankname\n• Rest same as above\n\n3️⃣ Scanning QR Code:\n• Tap "Scan & Pay"\n• Point camera at merchant QR\n• Amount auto-filled (or enter manually)\n• Enter PIN → Payment done!\n\n📥 Receiving Money:\n• Share your UPI ID or mobile number\n• Money comes directly to bank\n• Get instant SMS notification\n• NO need to enter PIN for receiving!\n\n🧾 Transaction Limits:\n• Per transaction: ₹1,00,000\n• Daily limit: Varies by bank (₹1-2 lakh)\n• Monthly: No limit!'
            : '💸 पैसे भेजना (3 आसान तरीके):\n\n1️⃣ मोबाइल नंबर से:\n• UPI ऐप खोलें\n• प्राप्तकर्ता का मोबाइल नंबर दर्ज करें\n• राशि दर्ज करें\n• नोट जोड़ें (वैकल्पिक)\n• UPI पिन दर्ज करें → हो गया!\n\n2️⃣ UPI ID से:\n• दर्ज करें: name@bankname\n• बाकी ऊपर जैसा\n\n3️⃣ QR कोड स्कैन करके:\n• "स्कैन और भुगतान" टैप करें\n• कैमरा व्यापारी QR पर पॉइंट करें\n• राशि ऑटो-भरी (या मैन्युअल दर्ज करें)\n• पिन दर्ज करें → भुगतान हो गया!\n\n📥 पैसे प्राप्त करना:\n• अपना UPI ID या मोबाइल नंबर शेयर करें\n• पैसा सीधे बैंक में आता है\n• तुरंत SMS नोटिफिकेशन मिलता है\n• प्राप्त करने के लिए पिन की जरूरत नहीं!\n\n🧾 लेनदेन सीमा:\n• प्रति लेनदेन: ₹1,00,000\n• दैनिक सीमा: बैंक अनुसार (₹1-2 लाख)\n• मासिक: कोई सीमा नहीं!'
        },
        {
          title: lang === 'en' ? 'Offline Banking: *99# USSD' : 'ऑफलाइन बैंकिंग: *99# USSD',
          content: lang === 'en'
            ? '📵 Banking Without Internet!\n\n*99# works on ANY phone - even basic Nokia/Samsung!\n\n📞 How to Use:\n\n1️⃣ Check Balance:\n• Dial *99#\n• Select language (1 for English, 2 for Hindi)\n• Choose your bank (enter first 4 letters)\n• Select "Balance Enquiry"\n• Enter account number\n• Get balance via SMS!\n\n2️⃣ Send Money:\n• Dial *99#\n• Select "Send Money"\n• Enter receiver\'s mobile/account\n• Enter amount\n• Confirm with MPIN\n\n3️⃣ Other Services:\n• Mini statement (last 5 transactions)\n• Change MPIN\n• Generate MPIN\n\n💡 Perfect When:\n• No internet connection\n• Smartphone battery dead\n• In remote village\n• Need quick balance check\n\n💰 Charges: Absolutely FREE!\n📞 Works 24/7 on all networks'
            : '📵 इंटरनेट के बिना बैंकिंग!\n\n*99# किसी भी फोन पर काम करता है - यहां तक कि बुनियादी Nokia/Samsung पर भी!\n\n📞 कैसे उपयोग करें:\n\n1️⃣ बैलेंस चेक करें:\n• *99# डायल करें\n• भाषा चुनें (1 अंग्रेजी, 2 हिंदी)\n• अपना बैंक चुनें (पहले 4 अक्षर दर्ज करें)\n• "बैलेंस जांच" चुनें\n• खाता नंबर दर्ज करें\n• SMS से बैलेंस मिलेगा!\n\n2️⃣ पैसे भेजें:\n• *99# डायल करें\n• "पैसे भेजें" चुनें\n• प्राप्तकर्ता का मोबाइल/खाता दर्ज करें\n• राशि दर्ज करें\n• MPIN से कन्फर्म करें\n\n3️⃣ अन्य सेवाएं:\n• मिनी स्टेटमेंट (अंतिम 5 लेनदेन)\n• MPIN बदलें\n• MPIN जेनरेट करें\n\n💡 एकदम सही जब:\n• इंटरनेट कनेक्शन नहीं\n• स्मार्टफोन बैटरी मर गई\n• दूरदराज के गांव में\n• त्वरित बैलेंस चेक चाहिए\n\n💰 शुल्क: बिल्कुल मुफ्त!\n📞 सभी नेटवर्क पर 24/7 काम करता है'
        },
        {
          title: lang === 'en' ? 'UPI Security - Protect Your Money' : 'UPI सुरक्षा - अपना पैसा सुरक्षित रखें',
          content: lang === 'en'
            ? '🔒 Golden Security Rules:\n\n❌ NEVER SHARE:\n• UPI PIN (4/6 digits)\n• OTP (6 digits)\n• Debit card CVV\n• Net banking password\n• Aadhaar OTP\n\n🚫 RED FLAGS - Fraud Attempts:\n• Calls asking for OTP/PIN\n• "Verify your account" messages\n• "You won prize, pay ₹X to claim"\n• Requests to install AnyDesk/TeamViewer\n• "Money received" spam links\n\n✅ SAFE PRACTICES:\n• Only download from Play Store\n• Enable fingerprint/face lock\n• Check receiver details twice\n• Never click unknown links\n• Don\'t share screen with strangers\n• Keep phone\'s screen lock ON\n\n🛡️ If Fraud Happens:\n1. Call bank immediately\n2. Report to 1930 (Cyber Crime)\n3. Block card/UPI\n4. File complaint at cybercrime.gov.in\n\n📱 Remember: Banks NEVER ask for PIN/OTP over phone!'
            : '🔒 सुनहरे सुरक्षा नियम:\n\n❌ कभी साझा न करें:\n• UPI पिन (4/6 अंक)\n• OTP (6 अंक)\n• डेबिट कार्ड CVV\n• नेट बैंकिंग पासवर्ड\n• आधार OTP\n\n🚫 खतरे के संकेत - धोखाधड़ी प्रयास:\n• OTP/पिन मांगने वाले कॉल\n• "अपना खाता वेरिफाई करें" संदेश\n• "आपने इनाम जीता, ₹X दें"\n• AnyDesk/TeamViewer इंस्टॉल करने के अनुरोध\n• "पैसे मिले" स्पैम लिंक\n\n✅ सुरक्षित अभ्यास:\n• केवल Play Store से डाउनलोड करें\n• फिंगरप्रिंट/फेस लॉक सक्षम करें\n• प्राप्तकर्ता विवरण दो बार जांचें\n• अज्ञात लिंक पर क्लिक न करें\n• अजनबियों के साथ स्क्रीन साझा न करें\n• फोन का स्क्रीन लॉक ON रखें\n\n🛡️ अगर धोखाधड़ी हो:\n1. तुरंत बैंक को कॉल करें\n2. 1930 पर रिपोर्ट करें (साइबर क्राइम)\n3. कार्ड/UPI ब्लॉक करें\n4. cybercrime.gov.in पर शिकायत दर्ज करें\n\n📱 याद रखें: बैंक कभी फोन पर पिन/OTP नहीं मांगते!'
        },
        {
          title: lang === 'en' ? 'Troubleshooting Common Issues' : 'सामान्य समस्याओं का निवारण',
          content: lang === 'en'
            ? '🔧 Common Problems & Solutions:\n\n1️⃣ "Transaction Failed"\n• Wait 30 minutes - money will reverse\n• Check with receiver once\n• Don\'t retry immediately\n• Call bank if not reversed in 24 hrs\n\n2️⃣ "UPI PIN Not Working"\n• Reset PIN in app settings\n• Need debit card details\n• Or visit bank branch\n\n3️⃣ "Bank Account Not Showing"\n• Mobile number not linked to account\n• Visit bank to link mobile\n• Aadhaar must be linked too\n\n4️⃣ "Transaction Pending"\n• Normal during network issues\n• Auto-completes in 1-2 hours\n• Don\'t panic!\n\n5️⃣ "Daily Limit Exceeded"\n• Most banks: ₹1 lakh/day\n• Do remaining tomorrow\n• Or use NEFT/RTGS for large amounts\n\n☎️ Customer Care:\n• BHIM: 1800-120-1740\n• PhonePe: 080-68727374\n• GPay: 1800-419-0157\n• Banking: 1800-180-1111'
            : '🔧 सामान्य समस्याएं और समाधान:\n\n1️⃣ "लेनदेन विफल"\n• 30 मिनट प्रतीक्षा करें - पैसा वापस आएगा\n• प्राप्तकर्ता से एक बार चेक करें\n• तुरंत पुनः प्रयास न करें\n• 24 घंटे में नहीं आया तो बैंक को कॉल करें\n\n2️⃣ "UPI पिन काम नहीं कर रहा"\n• ऐप सेटिंग्स में पिन रीसेट करें\n• डेबिट कार्ड विवरण चाहिए\n• या बैंक शाखा जाएं\n\n3️⃣ "बैंक खाता नहीं दिख रहा"\n• मोबाइल नंबर खाते से लिंक नहीं\n• मोबाइल लिंक करने बैंक जाएं\n• आधार भी लिंक होना चाहिए\n\n4️⃣ "लेनदेन लंबित"\n• नेटवर्क समस्याओं के दौरान सामान्य\n• 1-2 घंटे में ऑटो-पूर्ण होता है\n• घबराएं नहीं!\n\n5️⃣ "दैनिक सीमा पार"\n• अधिकांश बैंक: ₹1 लाख/दिन\n• शेष कल करें\n• या बड़ी राशि के लिए NEFT/RTGS उपयोग करें\n\n☎️ ग्राहक सेवा:\n• BHIM: 1800-120-1740\n• PhonePe: 080-68727374\n• GPay: 1800-419-0157\n• Banking: 1800-180-1111'
        }
      ]
    },
    {
      id: 5,
      icon: TrendingUp,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      duration: '8 min',
      title: lang === 'en' ? 'Market Price Awareness' : 'बाजार भाव जागरूकता',
      desc: lang === 'en' ? 'Know MSP rates and get best prices for your produce at mandi.' : 'MSP दरें जानें और मंडी में अपनी उपज की सर्वोत्तम कीमत पाएं।',
      steps: [
        {
          title: lang === 'en' ? 'Understanding MSP' : 'MSP को समझना',
          content: lang === 'en'
            ? '📊 MSP = Minimum Support Price\n\nGovernment\'s guaranteed minimum price for your crops!\n\nFor 2024-25:\n• Wheat: ₹2,275/quintal\n• Paddy: ₹2,300/quintal\n• Mustard: ₹5,650/quintal\n• Chana: ₹5,440/quintal\n\n⚠️ NEVER sell below MSP! It\'s your legal right.'
            : '📊 MSP = न्यूनतम समर्थन मूल्य\n\nआपकी फसल के लिए सरकार की न्यूनतम कीमत गारंटी!\n\n2024-25 के लिए:\n• गेहूं: ₹2,275/क्विंटल\n• धान: ₹2,300/क्विंटल\n• सरसों: ₹5,650/क्विंटल\n• चना: ₹5,440/क्विंटल\n\n⚠️ MSP से कम कभी न बेचें! यह आपका कानूनी अधिकार है।'
        },
        {
          title: lang === 'en' ? 'Quiz: MSP Rate' : 'प्रश्नोत्तरी: MSP दर',
          question: lang === 'en' ? 'What is the MSP for wheat (2024-25)?' : 'गेहूं का MSP (2024-25) क्या है?',
          options: ['₹1,950', '₹2,100', '₹2,275', '₹2,500'],
          correct: 2
        },
        {
          title: lang === 'en' ? 'Using eNAM App' : 'eNAM ऐप का उपयोग',
          content: lang === 'en'
            ? '📱 eNAM = Electronic National Agricultural Market\n\nOne app, all mandi prices!\n\n1. Download "eNAM" from Play Store\n2. Select your state & commodity\n3. Compare prices across mandis\n4. Find best price nearby\n5. Sell online to traders in other states!\n\n💡 Tip: Check prices early morning before going to mandi'
            : '📱 eNAM = इलेक्ट्रॉनिक राष्ट्रीय कृषि बाजार\n\nएक ऐप, सभी मंडी की कीमतें!\n\n1. Play Store से "eNAM" डाउनलोड करें\n2. अपना राज्य और उपज चुनें\n3. मंडियों में कीमतों की तुलना करें\n4. पास में सबसे अच्छी कीमत खोजें\n5. दूसरे राज्यों के व्यापारियों को ऑनलाइन बेचें!\n\n💡 टिप: मंडी जाने से पहले सुबह जल्दी कीमतें चेक करें'
        },
        {
          title: lang === 'en' ? 'Getting Best Mandi Prices' : 'मंडी में सर्वोत्तम कीमत पाना',
          content: lang === 'en'
            ? '💰 Tips to Get Better Prices:\n\n1. Visit mandi on peak trading days (Wed-Fri)\n2. Clean and grade your produce\n3. Don\'t sell in distress immediately after harvest\n4. Avoid middlemen - sell directly\n5. Check weather before harvesting\n6. Store properly if prices are low\n\n📦 Good packaging = Higher prices!'
            : '💰 बेहतर कीमत पाने के टिप्स:\n\n1. व्यापार के चरम दिनों (बुध-शुक्र) को मंडी जाएं\n2. उपज साफ और श्रेणीबद्ध करें\n3. फसल के तुरंत बाद मजबूरी में न बेचें\n4. बिचौलियों से बचें - सीधे बेचें\n5. कटाई से पहले मौसम चेक करें\n6. कम कीमत हो तो उचित भंडारण करें\n\n📦 अच्छी पैकेजिंग = अधिक कीमत!'
        },
        {
          title: lang === 'en' ? 'Quiz: Selling Strategy' : 'प्रश्नोत्तरी: बिक्री रणनीति',
          question: lang === 'en' ? 'Which days are best for selling at mandi?' : 'मंडी में बेचने के लिए कौन से दिन सबसे अच्छे हैं?',
          options: lang === 'en' ? ['Monday-Tuesday', 'Wednesday-Friday', 'Saturday-Sunday', 'Any day'] : ['सोमवार-मंगलवार', 'बुधवार-शुक्रवार', 'शनिवार-रविवार', 'कोई भी दिन'],
          correct: 1
        },
        {
          title: lang === 'en' ? 'Join an FPO' : 'FPO में शामिल हों',
          content: lang === 'en'
            ? '🤝 FPO = Farmer Producer Organization\n\nWhy Join?\n• Better bargaining power (bulk selling)\n• Access to better markets\n• Lower input costs (buy seeds/fertilizer together)\n• Processing & storage facilities\n• Training & government scheme benefits\n\n📞 Contact local agriculture office for nearest FPO!'
            : '🤝 FPO = किसान उत्पादक संगठन\n\nक्यों जुड़ें?\n• बेहतर सौदेबाजी शक्ति (थोक बिक्री)\n• बेहतर बाजारों तक पहुंच\n• कम इनपुट लागत (बीज/खाद साथ खरीदें)\n• प्रसंस्करण और भंडारण सुविधाएं\n• प्रशिक्षण और सरकारी योजना लाभ\n\n📞 निकटतम FPO के लिए स्थानीय कृषि कार्यालय से संपर्क करें!'
        },
        {
          title: lang === 'en' ? 'Quiz: FPO Benefits' : 'प्रश्नोत्तरी: FPO लाभ',
          question: lang === 'en' ? 'What is the main benefit of joining an FPO?' : 'FPO में शामिल होने का मुख्य लाभ क्या है?',
          options: lang === 'en' ? ['Free seeds', 'Better bargaining power', 'Free tractors', 'No work needed'] : ['मुफ्त बीज', 'बेहतर सौदेबाजी शक्ति', 'मुफ्त ट्रैक्टर', 'काम की जरूरत नहीं'],
          correct: 1
        }
      ]
    },
    {
      id: 6,
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
      duration: '7 min',
      title: lang === 'en' ? 'Fraud Prevention 101' : 'धोखाधड़ी से बचाव 101',
      desc: lang === 'en' ? 'Identify and avoid common scams targeting farmers.' : 'किसानों को लक्षित करने वाली सामान्य धोखाधड़ी पहचानें और बचें।',
      steps: [
        {
          title: lang === 'en' ? 'Common Scams' : 'सामान्य धोखाधड़ी',
          content: lang === 'en'
            ? '🚨 Common Frauds Targeting Farmers:\n\n1. "PM Kisan bonus" - Pay ₹500 to get ₹10,000 (FAKE!)\n2. "KYC verification" calls asking for OTP\n3. Fake loan apps promising instant loans\n4. "You won lottery" messages\n5. Cheap seed/fertilizer sellers (fake products)\n\n⚠️ If it sounds too good to be true, it IS fake!'
            : '🚨 किसानों को निशाना बनाने वाली धोखाधड़ी:\n\n1. "PM किसान बोनस" - ₹500 दें, ₹10,000 पाएं (फर्जी!)\n2. OTP मांगने वाले "KYC वेरिफिकेशन" कॉल\n3. तुरंत लोन का वादा करने वाले फर्जी ऐप\n4. "आपने लॉटरी जीती" संदेश\n5. सस्ते बीज/खाद बेचने वाले (नकली उत्पाद)\n\n⚠️ अगर कुछ सच होने के लिए बहुत अच्छा लगे, तो वह फर्जी है!'
        },
        {
          title: lang === 'en' ? 'Quiz: Identifying Scams' : 'प्रश्नोत्तरी: धोखाधड़ी पहचान',
          question: lang === 'en' ? 'You get SMS: "Pay ₹500 to get ₹10,000 PM Kisan bonus". What is this?' : 'SMS आया: "₹500 दें, ₹10,000 PM किसान बोनस पाएं"। यह क्या है?',
          options: lang === 'en' ? ['Real government scheme', 'Bank offer', 'Fraud/Scam', 'Insurance benefit'] : ['असली सरकारी योजना', 'बैंक ऑफर', 'धोखाधड़ी', 'बीमा लाभ'],
          correct: 2
        },
        {
          title: lang === 'en' ? 'Never Share These!' : 'ये कभी साझा न करें!',
          content: lang === 'en'
            ? '🔐 GOLDEN RULES - NEVER Share:\n\n❌ Bank OTP (One Time Password)\n❌ UPI PIN (4/6 digit PIN)\n❌ Debit/Credit Card CVV (3 digits on back)\n❌ Online banking password\n❌ Aadhaar OTP\n\n📱 Remember: Banks NEVER call asking for these!\n\n✅ Safe to share: Account number, UPI ID, IFSC code'
            : '🔐 सुनहरे नियम - कभी साझा न करें:\n\n❌ बैंक OTP (वन टाइम पासवर्ड)\n❌ UPI पिन (4/6 अंक का पिन)\n❌ डेबिट/क्रेडिट कार्ड CVV (पीछे के 3 अंक)\n❌ ऑनलाइन बैंकिंग पासवर्ड\n❌ आधार OTP\n\n📱 याद रखें: बैंक कभी ये नहीं मांगते!\n\n✅ साझा करना सुरक्षित: खाता नंबर, UPI ID, IFSC कोड'
        },
        {
          title: lang === 'en' ? 'Red Flags to Watch' : 'खतरे के संकेत',
          content: lang === 'en'
            ? '🚩 Warning Signs of Fraud:\n\n1. Urgency: "Do it NOW or account blocked!"\n2. Too good: "Free money/prizes without reason"\n3. Unknown links: "Click here to claim"\n4. Upfront payment: "Pay ₹XX to get ₹XXXX"\n5. Personal info requests over phone\n6. Pressure to install apps\n\n🛑 When in doubt, hang up and call your bank directly!'
            : '🚩 धोखाधड़ी के चेतावनी संकेत:\n\n1. जल्दबाजी: "अभी करें वरना खाता बंद!"\n2. बहुत अच्छा: "बिना कारण मुफ्त पैसा/इनाम"\n3. अज्ञात लिंक: "क्लेम करने के लिए क्लिक करें"\n4. अग्रिम भुगतान: "₹XX दें, ₹XXXX पाएं"\n5. फोन पर व्यक्तिगत जानकारी की मांग\n6. ऐप इंस्टॉल करने का दबाव\n\n🛑 संदेह हो तो फोन काटें और सीधे बैंक को कॉल करें!'
        },
        {
          title: lang === 'en' ? 'Quiz: Safe Practice' : 'प्रश्नोत्तरी: सुरक्षित अभ्यास',
          question: lang === 'en' ? 'Someone calls saying "verify your KYC or account will be blocked". What should you do?' : 'कोई कॉल करके कहता है "KYC वेरिफाई करें वरना खाता बंद होगा"। क्या करें?',
          options: lang === 'en' ? ['Share OTP to verify', 'Give Aadhaar details', 'Hang up and call bank directly', 'Visit their office'] : ['वेरिफाई करने के लिए OTP दें', 'आधार विवरण दें', 'फोन काटें और सीधे बैंक को कॉल करें', 'उनके कार्यालय जाएं'],
          correct: 2
        },
        {
          title: lang === 'en' ? 'What to Do if Scammed' : 'धोखा होने पर क्या करें',
          content: lang === 'en'
            ? '🆘 Immediate Steps if Fraud Happens:\n\n1. Call bank IMMEDIATELY → Block card/account\n2. Call 1930 (National Cyber Crime Helpline)\n3. Report at cybercrime.gov.in\n4. Visit nearest police station\n5. Keep all proof (SMS, call logs, screenshots)\n\n⏰ Act within 24 hours for best chance of recovery!\n\n📝 Write down fraud number and details'
            : '🆘 धोखाधड़ी होने पर तुरंत कदम:\n\n1. तुरंत बैंक को कॉल करें → कार्ड/खाता ब्लॉक करें\n2. 1930 कॉल करें (राष्ट्रीय साइबर अपराध हेल्पलाइन)\n3. cybercrime.gov.in पर रिपोर्ट करें\n4. नजदीकी पुलिस स्टेशन जाएं\n5. सभी सबूत रखें (SMS, कॉल लॉग, स्क्रीनशॉट)\n\n⏰ रिकवरी के लिए 24 घंटे में कार्रवाई करें!\n\n📝 धोखेबाज का नंबर और विवरण लिखें'
        },
        {
          title: lang === 'en' ? 'Quiz: Emergency Action' : 'प्रश्नोत्तरी: आपातकालीन कार्रवाई',
          question: lang === 'en' ? 'What is the national cyber crime helpline number?' : 'राष्ट्रीय साइबर अपराध हेल्पलाइन नंबर क्या है?',
          options: ['100', '108', '1930', '1800'],
          correct: 2
        }
      ]
    }
  ];

  const handleStartLesson = (lesson) => {
    // Get theory steps (steps without questions)
    const theorySteps = lesson.steps.filter(step => !step.question);
    
    // Get random questions from question bank (select 3 random questions)
    const lessonQuestions = questionBanks[lesson.id] || [];
    const shuffledQuestions = shuffleArray(lessonQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, 3).map((q, idx) => ({
      title: lang === 'en' ? `Quiz ${idx + 1}` : `प्रश्नोत्तरी ${idx + 1}`,
      question: q.question,
      options: q.options,
      correct: q.correct
    }));
    
    // Create lesson with theory first, then randomized quiz questions
    const lessonWithRandomQuestions = {
      ...lesson,
      steps: [...theorySteps, ...selectedQuestions]
    };
    
    setSelectedLesson(lessonWithRandomQuestions);
    setActiveLesson(lessonWithRandomQuestions);
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setLessonSaved(false);
  };

  const handleAnswer = (stepIndex, answerIndex) => {
    if (hasAnswered) return; // Prevent changing answer after submission
    
    setAnswers(prev => ({ ...prev, [stepIndex]: answerIndex }));
    setHasAnswered(true);
    
    // Show immediate feedback
    const step = selectedLesson.steps[stepIndex];
    const isCorrect = answerIndex === step.correct;
    setAnswerFeedback({
      correct: isCorrect,
      correctAnswer: step.correct,
      selectedAnswer: answerIndex
    });
  };

  const handleNextStep = () => {
    // Reset feedback for next question
    setAnswerFeedback(null);
    setHasAnswered(false);
    
    if (currentStep < selectedLesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateScore = () => {
    const quizSteps = selectedLesson.steps.filter(step => step.question);
    const correctAnswers = quizSteps.filter((step, idx) => {
      const stepIndex = selectedLesson.steps.indexOf(step);
      return answers[stepIndex] === step.correct;
    }).length;
    return Math.round((correctAnswers / quizSteps.length) * 100);
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
    setHasAnswered(false);
    setAnswerFeedback(null);
    setLessonSaved(false);
  };

  const [lessonSaved, setLessonSaved] = useState(false);

  // Save lesson when results are shown
  useEffect(() => {
    if (showResults && selectedLesson && !lessonSaved) {
      const score = calculateScore();
      markLessonComplete(selectedLesson.id, score);
      setLessonSaved(true);
    }
  }, [showResults, selectedLesson, lessonSaved]);

  if (selectedLesson) {
    const step = selectedLesson.steps[currentStep];
    const progress = ((currentStep + 1) / selectedLesson.steps.length) * 100;

    if (showResults) {
      const score = calculateScore();
      const hasWrongAnswers = score < 100;
      const newBadgesEarned = badges.filter(b => {
        const earnedDate = new Date(b.earnedAt);
        const now = new Date();
        return now - earnedDate < 5000; // Badges earned in last 5 seconds
      });
      
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-8 text-center shadow-[var(--shadow-card)]">
            <div className={`w-24 h-24 rounded-full ${selectedLesson.bgColor} flex items-center justify-center mx-auto mb-6`}>
              {score >= 70 ? <CheckCircle size={48} className="text-green-600" /> : <XCircle size={48} className="text-orange-600" />}
            </div>
            <h2 className="text-3xl font-bold text-[var(--text-main)] mb-2">
              {score >= 70 ? (lang === 'en' ? 'Excellent!' : 'शानदार!') : (lang === 'en' ? 'Good Try!' : 'अच्छा प्रयास!')}
            </h2>
            <p className="text-5xl font-bold text-[var(--primary)] mb-2">{score}%</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              {lang === 'en' ? `${selectedLesson.steps.filter(s => s.question).length} questions answered` : `${selectedLesson.steps.filter(s => s.question).length} प्रश्नों के उत्तर दिए`}
            </p>
            
            {/* New Badges Earned */}
            {newBadgesEarned.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-500">
                <p className="font-bold text-lg mb-3 text-yellow-800 dark:text-yellow-300">
                  🎉 {lang === 'en' ? 'New Badge Earned!' : 'नया बैज मिला!'}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {newBadgesEarned.map(badge => (
                    <div key={badge.id} className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                      <span className="text-4xl mb-1">{badge.icon}</span>
                      <span className="font-bold text-sm text-[var(--text-main)]">{badge.name}</span>
                      <span className="text-xs text-[var(--text-muted)]">{badge.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-[var(--bg-input)] p-4 rounded-xl mb-6 border border-[var(--border)]">
              <div className="flex items-center justify-center gap-2 text-[var(--success)]">
                <CheckCircle size={18} />
                <span className="font-medium">{lang === 'en' ? 'Progress saved!' : 'प्रगति सहेजी गई!'}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedLesson(null)}
                className="flex-1 py-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] font-bold hover:bg-[var(--bg-glass)] transition-colors"
              >
                {lang === 'en' ? 'Back to Lessons' : 'पाठों पर वापस'}
              </button>
              {hasWrongAnswers && (
                <button
                  onClick={resetQuiz}
                  className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                >
                  {lang === 'en' ? 'Retry Quiz' : 'पुनः प्रयास'} 🔄
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => setSelectedLesson(null)}
          className="mb-4 flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
        >
          <ChevronDown className="rotate-90" size={18} />
          {lang === 'en' ? 'Back to lessons' : 'पाठों पर वापस'}
        </button>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-[var(--text-muted)] mb-2">
            <span>{selectedLesson.title}</span>
            <span>{currentStep + 1} / {selectedLesson.steps.length}</span>
          </div>
          <div className="h-2 bg-[var(--bg-input)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)] mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4">{step.title}</h2>
          
          {step.question ? (
            // Quiz Step
            <div>
              <p className="text-lg text-[var(--text-main)] mb-6">{step.question}</p>
              <div className="space-y-3">
                {step.options.map((option, idx) => {
                  const isSelected = answers[currentStep] === idx;
                  const isCorrect = idx === step.correct;
                  const showFeedback = answerFeedback && hasAnswered;
                  
                  let buttonClass = 'w-full p-4 rounded-xl text-left transition-all ';
                  if (showFeedback) {
                    if (isSelected && answerFeedback.correct) {
                      buttonClass += 'bg-green-500 text-white border-2 border-green-500';
                    } else if (isSelected && !answerFeedback.correct) {
                      buttonClass += 'bg-red-500 text-white border-2 border-red-500';
                    } else if (isCorrect && !answerFeedback.correct) {
                      buttonClass += 'bg-green-100 text-green-700 border-2 border-green-500';
                    } else {
                      buttonClass += 'bg-[var(--bg-input)] text-[var(--text-muted)] border-2 border-[var(--border)] opacity-50';
                    }
                  } else if (isSelected) {
                    buttonClass += 'bg-[var(--primary)] text-white border-2 border-[var(--primary)]';
                  } else {
                    buttonClass += 'bg-[var(--bg-input)] text-[var(--text-main)] border-2 border-[var(--border)] hover:border-[var(--primary)]';
                  }
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(currentStep, idx)}
                      disabled={hasAnswered}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          showFeedback && isCorrect 
                            ? 'border-green-700 bg-green-700'
                            : showFeedback && isSelected && !answerFeedback.correct
                            ? 'border-red-700 bg-red-700'
                            : isSelected && !showFeedback
                            ? 'border-white bg-white'
                            : 'border-[var(--text-muted)]'
                        }`}>
                          {showFeedback && isCorrect && <Check size={16} className="text-white" />}
                          {showFeedback && isSelected && !answerFeedback.correct && <X size={16} className="text-white" />}
                          {isSelected && !showFeedback && <Check size={16} className="text-[var(--primary)]" />}
                        </div>
                        <span className="font-medium flex-1">{option}</span>
                        {showFeedback && isCorrect && !isSelected && (
                          <span className="text-xs font-bold text-green-700">{lang === 'en' ? 'Correct Answer' : 'सही उत्तर'}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Feedback Message */}
              {answerFeedback && (
                <div className={`mt-4 p-4 rounded-xl ${answerFeedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {answerFeedback.correct ? (
                      <><CheckCircle size={20} /> {lang === 'en' ? 'Correct!' : 'सही!'}</>
                    ) : (
                      <><XCircle size={20} /> {lang === 'en' ? 'Incorrect' : 'गलत'}</>
                    )}
                  </div>
                  {!answerFeedback.correct && (
                    <p className="text-sm">
                      {lang === 'en' ? 'The correct answer is shown in green above.' : 'सही उत्तर ऊपर हरे रंग में दिखाया गया है।'}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Content Step
            <div className="prose prose-invert max-w-none">
              <p className="text-[var(--text-muted)] text-lg leading-relaxed whitespace-pre-line">{step.content}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] font-medium hover:bg-[var(--bg-glass)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {lang === 'en' ? 'Previous' : 'पिछला'}
          </button>
          <button
            onClick={handleNextStep}
            disabled={step.question && !hasAnswered}
            className="flex-1 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === selectedLesson.steps.length - 1
              ? (lang === 'en' ? 'Finish' : 'समाप्त करें')
              : (lang === 'en' ? 'Next' : 'अगला')}
          </button>
        </div>
      </div>
    );
  }

  // Lesson Grid
  const completedCount = lessons.filter(l => getLessonCompletion(l.id)).length;
  const totalLessons = lessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Find lesson in progress (started but not completed)
  const inProgressLesson = lessons.find(l => {
    const completion = getLessonCompletion(l.id);
    return completion && completion.score < 100;
  });

  return (
    <div className="w-full md:max-w-5xl md:mx-auto space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">{t('nav_seekho')}</h2>
        <p className="text-[var(--text-muted)]">{lang === 'en' ? 'Interactive lessons on farming, finance, and schemes' : 'खेती, वित्त और योजनाओं पर इंटरैक्टिव पाठ'}</p>
      </div>

      {/* Continue Learning - Show if there's a lesson in progress */}
      {inProgressLesson && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <PlayCircle size={18} className="shrink-0" />
                <span className="text-xs md:text-sm font-medium uppercase tracking-wide">{lang === 'en' ? 'Continue Learning' : 'सीखना जारी रखें'}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-1 truncate">{lang === 'en' ? inProgressLesson.nameEn : inProgressLesson.nameHi}</h3>
              <p className="text-xs md:text-sm opacity-90">{lang === 'en' ? `${getLessonCompletion(inProgressLesson.id).score}% complete` : `${getLessonCompletion(inProgressLesson.id).score}% पूर्ण`}</p>
            </div>
            <button
              onClick={() => handleStartLesson(inProgressLesson)}
              className="px-4 md:px-6 py-2 md:py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-opacity-90 transition-colors text-sm md:text-base shrink-0"
            >
              {lang === 'en' ? 'Resume' : 'शुरू'}
            </button>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-blue-600 rounded-2xl p-4 md:p-6 text-white">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div>
            <h3 className="text-lg font-bold">{lang === 'en' ? 'Your Progress' : 'आपकी प्रगति'}</h3>
            <p className="text-sm opacity-80">{lang === 'en' ? `${completedCount} of ${totalLessons} lessons completed` : `${totalLessons} में से ${completedCount} पाठ पूर्ण`}</p>
          </div>
          <div className="text-3xl font-bold">{progressPercent}%</div>
        </div>
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {completedCount === totalLessons && (
          <div className="mt-3 flex items-center gap-2 text-yellow-200">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-medium">{lang === 'en' ? 'All lessons completed! Great job!' : 'सभी पाठ पूर्ण! शाबाश!'}</span>
          </div>
        )}
      </div>
      
      {/* Badges Section */}
      {badges.length > 0 && (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 mb-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🏆</span>
            <h3 className="text-lg font-bold text-[var(--text-main)]">
              {lang === 'en' ? 'Your Badges' : 'आपके बैज'} ({badges.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {badges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center p-3 bg-[var(--bg-input)] rounded-xl hover:bg-[var(--bg-glass)] transition-colors">
                <span className="text-4xl mb-2">{badge.icon}</span>
                <span className="font-bold text-xs text-center text-[var(--text-main)]">{badge.name}</span>
                <span className="text-[10px] text-center text-[var(--text-muted)] mt-1">{badge.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => {
          const Icon = lesson.icon;
          const completion = getLessonCompletion(lesson.id);
          return (
            <div 
              key={lesson.id}
              onClick={() => handleStartLesson(lesson)}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)] hover:shadow-xl hover:border-[var(--primary)] transition-all cursor-pointer group"
            >
              <div className={`h-40 ${lesson.bgColor} relative flex items-center justify-center`}>
                <Icon size={64} className={`${lesson.iconColor} opacity-80 group-hover:scale-110 transition-transform duration-500`} />
                {completion && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                    <CheckCircle size={12} />
                    {completion.score}%
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <Clock size={12} />
                  {lesson.duration}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-[var(--text-main)]">{lesson.title}</h3>
                  {completion && <CheckCircle size={18} className="text-green-500" />}
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">{lesson.desc}</p>
                <button className="w-full py-2 rounded-lg bg-[var(--bg-input)] text-[var(--primary)] font-bold text-sm group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  {completion ? (lang === 'en' ? 'Review Lesson' : 'पाठ दोहराएं') : t('start_lesson')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: AUTH (LOGIN / SIGNUP)
 * ==========================================================================================
 */
function AuthView({ onLogin, t, lang, toggleLang }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Persistence logic
      if (rememberMe) {
        localStorage.setItem('remember_email', email);
        await setPersistence(auth, browserLocalPersistence);
      } else {
        localStorage.removeItem('remember_email');
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin(); 
    } catch (err) {
      console.error(err);
      setError(
        err.code === 'auth/invalid-credential' ? 'Invalid email or password.' :
        err.code === 'auth/email-already-in-use' ? 'Email already used.' :
        err.code === 'auth/weak-password' ? 'Password too weak.' :
        'Authentication failed. Try again.'
      );
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (err) {
      console.error(err);
      setError('Google Sign-In failed.');
    }
  };

  const handleForgotPass = async () => {
    if (!email) {
      setError('Please enter your email first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[var(--bg-main)]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--primary)]/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--secondary)]/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm md:max-w-md glass p-6 md:p-8 rounded-3xl relative z-10 animate-in zoom-in duration-500 shadow-2xl shadow-cyan-500/10">
        {/* Logo & Title */}
        <div className="text-center mb-6">
           <img src="/favicon.svg" alt="Gramin Saathi" className="w-16 h-16 mx-auto rounded-2xl mb-3 shadow-lg shadow-white/20" />
           <p className="text-[var(--text-muted)] text-sm">Gramin Saathi</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-[var(--bg-input)] rounded-xl p-1 border border-[var(--border)]">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              isLogin 
                ? 'bg-[var(--primary)] text-white shadow-md' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {lang === 'en' ? 'Login' : 'लॉगिन'}
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              !isLogin 
                ? 'bg-[var(--primary)] text-white shadow-md' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {lang === 'en' ? 'Sign Up' : 'साइन अप'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm text-center">
            {t('reset_sent')}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
             <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">
               {lang === 'en' ? 'Email' : 'ईमेल'}
             </label>
             <input 
               type="email" 
               required
               autoComplete="email"
               value={email}
               onChange={e => setEmail(e.target.value)}
               className="w-full p-3.5 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all outline-none text-sm"
               placeholder="name@example.com"
             />
          </div>

          <div className="space-y-1 relative">
             <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">
               {lang === 'en' ? 'Password' : 'पासवर्ड'}
             </label>
             <input 
               type={showPass ? "text" : "password"} 
               required
               autoComplete={isLogin ? "current-password" : "new-password"}
               value={password}
               onChange={e => setPassword(e.target.value)}
               className="w-full p-3.5 pr-12 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all outline-none text-sm"
               placeholder="••••••••"
             />
             <button 
               type="button" 
               onClick={() => setShowPass(!showPass)}
               className="absolute right-3 top-8 text-[var(--text-muted)] hover:text-[var(--text-main)] p-1"
             >
               {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
             </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg-input)] accent-[var(--primary)]"
              />
              {lang === 'en' ? 'Remember Me' : 'याद रखें'}
            </label>
            {isLogin && (
              <button type="button" onClick={handleForgotPass} className="text-[var(--primary)] hover:underline font-medium text-xs">
                {lang === 'en' ? 'Forgot Password?' : 'पासवर्ड भूल गए?'}
              </button>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 btn-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-bold transition-all"
          >
            {loading ? <Loader className="animate-spin mx-auto" size={20}/> : (isLogin ? (lang === 'en' ? 'Login' : 'लॉगिन करें') : (lang === 'en' ? 'Create Account' : 'खाता बनाएं'))}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-[1px] bg-[var(--border)] flex-1" />
          <span className="text-xs text-[var(--text-muted)] uppercase">{lang === 'en' ? 'OR' : 'या'}</span>
          <div className="h-[1px] bg-[var(--border)] flex-1" />
        </div>

        <button 
          onClick={handleGoogle} 
          className="w-full py-3 bg-[var(--bg-input)] border border-[var(--border)] rounded-xl text-[var(--text-main)] font-medium hover:bg-[var(--bg-card-hover)] hover:border-[var(--primary)] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Chrome size={18} />
          {lang === 'en' ? 'Continue with Google' : 'Google से जारी रखें'}
        </button>

        {/* Language Toggle */}
        <div className="mt-5 text-center">
          <button onClick={toggleLang} className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
            {lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ==========================================================================================
 * VIEW: ONBOARDING
 * ==========================================================================================
 */
function OnboardingView({ user, db, appId, onComplete, t, lang, toggleLang }) {
  const [formData, setFormData] = useState({ name: '', village: '', crop: '', language: lang });
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1); // Multi-step onboarding

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      alert(lang === 'en' ? "No user logged in. Please log in again." : "कोई उपयोगकर्ता लॉग इन नहीं है।");
      return;
    }
    if (!formData.name.trim()) {
      alert(lang === 'en' ? "Please enter your name." : "कृपया अपना नाम दर्ज करें।");
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main'), {
        ...formData,
        name: formData.name.trim(),
        village: formData.village.trim(),
        joinedAt: serverTimestamp(),
        financialScore: 50
      });
      onComplete();
    } catch (err) {
      console.error("Save failed", err);
      alert(lang === 'en' ? "Failed to save profile. Check your internet connection." : "प्रोफ़ाइल सहेजने में विफल। इंटरनेट कनेक्शन जांचें।");
    }
    setSaving(false);
  };

  const features = [
    { icon: Wallet, title: lang === 'en' ? 'Track Finances' : 'वित्त ट्रैक करें', desc: lang === 'en' ? 'Record income & expenses easily' : 'आय और खर्च आसानी से रिकॉर्ड करें' },
    { icon: ShieldCheck, title: lang === 'en' ? 'Govt Schemes' : 'सरकारी योजनाएं', desc: lang === 'en' ? 'Find schemes you qualify for' : 'योग्य योजनाएं खोजें' },
    { icon: Sprout, title: lang === 'en' ? 'AI Assistant' : 'AI सहायक', desc: lang === 'en' ? 'Get farming advice in your language' : 'अपनी भाषा में खेती की सलाह पाएं' },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[var(--bg-main)]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary)]/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm md:max-w-md glass p-5 md:p-8 rounded-3xl relative z-10 animate-in zoom-in duration-500 shadow-2xl shadow-cyan-500/10">
        
        {/* Step 1: Welcome & Features */}
        {step === 1 && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center mb-5">
              <img src="/favicon.svg" alt="Gramin Saathi" className="w-16 h-16 mx-auto rounded-2xl mb-3 shadow-lg shadow-white/20" />
              <h1 className="text-xl md:text-2xl font-bold text-[var(--text-main)] mb-1">
                {lang === 'en' ? 'Welcome to Gramin Saathi' : 'ग्रामीण साथी में आपका स्वागत है'}
              </h1>
              <p className="text-[var(--primary)] text-xs">
                {lang === 'en' ? 'Your Village Financial Partner' : 'आपका ग्रामीण वित्तीय साथी'}
              </p>
            </div>

            <div className="space-y-3 mb-5">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)]">
                  <div className="p-2 rounded-lg bg-[var(--primary)]/10">
                    <feature.icon size={18} className="text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[var(--text-main)]">{feature.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-3.5 btn-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold flex items-center justify-center gap-2"
            >
              {lang === 'en' ? 'Get Started' : 'शुरू करें'}
              <ArrowRight size={18} />
            </button>

            <div className="mt-4 text-center">
              <button onClick={toggleLang} className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                {lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Profile Form */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mb-3">
                <User size={24} className="text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[var(--text-main)] mb-1">
                {lang === 'en' ? 'Create Your Profile' : 'अपनी प्रोफ़ाइल बनाएं'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {lang === 'en' ? 'Help us personalize your experience' : 'हमें आपके अनुभव को बेहतर बनाने में मदद करें'}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5 flex items-center gap-1.5">
                  <User size={12} />
                  {lang === 'en' ? 'Your Name' : 'आपका नाम'}
                </label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all outline-none text-sm"
                  placeholder={lang === 'en' ? 'Ram Kumar' : 'राम कुमार'}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5 flex items-center gap-1.5">
                  <MapPin size={12} />
                  {lang === 'en' ? 'Village / Town' : 'गाँव / शहर'}
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all outline-none text-sm"
                  placeholder={lang === 'en' ? 'Rampur' : 'रामपुर'}
                  value={formData.village}
                  onChange={e => setFormData({...formData, village: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5 flex items-center gap-1.5">
                  <Sprout size={12} />
                  {lang === 'en' ? 'Main Occupation' : 'मुख्य व्यवसाय'}
                </label>
                <select 
                  className="w-full p-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all outline-none appearance-none text-sm"
                  value={formData.crop}
                  onChange={e => setFormData({...formData, crop: e.target.value})}
                >
                  <option value="">{lang === 'en' ? 'Select...' : 'चुनें...'}</option>
                  <option value="wheat">{lang === 'en' ? '🌾 Wheat Farming' : '🌾 गेहूँ की खेती'}</option>
                  <option value="rice">{lang === 'en' ? '🌾 Rice Farming' : '🌾 धान की खेती'}</option>
                  <option value="sugarcane">{lang === 'en' ? '🎋 Sugarcane' : '🎋 गन्ना'}</option>
                  <option value="vegetables">{lang === 'en' ? '🥬 Vegetables' : '🥬 सब्जियाँ'}</option>
                  <option value="fruits">{lang === 'en' ? '🍎 Fruits' : '🍎 फल'}</option>
                  <option value="dairy">{lang === 'en' ? '🐄 Dairy / Cattle' : '🐄 डेयरी / पशुपालन'}</option>
                  <option value="shop">{lang === 'en' ? '🏪 Shop / Business' : '🏪 दुकान / व्यापार'}</option>
                  <option value="labor">{lang === 'en' ? '👷 Labor / Job' : '👷 मजदूरी / नौकरी'}</option>
                  <option value="other">{lang === 'en' ? '📦 Other' : '📦 अन्य'}</option>
                </select>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-muted)] font-bold text-sm hover:bg-[var(--bg-card-hover)] transition-colors"
                >
                  {lang === 'en' ? 'Back' : 'वापस'}
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 py-3 btn-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-bold text-sm"
                >
                  {saving ? <Loader className="animate-spin" size={16} /> : <Check size={16} />}
                  {saving ? (lang === 'en' ? 'Saving...' : 'सहेज रहे...') : (lang === 'en' ? 'Complete Setup' : 'सेटअप पूरा करें')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


/**
 * ==========================================================================================
 * VIEW: MANDI (Live Market Prices from data.gov.in API)
 * ==========================================================================================
 */
const MANDI_API_KEY = '579b464db66ec23bdd000001537296c028f644834571355eb1d14653';
const MANDI_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

function MandiView({ lang }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [states, setStates] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Fetch mandi prices with pagination
  const fetchMandiPrices = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      let url = `${MANDI_API_URL}?api-key=${MANDI_API_KEY}&format=json&limit=${ITEMS_PER_PAGE}&offset=${offset}`;
      
      if (selectedState) {
        url += `&filters[state]=${encodeURIComponent(selectedState)}`;
      }
      if (selectedCommodity) {
        url += `&filters[commodity]=${encodeURIComponent(selectedCommodity)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch mandi prices');
      
      const data = await response.json();
      
      if (data.records && data.records.length > 0) {
        setPrices(data.records);
        setTotalRecords(data.total || data.count || 1000);
        
        // Fetch all unique states and commodities only on first load
        if (page === 1 && !selectedState && !selectedCommodity) {
          // Fetch a larger set just for filter options
          const filterUrl = `${MANDI_API_URL}?api-key=${MANDI_API_KEY}&format=json&limit=500`;
          const filterRes = await fetch(filterUrl);
          const filterData = await filterRes.json();
          if (filterData.records) {
            const uniqueStates = [...new Set(filterData.records.map(r => r.state))].sort();
            const uniqueCommodities = [...new Set(filterData.records.map(r => r.commodity))].sort();
            setStates(uniqueStates);
            setCommodities(uniqueCommodities);
          }
        }
        
        setLastUpdated(new Date());
      } else {
        setPrices([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error('Mandi API error:', err);
      setError(lang === 'en' ? 'Failed to load market prices. Please try again.' : 'बाजार भाव लोड करने में विफल। कृपया पुनः प्रयास करें।');
    }
    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMandiPrices(1);
  }, [selectedState, selectedCommodity]);

  useEffect(() => {
    fetchMandiPrices(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Filter prices by search query
  const filteredPrices = prices.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.commodity?.toLowerCase().includes(query) ||
      p.market?.toLowerCase().includes(query) ||
      p.district?.toLowerCase().includes(query) ||
      p.state?.toLowerCase().includes(query)
    );
  });

  // Common commodities in Hindi
  const commodityTranslations = {
    'Wheat': 'गेहूं',
    'Rice': 'चावल',
    'Paddy': 'धान',
    'Maize': 'मक्का',
    'Potato': 'आलू',
    'Onion': 'प्याज',
    'Tomato': 'टमाटर',
    'Mustard': 'सरसों',
    'Gram': 'चना',
    'Soyabean': 'सोयाबीन',
    'Cotton': 'कपास',
    'Sugarcane': 'गन्ना'
  };

  const translateCommodity = (name) => {
    if (lang === 'en') return name;
    return commodityTranslations[name] || name;
  };

  return (
    <div className="w-full md:max-w-4xl md:mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 md:p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Store size={28} />
              {lang === 'en' ? 'Mandi Prices' : 'मंडी भाव'}
            </h2>
            <p className="opacity-90 text-sm">
              {lang === 'en' ? 'Live commodity prices from Indian markets' : 'भारतीय बाजारों से जीवित वस्तु भाव'}
            </p>
          </div>
          <button
            onClick={fetchMandiPrices}
            disabled={loading}
            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <Loader size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        {lastUpdated && (
          <p className="text-xs opacity-70 mt-2">
            {lang === 'en' ? 'Last updated:' : 'अंतिम अपडेट:'} {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search commodity, market, district...' : 'वस्तु, बाजार, जिला खोजें...'}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="flex-1 min-w-[150px] p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] text-sm"
          >
            <option value="">{lang === 'en' ? 'All States' : 'सभी राज्य'}</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="flex-1 min-w-[150px] p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-main)] text-sm"
          >
            <option value="">{lang === 'en' ? 'All Commodities' : 'सभी वस्तुएं'}</option>
            {commodities.map(c => <option key={c} value={c}>{translateCommodity(c)}</option>)}
          </select>

          {(selectedState || selectedCommodity || searchQuery) && (
            <button
              onClick={() => { setSelectedState(''); setSelectedCommodity(''); setSearchQuery(''); }}
              className="px-4 py-3 rounded-xl bg-red-100 text-red-600 text-sm font-bold hover:bg-red-200 transition-colors"
            >
              {lang === 'en' ? 'Clear' : 'साफ़'}
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-[var(--bg-glass)] rounded" />
                  <div className="h-4 w-48 bg-[var(--bg-glass)] rounded" />
                </div>
                <div className="text-right space-y-2">
                  <div className="h-6 w-24 bg-[var(--bg-glass)] rounded" />
                  <div className="h-3 w-16 bg-[var(--bg-glass)] rounded ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPrices.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <Store size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">{lang === 'en' ? 'No prices found' : 'कोई भाव नहीं मिला'}</p>
          <p className="text-sm mt-1">{lang === 'en' ? 'Try different filters' : 'अलग फ़िल्टर आज़माएं'}</p>
        </div>
      ) : (
        /* Price Cards */
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-muted)]">
            {lang === 'en' ? `Showing ${filteredPrices.length} results` : `${filteredPrices.length} परिणाम दिखा रहे हैं`}
          </p>
          
          {filteredPrices.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 hover:border-amber-500/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--text-main)] text-lg">
                    {translateCommodity(item.commodity)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-amber-500" />
                      {item.market}
                    </span>
                    <span>•</span>
                    <span>{item.district}, {item.state}</span>
                  </div>
                  {item.variety && item.variety !== 'Other' && (
                    <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md">
                      {item.variety}
                    </span>
                  )}
                </div>
                
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-[var(--success)]">
                    ₹{Number(item.modal_price || item.max_price || 0).toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {lang === 'en' ? 'per quintal' : 'प्रति क्विंटल'}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                    <span className="text-green-600">₹{item.min_price}</span>
                    <span>-</span>
                    <span className="text-red-600">₹{item.max_price}</span>
                  </div>
                </div>
              </div>
              
              {item.arrival_date && (
                <p className="text-xs text-[var(--text-muted)] mt-2 pt-2 border-t border-[var(--border)]">
                  {lang === 'en' ? 'Date:' : 'तारीख:'} {item.arrival_date}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && prices.length > 0 && (
        <div className="flex items-center justify-center gap-3 py-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              currentPage === 1 
                ? 'bg-[var(--bg-glass)] text-[var(--text-muted)] cursor-not-allowed' 
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            <ChevronLeft size={18} />
            {lang === 'en' ? 'Prev' : 'पिछला'}
          </button>
          
          <div className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-main)] font-medium">
            {lang === 'en' 
              ? `Page ${currentPage} of ${totalPages}` 
              : `पेज ${currentPage} / ${totalPages}`
            }
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              currentPage >= totalPages 
                ? 'bg-[var(--bg-glass)] text-[var(--text-muted)] cursor-not-allowed' 
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {lang === 'en' ? 'Next' : 'अगला'}
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Data Source */}
      <div className="text-center text-xs text-[var(--text-muted)] p-4">
        {lang === 'en' ? 'Data source: ' : 'डेटा स्रोत: '}
        <a 
          href="https://data.gov.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-amber-600 hover:underline"
        >
          data.gov.in
        </a>
      </div>
    </div>
  );
}


/**
 * ==========================================================================================
 * VIEW: PROFILE
 * ==========================================================================================
 */
function ProfileView({ user, profile, db, appId, t, loadProfile, lang, fontSize, changeFontSize }) {
  const [badges, setBadges] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [financialScore, setFinancialScore] = useState(50);
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    village: profile?.village || '',
    crop: profile?.crop || '',
    phone: profile?.phone || '',
    landSize: profile?.landSize || '',
    income: profile?.income || ''
  });

  // Calculate Financial Score based on transactions
  useEffect(() => {
    if (!user || !db) return;
    
    const calculateScore = async () => {
      try {
        const transRef = collection(db, 'artifacts', appId, 'users', user.uid, 'transactions');
        const snapshot = await getDocs(transRef);
        
        let totalIncome = 0;
        let totalExpense = 0;
        let transactionCount = snapshot.size;
        
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.type === 'income') totalIncome += data.amount || 0;
          else totalExpense += data.amount || 0;
        });
        
        // Score calculation logic:
        // Base score: 50
        // +20 for positive balance (income > expense)
        // +10 for having transactions (tracking finances)
        // +10 for savings rate > 20%
        // +10 for consistent tracking (>10 transactions)
        
        let score = 50;
        
        // Positive balance bonus
        if (totalIncome > totalExpense) score += 20;
        else if (totalIncome > 0) score += 10;
        
        // Tracking bonus
        if (transactionCount > 0) score += 5;
        if (transactionCount > 10) score += 5;
        if (transactionCount > 30) score += 5;
        
        // Savings rate bonus
        if (totalIncome > 0) {
          const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
          if (savingsRate >= 20) score += 10;
          else if (savingsRate >= 10) score += 5;
        }
        
        // Cap at 100
        score = Math.min(100, Math.max(0, score));
        setFinancialScore(score);
        
        // Update profile with calculated score
        if (profile && score !== profile.financialScore) {
          await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main'), {
            ...profile,
            financialScore: score
          }, { merge: true });
        }
      } catch (err) {
        console.error('Error calculating financial score:', err);
        setFinancialScore(profile?.financialScore || 50);
      }
    };
    
    calculateScore();
  }, [user, db, appId, profile]);

  // Load badges
  useEffect(() => {
    if (!user || !db) return;
    
    const loadBadges = async () => {
      try {
        const badgesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'badges');
        const snapshot = await getDocs(badgesRef);
        const badgesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBadges(badgesData);
      } catch (err) {
        console.error('Error loading badges:', err);
        // Try localStorage
        const stored = localStorage.getItem(`badges_${user.uid}`);
        if (stored) setBadges(JSON.parse(stored));
      }
    };
    
    loadBadges();
  }, [user, db, appId]);

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        village: profile.village || '',
        crop: profile.crop || '',
        phone: profile.phone || '',
        landSize: profile.landSize || '',
        income: profile.income || ''
      });
    }
  }, [profile]);

  const handleLogout = () => signOut(auth);

  const resetProfile = async () => {
    if(confirm(lang === 'en' ? 'Reset all data?' : 'सभी डेटा रीसेट करें?')) {
       await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main'), { name: null });
       window.location.reload();
    }
  };

  const saveProfile = async () => {
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main'), {
        ...profile,
        ...editForm,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      loadProfile(user.uid);
      setIsEditing(false);
      alert(lang === 'en' ? 'Profile updated!' : 'प्रोफाइल अपडेट हो गई!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert(lang === 'en' ? 'Failed to save' : 'सेव करने में विफल');
    }
  };

  const fontSizes = [
    { key: 'small', label: lang === 'en' ? 'S' : 'छो', class: 'text-sm' },
    { key: 'medium', label: lang === 'en' ? 'M' : 'म', class: 'text-base' },
    { key: 'large', label: lang === 'en' ? 'L' : 'बड़', class: 'text-lg' },
    { key: 'xlarge', label: lang === 'en' ? 'XL' : 'अ.ब', class: 'text-xl' },
  ];

  const cropOptions = ['wheat', 'rice', 'sugarcane', 'cotton', 'maize', 'soybean', 'vegetables', 'fruits', 'pulses', 'other'];

  return (
    <div className="w-full md:max-w-lg md:mx-auto space-y-4">
      {/* Profile Header Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg">
        <div className="h-20 md:h-24 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"></div>
        <div className="px-4 md:px-6 pb-4 md:pb-6 relative">
          <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white p-1 absolute -top-8 md:-top-10 left-4 md:left-6 shadow-lg">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-2xl font-bold">
              {profile?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isEditing ? 'bg-[var(--danger)] text-white' : 'bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
            >
              {isEditing ? (lang === 'en' ? 'Cancel' : 'रद्द करें') : (lang === 'en' ? 'Edit' : 'संपादित करें')}
            </button>
          </div>
          
          <div className="mt-2">
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="text-xl font-bold bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 w-full text-[var(--text-main)]"
                placeholder={lang === 'en' ? 'Your name' : 'आपका नाम'}
              />
            ) : (
              <h2 className="text-xl font-bold text-[var(--text-main)]">{profile?.name || (lang === 'en' ? 'Set your name' : 'नाम सेट करें')}</h2>
            )}
            
            {isEditing ? (
              <input
                type="text"
                value={editForm.village}
                onChange={(e) => setEditForm({...editForm, village: e.target.value})}
                className="mt-2 text-sm bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 w-full text-[var(--text-muted)]"
                placeholder={lang === 'en' ? 'Village, District' : 'गांव, जिला'}
              />
            ) : (
              <p className="text-[var(--text-muted)] flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {profile?.village || (lang === 'en' ? 'Add location' : 'स्थान जोड़ें')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {badges.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4">
          <h3 className="text-sm font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
            <span className="text-lg">🏆</span>
            {lang === 'en' ? 'Earned Badges' : 'अर्जित बैज'} ({badges.length})
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {badges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center p-2 bg-[var(--bg-input)] rounded-xl">
                <span className="text-2xl mb-1">{badge.icon}</span>
                <span className="text-[10px] font-bold text-center text-[var(--text-main)] leading-tight">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Details */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
          <User size={16} />
          {lang === 'en' ? 'Profile Details' : 'प्रोफाइल विवरण'}
        </h3>
        
        {/* Main Crop */}
        <div className="p-3 bg-[var(--bg-input)] rounded-xl">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">{t('main_crop')}</p>
          {isEditing ? (
            <select
              value={editForm.crop}
              onChange={(e) => setEditForm({...editForm, crop: e.target.value})}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-main)]"
            >
              {cropOptions.map(crop => (
                <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
              ))}
            </select>
          ) : (
            <p className="font-medium text-[var(--text-main)] capitalize flex items-center gap-2">
              <Sprout size={16} className="text-[var(--primary)]" />
              {profile?.crop || (lang === 'en' ? 'Not set' : 'सेट नहीं')}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="p-3 bg-[var(--bg-input)] rounded-xl">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">{lang === 'en' ? 'Phone Number' : 'फोन नंबर'}</p>
          {isEditing ? (
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-main)]"
              placeholder="+91 98765 43210"
            />
          ) : (
            <p className="font-medium text-[var(--text-main)] flex items-center gap-2">
              <Smartphone size={16} className="text-[var(--primary)]" />
              {profile?.phone || (lang === 'en' ? 'Add phone' : 'फोन जोड़ें')}
            </p>
          )}
        </div>

        {/* Land Size */}
        <div className="p-3 bg-[var(--bg-input)] rounded-xl">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">{lang === 'en' ? 'Land Size' : 'जमीन का आकार'}</p>
          {isEditing ? (
            <input
              type="text"
              value={editForm.landSize}
              onChange={(e) => setEditForm({...editForm, landSize: e.target.value})}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-main)]"
              placeholder={lang === 'en' ? 'e.g., 5 acres' : 'जैसे 5 एकड़'}
            />
          ) : (
            <p className="font-medium text-[var(--text-main)] flex items-center gap-2">
              <MapPin size={16} className="text-[var(--primary)]" />
              {profile?.landSize || (lang === 'en' ? 'Add land size' : 'जमीन का आकार जोड़ें')}
            </p>
          )}
        </div>

        {/* Monthly Income */}
        <div className="p-3 bg-[var(--bg-input)] rounded-xl">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">{lang === 'en' ? 'Monthly Income' : 'मासिक आय'}</p>
          {isEditing ? (
            <input
              type="text"
              value={editForm.income}
              onChange={(e) => setEditForm({...editForm, income: e.target.value})}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-main)]"
              placeholder="₹15,000"
            />
          ) : (
            <p className="font-medium text-[var(--text-main)] flex items-center gap-2">
              <Wallet size={16} className="text-[var(--success)]" />
              {profile?.income || (lang === 'en' ? 'Add income' : 'आय जोड़ें')}
            </p>
          )}
        </div>

        {/* Financial Score */}
        <div className="p-3 bg-[var(--bg-input)] rounded-xl">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">{t('financial_score')}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[var(--bg-card)] rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--success)] rounded-full transition-all"
                style={{ width: `${financialScore}%` }}
              />
            </div>
            <span className="font-bold text-[var(--text-main)]">{financialScore}/100</span>
          </div>
        </div>

        {/* Save Button (when editing) */}
        {isEditing && (
          <button 
            onClick={saveProfile}
            className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            {lang === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें'}
          </button>
        )}
      </div>

      {/* Settings */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
          <Settings size={16} />
          {lang === 'en' ? 'Settings' : 'सेटिंग्स'}
        </h3>
        
        {/* Font Size */}
        <div className="p-3 bg-[var(--bg-input)] rounded-xl">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2 flex items-center gap-2">
            <Type size={12} />
            {lang === 'en' ? 'Text Size' : 'टेक्स्ट साइज'}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {fontSizes.map(size => (
              <button
                key={size.key}
                onClick={() => changeFontSize(size.key)}
                className={`p-2 rounded-lg text-center transition-all ${fontSize === size.key ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--primary)] border border-[var(--border)]'}`}
              >
                <span className={size.class}>{size.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="p-3 bg-[var(--bg-input)] rounded-xl">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">{lang === 'en' ? 'Email' : 'ईमेल'}</p>
          <p className="font-medium text-[var(--text-main)] text-sm truncate">{user?.email || 'N/A'}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button onClick={handleLogout} className="w-full py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--danger)] font-medium hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
          <LogOut size={18} />
          {t('logout')}
        </button>
        
        <button onClick={resetProfile} className="w-full py-2 text-xs text-[var(--text-muted)] hover:underline">
          {t('reset_profile')}
        </button>
      </div>
    </div>
  );
}