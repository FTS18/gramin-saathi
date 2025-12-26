// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Leaf,
  ArrowRight,
  Play,
  ChevronDown,
  Menu,
  X,
  Quote
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  lang: string;
  toggleLang: () => void;
}

export default function LandingPage({ onGetStarted, lang, toggleLang }: LandingPageProps) {
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
      crop: '🌾',
      quote: lang === 'en' 
        ? 'Found PM-KISAN through this app. Got ₹6,000 deposited directly!' 
        : 'इस ऐप से PM-KISAN मिला। ₹6,000 सीधे जमा हुए!'
    },
    {
      name: lang === 'en' ? 'Sunita Devi' : 'सुनीता देवी',
      location: lang === 'en' ? 'Vaishali, Bihar' : 'वैशाली, बिहार',
      crop: '🌽',
      quote: lang === 'en' 
        ? 'I just speak in Hindi and it writes everything. No typing needed!' 
        : 'बस हिंदी में बोलो, सब लिख जाता है। टाइप नहीं करना!'
    },
    {
      name: lang === 'en' ? 'Ganesh Patil' : 'गणेश पाटिल',
      location: lang === 'en' ? 'Nashik, Maharashtra' : 'नासिक, महाराष्ट्र',
      crop: '🍇',
      quote: lang === 'en' 
        ? 'Weather alert saved my grape crop. Got 2 days advance warning!' 
        : 'मौसम अलर्ट ने अंगूर की फसल बचाई। 2 दिन पहले चेतावनी मिली!'
    },
    {
      name: lang === 'en' ? 'Kavita Singh' : 'कविता सिंह',
      location: lang === 'en' ? 'Lucknow, UP' : 'लखनऊ, UP',
      crop: '🥔',
      quote: lang === 'en' 
        ? 'Mandi prices helped me sell potatoes at better rate.' 
        : 'मंडी भाव से आलू अच्छे दाम पर बेचा।'
    },
    {
      name: lang === 'en' ? 'Mohan Reddy' : 'मोहन रेड्डी',
      location: lang === 'en' ? 'Anantapur, AP' : 'अनंतपुर, AP',
      crop: '🥜',
      quote: lang === 'en' 
        ? 'AI advice on groundnut pest control was very helpful.' 
        : 'मूंगफली कीट नियंत्रण पर AI सलाह बहुत मददगार थी।'
    },
    {
      name: lang === 'en' ? 'Priya Sharma' : 'प्रिया शर्मा',
      location: lang === 'en' ? 'Jaipur, Rajasthan' : 'जयपुर, राजस्थान',
      crop: '🌶️',
      quote: lang === 'en' 
        ? 'Easy to track daily expenses. Very useful for small farmers.' 
        : 'रोज का खर्च ट्रैक करना आसान। छोटे किसानों के लिए उपयोगी।'
    },
    {
      name: lang === 'en' ? 'Arjun Yadav' : 'अर्जुन यादव',
      location: lang === 'en' ? 'Indore, MP' : 'इंदौर, MP',
      crop: '🌱',
      quote: lang === 'en' 
        ? 'Learned about organic farming from Seekho section.' 
        : 'सीखो सेक्शन से जैविक खेती सीखी।'
    },
    {
      name: lang === 'en' ? 'Lakshmi Bai' : 'लक्ष्मी बाई',
      location: lang === 'en' ? 'Nagpur, Maharashtra' : 'नागपुर, महाराष्ट्र',
      crop: '🍊',
      quote: lang === 'en' 
        ? 'Got crop insurance scheme through Yojana Hub.' 
        : 'योजना हब से फसल बीमा योजना मिली।'
    },
    {
      name: lang === 'en' ? 'Ravi Meena' : 'रवि मीणा',
      location: lang === 'en' ? 'Kota, Rajasthan' : 'कोटा, राजस्थान',
      crop: '🌿',
      quote: lang === 'en' 
        ? 'Works offline in my village. Very important feature!' 
        : 'मेरे गांव में ऑफलाइन काम करता है। बहुत जरूरी फीचर!'
    },
    {
      name: lang === 'en' ? 'Sarita Kumari' : 'सरिता कुमारी',
      location: lang === 'en' ? 'Patna, Bihar' : 'पटना, बिहार',
      crop: '🍚',
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
      icon: '🌾',
      title: lang === 'en' ? 'AI Farming Advisor' : 'AI कृषि सलाहकार',
      desc: lang === 'en' 
        ? 'Get personalized crop advice and pest control tips in your language' 
        : 'अपनी भाषा में फसल सलाह और कीट नियंत्रण टिप्स पाएं'
    },
    {
      icon: '📒',
      title: lang === 'en' ? 'Voice Khata Book' : 'वॉइस खाता बुक',
      desc: lang === 'en' 
        ? 'Just speak to track income and expenses. No typing needed!' 
        : 'बस बोलकर आय-खर्च का हिसाब रखें। टाइप नहीं करना!'
    },
    {
      icon: '🏛️',
      title: lang === 'en' ? 'Government Schemes' : 'सरकारी योजनाएं',
      desc: lang === 'en' 
        ? 'Discover PM-KISAN, crop insurance & schemes you qualify for' 
        : 'PM-KISAN, फसल बीमा और पात्र योजनाएं खोजें'
    },
    {
      icon: '📊',
      title: lang === 'en' ? 'Live Mandi Rates' : 'लाइव मंडी भाव',
      desc: lang === 'en' 
        ? 'Real-time prices from nearby markets. Sell at best price!' 
        : 'नजदीकी मंडियों से रियल-टाइम भाव। सबसे अच्छे दाम पर बेचें!'
    },
    {
      icon: '🌤️',
      title: lang === 'en' ? 'Weather Alerts' : 'मौसम अलर्ट',
      desc: lang === 'en' 
        ? '7-day forecast with alerts to protect your crops' 
        : 'फसल सुरक्षा के लिए 7 दिन का पूर्वानुमान और अलर्ट'
    },
    {
      icon: '📚',
      title: lang === 'en' ? 'Learn & Grow' : 'सीखें और बढ़ें',
      desc: lang === 'en' 
        ? 'Financial literacy and modern farming techniques' 
        : 'वित्तीय साक्षरता और आधुनिक खेती तकनीक'
    }
  ];

  // Realistic hackathon numbers
  const stats = [
    { value: '1,200+', label: lang === 'en' ? 'Active Users' : 'सक्रिय उपयोगकर्ता' },
    { value: '₹15L+', label: lang === 'en' ? 'Transactions Tracked' : 'लेनदेन ट्रैक किए' },
    { value: '50+', label: lang === 'en' ? 'Villages Reached' : 'गांव पहुंचे' }
  ];

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
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#c8e038] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#0a1f1a]" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Gramin <span className="text-[#c8e038]">Saathi</span>
              </span>
            </div>

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
          <div className="md:hidden bg-[#0a1f1a] border-t border-white/10 px-6 py-4 space-y-3">
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
      <section className="relative min-h-[90vh] flex items-center pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f1a] via-[#0a1f1a]/90 to-[#0a1f1a]/70" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#c8e038]/15 border border-[#c8e038]/30 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-[#c8e038] rounded-full" />
                <span className="text-xs text-[#c8e038] font-medium">
                  {lang === 'en' ? 'Built for Indian Farmers' : 'भारतीय किसानों के लिए बनाया'}
                </span>
              </div>

              {/* Heading */}
              <h1 className="heading-font text-4xl sm:text-5xl font-bold leading-[1.1] mb-5">
                {lang === 'en' ? (
                  <>Your Digital <span className="text-[#c8e038]">Farming</span> Companion</>
                ) : (
                  <>आपका डिजिटल <span className="text-[#c8e038]">खेती</span> साथी</>
                )}
              </h1>

              {/* Subheading */}
              <p className="text-base text-white/60 mb-8 leading-relaxed max-w-md">
                {lang === 'en' 
                  ? 'Track finances by voice, access schemes, get AI crop advice, and check mandi prices—all in your language.' 
                  : 'आवाज से हिसाब रखें, योजनाएं पाएं, AI फसल सलाह लें, मंडी भाव देखें—अपनी भाषा में।'
                }
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <button 
                  onClick={onGetStarted}
                  className="group px-6 py-3 bg-[#c8e038] text-[#0a1f1a] font-semibold rounded-xl hover:bg-[#d4ea4d] transition-all flex items-center gap-2"
                >
                  {lang === 'en' ? 'Start Free' : 'मुफ्त शुरू करें'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button className="px-6 py-3 border border-white/20 text-white font-medium rounded-xl hover:border-white/40 transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {lang === 'en' ? 'Watch Demo' : 'डेमो देखें'}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-8">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold text-[#c8e038]">{stat.value}</p>
                    <p className="text-xs text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Feature Cards */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-[#0d2922]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c8e038] flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-[#0a1f1a]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Gramin Saathi</p>
                      <p className="text-xs text-white/50">{lang === 'en' ? 'Your farming partner' : 'आपका खेती साथी'}</p>
                    </div>
                  </div>
                  
                  {/* Mini Feature List */}
                  <div className="space-y-3">
                    {[
                      { icon: '🎙️', text: lang === 'en' ? 'Voice Khata - Track by speaking' : 'वॉइस खाता - बोलकर ट्रैक करें' },
                      { icon: '🌾', text: lang === 'en' ? 'AI Crop Advisor - Smart tips' : 'AI फसल सलाह - स्मार्ट टिप्स' },
                      { icon: '📊', text: lang === 'en' ? 'Live Mandi - Best prices' : 'लाइव मंडी - सबसे अच्छे दाम' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm text-white/80">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Card - Weather */}
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌤️</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">28°C</p>
                      <p className="text-[10px] text-gray-500">{lang === 'en' ? 'Good for sowing' : 'बुवाई के लिए अच्छा'}</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card - Transaction */}
                <div className="absolute -bottom-4 -left-4 bg-[#c8e038] p-3 rounded-xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✅</span>
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 bg-[#f8f6f0]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-[#22c55e] font-medium mb-3">
              {lang === 'en' ? 'Features' : 'विशेषताएं'}
            </p>
            <h2 className="heading-font text-2xl sm:text-3xl font-bold text-[#0a1f1a]">
              {lang === 'en' ? 'Everything You Need to Farm Smarter' : 'स्मार्ट खेती के लिए सब कुछ'}
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#c8e038]/50 hover:shadow-lg transition-all duration-300"
              >
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="text-base font-medium text-[#0a1f1a] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-[#0d2922]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#1a3d33]">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                  alt="Person using smartphone"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-xl max-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#c8e038] flex items-center justify-center text-sm">🎙️</div>
                  <div>
                    <p className="text-xs font-semibold text-[#0a1f1a]">{lang === 'en' ? 'Voice Entry' : 'आवाज से'}</p>
                    <p className="text-[10px] text-gray-500">{lang === 'en' ? '₹500 added' : '₹500 जोड़ा'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-xs uppercase tracking-widest text-[#c8e038] font-medium mb-3">
                {lang === 'en' ? 'Easy to Use' : 'उपयोग में आसान'}
              </p>
              <h2 className="heading-font text-2xl sm:text-3xl font-bold mb-6">
                {lang === 'en' ? 'Simple Enough for Everyone' : 'सभी के लिए आसान'}
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                {lang === 'en' 
                  ? 'No complicated forms. Just speak in your language and the app does the rest. Works even without internet connection.' 
                  : 'कोई जटिल फॉर्म नहीं। बस अपनी भाषा में बोलें। इंटरनेट के बिना भी काम करता है।'
                }
              </p>

              <div className="space-y-4">
                {[
                  { icon: '🗣️', text: lang === 'en' ? 'Voice-first in 5+ languages' : '5+ भाषाओं में वॉइस-फर्स्ट' },
                  { icon: '📴', text: lang === 'en' ? 'Works offline' : 'ऑफलाइन काम करता है' },
                  { icon: '🔒', text: lang === 'en' ? 'Your data stays private' : 'आपका डेटा सुरक्षित' },
                  { icon: '💰', text: lang === 'en' ? 'Completely free' : 'पूरी तरह मुफ्त' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-white/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMPACT ===== */}
      <section id="impact" className="py-20 bg-[#0a1f1a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-[#c8e038] font-medium mb-3">
              {lang === 'en' ? 'Our Impact' : 'हमारा प्रभाव'}
            </p>
            <h2 className="heading-font text-2xl sm:text-3xl font-bold">
              {lang === 'en' ? 'Making a Real Difference' : 'वास्तविक बदलाव ला रहे हैं'}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-3xl sm:text-4xl font-bold text-[#c8e038] mb-2">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="stories" className="py-20 bg-[#f8f6f0] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-[#22c55e] font-medium mb-3">
              {lang === 'en' ? 'Success Stories' : 'सफलता की कहानियां'}
            </p>
            <h2 className="heading-font text-2xl sm:text-3xl font-bold text-[#0a1f1a]">
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
                animation: slide 25s linear infinite;
              }
              .testimonial-track:hover {
                animation-play-state: paused;
              }
            `}</style>
            
            <div className="flex testimonial-track" style={{ width: 'max-content' }}>
              {/* Duplicate testimonials for seamless loop */}
              {[...allTestimonials, ...allTestimonials].map((t, i) => (
                <div key={i} className="w-[350px] flex-shrink-0 mx-2.5 p-6 bg-white rounded-2xl border border-gray-100">
                  <Quote className="w-5 h-5 text-[#c8e038] mb-3" />
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#c8e038]/20 flex items-center justify-center text-base">
                      {t.crop}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0a1f1a]">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 bg-[#0a1f1a]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="heading-font text-2xl sm:text-3xl font-bold mb-4">
            {lang === 'en' ? 'Ready to Get Started?' : 'शुरू करने के लिए तैयार?'}
          </h2>
          <p className="text-white/60 mb-8">
            {lang === 'en' 
              ? 'Join farmers who are already farming smarter. Free forever.' 
              : 'स्मार्ट खेती करने वाले किसानों से जुड़ें। हमेशा मुफ्त।'
            }
          </p>
          <button 
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-[#c8e038] text-[#0a1f1a] font-semibold rounded-xl hover:bg-[#d4ea4d] transition-all inline-flex items-center gap-2"
          >
            {lang === 'en' ? 'Get Started Free' : 'मुफ्त शुरू करें'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 bg-[#061410] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#c8e038] flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#0a1f1a]" />
              </div>
              <span className="text-sm font-medium">Gramin Saathi</span>
            </div>
            <p className="text-xs text-white/40">
              © 2024 • {lang === 'en' ? 'Made with ❤️ for Indian Farmers' : 'भारतीय किसानों के लिए ❤️ से बनाया'}
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
