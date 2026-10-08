'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  Crown,
  ShieldCheck,
  Zap,
  ArrowRight,
  Gift,
  HelpCircle,
  Car,
  Star,
} from 'lucide-react';

export interface PlanFeature {
  text: string;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  durationBadge: string;
  durationLabel: string;
  price: string;
  periodText: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  featuredCount: string;
  features: PlanFeature[];
  ctaText: string;
  ctaHref: string;
  ctaVariant: 'white' | 'dark' | 'outline';
}

const PLANS: PricingPlan[] = [
  {
    id: 'starter-free',
    name: 'ফ্রি স্টার্টার',
    durationBadge: '১ বছর ফ্রি অ্যাক্সেস',
    durationLabel: '১ বছর মেয়াদ',
    price: '৳ ০',
    periodText: 'প্রথম ১ বছর সম্পূর্ণ বিনামূল্যে',
    description: 'নতুন অ্যাকাউন্ট রেজিস্টার করলেই প্রথম ১ বছর যেকোনো চার্জ ছাড়াই ব্যবহার করুন। ব্যক্তিগত বিক্রেতা ও শুরু করা উদ্যোক্তাদের জন্য আদর্শ।',
    featuredCount: '১টি ফিচার্ড কার লিস্টিং',
    ctaText: '১ বছর ফ্রি শুরু করুন',
    ctaHref: '/register?plan=starter',
    ctaVariant: 'outline',
    features: [
      { text: '১ বছর পর্যন্ত সম্পূর্ণ ফ্রি প্ল্যাটফর্ম ব্যবহার', highlight: true },
      { text: '৫টি সাধারণ গাড়ি লিস্টিং (বিক্রয় বা ভাড়া)' },
      { text: '১টি প্রিমিয়াম ফিচার্ড লিস্টিং (৭ দিন স্পটলাইট)', highlight: true },
      { text: 'স্ট্যান্ডার্ড বিক্রেতা ও ডিলার প্রোফাইল' },
      { text: 'সরাসরি ক্রেতা বা গ্রাহকের সাথে ফোন ও মেসেজ' },
      { text: 'স্ট্যান্ডার্ড সার্চ রেজাল্ট ভিজিবিলিটি' },
      { text: 'বেসিক ইনকোয়ারি ড্যাশবোর্ড' },
      { text: 'স্ট্যান্ডার্ড ইমেইল সাপোর্ট' },
    ],
  },
  {
    id: 'pro-growth',
    name: 'প্রো গ্রোথ',
    durationBadge: '৩ বছর ফুল অ্যাক্সেস',
    durationLabel: '৩ বছর মেয়াদ',
    price: '৳ ৩,৯৯৯',
    periodText: 'এককালীন ৩ বছরের জন্য',
    description: 'মাঝারি রেন্ট-এ-কার প্রতিষ্ঠান, সক্রিয় কার ডিলার এবং যাদের দ্রুত গাড়ি বিক্রি বা ভাড়া বাড়ানো প্রয়োজন তাদের জন্য সেরা পছন্দ।',
    badge: '🔥 সর্বাধিক জনপ্রিয়',
    isPopular: true,
    featuredCount: '৬টি ফিচার্ড কার লিস্টিং',
    ctaText: '৩ বছরের প্রো প্ল্যান নিন',
    ctaHref: '/register?plan=pro',
    ctaVariant: 'white',
    features: [
      { text: 'সম্পূর্ণ ৩ বছর নিরবচ্ছিন্ন ডিলার অ্যাক্সেস', highlight: true },
      { text: '২৫টি সক্রিয় গাড়ি লিস্টিং' },
      { text: '৬টি হাই-প্রিওরিটি ফিচার্ড লিস্টিং', highlight: true },
      { text: 'ভেরিফাইড প্রো ডিলার অফিসিয়াল ট্রাস্ট ব্যাজ', highlight: true },
      { text: 'সরাসরি ওয়ান-ট্যাপ হোয়াটসঅ্যাপ ও কল কানেক্ট' },
      { text: 'সার্চ রেজাল্ট ও ক্যাটাগরিতে প্রিওরিটি র‍্যাংকিং' },
      { text: 'উন্নত কাস্টমার লিড ও ভিউয়ার অ্যানালিটিক্স' },
      { text: 'এআই কার অ্যাসিস্ট্যান্ট স্মার্ট রেকমেন্ডেশন' },
      { text: 'প্রিওরিটি ফোন ও হোয়াটসঅ্যাপ সাপোর্ট' },
    ],
  },
  {
    id: 'vip-enterprise',
    name: 'ভিআইপি এন্টারপ্রাইজ',
    durationBadge: '৫ বছর মেগা ভ্যালু',
    durationLabel: '৫ বছর মেয়াদ',
    price: '৳ ৬,৯৯৯',
    periodText: 'এককালীন ৫ বছরের সেরা ডিল',
    description: 'প্রতিষ্ঠিত কার শোরুম, বড় রেন্ট-এ-কার ফ্লিট এবং অটোমোবাইল ব্যবসার জন্য সর্বোচ্চ সুবিধা সম্পন্ন দীর্ঘমেয়াদী এন্টারপ্রাইজ সল্যুশন।',
    badge: '💎 সেরা সাশ্রয়ী ভ্যালু',
    isPopular: false,
    featuredCount: '১৫টি ফিচার্ড কার লিস্টিং',
    ctaText: '৫ বছরের ভিআইপি প্ল্যান নিন',
    ctaHref: '/register?plan=vip',
    ctaVariant: 'dark',
    features: [
      { text: 'পুরো ৫ বছর আনলিমিটেড প্রিমিয়াম সুবিধা', highlight: true },
      { text: 'আনলিমিটেড (সীমাহীন) গাড়ি লিস্টিং', highlight: true },
      { text: '১৫টি ভিআইপি ফিচার্ড লিস্টিং (হোমপেজ টপ স্পট)', highlight: true },
      { text: 'এক্সক্লুসিভ ভেরিফাইড শোরুম ব্র্যান্ডিং পেজ' },
      { text: 'হোমপেজ স্পটলাইট ও টপ ব্যানার ফিচার' },
      { text: 'বাল্ক ইনভেন্টরি আপলোড ও স্মার্ট ম্যানেজমেন্ট' },
      { text: 'পূর্ণাঙ্গ সেলস ও রেন্টাল লিড ট্র্যাকিং CRM' },
      { text: 'অটো রিনিউয়াল ও কাস্টম ব্র্যান্ডিং ওয়াটারমার্ক' },
      { text: '২৪/৭ ডেডিকেটেড ভিআইপি অ্যাকাউন্ট ম্যানেজার', highlight: true },
    ],
  },
];

