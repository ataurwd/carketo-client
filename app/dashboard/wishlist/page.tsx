'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { wishlistService } from '@/services/wishlist.service';
import { ICar } from '@/types/car.types';
import { CarCard } from '@/components/common/CarCard';
import { CarCardSkeleton } from '@/components/common/CarCardSkeleton';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Heart, Search } from 'lucide-react';

export default function WishlistPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    wishlistService
      .getWishlist()
      .then((res) => {
        setCars(res || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ড্যাশবোর্ডে ফিরে যান</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-black">পছন্দের তালিকা</h1>
            <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
              {cars.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            তাৎক্ষণিক ভাড়া বা ক্রয়ের জন্য আপনার সংরক্ষিত পছন্দের গাড়িগুলো।
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 p-8 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-black">আপনার পছন্দের তালিকা খালি</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              আপনার পছন্দের গাড়িগুলো সংরক্ষণ করে রাখুন যাতে যেকোনো সময় দ্রুত বুক বা ক্রয় করতে পারেন।
            </p>
            <Link href="/cars">
              <Button variant="dark" size="sm">
                উপলব্ধ গাড়িগুলো দেখুন
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
