import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Smartphone, Shield, Zap } from 'lucide-react';

export default function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">PayFast</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="max-w-md w-full text-center">
          {/* Hero Image */}
          <div className="mb-8">
            <img 
              src="/assets/generated/smartphone-upi.dim_400x600.png" 
              alt="UPI Payment" 
              className="w-64 h-auto mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-white mb-4">
            Fast & Secure Payments
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Send money instantly with rewards on every transaction
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <Shield className="h-8 w-8 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Secure</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <Zap className="h-8 w-8 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Instant</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <img 
                src="/assets/generated/reward-badge-transparent.dim_64x64.png" 
                alt="Rewards" 
                className="h-8 w-8 mx-auto mb-2"
              />
              <p className="text-white text-sm font-medium">Rewards</p>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold text-lg h-14 rounded-full shadow-xl"
          >
            {isLoggingIn ? 'Logging in...' : 'Get Started'}
          </Button>

          <p className="text-white/70 text-sm mt-6">
            Secure login powered by Internet Identity
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/60 text-sm">
        © 2025. Built with love using{' '}
        <a href="https://caffeine.ai" className="underline hover:text-white/80">
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
