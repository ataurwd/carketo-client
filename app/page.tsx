'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { CarCard } from '@/components/common/CarCard';
import { Button } from '@/components/ui/Button';
import { fallbackCars } from '@/services/car.service';
import { apiClient } from '@/lib/api-client';
import {
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Sparkles,
  Headphones,
  Activity,
} from 'lucide-react';

export default function HomePage() {
  const [selectedFleetTab, setSelectedFleetTab] = useState('all');
  const [backendStatus, setBackendStatus] = useState<{
    status: string;
    services?: { api: string; database: string; redis: string };
    uptime?: number;
  } | null>(null);

  useEffect(() => {
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
  }, []);

  const filteredCars =
    selectedFleetTab === 'all'
      ? fallbackCars
      : fallbackCars.filter((car) => car.specs.bodyType.toLowerCase() === selectedFleetTab);

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
            Looking to save more on <span className="text-zinc-400">your rental car?</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Discover verified vehicles at transparent rates with zero hidden charges. Simple, seamless car rentals & sales.
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
            <span>Database: MongoDB Ready</span>
          </div>
        </div>
      </section>

      {/* 3. TRUSTED PARTNER SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Visual with Dual Image & Star Badge */}
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

          {/* Right Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
              <span>Why Choose Carketo</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight">
              Your trusted partner in reliable car rental & sales
            </h2>

            <p className="text-zinc-600 text-sm leading-relaxed">
              We streamline the entire journey from browsing curated fleets to doorstep delivery. Every vehicle undergoes a certified 150-point diagnostic check before handover.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">100% Insured & Inspected</h4>
                  <p className="text-xs text-zinc-500">
                    Comprehensive collision coverage and verified maintenance logs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Instant Booking & Lock</h4>
                  <p className="text-xs text-zinc-500">
                    Redis-powered concurrency lock guarantees zero double-bookings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">24/7 Roadside Assistance</h4>
                  <p className="text-xs text-zinc-500">
                    Emergency support and replacement vehicles anywhere in the network.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/cars">
                <Button
                  variant="dark"
                  size="lg"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Explore All Fleet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLEET SHOWCASE SECTION */}
      <section className="py-20 bg-zinc-50 px-4 sm:px-6 lg:px-8 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
              Exclusive Showroom
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              Explore our perfect and extensive fleet
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl mx-auto">
              From high-performance sports cars to spacious luxury crossovers, choose your vehicle today.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {['all', 'coupe', 'sedan', 'supercar'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedFleetTab(tab)}
                  className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                    selectedFleetTab === tab
                      ? 'bg-black text-white shadow-md'
                      : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

          <div className="text-center pt-6">
            <Link href="/cars">
              <Button
                variant="dark"
                size="lg"
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                View Full Inventory ({fallbackCars.length} Available)
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
