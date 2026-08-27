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
  Phone,
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
        'All vehicles in the NovaRide fleet are strictly non-smoking. Service pets are permitted with prior notice and protective interior covers.',
    },
    {
      id: 'age',
      title: 'The Minimum Age Requirements',
      content:
        'The minimum age to rent standard vehicles is 21 years old. For high-performance supercars and track-spec editions, drivers must be at least 25 years old.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. TOP HERO HEADER (Matching reference #1) */}
      <section className="relative bg-[#090D14] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80"
            alt="Hero BG"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D14] via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {car.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
            <Link href="/" className="hover:text-brand transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-brand transition-colors">
              Cars
            </Link>
            <span>/</span>
            <span className="text-brand">{car.title}</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Pricing & Specs Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card space-y-6">
              {/* Pricing Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    {formatPrice(car.rentalPrice || 329)}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    / Per Day
                  </span>
                </div>
              </div>

              {/* Specs Table */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-slate-600">
                  <div className="flex items-center gap-2">
                    <DoorClosed className="w-4 h-4 text-slate-400" />
                    <span>Doors</span>
                  </div>
                  <span className="font-bold text-slate-900">{car.specs.doors}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Passengers</span>
                  </div>
                  <span className="font-bold text-slate-900">{car.specs.passengers}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-slate-400" />
                    <span>Transmission</span>
                  </div>
                  <span className="font-bold text-slate-900">{car.specs.transmission}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Age</span>
                  </div>
                  <span className="font-bold text-slate-900">{car.specs.age || 1}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>Luggage</span>
                  </div>
                  <span className="font-bold text-slate-900">{car.specs.luggage}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-slate-400" />
                    <span>Air Condition</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {car.specs.airCondition ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 text-sm font-bold shadow-glow"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Book Now
                </Button>
                <button
                  type="button"
                  title="WhatsApp Support"
                  className="h-12 w-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#1EBE5D] transition-transform hover:scale-105 shrink-0 shadow-md"
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
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 aspect-[16/10] shadow-xl border border-slate-200/50">
                <img
                  src={car.images[activeImageIndex] || car.coverImage}
                  alt={car.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      activeImageIndex === idx
                        ? 'w-8 bg-brand'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Unlimited KMs Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0">
                  <Milestone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Unlimited KMs</h4>
                  <p className="text-xs text-slate-500">Endless Kms with no extra charge</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0">
                  <Milestone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Unlimited KMs</h4>
                  <p className="text-xs text-slate-500">Endless Kms with no extra charge</p>
                </div>
              </div>
            </div>

            {/* General Information Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-brand font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>General Information</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Know about our car service
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {car.description} Lorem ipsum fermentum quam sit amet cursus ante sollicitudin
                velin morbi consceua the miss suction consuation porttitor orci sit amet iaculis
                risus lorem pretium fermentum quam sit amet cursus ante sollicitudin velin fermen
                morbinetion conseua the risus consequation the porttitor.
              </p>

              <div className="space-y-2.5 pt-2">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities & Features Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80">
              <div className="inline-flex items-center gap-1.5 text-brand font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Amenities</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Premium amenities and features
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {car.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies & Agreement Accordion (Matching reference #1) */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80">
              <div className="inline-flex items-center gap-1.5 text-brand font-bold text-xs uppercase tracking-widest">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Rental Conditions</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
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
