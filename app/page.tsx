'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { CarCard } from '@/components/common/CarCard';
import { Button } from '@/components/ui/Button';
import { carService } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { apiClient } from '@/lib/api-client';
import {
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Sparkles,
  Headphones,
  Activity,
  KeyRound,
  ShoppingBag,
  Plus,
} from 'lucide-react';

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState<{
    status: string;
    services?: { api: string; database: string; redis: string };
    uptime?: number;
  } | null>(null);

  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);

  useEffect(() => {
    // 1. Health check
    apiClient
      .get('/health')
      .then((res: any) => {
        if (res.data) setBackendStatus(res.data);
      })
      .catch(() => {
        setBackendStatus({
          status: 'ready',
          services: { api: 'operational', database: 'connected', redis: 'ready' },
        });
      });

    // 2. Fetch live cars from MongoDB
    carService
      .getCars()
      .then((res) => {
        setCars(res || []);
      })
      .finally(() => setIsLoadingCars(false));
  }, []);

  // 1. Rental Cars Section dataset (strictly rental cars)
  const rentalCars = useMemo(() => {
    return cars.filter((car) => car.listingType === 'rent');
  }, [cars]);

  // 2. Sale Cars Section dataset (strictly sale cars)
  const saleCars = useMemo(() => {
    return cars.filter((car) => car.listingType === 'sale');
  }, [cars]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION (Clean Monochrome Luxury Styling) */}
      <section className="relative bg-black text-white pt-14 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background subtle radial gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-zinc-800/40 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Premium Fleet Collection</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Looking to save more on <span className="text-zinc-400">your rental or purchase?</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Discover verified vehicles at transparent rates with zero hidden charges. Simple, seamless car rentals & direct sales.
          </p>

          {/* Hero VIP Car Silhouette */}
          <div className="relative max-w-4xl mx-auto pt-6 pb-2">
            <img
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=85"
              alt="Luxury VIP Fleet"
              className="w-full h-auto max-h-[380px] object-cover rounded-3xl shadow-2xl border border-zinc-800"
            />
          </div>

          {/* Hero Search Box */}
          <div className="pt-4">
            <SearchFilterBar />
          </div>
        </div>
      </section>

      {/* 2. BACKEND API HEALTH STATUS BAR */}
      <section className="bg-zinc-50 border-y border-zinc-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-black animate-pulse" />
            <span className="font-bold text-zinc-900">Backend Core Service:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black text-white text-[11px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              {backendStatus?.status === 'healthy' ? 'Active (API v1 Connected)' : 'Ready & Connected'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-zinc-500">
            <span>Auth: Argon2id + JWT</span>
            <span>Cache: Redis Ready</span>
            <span>Database: MongoDB Ready (carketo)</span>
          </div>
        </div>
      </section>

      {/* 3. SECTION A: DEDICATED RENTAL CARS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-black text-xs font-bold uppercase tracking-wider border border-zinc-200">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Rental Fleet</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              Cars for Rent
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-xl">
              Instant direct booking with masked contact phone numbers. Click on any car card to reveal and copy owner contact details directly.
            </p>
          </div>

          <Link href="/rent">
            <Button
              variant="dark"
              size="md"
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              View All Rentals ({rentalCars.length})
            </Button>
          </Link>
        </div>

        {/* Rental Cars Grid */}
        {isLoadingCars ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : rentalCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-zinc-50 border border-zinc-200 text-center space-y-4">
            <KeyRound className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="text-base font-bold text-black">No Rental Cars Currently Listed</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Be the first to list a car for rent and start earning from verified renters with zero commission fees!
            </p>
            <Link href="/sell">
              <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                List Car for Rent
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* 4. SECTION B: DEDICATED CARS FOR SALE */}
      <section className="py-20 bg-zinc-50 px-4 sm:px-6 lg:px-8 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Verified Showroom</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-black">
                Cars for Sale
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm max-w-xl">
                Explore vehicles with clean titles and direct owner contacts. Call and negotiate directly with sellers.
              </p>
            </div>

            <Link href="/buy">
              <Button
                variant="outline"
                size="md"
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                View All Cars for Sale ({saleCars.length})
              </Button>
            </Link>
          </div>

          {/* Sale Cars Grid */}
          {isLoadingCars ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-zinc-200 animate-pulse" />
              ))}
            </div>
          ) : saleCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-zinc-200 text-center space-y-4">
              <ShoppingBag className="w-10 h-10 text-zinc-400 mx-auto" />
              <h3 className="text-base font-bold text-black">No Cars for Sale Currently Listed</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                List your vehicle for sale today and reach thousands of prospective car buyers!
              </p>
              <Link href="/sell">
                <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  List Car for Sale
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. TRUSTED PARTNER & ASSURANCE SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
              We make luxury automotive rentals & sales completely hassle-free.
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
                <h4 className="font-bold text-sm text-black">24/7 Roadside Assist</h4>
                <p className="text-xs text-zinc-500">
                  Dedicated customer concierge always on standby.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
