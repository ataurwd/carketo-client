'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ICar } from '@/types/car.types';
import { carService } from '@/services/car.service';
import { providerService } from '@/services/provider.service';
import { CarCard } from '@/components/common/CarCard';
import { CarCardSkeleton } from '@/components/common/CarCardSkeleton';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/auth.store';
import { showToast } from '@/lib/alert';
import { RAW_CARS, FALLBACK_20_CARS } from '@/lib/fallbackCars';
import {
  ShieldCheck,
  Phone,
  MessageCircle,
  Copy,
  Check,
  MapPin,
  Car as CarIcon,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Share2,
  Lock,
  ArrowUpRight,
} from 'lucide-react';

interface DealerProfileClientProps {
  dealerId: string;
}

const ITEMS_PER_PAGE = 12;

export default function DealerProfileClient({ dealerId }: DealerProfileClientProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [profileLoading, setProfileLoading] = useState(true);
  const [carsLoading, setCarsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [cars, setCars] = useState<ICar[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'sale' | 'rent'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'price_asc' | 'price_desc'>('latest');
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  });

  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  // Fetch Public Profile Data
  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setProfileLoading(true);
      try {
        const res = await providerService.getPublicProfile(dealerId);
        if (isMounted && res) {
          setProfileData(res);
        } else if (isMounted) {
          // If API didn't find profile (e.g. mock or demo ID), fallback gracefully
          const matchedFallback = [...RAW_CARS, ...FALLBACK_20_CARS].find(
            (c: any) =>
              c.providerId === dealerId ||
              c.provider?.id === dealerId ||
              c.providerId?._id === dealerId
          );
          if (matchedFallback) {
            setProfileData({
              user: {
                _id: dealerId,
                name:
                  (matchedFallback as any).providerId?.name ||
                  matchedFallback.provider?.name ||
                  'ভেরিফাইড অটো ডিলার',
                avatar:
                  (matchedFallback as any).providerId?.avatar ||
                  matchedFallback.provider?.avatar ||
                  '',
                phone: matchedFallback.contactPhone || '+880 1712-345678',
                role: 'provider',
                createdAt: matchedFallback.createdAt || new Date().toISOString(),
              },
              provider: {
                businessName:
                  matchedFallback.provider?.name || 'ক্যারকেটো প্রিমিয়াম হাব',
                isVerified: true,
                rating: matchedFallback.rating || 4.9,
                totalReviews: matchedFallback.totalReviews || 12,
              },
              stats: {
                totalCars: 1,
                forSaleCount: matchedFallback.listingType === 'rent' ? 0 : 1,
                forRentCount: matchedFallback.listingType === 'sale' ? 0 : 1,
              },
            });
          }
        }
      } catch (err) {
        console.error('Error fetching dealer profile:', err);
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [dealerId]);

  // Fetch Cars for this Provider/Dealer with 12 items per page pagination
  const loadCars = useCallback(async () => {
    setCarsLoading(true);
    try {
      const targetUserId = profileData?.user?._id || dealerId;
      const params: Record<string, any> = {
        providerId: targetUserId,
        page,
        limit: ITEMS_PER_PAGE,
        sort: sortBy,
      };

      if (selectedTab !== 'all') {
        params.listingType = selectedTab;
      }

      const res = await carService.getCarsWithPagination(params);

      if (res && res.cars && res.cars.length > 0) {
        setCars(res.cars);
        setPagination({
          total: res.pagination.total,
          page: res.pagination.page,
          limit: ITEMS_PER_PAGE,
          totalPages: res.pagination.totalPages,
        });
      } else {
        // Fallback: check fallback mock cars if running locally or demo data
        const localMatches = [...RAW_CARS, ...FALLBACK_20_CARS].filter((c: any) => {
          const cPid =
            typeof c.providerId === 'object' && c.providerId !== null
              ? c.providerId._id || c.providerId.id
              : c.providerId || c.provider?.id;
          const matchId = String(cPid) === String(targetUserId) || String(cPid) === String(dealerId);
          if (!matchId) return false;
          if (selectedTab === 'sale') return c.listingType === 'sale' || c.listingType === 'both';
          if (selectedTab === 'rent') return c.listingType === 'rent' || c.listingType === 'both';
          return true;
        });

        // Apply sort to local matches
        if (sortBy === 'price_asc') {
          localMatches.sort((a: any, b: any) => (a.price || a.salePrice || 0) - (b.price || b.salePrice || 0));
        } else if (sortBy === 'price_desc') {
          localMatches.sort((a: any, b: any) => (b.price || b.salePrice || 0) - (a.price || a.salePrice || 0));
        }

        const total = localMatches.length;
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
        const sliced = localMatches.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

        setCars(sliced as ICar[]);
        setPagination({
          total,
          page,
          limit: ITEMS_PER_PAGE,
          totalPages,
        });
      }
    } catch (err) {
      console.error('Error fetching dealer cars:', err);
      setCars([]);
      setPagination({ total: 0, page: 1, limit: ITEMS_PER_PAGE, totalPages: 1 });
    } finally {
      setCarsLoading(false);
    }
  }, [profileData?.user?._id, dealerId, selectedTab, page, sortBy]);

  const handleTabChange = (tab: 'all' | 'sale' | 'rent') => {
    setSelectedTab(tab);
    setPage(1);
  };

  const handleSortChange = (newSort: 'latest' | 'price_asc' | 'price_desc') => {
    setSortBy(newSort);
    setPage(1);
  };

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  // Seller Details
  const sellerName =
    profileData?.provider?.businessName ||
    profileData?.user?.name ||
    'বিজ্ঞাপনদাতা / গাড়ির বিক্রেতা';

  const sellerAvatar =
    profileData?.user?.avatar || profileData?.provider?.avatar || '';

  const isVerified =
    profileData?.provider?.isVerified ||
    profileData?.user?.role === 'admin' ||
    profileData?.user?.role === 'provider';

  const rawPhone =
    profileData?.provider?.phone ||
    profileData?.user?.phone ||
    cars[0]?.contactPhone ||
    '+880 1700-000000';

  const maskedPhone = rawPhone.length > 6
    ? rawPhone.slice(0, 4) + ' ••• ••• ' + rawPhone.slice(-2)
    : '০১৭•••••••';

  const memberSince = profileData?.user?.createdAt
    ? new Date(profileData.user.createdAt).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
      })
    : 'ক্যারকেটো নিবন্ধিত মেম্বার';

  const handlePhoneClick = () => {
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    setIsPhoneRevealed(true);
    navigator.clipboard?.writeText(rawPhone);
    setIsCopied(true);
    showToast('ফোন নম্বর কপি করা হয়েছে!', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      showToast('প্রোফাইল লিংক কপি করা হয়েছে!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20 text-zinc-900">
      {/* 1. BREADCRUMB & TOP NAV */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-semibold">
            <Link href="/" className="hover:text-black transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <Link href="/cars" className="hover:text-black transition-colors">
              গাড়িসমূহ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-black font-bold truncate max-w-[200px] sm:max-w-none">
              {sellerName}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 hover:border-black text-xs font-bold text-zinc-700 hover:text-black transition-all shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>শেয়ার করুন</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* 2. SELLER HEADER PROFILE BANNER */}
        <div className="rounded-3xl bg-white border border-zinc-200 shadow-card p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Avatar & Info */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative shrink-0">
                {sellerAvatar ? (
                  <img
                    src={sellerAvatar}
                    alt={sellerName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-zinc-200 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-black text-white flex items-center justify-center text-3xl font-black shadow-md border-2 border-zinc-800">
                    {sellerName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </span>
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight">
                    {sellerName}
                  </h1>
                  {isVerified && (
                    <Badge variant="dark" size="sm" className="gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ভেরিফাইড বিক্রেতা</span>
                    </Badge>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-zinc-500 font-medium flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-zinc-700">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>মেম্বার হয়েছেন: {memberSince}</span>
                  </span>
                  {profileData?.provider?.address?.city && (
                    <span className="flex items-center gap-1 text-zinc-700">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <span>{profileData.provider.address.city}</span>
                    </span>
                  )}
                </p>

                <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
                  ক্যারকেটো প্ল্যাটফর্মের যাচাইকৃত লিস্টিং। সকল গাড়ির কাগজপত্র, রানিং কন্ডিশন ও সরাসরি মালিকের তথ্য যাচাই করে দেখুন।
                </p>
              </div>
            </div>

            {/* Quick Contact Box on Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 bg-zinc-50 p-3 sm:p-4 rounded-2xl border border-zinc-200">
              <button
                type="button"
                onClick={handlePhoneClick}
                className="flex items-center justify-between sm:justify-start gap-3 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 hover:border-black transition-all group shadow-sm text-left cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-black">
                    {isPhoneRevealed ? rawPhone : maskedPhone}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-semibold">
                    {isPhoneRevealed ? 'কপি করতে ক্লিক করুন' : 'নম্বর দেখতে ক্লিক করুন'}
                  </p>
                </div>
                <div className="p-1 rounded-md bg-zinc-100 group-hover:bg-black group-hover:text-white transition-colors text-zinc-600 ml-1">
                  <Copy className="w-3 h-3" />
                </div>
              </button>

              {isPhoneRevealed && (
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${rawPhone}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কল</span>
                  </a>
                  <a
                    href={`https://wa.me/${rawPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>হোয়াটসঅ্যাপ</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 mt-6 border-t border-zinc-100">
            <div className="text-center p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="block text-xl sm:text-3xl font-black text-black">
                {profileData?.stats?.totalCars ?? pagination.total}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">
                মোট গাড়ি
              </span>
            </div>

            <div className="text-center p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="block text-xl sm:text-3xl font-black text-black">
                {profileData?.stats?.forSaleCount ?? 0}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">
                বিক্রয়ের গাড়ি
              </span>
            </div>

            <div className="text-center p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="block text-xl sm:text-3xl font-black text-black">
                {profileData?.stats?.forRentCount ?? 0}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">
                ভাড়ার গাড়ি
              </span>
            </div>
          </div>
        </div>

        {/* 3. INVENTORY SECTION HEADER & FILTER CONTROLS */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2
                id="dealer-inventory-heading"
                className="text-xl sm:text-2xl font-black text-black flex flex-wrap items-center gap-2"
              >
                <CarIcon className="w-6 h-6 text-black" />
                <span>এই বিক্রেতার গাড়িসমূহ</span>
                <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
                  {pagination.total > 0 ? `${pagination.total} টি গাড়ি` : `${cars.length} টি গাড়ি`}
                </span>
                {pagination.totalPages > 1 && (
                  <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">
                    (পৃষ্ঠা {page} / {pagination.totalPages})
                  </span>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                বিজ্ঞাপনদাতা কর্তৃক আপলোডকৃত সকল ভাড়ার ও বিক্রয়ের গাড়ির তালিকা (প্রতি পেজে ১২ টি করে গাড়ি)।
              </p>
            </div>

            {/* Filter Tabs & Sort */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Type Tabs */}
              <div className="flex items-center p-1 rounded-2xl bg-zinc-200/70 border border-zinc-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleTabChange('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedTab === 'all'
                      ? 'bg-white text-black shadow-sm font-black'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  সবগুলো ({profileData?.stats?.totalCars ?? pagination.total})
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('sale')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedTab === 'sale'
                      ? 'bg-white text-black shadow-sm font-black'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  বিক্রয়
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('rent')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedTab === 'rent'
                      ? 'bg-white text-black shadow-sm font-black'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  ভাড়া
                </button>
              </div>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as any)}
                aria-label="গাড়ি সাজানোর ক্রম"
                className="px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-800 hover:border-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-sm"
              >
                <option value="latest">সর্বশেষ পোস্ট</option>
                <option value="price_asc">দাম: কম থেকে বেশি</option>
                <option value="price_desc">দাম: বেশি থেকে কম</option>
              </select>
            </div>
          </div>

          {/* 4. CARS GRID */}
          {carsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>

              {/* PAGINATION: Active when total cars > 12 */}
              {pagination.totalPages > 1 && (
                <div className="pt-6 border-t border-zinc-200">
                  <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    limit={ITEMS_PER_PAGE}
                    onPageChange={(newPage) => {
                      setPage(newPage);
                      const el = document.getElementById('dealer-inventory-heading');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }
                    }}
                    itemLabel="টি গাড়ি"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-zinc-200 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto border border-zinc-200">
                <CarIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-black">
                  এই ক্যাটাগরিতে বর্তমানে কোনো গাড়ি পাওয়া যায়নি
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                  এই বিক্রেতা এখনও এই বিভাগে গাড়ি লিস্টিং করেননি অথবা বিজ্ঞাপন শেষ হয়ে গেছে।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTab('all')}
                  className="text-xs font-bold"
                >
                  সব গাড়ি দেখুন
                </Button>
                <Link href="/cars">
                  <Button variant="dark" size="sm" className="text-xs font-bold">
                    অন্যান্য সকল গাড়ি ব্রাউজ করুন
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 5. BUYER SAFETY & VERIFICATION GUIDANCE */}
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-950">
                ক্যারকেটো নিরাপদ লেনদেন নির্দেশিকা
              </h4>
              <p className="text-xs text-amber-900/80 leading-relaxed mt-0.5">
                গাড়ি কেনার বা ভাড়া নেওয়ার পূর্বে সরাসরি দেখা করে সমস্ত ডকুমেন্ট ও ফিটনেস যাচাই করুন। অগ্রিম টাকা পাঠানো থেকে বিরত থাকুন।
              </p>
            </div>
          </div>

          <Link href="/faq" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold border-amber-300 hover:bg-amber-100"
            >
              নিরাপত্তা নিয়মাবলী
            </Button>
          </Link>
        </div>
      </div>

      {/* LOGIN REQUIRED MODAL PROMPT */}
      {loginPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-zinc-200 shadow-2xl text-center space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-zinc-100 text-black flex items-center justify-center mx-auto border border-zinc-200 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-black">
                ফোন নম্বর দেখতে লগ ইন করুন
              </h3>
              <p className="text-xs text-zinc-500">
                বিজ্ঞাপনদাতাদের স্প্যাম থেকে সুরক্ষিত রাখতে যোগাযোগের তথ্য দেখার জন্য অনুগ্রহ করে সাইন ইন বা ফ্রি অ্যাকাউন্ট তৈরি করুন।
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="dark"
                size="md"
                onClick={() => router.push(`/login?redirect=/dealers/${dealerId}`)}
                className="w-full font-bold shadow-md hover:bg-black"
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                লগ ইন করুন
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => router.push(`/register?redirect=/dealers/${dealerId}`)}
                className="w-full font-bold"
              >
                ফ্রি অ্যাকাউন্ট খুলুন
              </Button>

              <button
                type="button"
                onClick={() => setLoginPromptOpen(false)}
                className="text-xs font-semibold text-zinc-400 hover:text-black transition-colors pt-2 block mx-auto cursor-pointer"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
