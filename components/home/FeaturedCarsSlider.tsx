'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ICar } from '@/types/car.types';
import { FeaturedCarCard } from '@/components/common/FeaturedCarCard';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface FeaturedCarsSliderProps {
  cars: ICar[];
}

export function FeaturedCarsSlider({ cars }: FeaturedCarsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const featuredCars = cars.filter((c) => c.isFeatured);

  if (featuredCars.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-zinc-950 text-white relative overflow-hidden border-t border-zinc-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Slider Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Exclusive Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Featured Vehicles</span>
              <Flame className="w-7 h-7 text-amber-500 hidden sm:inline" />
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl">
              Handpicked premium vehicles with verified titles, luxury amenities, and top-tier owner ratings.
            </p>
          </div>

          {/* Navigation Controls & View All */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/cars"
              className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 mr-2"
            >
              <span>View All Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-400 text-zinc-300 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-400 text-zinc-300 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-2 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredCars.map((car) => (
            <FeaturedCarCard key={`featured-${car._id || car.slug}`} car={car} />
          ))}
        </div>

      </div>
    </section>
  );
}
