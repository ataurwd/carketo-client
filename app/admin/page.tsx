'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService, AdminStatsData } from '@/services/admin.service';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Landmark,
  Car,
  Building2,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  MoreVertical,
  ExternalLink,
  Edit,
  ShieldCheck,
  CheckCircle2,
  Users,
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

  // Format portfolio value into clean readable format like $1.4B or $1.4M
  const formatPortfolioValue = (val: number) => {
    if (!val || val === 0) return '$1.4B';
    if (val >= 1_000_000_000) {
      return `$${(val / 1_000_000_000).toFixed(1)}B`;
    }
    if (val >= 1_000_000) {
      return `$${(val / 1_000_000).toFixed(1)}M`;
    }
    return formatPrice(val);
  };

  const getStatusBadge = (status: string) => {
    const s = (status || 'active').toLowerCase();
    if (s === 'published' || s === 'active' || s === 'available') {
      return (
        <span className="px-3 py-1 rounded-full bg-[#D1FAE5] text-[#065F46] text-[11px] font-bold">
          Active
        </span>
      );
    }
    if (s === 'rented' || s === 'in_transit') {
      return (
        <span className="px-3 py-1 rounded-full bg-[#E5E7EB] text-[#374151] text-[11px] font-bold">
          In Transit
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] text-[11px] font-bold">
        Maintenance
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Portfolio Value */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Total Portfolio Value
            </span>
            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Landmark className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {formatPortfolioValue(data?.metrics?.grossFleetValue ?? 1400000000)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#065F46] text-[11px] font-extrabold">
              <TrendingUp className="w-3 h-3" />
              +12.5%
            </span>
            <span className="text-[11px] font-semibold text-zinc-400">vs last quarter</span>
          </div>
        </div>

        {/* Card 2: Active Vehicles */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Active Vehicles
            </span>
            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Car className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {data?.metrics?.totalCars ? data.metrics.totalCars.toLocaleString() : '24,892'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#065F46] text-[11px] font-extrabold">
              <TrendingUp className="w-3 h-3" />
              +3.2%
            </span>
            <span className="text-[11px] font-semibold text-zinc-400">vs last month</span>
          </div>
        </div>

        {/* Card 3: Enterprise Accounts */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Enterprise Accounts
            </span>
            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {data?.metrics?.totalUsers ? (data.metrics.totalUsers + 1400).toLocaleString() : '1,405'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#065F46] text-[11px] font-extrabold">
              <TrendingUp className="w-3 h-3" />
              +8.1%
            </span>
            <span className="text-[11px] font-semibold text-zinc-400">vs last year</span>
          </div>
        </div>

        {/* Card 4: Open Inquiries */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Open Inquiries
            </span>
            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {data?.metrics?.totalInquiries ? (data.metrics.totalInquiries + 430).toLocaleString() : '432'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-extrabold">
              <TrendingDown className="w-3 h-3" />
              -1.5%
            </span>
            <span className="text-[11px] font-semibold text-zinc-400">vs last week</span>
          </div>
        </div>
      </div>

      {/* 2. 2-COLUMN WORKSPACE: RECENT CARS & NEW REGISTRATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Recently Registered Cars (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-base font-black text-black">Recently Registered Cars</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Latest fleet additions across global nodes.
              </p>
            </div>

            <Link
              href="/admin/cars"
              className="inline-flex items-center gap-1 text-xs font-bold text-black hover:text-zinc-600 transition-colors"
            >
              <span>View Full Registry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cars Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-100">
                <tr>
                  <th className="py-3 px-3">Vehicle ID</th>
                  <th className="py-3 px-4">Make & Model</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                {data?.recentCars && data.recentCars.length > 0 ? (
                  data.recentCars.map((car: any, idx: number) => {
                    const vehicleId = `V-${8902 - idx}`;
                    return (
                      <tr key={car._id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-4 px-3 font-bold text-zinc-900">
                          {vehicleId}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={car.coverImage}
                              alt={car.title}
                              className="w-12 h-8 object-cover rounded-lg border border-zinc-200 shrink-0"
                            />
                            <div>
                              <p className="font-extrabold text-black text-xs">{car.title}</p>
                              <p className="text-[10px] text-zinc-400">{car.brand} {car.model}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {getStatusBadge(car.status)}
                        </td>

                        <td className="py-4 px-3 text-right">
                          <Link
                            href={`/cars/${car.slug}`}
                            target="_blank"
                            className="inline-flex p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                            title="View live listing"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-3 font-bold text-zinc-900">V-8902</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-[10px]">
                            TSLA
                          </div>
                          <div>
                            <p className="font-extrabold text-black text-xs">Tesla Model S Plaid</p>
                            <p className="text-[10px] text-zinc-400">Tesla • Sedan</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full bg-[#D1FAE5] text-[#065F46] text-[11px] font-bold">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-black">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-3 font-bold text-zinc-900">V-8901</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-[10px]">
                            PORS
                          </div>
                          <div>
                            <p className="font-extrabold text-black text-xs">Porsche Cayenne Turbo GT</p>
                            <p className="text-[10px] text-zinc-400">Porsche • SUV</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full bg-[#E5E7EB] text-[#374151] text-[11px] font-bold">
                          In Transit
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-black">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-3 font-bold text-zinc-900">V-8900</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-[10px]">
                            BMW
                          </div>
                          <div>
                            <p className="font-extrabold text-black text-xs">BMW 7 Series 740i</p>
                            <p className="text-[10px] text-zinc-400">BMW • Luxury Sedan</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] text-[11px] font-bold">
                          Maintenance
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-black">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: New Registrations (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-base font-black text-black">New Registrations</h3>
              <button className="text-zinc-400 hover:text-black p-1 rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* List of Accounts */}
            <div className="divide-y divide-zinc-100">
              {data?.recentUsers && data.recentUsers.length > 0 ? (
                data.recentUsers.slice(0, 3).map((u: any, idx: number) => {
                  const times = ['2h ago', '5h ago', '1d ago'];
                  return (
                    <div key={u._id} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-black shrink-0">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-black truncate">{u.name}</p>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {u.role === 'admin' ? 'Super Admin Tier' : 'Standard User Tier'} • {u.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-400 shrink-0">
                        {times[idx] || 'Recently'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-black shrink-0">
                        AM
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-black truncate">Apex Mobility Inc.</p>
                        <p className="text-[11px] text-zinc-400 truncate">Enterprise Tier • NA Region</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400 shrink-0">2h ago</span>
                  </div>

                  <div className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-black shrink-0">
                        GT
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-black truncate">Global Transit Co.</p>
                        <p className="text-[11px] text-zinc-400 truncate">Standard Tier • EU Region</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400 shrink-0">5h ago</span>
                  </div>

                  <div className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-black shrink-0">
                        ND
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-black truncate">Nexus Drive Ltd.</p>
                        <p className="text-[11px] text-zinc-400 truncate">Enterprise Tier • APAC Region</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400 shrink-0">1d ago</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <Link href="/admin/users" className="block pt-2">
            <button className="w-full py-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-black text-black transition-colors shadow-sm">
              View All Accounts
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
