'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { carService } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { CarCard } from '@/components/common/CarCard';
import { Button } from '@/components/ui/Button';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';
import { Search, ShoppingBag, ShieldCheck, Truck, Plus } from 'lucide-react';

export default function BuyCarPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(500000);

  useEffect(() => {
    carService
      .getCars({ listingType: 'sale' })
      .then((res) => {
        setCars(res || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Filter only cars available for purchase
  const saleCars = useMemo(() => {
    return cars
      .filter((car) => car.listingType === 'sale')
      .filter((car) => {
        if (selectedBrand !== 'All' && car.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
        const bType = car.specs?.bodyType || car.bodyType || '';
        if (selectedBodyType !== 'All' && bType.toLowerCase() !== selectedBodyType.toLowerCase()) {
          return false;
        }
        if (selectedCondition !== 'All' && car.condition?.toLowerCase() !== selectedCondition.toLowerCase()) {
          return false;
        }
        const price = car.salePrice || car.price || 0;
        if (price && price > maxPrice) {
          return false;
        }
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            car.title.toLowerCase().includes(q) ||
            car.brand.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q)
          );
        }
        return true;
      });
  }, [cars, search, selectedBrand, selectedBodyType, selectedCondition, maxPrice]);

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

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by title, brand, or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Selects */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
              >
                <option value="All">All Makes</option>
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
              >
                <option value="All">All Body Types</option>
                {BODY_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black col-span-2 sm:col-span-1"
              >
                <option value="All">All Conditions</option>
                <option value="certified">Certified Pre-Owned</option>
                <option value="new">Brand New</option>
                <option value="used">Pre-Owned</option>
              </select>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-bold text-zinc-700 whitespace-nowrap">
                Max Price: <span className="text-black font-black">${maxPrice.toLocaleString()}</span>
              </span>
              <input
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full sm:w-48 accent-black cursor-pointer"
              />
            </div>

            <span className="text-zinc-500 font-semibold self-start sm:self-auto">
              Showing <span className="font-bold text-black">{saleCars.length}</span> vehicles for sale
            </span>
          </div>
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-zinc-200 animate-pulse" />
            ))}
          </div>
        ) : saleCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Cars for Sale Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No vehicles match your search filters or none are listed for sale yet.
            </p>
            <Link href="/sell">
              <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                List Car for Sale
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
