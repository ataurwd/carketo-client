'use client';

import React from 'react';
import Link from 'next/link';
import {
  KeyRound,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  Gauge,
  MapPin,
  Tag,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Car as CarIcon,
} from 'lucide-react';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';
import { ActiveFilterChips } from '@/components/buy/ActiveFilterChips';

export interface HomeFilters {
  listingTab: 'sale' | 'rent' | 'all';
  search: string;
  brand: string;
  model: string;
  condition: string;
  minYear: string;
  maxYear: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  maxMileage: string;
  sortBy: string;
}

export const DEFAULT_HOME_FILTERS: HomeFilters = {
  listingTab: 'sale',
  search: '',
  brand: 'all',
  model: '',
  condition: 'all',
  minYear: '',
  maxYear: '',
  bodyType: 'all',
  transmission: 'all',
  fuelType: 'all',
  location: 'all',
  minPrice: '',
  maxPrice: '',
  maxMileage: '',
  sortBy: 'newest',
};

const CONDITIONS_LIST = [
  { value: 'all', label: 'সব কন্ডিশন' },
  { value: 'new', label: 'ব্র্যান্ড নিউ' },
  { value: 'certified', label: 'সার্টিফায়েড / রিকন্ডিশনড' },
  { value: 'used', label: 'ব্যবহৃত / প্রি-ওনড' },
];

const FUEL_TYPES_LIST = [
  { value: 'all', label: 'সব জ্বালানি' },
  { value: 'petrol', label: 'পেট্রোল / অকটেন' },
  { value: 'hybrid', label: 'হাইব্রিড' },
  { value: 'electric', label: '১০০% ইলেকট্রিক (EV)' },
  { value: 'diesel', label: 'ডিজেল' },
  { value: 'cng', label: 'সিএনজি / এলপিজি' },
];

const TRANSMISSIONS_LIST = [
  { value: 'all', label: 'সব ট্রান্সমিশন' },
  { value: 'automatic', label: 'অটোমেটিক' },
  { value: 'manual', label: 'ম্যানুয়াল' },
  { value: 'dual-clutch', label: 'ডুয়াল-ক্লাচ / টিপট্রনিক' },
];

const LOCATIONS_LIST = [
  'All Locations',
  'Dhaka',
  'Gulshan',
  'Banani',
  'Uttara',
  'Dhanmondi',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Gazipur',
  'Narayanganj',
];

const YEAR_OPTIONS = Array.from({ length: 27 }, (_, i) => 2026 - i);

interface HomeHeroProps {
  draftFilters: HomeFilters;
  setDraftFilters: React.Dispatch<React.SetStateAction<HomeFilters>>;
  appliedFilters: HomeFilters;
  onApply: () => void;
  onResetAll: () => void;
  onApplyPreset: (updates: Partial<HomeFilters>) => void;
  onRemoveAppliedFilter: (key: string, defaultValue: string) => void;
  hasPendingChanges: boolean;
  activeFiltersCount: number;
  totalFilteredCount: number;
}

