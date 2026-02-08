import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetBalance, useGetTransactionHistory } from './hooks/useQueries';
import LoginScreen from './pages/LoginScreen';
import ProfileSetupScreen from './pages/ProfileSetupScreen';
import MainApp from './pages/MainApp';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent mx-auto"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <Toaster />
      </>
    );
  }

  // Show profile setup if authenticated but no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <>
        <ProfileSetupScreen />
        <Toaster />
      </>
    );
  }

  // Show main app if authenticated and has profile
  if (isAuthenticated && userProfile) {
    return (
      <>
        <MainApp userProfile={userProfile} />
        <Toaster />
      </>
    );
  }

  // Loading state while fetching profile
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent mx-auto"></div>
        <p className="text-white text-lg font-medium">Loading your profile...</p>
      </div>
    </div>
  );
}
