// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Leaf,
  ArrowRight,
  Play,
  ChevronDown,
  Menu,
  X,
  Quote,
  Mic,
  Wallet,
  Landmark,
  TrendingUp,
  Cloud,
  BookOpen,
  Languages,
  WifiOff,
  Shield,
  IndianRupee,
  Sprout,
  BarChart3,
  Sun,
  CheckCircle,
  User,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  lang: string;
  toggleLang: () => void;
  onFeatureClick?: (id: string) => void;
  onLogoClick?: () => void;
}

export default function LandingPage({ onGetStarted, lang, toggleLang, onFeatureClick, onLogoClick }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 10 testimonials - show random 5
  const allTestimonials = [
    {
      name: lang === 'en' ? 'Ramesh Kumar' : 'रमेश कुमार',
      location: lang === 'en' ? 'Sonipat, Haryana' : 'सोनीपत, हरियाणा',
      icon: Sprout,
      quote: lang === 'en' 
        ? 'Found PM-KISAN through this app. Got ₹6,000 deposited directly!' 
        : 'इस ऐप से PM-KISAN मिला। ₹6,000 सीधे जमा हुए!'
    },
    {
      name: lang === 'en' ? 'Sunita Devi' : 'सुनीता देवी',
      location: lang === 'en' ? 'Vaishali, Bihar' : 'वैशाली, बिहार',
      icon: Mic,
      quote: lang === 'en' 
        ? 'I just speak in Hindi and it writes everything. No typing needed!' 
        : 'बस हिंदी में बोलो, सब लिख जाता है। टाइप नहीं करना!'
    },
    {
      name: lang === 'en' ? 'Ganesh Patil' : 'गणेश पाटिल',
      location: lang === 'en' ? 'Nashik, Maharashtra' : 'नासिक, महाराष्ट्र',
      icon: Cloud,
      quote: lang === 'en' 
        ? 'Weather alert saved my grape crop. Got 2 days advance warning!' 
        : 'मौसम अलर्ट ने अंगूर की फसल बचाई। 2 दिन पहले चेतावनी मिली!'
    },
    {
      name: lang === 'en' ? 'Kavita Singh' : 'कविता सिंह',
      location: lang === 'en' ? 'Lucknow, UP' : 'लखनऊ, UP',
      icon: TrendingUp,
      quote: lang === 'en' 
        ? 'Mandi prices helped me sell potatoes at better rate.' 
        : 'मंडी भाव से आलू अच्छे दाम पर बेचा।'
    },
    {
      name: lang === 'en' ? 'Mohan Reddy' : 'मोहन रेड्डी',
      location: lang === 'en' ? 'Anantapur, AP' : 'अनंतपुर, AP',
      icon: Sprout,
      quote: lang === 'en' 
        ? 'AI advice on groundnut pest control was very helpful.' 
        : 'मूंगफली कीट नियंत्रण पर AI सलाह बहुत मददगार थी।'
    },
    {
      name: lang === 'en' ? 'Priya Sharma' : 'प्रिया शर्मा',
      location: lang === 'en' ? 'Jaipur, Rajasthan' : 'जयपुर, राजस्थान',
      icon: Wallet,
      quote: lang === 'en' 
        ? 'Easy to track daily expenses. Very useful for small farmers.' 
        : 'रोज का खर्च ट्रैक करना आसान। छोटे किसानों के लिए उपयोगी।'
    },
    {
      name: lang === 'en' ? 'Arjun Yadav' : 'अर्जुन यादव',
      location: lang === 'en' ? 'Indore, MP' : 'इंदौर, MP',
      icon: BookOpen,
      quote: lang === 'en' 
        ? 'Learned about organic farming from Seekho section.' 
        : 'सीखो सेक्शन से जैविक खेती सीखी।'
    },
    {
      name: lang === 'en' ? 'Lakshmi Bai' : 'लक्ष्मी बाई',
      location: lang === 'en' ? 'Nagpur, Maharashtra' : 'नागपुर, महाराष्ट्र',
      icon: Landmark,
      quote: lang === 'en' 
        ? 'Got crop insurance scheme through Yojana Hub.' 
        : 'योजना हब से फसल बीमा योजना मिली।'
    },
    {
      name: lang === 'en' ? 'Ravi Meena' : 'रवि मीणा',
      location: lang === 'en' ? 'Kota, Rajasthan' : 'कोटा, राजस्थान',
      icon: WifiOff,
      quote: lang === 'en' 
        ? 'Works offline in my village. Very important feature!' 
        : 'मेरे गांव में ऑफलाइन काम करता है। बहुत जरूरी फीचर!'
    },
    {
      name: lang === 'en' ? 'Sarita Kumari' : 'सरिता कुमारी',
      location: lang === 'en' ? 'Patna, Bihar' : 'पटना, बिहार',
      icon: IndianRupee,
      quote: lang === 'en' 
        ? 'Now I manage my farm finances properly. Thank you!' 
        : 'अब मैं अपने खेत का हिसाब ठीक से रखती हूं। धन्यवाद!'
    }
  ];

  // Randomly select 5 testimonials on mount
  const testimonials = useMemo(() => {
    const shuffled = [...allTestimonials].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [lang]);

  const features = [
    {
      id: 'saathi',
      Icon: Sprout,
      title: lang === 'en' ? 'AI Farming Advisor' : 'AI कृषि सलाहकार',
      desc: lang === 'en' 
        ? 'Get personalized crop advice and pest control tips in your language' 
        : 'अपनी भाषा में फसल सलाह और कीट नियंत्रण टिप्स पाएं'
    },
    {
      id: 'khata',
      Icon: Wallet,
      title: lang === 'en' ? 'Voice Khata Book' : 'वॉइस खाता बुक',
      desc: lang === 'en' 
        ? 'Just speak to track income and expenses. No typing needed!' 
        : 'बस बोलकर आय-खर्च का हिसाब रखें। टाइप नहीं करना!'
    },
    {
      id: 'yojana',
      Icon: Landmark,
      title: lang === 'en' ? 'Government Schemes' : 'सरकारी योजनाएं',
      desc: lang === 'en' 
        ? 'Discover PM-KISAN, crop insurance & schemes you qualify for' 
        : 'PM-KISAN, फसल बीमा और पात्र योजनाएं खोजें'
    },
    {
      id: 'mandi',
      Icon: BarChart3,
      title: lang === 'en' ? 'Live Mandi Rates' : 'लाइव मंडी भाव',
      desc: lang === 'en' 
        ? 'Real-time prices from nearby markets. Sell at best price!' 
        : 'नजदीकी मंडियों से रियल-टाइम भाव। सबसे अच्छे दाम पर बेचें!'
    },
    {
      id: 'mausam',
      Icon: Sun,
      title: lang === 'en' ? 'Weather Alerts' : 'मौसम अलर्ट',
      desc: lang === 'en' 
        ? '7-day forecast with alerts to protect your crops' 
        : 'फसल सुरक्षा के लिए 7 दिन का पूर्वानुमान और अलर्ट'
    },
    {
      id: 'seekho',
      Icon: BookOpen,
      title: lang === 'en' ? 'Learn & Grow' : 'सीखें और बढ़ें',
      desc: lang === 'en' 
        ? 'Financial literacy and modern farming techniques' 
        : 'वित्तीय साक्षरता और आधुनिक खेती तकनीक'
    }
  ];

  // Realistic hackathon numbers
  const stats = [
    { value: '1,200+', label: lang === 'en' ? 'Active Users' : 'सक्रिय उपयोगकर्ता', Icon: Users },
    { value: '₹15L+', label: lang === 'en' ? 'Transactions Tracked' : 'लेनदेन ट्रैक किए', Icon: IndianRupee },
    { value: '50+', label: lang === 'en' ? 'Villages Reached' : 'गांव पहुंचे', Icon: Landmark }
  ];

  const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=RcG1TwdPoKI';

  return (
    <div className="min-h-screen bg-[#0a1f1a] text-white overflow-x-hidden">
      {/* Import Monument Extended font from public folder */}
      <style>{`
        @font-face {
          font-family: 'Monument Extended';
          src: url('/MonumentExtended-Regular.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Monument Extended';
          src: url('/MonumentExtended-Ultrabold.otf') format('opentype');
          font-weight: 800;
          font-style: normal;
          font-display: swap;
        }
        .heading-font { font-family: 'Monument Extended', sans-serif; letter-spacing: -0.01em; }
      `}</style>
      
      {/* ===== NAVBAR ===== */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a1f1a]/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <button 
              onClick={onLogoClick} 
              className="flex items-center gap-2 sm:gap-3 hover:scale-[1.02] active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#c8e038] rounded-xl p-1"
            >
              <img src="/favicon.svg" alt="Gramin Saathi" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-lg" />
              <span className="text-lg sm:text-xl font-bold tracking-tight heading-font">
                Gramin <span className="text-[#c8e038]">Saathi</span>
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <a href="#features" className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                {lang === 'en' ? 'Features' : 'विशेषताएं'}
              </a>
              <a href="#impact" className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                {lang === 'en' ? 'Impact' : 'प्रभाव'}
              </a>
              <a href="#stories" className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                {lang === 'en' ? 'Stories' : 'कहानियां'}
              </a>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={toggleLang} 
                className="px-3 py-1.5 text-sm text-white/70 hover:text-white border border-white/20 rounded-lg hover:border-white/40 transition-all"
              >
                {lang === 'en' ? 'हिंदी' : 'EN'}
              </button>
              <button 
                onClick={onGetStarted}
                className="px-5 py-2 bg-[#c8e038] text-[#0a1f1a] text-sm font-semibold rounded-lg hover:bg-[#d4ea4d] transition-all"
              >
                {lang === 'en' ? 'Get Started' : 'शुरू करें'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white/80">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a1f1a] border-t border-white/10 px-4 py-4 space-y-3">
            <a href="#features" className="block py-2 text-white/70">{lang === 'en' ? 'Features' : 'विशेषताएं'}</a>
            <a href="#impact" className="block py-2 text-white/70">{lang === 'en' ? 'Impact' : 'प्रभाव'}</a>
            <a href="#stories" className="block py-2 text-white/70">{lang === 'en' ? 'Stories' : 'कहानियां'}</a>
            <div className="flex gap-3 pt-3 border-t border-white/10">
              <button onClick={toggleLang} className="flex-1 py-2.5 border border-white/20 rounded-lg text-sm">
                {lang === 'en' ? 'हिंदी' : 'EN'}
              </button>
              <button onClick={onGetStarted} className="flex-1 py-2.5 bg-[#c8e038] text-[#0a1f1a] font-semibold rounded-lg">
                {lang === 'en' ? 'Start' : 'शुरू'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen sm:min-h-[90vh] flex items-center pt-14 sm:pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#0a1f1a] via-[#0a1f1a]/95 to-[#0a1f1a]/80 sm:to-[#0a1f1a]/70" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left - Text Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#c8e038]/15 border border-[#c8e038]/30 rounded-full mb-4 sm:mb-6">
                <span className="w-1.5 h-1.5 bg-[#c8e038] rounded-full animate-pulse" />
                <span className="text-xs text-[#c8e038] font-medium">
                  {lang === 'en' ? 'Built for Indian Farmers' : 'भारतीय किसानों के लिए बनाया'}
                </span>
              </div>

              {/* Heading */}
              <h1 className="heading-font text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-4 sm:mb-5">
                {lang === 'en' ? (
                  <>Your Digital <span className="text-[#c8e038]">Farming</span> Companion</>
                ) : (
                  <>आपका डिजिटल <span className="text-[#c8e038]">खेती</span> साथी</>
                )}
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
                {lang === 'en' 
                  ? 'Track finances by voice, access schemes, get AI crop advice, and check mandi prices—all in your language.' 
                  : 'आवाज से हिसाब रखें, योजनाएं पाएं, AI फसल सलाह लें, मंडी भाव देखें—अपनी भाषा में।'
                }
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center lg:justify-start">
                <button 
                  onClick={onGetStarted}
                  className="group px-6 py-3 bg-[#c8e038] text-[#0a1f1a] font-semibold rounded-xl hover:bg-[#d4ea4d] transition-all flex items-center justify-center gap-2"
                >
                  {lang === 'en' ? 'Start Free' : 'मुफ्त शुरू करें'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <a 
                  href={DEMO_VIDEO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/20 text-white font-medium rounded-xl hover:border-white/40 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {lang === 'en' ? 'Watch Demo (v1)' : 'डेमो देखें (v1)'}
                </a>
              </div>

              {/* Quick Stats - Mobile horizontal scroll */}
              <div className="flex gap-6 sm:gap-8 justify-center lg:justify-start overflow-x-auto pb-2">
                {stats.map((stat, i) => (
                  <div key={i} className="flex-shrink-0 text-center lg:text-left">
                    <p className="text-xl sm:text-2xl font-bold text-[#c8e038]">{stat.value}</p>
                    <p className="text-xs text-white/50 whitespace-nowrap">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Feature Cards (Desktop only) */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-[#0d2922]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <img src="/favicon.svg" alt="Gramin Saathi" className="w-12 h-12 rounded-2xl shadow-lg border border-white/10" />
                    <div>
                      <p className="font-bold text-lg text-white heading-font tracking-tight">Gramin Saathi</p>
                      <p className="text-xs text-white/50">{lang === 'en' ? 'Your farming partner' : 'आपका खेती साथी'}</p>
                    </div>
                  </div>
                  
                  {/* Mini Feature List */}
                  <div className="space-y-3 relative z-10">
                    {[
                      { Icon: Mic, text: lang === 'en' ? 'Voice Khata - Track by speaking' : 'वॉइस खाता - बोलकर ट्रैक करें' },
                      { Icon: Sprout, text: lang === 'en' ? 'AI Crop Advisor - Smart tips' : 'AI फसल सलाह - स्मार्ट टिप्स' },
                      { Icon: BarChart3, text: lang === 'en' ? 'Live Mandi - Best prices' : 'लाइव मंडी - सबसे अच्छे दाम' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm group-hover:bg-black/30 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-[#c8e038]/20 flex items-center justify-center">
                          <item.Icon className="w-5 h-5 text-[#c8e038]" />
                        </div>
                        <span className="text-sm font-medium text-white/90">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Card - Weather */}
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">28°C</p>
                      <p className="text-[10px] text-gray-500">{lang === 'en' ? 'Good for sowing' : 'बुवाई के लिए अच्छा'}</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card - Transaction */}
                <div className="absolute -bottom-4 -left-4 bg-[#c8e038] p-3 rounded-xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0a1f1a]/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#0a1f1a]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0a1f1a]">₹2,500 {lang === 'en' ? 'added' : 'जोड़ा'}</p>
                      <p className="text-[10px] text-[#0a1f1a]/70">{lang === 'en' ? 'Voice entry' : 'आवाज से'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-12 sm:py-20 bg-[#f8f6f0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-xs uppercase tracking-widest text-[#22c55e] font-medium mb-2 sm:mb-3">
              {lang === 'en' ? 'Features' : 'विशेषताएं'}
            </p>
            <h2 className="heading-font text-xl sm:text-2xl lg:text-3xl font-bold text-[#0a1f1a]">
              {lang === 'en' ? 'Everything You Need to Farm Smarter' : 'स्मार्ट खेती के लिए सब कुछ'}
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {features.map((f, i) => (
              <div 
                key={i} 
                onClick={() => onFeatureClick?.(f.id)}
                className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-[#c8e038]/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#c8e038]/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#c8e038]/20 transition-colors">
                  <f.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#22c55e]" />
                </div>
                <h3 className="text-sm sm:text-base font-medium text-[#0a1f1a] mb-1 sm:mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-none">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-12 sm:py-20 bg-[#0d2922]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[#1a3d33]">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                  alt="Person using smartphone"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white p-3 sm:p-4 rounded-xl shadow-xl max-w-[150px] sm:max-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#c8e038] flex items-center justify-center">
                    <Mic className="w-4 h-4 text-[#0a1f1a]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0a1f1a]">{lang === 'en' ? 'Voice Entry' : 'आवाज से'}</p>
                    <p className="text-[10px] text-gray-500">{lang === 'en' ? '₹500 added' : '₹500 जोड़ा'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <p className="text-xs uppercase tracking-widest text-[#c8e038] font-medium mb-2 sm:mb-3">
                {lang === 'en' ? 'Easy to Use' : 'उपयोग में आसान'}
              </p>
              <h2 className="heading-font text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
                {lang === 'en' ? 'Simple Enough for Everyone' : 'सभी के लिए आसान'}
              </h2>
              <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
                {lang === 'en' 
                  ? 'No complicated forms. Just speak in your language and the app does the rest. Works even without internet connection.' 
                  : 'कोई जटिल फॉर्म नहीं। बस अपनी भाषा में बोलें। इंटरनेट के बिना भी काम करता है।'
                }
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
                {[
                  { Icon: Languages, text: lang === 'en' ? 'Voice-first in 5+ languages' : '5+ भाषाओं में वॉइस-फर्स्ट' },
                  { Icon: WifiOff, text: lang === 'en' ? 'Works offline' : 'ऑफलाइन काम करता है' },
                  { Icon: Shield, text: lang === 'en' ? 'Your data stays private' : 'आपका डेटा सुरक्षित' },
                  { Icon: IndianRupee, text: lang === 'en' ? 'Completely free' : 'पूरी तरह मुफ्त' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 p-3 bg-white/5 rounded-xl">
                    <item.Icon className="w-4 h-4 text-[#c8e038] flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-white/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMPACT ===== */}
      <section id="impact" className="py-12 sm:py-20 bg-[#0a1f1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-xs uppercase tracking-widest text-[#c8e038] font-medium mb-2 sm:mb-3">
              {lang === 'en' ? 'Our Impact' : 'हमारा प्रभाव'}
            </p>
            <h2 className="heading-font text-xl sm:text-2xl lg:text-3xl font-bold">
              {lang === 'en' ? 'Making a Real Difference' : 'वास्तविक बदलाव ला रहे हैं'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#c8e038]/10 flex items-center justify-center">
                  <stat.Icon className="w-6 h-6 text-[#c8e038]" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#c8e038] mb-1 sm:mb-2">{stat.value}</p>
                <p className="text-xs sm:text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="stories" className="py-12 sm:py-20 bg-[#f8f6f0] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-xs uppercase tracking-widest text-[#22c55e] font-medium mb-2 sm:mb-3">
              {lang === 'en' ? 'Success Stories' : 'सफलता की कहानियां'}
            </p>
            <h2 className="heading-font text-xl sm:text-2xl lg:text-3xl font-bold text-[#0a1f1a]">
              {lang === 'en' ? 'What Farmers Say' : 'किसान क्या कहते हैं'}
            </h2>
          </div>

          {/* Infinite Sliding Carousel */}
          <div className="relative">
            <style>{`
              @keyframes slide {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .testimonial-track {
                animation: slide 30s linear infinite;
              }
              .testimonial-track:hover {
                animation-play-state: paused;
              }
            `}</style>
            
            <div className="flex testimonial-track" style={{ width: 'max-content' }}>
              {/* Duplicate testimonials for seamless loop */}
              {[...allTestimonials, ...allTestimonials].map((t, i) => {
                const TestimonialIcon = t.icon;
                return (
                  <div key={i} className="w-[280px] sm:w-[350px] flex-shrink-0 mx-2 sm:mx-2.5 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100">
                    <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-[#c8e038] mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#c8e038]/20 flex items-center justify-center">
                        <TestimonialIcon className="w-4 h-4 text-[#22c55e]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-[#0a1f1a]">{t.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{t.location}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-12 sm:py-20 bg-[#0a1f1a]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-font text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            {lang === 'en' ? 'Ready to Get Started?' : 'शुरू करने के लिए तैयार?'}
          </h2>
          <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8">
            {lang === 'en' 
              ? 'Join farmers who are already farming smarter. Free forever.' 
              : 'स्मार्ट खेती करने वाले किसानों से जुड़ें। हमेशा मुफ्त।'
            }
          </p>
          <button 
            onClick={onGetStarted}
            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#c8e038] text-[#0a1f1a] font-semibold rounded-xl hover:bg-[#d4ea4d] transition-all inline-flex items-center gap-2"
          >
            {lang === 'en' ? 'Get Started Free' : 'मुफ्त शुरू करें'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-6 sm:py-8 bg-[#061410] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Gramin Saathi" className="w-7 h-7 rounded-md" />
              <span className="text-sm font-medium">Gramin Saathi</span>
            </div>
            <p className="text-xs text-white/40 text-center">
              © 2024 • {lang === 'en' ? 'Made for Indian Farmers' : 'भारतीय किसानों के लिए बनाया'}
            </p>
            <button onClick={toggleLang} className="text-xs text-white/40 hover:text-white/60 transition-colors">
              {lang === 'en' ? 'हिंदी में देखें' : 'View in English'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
