import React from 'react';
import { ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export function BuyHero() {
  return (
    <div className="bg-black text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl">
      <div className="max-w-2xl space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300">
          <ShoppingBag className="w-3.5 h-3.5 text-white" />
          <span>সার্টিফায়েড শোরুম</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          বাংলাদেশে যাচাইকৃত গাড়ি কিনুন
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          সরাসরি মালিকের যোগাযোগের তথ্যসহ ১০০% যাচাইকৃত গাড়ি খুঁজুন। কোনো মধ্যস্বত্বভোগী কমিশন ছাড়াই মডেল, তৈরির সাল, কন্ডিশন, জ্বালানির ধরন এবং দামের সীমা অনুযায়ী ফিল্টার করুন।
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 max-w-lg relative z-10 text-xs">
        <div className="flex items-center gap-2 text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-white shrink-0" />
          <span>সরাসরি মালিকের যোগাযোগ</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <Truck className="w-4 h-4 text-white shrink-0" />
          <span>কোনো ব্রোকার ফি নেই</span>
        </div>
      </div>
    </div>
  );
}
