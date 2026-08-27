'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SearchFilterBar: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rent' | 'sale'>('rent');
  const [pickupLocation, setPickupLocation] = useState('New York, JFK');
  const [returnLocation, setReturnLocation] = useState('New York, Downtown');
  const [pickupDate, setPickupDate] = useState('2026-09-01');
  const [returnDate, setReturnDate] = useState('2026-09-05');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/cars?type=${activeTab}&location=${encodeURIComponent(
        pickupLocation
      )}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Type Toggle Tabs */}
      <div className="inline-flex rounded-t-2xl bg-white/10 p-1 backdrop-blur-md border-t border-x border-white/20">
        <button
          type="button"
          onClick={() => setActiveTab('rent')}
          className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'rent'
              ? 'bg-brand text-white shadow-glow'
              : 'text-white/80 hover:text-white'
          }`}
        >
          Rent A Car
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sale')}
          className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'sale'
              ? 'bg-brand text-white shadow-glow'
              : 'text-white/80 hover:text-white'
          }`}
        >
          Buy A Car
        </button>
      </div>

      {/* Main Search Panel */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl sm:rounded-b-2xl sm:rounded-tr-2xl shadow-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center border border-slate-100"
      >
        {/* Pickup Location */}
        <div className="space-y-1 sm:border-r border-slate-100 pr-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pick-Up Location
          </label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand shrink-0" />
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="City, Airport or Address"
              className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Return Location */}
        <div className="space-y-1 sm:border-r border-slate-100 pr-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Return Location
          </label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand shrink-0" />
            <input
              type="text"
              value={returnLocation}
              onChange={(e) => setReturnLocation(e.target.value)}
              placeholder="City, Airport or Address"
              className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Pickup Date */}
        <div className="space-y-1 sm:border-r border-slate-100 pr-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pick-Up Date
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand shrink-0" />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="space-y-1 pr-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Return Date
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand shrink-0" />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Search Submit */}
        <div className="pt-2 sm:pt-0">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-12 text-sm font-bold shadow-glow"
            rightIcon={<Search className="w-4 h-4" />}
          >
            Search Car
          </Button>
        </div>
      </form>
    </div>
  );
};
