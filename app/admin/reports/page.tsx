'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { confirmDialog, showToast } from '@/lib/alert';
import {
  ShieldAlert,
  Search,
  Trash2,
  ExternalLink,
  Phone,
  Clock,
  Ban,
  Unlock,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  UserX,
  UserCheck,
  X,
} from 'lucide-react';

interface IAdminChatReportItem {
  reportId: string;
  inquiryId: string;
  reporterRole: 'buyer' | 'seller';
  reporterName: string;
  reporterPhone?: string;
  reportedUserName: string;
  reportedUserPhone?: string;
  reportedUserId?: string;
  category: string;
  reason: string;
  alsoBlocked: boolean;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  isChatBlocked: boolean;
  blockedByName?: string;
  car?: {
    _id?: string;
    title?: string;
    slug?: string;
    coverImage?: string;
    listingType?: string;
  };
  messages: {
    _id?: string;
    senderRole: 'buyer' | 'seller';
    senderName: string;
    text: string;
    createdAt: string;
  }[];
}

export default function AdminChatReportsPage() {
  const [reports, setReports] = useState<IAdminChatReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTranscript, setSelectedTranscript] = useState<IAdminChatReportItem | null>(null);

  const fetchReports = () => {
    setIsLoading(true);
    adminService
      .getChatReports()
      .then((res) => {
        setReports(res || []);
      })
      .catch((err) => console.error('Failed to load chat reports:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (
    item: IAdminChatReportItem,
    nextStatus: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  ) => {
    try {
      await adminService.updateChatReport(item.inquiryId, item.reportId, {
        status: nextStatus,
      });
      setReports((prev) =>
        prev.map((r) =>
          r.reportId === item.reportId ? { ...r, status: nextStatus } : r
        )
      );
      showToast('Report status updated', 'success');
    } catch {
      showToast('Failed to update report status', 'error');
    }
  };

  const handleToggleChatBlock = async (item: IAdminChatReportItem) => {
    const nextBlock = !item.isChatBlocked;
    try {
      await adminService.updateChatReport(item.inquiryId, item.reportId, {
        isChatBlocked: nextBlock,
      });
      setReports((prev) =>
        prev.map((r) =>
          r.inquiryId === item.inquiryId ? { ...r, isChatBlocked: nextBlock } : r
        )
      );
      showToast(
        nextBlock ? 'Conversation blocked by Admin' : 'Conversation unblocked by Admin',
        'success'
      );
    } catch {
      showToast('Failed to toggle block state', 'error');
    }
  };

  const handleDeleteReport = async (item: IAdminChatReportItem) => {
    const isConfirmed = await confirmDialog({
      title: 'Delete User Report?',
      text: 'Are you sure you want to remove this report record from the moderation queue?',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      isDestructive: true,
    });
    if (!isConfirmed) return;

    try {
      await adminService.deleteChatReport(item.inquiryId, item.reportId);
      setReports((prev) => prev.filter((r) => r.reportId !== item.reportId));
      showToast('Report deleted successfully', 'success');
    } catch {
      showToast('Failed to delete report', 'error');
    }
  };

  const filteredReports = reports.filter((rep) => {
    if (statusFilter !== 'all' && rep.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      rep.reporterName?.toLowerCase().includes(q) ||
      rep.reportedUserName?.toLowerCase().includes(q) ||
      rep.reason?.toLowerCase().includes(q) ||
      rep.category?.toLowerCase().includes(q) ||
      rep.car?.title?.toLowerCase().includes(q)
    );
  });

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const blockedCount = reports.filter((r) => r.isChatBlocked).length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">
              Chat & User Reports Moderation
            </h1>
            <span className="h-6 px-2.5 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {reports.length} Reports
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Review user-submitted chat reports, harassment/scam reasons, and blocked conversations.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReports}
          className="px-4 py-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors self-start sm:self-auto cursor-pointer"
        >
          Refresh Queue
        </button>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Total Reports
            </p>
            <p className="text-2xl font-black text-white mt-1">{reports.length}</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Pending Review
            </p>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Blocked Chats
            </p>
            <p className="text-2xl font-black text-rose-400 mt-1">{blockedCount}</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
            <Ban className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Resolved Cases
            </p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{resolvedCount}</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reported user, reporter, reason, or vehicle title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          {(['all', 'pending', 'reviewed', 'resolved', 'dismissed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* REPORTS LIST */}
      {isLoading ? (
        <div className="p-16 bg-zinc-900/80 rounded-3xl border border-zinc-800 text-center space-y-3">
          <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400">Loading user reports...</p>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((item) => (
            <div
              key={item.reportId}
              className="bg-zinc-900/80 rounded-3xl border border-zinc-800 p-6 space-y-5 hover:border-zinc-700 transition-all"
            >
              {/* Top Row: Reported User vs Reporter + Car Info */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  {/* Accused / Reported User */}
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                      <UserX className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block">
                        Reported User ({item.reporterRole === 'buyer' ? 'Seller' : 'Buyer'})
                      </span>
                      <h3 className="text-sm font-black text-white truncate">
                        {item.reportedUserName}
                      </h3>
                      {item.reportedUserPhone && (
                        <p className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-rose-400" />
                          {item.reportedUserPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reporter */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                        Reported By ({item.reporterRole === 'buyer' ? 'Buyer' : 'Seller'})
                      </span>
                      <h3 className="text-sm font-black text-white truncate">
                        {item.reporterName}
                      </h3>
                      {item.reporterPhone && (
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {item.reporterPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Car Snapshot */}
                {item.car?.title && (
                  <Link
                    href={`/cars/${item.car.slug || ''}`}
                    target="_blank"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-orange-500 transition-colors max-w-xs shrink-0"
                  >
                    {item.car.coverImage && (
                      <img
                        src={item.car.coverImage}
                        alt={item.car.title}
                        className="w-12 h-10 rounded-xl object-cover border border-zinc-800"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {item.car.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">
                        View Listing
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 ml-auto shrink-0" />
                  </Link>
                )}
              </div>

              {/* Middle Row: Report Reason Box */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[11px] font-bold">
                      {item.category}
                    </span>
                    {item.isChatBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold">
                        <Ban className="w-3 h-3" />
                        Chat Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[11px] font-bold">
                        Chat Active
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Submitted Report Reason:
                  </p>
                  <p className="text-sm font-semibold text-white leading-relaxed bg-zinc-900 p-3.5 rounded-xl border border-zinc-800">
                    &ldquo;{item.reason}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTranscript(item)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                    <span>Inspect Chat ({item.messages?.length || 0} messages)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleChatBlock(item)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      item.isChatBlocked
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    {item.isChatBlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unblock Conversation</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        <span>Block Conversation</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusUpdate(item, e.target.value as any)
                    }
                    className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="pending">Status: Pending</option>
                    <option value="reviewed">Status: Reviewed</option>
                    <option value="resolved">Status: Resolved</option>
                    <option value="dismissed">Status: Dismissed</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDeleteReport(item)}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 bg-zinc-900/80 rounded-3xl border border-zinc-800 text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-black text-white">No User Reports Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Whenever a buyer or seller reports or blocks someone in live chat, the report details and reason will appear here.
          </p>
        </div>
      )}

      {/* CHAT TRANSCRIPT INSPECTION MODAL */}
      {selectedTranscript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-3xl max-w-xl w-full border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">
                  Conversation Transcript Inspection
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Reporter: {selectedTranscript.reporterName} • Reported: {selectedTranscript.reportedUserName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTranscript(null)}
                className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-zinc-900">
              {selectedTranscript.messages && selectedTranscript.messages.length > 0 ? (
                selectedTranscript.messages.map((m, idx) => (
                  <div
                    key={m._id || idx}
                    className={`p-3.5 rounded-2xl border ${
                      m.senderRole === 'seller'
                        ? 'bg-zinc-950 border-zinc-800 ml-6'
                        : 'bg-zinc-800/70 border-zinc-700 mr-6'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 mb-1">
                      <span>
                        {m.senderName} ({m.senderRole.toUpperCase()})
                      </span>
                      <span>{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white">{m.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 text-center py-8">
                  No messages found in this conversation.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
