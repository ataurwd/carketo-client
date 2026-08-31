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

function BuyCarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialSearch = () =>
    searchParams?.get('search') || searchParams?.get('q') || searchParams?.get('location') || '';
  const getInitialBrand = () => searchParams?.get('brand') || 'all';
  const getInitialModel = () => searchParams?.get('model') || '';
  const getInitialCondition = () => searchParams?.get('condition') || 'all';
  const getInitialMinYear = () => searchParams?.get('minYear') || '';
  const getInitialMaxYear = () => searchParams?.get('maxYear') || '';
  const getInitialBodyType = () => searchParams?.get('bodyType') || 'all';
  const getInitialTransmission = () => searchParams?.get('transmission') || 'all';
  const getInitialFuel = () => searchParams?.get('fuelType') || 'all';
  const getInitialLocation = () => searchParams?.get('location') || 'all';
  const getInitialMinPrice = () => searchParams?.get('minPrice') || '';
  const getInitialMaxPrice = () => searchParams?.get('maxPrice') || '';
  const getInitialMaxMileage = () => searchParams?.get('maxMileage') || '';
  const getInitialSort = () => searchParams?.get('sort') || 'newest';
  const getInitialPage = () => Number(searchParams?.get('page')) || 1;

  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(getInitialPage());
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: getInitialPage(),
    limit: 12,
    totalPages: 1,
  });

  // Filter States
  const [search, setSearch] = useState(getInitialSearch());
  const [selectedBrand, setSelectedBrand] = useState(getInitialBrand());
  const [selectedModel, setSelectedModel] = useState(getInitialModel());
  const [selectedCondition, setSelectedCondition] = useState(getInitialCondition());
  const [minYear, setMinYear] = useState(getInitialMinYear());
  const [maxYear, setMaxYear] = useState(getInitialMaxYear());
  const [selectedBodyType, setSelectedBodyType] = useState(getInitialBodyType());
  const [selectedTransmission, setSelectedTransmission] = useState(getInitialTransmission());
  const [selectedFuel, setSelectedFuel] = useState(getInitialFuel());
  const [selectedLocation, setSelectedLocation] = useState(getInitialLocation());
  const [minPrice, setMinPrice] = useState(getInitialMinPrice());
  const [maxPrice, setMaxPrice] = useState(getInitialMaxPrice());
  const [maxMileage, setMaxMileage] = useState(getInitialMaxMileage());
  const [sortBy, setSortBy] = useState(getInitialSort());
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Sync state when URL searchParams changes (e.g. from homepage search)
  useEffect(() => {
    const q = searchParams?.get('search') || searchParams?.get('q') || searchParams?.get('location') || '';
    const b = searchParams?.get('brand') || 'all';
    const m = searchParams?.get('model') || '';
    const c = searchParams?.get('condition') || 'all';
    const minY = searchParams?.get('minYear') || '';
    const maxY = searchParams?.get('maxYear') || '';
    const bt = searchParams?.get('bodyType') || 'all';
    const tr = searchParams?.get('transmission') || 'all';
    const ft = searchParams?.get('fuelType') || 'all';
    const loc = searchParams?.get('location') || 'all';
    const minP = searchParams?.get('minPrice') || '';
    const maxP = searchParams?.get('maxPrice') || '';
    const maxMil = searchParams?.get('maxMileage') || '';
    const srt = searchParams?.get('sort') || 'newest';
    const p = Number(searchParams?.get('page')) || 1;

    setSearch(q);
    setSelectedBrand(b);
    setSelectedModel(m);
    setSelectedCondition(c);
    setMinYear(minY);
    setMaxYear(maxY);
    setSelectedBodyType(bt);
    setSelectedTransmission(tr);
    setSelectedFuel(ft);
    setSelectedLocation(loc);
    setMinPrice(minP);
    setMaxPrice(maxP);
    setMaxMileage(maxMil);
    setSortBy(srt);
    setPage(p);
  }, [searchParams]);

  // Calculate active filters count
  const activeFiltersCount =
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedModel.trim() ? 1 : 0) +
    (selectedCondition !== 'all' ? 1 : 0) +
    (minYear ? 1 : 0) +
    (maxYear ? 1 : 0) +
    (selectedBodyType !== 'all' ? 1 : 0) +
    (selectedTransmission !== 'all' ? 1 : 0) +
    (selectedFuel !== 'all' ? 1 : 0) +
    (selectedLocation !== 'all' ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (maxMileage ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const resetFilters = () => {
    setPage(1);
    setSelectedBrand('all');
    setSelectedModel('');
    setSelectedCondition('all');
    setMinYear('');
    setMaxYear('');
    setSelectedBodyType('all');
    setSelectedTransmission('all');
    setSelectedFuel('all');
    setSelectedLocation('all');
    setMinPrice('');
    setMaxPrice('');
    setMaxMileage('');
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
    if (selectedModel.trim()) queryParams.model = selectedModel.trim();
    if (selectedCondition !== 'all') queryParams.condition = selectedCondition;
    if (minYear) queryParams.minYear = minYear;
    if (maxYear) queryParams.maxYear = maxYear;
    if (selectedBodyType !== 'all') queryParams.bodyType = selectedBodyType;
    if (selectedTransmission !== 'all') queryParams.transmission = selectedTransmission;
    if (selectedFuel !== 'all') queryParams.fuelType = selectedFuel;
    if (selectedLocation !== 'all') queryParams.location = selectedLocation;
    if (minPrice) queryParams.minPrice = minPrice;
    if (maxPrice) queryParams.maxPrice = maxPrice;
    if (maxMileage) queryParams.maxMileage = maxMileage;
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
    selectedModel,
    selectedCondition,
    minYear,
    maxYear,
    selectedBodyType,
    selectedTransmission,
    selectedFuel,
    selectedLocation,
    minPrice,
    maxPrice,
    maxMileage,
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
    if (selectedModel.trim()) params.set('model', selectedModel.trim());
    if (selectedCondition !== 'all') params.set('condition', selectedCondition);
    if (minYear) params.set('minYear', minYear);
    if (maxYear) params.set('maxYear', maxYear);
    if (selectedBodyType !== 'all') params.set('bodyType', selectedBodyType);
    if (selectedTransmission !== 'all') params.set('transmission', selectedTransmission);
    if (selectedFuel !== 'all') params.set('fuelType', selectedFuel);
    if (selectedLocation !== 'all') params.set('location', selectedLocation);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (maxMileage) params.set('maxMileage', maxMileage);
    if (search.trim()) {
      params.set('q', search.trim());
      params.set('search', search.trim());
    }
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const queryStr = params.toString();
    router.replace(queryStr ? `/buy?${queryStr}` : '/buy', { scroll: false });
  }, [
    page,
    selectedBrand,
    selectedModel,
    selectedCondition,
    minYear,
    maxYear,
    selectedBodyType,
    selectedTransmission,
    selectedFuel,
    selectedLocation,
    minPrice,
    maxPrice,
    maxMileage,
    search,
    sortBy,
    router,
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Modular Hero Section */}
        <BuyHero />

        {/* Modular Multi-Parameter Filter Console */}
        <BuyFilterBar
          search={search}
          setSearch={setSearch}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          minYear={minYear}
          setMinYear={setMinYear}
          maxYear={maxYear}
          setMaxYear={setMaxYear}
          selectedFuel={selectedFuel}
          setSelectedFuel={setSelectedFuel}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          selectedTransmission={selectedTransmission}
          setSelectedTransmission={setSelectedTransmission}
          selectedBodyType={selectedBodyType}
          setSelectedBodyType={setSelectedBodyType}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          maxMileage={maxMileage}
          setMaxMileage={setMaxMileage}
          sortBy={sortBy}
          setSortBy={setSortBy}
          advancedFiltersOpen={advancedFiltersOpen}
          setAdvancedFiltersOpen={setAdvancedFiltersOpen}
          activeFiltersCount={activeFiltersCount}
          onPageReset={() => setPage(1)}
          onResetAll={resetFilters}
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
            onResetFilters={resetFilters}
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
