'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ArrowUpRight, Youtube, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-10 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-900">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo variant="white" size="md" />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Experience the ease and convenience of renting or purchasing verified premium cars with full peace of mind.
            </p>
          </div>

          {/* Legal Policy */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Legal Policy
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-white transition-colors">
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-white transition-colors">
                  Car Fleet
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Subscribe to Newsletter
            </h4>
            <p className="text-xs text-zinc-400 mb-3">
              Get the latest luxury car deals & rental discounts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                type="email"
                placeholder="Email Address..."
                className="w-full bg-zinc-900 text-sm text-white placeholder:text-zinc-500 rounded-full py-3 pl-4 pr-12 border border-zinc-800 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1 top-1 h-9 w-9 rounded-full bg-white flex items-center justify-center text-black hover:bg-zinc-200 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Carketo Marketplace. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="#" className="p-2 rounded-full hover:text-white hover:bg-zinc-900 transition-colors">
              <Youtube className="w-4 h-4" />
            </Link>
            <Link href="#" className="p-2 rounded-full hover:text-white hover:bg-zinc-900 transition-colors">
              <Facebook className="w-4 h-4" />
            </Link>
            <Link href="#" className="p-2 rounded-full hover:text-white hover:bg-zinc-900 transition-colors">
              <Twitter className="w-4 h-4" />
            </Link>
            <Link href="#" className="p-2 rounded-full hover:text-white hover:bg-zinc-900 transition-colors">
              <Instagram className="w-4 h-4" />
            </Link>
            <Link href="#" className="p-2 rounded-full hover:text-white hover:bg-zinc-900 transition-colors">
              <Linkedin className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
