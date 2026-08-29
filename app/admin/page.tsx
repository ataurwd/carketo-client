'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { adminService, AdminStatsData, TimeSeriesPoint } from '@/services/admin.service';
import { formatPrice } from '@/lib/utils';
import {
  Users,
  Car,
  MessageSquare,
  Star,
  TrendingUp,
  ArrowUpRight,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Tag,
  Eye,
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
    totalUsers: 0,
    totalAdmins: 0,
    totalCars: 0,
    activeFleet: 0,
    totalRentals: 0,
    totalSales: 0,
    totalInquiries: 0,
    totalReviews: 0,
    totalRevenue: 0,
    grossFleetValue: 0,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              Website Analytics & Activity
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live DB Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real-time track of user registrations, car listing posts, customer inquiries, and fleet inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/provider/cars/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>List New Car</span>
          </Link>
        </div>
      </div>

      {/* 1. TOP 4 CORE WEBSITE STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Registered Accounts */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              User Accounts
            </span>
            <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {metrics.totalUsers + metrics.totalAdmins}
            </p>
            <p className="text-[11px] text-zinc-500 font-semibold mt-1">
              {metrics.totalUsers} Standard Users • {metrics.totalAdmins} Admins
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-medium">Growth status:</span>
            <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Active
            </span>
          </div>
        </div>

        {/* Card 2: Vehicle Listings (Posts) */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Total Cars Posted
            </span>
            <div className="h-9 w-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Car className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {metrics.totalCars}
            </p>
            <p className="text-[11px] text-zinc-500 font-semibold mt-1">
              {metrics.totalRentals} For Rent • {metrics.totalSales} For Sale
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-medium">Published live:</span>
            <span className="font-bold text-black">{metrics.activeFleet} Active</span>
          </div>
        </div>

        {/* Card 3: Inquiries Received */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Customer Inquiries
            </span>
            <div className="h-9 w-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {metrics.totalInquiries}
            </p>
            <p className="text-[11px] text-zinc-500 font-semibold mt-1">
              Direct seller & rental inquiries
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-medium">Lead inquiries:</span>
            <Link
              href="/admin/inquiries"
              className="font-bold text-purple-600 hover:underline inline-flex items-center gap-1"
            >
              <span>View inbox</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Reviews & Ratings */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Vehicle Reviews
            </span>
            <div className="h-9 w-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Star className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {metrics.totalReviews}
            </p>
            <p className="text-[11px] text-zinc-500 font-semibold mt-1">
              Verified community feedbacks
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-medium">Moderation:</span>
            <Link
              href="/admin/reviews"
              className="font-bold text-amber-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Manage reviews</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE TIMELINE ANALYTICS CHART */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" />
              <h2 className="text-base font-black text-black">
                {timeframe === 'daily' ? 'Daily Growth & Traffic Analytics (Last 7 Days)' : 'Monthly Growth & Traffic Analytics (Last 6 Months)'}
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Volume breakdown for user registrations, vehicle listings, and customer inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Timeframe Switcher */}
            <div className="flex items-center p-1 bg-zinc-100 rounded-2xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setTimeframe('daily')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === 'daily'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                Day-wise (7D)
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === 'monthly'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                Month-wise (6M)
              </button>
            </div>

            {/* Metric Filter */}
            <div className="flex items-center p-1 bg-zinc-100 rounded-2xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setSelectedMetric('all')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  selectedMetric === 'all'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                All Metrics
              </button>
              <button
                type="button"
                onClick={() => setSelectedMetric('users')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  selectedMetric === 'users'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-emerald-700'
                }`}
              >
                Users
              </button>
              <button
                type="button"
                onClick={() => setSelectedMetric('cars')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  selectedMetric === 'cars'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-blue-700'
                }`}
              >
                Cars
              </button>
              <button
                type="button"
                onClick={() => setSelectedMetric('inquiries')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  selectedMetric === 'inquiries'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-purple-700'
                }`}
              >
                Inquiries
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-bold">
          {(selectedMetric === 'all' || selectedMetric === 'users') && (
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span className="text-zinc-700">New User Signups</span>
            </div>
          )}
          {(selectedMetric === 'all' || selectedMetric === 'cars') && (
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500 ring-2 ring-blue-200" />
              <span className="text-zinc-700">Car Listings Posted</span>
            </div>
          )}
          {(selectedMetric === 'all' || selectedMetric === 'inquiries') && (
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-purple-500 ring-2 ring-purple-200" />
              <span className="text-zinc-700">Inquiries Received</span>
            </div>
          )}
        </div>

        {/* Visual Chart Bars Container */}
        <div className="pt-4 pb-2">
          {timeSeriesData.length > 0 ? (
            <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-4 items-end h-64 sm:h-72 border-b border-zinc-100 pb-4 px-2">
              {timeSeriesData.map((point, index) => {
                const userH = Math.max(Math.round((point.users / maxChartValue) * 100), point.users > 0 ? 8 : 2);
                const carH = Math.max(Math.round((point.cars / maxChartValue) * 100), point.cars > 0 ? 8 : 2);
                const inqH = Math.max(Math.round((point.inquiries / maxChartValue) * 100), point.inquiries > 0 ? 8 : 2);
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={point.date || point.month || index}
                    className="flex flex-col items-center justify-end h-full group relative cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Hover Tooltip Popup */}
                    {isHovered && (
                      <div className="absolute -top-20 z-30 bg-zinc-900 text-white px-3 py-2 rounded-2xl shadow-xl border border-zinc-700 text-center pointer-events-none min-w-[120px] animate-fade-in">
                        <p className="text-[10px] font-bold text-zinc-400 mb-1">{point.label}</p>
                        <div className="space-y-0.5 text-[11px] font-black text-left">
                          <p className="text-emerald-400">👤 {point.users} Users</p>
                          <p className="text-blue-400">🚘 {point.cars} Cars</p>
                          <p className="text-purple-400">💬 {point.inquiries} Inquiries</p>
                        </div>
                      </div>
                    )}

                    {/* Bar Cluster */}
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full px-1">
                      {(selectedMetric === 'all' || selectedMetric === 'users') && (
                        <div
                          style={{ height: `${userH}%` }}
                          className={`w-full max-w-[18px] rounded-t-lg transition-all duration-300 ${
                            point.users > 0
                              ? 'bg-emerald-500 group-hover:bg-emerald-400 shadow-sm'
                              : 'bg-zinc-100'
                          }`}
                        />
                      )}
                      {(selectedMetric === 'all' || selectedMetric === 'cars') && (
                        <div
                          style={{ height: `${carH}%` }}
                          className={`w-full max-w-[18px] rounded-t-lg transition-all duration-300 ${
                            point.cars > 0
                              ? 'bg-blue-500 group-hover:bg-blue-400 shadow-sm'
                              : 'bg-zinc-100'
                          }`}
                        />
                      )}
                      {(selectedMetric === 'all' || selectedMetric === 'inquiries') && (
                        <div
                          style={{ height: `${inqH}%` }}
                          className={`w-full max-w-[18px] rounded-t-lg transition-all duration-300 ${
                            point.inquiries > 0
                              ? 'bg-purple-500 group-hover:bg-purple-400 shadow-sm'
                              : 'bg-zinc-100'
                          }`}
                        />
                      )}
                    </div>

                    {/* Axis Label */}
                    <span className="mt-3 text-[11px] font-bold text-zinc-500 group-hover:text-black transition-colors truncate">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-zinc-400 text-xs font-semibold">
              Loading platform timeline data...
            </div>
          )}
        </div>
      </div>

      {/* 3. PLATFORM INVENTORY & BRANDS DISTRIBUTION (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Inventory Breakdown by Listing Type & Top Brands */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-base font-black text-black">Inventory Distribution</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Rental fleet vs Outright sale breakdown
              </p>
            </div>
            <Link
              href="/admin/cars"
              className="text-xs font-bold text-black hover:text-zinc-600 inline-flex items-center gap-1"
            >
              <span>Manage Cars</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Progress Bar Proportion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-700">Rentals ({listingBreakdown.rent} cars • {rentPercent}%)</span>
              <span className="text-blue-700">For Sale ({listingBreakdown.sale} cars • {salePercent}%)</span>
            </div>
            <div className="h-3.5 rounded-full bg-zinc-100 overflow-hidden flex p-0.5 border border-zinc-200">
              <div
                style={{ width: `${rentPercent}%` }}
                className="bg-emerald-500 rounded-l-full h-full transition-all duration-500"
              />
              <div
                style={{ width: `${salePercent}%` }}
                className="bg-blue-500 rounded-r-full h-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Top Brands Breakdown */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Top Represented Brands
            </h4>
            <div className="space-y-2.5">
              {topBrands.length > 0 ? (
                topBrands.map((b) => (
                  <div key={b.brand} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-black text-white font-black text-[11px] flex items-center justify-center">
                        {b.brand.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-black text-black">{b.brand}</p>
                        <p className="text-[10px] text-zinc-400">{b.count} registered vehicles</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-200/70 text-zinc-800">
                      {b.percentage}% of Fleet
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400">No brand distribution yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Platform Quick Operations & Links */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="text-base font-black text-black">Administrative Shortkeys</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Fast operational access for website management
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/cars"
                className="p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition-all flex items-start gap-3 group"
              >
                <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black group-hover:text-zinc-600 transition-colors">
                    Car Fleet Registry
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Edit, feature or archive posts</p>
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition-all flex items-start gap-3 group"
              >
                <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black group-hover:text-zinc-600 transition-colors">
                    User Accounts
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Role management & ban controls</p>
                </div>
              </Link>

              <Link
                href="/admin/inquiries"
                className="p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition-all flex items-start gap-3 group"
              >
                <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black group-hover:text-zinc-600 transition-colors">
                    Leads Inbox
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Customer car direct messages</p>
                </div>
              </Link>

              <Link
                href="/admin/coupons"
                className="p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition-all flex items-start gap-3 group"
              >
                <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black group-hover:text-zinc-600 transition-colors">
                    Promo Discounts
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Create vouchers & campaigns</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black">System Status: Online</p>
                <p className="text-[10px] text-zinc-400">Database & R2 Storage healthy</p>
              </div>
            </div>
            <Link
              href="/admin/health"
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[11px] font-bold text-white transition-colors"
            >
              Diagnostics
            </Link>
          </div>
        </div>
      </div>

      {/* 4. REAL RECENT CAR LISTINGS & USER ACCOUNTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recently Posted Vehicles (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-base font-black text-black">Latest Car Listings</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Vehicles recently added to the marketplace
              </p>
            </div>
            <Link
              href="/admin/cars"
              className="inline-flex items-center gap-1 text-xs font-bold text-black hover:text-zinc-600 transition-colors"
            >
              <span>View All ({metrics.totalCars})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-100">
                <tr>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Rate / Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                {data?.recentCars && data.recentCars.length > 0 ? (
                  data.recentCars.map((car: any) => (
                    <tr key={car._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.coverImage}
                            alt={car.title}
                            className="w-12 h-8 object-cover rounded-lg border border-zinc-200 shrink-0 bg-zinc-100"
                          />
                          <div className="min-w-0">
                            <p className="font-black text-black text-xs truncate max-w-[200px]">
                              {car.title}
                            </p>
                            <p className="text-[10px] text-zinc-400">
                              {car.brand} • {car.year}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            car.listingType === 'rent'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          For {car.listingType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-black">
                        {car.listingType === 'rent'
                          ? `$${car.rentalPrice || 0}/day`
                          : formatPrice(car.salePrice || 0)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800 capitalize">
                          {car.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link
                          href={`/cars/${car.slug}`}
                          target="_blank"
                          className="inline-flex p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="Open public listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400 text-xs">
                      No car listings registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Registered Users (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-base font-black text-black">New Accounts</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Recently registered users</p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-black hover:text-zinc-600 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {data?.recentUsers && data.recentUsers.length > 0 ? (
              data.recentUsers.map((u: any) => (
                <div key={u._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shrink-0">
                      {u.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-black truncate">{u.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                      u.role === 'admin'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 py-4 text-center">No user accounts found.</p>
            )}
          </div>

          <Link href="/admin/users" className="block pt-2">
            <button className="w-full py-2.5 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-black transition-colors shadow-sm">
              Manage All Users & Roles
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
