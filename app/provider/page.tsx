'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { providerService, ProviderStatsData } from '@/services/provider.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import {
  DollarSign,
  Car,
  CalendarCheck,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Building2,
  Settings,
} from 'lucide-react';

export default function ProviderDashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<ProviderStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    providerService
      .getStats()
      .then((res) => setData(res))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center text-xl font-black shadow-md">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-black">
                  {user?.name || 'ডিলারশিপ / কার হাব'}
                </h1>
                <Badge variant="brand" size="sm">
                  প্রোভাইডার
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                আপনার গাড়ির ইনভেন্টরি, গ্রাহকের রিজার্ভেশন এবং আয় পরিচালনা করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/provider/profile">
              <Button variant="outline" size="sm" leftIcon={<Settings className="w-3.5 h-3.5" />}>
                ব্যবসায়িক প্রোফাইল
              </Button>
            </Link>
            <Link href="/provider/cars/create">
              <Button variant="dark" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                নতুন গাড়ি যুক্ত করুন
              </Button>
            </Link>
          </div>
        </div>

        {/* Financial & Car Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">মোট আয়</span>
              <DollarSign className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {formatPrice(data?.stats?.totalRevenue ?? 0)}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600">ভাড়া + বিক্রয় সম্মিলিত</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">সক্রিয় গাড়ি</span>
              <Car className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.activeListings ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">
              মোট {data?.stats?.totalCars ?? 0} টি গাড়ি নিবন্ধিত
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">মোট বুকিং</span>
              <CalendarCheck className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.totalBookings ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">গ্রাহক রিজার্ভেশন</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">সরাসরি বিক্রয়</span>
              <TrendingUp className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.totalOrders ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">সম্পন্ন গাড়ি বিক্রয়</span>
          </div>
        </div>

        {/* Recent Inquiries & Bookings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-black">আগত রেন্টাল বুকিং</h2>
              <p className="text-xs text-zinc-500">রিয়েল-টাইম রিজার্ভেশন এবং গ্রাহক হ্যান্ডওভার শিডিউল।</p>
            </div>
            <span className="text-xs font-bold text-zinc-400">সর্বশেষ অনুরোধসমূহ</span>
          </div>

          {data?.recentBookings && data.recentBookings.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {data.recentBookings.map((b: any) => (
                <div key={b._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-black">
                      {b.carId?.title || 'BMW M4 Competition'}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      ভাড়াটে: <span className="font-semibold text-zinc-800">{b.userId?.name || 'গ্রাহক'}</span> ({b.userId?.email || 'প্রযোজ্য নয়'})
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      তারিখ: {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-black">{formatPrice(b.totalAmount)}</span>
                    <Badge variant={b.status === 'confirmed' ? 'dark' : 'slate'} size="sm">
                      {b.status === 'confirmed' ? 'নিশ্চিত' : b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400 space-y-3">
              <Car className="w-10 h-10 mx-auto text-zinc-300" />
              <p className="text-xs font-medium">এখনো কোনো বুকিং আসেনি। গ্রাহকদের আকৃষ্ট করতে আরও গাড়ি যুক্ত করুন!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
