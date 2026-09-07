'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Logo } from '@/components/ui/Logo';
import { adminService } from '@/services/admin.service';
import {
  LayoutDashboard,
  Car,
  CalendarCheck2,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  Mail,
  Users,
  Building2,
  Ticket,
  ScrollText,
  Settings,
  Activity,
  LogOut,
  Globe,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badgeKey?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'CORE',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'FLEET & COMMERCE',
    items: [
      { label: 'Fleet Inventory', href: '/admin/cars', icon: Car },
      { label: 'Rental Bookings', href: '/admin/bookings', icon: CalendarCheck2, badgeKey: 'bookings' },
      { label: 'Sales Orders', href: '/admin/orders', icon: ShoppingBag, badgeKey: 'orders' },
      { label: 'Financial Ledger', href: '/admin/payments', icon: CreditCard },
    ],
  },
  {
    title: 'CRM & USERS',
    items: [
      { label: 'Car Inquiries', href: '/admin/inquiries', icon: MessageSquare, badgeKey: 'inquiries' },
      { label: 'Contact Messages', href: '/admin/contacts', icon: Mail, badgeKey: 'contacts' },
      { label: 'Users & RBAC', href: '/admin/users', icon: Users },
      { label: 'Dealerships', href: '/admin/providers', icon: Building2, badgeKey: 'providers' },
    ],
  },
  {
    title: 'SYSTEM & MARKETING',
    items: [
      { label: 'Promo Coupons', href: '/admin/coupons', icon: Ticket },
      { label: 'Audit Trail', href: '/admin/audit-logs', icon: ScrollText },
      { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
      { label: 'System Telemetry', href: '/admin/health', icon: Activity },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, token, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  
  // Collapsible sidebar state (persisted in localStorage)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Collapsible accordion state for nav sections
  const [collapsedSections, setCollapsedSections] = useState<{ [title: string]: boolean }>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('karketo_admin_sidebar_collapsed');
      if (saved !== null) {
        setIsSidebarCollapsed(saved === 'true');
      }
    } catch {
      // localStorage not accessible
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('karketo_admin_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated || !token) {
        router.replace('/login?redirect=/admin');
      } else if (user?.role !== 'admin') {
        router.replace('/dashboard');
      }
    }
  }, [isInitialized, isAuthenticated, token, user, router]);

  // Fetch telemetry badge counters
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      adminService
        .getStats()
        .then((res) => {
          if (res?.metrics) {
            setCounts({
              bookings: res.metrics.pendingBookingsCount || 0,
              orders: res.metrics.pendingOrdersCount || 0,
              inquiries: res.metrics.totalInquiries || 0,
              providers: res.metrics.pendingProvidersCount || 0,
            });
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, user]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!isInitialized || !isAuthenticated || !token || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-zinc-950 text-white">
        <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-400">Verifying Admin Privileges...</p>
      </div>
    );
  }

  // Active page title calculation
  let activeTitle = 'Executive Overview';
  for (const section of navSections) {
    for (const item of section.items) {
      if (item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href)) {
        activeTitle = item.label;
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-orange-500 selection:text-white">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-zinc-900/90 backdrop-blur-md text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2" title="Back to Home">
          <Logo variant="white" size="sm" />
          <span className="text-xs font-bold text-zinc-400">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation"
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800/80 text-white flex flex-col justify-between transition-all duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        {/* Top Branding & Collapse Button */}
        <div
          className={`border-b border-zinc-800/70 transition-all ${
            isSidebarCollapsed ? 'p-3 flex flex-col items-center gap-2.5' : 'p-4 flex items-center justify-between'
          }`}
        >
          {isSidebarCollapsed ? (
            <>
              {/* Centered Brand Mark in Collapsed Mode */}
              <Link
                href="/admin"
                className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-orange-500/25 hover:scale-105 transition-transform shrink-0"
                title="Karketo Admin Console"
              >
                K
              </Link>
              {/* Expand Toggle Button directly underneath the logo mark */}
              <button
                onClick={toggleSidebar}
                title="Expand Sidebar"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/60 hover:border-zinc-700 transition-all"
              >
                <PanelLeftOpen className="w-4 h-4 text-orange-400" />
              </button>
            </>
          ) : (
            <>
              {/* Full Brand Logo & Tag in Expanded Mode */}
              <Link
                href="/admin"
                className="flex items-center gap-2.5 hover:opacity-90 transition-opacity min-w-0"
                title="Karketo Admin Console"
              >
                <Logo variant="white" size="md" />
                <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-black uppercase tracking-wider">
                  Admin
                </span>
              </Link>

              {/* Collapse Toggle Button in Expanded Mode */}
              <button
                onClick={toggleSidebar}
                title="Collapse Sidebar"
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/60 hover:border-zinc-700/60 transition-all"
              >
                <PanelLeftClose className="w-4 h-4 text-zinc-400 hover:text-orange-400" />
              </button>
            </>
          )}
        </div>

        {/* Navigation Sections (Collapsible Accordion / Centered Icons) */}
        <div
          className={`flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800 ${
            isSidebarCollapsed ? 'px-2' : 'px-3'
          }`}
        >
          {navSections.map((section, idx) => {
            const isSectionCollapsed = !!collapsedSections[section.title];
            const sectionHasActiveItem = section.items.some((item) =>
              item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href)
            );
            const sectionTotalBadge = section.items.reduce((acc, item) => {
              return acc + (item.badgeKey && counts[item.badgeKey] ? counts[item.badgeKey] : 0);
            }, 0);

            return (
              <div key={section.title} className="space-y-1">
                {/* Section Header */}
                {isSidebarCollapsed ? (
                  idx > 0 && (
                    <div className="py-1.5 flex items-center justify-center">
                      <div className="w-6 h-px bg-zinc-800/80" />
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full group flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={sectionHasActiveItem ? 'text-orange-400' : ''}>
                        {section.title}
                      </span>
                      {sectionTotalBadge > 0 && isSectionCollapsed && (
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {sectionTotalBadge > 0 && isSectionCollapsed && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          {sectionTotalBadge}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${
                          isSectionCollapsed ? '-rotate-90' : 'rotate-0'
                        }`}
                      />
                    </div>
                  </button>
                )}

                {/* Section Items */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    !isSidebarCollapsed && isSectionCollapsed
                      ? 'grid-rows-[0fr] opacity-0 pointer-events-none'
                      : 'grid-rows-[1fr] opacity-100'
                  }`}
                >
                  <div className={`overflow-hidden space-y-1.5 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === '/admin'
                          ? pathname === '/admin'
                          : pathname?.startsWith(item.href);
                      const count = item.badgeKey ? counts[item.badgeKey] : 0;

                      return (
                        <div key={item.href} className="relative group w-full flex justify-center">
                          {isSidebarCollapsed ? (
                            /* Symmetrical Square Icon Button in Collapsed Mode */
                            <Link
                              href={item.href}
                              className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all relative ${
                                isActive
                                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 border border-orange-400/40 ring-2 ring-orange-500/20'
                                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60'
                              }`}
                            >
                              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />

                              {/* Notification badge dot in collapsed icon */}
                              {count !== undefined && count > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-zinc-900 shadow-sm" />
                              )}
                            </Link>
                          ) : (
                            /* Full Width Nav Item in Expanded Mode */
                            <Link
                              href={item.href}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                isActive
                                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/20 border border-orange-500/30'
                                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70 border border-transparent hover:border-zinc-700/50'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <Icon
                                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                                    isActive
                                      ? 'text-white'
                                      : 'text-zinc-400 group-hover:text-orange-400'
                                  }`}
                                />
                                <span className="truncate">{item.label}</span>
                              </div>

                              {count !== undefined && count > 0 && (
                                <span
                                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                    isActive
                                      ? 'bg-white text-orange-600'
                                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  }`}
                                >
                                  {count}
                                </span>
                              )}
                            </Link>
                          )}

                          {/* Hover Tooltip when Sidebar is Collapsed */}
                          {isSidebarCollapsed && (
                            <div className="hidden md:flex absolute left-full top-1/2 -translate-y-1/2 ml-3.5 px-3 py-1.5 bg-zinc-900/98 backdrop-blur-2xl border border-zinc-700/80 text-white rounded-xl shadow-2xl z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none items-center gap-2">
                              <span className="text-xs font-bold tracking-wide">{item.label}</span>
                              {count !== undefined && count > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                  {count}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Profile & Actions */}
        <div
          className={`border-t border-zinc-800/70 space-y-2 bg-zinc-950/40 ${
            isSidebarCollapsed ? 'p-2 flex flex-col items-center' : 'p-3'
          }`}
        >
          {/* Public Storefront Link */}
          <div className="relative group w-full flex justify-center">
            {isSidebarCollapsed ? (
              <Link
                href="/"
                target="_blank"
                className="w-11 h-11 flex items-center justify-center rounded-xl text-zinc-400 hover:text-orange-400 hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60 transition-all"
              >
                <Globe className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700/60 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-zinc-400 group-hover:text-orange-400" />
                  <span>Public Live Site</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
            )}

            {isSidebarCollapsed && (
              <div className="hidden md:flex absolute left-full top-1/2 -translate-y-1/2 ml-3.5 px-3 py-1.5 bg-zinc-900/98 backdrop-blur-2xl border border-zinc-700/80 text-white rounded-xl shadow-2xl z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs font-bold">
                View Public Site
              </div>
            )}
          </div>

          {/* User Profile Card */}
          {isSidebarCollapsed ? (
            <div className="relative group w-full flex justify-center">
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="w-11 h-11 rounded-xl bg-zinc-800/60 hover:bg-rose-500/20 border border-zinc-700/50 hover:border-rose-500/40 flex items-center justify-center transition-all overflow-hidden text-zinc-400 hover:text-rose-400"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || 'Admin'}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
              </button>

              <div className="hidden md:flex absolute left-full top-1/2 -translate-y-1/2 ml-3.5 px-3 py-2 bg-zinc-900/98 backdrop-blur-2xl border border-zinc-700/80 text-white rounded-xl shadow-2xl z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex-col gap-0.5">
                <p className="text-xs font-bold text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-zinc-400">{user?.email}</p>
                <span className="text-[9px] text-rose-400 mt-1 font-bold">Click to Logout</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || 'Admin'}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-xl object-cover border border-zinc-700 shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">
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
                title="Sign Out"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-zinc-900/40">
        {/* Top Desktop Navigation Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Quick Toggle for Sidebar from top bar */}
            <button
              onClick={toggleSidebar}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800 transition-colors"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-orange-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            <div>
              <h1 className="text-lg font-black text-white capitalize tracking-tight">
                {activeTitle}
              </h1>
              <p className="text-[11px] text-zinc-400">
                Enterprise management console for fleet, bookings, finances and customer relations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700 transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>View Storefront</span>
            </Link>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Body View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
