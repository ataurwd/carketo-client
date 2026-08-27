'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService, AdminStatsData } from '@/services/admin.service';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  DollarSign,
  Users,
  Building2,
  Car,
  Ticket,
  CalendarCheck,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService
      .getStats()
      .then((res) => setData(res))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-black">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">Super Admin Console</h1>
                <Badge variant="white" size="sm">
                  Executive Root
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Platform-wide control, real-time financials, dealership approvals, and moderation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/users">
              <Button variant="white" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />}>
                Users
              </Button>
            </Link>
            <Link href="/admin/providers">
              <Button variant="white" size="sm" leftIcon={<Building2 className="w-3.5 h-3.5" />}>
                Dealerships
              </Button>
            </Link>
            <Link href="/admin/coupons">
              <Button variant="white" size="sm" leftIcon={<Ticket className="w-3.5 h-3.5" />}>
                Coupons
              </Button>
            </Link>
          </div>
        </div>

        {/* Global KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Platform Volume</span>
              <DollarSign className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {formatPrice(data?.metrics?.totalRevenue ?? 0)}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600">
              {data?.metrics?.completedPaymentsCount ?? 0} settled transactions
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
              <Car className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.metrics?.activeFleet ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">
              {data?.metrics?.totalCars ?? 0} total registered
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Accounts</span>
              <Users className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.metrics?.totalUsers ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">
              {data?.metrics?.totalProviders ?? 0} fleet providers
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
              <CalendarCheck className="w-4 h-4 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-black">
              {data?.metrics?.totalBookings ?? 0}
            </p>
            <span className="text-[11px] font-semibold text-zinc-500">
              {data?.metrics?.totalOrders ?? 0} car sales
            </span>
          </div>
        </div>

        {/* 2-Column: Recent Reservations & Recent Registered Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reservations */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-base font-black text-black">Recent Platform Bookings</h3>
              <span className="text-xs font-bold text-zinc-400">Live Traffic</span>
            </div>

            <div className="divide-y divide-zinc-100">
              {data?.recentBookings?.map((b: any) => (
                <div key={b._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-black">{b.carId?.title || 'Vehicle'}</p>
                    <p className="text-[11px] text-zinc-400">
                      Renter: {b.userId?.name || 'Customer'} ({b.userId?.email || 'N/A'})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-black">{formatPrice(b.totalAmount)}</span>
                    <Badge variant={b.status === 'confirmed' ? 'brand' : 'slate'} size="sm" className="block mt-0.5">
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Accounts */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-base font-black text-black">New Account Registrations</h3>
              <Link href="/admin/users" className="text-xs font-bold text-black hover:underline">
                View All Users →
              </Link>
            </div>

            <div className="divide-y divide-zinc-100">
              {data?.recentUsers?.map((u: any) => (
                <div key={u._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-black">{u.name}</p>
                    <p className="text-[11px] text-zinc-400">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === 'provider' ? 'brand' : 'dark'} size="sm">
                      {u.role}
                    </Badge>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
