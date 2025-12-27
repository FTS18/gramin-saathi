import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Mic, 
  Sparkles, 
  Loader, 
  Search, 
  Filter, 
  X, 
  ChevronRight, 
  Calendar,
  Download,
  Share2,
  BarChart3,
  Leaf,
  Save
} from 'lucide-react';
import { db } from '../../lib/firebase-config';
import { generateDummyTransactions, callGeminiWithQuota, getRemainingQuota } from '../../lib/app-utils';
import { startVoiceRecognition } from '../../lib/voice-utils';
import { GlassCard } from '../custom-ui/Cards';

export function KhataView({ user, appId, t, lang }: any) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('expense');
  const [saving, setSaving] = useState(false);
  
  // Analytics State
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Magic AI State
  const [magicInput, setMagicInput] = useState('');
  const [magicLoading, setMagicLoading] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceField, setVoiceField] = useState<string | null>(null); // 'amount' or 'desc'
  
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
  }, [user, lang, appId]);

  // Filter transactions
  const filteredTransactions = transactions.filter(tr => {
    // Type filter
    if (filterType !== 'all' && tr.type !== filterType) return false;
    
    // Date filter
    if (filterDateRange !== 'all') {
      const txnDate = tr.date?.toDate ? tr.date.toDate() : (tr.date ? new Date(tr.date) : new Date());
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24));
      
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
      tr.displayDate || (tr.date?.toDate ? tr.date.toDate().toLocaleDateString() : (tr.date ? new Date(tr.date).toLocaleDateString() : 'N/A')),
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

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !user) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'khata'), {
        amount: Number(amount),
        description: desc || (type === 'income' ? 'Income' : 'Expense'),
        type,
        date: serverTimestamp(),
        displayDate: new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN')
      });
      setAmount('');
      setDesc('');
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const deleteTrans = async (id: string) => {
    if (!user) return;
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
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const data = await callGeminiWithQuota(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-001:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
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
  const handleVoiceInput = (field: string) => {
    setIsListening(true);
    setVoiceField(field);
    
    startVoiceRecognition((result) => {
      if (field === 'amount') {
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
        <div className="mb-3 md:mb-6 p-2.5 md:p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-lg md:rounded-xl border border-[var(--primary)] border-dashed">
          <label className="text-[10px] md:text-xs font-bold text-[var(--primary)] flex items-center gap-1 mb-1.5">
            <Sparkles size={10} /> {lang === 'en' ? 'Magic Add' : 'जादुई जोड़ें'}
          </label>
          <div className="flex gap-1.5 md:gap-2">
            <input 
              type="text" 
              value={magicInput}
              onChange={e => setMagicInput(e.target.value)}
              className="flex-1 bg-transparent border-b border-[var(--primary)] text-xs md:text-sm p-1 focus:outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]"
              placeholder={lang === 'en' ? 'E.g. Sold wheat for 5000' : 'उदा. 5000 में गेहूं बेचा'}
              onKeyDown={e => e.key === 'Enter' && handleMagicParse()}
            />
            <button 
              onClick={handleMagicParse}
              disabled={magicLoading}
              className="bg-[var(--primary)] text-black px-2 md:px-3 py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold disabled:opacity-50"
            >
              {magicLoading ? '...' : lang === 'en' ? 'Add' : 'जोड़ें'}
            </button>
          </div>
        </div>

        <form onSubmit={addTransaction} className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
             <button
               type="button"
               onClick={() => setType('income')}
               className={`p-2 md:p-3 rounded-lg border-2 font-bold text-xs md:text-sm transition-all ${type === 'income' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-[var(--border)] text-[var(--text-muted)]'}`}
             >
               {lang === 'en' ? 'Income' : 'आय'}
             </button>
             <button
               type="button"
               onClick={() => setType('expense')}
               className={`p-2 md:p-3 rounded-lg border-2 font-bold text-xs md:text-sm transition-all ${type === 'expense' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-[var(--border)] text-[var(--text-muted)]'}`}
             >
               {lang === 'en' ? 'Expense' : 'खर्च'}
             </button>
          </div>

          <div>
            <label className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase flex items-center justify-between mb-1">
              <span>{lang === 'en' ? 'Amount' : 'राशि'}</span>
              <button
                type="button"
                onClick={() => handleVoiceInput('amount')}
                disabled={isListening}
                className="p-1 rounded-lg bg-[var(--bg-input)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
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
             <label className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase flex items-center justify-between mb-1">
               <span>{lang === 'en' ? 'Description' : 'विवरण'}</span>
               <button
                 type="button"
                 onClick={() => handleVoiceInput('desc')}
                 disabled={isListening}
                 className="p-1 rounded-lg bg-[var(--bg-input)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
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
            disabled={saving || !amount}
            className="w-full py-3 md:py-4 bg-[var(--text-main)] text-[var(--bg-card)] rounded-lg md:rounded-xl font-bold text-sm md:text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {saving ? <Loader size={20} className="animate-spin" /> : <Save size={18} />}
            {lang === 'en' ? 'Save' : 'सहेजें'}
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="flex flex-col bg-[var(--bg-card)] md:bg-transparent rounded-xl md:rounded-none shadow-[var(--shadow-card)] md:shadow-none border border-[var(--border)] md:border-none">
        <div className="p-3 md:p-0 bg-[var(--bg-card)] md:bg-transparent border-b border-[var(--border)] md:border-none sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm md:text-lg text-[var(--text-main)]">{lang === 'en' ? 'Recent Transactions' : 'हाल के लेनदेन'}</h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 md:p-2 rounded-lg transition-all ${showFilters ? 'bg-[var(--primary)] text-black' : 'bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
              >
                <Filter size={14} />
              </button>
              <button
                onClick={exportToCSV}
                className="p-1.5 md:p-2 rounded-lg bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--primary)]"
              >
                <Download size={14} />
              </button>
              <button
                onClick={exportSummary}
                className="p-1.5 md:p-2 rounded-lg bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--primary)]"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="space-y-2 pb-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search...' : 'खोजें...'}
                  className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-xs text-[var(--text-main)] focus:outline-none"
                />
              </div>
              
              <div className="flex gap-1.5">
                {['all', 'income', 'expense'].map(ft => (
                  <button
                    key={ft}
                    onClick={() => setFilterType(ft)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all ${filterType === ft ? 'bg-[var(--primary)] text-black' : 'bg-[var(--bg-input)] text-[var(--text-muted)]'}`}
                  >
                    {ft === 'all' ? (lang === 'en' ? 'All' : 'सभी') : ft === 'income' ? (lang === 'en' ? 'Income' : 'आय') : (lang === 'en' ? 'Expense' : 'खर्च')}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Analytics Button */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex-1 py-1.5 md:py-2 px-2 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] md:text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <BarChart3 size={12} />
              {lang === 'en' ? 'Analytics' : 'विश्लेषण'}
            </button>
          </div>
        </div>
        
        {/* Analytics Section */}
        {showAnalytics && (
          <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase">{lang === 'en' ? 'Income' : 'आय'}</p>
                <p className="text-sm font-bold text-emerald-500">₹{filteredTotals.income}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase">{lang === 'en' ? 'Expense' : 'खर्च'}</p>
                <p className="text-sm font-bold text-red-500">₹{filteredTotals.expense}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase">{lang === 'en' ? 'Balance' : 'शेष'}</p>
                <p className="text-sm font-bold text-blue-500">₹{filteredTotals.income - filteredTotals.expense}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-3 md:p-0 space-y-2 max-h-[60vh] md:max-h-[50vh] overflow-y-auto mt-4">
          {filteredTransactions.length === 0 && (
             <div className="text-center py-8 text-[var(--text-muted)]">
               <Leaf className="mx-auto mb-2 opacity-50" size={28} />
               <p className="text-xs">{lang === 'en' ? "No records found." : "कोई रिकॉर्ड नहीं मिला।"}</p>
             </div>
          )}
          {filteredTransactions.map(tr => (
            <div key={tr.id} className="group flex items-center justify-between p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)] transition-all">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-full ${tr.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                   {tr.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                 </div>
                 <div className="min-w-0">
                   <p className="font-bold text-xs text-[var(--text-main)] truncate">{tr.description}</p>
                   <p className="text-[10px] text-[var(--text-muted)]">{tr.displayDate || 'Today'}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className={`font-bold text-sm ${tr.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                   {tr.type === 'income' ? '+' : '-'}₹{tr.amount}
                 </p>
                 {!isDemoMode && (
                   <button onClick={() => deleteTrans(tr.id)} className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                     {lang === 'en' ? 'Delete' : 'हटाएं'}
                   </button>
                 )}
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
