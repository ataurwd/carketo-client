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
import { formatPrice } from '@/lib/utils';
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
  Calendar,
  Fuel,
  Gauge,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';

const BODY_TYPES_LIST = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Crossover',
  'Coupe',
  'MPV / Van',
  'Convertible',
  'Pickup / Truck',
];

const CONDITIONS_LIST = [
  { value: 'all', label: 'All Conditions' },
  { value: 'new', label: 'Brand New' },
  { value: 'reconditioned', label: 'Reconditioned' },
  { value: 'used', label: 'Used / Pre-Owned' },
];

const FUEL_TYPES_LIST = [
  { value: 'all', label: 'All Fuel Types' },
  { value: 'petrol', label: 'Petrol / Octane' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: '100% Electric (EV)' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'cng', label: 'CNG / LPG' },
];

const TRANSMISSIONS_LIST = [
  { value: 'all', label: 'All Transmissions' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'dual-clutch', label: 'Dual-Clutch / Tiptronic' },
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

function BuyCarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams?.get('page')) || 1;
  const initialSearch = searchParams?.get('q') || '';
  const initialBrand = searchParams?.get('brand') || 'all';
  const initialModel = searchParams?.get('model') || '';
  const initialCondition = searchParams?.get('condition') || 'all';
  const initialMinYear = searchParams?.get('minYear') || '';
  const initialMaxYear = searchParams?.get('maxYear') || '';
  const initialBodyType = searchParams?.get('bodyType') || 'all';
  const initialTransmission = searchParams?.get('transmission') || 'all';
  const initialFuel = searchParams?.get('fuelType') || 'all';
  const initialLocation = searchParams?.get('location') || 'all';
  const initialMinPrice = searchParams?.get('minPrice') || '';
  const initialMaxPrice = searchParams?.get('maxPrice') || '';
  const initialMaxMileage = searchParams?.get('maxMileage') || '';
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

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [selectedCondition, setSelectedCondition] = useState(initialCondition);
  const [minYear, setMinYear] = useState(initialMinYear);
  const [maxYear, setMaxYear] = useState(initialMaxYear);
  const [selectedBodyType, setSelectedBodyType] = useState(initialBodyType);
  const [selectedTransmission, setSelectedTransmission] = useState(initialTransmission);
  const [selectedFuel, setSelectedFuel] = useState(initialFuel);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [maxMileage, setMaxMileage] = useState(initialMaxMileage);
  const [sortBy, setSortBy] = useState(initialSort);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

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
    if (search.trim()) params.set('q', search.trim());
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
        {/* Hero Header */}
        <div className="bg-black text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>Certified Showroom</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Buy Verified Cars in Bangladesh
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Explore 100% verified vehicles with direct owner contact details. Filter by model, manufacturing year, condition, fuel type, and price range with zero middleman commissions.
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

        {/* ========================================================================= */}
        {/* ADVANCED MULTI-PARAMETER FILTER CONSOLE                                  */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200 shadow-sm space-y-5">
          {/* TOP BAR: Keyword Search, Sort, and Filter Toggle */}
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by title, brand, model name (e.g. Premio, Civic), location..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="w-full lg:w-56">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer shadow-sm"
              >
                <option value="newest">Sort: Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest Models</option>
                <option value="year_asc">Year: Older Models</option>
                <option value="mileage_asc">Mileage: Lowest First</option>
              </select>
            </div>

            {/* Toggle More Filters */}
            <button
              type="button"
              onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all w-full lg:w-auto justify-center shadow-sm ${
                advancedFiltersOpen || activeFiltersCount > 0
                  ? 'border-black bg-zinc-900 text-white'
                  : 'border-zinc-200 text-zinc-700 bg-white hover:border-black'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{advancedFiltersOpen ? 'Less Filters' : 'All Filters'}</span>
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

          {/* PRIMARY FILTER ROW: Brand, Model, Condition, Fuel Type, Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2 border-t border-zinc-100 text-xs font-semibold">
            {/* 1. Brand Selector */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                Brand / Make
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="all">All Brands</option>
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
                Model Name
              </label>
              <input
                type="text"
                placeholder="e.g. Premio, Civic..."
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
              />
            </div>

            {/* 3. Condition */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                Condition
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => {
                  setSelectedCondition(e.target.value);
                  setPage(1);
                }}
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
                Fuel Type
              </label>
              <select
                value={selectedFuel}
                onChange={(e) => {
                  setSelectedFuel(e.target.value);
                  setPage(1);
                }}
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
                Price Range (৳)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min ৳"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                />
                <span className="text-zinc-400 font-bold">-</span>
                <input
                  type="number"
                  placeholder="Max ৳"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* SECONDARY EXPANDABLE FILTER ROW: Manufacturing Year, Transmission, Body Type, Location, Mileage */}
          {advancedFiltersOpen && (
            <div className="pt-4 border-t border-zinc-100 space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs font-semibold">
                {/* 6. Manufacturing Year Range */}
                <div>
                  <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-black" />
                    <span>Mfg. Year Range</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={minYear}
                      onChange={(e) => {
                        setMinYear(e.target.value);
                        setPage(1);
                      }}
                      className="w-full px-2 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="">Min Year</option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={`min-${y}`} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <span className="text-zinc-400 font-bold">-</span>
                    <select
                      value={maxYear}
                      onChange={(e) => {
                        setMaxYear(e.target.value);
                        setPage(1);
                      }}
                      className="w-full px-2 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="">Max Year</option>
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
                    <span>Transmission</span>
                  </label>
                  <select
                    value={selectedTransmission}
                    onChange={(e) => {
                      setSelectedTransmission(e.target.value);
                      setPage(1);
                    }}
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
                    Body Class
                  </label>
                  <select
                    value={selectedBodyType}
                    onChange={(e) => {
                      setSelectedBodyType(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="all">All Body Classes</option>
                    {BODY_TYPES_LIST.map((bt) => (
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
                    <span>Location / City</span>
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                  >
                    {LOCATIONS_LIST.map((loc) => (
                      <option key={loc} value={loc === 'All Locations' ? 'all' : loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 10. Max Mileage Range */}
                <div>
                  <label className="block text-zinc-500 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                    Max Mileage
                  </label>
                  <select
                    value={maxMileage}
                    onChange={(e) => {
                      setMaxMileage(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="">Any Mileage</option>
                    <option value="20000">Under 20,000 km</option>
                    <option value="50000">Under 50,000 km</option>
                    <option value="80000">Under 80,000 km</option>
                    <option value="120000">Under 120,000 km</option>
                  </select>
                </div>
              </div>

              {/* Quick Preset Filter Chips */}
              <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Quick Presets:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('2000000');
                    setPage(1);
                  }}
                  className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
                >
                  Under ৳20 Lakh
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('2000000');
                    setMaxPrice('4000000');
                    setPage(1);
                  }}
                  className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
                >
                  ৳20L - ৳40L
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('4000000');
                    setMaxPrice('8000000');
                    setPage(1);
                  }}
                  className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
                >
                  ৳40L - ৳80L
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('8000000');
                    setMaxPrice('');
                    setPage(1);
                  }}
                  className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
                >
                  ৳80L+ Luxury
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFuel('hybrid');
                    setPage(1);
                  }}
                  className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
                >
                  Hybrid Fleet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinYear('2021');
                    setPage(1);
                  }}
                  className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
                >
                  2021 & Newer
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE FILTER CHIPS & RESET */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-100 text-xs">
              <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-wider">
                Active filters:
              </span>

              {search.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white font-bold text-[11px] shadow-sm">
                  Search: "{search}"
                  <button onClick={() => setSearch('')}>
                    <X className="w-3 h-3 text-zinc-300 hover:text-white" />
                  </button>
                </span>
              )}

              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedModel.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  Model: {selectedModel}
                  <button onClick={() => setSelectedModel('')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedCondition !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  Condition: {selectedCondition.toUpperCase()}
                  <button onClick={() => setSelectedCondition('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}

              {(minYear || maxYear) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  Mfg. Year: {minYear || 'Any'} - {maxYear || 'Present'}
                  <button
                    onClick={() => {
                      setMinYear('');
                      setMaxYear('');
                    }}
                  >
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedFuel !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  Fuel: {selectedFuel}
                  <button onClick={() => setSelectedFuel('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  Price: {minPrice ? formatPrice(Number(minPrice)) : '৳0'} - {maxPrice ? formatPrice(Number(maxPrice)) : 'Any'}
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

              {selectedTransmission !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  Transmission: {selectedTransmission}
                  <button onClick={() => setSelectedTransmission('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedBodyType !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  Body: {selectedBodyType}
                  <button onClick={() => setSelectedBodyType('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedLocation !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  City: {selectedLocation}
                  <button onClick={() => setSelectedLocation('all')}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </button>
                </span>
              )}

              {maxMileage && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
                  Max Mileage: {Number(maxMileage).toLocaleString()} km
                  <button onClick={() => setMaxMileage('')}>
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
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CARS FOR SALE GRID DISPLAY                                               */}
        {/* ========================================================================= */}
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
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Cars for Sale Matching Your Criteria</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your model name, price range, or manufacturing year filters to find more vehicles.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={resetFilters} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
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
