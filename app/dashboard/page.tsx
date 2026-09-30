'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { userService, UserDashboardData } from '@/services/user.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import {
  Calendar,
  Heart,
  Car,
  ShoppingBag,
  ArrowUpRight,
  Clock,
  User as UserIcon,
  ShieldCheck,
  Plus,
  KeyRound,
  List,
  Bell,
  Star,
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    userService
      .getDashboard()
      .then((res) => setData(res))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || 'User'}
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-2xl object-cover shadow-md border border-zinc-200"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center text-xl font-black shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-black">
                  স্বাগতম, {user?.name || 'সদস্য'}!
                </h1>
                <Badge variant="dark" size="sm">
                  {user?.role === 'admin' ? 'অ্যাডমিন' : 'সদস্য'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                {user?.email || 'আপনার সক্রিয় বিজ্ঞাপন, ভাড়া এবং পছন্দের গাড়িগুলো পরিচালনা করুন।'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/provider/cars/create">
              <Button variant="dark" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                গাড়ি যুক্ত করুন
              </Button>
            </Link>
            <Link href="/provider/cars">
              <Button variant="outline" size="sm" leftIcon={<Car className="w-3.5 h-3.5" />}>
                আমার গাড়ি
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm" leftIcon={<UserIcon className="w-3.5 h-3.5" />}>
                প্রোফাইল
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Navigation Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/provider/cars"
            className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-black hover:shadow-md transition-all space-y-2 group"
          >
            <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
              <Car className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-black">আমার গাড়ি</h4>
            <p className="text-[11px] text-zinc-400">আপনার গাড়িগুলো দেখুন ও পরিচালনা করুন</p>
          </Link>

          <Link
            href="/dashboard/wishlist"
            className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-black hover:shadow-md transition-all space-y-2 group"
          >
            <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-black">পছন্দের তালিকা</h4>
            <p className="text-[11px] text-zinc-400">সংরক্ষিত পছন্দের গাড়ি দেখুন</p>
          </Link>

          <Link
            href="/dashboard/inquiries"
            className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-black hover:shadow-md transition-all space-y-2 group"
          >
            <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-black">আমার জিজ্ঞাসা</h4>
            <p className="text-[11px] text-zinc-400">ক্রেতাদের সরাসরি বার্তা</p>
          </Link>

          <Link
            href="/dashboard/notifications"
            className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-black hover:shadow-md transition-all space-y-2 group"
          >
            <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-black">নোটিফিকেশন</h4>
            <p className="text-[11px] text-zinc-400">অ্যালার্ট ও বার্তাসমূহ</p>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">মোট বুকিং</span>
              <Calendar className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.totalBookings ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600">সর্বমোট রিজার্ভেশন</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">চলমান ভাড়া</span>
              <Clock className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.activeRentals ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">বর্তমানে সক্রিয়</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">পছন্দের গাড়ি</span>
              <Heart className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.wishlistCount ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">পরবর্তীতে দেখার জন্য সংরক্ষিত</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">ক্রয়কৃত গাড়ি</span>
              <ShoppingBag className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.totalOrders ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">ভেরিফায়েড মালিকানা</span>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-black">সাম্প্রতিক কার্যক্রম</h2>
              <p className="text-xs text-zinc-500">আপনার সর্বশেষ গাড়ি ভাড়া এবং জিজ্ঞাসাসমূহ।</p>
            </div>
            <Link href="/cars?type=rent" className="text-xs font-bold text-black hover:underline">
              আরও গাড়ি দেখুন →
            </Link>
          </div>

          {data?.recentBookings && data.recentBookings.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {data.recentBookings.map((b: any) => (
                <div key={b._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {b.carId?.coverImage && (
                      <img
                        src={b.carId.coverImage}
                        alt={b.carId.title || 'Car'}
                        className="w-16 h-12 object-cover rounded-xl border border-zinc-100"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-extrabold text-black">
                        {b.carId?.title || 'প্রিমিয়াম রেন্টাল গাড়ি'}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-black">{formatPrice(b.totalAmount)}</span>
                    <Badge variant={b.status === 'confirmed' ? 'brand' : 'slate'} size="sm">
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400 space-y-3">
              <Car className="w-10 h-10 mx-auto text-zinc-300" />
              <p className="text-xs font-medium">এখনো কোনো সক্রিয় রিজার্ভেশন নেই। আপনার স্বপ্নের গাড়ি খুঁজুন অথবা নিজের গাড়ি তালিকাভুক্ত করুন!</p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/cars">
                  <Button variant="dark" size="sm">
                    গাড়ি খুঁজুন
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    আপনার গাড়ি যুক্ত করুন
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
