'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { notificationService, INotification } from '@/services/notification.service';
import {
  ArrowUpRight,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Car,
  Heart,
  User,
  Bell,
  MessageSquare,
  CheckCheck,
  Home,
  ShoppingBag,
  DollarSign,
  PhoneCall,
  ChevronRight,
  Users,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

const OFF_CANVAS_NAV = [
  { label: 'হোম', href: '/', icon: Home, desc: 'ফিচার্ড গাড়ি ও সেরা ডিল' },
  { label: 'গাড়ি ভাড়া', href: '/rent', icon: Car, desc: 'দৈনিক, সাপ্তাহিক ও মাসিক ভাড়া' },
  { label: 'গাড়ি কিনুন', href: '/buy', icon: ShoppingBag, desc: 'যাচাইকৃত বিক্রয়যোগ্য গাড়ি' },
  { label: 'গাড়ি বিক্রি', href: '/sell', icon: DollarSign, desc: 'আজই আপনার গাড়ি লিস্ট ও বিক্রি করুন' },
  { label: 'যোগাযোগ', href: '/contact', icon: PhoneCall, desc: '২৪/৭ সাপোর্ট ও সহায়তা' },
];

export const Navbar: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<INotification[]>([]);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    const cleanPath = pathname.replace(/\/+$/, '') || '/';
    const cleanHref = href.replace(/\/+$/, '') || '/';

    if (cleanHref === '/') {
      return cleanPath === '/';
    }

    if (cleanHref === '/sell') {
      return cleanPath === '/sell' || cleanPath.startsWith('/sell/') || cleanPath.startsWith('/provider/cars');
    }

    return cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`);
  };

  const { user, token, isAuthenticated, logout, setAuth } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentToken = localStorage.getItem('access_token');
    if (!currentToken) {
      if (isAuthenticated || user) {
        useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
        try {
          localStorage.removeItem('carketo_auth_session');
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
        } catch {}
      }
      return;
    }

    // Check session on initial load with valid token
    authService.getMe().then((userData) => {
      if (userData) {
        setAuth(userData, currentToken);
      } else {
        logout();
      }
    }).catch(() => {
      logout();
    });
  }, [setAuth, logout]);

  const hasToken = mounted ? !!(token || (typeof window !== 'undefined' && localStorage.getItem('access_token'))) : false;
  const isLoggedIn = mounted && isAuthenticated && !!user && hasToken;

  // Fetch unread notifications if authenticated
  useEffect(() => {
    if (isLoggedIn) {
      notificationService.getNotifications(1, 5).then((res) => {
        setRecentNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }).catch(() => {});
    }
  }, [isLoggedIn, pathname]);

  // Close off-canvas drawer on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll and listen for Escape key when off-canvas is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    setUserDropdownOpen(false);
    setNotificationsOpen(false);
    setMobileMenuOpen(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setRecentNotifications(recentNotifications.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <Logo variant="dark" size="md" />
        </Link>

        {/* Desktop Navigation Links (Visible on >= 1024px) */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.href);
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

        {/* Desktop Action Button & Auth CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell with Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="relative p-2.5 rounded-full border border-zinc-200 bg-white hover:border-black text-zinc-700 hover:text-black transition-all"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popover */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-zinc-200 shadow-2xl py-3 z-50 animate-in fade-in zoom-in duration-150 space-y-2">
                    <div className="px-4 py-2 flex items-center justify-between border-b border-zinc-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-black">নোটিফিকেশন</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold">
                            {unreadCount}টি নতুন
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-bold text-zinc-500 hover:text-black transition-colors flex items-center gap-1"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>সব পঠিত করুন</span>
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto px-2">
                      {recentNotifications.length > 0 ? (
                        recentNotifications.map((n) => (
                          <Link
                            key={n._id}
                            href={n.link || '/dashboard/notifications'}
                            onClick={() => setNotificationsOpen(false)}
                            className={`block p-3 rounded-2xl transition-colors ${
                              n.isRead ? 'hover:bg-zinc-50' : 'bg-zinc-50/80 hover:bg-zinc-100/70 font-semibold'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-bold text-black truncate">{n.title}</p>
                              <span className="text-[10px] text-zinc-400 shrink-0">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-600 line-clamp-2 mt-0.5">{n.message}</p>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-xs text-zinc-400 py-6">কোনো নোটিফিকেশন নেই</p>
                      )}
                    </div>

                    <div className="pt-2 px-4 border-t border-zinc-100 text-center">
                      <Link
                        href="/dashboard/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-bold text-black hover:underline inline-block py-1"
                      >
                        সব নোটিফিকেশন দেখুন →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full border border-zinc-300 bg-white hover:border-black transition-all"
                >
                  <span className="text-xs font-bold text-black max-w-[120px] truncate">{user.name}</span>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-7 w-7 rounded-full object-cover border border-zinc-200"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-zinc-200 shadow-xl py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center gap-2.5">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 rounded-full object-cover border border-zinc-200 shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-black truncate">{user.name}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    {user.role === 'admin' ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <LayoutDashboard className="w-4 h-4 text-black" />
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link
                          href="/admin/cars"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <Car className="w-4 h-4" />
                          <span>Master Cars</span>
                        </Link>
                        <Link
                          href="/admin/users"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <User className="w-4 h-4" />
                          <span>User Directory</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>ড্যাশবোর্ড</span>
                        </Link>
                        <Link
                          href="/provider/cars"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <Car className="w-4 h-4" />
                          <span>আমার গাড়িসমূহ</span>
                        </Link>
                        <Link
                          href="/dashboard/inquiries"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>ইনবক্স ও জিজ্ঞাসা</span>
                        </Link>
                        <Link
                          href="/dashboard/wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <Heart className="w-4 h-4" />
                          <span>পছন্দের তালিকা</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-zinc-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>লগ আউট</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-bold text-xs">
                  লগ ইন
                </Button>
              </Link>
              <Link href="/cars?type=rent">
                <Button
                  variant="dark"
                  size="md"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  গাড়ি ভাড়া নিন
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile & Tablet Trigger Button (Visible on < 1024px) */}
        <div className="flex items-center gap-2 lg:hidden">
          {isLoggedIn && (
            <Link
              href="/dashboard/notifications"
              className="relative p-2.5 rounded-full border border-zinc-200 bg-white text-zinc-700 hover:text-black hover:border-black transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-black text-white text-[9px] font-black flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 hover:text-black transition-colors flex items-center justify-center"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>

    {/* OFF-CANVAS DRAWER SYSTEM (Mobile & Tablet) - Portaled directly to document.body to avoid header containment & horizontal overflow */}
    {mounted &&
      createPortal(
        <div
          className={cn(
            'fixed inset-0 z-[9999] lg:hidden',
            mobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          )}
        >
          {/* 1. Backdrop Overlay */}
          <div
            className={cn(
              'fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
              mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* 2. Off-Canvas Sliding Drawer Panel */}
          <aside
            className={cn(
              'fixed top-0 right-0 bottom-0 z-[10000] w-full max-w-[340px] sm:max-w-[380px] bg-white shadow-2xl flex flex-col transition-all duration-300 ease-out',
              mobileMenuOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible pointer-events-none'
            )}
            aria-label="Mobile Navigation Drawer"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-zinc-100 bg-white">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <Logo variant="dark" size="sm" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="h-9 w-9 rounded-full border border-zinc-200 bg-zinc-50 hover:bg-black hover:text-white text-zinc-600 flex items-center justify-center transition-all duration-150 cursor-pointer"
                aria-label="Close Navigation"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* User Card (if Authenticated) */}
            {isLoggedIn && user && (
              <div className="p-4 mx-4 mt-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full object-cover border border-zinc-300 shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-black shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-black truncate">{user.name}</p>
                      {user.role === 'admin' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-700 border border-amber-500/20">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="shrink-0 p-2 rounded-xl bg-white border border-zinc-200 hover:border-black text-zinc-700 hover:text-black transition-colors"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {/* Main Navigation Links */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-3">
                  কারকেটো এক্সপ্লোর করুন
                </span>
                <div className="space-y-1">
                  {OFF_CANVAS_NAV.map((item) => {
                    const isActive = isLinkActive(item.href);
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-2xl transition-all duration-150 group',
                          isActive
                            ? 'bg-black text-white shadow-sm'
                            : 'text-zinc-800 hover:bg-zinc-100 hover:text-black'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-zinc-100 text-zinc-700 group-hover:bg-white group-hover:shadow-sm'
                            )}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className={cn('text-xs font-bold leading-tight', isActive ? 'text-white' : 'text-zinc-900')}>
                              {item.label}
                            </p>
                            <p className={cn('text-[10px] leading-tight truncate mt-0.5', isActive ? 'text-zinc-300' : 'text-zinc-400')}>
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            'w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5',
                            isActive ? 'text-white/80' : 'text-zinc-400'
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* User Account & Management Shortcuts (If logged in) */}
              {isLoggedIn && (
                <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-3">
                    অ্যাকাউন্ট ও গাড়ি
                  </span>
                  <div className="space-y-1">
                    {user?.role === 'admin' ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutDashboard className="w-4 h-4 text-black" />
                            <span>Admin Dashboard</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                        <Link
                          href="/admin/cars"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Car className="w-4 h-4 text-black" />
                            <span>Master Cars Inventory</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                        <Link
                          href="/admin/users"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-black" />
                            <span>User Management</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutDashboard className="w-4 h-4 text-black" />
                            <span>ড্যাশবোর্ড ওভারভিউ</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                        <Link
                          href="/provider/cars"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Car className="w-4 h-4 text-black" />
                            <span>আমার গাড়ি ও বিজ্ঞাপন</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                        <Link
                          href="/dashboard/inquiries"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <MessageSquare className="w-4 h-4 text-black" />
                            <span>ইনবক্স ও জিজ্ঞাসা</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                        <Link
                          href="/dashboard/wishlist"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="w-4 h-4 text-black" />
                            <span>পছন্দের তালিকা</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 24/7 Concierge Support Mini Card */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-black" />
                  <span className="text-xs font-black text-black">সহায়তা প্রয়োজন?</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  বুকিং বা যেকোনো তথ্যের জন্য আমাদের সাপোর্ট টিম ২৪/৭ প্রস্তুত আছে।
                </p>
                <a
                  href="tel:+8801700000000"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline pt-1"
                >
                  <span>+880 1700-000000</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Drawer Sticky Bottom Actions */}
            <div className="p-4 border-t border-zinc-200 bg-white space-y-2">
              {!isLoggedIn ? (
                <div className="space-y-2">
                  <Link href="/cars?type=rent" onClick={() => setMobileMenuOpen(false)} className="block">
                    <Button variant="dark" size="md" className="w-full">
                      গাড়ি ভাড়া নিন
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                    <Button variant="outline" size="md" className="w-full font-bold">
                      অ্যাকাউন্টে লগ ইন করুন
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="dark" size="md" className="w-full">
                      {user?.role === 'admin' ? 'Open Admin Panel' : 'ড্যাশবোর্ডে যান'}
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>লগ আউট করুন</span>
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
};
