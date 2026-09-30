import React from 'react';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  Gauge,
  MapPin,
  ChevronDown,
  ChevronUp,
  Tag,
  RotateCcw,
} from 'lucide-react';
import { ActiveFilterChips } from './ActiveFilterChips';

const CONDITIONS_LIST = [
  { value: 'all', label: 'সব কন্ডিশন' },
  { value: 'new', label: 'ব্র্যান্ড নিউ' },
  { value: 'reconditioned', label: 'রিকন্ডিশনড' },
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
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Gazipur',
  'Narayanganj',
];

const YEAR_OPTIONS = Array.from({ length: 26 }, (_, i) => 2026 - i);

interface BuyFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
  selectedModel: string;
  setSelectedModel: (val: string) => void;
  selectedCondition: string;
  setSelectedCondition: (val: string) => void;
  minYear: string;
  setMinYear: (val: string) => void;
  maxYear: string;
  setMaxYear: (val: string) => void;
  selectedFuel: string;
  setSelectedFuel: (val: string) => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  selectedTransmission: string;
  setSelectedTransmission: (val: string) => void;
  selectedBodyType: string;
  setSelectedBodyType: (val: string) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  maxMileage: string;
  setMaxMileage: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  advancedFiltersOpen: boolean;
  setAdvancedFiltersOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeFiltersCount: number;
  hasPendingChanges?: boolean;
  onApply: () => void;
  onPageReset?: () => void;
  onResetAll: () => void;
  onApplyPreset?: (updates: {
    minPrice?: string;
    maxPrice?: string;
    selectedFuel?: string;
    minYear?: string;
  }) => void;
  appliedFilters: {
    search: string;
    brand: string;
    model: string;
    condition: string;
    minYear: string;
    maxYear: string;
    fuelType: string;
    minPrice: string;
    maxPrice: string;
    transmission: string;
    bodyType: string;
    location: string;
    maxMileage: string;
  };
  onRemoveAppliedFilter: (key: string, defaultValue: string) => void;
}

