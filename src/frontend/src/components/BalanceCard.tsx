import { useGetBalance } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BalanceCard() {
  const { data: balance, isLoading } = useGetBalance();

  return (
    <Card className="bg-white shadow-xl">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <h2 className="text-4xl font-bold text-foreground">
                ₹{balance?.toFixed(2) || '0.00'}
              </h2>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">Earn ₹90 on every transaction!</span>
        </div>
      </CardContent>
    </Card>
  );
}
