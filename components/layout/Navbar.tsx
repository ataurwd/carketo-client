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
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<INotification[]>([]);
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

  // Fetch unread notifications if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      notificationService.getNotifications(1, 5).then((res) => {
        setRecentNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }).catch(() => {});
    }
  }, [isAuthenticated, pathname]);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    setUserDropdownOpen(false);
    setNotificationsOpen(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setRecentNotifications(recentNotifications.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
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
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated && user ? (
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
                        <span className="text-xs font-black text-black">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-bold text-zinc-500 hover:text-black transition-colors flex items-center gap-1"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Mark all read</span>
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
                        <p className="text-center text-xs text-zinc-400 py-6">No notifications</p>
                      )}
                    </div>

                    <div className="pt-2 px-4 border-t border-zinc-100 text-center">
                      <Link
                        href="/dashboard/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-bold text-black hover:underline inline-block py-1"
                      >
                        View All Notifications →
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
                          <span>Master Fleet</span>
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
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/provider/cars"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <Car className="w-4 h-4" />
                          <span>My Fleet</span>
                        </Link>
                        <Link
                          href="/dashboard/inquiries"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Inquiries Inbox</span>
                        </Link>
                        <Link
                          href="/dashboard/wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Saved Wishlist</span>
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
                        <span>Sign Out</span>
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
                <Link href="/cars?type=rent" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="dark" size="md" className="w-full">
                    Book A Rental
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button variant="dark" size="md" className="w-full">
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 text-center text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl mt-2"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
