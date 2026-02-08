import { useState } from 'react';
import type { UserProfile } from '../backend';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import SendMoneyCard from '../components/SendMoneyCard';
import TransactionHistory from '../components/TransactionHistory';
import QRCodeGenerator from '../components/QRCodeGenerator';
import QRCodeScanner from '../components/QRCodeScanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Send, History, QrCode, ScanLine } from 'lucide-react';

interface MainAppProps {
  userProfile: UserProfile;
}

export default function MainApp({ userProfile }: MainAppProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [scannedMobile, setScannedMobile] = useState<string | null>(null);

  const handleQRScanned = (mobile: string) => {
    setScannedMobile(mobile);
    setActiveTab('send');
  };

  const handleMobileUsed = () => {
    setScannedMobile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
      {/* Header */}
      <Header userProfile={userProfile} />

      {/* Main Content */}
      <main className="pb-24 px-4 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl mx-auto">
          <TabsContent value="home" className="mt-0 space-y-6">
            <BalanceCard />
            <SendMoneyCard userMobile={userProfile.mobileNumber} scannedMobile={scannedMobile} onMobileUsed={handleMobileUsed} />
          </TabsContent>

          <TabsContent value="send" className="mt-0">
            <SendMoneyCard userMobile={userProfile.mobileNumber} scannedMobile={scannedMobile} onMobileUsed={handleMobileUsed} />
          </TabsContent>

          <TabsContent value="scan" className="mt-0">
            <QRCodeScanner onQRScanned={handleQRScanned} />
          </TabsContent>

          <TabsContent value="qr" className="mt-0">
            <QRCodeGenerator userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto px-2">
          <div className="grid grid-cols-5 gap-1 py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('send')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                activeTab === 'send'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Send className="h-5 w-5" />
              <span className="text-xs font-medium">Send</span>
            </button>

            <button
              onClick={() => setActiveTab('scan')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                activeTab === 'scan'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ScanLine className="h-5 w-5" />
              <span className="text-xs font-medium">Scan</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                activeTab === 'qr'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <QrCode className="h-5 w-5" />
              <span className="text-xs font-medium">My QR</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <History className="h-5 w-5" />
              <span className="text-xs font-medium">History</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <footer className="pb-20 pt-8 text-center text-white/70 text-xs px-4">
        © 2025. Built with love using{' '}
        <a href="https://caffeine.ai" className="underline hover:text-white/90">
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
