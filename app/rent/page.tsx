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
import { POPULAR_BRANDS, BODY_TYPES, TRANSMISSION_TYPES } from '@/lib/constants';
import { Search, KeyRound, CalendarCheck, ShieldCheck, Plus } from 'lucide-react';

function RentCarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams?.get('page')) || 1;
  const initialSearch = searchParams?.get('q') || '';
  const initialBrand = searchParams?.get('brand') || 'All';
  const initialBodyType = searchParams?.get('bodyType') || 'All';
  const initialTransmission = searchParams?.get('transmission') || 'All';
  const initialMaxPrice = Number(searchParams?.get('maxPrice')) || 2000;

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
  const [priceRange, setPriceRange] = useState<number>(initialMaxPrice);

  // Fetch paginated rental cars from backend
  const fetchRentalCars = useCallback(async () => {
    setIsLoading(true);
    const queryParams: Record<string, any> = {
      listingType: 'rent',
      page,
      limit: 12,
    };
    if (selectedBrand !== 'All') queryParams.brand = selectedBrand;
    if (selectedBodyType !== 'All') queryParams.bodyType = selectedBodyType;
    if (selectedTransmission !== 'All') queryParams.transmission = selectedTransmission;
    if (priceRange < 2000) queryParams.maxPrice = priceRange;
    if (search.trim()) queryParams.search = search.trim();

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
  }, [page, selectedBrand, selectedBodyType, selectedTransmission, priceRange, search]);

  useEffect(() => {
    fetchRentalCars();
  }, [fetchRentalCars]);

  // Synchronize URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (selectedBrand !== 'All') params.set('brand', selectedBrand);
    if (selectedBodyType !== 'All') params.set('bodyType', selectedBodyType);
    if (selectedTransmission !== 'All') params.set('transmission', selectedTransmission);
    if (priceRange < 2000) params.set('maxPrice', String(priceRange));
    if (search.trim()) params.set('q', search.trim());

    const queryStr = params.toString();
    router.replace(queryStr ? `/rent?${queryStr}` : '/rent', { scroll: false });
  }, [page, selectedBrand, selectedBodyType, selectedTransmission, priceRange, search, router]);

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Hero Header */}
        <div className="bg-black text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300">
              <KeyRound className="w-3.5 h-3.5 text-white" />
              <span>Direct Rental Fleet</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Rent Premium Vehicles
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Rent verified vehicles directly from owners. Click any car card to reveal masked phone numbers and connect via call or WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 max-w-lg relative z-10 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <CalendarCheck className="w-4 h-4 text-white shrink-0" />
              <span>Direct Owner Booking</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Zero Commissions</span>
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
                placeholder="Search by vehicle title, make, or model..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Selects */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setPage(1);
                }}
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
                onChange={(e) => {
                  setSelectedBodyType(e.target.value);
                  setPage(1);
                }}
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
                value={selectedTransmission}
                onChange={(e) => {
                  setSelectedTransmission(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black col-span-2 sm:col-span-1"
              >
                <option value="All">All Transmissions</option>
                {TRANSMISSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-bold text-zinc-700 whitespace-nowrap">
                Max Daily Rate: <span className="text-black font-black">${priceRange}/day</span>
              </span>
              <input
                type="range"
                min={50}
                max={2000}
                step={25}
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full sm:w-48 accent-black cursor-pointer"
              />
            </div>

            <span className="text-zinc-500 font-semibold self-start sm:self-auto">
              Showing <span className="font-bold text-black">{pagination.total}</span> rental vehicles
            </span>
          </div>
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

            {/* Pagination */}
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
            <KeyRound className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Rental Vehicles Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No rental cars match your search filters or none are listed in the database yet.
            </p>
            <Link href="/sell">
              <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                List Car for Rent
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RentCarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RentCarContent />
    </Suspense>
  );
}
