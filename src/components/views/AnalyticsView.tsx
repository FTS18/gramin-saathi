// @ts-nocheck
import { BarChart3, TrendingUp, Sprout } from 'lucide-react';

interface AnalyticsViewProps {
  lang: string;
  t: (key: string) => string;
}

export const AnalyticsView = ({ lang, t }: AnalyticsViewProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">
          {lang === 'en' ? '📊 Agricultural Analytics' : '📊 कृषि विश्लेषण'}
        </h1>
        <p className="text-[var(--text-muted)]">
          {lang === 'en' 
            ? 'AI-powered insights from 773K+ agricultural records'
            : '773K+ कृषि रिकॉर्ड से AI संचालित अंतर्दृष्टि'
          }
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-semibold text-[var(--text-main)]">
              {lang === 'en' ? 'Average Price' : 'औसत मूल्य'}
            </h3>
          </div>
          <p className="text-3xl font-bold text-[var(--primary)]">₹2,474</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {lang === 'en' ? 'Modal price across markets' : 'बाजारों में मोडल मूल्य'}
          </p>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[var(--success)]" />
            <h3 className="font-semibold text-[var(--text-main)]">
              {lang === 'en' ? 'ML Accuracy' : 'ML सटीकता'}
            </h3>
          </div>
          <p className="text-3xl font-bold text-[var(--success)]">90.6%</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {lang === 'en' ? 'Yield prediction model' : 'उपज भविष्यवाणी मॉडल'}
          </p>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Sprout className="w-5 h-5 text-[#c8e038]" />
            <h3 className="font-semibold text-[var(--text-main)]">
              {lang === 'en' ? 'Data Points' : 'डेटा बिंदु'}
            </h3>
          </div>
          <p className="text-3xl font-bold text-[#c8e038]">773K+</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {lang === 'en' ? 'Agricultural records' : 'कृषि रिकॉर्ड'}
          </p>
        </div>
      </div>

      {/* Analysis Insights */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">
          {lang === 'en' ? '🔍 Key Insights' : '🔍 मुख्य अंतर्दृष्टि'}
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2" />
            <div>
              <p className="text-[var(--text-main)] font-medium">
                {lang === 'en' 
                  ? 'Strong correlation between fertilizer and pesticide usage (97%)'
                  : 'उर्वरक और कीटनाशक उपयोग के बीच मजबूत संबंध (97%)'
                }
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--success)] mt-2" />
            <div>
              <p className="text-[var(--text-main)] font-medium">
                {lang === 'en' 
                  ? 'Area under cultivation directly impacts production (97% correlation)'
                  : 'खेती के तहत क्षेत्र सीधे उत्पादन को प्रभावित करता है (97% संबंध)'
                }
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#c8e038] mt-2" />
            <div>
              <p className="text-[var(--text-main)] font-medium">
                {lang === 'en' 
                  ? 'Random Forest model shows best performance for yield prediction'
                  : 'उपज भविष्यवाणी के लिए रैंडम फॉरेस्ट मॉडल सर्वश्रेष्ठ प्रदर्शन दिखाता है'
                }
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--secondary)] mt-2" />
            <div>
              <p className="text-[var(--text-main)] font-medium">
                {lang === 'en' 
                  ? 'Price range: ₹1,100 (25th percentile) to ₹3,205 (75th percentile)'
                  : 'मूल्य सीमा: ₹1,100 (25वां प्रतिशत) से ₹3,205 (75वां प्रतिशत)'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">
          {lang === 'en' ? '🤖 ML Model Performance' : '🤖 ML मॉडल प्रदर्शन'}
        </h2>
        <div className="space-y-4">
          {[
            { name: 'Random Forest', r2: 90.63, rmse: 273.98, color: '#22c55e' },
            { name: 'Gradient Boosting', r2: 90.39, rmse: 277.55, color: '#3b82f6' },
            { name: 'Linear Regression', r2: 39.12, rmse: 698.43, color: '#ef4444' }
          ].map((model) => (
            <div key={model.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[var(--text-main)]">{model.name}</span>
                <span className="text-sm text-[var(--text-muted)]">
                  R² {model.r2}% | RMSE {model.rmse.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-[var(--bg-input)] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${model.r2}%`,
                    backgroundColor: model.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">
          {lang === 'en' ? '📂 Data Sources' : '📂 डेटा स्रोत'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[var(--bg-input)] rounded-xl">
            <p className="font-semibold text-[var(--text-main)] mb-1">
              {lang === 'en' ? 'Agriculture Prices' : 'कृषि मूल्य'}
            </p>
            <p className="text-2xl font-bold text-[var(--primary)]">737K+</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {lang === 'en' ? 'Market records' : 'बाजार रिकॉर्ड'}
            </p>
          </div>
          <div className="p-4 bg-[var(--bg-input)] rounded-xl">
            <p className="font-semibold text-[var(--text-main)] mb-1">
              {lang === 'en' ? 'Crop Yield' : 'फसल उपज'}
            </p>
            <p className="text-2xl font-bold text-[var(--success)]">19.7K</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {lang === 'en' ? 'Yield records' : 'उपज रिकॉर्ड'}
            </p>
          </div>
          <div className="p-4 bg-[var(--bg-input)] rounded-xl">
            <p className="font-semibold text-[var(--text-main)] mb-1">
              {lang === 'en' ? 'ICRISAT District' : 'ICRISAT जिला'}
            </p>
            <p className="text-2xl font-bold text-[#c8e038]">16.1K</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {lang === 'en' ? 'District records' : 'जिला रिकॉर्ड'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
