import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useAuthStore } from './store/auth-store';
import { useEffect } from 'react';
import { LoadingScreen } from './components/loading-screen';
import { LoginPage } from './pages/login-page';

export default function App() {
  const { user, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <RouterProvider router={router} />;
}