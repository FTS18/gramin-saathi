import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const CashHealthMeter = () => {
  const healthScore = 72;
  const monthlyIncome = 15000;
  const monthlyExpense = 11200;
  const savings = monthlyIncome - monthlyExpense;

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="w-5 h-5 text-primary" />
          आज का पैसा स्वास्थ्य
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">स्वास्थ्य स्कोर</span>
          <span className="text-2xl font-bold text-primary">{healthScore}%</span>
        </div>
        <Progress value={healthScore} className="h-3" />
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50">
            <TrendingUp className="w-4 h-4 text-accent-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">आमदनी</p>
              <p className="font-semibold text-foreground">₹{monthlyIncome.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <div>
              <p className="text-xs text-muted-foreground">खर्च</p>
              <p className="font-semibold text-foreground">₹{monthlyExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-muted-foreground">इस महीने की बचत</p>
          <p className="text-xl font-bold text-primary">₹{savings.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};
