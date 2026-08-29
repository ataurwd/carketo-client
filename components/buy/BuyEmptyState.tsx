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
      <h3 className="text-lg font-black text-black">No Cars for Sale Matching Your Criteria</h3>
      <p className="text-xs text-zinc-500 max-w-sm mx-auto">
        Try adjusting your model name, price range, or manufacturing year filters to find more vehicles.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset All Filters
          </Button>
        )}
        <Link href="/sell">
          <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            List Car for Sale
          </Button>
        </Link>
      </div>
    </div>
  );
}
