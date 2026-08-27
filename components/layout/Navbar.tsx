'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, Menu, X, Car } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
              NOVA<span className="text-brand">RIDE</span>
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase mt-0.5">
              Car Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'text-sm font-semibold transition-colors duration-150 relative py-1',
                  isActive
                    ? 'text-brand'
                    : 'text-slate-700 hover:text-slate-900'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & User CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/cars?type=rent">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Book A Rental
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-800 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/cars?type=rent" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                Book A Rental
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
