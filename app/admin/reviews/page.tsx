'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Star,
  Trash2,
  ExternalLink,
  Car,
  ShieldCheck,
  Search,
  MessageSquare,
} from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService
      .getReviewsAdmin()
      .then((res) => {
        setReviews(res || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to permanently delete this customer review?')) return;
    try {
      await adminService.deleteReviewAdmin(reviewId);
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch {
      setReviews(reviews.filter((r) => r._id !== reviewId));
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-black">Reviews & Reputation</h1>
            <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
              {reviews.length} Reviews
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Moderate user feedback, star ratings, and maintain verified marketplace reputation standards.
          </p>
        </div>

            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-zinc-200 shadow-sm text-xs font-bold">
              {['all', '5', '4', '3', '2', '1'].map((rt) => (
                <button
                  key={rt}
                  onClick={() => setRatingFilter(rt)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    ratingFilter === rt ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  {rt === 'all' ? 'All Stars' : `${rt} ★`}
                </button>
              ))}
            </div>
          </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-zinc-500">Loading reviews moderation queue...</p>
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center font-black text-sm">
                        {rev.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-extrabold text-black text-sm">{rev.userId?.name || 'Customer'}</p>
                        <p className="text-[11px] text-zinc-400">{rev.userId?.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl text-amber-900 border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black">{rev.rating}.0</span>
                    </div>
                  </div>

                  {rev.carId && (
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                      <img
                        src={rev.carId.coverImage}
                        alt={rev.carId.title}
                        className="w-10 h-8 object-cover rounded-lg border border-zinc-200"
                      />
                      <p className="text-xs font-bold text-black truncate">{rev.carId.title}</p>
                    </div>
                  )}

                  <p className="text-xs text-zinc-700 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs">
                  <span className="text-[11px] text-zinc-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Review</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <Star className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Reviews Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No customer reviews match your selected filter criteria.
            </p>
          </div>
        )}
    </div>
  );
}
