'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { adminService, AdminStatsData, TimeSeriesPoint } from '@/services/admin.service';
import { formatPrice } from '@/lib/utils';
import {
  Users,
  Car,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
  DollarSign,
  ChevronRight,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly'>('daily');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'users' | 'cars' | 'inquiries'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    adminService
      .getStats()
      .then((res) => setData(res))
      .catch((err) => console.error('Failed to load admin stats:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const timeSeriesData: TimeSeriesPoint[] = useMemo(() => {
    if (!data?.analytics) return [];
    return timeframe === 'daily'
      ? data.analytics.daily || []
      : data.analytics.monthly || [];
  }, [data, timeframe]);

  // Max value calculation for proportional chart rendering
  const maxChartValue = useMemo(() => {
    if (!timeSeriesData.length) return 10;
    const max = Math.max(
      ...timeSeriesData.map((d) => {
        if (selectedMetric === 'users') return d.users;
        if (selectedMetric === 'cars') return d.cars;
        if (selectedMetric === 'inquiries') return d.inquiries;
        return Math.max(d.users, d.cars, d.inquiries, 1);
      })
    );
    return max > 0 ? max : 5;
  }, [timeSeriesData, selectedMetric]);

  const metrics = data?.metrics || {
    totalRevenue: 0,
    grossFleetValue: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalCars: 0,
    activeFleet: 0,
    totalRentals: 0,
    totalSales: 0,
    totalInquiries: 0,
    completedPaymentsCount: 0,
  };

  const topBrands = data?.analytics?.topBrands || [];
  const listingBreakdown = data?.analytics?.listingBreakdown || {
    rent: metrics.totalRentals,
    sale: metrics.totalSales,
  };

  const totalListingsCount = listingBreakdown.rent + listingBreakdown.sale || 1;
  const rentPercent = Math.round((listingBreakdown.rent / totalListingsCount) * 100);
  const salePercent = Math.round((listingBreakdown.sale / totalListingsCount) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Executive Analytics & Fleet Control
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Holistic performance metrics, customer leads, revenue telemetry, and inventory management.
          </p>
        </div>

        {/* Quick Launcher Pills */}
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <Link
            href="/admin/cars"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-lg shadow-orange-600/25"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </Link>

          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Buyer Inquiries</span>
          </Link>
        </div>
      </div>

      {/* 5-METRIC EXECUTIVE KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {/* Metric 1: Total Revenue */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              Platform Gross Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {formatPrice(metrics.totalRevenue)}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">{metrics.completedPaymentsCount}</span> paid transactions
            </p>
          </div>
        </div>

        {/* Metric 2: Gross Fleet Asset Valuation */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              Fleet Valuation (AUM)
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {formatPrice(metrics.grossFleetValue)}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
              <span className="text-orange-400 font-bold">{metrics.totalCars}</span> total inventory assets
            </p>
          </div>
        </div>

        {/* Metric 3: Active Fleet Vehicles */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              Active Fleet Units
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {metrics.activeFleet}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
              <span className="text-blue-400 font-bold">{metrics.totalRentals}</span> rentals •{' '}
              <span className="text-indigo-400 font-bold">{metrics.totalSales}</span> for sale
            </p>
          </div>
        </div>

        {/* Metric 4: Platform Users */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              Platform Accounts
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {metrics.totalUsers}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
              <span className="text-teal-400 font-bold">{metrics.totalAdmins}</span> administrators
            </p>
          </div>
        </div>

        {/* Metric 5: Inquiries & Leads */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              Customer Leads
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {metrics.totalInquiries}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
              Direct vehicle buyer inquiries
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE TIME-SERIES ANALYTICS CHART */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <h2 className="text-base sm:text-lg font-black text-white">
                Platform Activity & Growth Telemetry
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Continuous multi-metric activity timeline of user signups, fleet ingestion, and lead inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Filter Tabs */}
            <div className="flex items-center p-1 bg-zinc-950 rounded-2xl border border-zinc-800">
              {[
                { id: 'all', label: 'All' },
                { id: 'users', label: 'Users' },
                { id: 'cars', label: 'Cars' },
                { id: 'inquiries', label: 'Leads' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMetric(m.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedMetric === m.id
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Timeframe Switcher */}
            <div className="flex items-center p-1 bg-zinc-950 rounded-2xl border border-zinc-800">
              <button
                onClick={() => setTimeframe('daily')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  timeframe === 'daily'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  timeframe === 'monthly'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                6 Months
              </button>
            </div>
          </div>
        </div>

        {/* Visual Multi-Bar Chart */}
        <div className="pt-6 pb-2">
          {timeSeriesData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs font-bold text-zinc-400">
              No historical data available for this timeframe.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-zinc-800/80 relative">
                {timeSeriesData.map((point, idx) => {
                  const userHeight = Math.max(Math.round((point.users / maxChartValue) * 100), 4);
                  const carHeight = Math.max(Math.round((point.cars / maxChartValue) * 100), 4);
                  const inqHeight = Math.max(Math.round((point.inquiries / maxChartValue) * 100), 4);

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Tooltip Card on Hover */}
                      {hoveredIndex === idx && (
                        <div className="absolute bottom-full mb-3 z-30 bg-zinc-950 border border-zinc-700 text-white text-[11px] p-3 rounded-2xl shadow-2xl min-w-[130px] pointer-events-none">
                          <p className="font-black text-orange-400 border-b border-zinc-800 pb-1 mb-1.5">
                            {point.label}
                          </p>
                          <div className="space-y-1 font-semibold">
                            <p className="flex items-center justify-between text-teal-400">
                              <span>Users:</span> <span>+{point.users}</span>
                            </p>
                            <p className="flex items-center justify-between text-orange-400">
                              <span>Cars:</span> <span>+{point.cars}</span>
                            </p>
                            <p className="flex items-center justify-between text-cyan-400">
                              <span>Leads:</span> <span>+{point.inquiries}</span>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bar Group */}
                      <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full pb-1">
                        {(selectedMetric === 'all' || selectedMetric === 'users') && (
                          <div
                            style={{ height: `${userHeight}%` }}
                            className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-teal-400 opacity-90 group-hover:opacity-100 transition-all"
                          />
                        )}
                        {(selectedMetric === 'all' || selectedMetric === 'cars') && (
                          <div
                            style={{ height: `${carHeight}%` }}
                            className="w-full rounded-t-md bg-gradient-to-t from-orange-600 to-amber-400 opacity-90 group-hover:opacity-100 transition-all"
                          />
                        )}
                        {(selectedMetric === 'all' || selectedMetric === 'inquiries') && (
                          <div
                            style={{ height: `${inqHeight}%` }}
                            className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-sky-400 opacity-90 group-hover:opacity-100 transition-all"
                          />
                        )}
                      </div>

                      {/* X-Axis Date Label */}
                      <span className="text-[10px] font-bold text-zinc-400 mt-2 truncate max-w-full">
                        {point.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-teal-400" />
                  <span>User Registrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-orange-500" />
                  <span>Fleet Listings Added</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-cyan-400" />
                  <span>Buyer Inquiries</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2-COLUMN DISTRIBUTION & MARKET INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 1: Fleet Distribution (Rent vs Sale) */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-zinc-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-white">Fleet Business Model Split</h2>
              <p className="text-xs text-zinc-400">Inventory proportion for car rentals vs outright sales</p>
            </div>
            <Link
              href="/admin/cars"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Visual Ratio Bar */}
            <div className="h-4 rounded-full bg-zinc-950 overflow-hidden flex p-0.5 border border-zinc-800">
              <div
                style={{ width: `${rentPercent}%` }}
                className="h-full rounded-l-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-500"
              />
              <div
                style={{ width: `${salePercent}%` }}
                className="h-full rounded-r-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span className="text-xs font-bold text-zinc-400">Rental Fleet</span>
                </div>
                <p className="text-xl font-black text-white mt-1.5">{metrics.totalRentals}</p>
                <p className="text-[10px] text-zinc-400 font-semibold">{rentPercent}% of all inventory</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-zinc-400">Direct Sales</span>
                </div>
                <p className="text-xl font-black text-white mt-1.5">{metrics.totalSales}</p>
                <p className="text-[10px] text-zinc-400 font-semibold">{salePercent}% of all inventory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Top Brands Breakdown */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-zinc-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-white">Top Inventory Makes</h2>
              <p className="text-xs text-zinc-400">Top car manufacturers represented in active fleet</p>
            </div>
            <Link
              href="/admin/cars"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topBrands.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No brand data available yet.</p>
            ) : (
              topBrands.map((b, i) => (
                <div key={b.brand} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-200">
                      {i + 1}. {b.brand}
                    </span>
                    <span className="text-zinc-400 font-mono text-[11px]">
                      {b.count} cars ({b.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                    <div
                      style={{ width: `${Math.max(b.percentage, 4)}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 2-COLUMN LIVE ACTIVITY FEEDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feed 1: Recent Car Inquiries */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-black text-white">Recent Buyer Inquiries</h2>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(!data?.recentInquiries || data.recentInquiries.length === 0) ? (
              <p className="text-xs text-zinc-400 py-4 text-center">No customer inquiries yet.</p>
            ) : (
              data.recentInquiries.map((inq: any) => (
                <div
                  key={inq._id}
                  className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {inq.senderName} ({inq.senderPhone || inq.senderEmail})
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      Re: {inq.carId?.title || 'Vehicle Listing'} • &ldquo;{inq.message?.slice(0, 40)}...&rdquo;
                    </p>
                  </div>
                  <Link
                    href="/admin/inquiries"
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Feed 2: Recent Registered Users */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h2 className="text-base font-black text-white">Recent User Signups</h2>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(!data?.recentUsers || data.recentUsers.length === 0) ? (
              <p className="text-xs text-zinc-400 py-4 text-center">No user accounts found.</p>
            ) : (
              data.recentUsers.map((u: any) => (
                <div
                  key={u._id}
                  className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{u.name || 'User'}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{u.email}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      u.role === 'admin'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
