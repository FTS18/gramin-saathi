import { AppLayout } from '@/components/layout/AppLayout';
import { CashHealthMeter } from '@/components/home/CashHealthMeter';
import { QuickActions } from '@/components/home/QuickActions';
import { FestivalPredictor } from '@/components/home/FestivalPredictor';
import { SchemeSuggestions } from '@/components/home/SchemeSuggestions';

const Index = () => {
  return (
    <AppLayout>
      <div className="container px-4 py-6 space-y-6">
        {/* Greeting */}
        <div className="space-y-1">
          <p className="text-muted-foreground">नमस्ते 🙏</p>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            राम जी, शुभ प्रभात!
          </h1>
        </div>

        {/* Cash Health Meter */}
        <CashHealthMeter />

        {/* Quick Actions */}
        <QuickActions />

        {/* Festival Expense Predictor */}
        <FestivalPredictor />

        {/* Scheme Suggestions */}
        <SchemeSuggestions />
      </div>
    </AppLayout>
  );
};

export default Index;
