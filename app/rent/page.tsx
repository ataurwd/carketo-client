'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { carService, IPagination } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { CarCard } from '@/components/common/CarCard';
import { CarCardSkeleton } from '@/components/common/CarCardSkeleton';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import { POPULAR_BRANDS, BODY_TYPES, TRANSMISSION_TYPES } from '@/lib/constants';
import { Search, KeyRound, CalendarCheck, ShieldCheck, Plus, RotateCcw, SlidersHorizontal, X } from 'lucide-react';

interface RentFilters {
  search: string;
  brand: string;
  bodyType: string;
  transmission: string;
  maxPrice: number;
}

const DEFAULT_RENT_FILTERS: RentFilters = {
  search: '',
  brand: 'All',
  bodyType: 'All',
  transmission: 'All',
  maxPrice: 2000,
};

const parseRentFiltersFromParams = (params: ReturnType<typeof useSearchParams>): RentFilters => ({
  search: params?.get('search') || params?.get('q') || params?.get('location') || '',
  brand: params?.get('brand') || 'All',
  bodyType: params?.get('bodyType') || 'All',
  transmission: params?.get('transmission') || 'All',
  maxPrice: Number(params?.get('maxPrice')) || 2000,
});

function RentCarContent() {
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
  const [draftFilters, setDraftFilters] = useState<RentFilters>(() => parseRentFiltersFromParams(searchParams));

  // Applied filters (active query that fetches results & controls URL)
  const [appliedFilters, setAppliedFilters] = useState<RentFilters>(() => parseRentFiltersFromParams(searchParams));

  // Listen to searchParams updates (e.g. from homepage search navigation)
  useEffect(() => {
    const fromUrl = parseRentFiltersFromParams(searchParams);
    setDraftFilters(fromUrl);
    setAppliedFilters(fromUrl);
    setPage(Number(searchParams?.get('page')) || 1);
  }, [searchParams]);

  // Check for unapplied staged selections
  const hasPendingChanges =
    draftFilters.search !== appliedFilters.search ||
    draftFilters.brand !== appliedFilters.brand ||
    draftFilters.bodyType !== appliedFilters.bodyType ||
    draftFilters.transmission !== appliedFilters.transmission ||
    draftFilters.maxPrice !== appliedFilters.maxPrice;

  // Apply staged draft filters
  const handleApply = useCallback(() => {
    setPage(1);
    setAppliedFilters({ ...draftFilters });
  }, [draftFilters]);

  // Reset all filters
  const handleResetAll = useCallback(() => {
    setPage(1);
    setDraftFilters(DEFAULT_RENT_FILTERS);
    setAppliedFilters(DEFAULT_RENT_FILTERS);
  }, []);

  // Remove individual active filter
  const handleRemoveAppliedFilter = useCallback((key: keyof RentFilters, defaultValue: any) => {
    setPage(1);
    setDraftFilters((prev) => ({ ...prev, [key]: defaultValue }));
    setAppliedFilters((prev) => ({ ...prev, [key]: defaultValue }));
  }, []);

  // Fetch paginated rental cars from backend based on appliedFilters
  const fetchRentalCars = useCallback(async () => {
    setIsLoading(true);
    const queryParams: Record<string, any> = {
      listingType: 'rent',
      page,
      limit: 12,
    };
    if (appliedFilters.brand && appliedFilters.brand.toLowerCase() !== 'all') {
      queryParams.brand = appliedFilters.brand;
    }
    if (appliedFilters.bodyType && appliedFilters.bodyType.toLowerCase() !== 'all') {
      queryParams.bodyType = appliedFilters.bodyType;
    }
    if (appliedFilters.transmission && appliedFilters.transmission.toLowerCase() !== 'all') {
      queryParams.transmission = appliedFilters.transmission;
    }
    if (appliedFilters.maxPrice < 2000) {
      queryParams.maxPrice = appliedFilters.maxPrice;
    }
    if (appliedFilters.search.trim()) {
      queryParams.search = appliedFilters.search.trim();
    }

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
    fetchRentalCars();
  }, [fetchRentalCars]);

  // Synchronize URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (appliedFilters.brand && appliedFilters.brand.toLowerCase() !== 'all') {
      params.set('brand', appliedFilters.brand);
    }
    if (appliedFilters.bodyType && appliedFilters.bodyType.toLowerCase() !== 'all') {
      params.set('bodyType', appliedFilters.bodyType);
    }
    if (appliedFilters.transmission && appliedFilters.transmission.toLowerCase() !== 'all') {
      params.set('transmission', appliedFilters.transmission);
    }
    if (appliedFilters.maxPrice < 2000) {
      params.set('maxPrice', String(appliedFilters.maxPrice));
    }
    if (appliedFilters.search.trim()) {
      params.set('q', appliedFilters.search.trim());
      params.set('search', appliedFilters.search.trim());
    }

    const queryStr = params.toString();
    router.replace(queryStr ? `/rent?${queryStr}` : '/rent', { scroll: false });
  }, [page, appliedFilters, router]);

  const activeFiltersCount =
    (appliedFilters.brand !== 'All' ? 1 : 0) +
    (appliedFilters.bodyType !== 'All' ? 1 : 0) +
    (appliedFilters.transmission !== 'All' ? 1 : 0) +
    (appliedFilters.maxPrice < 2000 ? 1 : 0) +
    (appliedFilters.search.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Hero Header */}
        <div className="bg-black text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300">
              <KeyRound className="w-3.5 h-3.5 text-white" />
              <span>Direct Rental Fleet</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Rent Premium Vehicles
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Rent verified vehicles directly from owners. Click any car card to reveal masked phone numbers and connect via call or WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 max-w-lg relative z-10 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <CalendarCheck className="w-4 h-4 text-white shrink-0" />
              <span>Direct Owner Booking</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Zero Commissions</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Input with explicit Search button */}
            <div className="relative flex-1 w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by vehicle title, make, or model..."
                  value={draftFilters.search}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, search: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApply();
                    }
                  }}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
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
                <span>Search</span>
              </button>
            </div>

            {/* Selects */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <select
                value={draftFilters.brand}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, brand: e.target.value }))}
                className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="All">All Makes</option>
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                value={draftFilters.bodyType}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, bodyType: e.target.value }))}
                className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="All">All Body Types</option>
                {BODY_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>

              <select
                value={draftFilters.transmission}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, transmission: e.target.value }))}
                className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black col-span-2 sm:col-span-1 cursor-pointer"
              >
                <option value="All">All Transmissions</option>
                {TRANSMISSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range Slider & Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-bold text-zinc-700 whitespace-nowrap">
                Max Daily Rate: <span className="text-black font-black">${draftFilters.maxPrice}/day</span>
              </span>
              <input
                type="range"
                min={50}
                max={2000}
                step={25}
                value={draftFilters.maxPrice}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full sm:w-48 accent-black cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                type="button"
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {hasPendingChanges && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Filters selected
                </span>
              )}

              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100">
              <span className="text-[11px] font-bold text-zinc-400">Active filters:</span>
              {appliedFilters.brand !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  Make: {appliedFilters.brand}
                  <button onClick={() => handleRemoveAppliedFilter('brand', 'All')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {appliedFilters.bodyType !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  Body: {appliedFilters.bodyType}
                  <button onClick={() => handleRemoveAppliedFilter('bodyType', 'All')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {appliedFilters.transmission !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  Transmission: {appliedFilters.transmission}
                  <button onClick={() => handleRemoveAppliedFilter('transmission', 'All')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {appliedFilters.maxPrice < 2000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  Up to ${appliedFilters.maxPrice}/day
                  <button onClick={() => handleRemoveAppliedFilter('maxPrice', 2000)}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {appliedFilters.search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black border border-zinc-200">
                  Search: &ldquo;{appliedFilters.search}&rdquo;
                  <button onClick={() => handleRemoveAppliedFilter('search', '')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetAll}
                className="text-[11px] font-bold text-rose-600 hover:underline ml-auto"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 font-semibold">
            <span>
              Showing <strong className="text-black font-black">{pagination.total}</strong> rental vehicles
            </span>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
          </div>
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            {/* Pagination */}
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
            <KeyRound className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Rental Vehicles Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No rental cars match your search filters or none are listed in the database yet.
            </p>
            <Link href="/sell">
              <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                List Car for Rent
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RentCarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RentCarContent />
    </Suspense>
  );
}
