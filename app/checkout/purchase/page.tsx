'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, CheckCircle2, ShieldCheck, Building2, ShoppingBag } from 'lucide-react';

export default function PurchaseCheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>শোরুমে ফিরে যান</span>
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            সার্টিফায়েড ক্রয়
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black">গাড়ি ক্রয়ের অর্ডার</h1>
        </div>

        {isSuccess ? (
          <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-black">ক্রয়ের অর্ডার পাঠানো হয়েছে!</h2>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              ভেরিফায়েড ডিলারশিপ আপনার অর্ডার এবং মালিকানা হস্তান্তরের তথ্য পেয়েছে। ডেলিভারির সময় নির্ধারণের জন্য আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-black border-b border-zinc-100 pb-3">
                ক্রেতা ও নিবন্ধনের বিবরণ
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="পূর্ণ আইনি নাম (নিবন্ধনের জন্য)" required placeholder="আপনার পূর্ণ নাম" />
                <Input label="ইমেইল ঠিকানা" type="email" required placeholder="you@example.com" />
                <Input label="ফোন নম্বর" required placeholder="017XX-XXXXXX" />
                <Input label="ডেলিভারির ঠিকানা" required placeholder="বাড়ি নং, রোড নং, এলাকা" />

                <div className="grid grid-cols-2 gap-4">
                  <Input label="শহর" required placeholder="ঢাকা" />
                  <Input label="পোস্ট কোড" required placeholder="1212" />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="dark"
                    size="lg"
                    isLoading={isProcessing}
                    className="w-full font-bold shadow-md hover:bg-black"
                  >
                    ক্রয় নিশ্চিত করুন ও মালিকানা হস্তান্তর শুরু করুন
                  </Button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-black border-b border-zinc-100 pb-3">
                অর্ডারের সারসংক্ষেপ
              </h3>

              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=400&q=80"
                  alt="Porsche 911"
                  className="w-20 h-14 object-cover rounded-xl border border-zinc-200"
                />
                <div>
                  <h4 className="text-sm font-black text-black">Porsche 911 Carrera 4S</h4>
                  <p className="text-xs text-zinc-400">২০২৪ • সার্টিফায়েড প্রি-ওনড</p>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-zinc-100 pt-4 text-zinc-600">
                <div className="flex justify-between">
                  <span>গাড়ির ক্রয়মূল্য</span>
                  <span className="font-bold text-black">{formatPrice(142000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ট্যাক্স ও ডকুমেন্টেশন</span>
                  <span className="font-bold text-black">{formatPrice(9940)}</span>
                </div>
                <div className="flex justify-between">
                  <span>হোম ডেলিভারি চার্জ</span>
                  <span className="font-bold text-black">{formatPrice(499)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-black border-t border-zinc-200 pt-3">
                  <span>সর্বমোট মূল্য</span>
                  <span>{formatPrice(152439)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
