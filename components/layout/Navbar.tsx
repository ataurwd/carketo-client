'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { ArrowUpRight, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, setAuth } = useAuthStore();

  useEffect(() => {
    // Check session on initial load
    authService.getMe().then((userData) => {
      if (userData) {
        const token = localStorage.getItem('access_token') || '';
        setAuth(userData, token);
      }
    });
  }, [setAuth]);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <Logo variant="dark" size="md" />
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
                    ? 'text-black font-bold'
                    : 'text-zinc-600 hover:text-black'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Auth CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full border border-zinc-300 bg-white hover:border-black transition-all"
              >
                <span className="text-xs font-bold text-black">{user.name}</span>
                <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-zinc-200 shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="text-xs font-bold text-black truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{user.role === 'admin' ? 'Admin Panel' : 'User Dashboard'}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-bold text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/cars?type=rent">
                <Button
                  variant="dark"
                  size="md"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Book A Rental
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-700 hover:text-black hover:bg-zinc-100"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-zinc-800 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="outline" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="dark" size="md" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 rounded-full bg-zinc-100 text-rose-600 font-bold text-xs"
              >
                Sign Out ({user?.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
