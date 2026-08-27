'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const TopPromoBar: React.FC = () => {
  return (
    <div className="bg-zinc-900 text-zinc-100 py-2 px-4 text-xs sm:text-sm font-medium border-b border-zinc-800 flex items-center justify-center gap-3">
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span>Luxury Fleet Edition — Enjoy up to 35% Off Bookings</span>
      </div>
      <Link
        href="/cars"
        className="inline-flex items-center gap-1 bg-white hover:bg-zinc-200 text-black font-bold px-2.5 py-0.5 rounded-full text-xs transition-colors"
      >
        <span>Explore</span>
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
};
