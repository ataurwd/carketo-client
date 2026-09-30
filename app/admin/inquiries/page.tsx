'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { inquiryService, IInquiry, IChatMessage } from '@/services/inquiry.service';
import { useAuthStore } from '@/store/auth.store';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { confirmDialog, showToast } from '@/lib/alert';
import {
  MessageSquare,
  Search,
  Trash2,
  ExternalLink,
  Phone,
  MessageCircle,
  Send,
  Ban,
  Unlock,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const { user } = useAuthStore();
  const { theme } = useAdminTheme();
  const isLight = theme === 'light';

  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const fetchInquiries = async () => {
    try {
      const res = await adminService.getInquiriesAdmin({ limit: 200 });
      const list: IInquiry[] = res || [];
      setInquiries(list);
      setActiveChatId((prevId) => {
        if (prevId && list.some((i) => i._id === prevId)) return prevId;
        return list.length > 0 ? list[0]._id : null;
      });
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    const interval = setInterval(fetchInquiries, 3500);
    return () => clearInterval(interval);
  }, []);

  const activeChat = inquiries.find((i) => i._id === activeChatId) || null;

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [activeChat?._id, activeChat?.messages?.length]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!activeChat || !trimmed || isSending) return;

    if (activeChat.isBlocked) {
      showToast('This conversation is blocked. Unblock first to send messages.', 'error');
      return;
    }

    const senderName = user?.name || activeChat.sellerId?.name || 'Admin / Owner';

    const optimisticMsg: IChatMessage = {
      _id: `temp-${Date.now()}`,
      senderRole: 'seller',
      senderName,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...(activeChat.messages || []), optimisticMsg];

    setInquiries((prev) =>
      prev.map((inq) =>
        inq._id === activeChat._id
          ? {
              ...inq,
              message: trimmed,
              messages: updatedMessages,
              status: 'replied',
              updatedAt: new Date().toISOString(),
            }
          : inq
      )
    );
    setReplyText('');
    setIsSending(true);

    try {
      const updated = await inquiryService.sendMessage(activeChat._id, {
        text: trimmed,
        senderName,
        senderRole: 'seller',
      });
      setInquiries((prev) => prev.map((inq) => (inq._id === updated._id ? updated : inq)));
    } catch {
      showToast('Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleBlock = async (inq: IInquiry) => {
    const nextBlock = !inq.isBlocked;
    try {
      const updated = await inquiryService.toggleBlock(inq._id, {
        isBlocked: nextBlock,
        actorRole: 'seller',
        actorName: user?.name || 'Admin',
      });
      setInquiries((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      showToast(nextBlock ? 'Conversation blocked' : 'Conversation unblocked', 'success');
    } catch {
      showToast('Failed to update block status', 'error');
    }
  };

  const handleDelete = async (inquiryId: string) => {
    const isConfirmed = await confirmDialog({
      title: 'Delete Conversation?',
      text: 'Are you sure you want to delete this customer chat conversation?',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      isDestructive: true,
    });
    if (!isConfirmed) return;

    try {
      await adminService.deleteInquiryAdmin(inquiryId);
      const remaining = inquiries.filter((inq) => inq._id !== inquiryId);
      setInquiries(remaining);
      if (activeChatId === inquiryId) {
        setActiveChatId(remaining.length > 0 ? remaining[0]._id : null);
        setMobileShowChat(false);
      }
      showToast('Conversation deleted successfully', 'success');
    } catch {
      showToast('Failed to delete conversation', 'error');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const carInfo = inq.carId || inq.carSnapshot;
    return (
      inq.senderName?.toLowerCase().includes(q) ||
      inq.senderEmail?.toLowerCase().includes(q) ||
      inq.senderPhone?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q) ||
      carInfo?.title?.toLowerCase().includes(q)
    );
  });

  const formatShortTime = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mx-auto space-y-4 pb-6">
      {/* COMPACT HEADER */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : '#18181b',
          borderColor: isLight ? '#e2e8f0' : '#27272a',
        }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border shadow-xs"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
              className="text-lg sm:text-xl font-black"
            >
              Car Inquiries & Live Chat
            </h1>
            <span className="h-5 px-2 rounded-full bg-orange-600 text-white text-[11px] font-black flex items-center justify-center">
              {inquiries.length}
            </span>
          </div>
          <p
            style={{ color: isLight ? '#64748b' : '#a1a1aa' }}
            className="text-[11px] mt-0.5"
          >
            Select a buyer on the left to view the conversation and reply live.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            backgroundColor: isLight ? '#f8fafc' : '#09090b',
            borderColor: isLight ? '#cbd5e1' : '#27272a',
            color: isLight ? '#0f172a' : '#ffffff',
          }}
          className="px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none cursor-pointer self-start sm:self-auto"
        >
          <option value="all">All Conversations</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* COMPACT MESSENGER SPLIT CONSOLE */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : '#18181b',
          borderColor: isLight ? '#e2e8f0' : '#27272a',
        }}
        className="rounded-2xl border shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[480px]"
      >
        {/* ================= LEFT PANE: USER LIST ================= */}
        <div
          style={{ borderColor: isLight ? '#f1f5f9' : '#27272a' }}
          className={`lg:col-span-4 border-r flex flex-col h-full ${
            mobileShowChat ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search Bar */}
          <div
            style={{ borderColor: isLight ? '#f1f5f9' : '#27272a' }}
            className="p-3 border-b"
          >
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search buyer or car..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  backgroundColor: isLight ? '#f8fafc' : '#09090b',
                  borderColor: isLight ? '#e2e8f0' : '#27272a',
                  color: isLight ? '#0f172a' : '#ffffff',
                }}
                className="w-full pl-8 pr-3 py-1.5 rounded-full border text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              <div className="p-8 text-center text-xs font-bold text-slate-400">
                <div className="h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading chats...
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="p-8 text-center space-y-1.5">
                <MessageSquare className="w-7 h-7 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-400">No conversations found.</p>
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const isSelected = activeChat?._id === inq._id;
                const carInfo = inq.carId || inq.carSnapshot;
                const lastMsg =
                  inq.messages && inq.messages.length > 0
                    ? inq.messages[inq.messages.length - 1]
                    : null;
                const lastMsgText = lastMsg ? lastMsg.text : inq.message;
                const isLastFromSeller = lastMsg?.senderRole === 'seller';

                return (
                  <button
                    key={inq._id}
                    type="button"
                    onClick={() => {
                      setActiveChatId(inq._id);
                      setMobileShowChat(true);
                    }}
                    style={{
                      backgroundColor: isSelected
                        ? isLight
                          ? '#fff7ed'
                          : 'rgba(234, 88, 12, 0.15)'
                        : 'transparent',
                      borderColor: isSelected
                        ? isLight
                          ? '#fed7aa'
                          : 'rgba(234, 88, 12, 0.35)'
                        : 'transparent',
                    }}
                    className="w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer hover:opacity-90"
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center font-black text-xs text-white ${
                          inq.isBlocked ? 'bg-rose-600' : 'bg-orange-600'
                        }`}
                      >
                        {(inq.senderName || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                          inq.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <h3
                          style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                          className="text-xs font-extrabold truncate"
                        >
                          {inq.senderName}
                        </h3>
                        <span
                          style={{ color: isLight ? '#64748b' : '#a1a1aa' }}
                          className="text-[10px] font-semibold shrink-0"
                        >
                          {formatShortTime(inq.updatedAt || inq.createdAt)}
                        </span>
                      </div>

                      <p
                        style={{ color: isLight ? '#475569' : '#a1a1aa' }}
                        className="text-[11px] truncate mt-0.5"
                      >
                        {isLastFromSeller ? 'You: ' : ''}
                        {lastMsgText}
                      </p>

                      {carInfo?.title && (
                        <p className="text-[10px] font-bold text-orange-600 truncate mt-0.5">
                          {carInfo.title}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT PANE: COMPACT CONVERSATION ================= */}
        <div
          className={`lg:col-span-8 flex flex-col h-full ${
            mobileShowChat ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {activeChat ? (
            (() => {
              const carInfo = activeChat.carId || activeChat.carSnapshot;
              const cleanPhone = activeChat.senderPhone?.replace(/[^0-9]/g, '');

              return (
                <>
                  {/* Top Chat Header */}
                  <div
                    style={{ borderColor: isLight ? '#f1f5f9' : '#27272a' }}
                    className="px-4 py-2.5 border-b flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => setMobileShowChat(false)}
                        className="lg:hidden p-1.5 rounded-full bg-slate-100 text-slate-700"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <div className="relative shrink-0">
                        <div
                          className={`h-9 w-9 rounded-full text-white flex items-center justify-center font-black text-xs ${
                            activeChat.isBlocked ? 'bg-rose-600' : 'bg-orange-600'
                          }`}
                        >
                          {(activeChat.senderName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                            activeChat.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <h2
                          style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                          className="text-xs sm:text-sm font-extrabold truncate"
                        >
                          {activeChat.senderName}
                        </h2>
                        <p
                          style={{ color: isLight ? '#64748b' : '#a1a1aa' }}
                          className="text-[10px] truncate"
                        >
                          {activeChat.senderPhone}
                        </p>
                      </div>
                    </div>

                    {/* Icon-Only Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      {activeChat.senderPhone && (
                        <a
                          href={`tel:${activeChat.senderPhone}`}
                          title={`Call ${activeChat.senderPhone}`}
                          style={{
                            backgroundColor: isLight ? '#f1f5f9' : '#27272a',
                            color: isLight ? '#334155' : '#e4e4e7',
                          }}
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          style={{
                            backgroundColor: isLight ? 'rgba(37, 211, 102, 0.15)' : 'rgba(37, 211, 102, 0.18)',
                          }}
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-[#25D366]"
                            aria-hidden="true"
                          >
                            <path d="M12.031 2c-5.516 0-9.999 4.486-9.999 10.002 0 1.766.461 3.489 1.337 5.008L2 22l5.122-1.343c1.471.801 3.128 1.224 4.906 1.225h.004c5.515 0 9.998-4.486 9.998-10.002 0-2.672-1.04-5.185-2.929-7.074C17.213 3.041 14.702 2 12.031 2zm5.829 14.129c-.246.693-1.434 1.326-1.997 1.411-.513.077-1.182.109-1.908-.121-.44-.139-1.005-.326-1.727-.638-3.038-1.312-5.023-4.37-5.174-4.572-.152-.202-1.236-1.644-1.236-3.136 0-1.492.782-2.226 1.059-2.529.277-.303.605-.379.807-.379.202 0 .403.002.58.011.186.009.435-.071.681.52.252.606.857 2.096.933 2.248.076.151.126.328.025.53-.101.202-.151.328-.303.505-.151.177-.319.395-.454.53-.151.152-.309.316-.133.619.177.303.784 1.294 1.684 2.096 1.157 1.031 2.132 1.351 2.435 1.502.303.152.479.126.656-.076.177-.202.757-.884.959-1.187.202-.303.403-.252.681-.151.277.101 1.765.833 2.068.985.303.151.504.227.58.353.076.126.076.732-.17 1.425z" />
                          </svg>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleBlock(activeChat)}
                        title={activeChat.isBlocked ? 'Unblock User' : 'Block User'}
                        style={{
                          backgroundColor: activeChat.isBlocked
                            ? '#fef3c7'
                            : isLight
                            ? '#f1f5f9'
                            : '#27272a',
                          color: activeChat.isBlocked
                            ? '#b45309'
                            : isLight
                            ? '#334155'
                            : '#e4e4e7',
                        }}
                        className="h-8 w-8 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:opacity-80"
                      >
                        {activeChat.isBlocked ? (
                          <Unlock className="w-3.5 h-3.5" />
                        ) : (
                          <Ban className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(activeChat._id)}
                        title="Delete Conversation"
                        style={{
                          backgroundColor: isLight ? '#fff1f2' : 'rgba(244, 63, 94, 0.15)',
                          color: '#e11d48',
                        }}
                        className="h-8 w-8 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:opacity-80"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Clean Light/Dark Car Context Strip */}
                  {carInfo && (
                    <div
                      style={{
                        backgroundColor: isLight ? '#f8fafc' : '#09090b',
                        borderColor: isLight ? '#f1f5f9' : '#27272a',
                      }}
                      className="px-4 py-1.5 border-b flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {carInfo.coverImage && (
                          <img
                            src={carInfo.coverImage}
                            alt={carInfo.title}
                            className="w-8 h-6 rounded-md object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <p
                          style={{ color: isLight ? '#334155' : '#e4e4e7' }}
                          className="text-[11px] font-bold truncate"
                        >
                          {carInfo.title}
                        </p>
                      </div>

                      {carInfo.slug && (
                        <Link
                          href={`/cars/${carInfo.slug}`}
                          target="_blank"
                          className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:underline"
                        >
                          <span>View Car</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Compact Messages Stream */}
                  <div
                    ref={messagesContainerRef}
                    style={{ backgroundColor: isLight ? '#ffffff' : '#18181b' }}
                    className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5"
                  >
                    {(activeChat.messages && activeChat.messages.length > 0
                      ? activeChat.messages
                      : [
                          {
                            _id: 'initial',
                            senderRole: 'buyer' as const,
                            senderName: activeChat.senderName,
                            text: activeChat.message,
                            createdAt: activeChat.createdAt,
                          },
                        ]
                    ).map((msg, idx) => {
                      const isSellerMsg = msg.senderRole === 'seller';
                      return (
                        <div
                          key={msg._id || idx}
                          className={`flex items-end gap-2 ${
                            isSellerMsg ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {!isSellerMsg && (
                            <div className="h-6 w-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-black text-[10px] shrink-0 mb-3.5">
                              {(msg.senderName || activeChat.senderName || 'B')
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div
                            className={`flex flex-col max-w-[70%] ${
                              isSellerMsg ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div
                              style={
                                isSellerMsg
                                  ? { backgroundColor: '#ea580c', color: '#ffffff' }
                                  : {
                                      backgroundColor: isLight ? '#f1f5f9' : '#27272a',
                                      color: isLight ? '#0f172a' : '#f4f4f5',
                                    }
                              }
                              className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                                isSellerMsg ? 'rounded-br-xs' : 'rounded-bl-xs'
                              }`}
                            >
                              <p style={{ whiteSpace: 'pre-wrap', color: 'inherit' }}>
                                {msg.text}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5 px-1">
                              <span>{formatShortTime(msg.createdAt)}</span>
                              {isSellerMsg && (
                                <CheckCheck className="w-2.5 h-2.5 text-emerald-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Compact Reply Input Bar */}
                  <form
                    onSubmit={handleSendReply}
                    style={{
                      backgroundColor: isLight ? '#ffffff' : '#18181b',
                      borderColor: isLight ? '#f1f5f9' : '#27272a',
                    }}
                    className="p-2.5 border-t flex items-center gap-2"
                  >
                    <input
                      type="text"
                      disabled={Boolean(activeChat.isBlocked)}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        activeChat.isBlocked
                          ? 'Conversation is blocked...'
                          : `Reply to ${activeChat.senderName}...`
                      }
                      style={{
                        backgroundColor: isLight ? '#f8fafc' : '#09090b',
                        borderColor: isLight ? '#e2e8f0' : '#27272a',
                        color: isLight ? '#0f172a' : '#ffffff',
                      }}
                      className="flex-1 text-xs font-semibold px-3.5 py-2 rounded-full border focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isSending || Boolean(activeChat.isBlocked)}
                      title="Send Reply"
                      className="h-8 w-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center disabled:opacity-40 transition-all shrink-0 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </>
              );
            })()
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-400">
                Select a conversation on the left to view messages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
