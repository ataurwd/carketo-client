import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IUser } from '@/types/auth.types';

interface AuthStore {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuth: (user: IUser, token: string) => void;
  setUser: (user: IUser) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token);
          // Set secure cookie for middleware access
          document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({ user, token, isAuthenticated: true, isInitialized: true });
      },
      setUser: (user) => {
        set({ user, isAuthenticated: true, isInitialized: true });
      },
      setInitialized: (isInitialized) => set({ isInitialized }),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          // Clear middleware cookie
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          // Redirect to login page immediately
          window.location.href = '/login';
        }
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
      },
    }),
    {
      name: 'carketo_auth_session',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as any))),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.token && typeof window !== 'undefined') {
            localStorage.setItem('access_token', state.token);
            document.cookie = `access_token=${state.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          state.isInitialized = true;
        }
      },
    }
  )
);
