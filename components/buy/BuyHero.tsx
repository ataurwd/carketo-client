import React from 'react';
import { ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export function BuyHero() {
  return (
    <div className="bg-black text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl">
      <div className="max-w-2xl space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300">
          <ShoppingBag className="w-3.5 h-3.5 text-white" />
          <span>Certified Showroom</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Buy Verified Cars in Bangladesh
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Explore 100% verified vehicles with direct owner contact details. Filter by model, manufacturing year, condition, fuel type, and price range with zero middleman commissions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 max-w-lg relative z-10 text-xs">
        <div className="flex items-center gap-2 text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-white shrink-0" />
          <span>Direct Owner Contact</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <Truck className="w-4 h-4 text-white shrink-0" />
          <span>Zero Middleman Fees</span>
        </div>
      </div>
    </div>
  );
}
