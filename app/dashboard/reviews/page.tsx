'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { reviewService } from '@/services/review.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Star, MessageSquare, ShieldCheck } from 'lucide-react';

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reviewService
      .getUserReviews()
      .then((res) => {
        setReviews(res || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-black">My Reviews & Ratings</h1>
            <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
              {reviews.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Ratings and feedback you have submitted for past vehicle rentals and purchases.
          </p>
        </div>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={r.carId?.coverImage || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=400&q=80'}
                    alt="Car"
                    className="w-12 h-10 object-cover rounded-xl border border-zinc-200"
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-black">{r.carId?.title || 'Vehicle'}</h3>
                    <p className="text-[11px] text-zinc-400">
                      Reviewed on {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < r.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed italic">
                "{r.comment}"
              </p>

              <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Renter Review</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
