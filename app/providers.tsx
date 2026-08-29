'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const { setAuth, logout, setInitialized } = useAuthStore();

  useEffect(() => {
    // Check and validate authentication on application startup
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        authService
          .getMe()
          .then((userData) => {
            if (userData) {
              setAuth(userData, token);
            } else {
              logout();
            }
          })
          .catch(() => {
            // Keep existing rehydrated state or fallback
          })
          .finally(() => {
            setInitialized(true);
          });
      } else {
        setInitialized(true);
      }
    }
  }, [setAuth, logout, setInitialized]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
