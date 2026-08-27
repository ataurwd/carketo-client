'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, PlusCircle, LogIn, Sparkles, DollarSign } from 'lucide-react';

export default function SellRedirectPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/provider/cars/create');
    } else {
      router.push('/login?redirect=/provider/cars/create');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-3xl bg-black text-white flex items-center justify-center shadow-glow">
          <DollarSign className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Seller & Vehicle Portal
          </span>
          <h1 className="text-2xl font-black tracking-tight text-black">
            Sell Your Car on Carketo
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Reach thousands of verified buyers and renters. Sign in to list your vehicle in minutes.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 pt-2">
          <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-zinc-500">
            {isAuthenticated ? 'Redirecting to vehicle listing form...' : 'Redirecting to login...'}
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-100 grid grid-cols-2 gap-3 text-[11px] text-zinc-400">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>Instant Valuation</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>0% Listing Fee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
