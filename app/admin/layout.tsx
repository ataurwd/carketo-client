'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { Logo } from '@/components/ui/Logo';
import {
  Car,
  Users,
  MessageSquare,
  Star,
  Activity,
  Settings,
  Ticket,
  Building2,
  ShieldCheck,
  Search,
  Plus,
  LogOut,
  HelpCircle,
  Command,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export default function AdminSaaSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Keyboard shortcut Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    router.push('/login');
  };

  const navItems = [
    {
      title: 'Fleet Inventory',
      href: '/admin/cars',
      icon: Car,
      exact: false,
    },
    {
      title: 'User Directory',
      href: '/admin/users',
      icon: Users,
      exact: false,
    },
    {
      title: 'Inquiries & Leads',
      href: '/admin/inquiries',
      icon: MessageSquare,
      exact: false,
    },
    {
      title: 'Reviews',
      href: '/admin/reviews',
      icon: Star,
      exact: false,
    },
    {
      title: 'System Health',
      href: '/admin/health',
      icon: Activity,
      exact: false,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      exact: false,
    },
  ];

  const allCommands = [
    { title: 'Overview Dashboard', href: '/admin', icon: ShieldCheck, desc: 'Executive KPI telemetry' },
    { title: 'Fleet Inventory', href: '/admin/cars', icon: Car, desc: 'Moderate and approve cars' },
    { title: 'User Directory', href: '/admin/users', icon: Users, desc: 'RBAC roles and access' },
    { title: 'Inquiries & Leads', href: '/admin/inquiries', icon: MessageSquare, desc: 'Direct buyer inquiries' },
    { title: 'Customer Reviews', href: '/admin/reviews', icon: Star, desc: 'Moderate star ratings' },
    { title: 'System Health', href: '/admin/health', icon: Activity, desc: 'Microservices & audit logs' },
    { title: 'Global Settings', href: '/admin/settings', icon: Settings, desc: 'Currency & platform config' },
    { title: 'Coupons & Promos', href: '/admin/coupons', icon: Ticket, desc: 'Promotional discount codes' },
    { title: 'Dealership Providers', href: '/admin/providers', icon: Building2, desc: 'Commercial licenses' },
  ];

  const filteredCommands = allCommands.filter(
    (c) =>
      c.title.toLowerCase().includes(cmdSearch.toLowerCase()) ||
      c.desc.toLowerCase().includes(cmdSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col lg:flex-row font-sans antialiased text-zinc-900">
      {/* 1. FIXED DARK SAAS SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-black text-white p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Top Brand Logo */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center group">
              <Logo variant="white" size="md" className="h-8" />
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Command Search Pill */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition-all shadow-inner group"
          >
            <span className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              <span>Command Palette</span>
            </span>
            <kbd className="px-2 py-0.5 rounded-lg bg-zinc-800 text-[10px] font-bold text-zinc-400 border border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {/* Overview / Executive link */}
            <Link
              href="/admin"
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                pathname === '/admin'
                  ? 'bg-[#34D399] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/70'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${pathname === '/admin' ? 'text-black' : 'text-zinc-400'}`} />
              <span>Executive Overview</span>
            </Link>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#34D399] text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Pinned Links: Support & Logout */}
        <div className="space-y-1.5 pt-6 border-t border-zinc-900 text-xs font-semibold">
          <Link
            href="/contact"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-900/70 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between bg-black text-white p-4 sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-zinc-900 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-black text-sm">SaaS Executive Center</span>
          </div>
          <Link href="/provider/cars/create">
            <button className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>List Car</span>
            </button>
          </Link>
        </div>

        {/* Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] w-full mx-auto">
          {/* Top Floating SaaS Header Bar */}
          <div className="bg-black text-white px-6 py-4 rounded-3xl shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                SaaS Executive Center
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="p-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Search Command Palette (Ctrl + K)"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link href="/provider/cars/create">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-zinc-100 text-black text-xs font-black transition-all shadow-sm">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>List a Car</span>
                </button>
              </Link>

              {/* User Avatar Circle */}
              <Link href="/admin/users" title={user?.name || 'Administrator'}>
                <div className="h-9 w-9 rounded-full bg-zinc-800 border-2 border-white/20 flex items-center justify-center font-black text-xs text-white hover:border-white transition-colors">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              </Link>
            </div>
          </div>

          {/* Render Page Contents */}
          {children}
        </main>
      </div>

      {/* Global Command Palette Modal (Ctrl + K) */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="bg-white max-w-xl w-full rounded-3xl p-5 shadow-2xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="relative">
              <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search commands, vehicles, users, or jump to module..."
                value={cmdSearch}
                onChange={(e) => setCmdSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto">
              {filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <Link
                    key={cmd.href}
                    href={cmd.href}
                    onClick={() => setCommandPaletteOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-100 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-xl bg-zinc-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-black">{cmd.title}</p>
                      <p className="text-[10px] text-zinc-400">{cmd.desc}</p>
                    </div>
                    <kbd className="text-[10px] text-zinc-400 font-bold">Jump →</kbd>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Quick Navigation</span>
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 font-bold text-zinc-600">Esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
