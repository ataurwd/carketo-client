'use client';

import React from 'react';
import Link from 'next/link';
import { ICar } from '@/types/car.types';
import { formatPrice } from '@/lib/utils';
import {
  Users,
  Fuel,
  Gauge,
  MapPin,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

export interface FeaturedCarCardProps {
  car: ICar;
}

export const FeaturedCarCard: React.FC<FeaturedCarCardProps> = ({ car }) => {
  const isRental = car.listingType === 'rent';

  const displayPrice = isRental
    ? `${formatPrice(car.rentalPrice || car.price || 5000)} / day`
    : formatPrice(car.salePrice || car.price || 4500000);

  return (
    <div className="group relative w-[320px] sm:w-[380px] shrink-0 snap-start rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 text-white border border-zinc-800/90 shadow-2xl hover:border-amber-500/60 hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-between overflow-hidden">
      
      {/* Subtle luxury ambient glow behind card on hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none" />

      <div>
        {/* Top Floating Badge Bar */}
        <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black text-[10px] font-black uppercase tracking-wider shadow-md shadow-amber-500/20">
            <Sparkles className="w-3 h-3 fill-black text-black" />
            <span>VIP Featured</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/90 backdrop-blur-md border border-zinc-700 text-zinc-300 text-[10px] font-extrabold uppercase tracking-wider">
            <span>{isRental ? 'For Rent' : 'For Sale'}</span>
          </div>
        </div>

        {/* Car Image with Cinematic Frame */}
        <Link
          href={`/cars/${car.slug}`}
          className="block relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[16/10] mb-4 border border-zinc-800/80 group-hover:border-zinc-700 transition-colors"
        >
          <img
            src={car.coverImage || '/placeholder-car.jpg'}
            alt={car.title || `${car.brand} ${car.model}`}
            className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Condition Badge (Top Left) */}
          {car.condition && car.condition !== 'used' && (
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider shadow-sm">
                {car.condition === 'new' ? 'Brand New' : 'Certified'}
              </span>
            </div>
          )}

          {/* Rating Badge (Top Right) */}
          <div className="absolute top-2.5 right-2.5">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur text-amber-400 text-[10px] font-bold border border-zinc-800">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{car.rating || 5.0}</span>
            </span>
          </div>

          {/* Year & Brand (Bottom Left on image) */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white font-bold">
            <span className="bg-black/70 backdrop-blur px-2.5 py-0.5 rounded-lg border border-zinc-700/50 text-[11px]">
              {car.brand} {car.model}
            </span>
            <span className="bg-amber-400 text-black px-2.5 py-0.5 rounded-lg font-black text-[11px]">
              {car.year}
            </span>
          </div>
        </Link>

        {/* Title & Location */}
        <div className="mb-3 space-y-1">
          <Link href={`/cars/${car.slug}`}>
            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {car.title}
            </h3>
          </Link>
          <p className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{car.location || 'Dhaka, Bangladesh'}</span>
          </p>
        </div>

        {/* Specs Pill Grid (Unique dark glassy look) */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800/80 mb-4 text-[11px] font-semibold text-zinc-300">
          <div className="bg-zinc-800/50 rounded-xl p-2 flex items-center justify-center gap-1.5 border border-zinc-800">
            <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{car.specs?.passengers || car.seats || 4} Seats</span>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-2 flex items-center justify-center gap-1.5 border border-zinc-800">
            <Gauge className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{car.specs?.transmission || car.transmission || 'Automatic'}</span>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-2 flex items-center justify-center gap-1.5 border border-zinc-800">
            <Fuel className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{car.specs?.fuelType || car.fuelType || 'Petrol'}</span>
          </div>
        </div>
      </div>

      {/* Footer: Price & Direct View CTA */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {isRental ? 'Daily Rate' : 'Purchase Price'}
          </span>
          <span className="text-lg sm:text-xl font-black text-white tracking-tight">
            {displayPrice}
          </span>
        </div>

        <Link
          href={`/cars/${car.slug}`}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-400 text-black hover:text-black font-extrabold text-xs transition-all shadow-md flex items-center gap-1 shrink-0 active:scale-95 group-hover:shadow-amber-500/20"
        >
          <span>Explore</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
