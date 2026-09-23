'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { HomeHero, HomeFilters, DEFAULT_HOME_FILTERS } from '@/components/home/HomeHero';
import { CarCard } from '@/components/common/CarCard';
import { CarCardSkeleton } from '@/components/common/CarCardSkeleton';
import { Button } from '@/components/ui/Button';
import { carService } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { FALLBACK_20_CARS } from '@/lib/fallbackCars';
import { FeaturedCarsSlider } from '@/components/home/FeaturedCarsSlider';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Headphones,
  Car as CarIcon,
  RotateCcw,
} from 'lucide-react';

export default function HomePage() {
  const [cars, setCars] = useState<ICar[]>(FALLBACK_20_CARS);
  const [isLoadingCars, setIsLoadingCars] = useState(true);

  // Staged / Draft filters in Hero
  const [draftFilters, setDraftFilters] = useState<HomeFilters>(DEFAULT_HOME_FILTERS);

  // Applied filters that actually filter the 20 cars grid
  const [appliedFilters, setAppliedFilters] = useState<HomeFilters>(DEFAULT_HOME_FILTERS);

  useEffect(() => {
    // Fetch live cars from MongoDB API (limit 50 to get full fleet)
    carService
      .getCars({ limit: 50 })
      .then((res) => {
        if (res && res.length > 0) {
          const existingSlugs = new Set(res.map((c) => c.slug));
          const extraFallbacks = FALLBACK_20_CARS.filter((c) => !existingSlugs.has(c.slug));
          setCars([...res, ...extraFallbacks]);
        }
      })
      .catch(() => {
        setCars(FALLBACK_20_CARS);
      })
      .finally(() => setIsLoadingCars(false));
  }, []);

  // Calculate active filter count (additional filters beyond tab)
  const activeFiltersCount =
    (appliedFilters.search.trim() ? 1 : 0) +
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
    (appliedFilters.maxMileage ? 1 : 0);

  // Check if staged filters differ from applied
  const hasPendingChanges =
    draftFilters.listingTab !== appliedFilters.listingTab ||
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

  // Apply filters
  const handleApply = useCallback(() => {
    setAppliedFilters({ ...draftFilters });
    // Smooth scroll down to showcase
    const el = document.getElementById('cars-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [draftFilters]);

  // Reset all filters
  const handleResetAll = useCallback(() => {
    setDraftFilters(DEFAULT_HOME_FILTERS);
    setAppliedFilters(DEFAULT_HOME_FILTERS);
  }, []);

  // Quick preset apply
  const handleApplyPreset = useCallback((presetUpdates: Partial<HomeFilters>) => {
    setDraftFilters((prev) => {
      const updated = { ...prev, ...presetUpdates };
      setAppliedFilters(updated);
      return updated;
    });
  }, []);

  // Remove individual filter chip
  const handleRemoveAppliedFilter = useCallback((key: string, defaultValue: string) => {
    setDraftFilters((prev) => ({ ...prev, [key]: defaultValue }));
    setAppliedFilters((prev) => ({ ...prev, [key]: defaultValue }));
  }, []);

  // Filter and sort the cars for the 20 cars showcase
  const displayCars = useMemo(() => {
    let result = [...cars];

    // 1. Listing Type filter (All vs Buy/Sale vs Rent)
    if (appliedFilters.listingTab === 'sale') {
      result = result.filter((c) => c.listingType === 'sale');
    } else if (appliedFilters.listingTab === 'rent') {
      result = result.filter((c) => c.listingType === 'rent');
    }

    // 2. Keyword Search
    if (appliedFilters.search.trim()) {
      const q = appliedFilters.search.toLowerCase().trim();
      result = result.filter((c) => {
        const title = (c.title || '').toLowerCase();
        const brand = (c.brand || '').toLowerCase();
        const model = (c.model || '').toLowerCase();
        const location = (c.location || '').toLowerCase();
        return title.includes(q) || brand.includes(q) || model.includes(q) || location.includes(q);
      });
    }

    // 3. Brand
    if (appliedFilters.brand !== 'all') {
      result = result.filter((c) => (c.brand || '').toLowerCase() === appliedFilters.brand.toLowerCase());
    }

    // 4. Model
    if (appliedFilters.model.trim()) {
      const m = appliedFilters.model.toLowerCase().trim();
      result = result.filter((c) => (c.model || '').toLowerCase().includes(m));
    }

    // 5. Condition
    if (appliedFilters.condition !== 'all') {
      result = result.filter((c) => {
        const cond = (c.condition || '').toLowerCase();
        if (appliedFilters.condition === 'certified') {
          return cond === 'certified' || cond === 'reconditioned';
        }
        return cond === appliedFilters.condition.toLowerCase();
      });
    }

    // 6. Fuel Type
    if (appliedFilters.fuelType !== 'all') {
      result = result.filter((c) => (c.fuelType || '').toLowerCase().includes(appliedFilters.fuelType.toLowerCase()));
    }

    // 7. Transmission
    if (appliedFilters.transmission !== 'all') {
      result = result.filter((c) => (c.transmission || '').toLowerCase().includes(appliedFilters.transmission.toLowerCase()));
    }

    // 8. Body Type
    if (appliedFilters.bodyType !== 'all') {
      result = result.filter((c) => (c.bodyType || '').toLowerCase().includes(appliedFilters.bodyType.toLowerCase()));
    }

    // 9. Location
    if (appliedFilters.location !== 'all') {
      result = result.filter((c) => (c.location || '').toLowerCase().includes(appliedFilters.location.toLowerCase()));
    }

    // 10. Price Range
    if (appliedFilters.minPrice) {
      const minP = Number(appliedFilters.minPrice);
      result = result.filter((c) => {
        const price = c.listingType === 'rent' ? (c.rentalPrice || c.price || 0) : (c.salePrice || c.price || 0);
        return price >= minP;
      });
    }
    if (appliedFilters.maxPrice) {
      const maxP = Number(appliedFilters.maxPrice);
      result = result.filter((c) => {
        const price = c.listingType === 'rent' ? (c.rentalPrice || c.price || 0) : (c.salePrice || c.price || 0);
        return price <= maxP;
      });
    }

    // 11. Year Range
    if (appliedFilters.minYear) {
      const minY = Number(appliedFilters.minYear);
      result = result.filter((c) => (c.year || 0) >= minY);
    }
    if (appliedFilters.maxYear) {
      const maxY = Number(appliedFilters.maxYear);
      result = result.filter((c) => (c.year || 0) <= maxY);
    }

    // 12. Max Mileage
    if (appliedFilters.maxMileage) {
      const maxM = Number(appliedFilters.maxMileage);
      result = result.filter((c) => (c.mileage || 0) <= maxM);
    }

    // 13. Sorting
    result.sort((a, b) => {
      const priceA = a.listingType === 'rent' ? (a.rentalPrice || a.price || 0) : (a.salePrice || a.price || 0);
      const priceB = b.listingType === 'rent' ? (b.rentalPrice || b.price || 0) : (b.salePrice || b.price || 0);

      switch (appliedFilters.sortBy) {
        case 'price_asc':
          return priceA - priceB;
        case 'price_desc':
          return priceB - priceA;
        case 'year_desc':
          return (b.year || 0) - (a.year || 0);
        case 'year_asc':
          return (a.year || 0) - (b.year || 0);
        case 'mileage_asc':
          return (a.mileage || 0) - (b.mileage || 0);
        case 'newest':
        default:
          return (b.year || 0) - (a.year || 0);
      }
    });

    // If browsing without extra narrow filters, ensure 20 cars are shown
    if (activeFiltersCount === 0) {
      return result.slice(0, 20);
    }

    return result;
  }, [cars, appliedFilters, activeFiltersCount]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION WITH CENTERED TEXT & COMPREHENSIVE FILTER SYSTEM */}
      <HomeHero
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        appliedFilters={appliedFilters}
        onApply={handleApply}
        onResetAll={handleResetAll}
        onApplyPreset={handleApplyPreset}
        onRemoveAppliedFilter={handleRemoveAppliedFilter}
        hasPendingChanges={hasPendingChanges}
        activeFiltersCount={activeFiltersCount}
        totalFilteredCount={displayCars.length}
      />

      {/* 2. DEDICATED 20 LATEST CARS SHOWCASE DIRECTLY BELOW HERO (NO REDUNDANT TEXT) */}
      <section id="cars-showcase" className="py-12 sm:py-16 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Subtle compact filter info bar only if active filters exist */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 text-xs">
              <span className="font-bold text-zinc-700">
                Filtered Results: Showing <strong className="text-black">{displayCars.length}</strong> vehicles
              </span>
              <button
                type="button"
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 hover:text-black hover:bg-zinc-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}

          {/* Latest 20 Cars Grid (Responsive 3-column layout) */}
          {isLoadingCars ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : displayCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 sm:p-16 rounded-3xl bg-white border border-zinc-200 text-center space-y-4 max-w-xl mx-auto shadow-sm">
              <CarIcon className="w-12 h-12 text-zinc-300 mx-auto" />
              <h3 className="text-lg font-bold text-black">No vehicles match your active filters</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Try loosening your filters, changing price range, or reset all filters to view our full collection of 20 vehicles.
              </p>
              <div className="pt-2">
                <Button variant="dark" size="sm" onClick={handleResetAll} leftIcon={<RotateCcw className="w-4 h-4" />}>
                  Reset All Filters
                </Button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. FEATURED CARS CAROUSEL SLIDER (UNIQUE LUXURY CARD STYLE) */}
      <FeaturedCarsSlider cars={cars} />

      {/* 3. TRUSTED PARTNER & ASSURANCE SECTION */}
      <section className="py-20 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Visual */}
            <div className="relative flex justify-center">
              <div className="relative w-[340px] sm:w-[420px] h-[340px] sm:h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80"
                  alt="Happy Driver"
                  className="w-48 sm:w-60 h-48 sm:h-60 rounded-full object-cover shadow-2xl border-4 border-white absolute top-0 left-0"
                />
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Luxury Car Renter"
                  className="w-52 sm:w-64 h-52 sm:h-64 rounded-full object-cover shadow-2xl border-4 border-white absolute bottom-0 right-0"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-black flex items-center justify-center text-white shadow-2xl border-2 border-white">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Right Copy */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-black text-xs font-bold uppercase tracking-wider border border-zinc-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Direct Customer Experience</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight">
                We make luxury automotive rentals &amp; sales completely hassle-free.
              </h2>

              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                Carketo empowers renters and buyers to directly connect with verified vehicle owners. Enjoy zero hidden booking commissions, transparent pricing, and instant contact reveal.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <Zap className="w-5 h-5 text-black mb-2" />
                  <h4 className="font-bold text-sm text-black">Direct Contact</h4>
                  <p className="text-xs text-zinc-500">
                    Instant phone numbers and WhatsApp links for seamless communication.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <Headphones className="w-5 h-5 text-black mb-2" />
                  <h4 className="font-bold text-sm text-black">24/7 Support</h4>
                  <p className="text-xs text-zinc-500">
                    Dedicated automotive concierge always on standby.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
