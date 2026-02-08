import { useState, useEffect } from 'react';
import { useSaveCallerUserProfile, useGetCategorizedBankList } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Phone, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Generate a mock device SIM number (10 digits)
const generateDeviceSIM = (): string => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Get or create device SIM number
const getDeviceSIM = (): string => {
  const stored = localStorage.getItem('deviceSIM');
  if (stored) {
    return stored;
  }
  const newSIM = generateDeviceSIM();
  localStorage.setItem('deviceSIM', newSIM);
  return newSIM;
};

export default function ProfileSetupScreen() {
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [deviceSIM, setDeviceSIM] = useState('');
  const [simVerified, setSimVerified] = useState<boolean | null>(null);
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();
  const { data: categorizedBankList, isLoading: banksLoading } = useGetCategorizedBankList();

  useEffect(() => {
    // Get or generate device SIM on mount
    const sim = getDeviceSIM();
    setDeviceSIM(sim);
  }, []);

  const handleMobileNumberChange = (value: string) => {
    setMobileNumber(value);
    // Reset verification status when user changes the number
    setSimVerified(null);
  };

  const verifySIM = () => {
    if (!mobileNumber.trim()) {
      return;
    }

    // Check if entered mobile matches device SIM
    if (mobileNumber.trim() === deviceSIM) {
      setSimVerified(true);
      toast.success('Device SIM verified successfully ✅');
    } else {
      setSimVerified(false);
      toast.error('SIM number mismatch – cannot link account');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bankAccountNumber.trim() || !mobileNumber.trim() || !selectedBank) {
      toast.error('Please fill in all fields');
      return;
    }

    // Verify SIM before submitting if not already verified
    if (simVerified === null) {
      verifySIM();
      return;
    }

    // Only allow submission if SIM is verified
    if (simVerified !== true) {
      toast.error('Please verify your SIM number first');
      return;
    }

    saveProfile({
      bankAccountNumber: bankAccountNumber.trim(),
      mobileNumber: mobileNumber.trim(),
      selectedBank: selectedBank,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4">
            <img 
              src="/assets/generated/bank-icon-transparent.dim_64x64.png" 
              alt="Bank" 
              className="h-16 w-16 mx-auto"
            />
          </div>
          <CardTitle className="text-2xl">Link Your Bank Account</CardTitle>
          <CardDescription>
            Enter your bank details to start sending and receiving money
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device SIM Info */}
            <Alert className="bg-blue-50 border-blue-200">
              <Phone className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                <strong>Device SIM:</strong> {deviceSIM}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="bank" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Select Bank
              </Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose your bank" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {banksLoading ? (
                    <SelectItem value="loading" disabled>Loading banks...</SelectItem>
                  ) : (
                    categorizedBankList?.map((category) => (
                      <SelectGroup key={category.category}>
                        <SelectLabel className="font-semibold text-sm text-primary">
                          {category.category}
                        </SelectLabel>
                        {category.banks.map((bank) => (
                          <SelectItem key={bank.code} value={bank.name}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccount" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Bank Account Number
              </Label>
              <Input
                id="bankAccount"
                type="text"
                placeholder="Enter your account number"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Mobile Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => handleMobileNumberChange(e.target.value)}
                  required
                  className="h-12 flex-1"
                />
                <Button
                  type="button"
                  onClick={verifySIM}
                  disabled={!mobileNumber.trim() || simVerified !== null}
                  variant="outline"
                  className="h-12 px-4"
                >
                  Verify
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This will be your UPI ID for receiving payments
              </p>

              {/* Verification Status */}
              {simVerified === true && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-800">
                    Device SIM verified successfully ✅
                  </AlertDescription>
                </Alert>
              )}

              {simVerified === false && (
                <Alert className="bg-red-50 border-red-200">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm text-red-800">
                    SIM number mismatch – cannot link account
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending || !bankAccountNumber.trim() || !mobileNumber.trim() || !selectedBank || simVerified !== true}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {isPending ? 'Setting up...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
