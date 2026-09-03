'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { carService, IPagination } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { CarCard } from '@/components/common/CarCard';
import { CarCardSkeleton } from '@/components/common/CarCardSkeleton';
import { Pagination } from '@/components/common/Pagination';
import { BuyHero } from '@/components/buy/BuyHero';
import { BuyFilterBar } from '@/components/buy/BuyFilterBar';
import { BuyEmptyState } from '@/components/buy/BuyEmptyState';


interface BuyFilters {
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

const DEFAULT_BUY_FILTERS: BuyFilters = {
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

const parseFiltersFromParams = (params: ReturnType<typeof useSearchParams>): BuyFilters => ({
  search: params?.get('search') || params?.get('q') || params?.get('location') || '',
  brand: params?.get('brand') || 'all',
  model: params?.get('model') || '',
  condition: params?.get('condition') || 'all',
  minYear: params?.get('minYear') || '',
  maxYear: params?.get('maxYear') || '',
  bodyType: params?.get('bodyType') || 'all',
  transmission: params?.get('transmission') || 'all',
  fuelType: params?.get('fuelType') || 'all',
  location: params?.get('location') || 'all',
  minPrice: params?.get('minPrice') || '',
  maxPrice: params?.get('maxPrice') || '',
  maxMileage: params?.get('maxMileage') || '',
  sortBy: params?.get('sort') || 'newest',
});

function BuyCarContent() {
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
  const [draftFilters, setDraftFilters] = useState<BuyFilters>(() => parseFiltersFromParams(searchParams));

  // Applied filters (active query that fetches results & controls URL)
  const [appliedFilters, setAppliedFilters] = useState<BuyFilters>(() => parseFiltersFromParams(searchParams));
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Sync state when URL searchParams changes externally (e.g. from homepage search navigation)
  useEffect(() => {
    const fromUrl = parseFiltersFromParams(searchParams);
    setDraftFilters(fromUrl);
    setAppliedFilters(fromUrl);
    setPage(Number(searchParams?.get('page')) || 1);
  }, [searchParams]);

  // Calculate active applied filters count
  const activeFiltersCount =
    (appliedFilters.brand !== 'all' ? 1 : 0) +
    (appliedFilters.model.trim() ? 1 : 0) +
    (appliedFilters.condition !== 'all' ? 1 : 0) +
    (appliedFilters.minYear ? 1 : 0) +
    (appliedFilters.maxYear ? 1 : 0) +
    (appliedFilters.bodyType !== 'all' ? 1 : 0) +
    (appliedFilters.transmission !== 'all' ? 1 : 0) +
    (appliedFilters.fuelType !== 'all' ? 1 : 0) +
    (appliedFilters.location !== 'all' ? 1 : 0) +
    (appliedFilters.minPrice ? 1 : 0) +
    (appliedFilters.maxPrice ? 1 : 0) +
    (appliedFilters.maxMileage ? 1 : 0) +
    (appliedFilters.search.trim() ? 1 : 0);

  // Check if there are unapplied staged selections
  const hasPendingChanges =
    draftFilters.search !== appliedFilters.search ||
    draftFilters.brand !== appliedFilters.brand ||
    draftFilters.model !== appliedFilters.model ||
    draftFilters.condition !== appliedFilters.condition ||
    draftFilters.minYear !== appliedFilters.minYear ||
    draftFilters.maxYear !== appliedFilters.maxYear ||
    draftFilters.bodyType !== appliedFilters.bodyType ||
    draftFilters.transmission !== appliedFilters.transmission ||
    draftFilters.fuelType !== appliedFilters.fuelType ||
    draftFilters.location !== appliedFilters.location ||
    draftFilters.minPrice !== appliedFilters.minPrice ||
    draftFilters.maxPrice !== appliedFilters.maxPrice ||
    draftFilters.maxMileage !== appliedFilters.maxMileage;

  // Apply staged draft filters
  const handleApply = useCallback(() => {
    setPage(1);
    setAppliedFilters({ ...draftFilters });
  }, [draftFilters]);

  // Reset all filters to default
  const handleResetAll = useCallback(() => {
    setPage(1);
    setDraftFilters(DEFAULT_BUY_FILTERS);
    setAppliedFilters(DEFAULT_BUY_FILTERS);
  }, []);

  // Preset click handler (stages & applies instantly for convenience)
  const handleApplyPreset = useCallback((presetUpdates: Partial<BuyFilters>) => {
    setPage(1);
    setDraftFilters((prev) => {
      const updated = { ...prev, ...presetUpdates };
      setAppliedFilters(updated);
      return updated;
    });
  }, []);

  // Remove individual active filter from chips
  const handleRemoveAppliedFilter = useCallback((key: string, defaultValue: string) => {
    setPage(1);
    setDraftFilters((prev) => ({ ...prev, [key]: defaultValue }));
    setAppliedFilters((prev) => ({ ...prev, [key]: defaultValue }));
  }, []);

  // Sort change handler
  const handleSortChange = useCallback((newSort: string) => {
    setPage(1);
    setDraftFilters((prev) => ({ ...prev, sortBy: newSort }));
    setAppliedFilters((prev) => ({ ...prev, sortBy: newSort }));
  }, []);

  // Fetch paginated cars for sale from backend based ONLY on appliedFilters
  const fetchSaleCars = useCallback(async () => {
    setIsLoading(true);
    const queryParams: Record<string, any> = {
      listingType: 'sale',
      page,
      limit: 12,
    };
    if (appliedFilters.brand !== 'all') queryParams.brand = appliedFilters.brand;
    if (appliedFilters.model.trim()) queryParams.model = appliedFilters.model.trim();
    if (appliedFilters.condition !== 'all') queryParams.condition = appliedFilters.condition;
    if (appliedFilters.minYear) queryParams.minYear = appliedFilters.minYear;
    if (appliedFilters.maxYear) queryParams.maxYear = appliedFilters.maxYear;
    if (appliedFilters.bodyType !== 'all') queryParams.bodyType = appliedFilters.bodyType;
    if (appliedFilters.transmission !== 'all') queryParams.transmission = appliedFilters.transmission;
    if (appliedFilters.fuelType !== 'all') queryParams.fuelType = appliedFilters.fuelType;
    if (appliedFilters.location !== 'all') queryParams.location = appliedFilters.location;
    if (appliedFilters.minPrice) queryParams.minPrice = appliedFilters.minPrice;
    if (appliedFilters.maxPrice) queryParams.maxPrice = appliedFilters.maxPrice;
    if (appliedFilters.maxMileage) queryParams.maxMileage = appliedFilters.maxMileage;
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
    fetchSaleCars();
  }, [fetchSaleCars]);

  // Synchronize URL parameters with appliedFilters
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (appliedFilters.brand !== 'all') params.set('brand', appliedFilters.brand);
    if (appliedFilters.model.trim()) params.set('model', appliedFilters.model.trim());
    if (appliedFilters.condition !== 'all') params.set('condition', appliedFilters.condition);
    if (appliedFilters.minYear) params.set('minYear', appliedFilters.minYear);
    if (appliedFilters.maxYear) params.set('maxYear', appliedFilters.maxYear);
    if (appliedFilters.bodyType !== 'all') params.set('bodyType', appliedFilters.bodyType);
    if (appliedFilters.transmission !== 'all') params.set('transmission', appliedFilters.transmission);
    if (appliedFilters.fuelType !== 'all') params.set('fuelType', appliedFilters.fuelType);
    if (appliedFilters.location !== 'all') params.set('location', appliedFilters.location);
    if (appliedFilters.minPrice) params.set('minPrice', appliedFilters.minPrice);
    if (appliedFilters.maxPrice) params.set('maxPrice', appliedFilters.maxPrice);
    if (appliedFilters.maxMileage) params.set('maxMileage', appliedFilters.maxMileage);
    if (appliedFilters.search.trim()) {
      params.set('q', appliedFilters.search.trim());
      params.set('search', appliedFilters.search.trim());
    }
    if (appliedFilters.sortBy !== 'newest') params.set('sort', appliedFilters.sortBy);

    const queryStr = params.toString();
    router.replace(queryStr ? `/buy?${queryStr}` : '/buy', { scroll: false });
  }, [page, appliedFilters, router]);

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Modular Hero Section */}
        <BuyHero />

        {/* Modular Multi-Parameter Filter Console */}
        <BuyFilterBar
          search={draftFilters.search}
          setSearch={(val) => setDraftFilters((prev) => ({ ...prev, search: val }))}
          selectedBrand={draftFilters.brand}
          setSelectedBrand={(val) => setDraftFilters((prev) => ({ ...prev, brand: val }))}
          selectedModel={draftFilters.model}
          setSelectedModel={(val) => setDraftFilters((prev) => ({ ...prev, model: val }))}
          selectedCondition={draftFilters.condition}
          setSelectedCondition={(val) => setDraftFilters((prev) => ({ ...prev, condition: val }))}
          minYear={draftFilters.minYear}
          setMinYear={(val) => setDraftFilters((prev) => ({ ...prev, minYear: val }))}
          maxYear={draftFilters.maxYear}
          setMaxYear={(val) => setDraftFilters((prev) => ({ ...prev, maxYear: val }))}
          selectedFuel={draftFilters.fuelType}
          setSelectedFuel={(val) => setDraftFilters((prev) => ({ ...prev, fuelType: val }))}
          minPrice={draftFilters.minPrice}
          setMinPrice={(val) => setDraftFilters((prev) => ({ ...prev, minPrice: val }))}
          maxPrice={draftFilters.maxPrice}
          setMaxPrice={(val) => setDraftFilters((prev) => ({ ...prev, maxPrice: val }))}
          selectedTransmission={draftFilters.transmission}
          setSelectedTransmission={(val) => setDraftFilters((prev) => ({ ...prev, transmission: val }))}
          selectedBodyType={draftFilters.bodyType}
          setSelectedBodyType={(val) => setDraftFilters((prev) => ({ ...prev, bodyType: val }))}
          selectedLocation={draftFilters.location}
          setSelectedLocation={(val) => setDraftFilters((prev) => ({ ...prev, location: val }))}
          maxMileage={draftFilters.maxMileage}
          setMaxMileage={(val) => setDraftFilters((prev) => ({ ...prev, maxMileage: val }))}
          sortBy={draftFilters.sortBy}
          setSortBy={handleSortChange}
          advancedFiltersOpen={advancedFiltersOpen}
          setAdvancedFiltersOpen={setAdvancedFiltersOpen}
          activeFiltersCount={activeFiltersCount}
          hasPendingChanges={hasPendingChanges}
          onApply={handleApply}
          onResetAll={handleResetAll}
          onApplyPreset={handleApplyPreset}
          appliedFilters={appliedFilters}
          onRemoveAppliedFilter={handleRemoveAppliedFilter}
        />

        {/* Cars For Sale Grid Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold px-1">
              <span>
                Showing <strong className="text-black font-black">{cars.length}</strong> of{' '}
                <strong className="text-black font-black">{pagination.total}</strong> verified cars for sale
              </span>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            {/* Pagination Controls */}
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
          <BuyEmptyState
            activeFiltersCount={activeFiltersCount}
            onResetFilters={handleResetAll}
          />
        )}
      </div>
    </div>
  );
}

export default function BuyCarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BuyCarContent />
    </Suspense>
  );
}
