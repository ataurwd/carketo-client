import React from 'react';

export const CarCardSkeleton: React.FC = () => {
  return (
    <div className="group rounded-3xl border border-zinc-200 bg-white p-4 shadow-card flex flex-col justify-between relative animate-pulse">
      <div>
        {/* Card Header & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="h-6 w-20 rounded-full bg-zinc-200" />
          <div className="h-4 w-20 rounded bg-zinc-200" />
        </div>

        {/* Car Image Placeholder */}
        <div className="relative overflow-hidden rounded-2xl bg-zinc-200 aspect-[16/10] mb-4 border border-zinc-100" />

        {/* Title */}
        <div className="h-5 bg-zinc-200 rounded-md w-4/5 mb-1.5" />

        {/* Location */}
        <div className="h-3.5 bg-zinc-200 rounded-md w-1/2 mb-3" />

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-zinc-100 mb-3">
          <div className="h-4 bg-zinc-200 rounded" />
          <div className="h-4 bg-zinc-200 rounded" />
          <div className="h-4 bg-zinc-200 rounded" />
        </div>
      </div>

      {/* Footer Actions (Price + View Details link to single page) */}
      <div className="pt-2 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-2.5 w-16 bg-zinc-200 rounded" />
          <div className="h-6 w-24 bg-zinc-200 rounded-md" />
        </div>

        {/* View Details button placeholder */}
        <div className="h-8 w-28 rounded-2xl bg-zinc-200 shrink-0" />
      </div>
    </div>
  );
};
