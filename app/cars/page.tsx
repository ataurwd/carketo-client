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

function CarsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams?.get('page')) || 1;
  const initialType = searchParams?.get('type') || 'all';
  const initialBrand = searchParams?.get('brand') || 'all';
  const initialBodyType = searchParams?.get('bodyType') || 'all';
  const initialQuery = searchParams?.get('q') || searchParams?.get('location') || '';
  const initialSort = searchParams?.get('sort') || 'newest';
  const initialTransmission = searchParams?.get('transmission') || 'all';
  const initialFuel = searchParams?.get('fuelType') || 'all';
  const initialMinPrice = searchParams?.get('minPrice') || '';
  const initialMaxPrice = searchParams?.get('maxPrice') || '';

  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(initialPage);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: initialPage,
    limit: 12,
    totalPages: 1,
  });

  // Filter States
  const [typeFilter, setTypeFilter] = useState<string>(initialType);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedBodyType, setSelectedBodyType] = useState<string>(initialBodyType);
  const [selectedTransmission, setSelectedTransmission] = useState<string>(initialTransmission);
  const [selectedFuel, setSelectedFuel] = useState<string>(initialFuel);
  const [minPrice, setMinPrice] = useState<string>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  // Expand filter accordion on mobile/desktop
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Fetch cars directly from backend with all filter parameters and pagination
  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    const queryParams: Record<string, any> = {
      page,
      limit: 12,
    };
    if (typeFilter !== 'all') queryParams.listingType = typeFilter;
    if (selectedBrand !== 'all') queryParams.brand = selectedBrand;
    if (selectedBodyType !== 'all') queryParams.bodyType = selectedBodyType;
    if (selectedTransmission !== 'all') queryParams.transmission = selectedTransmission;
    if (selectedFuel !== 'all') queryParams.fuelType = selectedFuel;
    if (minPrice) queryParams.minPrice = minPrice;
    if (maxPrice) queryParams.maxPrice = maxPrice;
    if (searchQuery.trim()) queryParams.search = searchQuery.trim();
    if (sortBy !== 'newest') queryParams.sort = sortBy;

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
  }, [
    page,
    typeFilter,
    selectedBrand,
    selectedBodyType,
    selectedTransmission,
    selectedFuel,
    minPrice,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Synchronize URL parameters with browser history
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (typeFilter !== 'all') params.set('type', typeFilter);
    if (selectedBrand !== 'all') params.set('brand', selectedBrand);
    if (selectedBodyType !== 'all') params.set('bodyType', selectedBodyType);
    if (selectedTransmission !== 'all') params.set('transmission', selectedTransmission);
    if (selectedFuel !== 'all') params.set('fuelType', selectedFuel);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const queryStr = params.toString();
    router.replace(queryStr ? `/cars?${queryStr}` : '/cars', { scroll: false });
  }, [
    page,
    typeFilter,
    selectedBrand,
    selectedBodyType,
    selectedTransmission,
    selectedFuel,
    minPrice,
    maxPrice,
    searchQuery,
    sortBy,
    router,
  ]);

  const filteredCars = cars;

  const activeFiltersCount =
    (typeFilter !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedBodyType !== 'all' ? 1 : 0) +
    (selectedTransmission !== 'all' ? 1 : 0) +
    (selectedFuel !== 'all' ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetFilters = () => {
    setTypeFilter('all');
    setSelectedBrand('all');
    setSelectedBodyType('all');
    setSelectedTransmission('all');
    setSelectedFuel('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div>
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              Verified Marketplace Inventory
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-black mt-1">
              Explore Vehicle Fleet
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Search and filter certified vehicles for rent or purchase with 24/7 direct owner contact.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-2 rounded-2xl bg-black text-white">
              {filteredCars.length} Vehicles Found
            </span>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>

        {/* Multi-Parameter Search & Filter Console */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-5">
          {/* Row 1: Search, Type Pills, Sort */}
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, brand, model, or city (e.g. BMW, Miami, Coupe)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold focus:outline-none focus:border-black"
              />
            </div>

            {/* Listing Type Tabs */}
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl border border-zinc-200 text-xs font-bold w-full lg:w-auto">
              {[
                { key: 'all', label: 'All Listings' },
                { key: 'rent', label: 'For Rent' },
                { key: 'sale', label: 'For Sale' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setTypeFilter(tab.key);
                    setPage(1);
                  }}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-xl transition-all ${
                    typeFilter === tab.key
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
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rating</option>
              </select>
            </div>

            {/* Toggle Advanced Filters */}
            <button
              onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all w-full lg:w-auto justify-center ${
                advancedFiltersOpen || activeFiltersCount > 0
                  ? 'border-black bg-zinc-50 text-black'
                  : 'border-zinc-200 text-zinc-600 hover:border-black'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">
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
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                >
                  <option value="all">All Brands</option>
                  {POPULAR_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">Body Type</label>
                <select
                  value={selectedBodyType}
                  onChange={(e) => {
                    setSelectedBodyType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                >
                  <option value="all">All Body Types</option>
                  {BODY_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">Transmission</label>
                <select
                  value={selectedTransmission}
                  onChange={(e) => {
                    setSelectedTransmission(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                >
                  <option value="all">All Transmissions</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">Fuel Type</label>
                <select
                  value={selectedFuel}
                  onChange={(e) => {
                    setSelectedFuel(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                >
                  <option value="all">All Fuel Types</option>
                  <option value="petrol">Petrol / Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">Price Range ($)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                  />
                  <span className="text-zinc-400 font-bold">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100">
              <span className="text-[11px] font-bold text-zinc-400">Active filters:</span>
              {typeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black">
                  Type: {typeFilter.toUpperCase()}
                  <button onClick={() => setTypeFilter('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {selectedBodyType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black">
                  Body: {selectedBodyType}
                  <button onClick={() => setSelectedBodyType('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {selectedTransmission !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black">
                  Transmission: {selectedTransmission}
                  <button onClick={() => setSelectedTransmission('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {selectedFuel !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black">
                  Fuel: {selectedFuel}
                  <button onClick={() => setSelectedFuel('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black">
                  Price: ${minPrice || '0'} - ${maxPrice || '∞'}
                  <button
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                  >
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 text-xs font-bold text-black">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline ml-auto"
              >
                Clear all filters
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
            <h3 className="text-lg font-black text-black">No Vehicles Matched</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              We couldn&apos;t find any vehicles matching your selected search and filter criteria.
            </p>
            <Button variant="dark" size="sm" onClick={resetFilters}>
              Reset All Filters
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
