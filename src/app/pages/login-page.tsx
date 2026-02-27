import { useState } from 'react';
import { useAuthStore } from '../store/auth-store';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const { loginAsGuest, loginWithGoogle } = useAuthStore();
  const [guestName, setGuestName] = useState('');

  const handleGuestLogin = () => {
    if (!guestName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    loginAsGuest(guestName);
    toast.success(`Welcome, ${guestName}!`);
  };

  const handleGoogleLogin = () => {
    // Mock Google login - in a real app, this would redirect to Google OAuth
    loginWithGoogle();
    toast.success('Signed in with Google!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 px-3 sm:px-4">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <LayoutGrid className="size-10 sm:size-12 text-blue-600 dark:text-blue-500" />
            <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">TaskFlow</span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Collaborate seamlessly with your team
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-5 sm:space-y-6 border border-slate-200 dark:border-slate-700">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full gap-2 sm:gap-3 py-5 sm:py-6 text-sm sm:text-base border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            <svg className="size-4 sm:size-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-500">Or continue as guest</span>
            </div>
          </div>

          {/* Guest Login */}
          <div className="space-y-3 sm:space-y-4">
            <Input
              placeholder="Enter your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGuestLogin()}
              className="py-5 sm:py-6 text-sm sm:text-base"
            />
            <Button
              onClick={handleGuestLogin}
              className="w-full py-5 sm:py-6 text-sm sm:text-base"
              disabled={!guestName.trim()}
            >
              Continue as Guest
            </Button>
          </div>

          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Demo Note */}
        <div className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-1">
          <p>💡 This is a portfolio demo project</p>
          <p className="text-xs">Google login is UI-only for demonstration</p>
        </div>
      </div>
    </div>
  );
}