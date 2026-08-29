import React from 'react';
import Link from 'next/link';
import { POPULAR_BRANDS } from '@/lib/constants';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function BrandsPage() {
  const brandDescriptions: Record<string, string> = {
    Porsche: 'Precision German engineering and motorsport pedigree.',
    BMW: 'The ultimate driving machines with innovative luxury.',
    'Mercedes-Benz': 'Opulent luxury, refined power, and cutting-edge tech.',
    Audi: 'Vorsprung durch Technik — advanced quattro all-wheel drive.',
    Lamborghini: 'Unapologetic Italian supercar design and V10/V12 fury.',
    Ferrari: 'Legendary prancing horse passion and track performance.',
    Tesla: 'Electrifying acceleration, minimalist cabins, and autopilot.',
    Dodge: 'Raw American muscle, supercharged power, and roaring HEMI V8s.',
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Marques</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black">
            Explore Verified Vehicle Makes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Browse our curated collections from the world’s most prestigious automotive manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/cars?brand=${encodeURIComponent(brand)}`}
              className="group bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:border-black hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center font-black text-black text-lg mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                  {brand.charAt(0)}
                </div>
                <h3 className="text-lg font-black text-black group-hover:text-zinc-600 transition-colors">
                  {brand}
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  {brandDescriptions[brand] || 'Explore certified luxury models available for rent or purchase.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 mt-4 border-t border-zinc-100 text-xs font-bold text-black group-hover:text-zinc-600">
                <span>View Inventory</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
