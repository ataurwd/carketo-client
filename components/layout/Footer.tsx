'use client';

import React from 'react';
import Link from 'next/link';
import { Car, ArrowUpRight, Youtube, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0F19] text-white pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-glow">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                NOVA<span className="text-brand">RIDE</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Experience the ease and convenience of renting or purchasing verified premium cars with full peace of mind.
            </p>
          </div>

          {/* Legal Policy */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Legal Policy
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/terms" className="hover:text-brand transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-brand transition-colors">
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-brand transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-brand transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-brand transition-colors">
                  Car Fleet
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-brand transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Subscribe to Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Get the latest luxury car deals & rental discounts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                type="email"
                placeholder="Email Address..."
                className="w-full bg-[#161D2F] text-sm text-white placeholder:text-slate-500 rounded-full py-3 pl-4 pr-12 border border-slate-700 focus:outline-none focus:border-brand"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1 top-1 h-9 w-9 rounded-full bg-brand flex items-center justify-center text-white hover:bg-brand-600 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NovaRide Marketplace. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="#" className="p-2 rounded-full hover:text-brand hover:bg-slate-800/50 transition-colors">
              <Youtube className="w-4 h-4" />
            </Link>
            <Link href="#" className="p-2 rounded-full hover:text-brand hover:bg-slate-800/50 transition-colors">
              <Facebook className="w-4 h-4" />
            </Link>
            <Link href="#" className="p-2 rounded-full hover:text-brand hover:bg-slate-800/50 transition-colors">
              <Twitter className="w-4 h-4" />
            </Link>
            <Link href="#" className="p-2 rounded-full hover:text-brand hover:bg-slate-800/50 transition-colors">
              <Instagram className="w-4 h-4" />
            </Link>
            <Link href="#" className="p-2 rounded-full hover:text-brand hover:bg-slate-800/50 transition-colors">
              <Linkedin className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
