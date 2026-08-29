'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit = 12,
  onPageChange,
  className = '',
}) => {
  if (totalItems <= limit || totalPages <= 1) {
    return null;
  }

  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-zinc-200 ${className}`}
    >
      <p className="text-xs font-bold text-zinc-500 order-2 sm:order-1">
        Showing <span className="text-black font-black">{from}</span> to{' '}
        <span className="text-black font-black">{to}</span> of{' '}
        <span className="text-black font-black">{totalItems}</span> vehicles
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
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-black disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Number Pills */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs font-bold text-zinc-400 select-none"
                >
                  •••
                </span>
              );
            }

            const pageNumber = p as number;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`h-9 w-9 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-black text-white shadow-md scale-105'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-black hover:border-zinc-300 shadow-sm'
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
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-black disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
