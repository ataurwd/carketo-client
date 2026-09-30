import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ActiveFilterChipsProps {
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
  onResetAll: () => void;
}

export function ActiveFilterChips({
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
  onResetAll,
}: ActiveFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-100 text-xs animate-fade-in">
      <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-wider">
        সক্রিয় ফিল্টার:
      </span>

      {search.trim() && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white font-bold text-[11px] shadow-sm">
          অনুসন্ধান: "{search}"
          <button onClick={() => setSearch('')}>
            <X className="w-3 h-3 text-zinc-300 hover:text-white" />
          </button>
        </span>
      )}

      {selectedBrand !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          ব্র্যান্ড: {selectedBrand}
          <button onClick={() => setSelectedBrand('all')}>
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      {selectedModel.trim() && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          মডেল: {selectedModel}
          <button onClick={() => setSelectedModel('')}>
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      {selectedCondition !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          কন্ডিশন: {selectedCondition.toUpperCase()}
          <button onClick={() => setSelectedCondition('all')}>
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      {(minYear || maxYear) && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          সাল: {minYear || 'যেকোনো'} - {maxYear || 'বর্তমান'}
          <button
            onClick={() => {
              setMinYear('');
              setMaxYear('');
            }}
          >
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      {selectedFuel !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          জ্বালানি: {selectedFuel}
          <button onClick={() => setSelectedFuel('all')}>
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      {(minPrice || maxPrice) && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          মূল্য: {minPrice ? formatPrice(Number(minPrice)) : '৳০'} -{' '}
          {maxPrice ? formatPrice(Number(maxPrice)) : 'যেকোনো'}
          <button
            onClick={() => {
              setMinPrice('');
              setMaxPrice('');
            }}
          >
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      {selectedTransmission !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          ট্রান্সমিশন: {selectedTransmission}
          <button onClick={() => setSelectedTransmission('all')}>
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      {selectedBodyType !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          বডি: {selectedBodyType}
          <button onClick={() => setSelectedBodyType('all')}>
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      {selectedLocation !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          শহর: {selectedLocation}
          <button onClick={() => setSelectedLocation('all')}>
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      {maxMileage && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-bold text-[11px] border border-zinc-200">
          সর্বোচ্চ মাইলেজ: {Number(maxMileage).toLocaleString()} কি.মি.
          <button onClick={() => setMaxMileage('')}>
            <X className="w-3 h-3 text-zinc-500 hover:text-black" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={onResetAll}
        className="text-[11px] font-bold text-rose-600 hover:underline ml-auto flex items-center gap-1"
      >
        <RotateCcw className="w-3 h-3" />
        সব ফিল্টার মুছুন
      </button>
    </div>
  );
}
