'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { inquiryService, IInquiry } from '@/services/inquiry.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  Trash2,
  MessageCircle,
  Clock,
  Car,
  ExternalLink,
} from 'lucide-react';

export default function UserInquiriesPage() {
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'replied' | 'closed'>('all');

  useEffect(() => {
    inquiryService
      .getMyInquiries()
      .then((res) => {
        setInquiries(res || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (inquiryId: string, status: 'new' | 'replied' | 'closed') => {
    try {
      await inquiryService.updateStatus(inquiryId, status);
      setInquiries(inquiries.map((inq) => (inq._id === inquiryId ? { ...inq, status } : inq)));
    } catch {
      setInquiries(inquiries.map((inq) => (inq._id === inquiryId ? { ...inq, status } : inq)));
    }
  };

  const handleDelete = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await inquiryService.deleteInquiry(inquiryId);
      setInquiries(inquiries.filter((inq) => inq._id !== inquiryId));
    } catch {
      setInquiries(inquiries.filter((inq) => inq._id !== inquiryId));
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter === 'all') return true;
    return inq.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-black">Direct Inquiries Inbox</h1>
                <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  {inquiries.length}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Messages, calls, and contact requests sent directly by prospective car buyers and renters.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-zinc-200 shadow-sm text-xs font-bold">
              {(['all', 'new', 'replied', 'closed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                    statusFilter === st ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        {isLoading ? (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-zinc-500">Loading incoming inquiries...</p>
          </div>
        ) : filteredInquiries.length > 0 ? (
          <div className="space-y-4">
            {filteredInquiries.map((inq) => (
              <div
                key={inq._id}
                className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:border-black transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                  {/* Sender Profile */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-base shrink-0">
                      {inq.senderName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-black">{inq.senderName}</h3>
                        <Badge
                          variant={
                            inq.status === 'new'
                              ? 'brand'
                              : inq.status === 'replied'
                              ? 'dark'
                              : 'slate'
                          }
                          size="sm"
                        >
                          {inq.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-zinc-700">
                          <Phone className="w-3.5 h-3.5 text-black" />
                          {inq.senderPhone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {inq.senderEmail}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <Clock className="w-3 h-3" />
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Inquired */}
                  {inq.carId && (
                    <Link
                      href={`/cars/${inq.carId.slug}`}
                      target="_blank"
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-black transition-colors max-w-sm group"
                    >
                      <img
                        src={inq.carId.coverImage}
                        alt={inq.carId.title}
                        className="w-12 h-10 object-cover rounded-xl border border-zinc-200"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-black group-hover:text-zinc-600 truncate">
                          {inq.carId.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                          For {inq.carId.listingType}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 ml-auto shrink-0" />
                    </Link>
                  )}
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-800 leading-relaxed">
                  <p className="font-bold text-zinc-500 text-[11px] mb-1">Message from buyer:</p>
                  &ldquo;{inq.message}&rdquo;
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${inq.senderPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Buyer</span>
                    </a>
                    <a
                      href={`https://wa.me/${inq.senderPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq._id, e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-white text-[11px] font-bold text-zinc-700 focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="new">Mark as New</option>
                      <option value="replied">Mark as Replied</option>
                      <option value="closed">Mark as Closed</option>
                    </select>

                    <button
                      onClick={() => handleDelete(inq._id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Inquiries Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              When prospective buyers or renters send inquiries for your cars, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
