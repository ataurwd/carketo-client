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
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';
import {
  Search,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Plus,
  SlidersHorizontal,
  RotateCcw,
  X,
} from 'lucide-react';

function BuyCarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams?.get('page')) || 1;
  const initialSearch = searchParams?.get('q') || '';
  const initialBrand = searchParams?.get('brand') || 'all';
  const initialBodyType = searchParams?.get('bodyType') || 'all';
  const initialTransmission = searchParams?.get('transmission') || 'all';
  const initialFuel = searchParams?.get('fuelType') || 'all';
  const initialMinPrice = searchParams?.get('minPrice') || '';
  const initialMaxPrice = searchParams?.get('maxPrice') || '';
  const initialSort = searchParams?.get('sort') || 'newest';

  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(initialPage);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: initialPage,
    limit: 12,
    totalPages: 1,
  });

  const [search, setSearch] = useState(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedBodyType, setSelectedBodyType] = useState(initialBodyType);
  const [selectedTransmission, setSelectedTransmission] = useState(initialTransmission);
  const [selectedFuel, setSelectedFuel] = useState(initialFuel);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [sortBy, setSortBy] = useState(initialSort);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Active filters count
  const activeFiltersCount =
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedBodyType !== 'all' ? 1 : 0) +
    (selectedTransmission !== 'all' ? 1 : 0) +
    (selectedFuel !== 'all' ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (search ? 1 : 0);

  const resetFilters = () => {
    setPage(1);
    setSelectedBrand('all');
    setSelectedBodyType('all');
    setSelectedTransmission('all');
    setSelectedFuel('all');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    setSortBy('newest');
  };

  // Fetch paginated cars for sale from backend
  const fetchSaleCars = useCallback(async () => {
    setIsLoading(true);
    const queryParams: Record<string, any> = {
      listingType: 'sale',
      page,
      limit: 12,
    };
    if (selectedBrand !== 'all') queryParams.brand = selectedBrand;
    if (selectedBodyType !== 'all') queryParams.bodyType = selectedBodyType;
    if (selectedTransmission !== 'all') queryParams.transmission = selectedTransmission;
    if (selectedFuel !== 'all') queryParams.fuelType = selectedFuel;
    if (minPrice) queryParams.minPrice = minPrice;
    if (maxPrice) queryParams.maxPrice = maxPrice;
    if (search.trim()) queryParams.search = search.trim();
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
    selectedBrand,
    selectedBodyType,
    selectedTransmission,
    selectedFuel,
    minPrice,
    maxPrice,
    search,
    sortBy,
  ]);

  useEffect(() => {
    fetchSaleCars();
  }, [fetchSaleCars]);

  // Synchronize URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (selectedBrand !== 'all') params.set('brand', selectedBrand);
    if (selectedBodyType !== 'all') params.set('bodyType', selectedBodyType);
    if (selectedTransmission !== 'all') params.set('transmission', selectedTransmission);
    if (selectedFuel !== 'all') params.set('fuelType', selectedFuel);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (search.trim()) params.set('q', search.trim());
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const queryStr = params.toString();
    router.replace(queryStr ? `/buy?${queryStr}` : '/buy', { scroll: false });
  }, [
    page,
    selectedBrand,
    selectedBodyType,
    selectedTransmission,
    selectedFuel,
    minPrice,
    maxPrice,
    search,
    sortBy,
    router,
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="bg-black text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>Certified Showroom</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Buy Verified Cars
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Explore vehicles with clean titles and direct owner contacts. Call and negotiate directly with sellers.
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

        {/* Multi-Parameter Filter Console */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          {/* Row 1: Search, Sort & Filters Toggle */}
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search cars by make, model, title, or location..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
              />
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
                <option value="year_desc">Year: Newest Models</option>
              </select>
            </div>

            {/* Toggle Advanced Filters */}
            <button
              type="button"
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

          {/* Row 2: Advanced Filters Grid (Brand, Body Type, Transmission, Fuel Type, Price Range) */}
          <div className="pt-3 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-semibold">
            {/* Brand */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">
                Brand
              </label>
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
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">
                Body Type
              </label>
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
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">
                Transmission
              </label>
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
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">
                Fuel Type
              </label>
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
              <label className="block text-zinc-500 font-bold mb-1 text-[11px] uppercase">
                Price Range ($)
              </label>
              <div className="flex items-center gap-1.5">
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

          {/* Active Filter Chips & Reset */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 text-xs">
              <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-wider">
                Active filters:
              </span>
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-bold text-[11px]">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {selectedBodyType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-bold text-[11px]">
                  Body: {selectedBodyType}
                  <button onClick={() => setSelectedBodyType('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {selectedTransmission !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-bold text-[11px]">
                  Trans: {selectedTransmission}
                  <button onClick={() => setSelectedTransmission('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {selectedFuel !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-bold text-[11px]">
                  Fuel: {selectedFuel}
                  <button onClick={() => setSelectedFuel('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-bold text-[11px]">
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
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline ml-auto flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear all filters
              </button>
            </div>
          )}
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
            <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Cars for Sale Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No vehicles match your search filters or none are listed for sale yet.
            </p>
            <div className="flex justify-center gap-3">
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset All Filters
                </Button>
              )}
              <Link href="/sell">
                <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  List Car for Sale
                </Button>
              </Link>
            </div>
          </div>
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
