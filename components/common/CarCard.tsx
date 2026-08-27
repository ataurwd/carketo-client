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
    <div className="group rounded-3xl border border-zinc-200 bg-white p-4 shadow-card hover:shadow-card-hover hover:border-black transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Header & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant={car.listingType === 'rent' ? 'dark' : 'slate'}
            size="sm"
            className="uppercase tracking-wider font-bold"
          >
            For {car.listingType === 'rent' ? 'Rent' : 'Sale'}
          </Badge>
          <span className="text-xs font-bold text-zinc-400">
            {car.year} • {car.brand}
          </span>
        </div>

        {/* Car Image with subtle zoom on hover */}
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
        </Link>

        {/* Title */}
        <Link href={`/cars/${car.slug}`}>
          <h3 className="text-base font-extrabold text-black group-hover:text-zinc-600 transition-colors line-clamp-1 mb-1">
            {car.title}
          </h3>
        </Link>
        <p className="text-xs font-medium text-zinc-500 mb-4">{car.location}</p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-100 text-[11px] font-semibold text-zinc-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>{car.specs.passengers} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-zinc-400" />
            <span>{car.specs.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-zinc-400" />
            <span>{car.specs.fuelType}</span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Action Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="block text-[10px] uppercase font-bold text-zinc-400">
            {car.listingType === 'rent' ? 'Daily Rate' : 'Total Price'}
          </span>
          <span className="text-lg font-black text-black">
            {displayPrice}
          </span>
        </div>

        <Link
          href={`/cars/${car.slug}`}
          className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800 group-hover:scale-105 transition-all shadow-md"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
