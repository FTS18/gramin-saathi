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
  X
} from 'lucide-react';

// Firebase Imports (only what's needed for auth state changes)
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getDocFromCache } from 'firebase/firestore';

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

// Custom UI Components
import { NavItem } from './components/custom-ui/NavigationElements';
import { IdentityMiniCard } from './components/views/IdentityMiniCard';

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
  }

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
  const [fontSize, setFontSize] = useState('normal'); 
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [showAuth, setShowAuth] = useState(false); 
  const [routeLoading, setRouteLoading] = useState(false); 
  const [loadProgress, setLoadProgress] = useState(0); 
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);

  // Navigation State
  const getInitialView = () => {
    const pathname = window.location.pathname.slice(1);
    if (pathname === 'home') return 'dashboard'; // Redirect /home to dashboard
    const validViews = ['dashboard', 'khata', 'yojana', 'saathi', 'seekho', 'profile', 'mandi', 'mausam', 'calculator', 'translator', 'community'];
    if (validViews.includes(pathname)) return pathname;
    return 'onboarding';
  };
  const [currentView, setCurrentView] = useState(getInitialView());

  // Data State
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply theme to body
  useEffect(() => {
    document.body.classList.remove('theme-blue', 'theme-dark', 'theme-light');
    if (theme !== 'blue') document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Initialize Auth
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        loadProfile(u.uid);
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

  // Sync currentView with URL
  useEffect(() => {
    const pathname = window.location.pathname.slice(1);
    if (pathname === 'home') { setCurrentView('dashboard'); window.history.replaceState(null, '', '/dashboard'); return; }
    
    const validViews = ['dashboard', 'khata', 'yojana', 'saathi', 'seekho', 'profile', 'mandi', 'mausam', 'calculator', 'translator', 'community'];
    if (validViews.includes(pathname)) setCurrentView(pathname);
    else if (pathname === '') setCurrentView(user ? 'dashboard' : 'landing');
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

  const t = (key) => TRANSLATIONS[lang]?.[key] || key;
  const fontSizeClass = fontSize === 'large' ? 'text-lg' : fontSize === 'xlarge' ? 'text-xl' : 'text-base';

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#011627] text-[#41ead4]">
      <style>{themeStyles}</style>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
    </div>
  );

  // Main Render Switch
  if ((!user && !showAuth) || currentView === 'landing') {
    return (
      <>
        <style>{themeStyles}</style>
        <LandingPage 
          onGetStarted={() => user ? handleViewChange('dashboard') : setShowAuth(true)} 
          lang={lang} 
          toggleLang={toggleLang} 
          onFeatureClick={(id) => user ? handleViewChange(id) : setShowAuth(true)}
          onLogoClick={() => user ? handleViewChange('dashboard') : window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </>
    );
  }

  if (!user && showAuth) {
    return (
      <>
        <style>{themeStyles}</style>
        <AuthView onLogin={() => setShowAuth(false)} t={t} lang={lang} toggleLang={toggleLang} />
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
          
          <aside className={`flex flex-col glass fixed left-0 top-0 bottom-0 z-50 transition-all duration-300 ${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} md:relative md:w-72 md:translate-x-0 md:m-4 md:rounded-3xl md:h-[calc(100vh-2rem)] overflow-hidden`}>
            <div className="p-6 flex items-center gap-3 border-b border-[var(--border)] cursor-pointer shrink-0">
              <img onClick={() => handleViewChange('dashboard')} src="/favicon.svg" alt="Logo" className="w-10 h-10 rounded-xl" />
              <h1 onClick={() => handleViewChange('dashboard')} className="flex-1 font-bold text-xl text-[var(--text-main)]">Gramin <span className="text-[var(--primary)]">Saathi</span></h1>
              {/* Mobile close button */}
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-muted)]">
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 min-h-0">
              <NavItem active={currentView === 'dashboard'} onClick={() => handleViewChange('dashboard')} icon={Home} label={t('nav_home')} />
              <NavItem active={currentView === 'khata'} onClick={() => handleViewChange('khata')} icon={Wallet} label={t('nav_khata')} />
              <NavItem active={currentView === 'saathi'} onClick={() => handleViewChange('saathi')} icon={Sprout} label={t('nav_saathi')} />
              
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
                    <NavItem active={currentView === 'mandi'} onClick={() => handleViewChange('mandi')} icon={Store} label={lang === 'en' ? 'Mandi' : 'मंडी'} />
                    <NavItem active={currentView === 'mausam'} onClick={() => handleViewChange('mausam')} icon={Cloud} label={lang === 'en' ? 'Weather' : 'मौसम'} />
                    <NavItem active={currentView === 'calculator'} onClick={() => handleViewChange('calculator')} icon={Calculator} label={lang === 'en' ? 'Calculator' : 'कैलकुलेटर'} />
                    <NavItem active={currentView === 'translator'} onClick={() => handleViewChange('translator')} icon={ArrowLeftRight} label={lang === 'en' ? 'Translator' : 'अनुवादक'} />
                  </div>
                )}
              </div>
              <NavItem active={currentView === 'yojana'} onClick={() => handleViewChange('yojana')} icon={ShieldCheck} label={t('nav_yojana')} />
              <NavItem active={currentView === 'community'} onClick={() => handleViewChange('community')} icon={MessageCircle} label={lang === 'en' ? 'Community' : 'समुदाय'} />
              <NavItem active={currentView === 'seekho'} onClick={() => handleViewChange('seekho')} icon={BookOpen} label={t('nav_seekho')} />
              
            </nav>

            <div className="p-4 border-t border-[var(--border)] space-y-3 bg-[var(--bg-card)] shrink-0">
              <IdentityMiniCard profile={profile} onClick={() => handleViewChange('profile')} t={t} />
              <div className="flex gap-2">
                  <button onClick={toggleLang} className="flex-1 p-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] text-xs font-bold border border-[var(--border)]">{lang === 'en' ? 'EN' : 'हिं'}</button>
                  <button onClick={cycleTheme} className="flex-1 p-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border)] flex items-center justify-center gap-2 text-xs font-medium">
                    {theme === 'blue' ? <><Droplet size={14} /> Ocean</> : theme === 'light' ? <><Sun size={14} /> Light</> : <><Moon size={14} /> Dark</>}
                  </button>
              </div>
            </div>
          </aside>

          <main id="main-content" className="flex-1 flex flex-col relative overflow-hidden">
            <header className="md:hidden h-16 glass flex items-center justify-between px-4 shrink-0">
               <button onClick={() => setSidebarOpen(true)} className="p-2"><Menu size={20} /></button>
               <div className="flex items-center gap-2"><img src="/favicon.svg" alt="Logo" className="w-8 h-8" /><span className="font-bold">{t('app_name')}</span></div>
               <button onClick={toggleLang} className="text-xs font-bold uppercase bg-[var(--bg-input)] px-2 py-1 rounded-lg">{lang}</button>
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
               {currentView === 'profile' && <ProfileView user={user} profile={profile} db={db} appId={appId} t={t} loadProfile={loadProfile} lang={lang} fontSize={fontSize} setFontSize={setFontSize} />}
            </div>
          </main>
        </>
      )}
    </div>
  );
}
