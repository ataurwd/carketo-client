'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, token } = useAuthStore();

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || !token)) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [isInitialized, isAuthenticated, token, router]);

  if (!isInitialized || !isAuthenticated || !token) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-zinc-50">
        <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-500 font-sans">Checking session authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