export const PricingPlans: React.FC = () => {
  return (
    <section id="pricing-plans" className="py-20 sm:py-24 bg-white border-t border-zinc-200 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-black text-xs font-bold tracking-wide shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>সদস্যপদ ও ডিলার প্যাকেজ</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
            আপনার গাড়ি ব্যবসা বাড়াতে <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-black via-zinc-800 to-zinc-900 bg-clip-text text-transparent">
              সেরা মেম্বারশিপ প্ল্যান বেছে নিন
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            নতুন একাউন্ট খুললেই পাচ্ছেন <strong className="text-black font-bold">প্রথম ১ বছর সম্পূর্ণ বিনামূল্যে</strong> ব্যবহারের সুযোগ! এছাড়াও আপনার প্রয়োজন অনুযায়ী ৩ বা ৫ বছরের প্রিমিয়াম প্ল্যানে পেয়ে যান বিশেষ ফিচার্ড লিস্টিং ও সর্বোচ্চ ভিজিবিলিটি।
          </p>

          {/* Quick highlight banner */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-xs font-bold text-zinc-700">
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
              <Gift className="w-3.5 h-3.5" /> ১ম বছর সবার জন্য ফ্রি
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-100 text-zinc-800 border border-zinc-200 px-3 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> কোনো প্ল্যাটফর্ম কমিশন নেই (০%)
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-100 text-zinc-800 border border-zinc-200 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> সরাসরি গ্রাহকের সাথে কথা বলুন
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 items-stretch pt-4">
          {PLANS.map((plan) => {
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                  isPopular
                    ? 'bg-zinc-950 text-white border-2 border-zinc-800 shadow-2xl md:-translate-y-3 ring-4 ring-orange-500/10'
                    : 'bg-white text-zinc-900 border border-zinc-200 shadow-sm hover:shadow-xl hover:border-zinc-400'
                } p-6 sm:p-8`}
              >
                {/* Popular / Best Value Top Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black shadow-lg ${
                        isPopular
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                          : 'bg-zinc-900 text-white border border-zinc-700'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Card Header */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3
                        className={`text-xl sm:text-2xl font-black tracking-tight ${
                          isPopular ? 'text-white' : 'text-black'
                        }`}
                      >
                        {plan.name}
                      </h3>
                      <span
                        className={`inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isPopular
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {plan.durationBadge}
                      </span>
                    </div>

                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isPopular ? 'bg-zinc-900 border border-zinc-800 text-orange-400' : 'bg-zinc-100 text-zinc-800'
                      }`}
                    >
                      {plan.id === 'starter-free' && <Gift className="w-5 h-5 text-emerald-600" />}
                      {plan.id === 'pro-growth' && <Zap className="w-5 h-5 text-amber-400" />}
                      {plan.id === 'vip-enterprise' && <Crown className="w-5 h-5 text-amber-500" />}
                    </div>
                  </div>

                  <p
                    className={`text-xs leading-relaxed line-clamp-3 min-h-[3rem] ${
                      isPopular ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price Box */}
                  <div
                    className={`p-4 rounded-2xl border ${
                      isPopular
                        ? 'bg-zinc-900/90 border-zinc-800/80 text-white'
                        : 'bg-zinc-50 border-zinc-200/80 text-black'
                    }`}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight">{plan.price}</span>
                      <span className={`text-xs font-semibold ${isPopular ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        / {plan.durationLabel}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] font-medium mt-1 ${
                        isPopular ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      {plan.periodText}
                    </p>
                  </div>

                  {/* Featured Car Listing Highlight Pill */}
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${
                      isPopular
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <Star className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                    <span>ফিচার্ড সুবিধা: <strong>{plan.featuredCount}</strong></span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-2">
                    <p
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isPopular ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      প্যাকেজের প্রধান সুবিধাসমূহ:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              feature.highlight
                                ? isPopular
                                  ? 'text-orange-400'
                                  : 'text-emerald-600'
                                : isPopular
                                ? 'text-zinc-400'
                                : 'text-zinc-500'
                            }`}
                          />
                          <span
                            className={`leading-relaxed ${
                              feature.highlight
                                ? isPopular
                                  ? 'text-white font-bold'
                                  : 'text-zinc-950 font-bold'
                                : isPopular
                                ? 'text-zinc-300'
                                : 'text-zinc-700'
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-8">
                  <Link href={plan.ctaHref} className="block w-full">
                    {plan.ctaVariant === 'white' && (
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-black text-sm px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                      >
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {plan.ctaVariant === 'dark' && (
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-black text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                      >
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {plan.ctaVariant === 'outline' && (
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 bg-transparent hover:bg-black hover:text-white text-black font-black text-sm px-6 py-3.5 rounded-full border-2 border-black transition-all duration-200 active:scale-[0.98]"
                      >
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </Link>

                  <p
                    className={`text-[10px] text-center mt-2.5 ${
                      isPopular ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                  >
                    যেকোনো সময় প্ল্যান আপগ্রেড বা বাতিল করার সুবিধা
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Assurance Note */}
        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">কোনো লুকানো চার্জ নেই • ১০০% নিরাপদ লেনদেন</h4>
              <p className="text-xs text-zinc-500">
                বিকাশ, নগদ, রকেট বা ব্যাংক কার্ডের মাধ্যমে সহজ ও নিরাপদ পেমেন্ট সুবিধা।
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline shrink-0"
          >
            <span>কাস্টম প্ল্যান প্রয়োজন? কথা বলুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
