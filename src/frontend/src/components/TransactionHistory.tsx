import { useGetTransactionHistory } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownLeft, Gift, History as HistoryIcon } from 'lucide-react';
import { TransactionType } from '../backend';

export default function TransactionHistory() {
  const { data: transactions, isLoading } = useGetTransactionHistory();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <HistoryIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <HistoryIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start sending money to see your history
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {transactions.map((transaction, index) => {
                const isSent = transaction.transactionType === TransactionType.sent;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSent
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {isSent ? (
                        <ArrowUpRight className="h-6 w-6" />
                      ) : (
                        <ArrowDownLeft className="h-6 w-6" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="font-semibold text-foreground">
                            {isSent ? 'Sent to' : 'Received from'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.counterpartyMobile}
                          </p>
                        </div>
                        <p
                          className={`font-bold text-lg ${
                            isSent ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {isSent ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <Gift className="h-3 w-3 mr-1" />
                          +₹{transaction.rewardAmount.toFixed(0)} reward
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(transaction.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