export function BuyFilterBar({
  search,
  setSearch,
  selectedBrand,
  setSelectedBrand,
  selectedModel,
  setSelectedModel,
  selectedCondition,
  setSelectedCondition,
  minYear,
  setMinYear,
  maxYear,
  setMaxYear,
  selectedFuel,
  setSelectedFuel,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedTransmission,
  setSelectedTransmission,
  selectedBodyType,
  setSelectedBodyType,
  selectedLocation,
  setSelectedLocation,
  maxMileage,
  setMaxMileage,
  sortBy,
  setSortBy,
  advancedFiltersOpen,
  setAdvancedFiltersOpen,
  activeFiltersCount,
  hasPendingChanges = false,
  onApply,
  onResetAll,
  onApplyPreset,
  appliedFilters,
  onRemoveAppliedFilter,
}: BuyFilterBarProps) {
  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200 shadow-sm space-y-5">
      {/* TOP BAR: Keyword Search, Sort, and Filter Toggle */}
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Search Input with explicit Search button */}
        <div className="relative flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="নাম, ব্র্যান্ড, মডেল (যেমন: Premio, Civic) বা অবস্থান দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onApply();
                }
              }}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
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
            className="px-4 py-2.5 rounded-2xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span>খুঁজুন</span>
          </button>
        </div>
        {/* Sort Selector */}
        <div className="w-full lg:w-56">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer shadow-sm"
          >
            <option value="newest">সাজান: নতুন যুক্ত</option>
            <option value="price_asc">মূল্য: কম থেকে বেশি</option>
            <option value="price_desc">মূল্য: বেশি থেকে কম</option>
            <option value="year_desc">সাল: নতুন মডেল</option>
            <option value="year_asc">সাল: পুরাতন মডেল</option>
            <option value="mileage_asc">মাইলেজ: কম থেকে বেশি</option>
          </select>
        </div>

        {/* Toggle More Filters */}
        <button
          type="button"
          onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all w-full lg:w-auto justify-center shadow-sm ${
            advancedFiltersOpen || activeFiltersCount > 0
              ? 'border-black bg-zinc-900 text-white'
              : 'border-zinc-200 text-zinc-700 bg-white hover:border-black'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{advancedFiltersOpen ? 'ফিল্টার লুকান' : 'সব ফিল্টার'}</span>
          {activeFiltersCount > 0 && (
            <span className="h-5 px-1.5 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
          {advancedFiltersOpen ? (
            <ChevronUp className="w-3.5 h-3.5 ml-1 opacity-70" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
          )}
        </button>
      </div>

      {/* COMPREHENSIVE FILTER CONSOLE (EXPANDS ON CLICKING 'ALL FILTERS') */}
      {advancedFiltersOpen && (
        <div className="space-y-4 pt-4 border-t border-zinc-100 animate-fade-in">
          {/* PRIMARY FILTER ROW: Brand, Model, Condition, Fuel Type, Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs font-semibold">
            {/* 1. Brand Selector */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                ব্র্যান্ড / মেক
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="all">সব ব্র্যান্ড</option>
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Model Input */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                মডেলের নাম
              </label>
              <input
                type="text"
                placeholder="যেমন: Premio, Civic..."
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onApply();
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
              />
            </div>

            {/* 3. Condition */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                কন্ডিশন
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                {CONDITIONS_LIST.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Fuel Type */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                জ্বালানির ধরন
              </label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                {FUEL_TYPES_LIST.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Price Range */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                মূল্য সীমা (৳)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="সর্বনিম্ন ৳"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onApply();
                    }
                  }}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                />
                <span className="text-zinc-400 font-bold">-</span>
                <input
                  type="number"
                  placeholder="সর্বোচ্চ ৳"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onApply();
                    }
                  }}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs font-semibold">
            {/* 6. Manufacturing Year Range */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-black" />
                <span>তৈরির সাল</span>
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="">শুরুর সাল</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={`min-${y}`} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="text-zinc-400 font-bold">-</span>
                <select
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="">শেষ সাল</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={`max-${y}`} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 7. Transmission */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-black" />
                <span>ট্রান্সমিশন</span>
              </label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                {TRANSMISSIONS_LIST.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 8. Body Type */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                বডি টাইপ
              </label>
              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="all">সব বডি টাইপ</option>
                {BODY_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            {/* 9. Location / Division */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-black" />
                <span>অবস্থান / শহর</span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                {LOCATIONS_LIST.map((loc) => (
                  <option key={loc} value={loc === 'All Locations' ? 'all' : loc}>
                    {loc === 'All Locations' ? 'সব অবস্থান' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* 10. Max Mileage Range */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                সর্বোচ্চ মাইলেজ
              </label>
              <select
                value={maxMileage}
                onChange={(e) => setMaxMileage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="">যেকোনো মাইলেজ</option>
                <option value="20000">২০,০০০ কি.মি. এর নিচে</option>
                <option value="50000">৫০,০০০ কি.মি. এর নিচে</option>
                <option value="80000">৮০,০০০ কি.মি. এর নিচে</option>
                <option value="120000">১,২০,০০০ কি.মি. এর নিচে</option>
              </select>
            </div>
          </div>

          {/* Quick Preset Filter Chips */}
          <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              দ্রুত ফিল্টার:
            </span>
            <button
              type="button"
              onClick={() => {
                if (onApplyPreset) {
                  onApplyPreset({ minPrice: '', maxPrice: '2000000' });
                } else {
                  setMinPrice('');
                  setMaxPrice('2000000');
                  onApply();
                }
              }}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ৳২০ লাখের নিচে
            </button>
            <button
              type="button"
              onClick={() => {
                if (onApplyPreset) {
                  onApplyPreset({ minPrice: '2000000', maxPrice: '4000000' });
                } else {
                  setMinPrice('2000000');
                  setMaxPrice('4000000');
                  onApply();
                }
              }}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ৳২০ লাখ - ৳৪০ লাখ
            </button>
            <button
              type="button"
              onClick={() => {
                if (onApplyPreset) {
                  onApplyPreset({ minPrice: '4000000', maxPrice: '8000000' });
                } else {
                  setMinPrice('4000000');
                  setMaxPrice('8000000');
                  onApply();
                }
              }}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ৳৪০ লাখ - ৳৮০ লাখ
            </button>
            <button
              type="button"
              onClick={() => {
                if (onApplyPreset) {
                  onApplyPreset({ minPrice: '8000000', maxPrice: '' });
                } else {
                  setMinPrice('8000000');
                  setMaxPrice('');
                  onApply();
                }
              }}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ৳৮০ লাখ+ লাক্সারি
            </button>
            <button
              type="button"
              onClick={() => {
                if (onApplyPreset) {
                  onApplyPreset({ selectedFuel: 'hybrid' });
                } else {
                  setSelectedFuel('hybrid');
                  onApply();
                }
              }}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              হাইব্রিড গাড়ি
            </button>
            <button
              type="button"
              onClick={() => {
                if (onApplyPreset) {
                  onApplyPreset({ minYear: '2021' });
                } else {
                  setMinYear('2021');
                  onApply();
                }
              }}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ২০২১ ও নতুন
            </button>
          </div>

          {/* Action Bar: Reset, Changes Alert, and Apply Filters Button */}
          <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onResetAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>সব রিসেট করুন</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {hasPendingChanges && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  ফিল্টার নির্বাচিত — প্রয়োগ করুন ক্লিক করুন
                </span>
              )}
              <button
                type="button"
                onClick={onApply}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all shadow-md active:scale-95 w-full sm:w-auto justify-center"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>ফিল্টার প্রয়োগ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE FILTER CHIPS & RESET */}
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
  );
}
