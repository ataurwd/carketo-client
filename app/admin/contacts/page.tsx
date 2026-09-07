'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService } from '@/services/admin.service';
import { IContactMessageRecord } from '@/services/contact.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { Button } from '@/components/ui/Button';
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
  MessageCircle,
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
      await adminService.updateContactStatus(messageId, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: newStatus as any } : m))
      );
      if (activeMessage && activeMessage.id === messageId) {
        setActiveMessage((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
      showToast(`Status updated to ${newStatus.toUpperCase()}`, 'success');
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
      adminService.getContactStats().then((s) => s && setStats(s)).catch(() => {});
    } catch (err: any) {
      showToast(err.message || 'Failed to delete message', 'error');
    }
  };

  const handleOpenDetail = (msg: IContactMessageRecord) => {
    setActiveMessage(msg);
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
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">Contact Form Submissions</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {messages.length} Submissions
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            General inquiries, support questions, and feedback submitted through the public Contact page.
          </p>
        </div>

        <button
          onClick={fetchContacts}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Total Inquiries</p>
          <p className="text-xl font-black text-white mt-1">{stats.total || messages.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-amber-400">New / Unread</p>
          <p className="text-xl font-black text-amber-400 mt-1">
            {stats.new || messages.filter((m) => m.status === 'new').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-blue-400">Read / In Review</p>
          <p className="text-xl font-black text-blue-400 mt-1">
            {stats.read || messages.filter((m) => m.status === 'read').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-emerald-400">Replied / Resolved</p>
          <p className="text-xl font-black text-emerald-400 mt-1">
            {stats.replied || messages.filter((m) => m.status === 'replied').length}
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sender name, email, subject, or keywords..."
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
            <option value="all">All Submissions</option>
            <option value="new">New (Unread)</option>
            <option value="read">Read (In Review)</option>
            <option value="replied">Replied (Closed)</option>
          </select>
        </div>
      </div>

      {/* MESSAGES TABLE */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-zinc-400">
            <div className="h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading contact submissions...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Inbox className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No contact messages found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/70 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                  <th className="py-3.5 px-4 sm:px-6">Sender</th>
                  <th className="py-3.5 px-4">Subject & Preview</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenDetail(msg)}
                    className={`hover:bg-zinc-800/40 transition-colors cursor-pointer ${
                      msg.status === 'new' ? 'bg-orange-500/5 font-semibold' : ''
                    }`}
                  >
                    {/* Sender */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            msg.status === 'new'
                              ? 'bg-orange-600 text-white shadow-sm'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {msg.name ? msg.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{msg.name}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{msg.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-bold text-zinc-200 truncate">{msg.subject || 'No Subject'}</p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{msg.message}</p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={msg.status}
                        onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition-all ${
                          msg.status === 'new'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : msg.status === 'read'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                    </td>

                    {/* Submitted */}
                    <td className="py-4 px-4 text-zinc-400 text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(msg)}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="View Submission"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MESSAGE DETAIL MODAL */}
      {activeMessage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{activeMessage.subject || 'Contact Submission'}</h2>
                  <p className="text-[11px] text-zinc-400">Submitted on {new Date(activeMessage.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">From:</span>
                  <span className="font-bold text-white">{activeMessage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Email:</span>
                  <span className="font-bold text-zinc-200">{activeMessage.email}</span>
                </div>
                {activeMessage.phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Phone:</span>
                    <span className="font-bold text-zinc-200">{activeMessage.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <span className="font-bold uppercase text-orange-400">{activeMessage.status}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-zinc-400">Message Content</p>
                <p className="text-zinc-300 leading-relaxed font-normal whitespace-pre-wrap">
                  {activeMessage.message}
                </p>
              </div>

              {/* Reply Channels */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || 'Your inquiry with Carketo')}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  {activeMessage.phone && (
                    <a
                      href={`tel:${activeMessage.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Call Sender</span>
                    </a>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    handleStatusChange(activeMessage.id, 'replied');
                    setActiveMessage(null);
                  }}
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/30 rounded-xl text-xs font-bold"
                >
                  Mark as Resolved
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
