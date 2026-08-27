'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CarCard } from '@/components/common/CarCard';
import { carService } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';
import { Search, SlidersHorizontal, RotateCcw, Plus, Car as CarIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function CarsCatalogContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams?.get('type') || 'all';

  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState<string>(initialType);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    carService
      .getCars()
      .then((res) => {
        setCars(res || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredCars = cars.filter((car) => {
    if (typeFilter !== 'all' && car.listingType !== typeFilter) {
      return false;
    }
    if (selectedBrand !== 'all' && car.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }
    const bType = car.specs?.bodyType || car.bodyType || '';
    if (
      selectedBodyType !== 'all' &&
      bType.toLowerCase() !== selectedBodyType.toLowerCase()
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
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div>
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
              Inventory Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-black">
              Browse Vehicles
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Explore available cars for rent and purchase with transparent direct owner contacts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700">
              {filteredCars.length} Available
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-xs font-bold uppercase tracking-wider text-black">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Search & Filter Options</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search make, model, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold placeholder-zinc-400 focus:outline-none focus:border-black"
              />
            </div>

            {/* Listing Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
              >
                <option value="all">All Listing Types</option>
                <option value="rent">Cars for Rent</option>
                <option value="sale">Cars for Sale</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
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
            <div>
              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
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
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-zinc-200 animate-pulse" />
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <CarIcon className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Vehicles Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              We couldn't find any vehicles matching your search criteria.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Link href="/sell">
                <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  List a Car
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 py-20 flex justify-center"><div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" /></div>}>
      <CarsCatalogContent />
    </Suspense>
  );
}
