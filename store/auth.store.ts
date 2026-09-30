import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IUser } from '@/types/auth.types';
import { apiClient } from '@/lib/api-client';

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
        if (!token) {
          // Cannot authenticate without a valid token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('carketo_auth_session');
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
          }
          set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
          return;
        }

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
          try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('carketo_auth_session');
            // Clear middleware cookies
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
            document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
          } catch {}
        }

        // Synchronously reset state
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true });

        // Notify backend to clear server-side HttpOnly cookies and then redirect
        apiClient
          .post('/auth/logout')
          .catch(() => {})
          .finally(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          });
      },
    }),
    {
      name: 'carketo_auth_session',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as any))),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const storedToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
          const validToken = state.token || storedToken;

          if (!validToken) {
            // No token at all: clear stale user state immediately!
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
              localStorage.removeItem('carketo_auth_session');
              document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
            }
          } else if (typeof window !== 'undefined') {
            state.token = validToken;
            state.isAuthenticated = !!state.user;
            localStorage.setItem('access_token', validToken);
            document.cookie = `access_token=${validToken}; path=/; max-age=604800; SameSite=Lax`;
          }
          state.isInitialized = true;
        }
      },
    }
  )
);
