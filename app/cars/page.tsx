'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CarCard } from '@/components/common/CarCard';
import { fallbackCars } from '@/services/car.service';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function CarsCatalogContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams?.get('type') || 'all';

  const [typeFilter, setTypeFilter] = useState<string>(initialType);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCars = fallbackCars.filter((car) => {
    if (typeFilter !== 'all' && car.listingType !== typeFilter && car.listingType !== 'both') {
      return false;
    }
    if (selectedBrand !== 'all' && car.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }
    if (
      selectedBodyType !== 'all' &&
      car.specs.bodyType.toLowerCase() !== selectedBodyType.toLowerCase()
    ) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = car.title.toLowerCase().includes(q);
      const matchBrand = car.brand.toLowerCase().includes(q);
      const matchLocation = car.location.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchLocation) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setTypeFilter('all');
    setSelectedBrand('all');
    setSelectedBodyType('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <span className="text-brand font-bold text-xs uppercase tracking-widest">
              Inventory Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Browse Vehicles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing <span className="font-bold text-slate-800">{filteredCars.length}</span> verified cars ready for delivery
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              {['all', 'rent', 'sale'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    typeFilter === t
                      ? 'bg-brand text-white shadow-glow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'all' ? 'All Inventory' : `For ${t}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column: Sidebar Filters + Cars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-brand" />
                <span>Filters</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-brand transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model, location..."
                  className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Make / Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand"
              >
                <option value="all">All Brands</option>
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Type Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Body Type
              </label>
              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand"
              >
                <option value="all">All Body Types</option>
                {BODY_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="lg:col-span-9 space-y-6">
            {filteredCars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No vehicles found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your filter criteria or reset filters to see all available cars.
                </p>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand" />
        </div>
      }
    >
      <CarsCatalogContent />
    </Suspense>
  );
}

