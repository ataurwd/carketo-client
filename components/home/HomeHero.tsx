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
    if (query.trim()) {
      if (tab === 'rent') params.set('location', query.trim());
      else params.set('search', query.trim());
    }
    if (brand !== 'all') params.set('brand', brand);

    router.push(`/${tab}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative bg-black text-white pt-16 pb-20 overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-800/30 blur-[140px] rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-10 text-center">
        {/* Minimalist Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-bold uppercase tracking-widest text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Direct & Verified Automotive Marketplace</span>
        </div>

        {/* Clean & Elegant Typography */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Find the right car.{' '}
            <span className="text-zinc-400">Rent or buy direct.</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
            Verified vehicles with transparent Bangladeshi Taka (৳) rates, authentic owner contacts, and zero broker commissions.
          </p>
        </div>

        {/* Simple & Elegant Segmented Search Bar */}
        <div className="max-w-2xl mx-auto">
          {/* iOS-Style Minimal Tab Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-zinc-900 border border-zinc-800 mb-3 shadow-sm">
            <button
              type="button"
              onClick={() => setTab('rent')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'rent'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Rent a Car</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('buy')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'buy'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy a Car</span>
            </button>
          </div>

          {/* Unified Clean Single-Line Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl sm:rounded-full bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-md"
          >
            {/* Input Field */}
            <div className="relative flex-1 w-full pl-3 pr-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  placeholder={
                    tab === 'rent'
                      ? 'Enter pickup city (e.g. Dhaka, Gulshan-2)...'
                      : 'Search by model, title, or keywords...'
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full py-2.5 bg-transparent text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Brand Dropdown */}
            <div className="w-full sm:w-44 px-2 sm:border-l border-zinc-800">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full py-2.5 bg-transparent text-xs font-bold text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-zinc-900 text-white">
                  All Brands
                </option>
                {POPULAR_BRANDS.slice(0, 15).map((b) => (
                  <option key={b} value={b} className="bg-zinc-900 text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-full bg-white text-black font-black text-xs hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Pristine Luxury Hero Vehicle Visual */}
        <div className="relative max-w-4xl mx-auto pt-4">
          <div className="relative rounded-3xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1400&q=85"
              alt="Premium Vehicle Showcase"
              className="w-full h-[260px] sm:h-[360px] object-cover brightness-[0.88]"
            />
            {/* Soft Edge & Bottom Fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Floating Sell CTA pill */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-zinc-300">
                Are you a car owner or dealer?
              </span>
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-colors"
              >
                <span>List Your Car Free</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Clean Minimal Key Stats / Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 max-w-3xl mx-auto border-t border-zinc-900 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">100% Verified Posts</h4>
              <p className="text-[11px] text-zinc-500">Inspected specs & clear details</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Zero Broker Fee</h4>
              <p className="text-[11px] text-zinc-500">Direct negotiations in ৳ (BDT)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
              <PhoneCall className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Direct Owner Contact</h4>
              <p className="text-[11px] text-zinc-500">Call & message sellers instantly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
