import { useState, useEffect } from 'react';
import { useSendMoney, useGetBalance } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Gift, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface SendMoneyCardProps {
  userMobile: string;
  scannedMobile?: string | null;
  onMobileUsed?: () => void;
}

export default function SendMoneyCard({ userMobile, scannedMobile, onMobileUsed }: SendMoneyCardProps) {
  const [receiverMobile, setReceiverMobile] = useState('');
  const [amount, setAmount] = useState('');
  const { mutate: sendMoney, isPending } = useSendMoney();
  const { data: balance } = useGetBalance();

  // Auto-fill mobile number from QR scan
  useEffect(() => {
    if (scannedMobile) {
      setReceiverMobile(scannedMobile);
      if (onMobileUsed) {
        onMobileUsed();
      }
    }
  }, [scannedMobile, onMobileUsed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);

    if (!receiverMobile.trim()) {
      toast.error('Please enter recipient mobile number');
      return;
    }

    if (receiverMobile.trim() === userMobile) {
      toast.error('Cannot send money to yourself');
      return;
    }

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (balance !== undefined && amountNum > balance) {
      toast.error('Insufficient balance');
      return;
    }

    sendMoney(
      { receiverMobile: receiverMobile.trim(), amount: amountNum },
      {
        onSuccess: () => {
          setReceiverMobile('');
          setAmount('');
        },
      }
    );
  };

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <img 
              src="/assets/generated/money-transfer-icon-transparent.dim_64x64.png" 
              alt="Send Money" 
              className="h-7 w-7"
            />
          </div>
          <div>
            <CardTitle>Send Money</CardTitle>
            <CardDescription>Transfer funds instantly</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {scannedMobile && (
            <Alert className="bg-green-50 border-green-200">
              <QrCode className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-800">
                QR code scanned! Mobile number auto-filled.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="receiver">Recipient Mobile Number</Label>
            <Input
              id="receiver"
              type="tel"
              placeholder="Enter mobile number or scan QR"
              value={receiverMobile}
              onChange={(e) => setReceiverMobile(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-lg"
            />
            {balance !== undefined && (
              <p className="text-xs text-muted-foreground">
                Available balance: ₹{balance.toFixed(2)}
              </p>
            )}
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-start gap-2">
            <Gift className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-purple-900">
              <span className="font-semibold">Bonus:</span> You'll receive ₹90 reward after this transaction!
            </p>
          </div>

          <Button
            type="submit"
            disabled={isPending || !receiverMobile.trim() || !amount}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isPending ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Send Money
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
