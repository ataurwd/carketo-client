'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { IInquiry } from '@/services/inquiry.service';
import { Button } from '@/components/ui/Button';
import {
  MessageSquare,
  Search,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  Car,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  MessageCircle,
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = () => {
    setIsLoading(true);
    adminService
      .getInquiriesAdmin()
      .then((res) => {
        setInquiries(res || []);
      })
      .catch((err) => console.error('Failed to load inquiries:', err))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = async (inquiryId: string) => {
    const isConfirmed = await confirmDialog({
      title: 'Delete Inquiry Record?',
      text: 'Are you sure you want to delete this customer inquiry record? This action cannot be undone.',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      isDestructive: true,
    });
    if (!isConfirmed) return;

    try {
      await adminService.deleteInquiryAdmin(inquiryId);
      setInquiries(inquiries.filter((inq) => inq._id !== inquiryId));
      showToast('Inquiry deleted successfully', 'success');
    } catch {
      showToast('Failed to delete inquiry', 'error');
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
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">Car Inquiries & Customer Leads</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {inquiries.length} Leads
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Review all vehicle buyer questions, test drive requests, and contact inquiries.
          </p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sender name, email, phone, or car title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Inquiry Statuses</option>
            <option value="new">New</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* INQUIRIES LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-zinc-400">
            <div className="h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading customer leads...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center space-y-3 bg-zinc-900/60 rounded-3xl border border-zinc-800">
            <MessageSquare className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No buyer inquiries found matching filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInquiries.map((inq) => {
              const cleanPhone = inq.senderPhone?.replace(/[^0-9]/g, '');
              const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

              return (
                <div
                  key={inq._id}
                  className="p-6 rounded-3xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white text-sm">{inq.senderName}</h3>
                        <p className="text-[11px] text-zinc-400">{inq.senderEmail}</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          inq.status === 'replied' || inq.status === 'closed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {inq.status || 'new'}
                      </span>
                    </div>

                    {/* Associated Car */}
                    {inq.carId && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                        <Car className="w-4 h-4 text-orange-400 shrink-0" />
                        <span className="font-bold text-zinc-200 truncate">{inq.carId.title}</span>
                        {inq.carId.slug && (
                          <Link
                            href={`/cars/${inq.carId.slug}`}
                            target="_blank"
                            className="ml-auto text-zinc-400 hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-300">
                      <p className="leading-relaxed">&ldquo;{inq.message}&rdquo;</p>
                    </div>
                  </div>

                  {/* Actions & Channels */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      {inq.senderEmail && (
                        <a
                          href={`mailto:${inq.senderEmail}?subject=Regarding ${inq.carId?.title || 'your inquiry'}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[11px] transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                          <span>Email</span>
                        </a>
                      )}

                      {inq.senderPhone && (
                        <a
                          href={`tel:${inq.senderPhone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[11px] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Call</span>
                        </a>
                      )}

                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold text-[11px] transition-colors border border-emerald-500/30"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(inq._id)}
                      className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