export function HomeHero({
  draftFilters,
  setDraftFilters,
  appliedFilters,
  onApply,
  onResetAll,
  onApplyPreset,
  onRemoveAppliedFilter,
  hasPendingChanges,
  activeFiltersCount,
  totalFilteredCount,
}: HomeHeroProps) {
  const handleTabChange = (newTab: 'sale' | 'rent') => {
    setDraftFilters((prev) => ({ ...prev, listingTab: newTab }));
    setTimeout(() => {
      onApplyPreset({ listingTab: newTab });
    }, 0);
  };

  return (
    <section className="relative bg-gradient-to-b from-zinc-50 via-white to-zinc-50 border-b border-zinc-200 overflow-hidden py-14 lg:py-20">
      {/* Background cars watermark image with soft gradient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-20 lg:opacity-25">
        <img
          src="/hero-cars.png"
          alt="Luxury Cars Backdrop"
          className="w-full h-full object-cover object-bottom"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/90 via-white/80 to-zinc-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-8">
        
        {/* 1. CENTERED HERO HEADLINE & BADGE */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>সরাসরি ও যাচাইকৃত অটোমোটিভ মার্কেটপ্লেস</span>
          </div>

          {/* Bold Centered Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-6xl font-black text-zinc-950 leading-[1.38] sm:leading-[1.42] lg:leading-[1.45] tracking-normal space-y-2 sm:space-y-3">
            <span className="block">সঠিক গাড়িটি খুঁজে নিন।</span>
            <span className="block text-zinc-800">
              সরাসরি ভাড়া নিন বা কিনুন।
            </span>
          </h1>

          {/* Centered Subtitle */}
          <p className="text-sm sm:text-base text-zinc-600 font-medium leading-relaxed max-w-2xl mx-auto pt-1">
            স্বচ্ছ বাংলাদেশি টাকায় (৳) যাচাইকৃত গাড়ি খুঁজুন, সরাসরি মালিকের সাথে কথা বলুন — কোনো ব্রোকার কমিশন ছাড়াই।
          </p>
        </div>

        {/* 2. MODE SWITCHER BUTTONS (Buy a Car vs Rent a Car) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleTabChange('sale')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
              draftFilters.listingTab === 'sale'
                ? 'bg-zinc-950 text-white shadow-md scale-105'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>গাড়ি কিনুন</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('rent')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
              draftFilters.listingTab === 'rent'
                ? 'bg-zinc-950 text-white shadow-md scale-105'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-900'
            }`}
          >
            <KeyRound className="w-4 h-4 text-sky-400" />
            <span>গাড়ি ভাড়া নিন</span>
          </button>
        </div>

        {/* 3. CENTERED COMPREHENSIVE FILTER CONSOLE (ALL FILTERS VISIBLE) */}
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md p-5 sm:p-7 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/60 space-y-4">
          
          {/* TOP BAR: Search Keyword & Sort */}
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Search Input with Search Button */}
            <div className="relative flex-1 w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="নাম, ব্র্যান্ড, মডেল (যেমন: Premio, Civic, Prado) বা শহর দিয়ে খুঁজুন..."
                  value={draftFilters.search}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, search: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onApply();
                    }
                  }}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-zinc-200 text-xs sm:text-sm font-semibold text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
                />
                {draftFilters.search && (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftFilters((prev) => ({ ...prev, search: '' }));
                      if (appliedFilters.search) {
                        onRemoveAppliedFilter('search', '');
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={onApply}
                className="px-5 py-2.5 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span>খুঁজুন</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="relative w-full lg:w-56 shrink-0 group">
              <select
                value={draftFilters.sortBy}
                onChange={(e) => {
                  const val = e.target.value;
                  setDraftFilters((prev) => ({ ...prev, sortBy: val }));
                  onApplyPreset({ sortBy: val });
                }}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-sm appearance-none transition-colors"
              >
                <option value="newest">সাজান: নতুন যুক্ত</option>
                <option value="price_asc">মূল্য: কম থেকে বেশি</option>
                <option value="price_desc">মূল্য: বেশি থেকে কম</option>
                <option value="year_desc">সাল: নতুন মডেল</option>
                <option value="year_asc">সাল: পুরাতন মডেল</option>
                <option value="mileage_asc">মাইলেজ: কম থেকে বেশি</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
            </div>
          </div>

          {/* ALL FILTERS DIRECTLY VISIBLE - ROW 1: Brand, Model, Condition, Fuel Type, Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 text-xs font-semibold">
            {/* 1. Brand Selector */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider">
                ব্র্যান্ড / মেক
              </label>
              <div className="relative group">
                <select
                  value={draftFilters.brand}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, brand: e.target.value }))}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-xs appearance-none transition-colors"
                >
                  <option value="all">সব ব্র্যান্ড</option>
                  {POPULAR_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
              </div>
            </div>

            {/* 2. Model Input */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider">
                মডেলের নাম
              </label>
              <input
                type="text"
                placeholder="যেমন: Premio, Civic..."
                value={draftFilters.model}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, model: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onApply();
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 shadow-xs transition-colors"
              />
            </div>

            {/* 3. Condition */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider">
                কন্ডিশন
              </label>
              <div className="relative group">
                <select
                  value={draftFilters.condition}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, condition: e.target.value }))}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-xs appearance-none transition-colors"
                >
                  {CONDITIONS_LIST.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
              </div>
            </div>

            {/* 4. Fuel Type */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider">
                জ্বালানির ধরন
              </label>
              <div className="relative group">
                <select
                  value={draftFilters.fuelType}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, fuelType: e.target.value }))}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-xs appearance-none transition-colors"
                >
                  {FUEL_TYPES_LIST.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
              </div>
            </div>

            {/* 5. Price Range */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider">
                মূল্য সীমা (৳)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="সর্বনিম্ন ৳"
                  value={draftFilters.minPrice}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onApply();
                    }
                  }}
                  className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 shadow-xs transition-colors"
                />
                <span className="text-zinc-400 font-bold">-</span>
                <input
                  type="number"
                  placeholder="সর্বোচ্চ ৳"
                  value={draftFilters.maxPrice}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onApply();
                    }
                  }}
                  className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 shadow-xs transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ALL FILTERS DIRECTLY VISIBLE - ROW 2: Year Range, Transmission, Body Class, Location, Max Mileage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-semibold">
            {/* 6. Manufacturing Year Range */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                <span>তৈরির সাল</span>
              </label>
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1 group">
                  <select
                    value={draftFilters.minYear}
                    onChange={(e) => setDraftFilters((prev) => ({ ...prev, minYear: e.target.value }))}
                    className="w-full pl-2.5 pr-7 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-xs appearance-none transition-colors"
                  >
                    <option value="">শুরুর সাল</option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={`min-${y}`} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
                </div>
                <span className="text-zinc-400 font-bold">-</span>
                <div className="relative flex-1 group">
                  <select
                    value={draftFilters.maxYear}
                    onChange={(e) => setDraftFilters((prev) => ({ ...prev, maxYear: e.target.value }))}
                    className="w-full pl-2.5 pr-7 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-xs appearance-none transition-colors"
                  >
                    <option value="">শেষ সাল</option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={`max-${y}`} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
                </div>
              </div>
            </div>

            {/* 7. Transmission */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-zinc-700" />
                <span>ট্রান্সমিশন</span>
              </label>
              <div className="relative group">
                <select
                  value={draftFilters.transmission}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, transmission: e.target.value }))}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-xs appearance-none transition-colors"
                >
                  {TRANSMISSIONS_LIST.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
              </div>
            </div>

            {/* 8. Body Type */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider">
                বডি টাইপ
              </label>
              <div className="relative group">
                <select
                  value={draftFilters.bodyType}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, bodyType: e.target.value }))}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-xs appearance-none transition-colors"
                >
                  <option value="all">সব বডি টাইপ</option>
                  {BODY_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
              </div>
            </div>

            {/* 9. Location / Division */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-700" />
                <span>অবস্থান / শহর</span>
              </label>
              <div className="relative group">
                <select
                  value={draftFilters.location}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-xs appearance-none transition-colors"
                >
                  {LOCATIONS_LIST.map((loc) => (
                    <option key={loc} value={loc === 'All Locations' ? 'all' : loc}>
                      {loc === 'All Locations' ? 'সব অবস্থান' : loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
              </div>
            </div>

            {/* 10. Max Mileage Range */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase tracking-wider">
                সর্বোচ্চ মাইলেজ
              </label>
              <div className="relative group">
                <select
                  value={draftFilters.maxMileage}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, maxMileage: e.target.value }))}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black hover:border-zinc-400 cursor-pointer shadow-xs appearance-none transition-colors"
                >
                  <option value="">যেকোনো মাইলেজ</option>
                  <option value="20000">২০,০০০ কি.মি. এর নিচে</option>
                  <option value="50000">৫০,০০০ কি.মি. এর নিচে</option>
                  <option value="80000">৮০,০০০ কি.মি. এর নিচে</option>
                  <option value="120000">১,২০,০০০ কি.মি. এর নিচে</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-black" />
              </div>
            </div>
          </div>

          {/* Quick Presets Row */}
          <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              দ্রুত ফিল্টার:
            </span>
            <button
              type="button"
              onClick={() => onApplyPreset({ minPrice: '', maxPrice: '2000000' })}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ৳২০ লাখের নিচে
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset({ minPrice: '2000000', maxPrice: '4000000' })}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ৳২০ লাখ - ৳৪০ লাখ
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset({ minPrice: '4000000', maxPrice: '8000000' })}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ৳৪০ লাখ - ৳৮০ লাখ
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset({ minPrice: '8000000', maxPrice: '' })}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ৳৮০ লাখ+ লাক্সারি
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset({ fuelType: 'hybrid' })}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              হাইব্রিড গাড়ি
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset({ minYear: '2021' })}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ২০২১ ও নতুন
            </button>
          </div>

          {/* Action Row: Reset, Pending Alert, and Apply Filters */}
          <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onResetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>সব ফিল্টার রিসেট করুন</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {hasPendingChanges && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  ফিল্টার নির্বাচিত — প্রয়োগ করুন ক্লিক করুন
                </span>
              )}
              <button
                type="button"
                onClick={onApply}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 w-full sm:w-auto justify-center"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>ফিল্টার প্রয়োগ করুন</span>
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <ActiveFilterChips
              search={appliedFilters.search}
              setSearch={(v) => onRemoveAppliedFilter('search', v)}
              selectedBrand={appliedFilters.brand}
              setSelectedBrand={(v) => onRemoveAppliedFilter('brand', v)}
              selectedModel={appliedFilters.model}
              setSelectedModel={(v) => onRemoveAppliedFilter('model', v)}
              selectedCondition={appliedFilters.condition}
              setSelectedCondition={(v) => onRemoveAppliedFilter('condition', v)}
              minYear={appliedFilters.minYear}
              setMinYear={(v) => onRemoveAppliedFilter('minYear', v)}
              maxYear={appliedFilters.maxYear}
              setMaxYear={(v) => onRemoveAppliedFilter('maxYear', v)}
              selectedFuel={appliedFilters.fuelType}
              setSelectedFuel={(v) => onRemoveAppliedFilter('fuelType', v)}
              minPrice={appliedFilters.minPrice}
              setMinPrice={(v) => onRemoveAppliedFilter('minPrice', v)}
              maxPrice={appliedFilters.maxPrice}
              setMaxPrice={(v) => onRemoveAppliedFilter('maxPrice', v)}
              selectedTransmission={appliedFilters.transmission}
              setSelectedTransmission={(v) => onRemoveAppliedFilter('transmission', v)}
              selectedBodyType={appliedFilters.bodyType}
              setSelectedBodyType={(v) => onRemoveAppliedFilter('bodyType', v)}
              selectedLocation={appliedFilters.location}
              setSelectedLocation={(v) => onRemoveAppliedFilter('location', v)}
              maxMileage={appliedFilters.maxMileage}
              setMaxMileage={(v) => onRemoveAppliedFilter('maxMileage', v)}
              onResetAll={onResetAll}
            />
          )}

        </div>
      </div>
    </section>
  );
}
