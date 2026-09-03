'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService } from '@/services/admin.service';
import { IContactMessageRecord } from '@/services/contact.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Mail,
  Search,
  Trash2,
  Phone,
  Clock,
  MessageSquare,
  CheckCircle2,
  Eye,
  X,
  Send,
  Filter,
  RefreshCw,
  Inbox,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<IContactMessageRecord[]>([]);
  const [stats, setStats] = useState<{ total: number; new: number; read: number; replied: number }>({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<IContactMessageRecord | null>(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const [resList, resStats] = await Promise.all([
        adminService.getContactMessages({ limit: 100 }),
        adminService.getContactStats().catch(() => null),
      ]);
      setMessages(resList.data || []);
      if (resStats) {
        setStats(resStats);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load contact submissions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      const updated = await adminService.updateContactStatus(messageId, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: newStatus as any } : m))
      );
      if (activeMessage && activeMessage.id === messageId) {
        setActiveMessage((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
      showToast(`Status updated to ${newStatus.toUpperCase()}`, 'success');
      // Refresh stats in background
      adminService.getContactStats().then((s) => s && setStats(s)).catch(() => {});
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (messageId: string) => {
    const isConfirmed = await confirmDialog({
      title: 'Delete Contact Message?',
      text: 'Are you sure you want to permanently delete this customer submission? This action cannot be undone.',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      isDestructive: true,
    });
    if (!isConfirmed) return;

    try {
      await adminService.deleteContactMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      if (activeMessage?.id === messageId) {
        setActiveMessage(null);
      }
      showToast('Contact message deleted successfully', 'success');
      // Refresh stats
      adminService.getContactStats().then((s) => s && setStats(s)).catch(() => {});
    } catch (err: any) {
      showToast(err.message || 'Failed to delete message', 'error');
    }
  };

  const handleOpenDetail = (msg: IContactMessageRecord) => {
    setActiveMessage(msg);
    // If it was "new", automatically mark as "read" for convenient workflow
    if (msg.status === 'new') {
      handleStatusChange(msg.id, 'read');
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q))
      );
    });
  }, [messages, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-black">Contact Form Submissions</h1>
            <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
              {messages.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            General inquiries, support questions, and feedback submitted through the public Contact page.
          </p>
        </div>

        <button
          onClick={fetchContacts}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Inquiries */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">All Messages</p>
            <p className="text-2xl sm:text-3xl font-black text-black mt-1">{stats.total || messages.length}</p>
            <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">Stored in database</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        {/* New / Unread */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">New / Unread</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {stats.new ?? messages.filter((m) => m.status === 'new').length}
            </p>
            <p className="text-[11px] text-emerald-600/80 font-semibold mt-0.5">Awaiting review</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        {/* Replied */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Replied / Addressed</p>
            <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
              {stats.replied ?? messages.filter((m) => m.status === 'replied').length}
            </p>
            <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">Completed inquiries</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sender name, email, phone, subject, or message keyword..."
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
            <option value="all">All Statuses</option>
            <option value="new">New (Unread)</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* MESSAGES TABLE */}
      {isLoading ? (
        <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
          <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-500">Loading contact submissions...</p>
        </div>
      ) : filteredMessages.length > 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="py-4 px-6">Sender Details</th>
                  <th className="py-4 px-6">Subject & Received</th>
                  <th className="py-4 px-6">Message Excerpt</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-zinc-50/80 transition-colors ${
                      msg.status === 'new' ? 'bg-emerald-50/20 font-bold' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {msg.status === 'new' && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="New Message" />
                        )}
                        <p className="font-extrabold text-black text-sm">{msg.name}</p>
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-[11px] text-zinc-500 hover:text-black hover:underline block mt-0.5"
                      >
                        {msg.email}
                      </a>
                      {msg.phone && (
                        <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-zinc-400" />
                          <span>{msg.phone}</span>
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6 max-w-[200px]">
                      <p className="font-bold text-zinc-900 truncate" title={msg.subject}>
                        {msg.subject}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>
                          {new Date(msg.createdAt).toLocaleDateString()} at{' '}
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                    </td>

                    <td className="py-4 px-6 max-w-xs cursor-pointer" onClick={() => handleOpenDetail(msg)}>
                      <p className="text-zinc-600 line-clamp-2 hover:text-black transition-colors" title="Click to view full message">
                        &ldquo;{msg.message}&rdquo;
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(msg);
                        }}
                        className="text-[10px] text-zinc-400 hover:text-black underline mt-0.5 block"
                      >
                        Read full message →
                      </button>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            msg.status === 'new'
                              ? 'success'
                              : msg.status === 'replied'
                              ? 'dark'
                              : 'slate'
                          }
                          size="sm"
                        >
                          {msg.status.toUpperCase()}
                        </Badge>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right space-x-1.5">
                      {/* View full modal */}
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(msg)}
                        className="inline-flex p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
                        title="View Full Message"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Reply via email client */}
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject}`)}`}
                        className="inline-flex p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
                        title="Reply via Email Client"
                        onClick={() => {
                          if (msg.status !== 'replied') {
                            handleStatusChange(msg.id, 'replied');
                          }
                        }}
                      >
                        <Mail className="w-4 h-4" />
                      </a>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(msg.id)}
                        className="inline-flex p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete Contact Record"
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
          <Inbox className="w-12 h-12 text-zinc-300 mx-auto" />
          <h3 className="text-lg font-black text-black">No Messages Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            No contact submissions matched your search query or filter.
          </p>
        </div>
      )}

      {/* DETAIL MODAL */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Customer Inquiry Details</h3>
                  <p className="text-[11px] text-zinc-400">
                    Received on {new Date(activeMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveMessage(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Sender info box */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Sender Name</span>
                  <span className="font-extrabold text-black text-sm">{activeMessage.name}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address</span>
                  <a href={`mailto:${activeMessage.email}`} className="font-bold text-zinc-800 hover:underline">
                    {activeMessage.email}
                  </a>
                </div>

                {activeMessage.phone && (
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Phone Number</span>
                    <a href={`tel:${activeMessage.phone}`} className="font-bold text-zinc-800 hover:underline">
                      {activeMessage.phone}
                    </a>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Current Status</span>
                  <Badge
                    variant={
                      activeMessage.status === 'new'
                        ? 'success'
                        : activeMessage.status === 'replied'
                        ? 'dark'
                        : 'slate'
                    }
                    size="sm"
                    className="mt-1"
                  >
                    {activeMessage.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Subject</span>
                <p className="text-sm font-black text-black bg-zinc-100/60 p-3 rounded-2xl border border-zinc-200/60">
                  {activeMessage.subject}
                </p>
              </div>

              {/* Message Body */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Message Content</span>
                <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-xs text-zinc-800 leading-relaxed whitespace-pre-wrap font-medium shadow-inner">
                  {activeMessage.message}
                </div>
              </div>

              {/* Status Updater */}
              <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <span className="text-zinc-500 font-bold">Mark status as:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeMessage.id, 'new')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      activeMessage.status === 'new'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeMessage.id, 'read')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      activeMessage.status === 'read'
                        ? 'bg-zinc-800 text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    Read
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeMessage.id, 'replied')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      activeMessage.status === 'replied'
                        ? 'bg-black text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    Replied
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDelete(activeMessage.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Message</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${activeMessage.email}?subject=${encodeURIComponent(`Re: ${activeMessage.subject}`)}`}
                  onClick={() => {
                    handleStatusChange(activeMessage.id, 'replied');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-black text-white hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
