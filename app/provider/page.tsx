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
                  {user?.name || 'Dealership / Fleet Hub'}
                </h1>
                <Badge variant="brand" size="sm">
                  Provider
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                Manage your vehicle fleet inventory, customer reservations, and revenue.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/provider/profile">
              <Button variant="outline" size="sm" leftIcon={<Settings className="w-3.5 h-3.5" />}>
                Business Profile
              </Button>
            </Link>
            <Link href="/provider/cars/create">
              <Button variant="dark" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Vehicle
              </Button>
            </Link>
          </div>
        </div>

        {/* Financial & Fleet Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {formatPrice(data?.stats?.totalRevenue ?? 0)}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600">Combined rental + sales</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Fleet</span>
              <Car className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.activeListings ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">
              {data?.stats?.totalCars ?? 0} total vehicles registered
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
              <CalendarCheck className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.totalBookings ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">Customer reservations</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Direct Sales</span>
              <TrendingUp className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.stats?.totalOrders ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">Completed car purchases</span>
          </div>
        </div>

        {/* Recent Inquiries & Bookings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-black">Incoming Rental Bookings</h2>
              <p className="text-xs text-zinc-500">Real-time reservations and customer handover schedules.</p>
            </div>
            <span className="text-xs font-bold text-zinc-400">Showing latest requests</span>
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
                      Renter: <span className="font-semibold text-zinc-800">{b.userId?.name || 'Customer'}</span> ({b.userId?.email || 'N/A'})
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Dates: {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-black">{formatPrice(b.totalAmount)}</span>
                    <Badge variant={b.status === 'confirmed' ? 'dark' : 'slate'} size="sm">
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400 space-y-3">
              <Car className="w-10 h-10 mx-auto text-zinc-300" />
              <p className="text-xs font-medium">No incoming bookings yet. Add more vehicles to attract customers!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
