import React from 'react';
import { DollarSign, Car } from 'lucide-react';

interface ListingTypeSelectorProps {
  listingType: 'sale' | 'rent';
  onChange: (type: 'sale' | 'rent') => void;
}

export function ListingTypeSelector({ listingType, onChange }: ListingTypeSelectorProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
        <DollarSign className="w-5 h-5 text-black" />
        <div>
          <h2 className="text-base font-black text-black">Listing Type</h2>
          <p className="text-xs text-zinc-400">
            Choose whether you are posting a vehicle for outright sale or adding to the rental fleet.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* For Sale Option */}
        <button
          type="button"
          onClick={() => onChange('sale')}
          className={`p-5 rounded-2xl text-left transition-all flex items-start gap-4 border ${
            listingType === 'sale'
              ? 'bg-black text-white border-black shadow-lg ring-2 ring-black/10 scale-[1.01]'
              : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200 text-zinc-800'
          }`}
        >
          <div
            className={`p-3 rounded-xl shrink-0 ${
              listingType === 'sale'
                ? 'bg-white/15 text-white'
                : 'bg-white text-zinc-900 border border-zinc-200 shadow-sm'
            }`}
          >
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-black flex items-center gap-2">
              <span>For Sale</span>
              {listingType === 'sale' && (
                <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              )}
            </div>
            <p
              className={`text-[11px] leading-relaxed mt-1 ${
                listingType === 'sale' ? 'text-zinc-300' : 'text-zinc-500'
              }`}
            >
              Dealership inventory or private sale with condition, mileage, registration & VIN.
            </p>
          </div>
        </button>

        {/* For Rent Option */}
        <button
          type="button"
          onClick={() => onChange('rent')}
          className={`p-5 rounded-2xl text-left transition-all flex items-start gap-4 border ${
            listingType === 'rent'
              ? 'bg-black text-white border-black shadow-lg ring-2 ring-black/10 scale-[1.01]'
              : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200 text-zinc-800'
          }`}
        >
          <div
            className={`p-3 rounded-xl shrink-0 ${
              listingType === 'rent'
                ? 'bg-white/15 text-white'
                : 'bg-white text-zinc-900 border border-zinc-200 shadow-sm'
            }`}
          >
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-black flex items-center gap-2">
              <span>For Rent</span>
              {listingType === 'rent' && (
                <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              )}
            </div>
            <p
              className={`text-[11px] leading-relaxed mt-1 ${
                listingType === 'rent' ? 'text-zinc-300' : 'text-zinc-500'
              }`}
            >
              Rental fleet listing with daily pricing, direct renter contact & pickup hub.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
