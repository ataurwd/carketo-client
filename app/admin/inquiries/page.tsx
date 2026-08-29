'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { IInquiry } from '@/services/inquiry.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  Car,
  ShieldCheck,
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService
      .getInquiriesAdmin()
      .then((res) => {
        setInquiries(res || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry record as Administrator?')) return;
    try {
      await adminService.deleteInquiryAdmin(inquiryId);
      setInquiries(inquiries.filter((inq) => inq._id !== inquiryId));
    } catch {
      setInquiries(inquiries.filter((inq) => inq._id !== inquiryId));
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inq.senderName?.toLowerCase().includes(q) ||
      inq.senderEmail?.toLowerCase().includes(q) ||
      inq.senderPhone?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q) ||
      inq.carId?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-black">Global Inquiries & Leads</h1>
            <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
              {inquiries.length} Leads
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Inspect all contact requests, lead messages, and seller inquiries sent across the platform.
          </p>
        </div>
      </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by sender name, email, phone, or car title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
            >
              <option value="all">All Inquiry Statuses</option>
              <option value="new">New Inquiries</option>
              <option value="replied">Replied Inquiries</option>
              <option value="closed">Closed Inquiries</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table */}
        {isLoading ? (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-zinc-500">Loading global inquiries queue...</p>
          </div>
        ) : filteredInquiries.length > 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-4 px-6">Sender Details</th>
                    <th className="py-4 px-6">Target Vehicle</th>
                    <th className="py-4 px-6">Seller Reference</th>
                    <th className="py-4 px-6">Message Excerpt</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                  {filteredInquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-extrabold text-black text-sm">{inq.senderName}</p>
                        <p className="text-[11px] text-zinc-500">{inq.senderPhone}</p>
                        <p className="text-[10px] text-zinc-400">{inq.senderEmail}</p>
                      </td>

                      <td className="py-4 px-6">
                        {inq.carId ? (
                          <Link
                            href={`/cars/${inq.carId.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 hover:underline text-black font-bold"
                          >
                            <span className="truncate max-w-[160px]">{inq.carId.title}</span>
                            <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                          </Link>
                        ) : (
                          <span className="text-zinc-400">N/A</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-zinc-900">{inq.sellerId?.name || 'Owner'}</p>
                        <p className="text-[11px] text-zinc-400">{inq.sellerId?.phone || inq.sellerId?.email || 'N/A'}</p>
                      </td>

                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-zinc-700 truncate" title={inq.message}>
                          &ldquo;{inq.message}&rdquo;
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="py-4 px-6">
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
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <a
                          href={`tel:${inq.senderPhone}`}
                          className="inline-flex p-2 rounded-xl text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="Call Buyer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(inq._id)}
                          className="inline-flex p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete Lead Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Inquiries Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No buyer/renter inquiries matched your search criteria.
            </p>
          </div>
        )}
    </div>
  );
}
