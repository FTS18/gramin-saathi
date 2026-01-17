// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Wallet, 
  Sprout, 
  BookOpen, 
  Sun, 
  Moon, 
  Menu, 
  Store, 
  Cloud, 
  Droplet, 
  Calculator, 
  ArrowLeftRight, 
  MessageCircle,
  ShieldCheck,
  User,
  ChevronDown,
  Wrench,
  X,
  TrendingUp
} from 'lucide-react';

// Firebase Imports (only what's needed for auth state changes)
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getDocFromCache } from 'firebase/firestore';
import { clearEncryption, initEncryption, isEncryptionReady, tryRestoreEncryption } from './lib/encryption';

// Component Imports
import LandingPage from './components/LandingPage';
import { AuthView } from './components/views/AuthView';
import { OnboardingView } from './components/views/OnboardingView';
import { HomeView } from './components/views/HomeView';
import { KhataView } from './components/views/KhataView';
import { SaathiView } from './components/views/SaathiView';
import { MandiView } from './components/views/MandiView';
import { YojanaView } from './components/views/YojanaView';
import { SeekhoView } from './components/views/SeekhoView';
import { WeatherView } from './components/views/WeatherView';
import { CalculatorView } from './components/views/CalculatorView';
import { TranslatorView } from './components/views/TranslatorView';
import { CommunityView } from './components/views/CommunityView';
import { ProfileView } from './components/views/ProfileView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { YieldPredictorView } from './components/views/YieldPredictorView';
import SchemeEligibilityAdvisor from './components/views/SchemeEligibilityAdvisor';
import InsuranceAdvisor from './components/views/InsuranceAdvisor';
import LoanRecommender from './components/views/LoanRecommender';
import { GuidedTour, TourButton, hasCompletedTour, markTourCompleted } from './components/GuidedTour';
import { getTourSteps } from './lib/tour-config';

// Custom UI Components
import { NavItem } from './components/custom-ui/NavigationElements';
import { IdentityMiniCard } from './components/views/IdentityMiniCard';
import { VoiceNavigationButton } from './components/VoiceNavigationButton';

// Utility Imports
import { TRANSLATIONS } from './lib/translations';

/**
 * ==========================================================================================
 * CONFIGURATION & THEME ENGINE
 * ==========================================================================================
 */

const themeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  :root {
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
    
    /* Font scaling - default 1x (Medium) */
    --font-scale: 1;
  }

  /* Font Size Scaling Classes - Simplified (3 Levels) */
  body.font-small { --font-scale: 0.75; }  /* Much Smaller */
  body.font-medium { --font-scale: 1; }     /* Normal */
  body.font-large { --font-scale: 1.35; }   /* Much Larger */
  
  /* Apply scaling to root font size */
  html { font-size: calc(16px * var(--font-scale)); }

  /* Thin subtle scrollbars */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.5); }

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
    background-color: var(--bg-main);
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%),
      radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.08), transparent 25%);
  }
  body.theme-light ::-webkit-scrollbar-track { background: transparent; }
  body.theme-light ::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.3); }
  body.theme-light ::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.5); }
  
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
  body.theme-dark ::-webkit-scrollbar-track { background: transparent; }
  body.theme-dark ::-webkit-scrollbar-thumb { background: rgba(161, 161, 170, 0.3); }
  body.theme-dark ::-webkit-scrollbar-thumb:hover { background: rgba(161, 161, 170, 0.5); }

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
  .skip-link:focus { top: 0; }

  *:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
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

  .glass {
    background: var(--bg-card);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-glass);
  }

  /* Make buttons use the custom theme primary color */
  button[class*="bg-primary"] {
    background-color: var(--primary) !important;
    color: var(--text-main) !important;
  }
  
  button[class*="bg-primary"]:hover {
    filter: brightness(0.9);
  }

  button[class*="bg-primary"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }


