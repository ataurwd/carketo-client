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
import { PricingPlans } from '@/components/home/PricingPlans';
import { Pagination } from '@/components/common/Pagination';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Car as CarIcon,
  RotateCcw,
  Building2,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  BadgePercent,
} from 'lucide-react';

export default function HomePage() {
  const [cars, setCars] = useState<ICar[]>(FALLBACK_20_CARS);
  const [isLoadingCars, setIsLoadingCars] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const CARS_PER_PAGE = 12;

  // Staged / Draft filters in Hero
  const [draftFilters, setDraftFilters] = useState<HomeFilters>(DEFAULT_HOME_FILTERS);

  // Applied filters that actually filter the cars grid
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
    setCurrentPage(1);
    setAppliedFilters({ ...draftFilters });
    // Smooth scroll down to showcase
    const el = document.getElementById('cars-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [draftFilters]);

  // Reset all filters
  const handleResetAll = useCallback(() => {
    setCurrentPage(1);
    setDraftFilters(DEFAULT_HOME_FILTERS);
    setAppliedFilters(DEFAULT_HOME_FILTERS);
  }, []);

  // Quick preset apply
  const handleApplyPreset = useCallback((presetUpdates: Partial<HomeFilters>) => {
    setCurrentPage(1);
    setDraftFilters((prev) => {
      const updated = { ...prev, ...presetUpdates };
      setAppliedFilters(updated);
      return updated;
    });
  }, []);

  // Remove individual filter chip
  const handleRemoveAppliedFilter = useCallback((key: string, defaultValue: string) => {
    setCurrentPage(1);
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

    // 13. Sorting (Featured vehicles are prioritized first, followed by selected sort criteria)
    result.sort((a, b) => {
      const featA = a.isFeatured ? 1 : 0;
      const featB = b.isFeatured ? 1 : 0;
      if (featA !== featB) {
        return featB - featA; // Featured cars (1) always appear before non-featured (0)
      }

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

    return result;
  }, [cars, appliedFilters]);

  // Total pages and sliced cars for current page
  const totalPages = Math.ceil(displayCars.length / CARS_PER_PAGE) || 1;

  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * CARS_PER_PAGE;
    return displayCars.slice(start, start + CARS_PER_PAGE);
  }, [displayCars, currentPage]);

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
                ফিল্টারকৃত ফলাফল: <strong className="text-black">{displayCars.length}</strong>টি গাড়ি দেখানো হচ্ছে
              </span>
              <button
                type="button"
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 hover:text-black hover:bg-zinc-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ফিল্টার রিসেট করুন</span>
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
          ) : paginatedCars.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paginatedCars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>

              {/* Daraz-Style Sliding Pagination */}
              {totalPages > 1 && (
                <div className="pt-4 border-t border-zinc-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={displayCars.length}
                    limit={CARS_PER_PAGE}
                    onPageChange={(newPage) => {
                      setCurrentPage(newPage);
                      const el = document.getElementById('cars-showcase');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 sm:p-16 rounded-3xl bg-white border border-zinc-200 text-center space-y-4 max-w-xl mx-auto shadow-sm">
              <CarIcon className="w-12 h-12 text-zinc-300 mx-auto" />
              <h3 className="text-lg font-bold text-black">আপনার নির্বাচিত ফিল্টারে কোনো গাড়ি পাওয়া যায়নি</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                ফিল্টার পরিবর্তন করে বা দামের সীমা বদলে আবার চেষ্টা করুন, অথবা সব গাড়ি দেখতে ফিল্টার রিসেট করুন।
              </p>
              <div className="pt-2">
                <Button variant="dark" size="sm" onClick={handleResetAll} leftIcon={<RotateCcw className="w-4 h-4" />}>
                  সব ফিল্টার রিসেট করুন
                </Button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. FEATURED CARS CAROUSEL SLIDER (UNIQUE LUXURY CARD STYLE) */}
      <FeaturedCarsSlider cars={cars} />

      {/* 4. BUSINESS PROFILE BENEFITS & PROFITABILITY SECTION */}
      <section className="py-20 sm:py-24 border-t border-zinc-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Visual: Interactive Business Profile & Profit Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Dealership Showcase Card */}
                <div className="rounded-3xl bg-zinc-950 text-white p-6 sm:p-7 shadow-2xl border border-zinc-800 space-y-6 relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Dealership Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-md shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-base text-white">রয়্যাল অটোস বিডি</h3>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        </div>
                        <p className="text-[11px] text-zinc-400">ভেরিফাইড বিজনেস প্রোফাইল • ঢাকা</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      প্রো ডিলার
                    </span>
                  </div>

                  {/* Showroom Image Banner */}
                  <div className="relative h-40 rounded-2xl overflow-hidden border border-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80"
                      alt="Car Dealership Showroom"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <div className="flex items-center justify-between w-full text-xs">
                        <span className="font-bold text-white">সক্রিয় ইনভেন্টরি: ২৪টি গাড়ি</span>
                        <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white font-semibold text-[11px]">
                          বিক্রয় ও ভাড়া
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profit & Growth Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                      <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                        <span>মাসিক গড় আয় বৃদ্ধি</span>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-2xl font-black text-white">+৩.৫ গুণ</p>
                      <span className="text-[10px] text-emerald-400 font-semibold block">
                        সরাসরি ক্রেতা ও ভাড়াটে লিড
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                      <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                        <span>প্ল্যাটফর্ম কমিশন</span>
                        <BadgePercent className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-2xl font-black text-white">০% চার্জ</p>
                      <span className="text-[10px] text-zinc-400 font-semibold block">
                        ১০০% লাভ সরাসরি আপনার
                      </span>
                    </div>
                  </div>

                  {/* Bottom Highlight Strip */}
                  <div className="flex items-center justify-between pt-1 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>তাৎক্ষণিক কল ও হোয়াটসঅ্যাপ ইনকোয়ারি</span>
                    </div>
                    <span className="text-emerald-400 font-bold">সক্রিয় ২৪/৭</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Copy: Business Profile Advantages & Benefits */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 text-black text-xs font-bold tracking-wide border border-zinc-200">
                <Building2 className="w-3.5 h-3.5" />
                <span>বিজনেস প্রোফাইলের বিশেষ সুবিধাসমূহ</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight">
                বিজনেস প্রোফাইল খুলে আপনার গাড়ি বিক্রি ও ভাড়ার ব্যবসা বাড়ান বহুগুণ।
              </h2>

              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                আপনার গাড়ির শোরুম, রেন্ট-এ-কার ব্যবসা কিংবা একাধিক ব্যক্তিগত গাড়ি থাকলে কারকেটোতে একটি <strong>বিজনেস প্রোফাইল</strong> খুলুন। কোনো মধ্যস্বত্বভোগী বা বুকিং কমিশন ছাড়াই সরাসরি হাজারো যাচাইকৃত ক্রেতা ও ভাড়াগ্রহীতার কাছে পৌঁছে আপনার মুনাফা সর্বোচ্চ করুন।
              </p>

              {/* 4 Key Benefit Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-black transition-colors space-y-1.5">
                  <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center mb-2">
                    <BadgePercent className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-sm text-black">০% কমিশন — ১০০% লাভ আপনার</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    গাড়ি বিক্রি বা দৈনিক ভাড়ার সম্পূর্ণ টাকা সরাসরি আপনার কাছে যাবে। কোনো লুকানো চার্জ বা বুকিং কমিশন নেই।
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-black transition-colors space-y-1.5">
                  <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-sm text-black">ভেরিফাইড ডিলারশিপ ব্র্যান্ডিং</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    আপনার প্রতিষ্ঠানের নামে আলাদা প্রোফাইল ও ভেরিফাইড ব্যাজ ক্রেতাদের আস্থা এবং বিক্রির সম্ভাবনা বহুগুণ বাড়িয়ে দেয়।
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-black transition-colors space-y-1.5">
                  <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-sm text-black">সরাসরি কল ও হোয়াটসঅ্যাপ লিড</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    আগ্রহী ক্রেতা ও ভাড়াটেরা কোনো অপেক্ষা ছাড়াই সরাসরি আপনার ফোনে বা হোয়াটসঅ্যাপে যোগাযোগ করে দ্রুত ডিল সম্পন্ন করতে পারবে।
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-black transition-colors space-y-1.5">
                  <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center mb-2">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-sm text-black">স্মার্ট ইনভেন্টরি ও আয় ট্র্যাকিং</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    এক ড্যাশবোর্ড থেকেই আপনার সব গাড়ির বিজ্ঞাপন, ভাড়ার শিডিউল, প্রাপ্যতা স্ট্যাটাস এবং মোট আয়ের হিসাব সহজে পরিচালনা করুন।
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link href="/provider/profile">
                  <Button variant="dark" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    বিজনেস প্রোফাইল খুলুন
                  </Button>
                </Link>
                <Link href="#pricing-plans">
                  <Button variant="outline" size="md">
                    প্ল্যান ও প্যাকেজ দেখুন
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MEMBERSHIP & PRICING PLANS SECTION (1 YEAR FREE, 3 YEARS, 5 YEARS) */}
      <PricingPlans />
    </div>
  );
}
