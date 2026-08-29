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
} from 'lucide-react';
import { ActiveFilterChips } from './ActiveFilterChips';

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
  onPageReset: () => void;
  onResetAll: () => void;
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
  onPageReset,
  onResetAll,
}: BuyFilterBarProps) {
  return (
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
              onPageReset();
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                onPageReset();
              }}
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
              onPageReset();
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
          onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all w-full lg:w-auto justify-center shadow-sm ${
            advancedFiltersOpen || activeFiltersCount > 0
              ? 'border-black bg-zinc-900 text-white'
              : 'border-zinc-200 text-zinc-700 bg-white hover:border-black'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{advancedFiltersOpen ? 'Hide Filters' : 'All Filters'}</span>
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
                Brand / Make
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  onPageReset();
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
                  onPageReset();
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
                  onPageReset();
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
                  onPageReset();
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
                    onPageReset();
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
                    onPageReset();
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
                <span>Mfg. Year Range</span>
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  value={minYear}
                  onChange={(e) => {
                    setMinYear(e.target.value);
                    onPageReset();
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
                    onPageReset();
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
                  onPageReset();
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
                  onPageReset();
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="all">All Body Classes</option>
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
                <span>Location / City</span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  onPageReset();
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
                  onPageReset();
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
                onPageReset();
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
                onPageReset();
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
                onPageReset();
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
                onPageReset();
              }}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              ৳80L+ Luxury
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedFuel('hybrid');
                onPageReset();
              }}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] transition-colors"
            >
              Hybrid Fleet
            </button>
            <button
              type="button"
              onClick={() => {
                setMinYear('2021');
                onPageReset();
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
        <ActiveFilterChips
          search={search}
          setSearch={(v) => {
            setSearch(v);
            onPageReset();
          }}
          selectedBrand={selectedBrand}
          setSelectedBrand={(v) => {
            setSelectedBrand(v);
            onPageReset();
          }}
          selectedModel={selectedModel}
          setSelectedModel={(v) => {
            setSelectedModel(v);
            onPageReset();
          }}
          selectedCondition={selectedCondition}
          setSelectedCondition={(v) => {
            setSelectedCondition(v);
            onPageReset();
          }}
          minYear={minYear}
          setMinYear={(v) => {
            setMinYear(v);
            onPageReset();
          }}
          maxYear={maxYear}
          setMaxYear={(v) => {
            setMaxYear(v);
            onPageReset();
          }}
          selectedFuel={selectedFuel}
          setSelectedFuel={(v) => {
            setSelectedFuel(v);
            onPageReset();
          }}
          minPrice={minPrice}
          setMinPrice={(v) => {
            setMinPrice(v);
            onPageReset();
          }}
          maxPrice={maxPrice}
          setMaxPrice={(v) => {
            setMaxPrice(v);
            onPageReset();
          }}
          selectedTransmission={selectedTransmission}
          setSelectedTransmission={(v) => {
            setSelectedTransmission(v);
            onPageReset();
          }}
          selectedBodyType={selectedBodyType}
          setSelectedBodyType={(v) => {
            setSelectedBodyType(v);
            onPageReset();
          }}
          selectedLocation={selectedLocation}
          setSelectedLocation={(v) => {
            setSelectedLocation(v);
            onPageReset();
          }}
          maxMileage={maxMileage}
          setMaxMileage={(v) => {
            setMaxMileage(v);
            onPageReset();
          }}
          onResetAll={onResetAll}
        />
      )}
    </div>
  );
}
