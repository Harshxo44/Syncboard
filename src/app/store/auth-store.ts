import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  loginMethod: 'guest' | 'google';
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  loginAsGuest: (name: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,

      setLoading: (loading) => set({ isLoading: loading }),

      loginAsGuest: (name) => {
        const guestUser: AuthUser = {
          id: `guest-${Date.now()}`,
          name: name || 'Guest User',
          email: 'guest@taskflow.local',
          avatar: '👤',
          loginMethod: 'guest',
        };
        set({ user: guestUser, isLoading: false });
      },

      loginWithGoogle: () => {
        // Mock Google login (not actually connecting to Google)
        const googleUser: AuthUser = {
          id: `google-${Date.now()}`,
          name: 'Google User',
          email: 'user@gmail.com',
          avatar: '🔵',
          loginMethod: 'google',
        };
        set({ user: googleUser, isLoading: false });
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
