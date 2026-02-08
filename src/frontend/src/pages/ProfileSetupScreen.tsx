import { useState } from 'react';
import { useSaveCallerUserProfile, useGetCategorizedBankList, useStartOtpChallenge, useVerifyOtp } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Phone, CheckCircle2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupScreen() {
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState<string>('');
  
  const { mutate: saveProfile, isPending: isSaving } = useSaveCallerUserProfile();
  const { data: categorizedBankList, isLoading: banksLoading } = useGetCategorizedBankList();
  const { mutate: startOtp, isPending: isRequestingOtp } = useStartOtpChallenge();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

  // Shared helper to reset OTP state
  const resetOtpState = () => {
    setOtpRequested(false);
    setOtpVerified(false);
    setOtpCode('');
    setDemoOtpCode('');
  };

  const handleMobileNumberChange = (value: string) => {
    setMobileNumber(value);
    // Reset OTP state when mobile number changes
    resetOtpState();
  };

  const handleBankChange = (value: string) => {
    setSelectedBank(value);
    // Reset OTP state when bank changes
    resetOtpState();
  };

  const handleBankAccountNumberChange = (value: string) => {
    setBankAccountNumber(value);
    // Reset OTP state when bank account number changes
    resetOtpState();
  };

  const handleSendOtp = () => {
    // Explicit guards with clear English error messages
    if (!selectedBank) {
      toast.error('Please select a bank first');
      return;
    }

    if (!bankAccountNumber.trim()) {
      toast.error('Please enter your bank account number');
      return;
    }

    if (!mobileNumber.trim()) {
      toast.error('Please enter a mobile number');
      return;
    }

    // Generate a random 6-digit OTP for demo
    const randomOtp = Math.floor(100000 + Math.random() * 900000);
    const otpBigInt = BigInt(randomOtp);

    startOtp(
      { mobileNumber: mobileNumber.trim(), code: otpBigInt },
      {
        onSuccess: () => {
          setOtpRequested(true);
          setDemoOtpCode(randomOtp.toString());
        },
      }
    );
  };

  const handleVerifyOtp = () => {
    if (!otpCode.trim()) {
      toast.error('Please enter the OTP code');
      return;
    }

    const enteredOtpBigInt = BigInt(otpCode.trim());

    verifyOtp(enteredOtpBigInt, {
      onSuccess: () => {
        setOtpVerified(true);
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bankAccountNumber.trim() || !mobileNumber.trim() || !selectedBank) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!otpVerified) {
      toast.error('Please verify your mobile number with OTP first');
      return;
    }

    saveProfile({
      bankAccountNumber: bankAccountNumber.trim(),
      mobileNumber: mobileNumber.trim(),
      selectedBank: selectedBank,
    });
  };

  // Updated condition: require bank, account number, and mobile number before allowing OTP request
  const canSendOtp = selectedBank && bankAccountNumber.trim() && mobileNumber.trim() && !otpRequested && !isRequestingOtp;
  const canVerifyOtp = otpRequested && otpCode.trim() && !otpVerified && !isVerifyingOtp;
  const canSubmit = bankAccountNumber.trim() && mobileNumber.trim() && selectedBank && otpVerified && !isSaving;

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
            Enter your bank details and verify your mobile number to start sending and receiving money
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bank" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Select Bank
              </Label>
              <Select value={selectedBank} onValueChange={handleBankChange}>
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
                onChange={(e) => handleBankAccountNumberChange(e.target.value)}
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
                  disabled={otpVerified}
                />
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!canSendOtp || otpVerified}
                  variant="outline"
                  className="h-12 px-4 whitespace-nowrap"
                >
                  {isRequestingOtp ? 'Sending...' : otpRequested ? 'Sent' : 'Send OTP'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This will be your UPI ID for receiving payments
              </p>
            </div>

            {otpRequested && !otpVerified && (
              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Enter OTP
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    className="h-12 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!canVerifyOtp}
                    variant="default"
                    className="h-12 px-4"
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
                {demoOtpCode && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-800">
                      <strong>Demo OTP for {selectedBank}:</strong> {demoOtpCode}
                      <br />
                      <span className="text-xs">In production, this would be sent via SMS by your bank</span>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {otpVerified && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-green-800">
                  Mobile number verified successfully
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {isSaving ? 'Setting up...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
