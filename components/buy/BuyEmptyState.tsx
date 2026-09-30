import React from 'react';
import Link from 'next/link';
import { ShoppingBag, RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BuyEmptyStateProps {
  activeFiltersCount: number;
  onResetFilters: () => void;
}

export function BuyEmptyState({ activeFiltersCount, onResetFilters }: BuyEmptyStateProps) {
  return (
    <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm animate-fade-in">
      <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto" />
      <h3 className="text-lg font-black text-black">আপনার চাহিদা অনুযায়ী বিক্রয়ের জন্য কোনো গাড়ি পাওয়া যায়নি</h3>
      <p className="text-xs text-zinc-500 max-w-sm mx-auto">
        আরও গাড়ি খুঁজে পেতে মডেলের নাম, দামের সীমা অথবা তৈরির সালের ফিল্টার পরিবর্তন করে দেখুন।
      </p>
      <div className="flex justify-center gap-3 pt-2">
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            সব ফিল্টার রিসেট করুন
          </Button>
        )}
        <Link href="/sell">
          <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            বিক্রির জন্য গাড়ি যুক্ত করুন
          </Button>
        </Link>
      </div>
    </div>
  );
}
