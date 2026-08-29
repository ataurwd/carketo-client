'use client';

import React from 'react';
import Link from 'next/link';
import { ICar } from '@/types/car.types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Fuel,
  Gauge,
  ArrowUpRight,
  MapPin,
  Sparkles,
} from 'lucide-react';

export interface CarCardProps {
  car: ICar;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const isRental = car.listingType === 'rent';

  const displayPrice = isRental
    ? `${formatPrice(car.rentalPrice || 199)} / day`
    : formatPrice(car.salePrice || car.price || 45000);

  return (
    <div className="group rounded-3xl border border-zinc-200 bg-white p-4 shadow-card hover:shadow-card-hover hover:border-black transition-all duration-300 flex flex-col justify-between relative">
      <div>
        {/* Card Header & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant={isRental ? 'dark' : 'slate'}
            size="sm"
            className="uppercase tracking-wider font-bold"
          >
            For {isRental ? 'Rent' : 'Sale'}
          </Badge>
          <span className="text-xs font-bold text-zinc-400">
            {car.year} • {car.brand}
          </span>
        </div>

        {/* Car Image (Clickable for both Rent and Sale) */}
        <Link
          href={`/cars/${car.slug}`}
          className="block relative overflow-hidden rounded-2xl bg-zinc-100 aspect-[16/10] mb-4 border border-zinc-100"
        >
          <img
            src={car.coverImage || '/placeholder-car.jpg'}
            alt={car.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {car.condition && car.condition !== 'used' && (
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur text-white text-[10px] font-extrabold uppercase tracking-wider">
                {car.condition === 'new' ? 'Brand New' : 'Certified'}
              </span>
            </div>
          )}
        </Link>

        {/* Title & Location */}
        <Link href={`/cars/${car.slug}`}>
          <h3 className="text-base font-extrabold text-black group-hover:text-zinc-600 transition-colors line-clamp-1 mb-1">
            {car.title}
          </h3>
        </Link>
        <p className="text-xs font-medium text-zinc-500 mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
          <span className="truncate">{car.location}</span>
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-zinc-100 text-[11px] font-semibold text-zinc-600 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{car.specs?.passengers || car.seats || 4} Seats</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Gauge className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{car.specs?.transmission || car.transmission || 'Automatic'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Fuel className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{car.specs?.fuelType || car.fuelType || 'Petrol'}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions (Price + View Details link to single page) */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <span className="block text-[10px] uppercase font-bold text-zinc-400">
            {isRental ? 'Daily Rate' : 'Purchase Price'}
          </span>
          <span className="text-base sm:text-lg font-black text-black">{displayPrice}</span>
        </div>

        <Link
          href={`/cars/${car.slug}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-black text-white text-xs font-bold hover:bg-zinc-800 group-hover:scale-105 transition-all shadow-sm"
          title="View Details & Contact Seller"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
