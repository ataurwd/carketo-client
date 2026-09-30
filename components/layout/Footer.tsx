'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ArrowUpRight, Youtube, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-10 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-900">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo variant="white" size="md" />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              সম্পূর্ণ নিশ্চিন্তে ও সহজে যাচাইকৃত প্রিমিয়াম গাড়ি ভাড়া নেওয়া বা কেনার সেরা অভিজ্ঞতা নিন।
            </p>
          </div>

          {/* Legal Policy */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              আইনি নীতিমালা
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  শর্তাবলী ও নীতিমালা
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  গোপনীয়তা নীতি
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              গাড়ি খুঁজুন
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/rent" className="hover:text-white transition-colors">
                  গাড়ি ভাড়া নিন
                </Link>
              </li>
              <li>
                <Link href="/buy" className="hover:text-white transition-colors">
                  গাড়ি কিনুন
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-white transition-colors">
                  আপনার গাড়ি বিক্রি করুন
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  সাপোর্টে যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              নিউজলেটার সাবস্ক্রাইব করুন
            </h4>
            <p className="text-xs text-zinc-400 mb-3">
              সর্বশেষ লাক্সারি গাড়ির অফার ও ভাড়ার ডিসকাউন্ট আপডেট পান।
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                type="email"
                placeholder="ইমেইল ঠিকানা..."
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
          <p>© {new Date().getFullYear()} কারকেটো মার্কেটপ্লেস। সর্বস্বত্ব সংরক্ষিত।</p>
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
