import React from 'react';
import Link from 'next/link';
import { BODY_TYPES } from '@/lib/constants';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function CategoriesPage() {
  const categoryDetails: Record<string, { desc: string; img: string }> = {
    Coupe: {
      desc: 'আকর্ষণীয় অ্যারোডাইনামিক প্রোফাইল, স্পোর্টি ডিজাইন এবং দুর্দান্ত গতি।',
      img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
    },
    Sedan: {
      desc: 'বিলাসবহুল এক্সিকিউটিভ সেডান যা আরামদায়ক এবং নির্ভরযোগ্য যাত্রার নিশ্চয়তা দেয়।',
      img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
    },
    SUV: {
      desc: 'সব ধরনের রাস্তায় চলার সক্ষমতা, প্রশস্ত কেবিন এবং পরিবারের জন্য আদর্শ।',
      img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    },
    Supercar: {
      desc: 'অতুলনীয় গতি, অ্যারোডাইনামিক ডিজাইন এবং রোমাঞ্চকর ড্রাইভিং অভিজ্ঞতা।',
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    },
    Convertible: {
      desc: 'খোলা ছাদের প্রিমিয়াম গাড়ি যা মনোরম ভ্রমণের জন্য বিশেষভাবে তৈরি।',
      img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
    },
    Hatchback: {
      desc: 'শহরের রাস্তায় সহজে চলাচল এবং সাশ্রয়ী জ্বালানির জন্য সেরা পছন্দ।',
      img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    },
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>গাড়ির শ্রেণিবিভাগ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black">
            বডি ক্যাটাগরি অনুযায়ী খুঁজুন
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            আপনার ভ্রমণের ধরন, যাত্রী সংখ্যা এবং পছন্দ অনুযায়ী সেরা গাড়িটি বেছে নিন।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BODY_TYPES.map((type) => {
            const detail = categoryDetails[type] || {
              desc: 'তাৎক্ষণিক বুকিং এবং ক্রয়ের জন্য প্রস্তুত প্রিমিয়াম গাড়ি।',
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
                    {type} কালেকশন
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{detail.desc}</p>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-black group-hover:text-zinc-600 border-t border-zinc-100">
                  <span>{type} গাড়ি দেখুন</span>
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
