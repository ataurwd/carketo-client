'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, token, user } = useAuthStore();

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated || !token) {
        router.replace('/login?redirect=/admin');
      } else if (user?.role !== 'admin') {
        router.replace('/dashboard');
      }
    }
  }, [isInitialized, isAuthenticated, token, user, router]);

  if (!isInitialized || !isAuthenticated || !token || user?.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-zinc-50">
        <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-500 font-sans">Checking admin authorization...</p>
      </div>
    );
  }

  return <>{children}</>;
}