`;

// Import Firebase instances from shared config
import { auth, db } from './lib/firebase-config';

const appId = 'gramin-saathi';

/**
 * ==========================================================================================
 * COMPONENT: APP ROOT
 * ==========================================================================================
 */

export default function GraminSaathiOS() {
  // Global State
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'blue');
  const [lang, setLang] = useState('en');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('app_fontSize') ||'medium'); 
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [showAuth, setShowAuth] = useState(false); 
  const [routeLoading, setRouteLoading] = useState(false); 
  const [loadProgress, setLoadProgress] = useState(0); 
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);

  // Tour State
  const [showTour, setShowTour] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);
  const [tourKey, setTourKey] = useState(0); // Used to reset tour

  // Navigation State
  const getInitialView = () => {
    const pathname = window.location.pathname.slice(1);
    if (pathname === 'home') return 'dashboard'; // Redirect /home to dashboard
    const validViews = ['dashboard', 'khata', 'yojana', 'saathi', 'seekho', 'profile', 'mandi', 'mausam', 'calculator', 'translator', 'community', 'analytics', 'yield-predictor', 'scheme-advisor', 'insurance-advisor', 'loan-recommender'];
    if (validViews.includes(pathname)) return pathname;
    return 'landing';
  };
  const [currentView, setCurrentView] = useState(getInitialView());

  // Data State
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply theme to body
  // Apply theme and font size to body
  useEffect(() => {
    document.body.classList.remove('theme-blue', 'theme-dark', 'theme-light');
    if (theme !== 'blue') document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('app_theme', theme);
    
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${fontSize}`);
    localStorage.setItem('app_fontSize', fontSize);
  }, [theme, fontSize]);

  // Initialize Auth
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        loadProfile(u.uid);
        
        // Auto-initialize encryption for persistent sessions
        // Try to restore from storage first (works cross-device for UID-based encryption)
        if (!isEncryptionReady()) {
          try {
            const restored = await tryRestoreEncryption(u.uid);
            if (!restored) {
              // Fallback: Use UID as password
              await initEncryption(u.uid, u.uid);
            }
            console.log('Encryption initialized for existing session');
          } catch (error) {
            console.warn('Could not initialize encryption:', error);
          }
        }
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      unsubAuth();
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  // Auto-show guided tour on first visit
  useEffect(() => {
    if (user && currentView !== 'landing' && currentView !== 'onboarding' && !hasCompletedTour('dashboard')) {
      setTourSteps(getTourSteps(lang));
      setTimeout(() => setShowTour(true), 1000); // Small delay to let UI render
    }
  }, [user, lang, currentView]);

  // Sync currentView with URL
  useEffect(() => {
    const pathname = window.location.pathname.slice(1);
    
    // Handle /login route
    if (pathname === 'login') {
      if (!user) setShowAuth(true);
      return;
    }
    
    // Handle / root route - show landing page to everyone
    if (pathname === '') {
      setCurrentView('landing');
      return;
    }
    
    if (pathname === 'home') { setCurrentView('dashboard'); window.history.replaceState(null, '', '/dashboard'); return; }
    
    const validViews = ['dashboard', 'khata', 'yojana', 'saathi', 'seekho', 'profile', 'mandi', 'mausam', 'calculator', 'translator', 'community', 'analytics', 'yield-predictor', 'scheme-advisor', 'insurance-advisor', 'loan-recommender'];
    if (validViews.includes(pathname)) setCurrentView(pathname);
  }, [user]);

  useEffect(() => {
    if (currentView !== 'onboarding' && currentView !== 'landing') {
      window.history.pushState(null, '', `/${currentView}`);
    } else if (currentView === 'landing' && window.location.pathname !== '/') {
      window.history.pushState(null, '', `/`);
    }
  }, [currentView]);

  // View Change Handler
  const handleViewChange = (view) => {
    if (view === currentView) return;
    setRouteLoading(true);
    setLoadProgress(0);
    
    const progressInterval = setInterval(() => {
      setLoadProgress(prev => Math.min(90, prev + Math.random() * 30));
    }, 50);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setCurrentView(view);
      setSidebarOpen(false);
      setLoadProgress(100);
      setTimeout(() => { setRouteLoading(false); setLoadProgress(0); }, 200);
    }, 150);
  };

  // Load User Profile
  const loadProfile = async (uid) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'artifacts', appId, 'users', uid, 'profile', 'main');
      
      try {
        const cachedDoc = await getDocFromCache(docRef);
        if (cachedDoc.exists() && cachedDoc.data()?.name) {
          setProfile(cachedDoc.data());
          if (currentView === 'onboarding') handleViewChange('dashboard');
          setLoading(false);
          return;
        }
      } catch (cacheErr) {}
      
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data()?.name) {
        setProfile(docSnap.data());
        if (currentView === 'onboarding') handleViewChange('dashboard');
      } else {
        setCurrentView('onboarding');
      }
    } catch (e) {
      console.warn("Profile load error:", e.message);
      setCurrentView('onboarding');
    }
    setLoading(false);
  };

  // UI Handlers
  const toggleLang = () => {
    // Only Hindi and English
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  const cycleTheme = () => {
    setTheme(prev => prev === 'blue' ? 'light' : prev === 'light' ? 'dark' : 'blue');
  };

  const cycleFontSize = () => {
    setFontSize(prev => {
      switch (prev) {
        case 'small': return 'medium';
        case 'medium': return 'large';
        case 'large': return 'small';
        default: return 'medium';
      }
    });
  };

  const t = (key) => TRANSLATIONS[lang]?.[key] || key;
  const fontSizeClass = fontSize === 'large' ? 'text-lg' : 'text-base';

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#011627] text-[#41ead4]">
      <style>{themeStyles}</style>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
    </div>
  );

  // Main Render Switch
  if (!user && showAuth) {
    return (
      <>
        <style>{themeStyles}</style>
        <AuthView onLogin={() => { setShowAuth(false); window.history.replaceState(null, '', '/dashboard'); }} t={t} lang={lang} toggleLang={toggleLang} />
      </>
    );
  }

  if (currentView === 'landing') {
    const handleLandingGetStarted = () => {
      if (user) {
        handleViewChange('dashboard');
      } else {
        setShowAuth(true);
        window.history.pushState(null, '', '/login');
      }
    };

    const handleLandingFeatureClick = (id) => {
      if (user) {
        handleViewChange(id);
      } else {
        setShowAuth(true);
        window.history.pushState(null, '', '/login');
      }
    };

    const handleLogout = async () => {
      // Clear encryption keys before logout
      clearEncryption();
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setCurrentView('landing');
      window.history.replaceState(null, '', '/');
    };

    return (
      <>
        <style>{themeStyles}</style>
        <LandingPage 
          onGetStarted={handleLandingGetStarted} 
          lang={lang} 
          toggleLang={toggleLang} 
          onFeatureClick={handleLandingFeatureClick}
          onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          user={user}
          onLogout={user ? handleLogout : undefined}
          onNavigate={handleViewChange}
        />
      </>
    );
  }

  if (!user && !showAuth) {
    return (
      <>
        <style>{themeStyles}</style>
        <LandingPage 
          onGetStarted={() => {
            setShowAuth(true);
            window.history.pushState(null, '', '/login');
          }} 
          lang={lang} 
          toggleLang={toggleLang} 
          onFeatureClick={() => {
            setShowAuth(true);
            window.history.pushState(null, '', '/login');
          }}
          onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          user={null}
          onNavigate={(view) => {
            setShowAuth(true);
            window.history.pushState(null, '', '/login');
          }}
        />
      </>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${fontSizeClass}`}>
      <style>{themeStyles}</style>
      
      {routeLoading && <div className="route-progress" style={{ width: `${loadProgress}%` }} />}
      <a href="#main-content" className="skip-link">{lang === 'en' ? 'Skip to content' : 'विषय पर जाएं'}</a>
      
      {currentView === 'onboarding' ? (
         <OnboardingView 
           user={user} db={db} appId={appId} t={t} lang={lang} toggleLang={toggleLang}
           onComplete={() => loadProfile(user.uid)}
         />
      ) : (
        <>
          {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />}
          
          <aside data-tour="sidebar" className={`flex flex-col glass fixed left-0 top-0 bottom-0 z-50 transition-all duration-300 ${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} md:relative md:w-72 md:translate-x-0 md:m-4 md:rounded-3xl md:h-[calc(100vh-2rem)] overflow-hidden`}>
            <div className="p-6 flex items-center gap-3 border-b border-[var(--border)] cursor-pointer shrink-0">
              <img onClick={() => { setCurrentView('landing'); window.history.pushState(null, '', '/'); }} src="/favicon.svg" alt="Logo" className="w-10 h-10 rounded-xl" />
              <h1 onClick={() => { setCurrentView('landing'); window.history.pushState(null, '', '/'); }} className="flex-1 font-bold text-xl text-[var(--text-main)]">Gramin <span className="text-[var(--primary)]">Saathi</span></h1>
              {/* Mobile close button */}
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-muted)]">
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 min-h-0">
              <NavItem data-tour="nav-dashboard" active={currentView === 'dashboard'} onClick={() => handleViewChange('dashboard')} icon={Home} label={t('nav_home')} />
              <NavItem data-tour="nav-khata" active={currentView === 'khata'} onClick={() => handleViewChange('khata')} icon={Wallet} label={t('nav_khata')} />
              <NavItem data-tour="saathi" active={currentView === 'saathi'} onClick={() => handleViewChange('saathi')} icon={Sprout} label={t('nav_saathi')} />
              
              {/* Utilities Dropdown */}
              <div className="space-y-1">
                <button 
                  onClick={() => setUtilitiesOpen(!utilitiesOpen)} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    ['mandi', 'mausam', 'calculator', 'translator'].includes(currentView)
                      ? 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-glass)]'
                  }`}
                >
                  <Wrench size={18} />
                  <span className="flex-1 text-left">{lang === 'en' ? 'Utilities' : 'उपकरण'}</span>
                  <ChevronDown size={16} className={`transition-transform ${utilitiesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {utilitiesOpen && (
                  <div className="ml-4 pl-4 border-l-2 border-[var(--border)] space-y-1">
                    <NavItem data-tour="mandi" active={currentView === 'mandi'} onClick={() => handleViewChange('mandi')} icon={Store} label={lang === 'en' ? 'Mandi' : 'मंडी'} />
                    <NavItem active={currentView === 'mausam'} onClick={() => handleViewChange('mausam')} icon={Cloud} label={lang === 'en' ? 'Weather' : 'मौसम'} />
                    <NavItem active={currentView === 'calculator'} onClick={() => handleViewChange('calculator')} icon={Calculator} label={lang === 'en' ? 'Calculator' : 'कैलकुलेटर'} />
                    <NavItem active={currentView === 'translator'} onClick={() => handleViewChange('translator')} icon={ArrowLeftRight} label={lang === 'en' ? 'Translator' : 'अनुवादक'} />
                  </div>
                )}
              </div>
              <NavItem data-tour="nav-yojana" active={currentView === 'yojana'} onClick={() => handleViewChange('yojana')} icon={ShieldCheck} label={t('nav_yojana')} />
              <NavItem data-tour="nav-community" active={currentView === 'community'} onClick={() => handleViewChange('community')} icon={MessageCircle} label={lang === 'en' ? 'Community' : 'समुदाय'} />
              <NavItem data-tour="nav-seekho" active={currentView === 'seekho'} onClick={() => handleViewChange('seekho')} icon={BookOpen} label={t('nav_seekho')} />
              <NavItem active={currentView === 'yield-predictor'} onClick={() => handleViewChange('yield-predictor')} icon={Sprout} label={lang === 'en' ? 'Yield Predictor' : 'उपज भविष्यवक्ता'} />
              
              {/* NEW AI Advisors */}
              <div className="border-t border-[var(--border)] pt-3">
                <p className="text-xs font-bold text-[var(--text-muted)] px-3 mb-2 uppercase">{lang === 'en' ? 'AI Advisors' : 'AI सलाहकार'}</p>
                <NavItem active={currentView === 'scheme-advisor'} onClick={() => handleViewChange('scheme-advisor')} icon={ShieldCheck} label={lang === 'en' ? 'Schemes' : 'योजनाएं'} />
                <NavItem active={currentView === 'insurance-advisor'} onClick={() => handleViewChange('insurance-advisor')} icon={ShieldCheck} label={lang === 'en' ? 'Insurance' : 'बीमा'} />
                <NavItem active={currentView === 'loan-recommender'} onClick={() => handleViewChange('loan-recommender')} icon={Wallet} label={lang === 'en' ? 'Loans' : 'ऋण'} />
              </div>
              </nav>

            <div className="p-4 border-t border-[var(--border)] space-y-3 bg-[var(--bg-card)] shrink-0">
              <IdentityMiniCard profile={profile} onClick={() => handleViewChange('profile')} t={t} />
              <div className="grid grid-cols-3 gap-2">
                  <button data-tour="language" onClick={toggleLang} className="p-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] text-xs font-bold border border-[var(--border)]">{lang === 'en' ? 'EN' : 'हिं'}</button>
                  <button data-tour="theme" onClick={cycleTheme} className="p-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border)] flex items-center justify-center gap-1 text-xs font-medium">
                    {theme === 'blue' ? <><Droplet size={14} /></> : theme === 'light' ? <><Sun size={14} /></> : <><Moon size={14} /></>}
                  </button>
                  {/* <button data-tour="font-size" onClick={cycleFontSize} className="p-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border)] flex items-center justify-center gap-1 text-xs font-bold font-serif">
                    {fontSize === 'small' ? 'T-' : fontSize === 'medium' ? 'T' : 'T+'}
                  </button> */}
                  <TourButton onClick={() => { setTourSteps(getTourSteps(lang)); setTourKey(prev => prev + 1); setShowTour(true); }} lang={lang} />
              </div>
            </div>
          </aside>

          <main id="main-content" className="flex-1 flex flex-col relative overflow-hidden">
            <header className="md:hidden h-16 glass flex items-center justify-between px-4 shrink-0">
               <button onClick={() => setSidebarOpen(true)} className="p-2"><Menu size={20} /></button>
               <div className="flex items-center gap-2"><img src="/favicon.svg" alt="Logo" className="w-8 h-8" /><span className="font-bold">{t('app_name')}</span></div>
               <div className="flex items-center gap-2">
                 <TourButton onClick={() => { setTourSteps(getTourSteps(lang)); setShowTour(true); }} lang={lang} />
                 <button onClick={toggleLang} className="text-xs font-bold uppercase bg-[var(--bg-input)] px-2 py-1 rounded-lg">{lang}</button>
               </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
               {currentView === 'analytics' && <AnalyticsView lang={lang} t={t} />}
               {currentView === 'yield-predictor' && <YieldPredictorView lang={lang} t={t} />}
               {currentView === 'scheme-advisor' && <SchemeEligibilityAdvisor lang={lang} t={t} />}
               {currentView === 'insurance-advisor' && <InsuranceAdvisor lang={lang} t={t} />}
               {currentView === 'loan-recommender' && <LoanRecommender lang={lang} t={t} />}
               {currentView === 'profile' && <ProfileView user={user} profile={profile} db={db} appId={appId} t={t} loadProfile={loadProfile} lang={lang} fontSize={fontSize} changeFontSize={setFontSize} />}
            </div>
          </main>
          
          {/* Voice Navigation Button - Available on all authenticated pages */}
          <VoiceNavigationButton 
            onNavigate={handleViewChange} 
            lang={lang}
            currentView={currentView}
          />
          
          {/* Guided Tour */}
          {showTour && tourSteps.length > 0 && (
            <GuidedTour
              key={tourKey}
              steps={tourSteps}
              onComplete={() => {
                markTourCompleted('dashboard');
                setShowTour(false);
              }}
              onSkip={() => {
                // Don't mark as completed if skipped - tour will show again on next visit
                setShowTour(false);
              }}
              lang={lang}
            />
          )}
        </>
      )}
    </div>
  );
}
