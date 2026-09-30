'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CarCard } from '@/components/common/CarCard';
import { CarCardSkeleton } from '@/components/common/CarCardSkeleton';
import { Pagination } from '@/components/common/Pagination';
import { carService, IPagination } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Plus,
  Car as CarIcon,
  Filter,
  DollarSign,
  Fuel,
  Settings2,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';


interface CarsCatalogFilters {
  type: string;
  brand: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  minPrice: string;
  maxPrice: string;
  search: string;
  sortBy: string;
}

const DEFAULT_CARS_FILTERS: CarsCatalogFilters = {
  type: 'all',
  brand: 'all',
  bodyType: 'all',
  transmission: 'all',
  fuelType: 'all',
  minPrice: '',
  maxPrice: '',
  search: '',
  sortBy: 'newest',
};

const parseCarsFiltersFromParams = (params: ReturnType<typeof useSearchParams>): CarsCatalogFilters => ({
  type: params?.get('type') || 'all',
  brand: params?.get('brand') || 'all',
  bodyType: params?.get('bodyType') || 'all',
  transmission: params?.get('transmission') || 'all',
  fuelType: params?.get('fuelType') || 'all',
  minPrice: params?.get('minPrice') || '',
  maxPrice: params?.get('maxPrice') || '',
  search: params?.get('search') || params?.get('q') || params?.get('location') || '',
  sortBy: params?.get('sort') || 'newest',
});

function CarsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(() => Number(searchParams?.get('page')) || 1);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: Number(searchParams?.get('page')) || 1,
    limit: 12,
    totalPages: 1,
  });

  // Staged / Draft filters (controlled in UI without triggering immediate reload)
  const [draftFilters, setDraftFilters] = useState<CarsCatalogFilters>(() => parseCarsFiltersFromParams(searchParams));

  // Applied filters (active query that fetches results & controls URL)
  const [appliedFilters, setAppliedFilters] = useState<CarsCatalogFilters>(() => parseCarsFiltersFromParams(searchParams));

  // Listen to searchParams updates (e.g. from homepage search navigation)
  useEffect(() => {
    const fromUrl = parseCarsFiltersFromParams(searchParams);
    setDraftFilters(fromUrl);
    setAppliedFilters(fromUrl);
    setPage(Number(searchParams?.get('page')) || 1);
  }, [searchParams]);

  // Expand filter accordion on mobile/desktop
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Check for unapplied staged selections
  const hasPendingChanges =
    draftFilters.brand !== appliedFilters.brand ||
    draftFilters.bodyType !== appliedFilters.bodyType ||
    draftFilters.transmission !== appliedFilters.transmission ||
    draftFilters.fuelType !== appliedFilters.fuelType ||
    draftFilters.minPrice !== appliedFilters.minPrice ||
    draftFilters.maxPrice !== appliedFilters.maxPrice ||
    draftFilters.search !== appliedFilters.search;

  // Apply staged draft filters
  const handleApply = useCallback(() => {
    setPage(1);
    setAppliedFilters({ ...draftFilters });
  }, [draftFilters]);

  // Reset all filters
  const handleResetAll = useCallback(() => {
    setPage(1);
    setDraftFilters(DEFAULT_CARS_FILTERS);
    setAppliedFilters(DEFAULT_CARS_FILTERS);
  }, []);

  // Listing type tab change (applies immediately)
  const handleTypeChange = useCallback((newType: string) => {
    setPage(1);
    setDraftFilters((prev) => ({ ...prev, type: newType }));
    setAppliedFilters((prev) => ({ ...prev, type: newType }));
  }, []);

  // Sort change (applies immediately)
  const handleSortChange = useCallback((newSort: string) => {
    setPage(1);
    setDraftFilters((prev) => ({ ...prev, sortBy: newSort }));
    setAppliedFilters((prev) => ({ ...prev, sortBy: newSort }));
  }, []);

  // Remove individual active filter
  const handleRemoveAppliedFilter = useCallback((key: keyof CarsCatalogFilters, defaultValue: string) => {
    setPage(1);
    setDraftFilters((prev) => ({ ...prev, [key]: defaultValue }));
    setAppliedFilters((prev) => ({ ...prev, [key]: defaultValue }));
  }, []);

  // Fetch cars directly from backend with all filter parameters and pagination
  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    const queryParams: Record<string, any> = {
      page,
      limit: 12,
    };
    if (appliedFilters.type !== 'all') queryParams.listingType = appliedFilters.type;
    if (appliedFilters.brand !== 'all') queryParams.brand = appliedFilters.brand;
    if (appliedFilters.bodyType !== 'all') queryParams.bodyType = appliedFilters.bodyType;
    if (appliedFilters.transmission !== 'all') queryParams.transmission = appliedFilters.transmission;
    if (appliedFilters.fuelType !== 'all') queryParams.fuelType = appliedFilters.fuelType;
    if (appliedFilters.minPrice) queryParams.minPrice = appliedFilters.minPrice;
    if (appliedFilters.maxPrice) queryParams.maxPrice = appliedFilters.maxPrice;
    if (appliedFilters.search.trim()) queryParams.search = appliedFilters.search.trim();
    if (appliedFilters.sortBy !== 'newest') queryParams.sort = appliedFilters.sortBy;

    try {
      const res = await carService.getCarsWithPagination(queryParams);
      setCars(res.cars || []);
      setPagination(
        res.pagination || {
          total: res.cars.length,
          page,
          limit: 12,
          totalPages: Math.ceil(res.cars.length / 12) || 1,
        }
      );
    } catch {
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Synchronize URL parameters with browser history
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (appliedFilters.type !== 'all') params.set('type', appliedFilters.type);
    if (appliedFilters.brand !== 'all') params.set('brand', appliedFilters.brand);
    if (appliedFilters.bodyType !== 'all') params.set('bodyType', appliedFilters.bodyType);
    if (appliedFilters.transmission !== 'all') params.set('transmission', appliedFilters.transmission);
    if (appliedFilters.fuelType !== 'all') params.set('fuelType', appliedFilters.fuelType);
    if (appliedFilters.minPrice) params.set('minPrice', appliedFilters.minPrice);
    if (appliedFilters.maxPrice) params.set('maxPrice', appliedFilters.maxPrice);
    if (appliedFilters.search.trim()) params.set('q', appliedFilters.search.trim());
    if (appliedFilters.sortBy !== 'newest') params.set('sort', appliedFilters.sortBy);

    const queryStr = params.toString();
    router.replace(queryStr ? `/cars?${queryStr}` : '/cars', { scroll: false });
  }, [page, appliedFilters, router]);

  const filteredCars = cars;

  const activeFiltersCount =
    (appliedFilters.type !== 'all' ? 1 : 0) +
    (appliedFilters.brand !== 'all' ? 1 : 0) +
    (appliedFilters.bodyType !== 'all' ? 1 : 0) +
    (appliedFilters.transmission !== 'all' ? 1 : 0) +
    (appliedFilters.fuelType !== 'all' ? 1 : 0) +
    (appliedFilters.minPrice ? 1 : 0) +
    (appliedFilters.maxPrice ? 1 : 0) +
    (appliedFilters.search.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div>
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              ভেরিফায়েড মার্কেটপ্লেস ইনভেন্টরি
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-black mt-1">
              সব গাড়ি দেখুন
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              ভাড়া বা কেনার জন্য সার্টিফায়েড গাড়ি খুঁজুন এবং ফিল্টার করুন — ২৪/৭ সরাসরি মালিকের সাথে যোগাযোগের সুবিধাসহ।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-2 rounded-2xl bg-black text-white">
              {filteredCars.length} টি গাড়ি পাওয়া গেছে
            </span>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetAll}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                রিসেট ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>

        {/* Multi-Parameter Search & Filter Console */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-5">
          {/* Row 1: Search, Type Pills, Sort */}
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Input with explicit Search button */}
            <div className="relative flex-1 w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="নাম, ব্র্যান্ড, মডেল বা শহর দিয়ে খুঁজুন (যেমন: Toyota, ঢাকা, SUV)..."
                  value={draftFilters.search}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, search: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApply();
                    }
                  }}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold focus:outline-none focus:border-black transition-colors"
                />
                {draftFilters.search && (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftFilters((prev) => ({ ...prev, search: '' }));
                      if (appliedFilters.search) {
                        handleRemoveAppliedFilter('search', '');
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
                onClick={handleApply}
                className="px-4 py-2.5 rounded-2xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span>খুঁজুন</span>
              </button>
            </div>

            {/* Listing Type Tabs */}
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl border border-zinc-200 text-xs font-bold w-full lg:w-auto">
              {[
                { key: 'all', label: 'সব তালিকা' },
                { key: 'rent', label: 'ভাড়ার জন্য' },
                { key: 'sale', label: 'বিক্রয়ের জন্য' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTypeChange(tab.key)}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-xl transition-all ${
                    appliedFilters.type === tab.key
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full lg:w-56">
              <select
                value={appliedFilters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer shadow-sm"
              >
                <option value="newest">সাজান: নতুনগুলো আগে</option>
                <option value="price_asc">মূল্য: কম থেকে বেশি</option>
                <option value="price_desc">মূল্য: বেশি থেকে কম</option>
                <option value="rating">সেরা গ্রাহক রেটিং</option>
              </select>
            </div>

            {/* Toggle Advanced Filters */}
            <button
              onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all w-full lg:w-auto justify-center shadow-sm ${
                advancedFiltersOpen || activeFiltersCount > 0
                  ? 'border-black bg-zinc-900 text-white'
                  : 'border-zinc-200 text-zinc-700 bg-white hover:border-black'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{advancedFiltersOpen ? 'ফিল্টার লুকান' : 'ফিল্টার'}</span>
              {activeFiltersCount > 0 && (
                <span className="h-5 px-1.5 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Row 2: Advanced Filters Accordion */}
          {advancedFiltersOpen && (
            <div className="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-in fade-in duration-150 text-xs font-semibold">
              {/* Brand */}
              <div>
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">ব্র্যান্ড</label>
                <select
                  value={draftFilters.brand}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="all">সব ব্র্যান্ড</option>
                  {POPULAR_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">বডি টাইপ</label>
                <select
                  value={draftFilters.bodyType}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, bodyType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="all">সব বডি টাইপ</option>
                  {BODY_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">গিয়ারবক্স</label>
                <select
                  value={draftFilters.transmission}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, transmission: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="all">সব গিয়ারবক্স</option>
                  <option value="automatic">অটোমেটিক</option>
                  <option value="manual">ম্যানুয়াল</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">জ্বালানির ধরন</label>
                <select
                  value={draftFilters.fuelType}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, fuelType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="all">সব জ্বালানি</option>
                  <option value="petrol">পেট্রোল / অকটেন</option>
                  <option value="diesel">ডিজেল</option>
                  <option value="electric">ইলেকট্রিক</option>
                  <option value="hybrid">হাইব্রিড</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">মূল্য সীমা (৳)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="সর্বনিম্ন"
                    value={draftFilters.minPrice}
                    onChange={(e) => setDraftFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApply();
                      }
                    }}
                    className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                  />
                  <span className="text-zinc-400 font-bold">-</span>
                  <input
                    type="number"
                    placeholder="সর্বোচ্চ"
                    value={draftFilters.maxPrice}
                    onChange={(e) => setDraftFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApply();
                      }
                    }}
                    className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Action Bar: Reset, Changes notice, and Apply Filters */}
              <div className="col-span-full pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors w-full sm:w-auto justify-center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>সব রিসেট করুন</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {hasPendingChanges && (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      ফিল্টার নির্বাচিত — প্রয়োগ করুন ক্লিক করুন
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleApply}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all shadow-md active:scale-95 w-full sm:w-auto justify-center"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>ফিল্টার প্রয়োগ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100">
              <span className="text-[11px] font-bold text-zinc-400">সক্রিয় ফিল্টার:</span>
              {appliedFilters.type !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  ধরন: {appliedFilters.type === 'rent' ? 'ভাড়া' : 'বিক্রয়'}
                  <button onClick={() => handleRemoveAppliedFilter('type', 'all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {appliedFilters.brand !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  ব্র্যান্ড: {appliedFilters.brand}
                  <button onClick={() => handleRemoveAppliedFilter('brand', 'all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {appliedFilters.bodyType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  বডি: {appliedFilters.bodyType}
                  <button onClick={() => handleRemoveAppliedFilter('bodyType', 'all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {appliedFilters.transmission !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  গিয়ারবক্স: {appliedFilters.transmission}
                  <button onClick={() => handleRemoveAppliedFilter('transmission', 'all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {appliedFilters.fuelType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  জ্বালানি: {appliedFilters.fuelType}
                  <button onClick={() => handleRemoveAppliedFilter('fuelType', 'all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  মূল্য: ৳{appliedFilters.minPrice || '0'} - ৳{appliedFilters.maxPrice || '∞'}
                  <button
                    onClick={() => {
                      handleRemoveAppliedFilter('minPrice', '');
                      handleRemoveAppliedFilter('maxPrice', '');
                    }}
                  >
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {appliedFilters.search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  অনুসন্ধান: &ldquo;{appliedFilters.search}&rdquo;
                  <button onClick={() => handleRemoveAppliedFilter('search', '')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetAll}
                className="text-[11px] font-bold text-rose-600 hover:underline ml-auto"
              >
                সব ফিল্টার মুছুন
              </button>
            </div>
          )}
        </div>

        {/* Cars Catalog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            {/* Pagination Widget */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              limit={pagination.limit}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <CarIcon className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">কোনো গাড়ি পাওয়া যায়নি</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              আপনার নির্বাচিত অনুসন্ধান ও ফিল্টারের সাথে কোনো গাড়ি মেলেনি।
            </p>
            <Button variant="dark" size="sm" onClick={handleResetAll}>
              সব ফিল্টার রিসেট করুন
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CarsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CarsCatalogContent />
    </Suspense>
  );
}
