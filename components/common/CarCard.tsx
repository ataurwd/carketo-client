'use client';

import React from 'react';
import Link from 'next/link';
import { ICar } from '@/types/car.types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Users, Fuel, Gauge, ArrowUpRight } from 'lucide-react';

export interface CarCardProps {
  car: ICar;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const displayPrice =
    car.listingType === 'rent'
      ? `${formatPrice(car.rentalPrice || 199)} / day`
      : formatPrice(car.salePrice || car.price || 45000);

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-card hover:shadow-card-hover hover:border-slate-200 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Header & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant={car.listingType === 'rent' ? 'brand' : 'dark'}
            size="sm"
            className="uppercase tracking-wider"
          >
            For {car.listingType === 'rent' ? 'Rent' : 'Sale'}
          </Badge>
          <span className="text-xs font-semibold text-slate-400">
            {car.year} • {car.brand}
          </span>
        </div>

        {/* Car Image with subtle zoom on hover */}
        <Link href={`/cars/${car.slug}`} className="block relative overflow-hidden rounded-xl bg-slate-50 aspect-[16/10] mb-4">
          <img
            src={car.coverImage || '/placeholder-car.jpg'}
            alt={car.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Title */}
        <Link href={`/cars/${car.slug}`}>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1 mb-1">
            {car.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mb-4">{car.location}</p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] text-slate-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{car.specs.passengers} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span>{car.specs.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-slate-400" />
            <span>{car.specs.fuelType}</span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Action Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400">
            {car.listingType === 'rent' ? 'Daily Rate' : 'Total Price'}
          </span>
          <span className="text-base font-extrabold text-slate-900">
            {displayPrice}
          </span>
        </div>

        <Link
          href={`/cars/${car.slug}`}
          className="h-9 w-9 rounded-full bg-brand text-white flex items-center justify-center shadow-glow hover:bg-brand-600 group-hover:scale-105 transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
