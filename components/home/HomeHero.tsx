'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  ShoppingBag,
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Coins,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { POPULAR_BRANDS } from '@/lib/constants';

export function HomeHero() {
  const router = useRouter();
  const [tab, setTab] = useState<'rent' | 'buy'>('rent');
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const qVal = query.trim();
    if (qVal) {
      params.set('q', qVal);
      params.set('search', qVal);
    }
    if (brand && brand !== 'all' && brand !== 'All') {
      params.set('brand', brand);
    }

    router.push(`/${tab}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleQuickBrand = (brandName: string) => {
    setBrand(brandName);
    router.push(`/${tab}?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="relative min-h-[540px] lg:min-h-[620px] flex items-center bg-white border-b border-zinc-200/80 overflow-hidden py-12 lg:py-20">
      {/* 1. HERO BACKGROUND IMAGE (Cars positioned on the right side) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img
          src="/hero-cars.png"
          alt="Luxury Cars Background"
          className="w-full h-full object-contain md:object-cover lg:object-contain object-right-bottom sm:object-right"
          loading="eager"
        />
        {/* Smooth White Gradient on Left to guarantee crisp readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent lg:via-white/75 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent sm:hidden" />
      </div>

      {/* 2. LEFT SIDE HERO CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-2xl space-y-6 text-left">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-800 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Direct & Verified Automotive Marketplace</span>
          </div>

          {/* Bold Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.08]">
              Find the right car.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-500">
                Rent or buy direct.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-xl font-medium leading-relaxed">
              Discover verified vehicles with transparent Bangladeshi Taka (৳) rates, authentic owner contacts, and zero broker commissions.
            </p>
          </div>

          {/* Tab Switcher & Search Form */}
          <div className="space-y-3 pt-1 max-w-xl">
            {/* Modern Segmented Tab Switcher */}
            <div className="inline-flex p-1 rounded-2xl bg-zinc-100/90 backdrop-blur-md border border-zinc-200 shadow-inner">
              <button
                type="button"
                onClick={() => setTab('rent')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tab === 'rent'
                    ? 'bg-zinc-950 text-white shadow-md'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Rent a Car</span>
              </button>
              <button
                type="button"
                onClick={() => setTab('buy')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tab === 'buy'
                    ? 'bg-zinc-950 text-white shadow-md'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy a Car</span>
              </button>
            </div>

            {/* Search Form Card */}
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-xl shadow-zinc-300/40 flex flex-col sm:flex-row items-center gap-2"
            >
              {/* Location or Keyword Input Field */}
              <div className="relative flex-1 w-full pl-3 pr-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={
                      tab === 'rent'
                        ? 'Enter pickup city (e.g. Dhaka, Gulshan)...'
                        : 'Search car model or keywords...'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full py-2 bg-transparent text-xs sm:text-sm font-semibold text-zinc-900 placeholder-zinc-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Brand Dropdown */}
              <div className="w-full sm:w-40 px-2 sm:border-l border-zinc-200">
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  aria-label="Select Car Brand"
                  className="w-full py-2 bg-transparent text-xs font-bold text-zinc-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Brands</option>
                  {POPULAR_BRANDS.slice(0, 15).map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>

            {/* Popular Brands Quick Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-zinc-500">
              <span className="font-semibold text-zinc-400 mr-1">Popular:</span>
              {['Toyota', 'BMW', 'Audi', 'Mercedes-Benz', 'Honda', 'Nissan'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleQuickBrand(b)}
                  className="px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-zinc-200 text-zinc-700 font-medium transition-colors border border-zinc-200/80 shadow-xs"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Indicators / Quick Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-200/80 max-w-xl">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 leading-tight">100% Verified</p>
                <p className="text-[10px] text-zinc-500 font-medium">Inspected details</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 leading-tight">Zero Broker Fee</p>
                <p className="text-[10px] text-zinc-500 font-medium">Direct deal in ৳</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 leading-tight">Direct Contact</p>
                <p className="text-[10px] text-zinc-500 font-medium">Instant seller call</p>
              </div>
            </div>
          </div>

          {/* Floating Call to Action for Car Owners */}
          <div className="pt-1">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-black transition-colors"
            >
              <span>Are you a car owner or dealer?</span>
              <span className="font-bold underline inline-flex items-center gap-0.5 text-zinc-950">
                List your car free <ArrowRight className="w-3 h-3 inline" />
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
