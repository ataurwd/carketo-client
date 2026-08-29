'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ICar } from '@/types/car.types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import {
  Users,
  Fuel,
  Gauge,
  ArrowUpRight,
  Phone,
  Check,
  Lock,
  Copy,
  LogIn,
  X,
} from 'lucide-react';

export interface CarCardProps {
  car: ICar;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isRental = car.listingType === 'rent';
  const rawPhone = car.contactPhone || car.provider?.phone || '01712-345678';

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setRevealed(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawPhone);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const displayPrice = isRental
    ? `${formatPrice(car.rentalPrice || 199)} / day`
    : formatPrice(car.salePrice || car.price || 45000);

  return (
    <>
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

          {/* Car Image: If sale, links to /cars/[slug]. If rental, no single page */}
          {isRental ? (
            <div className="relative overflow-hidden rounded-2xl bg-zinc-100 aspect-[16/10] mb-4 border border-zinc-100">
              <img
                src={car.coverImage || '/placeholder-car.jpg'}
                alt={car.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Direct Contact
                </span>
              </div>
            </div>
          ) : (
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
          )}

          {/* Title */}
          {isRental ? (
            <h3 className="text-base font-extrabold text-black line-clamp-1 mb-1">
              {car.title}
            </h3>
          ) : (
            <Link href={`/cars/${car.slug}`}>
              <h3 className="text-base font-extrabold text-black group-hover:text-zinc-600 transition-colors line-clamp-1 mb-1">
                {car.title}
              </h3>
            </Link>
          )}
          <p className="text-xs font-medium text-zinc-500 mb-3">{car.location}</p>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-zinc-100 text-[11px] font-semibold text-zinc-600 mb-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              <span>{car.specs?.passengers || car.seats || 4} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-zinc-400" />
              <span>{car.specs?.transmission || car.transmission || 'Automatic'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-zinc-400" />
              <span>{car.specs?.fuelType || car.fuelType || 'Petrol'}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400">
                {isRental ? 'Daily Rate' : 'Purchase Price'}
              </span>
              <span className="text-lg font-black text-black">{displayPrice}</span>
            </div>

            {!isRental && (
              <Link
                href={`/cars/${car.slug}`}
                className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800 group-hover:scale-105 transition-all shadow-md"
                title="View Full Vehicle Details & Checkout"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Rental Direct Contact Number Widget */}
          {isRental && (
            <button
              type="button"
              onClick={handlePhoneClick}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all border text-xs font-bold ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                  : revealed
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-zinc-900 text-white hover:bg-black border-zinc-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-300" />
                <span className="tracking-wide">
                  {revealed ? rawPhone : '017 ••••••••'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-white/15">
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>Copied!</span>
                  </>
                ) : revealed ? (
                  <>
                    <Copy className="w-3 h-3 text-white" />
                    <span>Copy</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-zinc-300" />
                    <span>Show Number</span>
                  </>
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Login Required Modal for Number Reveal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl border border-zinc-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-black hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-14 w-14 mx-auto rounded-2xl bg-black text-white flex items-center justify-center shadow-glow">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-black">Sign in to View Phone Number</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Please log in to your Carketo account to reveal and directly copy the vehicle owner&apos;s contact number.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname || '/')}`}
                onClick={() => setShowLoginModal(false)}
                className="block"
              >
                <Button variant="dark" size="md" className="w-full" rightIcon={<LogIn className="w-4 h-4" />}>
                  Sign In Now
                </Button>
              </Link>
              <Link
                href={`/register?redirect=${encodeURIComponent(pathname || '/')}`}
                onClick={() => setShowLoginModal(false)}
                className="block"
              >
                <Button variant="outline" size="md" className="w-full">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
