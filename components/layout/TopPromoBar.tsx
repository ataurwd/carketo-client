'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const TopPromoBar: React.FC = () => {
  return (
    <div className="bg-[#EBF7D4] text-[#1E293B] py-2 px-4 text-xs md:text-sm font-medium border-b border-[#D8ECB5] flex items-center justify-center gap-3">
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
        <span>Purchase Today & Enjoy UP TO 35% OFF</span>
      </div>
      <Link
        href="/cars"
        className="inline-flex items-center gap-1 bg-[#BDDC86] hover:bg-[#ACCB75] text-[#1E293B] font-semibold px-2.5 py-0.5 rounded-full text-xs transition-colors"
      >
        <span>Buy Now</span>
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
};
