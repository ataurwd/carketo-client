import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Zap, Award, Users, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black text-white py-20 px-4 sm:px-6 lg:px-8 text-center space-y-6 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>About Carketo</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Redefining luxury automotive rentals & sales
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Founded with a passion for world-class motoring, Carketo connects discerning drivers with verified luxury sports cars, supercars, and premium family crossovers.
          </p>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-black">15,000+</p>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-1">
              Completed Trips
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-black">100%</p>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-1">
              Insured Fleet
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-black">4.9 / 5.0</p>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-1">
              Customer Satisfaction
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-black">24 / 7</p>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-1">
              Roadside Assistance
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Our Core Philosophy</span>
            <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight">
              Transparency, speed, and unforgettable driving experiences
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              We eliminated tedious paperwork, opaque pricing structures, and vehicle substitution bait-and-switches. When you book a Porsche or Dodge on Carketo, you drive that exact car with transparent guarantees.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Certified 150-point mechanical and safety inspection before every rental',
                'Comprehensive zero-deductible insurance coverage included with every booking',
                'Concierge doorstep delivery to airports, luxury resorts, and residences',
                'Seamless, instant crypto or card payment processing with zero hidden fees',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/cars">
                <Button variant="dark" size="lg" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Explore Verified Fleet
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"
              alt="Luxury Showroom"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
