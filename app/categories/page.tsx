import React from 'react';
import Link from 'next/link';
import { BODY_TYPES } from '@/lib/constants';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function CategoriesPage() {
  const categoryDetails: Record<string, { desc: string; img: string }> = {
    Coupe: {
      desc: 'Sleek aerodynamic profiles, athletic two-door styling, and aggressive power.',
      img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
    },
    Sedan: {
      desc: 'Opulent executive sedans combining limousine luxury with high-speed comfort.',
      img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
    },
    SUV: {
      desc: 'All-terrain capability, commanding road presence, and generous passenger room.',
      img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    },
    Supercar: {
      desc: 'Uncompromising aerodynamic downforce, lightning acceleration, and exotic thrill.',
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    },
    Convertible: {
      desc: 'Open-top motoring designed for scenic coastal drives and warm summer cruising.',
      img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
    },
    Hatchback: {
      desc: 'Agile hot hatches offering urban versatility and punchy turbo performance.',
      img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    },
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vehicle Classes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black">
            Browse by Body Category
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Find the perfect vehicle tailored to your travel style, party size, and performance preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BODY_TYPES.map((type) => {
            const detail = categoryDetails[type] || {
              desc: 'Premium vehicles ready for immediate reservation.',
              img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
            };

            return (
              <Link
                key={type}
                href={`/cars?bodyType=${encodeURIComponent(type)}`}
                className="group bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden hover:border-black hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                  <img
                    src={detail.img}
                    alt={type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 text-white text-xs font-bold backdrop-blur-sm">
                    {type}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black text-black group-hover:text-zinc-600 transition-colors">
                    {type} Collection
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{detail.desc}</p>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-black group-hover:text-zinc-600 border-t border-zinc-100">
                  <span>Explore {type}s</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
