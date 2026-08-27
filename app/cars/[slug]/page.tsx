'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fallbackCars } from '@/services/car.service';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import {
  DoorClosed,
  Users,
  Gauge,
  Calendar,
  Briefcase,
  Wind,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Milestone,
  MessageCircle,
} from 'lucide-react';

export default function CarDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find car by slug or fallback to the first car (Viper SXT)
  const car = fallbackCars.find((c) => c.slug === slug) || fallbackCars[0];

  const policyItems: AccordionItem[] = [
    {
      id: 'license',
      title: "Driver's License Requirements",
      content:
        'A valid, unexpired national or international driver’s license held for at least 1 year is required at vehicle handover. Digital copies are accepted during pre-verification.',
    },
    {
      id: 'insurance',
      title: 'Insurance and Coverage Policy',
      content:
        'All rentals include standard comprehensive insurance covering collision damage waiver (CDW), third-party liability, and theft protection with zero excess deductible.',
    },
    {
      id: 'payment',
      title: 'Available Payment Methods',
      content:
        'We accept all major credit cards (Visa, MasterCard, Amex), Google Pay, Apple Pay, and verified wire transfers. Security deposits are released instantly upon return.',
    },
    {
      id: 'cancellation',
      title: 'Cancellation and Modification Policy',
      content:
        'Free cancellations are permitted up to 24 hours prior to scheduled pick-up time with 100% full refund.',
    },
    {
      id: 'smoking',
      title: 'Smoking and Pet Policies',
      content:
        'All vehicles in the Carketo fleet are strictly non-smoking. Service pets are permitted with prior notice and protective interior covers.',
    },
    {
      id: 'age',
      title: 'The Minimum Age Requirements',
      content:
        'The minimum age to rent standard vehicles is 21 years old. For high-performance supercars and track-spec editions, drivers must be at least 25 years old.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* 1. TOP HERO HEADER */}
      <section className="relative bg-black text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80"
            alt="Hero BG"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {car.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-white transition-colors">
              Cars
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{car.title}</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Pricing & Specs Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-card space-y-6">
              {/* Pricing Header */}
              <div className="border-b border-zinc-100 pb-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-black">
                    {formatPrice(car.rentalPrice || 329)}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    / Per Day
                  </span>
                </div>
              </div>

              {/* Specs Table */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <DoorClosed className="w-4 h-4 text-zinc-400" />
                    <span>Doors</span>
                  </div>
                  <span className="font-bold text-black">{car.specs.doors}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <span>Passengers</span>
                  </div>
                  <span className="font-bold text-black">{car.specs.passengers}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-zinc-400" />
                    <span>Transmission</span>
                  </div>
                  <span className="font-bold text-black">{car.specs.transmission}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Age</span>
                  </div>
                  <span className="font-bold text-black">{car.specs.age || 1}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-zinc-400" />
                    <span>Luggage</span>
                  </div>
                  <span className="font-bold text-black">{car.specs.luggage}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-zinc-400" />
                    <span>Air Condition</span>
                  </div>
                  <span className="font-bold text-black">
                    {car.specs.airCondition ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="dark"
                  size="lg"
                  className="flex-1 text-sm font-bold shadow-md hover:bg-black"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Book Now
                </Button>
                <button
                  type="button"
                  title="WhatsApp Support"
                  className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800 transition-transform hover:scale-105 shrink-0 shadow-md border border-zinc-700"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Gallery, Features, Amenities & Policies (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Image Slider */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-zinc-900 aspect-[16/10] shadow-xl border border-zinc-200">
                <img
                  src={car.images[activeImageIndex] || car.coverImage}
                  alt={car.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {car.images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      activeImageIndex === idx
                        ? 'w-8 bg-black'
                        : 'w-2.5 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Unlimited KMs Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <Milestone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Unlimited KMs</h4>
                  <p className="text-xs text-zinc-500">Endless Kms with no extra charge</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <Milestone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Unlimited KMs</h4>
                  <p className="text-xs text-zinc-500">Endless Kms with no extra charge</p>
                </div>
              </div>
            </div>

            {/* General Information Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>General Information</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                Know about our car service
              </h2>

              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                {car.description} Every vehicle in the Carketo fleet is meticulously cleaned, sanitized, and maintained according to factory specifications.
              </p>

              <div className="space-y-2.5 pt-2">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-zinc-800">
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities & Features Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Amenities</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                Premium amenities and features
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {car.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies & Agreement Accordion */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Rental Conditions</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                Policies and agreement
              </h2>

              <Accordion items={policyItems} defaultOpenId="license" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
