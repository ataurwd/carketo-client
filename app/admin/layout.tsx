'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Logo } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Car,
  Users,
  Building2,
  MessageSquare,
  Star,
  Ticket,
  Settings,
  Activity,
  LogOut,
  Globe,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Fleet Cars', href: '/admin/cars', icon: Car },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'System Health', href: '/admin/health', icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, token, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated || !token) {
        router.replace('/login?redirect=/admin');
      } else if (user?.role !== 'admin') {
        router.replace('/dashboard');
      }
    }
  }, [isInitialized, isAuthenticated, token, user, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!isInitialized || !isAuthenticated || !token || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-zinc-900 text-white">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-400">Verifying Admin Privileges...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row font-sans">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-zinc-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2" title="Back to Home">
          <Logo variant="white" size="sm" />
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR (Desktop & Mobile Overlay) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 text-white flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity" title="Back to Home">
              <Logo variant="white" size="md" />
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                Admin
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Info & Footer Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Go to Public Site</span>
          </Link>

          <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'Admin'}
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-xl object-cover border border-zinc-700 shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Logout"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-700/60 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-200 shadow-sm sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-black capitalize">
              {navItems.find((i) =>
                i.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(i.href)
              )?.label || 'Admin Control Panel'}
            </h1>
            <p className="text-xs text-zinc-500">
              Manage platform operations, listings, providers, users and analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </Link>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
