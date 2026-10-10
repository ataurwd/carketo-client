'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit?: number;
  onPageChange: (page: number) => void;
  className?: string;
  variant?: 'light' | 'dark';
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit = 12,
  onPageChange,
  className = '',
  variant = 'light',
  itemLabel = 'records',
}) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (totalPages <= 1) {
    return null;
  }

  // Detect admin theme dynamically: if in light mode, never show dark pagination!
  const { theme } = useAdminTheme();
  const isDark = theme === 'light' ? false : variant === 'dark';

  const from = totalItems > 0 ? (currentPage - 1) * limit + 1 : 0;
  const to = totalItems > 0 ? Math.min(currentPage * limit, totalItems) : 0;

  // Generate page numbers with Daraz-style sliding window and fast-jump ellipsis
  const getPageNumbers = (): (number | '...left' | '...right')[] => {
    if (totalPages <= 7) {
      const allPages: number[] = [];
      for (let i = 1; i <= totalPages; i++) allPages.push(i);
      return allPages;
    }

    // Near start (pages 1-4): [1, 2, 3, 4, 5, '...', totalPages] (Exact Daraz pattern)
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...right', totalPages];
    }

    // Near end (last 4 pages): [1, '...', last 5 pages]
    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...left',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // In middle: [1, '...', prev, current, next, '...', totalPages]
    return [
      1,
      '...left',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...right',
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 ${isDark ? 'border-t border-zinc-800/80 text-zinc-400' : 'border-t border-slate-200 text-slate-500'
        } ${className}`}
    >
      <p className="text-xs font-semibold order-2 sm:order-1">
        {totalItems > 0 ? (
          isAdmin ? (
            <>
              Showing <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{from}</span> to{' '}
              <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{to}</span> of{' '}
              <span className="font-black text-orange-500">{totalItems}</span> {itemLabel}
            </>
          ) : (
            <>
              মোট <span className="font-black text-orange-500">{totalItems}</span> টির মধ্যে{' '}
              <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{from}</span> থেকে{' '}
              <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{to}</span> দেখানো হচ্ছে
            </>
          )
        ) : (
          <span>পৃষ্ঠা {currentPage} / {totalPages}</span>
        )}
      </p>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Page */}
        <button
          type="button"
          onClick={() => {
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
            }
          }}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${isDark
              ? 'bg-zinc-800/90 border-zinc-700/80 text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:pointer-events-none'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:pointer-events-none'
            }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{isAdmin ? 'Previous' : 'পূর্ববর্তী'}</span>
        </button>

        {/* Number Pills & Ellipsis */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...left' || p === '...right') {
              const isLeft = p === '...left';
              const jumpTarget = isLeft
                ? Math.max(1, currentPage - 5)
                : Math.min(totalPages, currentPage + 5);

              return (
                <button
                  key={`ellipsis-${idx}-${p}`}
                  type="button"
                  title={isLeft ? 'পূর্ববর্তী ৫ পৃষ্ঠা (Jump -5)' : 'পরবর্তী ৫ পৃষ্ঠা (Jump +5)'}
                  onClick={() => onPageChange(jumpTarget)}
                  className={`h-8 min-w-[32px] px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center group ${
                    isDark
                      ? 'text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700'
                      : 'text-slate-400 hover:text-orange-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <span className="group-hover:hidden tracking-wider text-[11px] font-bold">•••</span>
                  <span className="hidden group-hover:inline text-[11px] font-black">
                    {isLeft ? '«' : '»'}
                  </span>
                </button>
              );
            }

            const pageNumber = p as number;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`h-8 w-8 rounded-xl text-xs font-black transition-all flex items-center justify-center ${isActive
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md shadow-orange-600/30 scale-105 border border-orange-400/40'
                    : isDark
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 shadow-sm'
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => {
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
            }
          }}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${isDark
              ? 'bg-zinc-800/90 border-zinc-700/80 text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:pointer-events-none'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:pointer-events-none'
            }`}
        >
          <span className="hidden sm:inline">{isAdmin ? 'Next' : 'পরবর্তী'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
