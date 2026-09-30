'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { inquiryService, IInquiry, IChatMessage } from '@/services/inquiry.service';
import { useAuthStore } from '@/store/auth.store';
import { confirmDialog, showToast } from '@/lib/alert';
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  Trash2,
  MessageCircle,
  ExternalLink,
  Send,
  Search,
  CheckCheck,
  Flag,
  Ban,
  ShieldAlert,
  X,
  Unlock,
} from 'lucide-react';

const REPORT_CATEGORIES = [
  'প্রতারণা বা স্ক্যাম সন্দেহ',
  'অশালীন ভাষা বা আচরণ',
  'ভুয়া তথ্য বা অযৌক্তিক দাম',
  'স্প্যাম বা বিরক্তিকর মেসেজ',
  'অন্যান্য অভিযোগ',
];

export default function UserInquiriesPage() {
  const { user } = useAuthStore();
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Selected Conversation (Messenger right pane)
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Report & Block Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState(REPORT_CATEGORIES[0]);
  const [reportReason, setReportReason] = useState('');
  const [reportAlsoBlock, setReportAlsoBlock] = useState(true);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const currentUserId = (user as any)?._id || (user as any)?.id || '';

  const checkIsSeller = (inq: IInquiry) => {
    if (!inq.sellerId || !currentUserId) return false;
    return (
      (typeof inq.sellerId === 'object' && inq.sellerId._id === currentUserId) ||
      (typeof inq.sellerId === 'string' && inq.sellerId === currentUserId)
    );
  };

  const loadInquiries = async () => {
    try {
      const res = await inquiryService.getMyInquiries();
      const list = res || [];
      setInquiries(list);
      setActiveChatId((prevId) => {
        if (prevId && list.some((i) => i._id === prevId)) return prevId;
        return list.length > 0 ? list[0]._id : null;
      });
    } catch {
      // ignore error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
    const interval = setInterval(loadInquiries, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeChat = inquiries.find((i) => i._id === activeChatId) || null;

  // Scroll message container to bottom when active conversation or message count changes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [activeChat?._id, activeChat?.messages?.length]);

  const handleSelectConversation = (inq: IInquiry) => {
    setActiveChatId(inq._id);
    setMobileShowChat(true);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!activeChat || !trimmed || isSendingReply) return;

    if (activeChat.isBlocked) {
      showToast('এই কথোপকথনটি ব্লক করা রয়েছে। মেসেজ পাঠাতে আনব্লক করুন।', 'error');
      return;
    }

    const isSeller = checkIsSeller(activeChat);
    const myRole: 'seller' | 'buyer' = isSeller ? 'seller' : 'buyer';
    const myName = user?.name || (myRole === 'seller' ? 'গাড়ির মালিক' : activeChat.senderName);

    const optimisticMsg: IChatMessage = {
      _id: `temp-${Date.now()}`,
      senderRole: myRole,
      senderName: myName,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...(activeChat.messages || []), optimisticMsg];
    const nextStatus =
      myRole === 'seller' && activeChat.status === 'new' ? 'replied' : activeChat.status;

    setInquiries((prev) =>
      prev.map((inq) =>
        inq._id === activeChat._id
          ? {
              ...inq,
              message: trimmed,
              messages: updatedMessages,
              status: nextStatus,
              updatedAt: new Date().toISOString(),
            }
          : inq
      )
    );
    setReplyText('');
    setIsSendingReply(true);

    try {
      const updated = await inquiryService.sendMessage(activeChat._id, {
        text: trimmed,
        senderName: myName,
        senderRole: myRole,
      });
      setInquiries((prev) => prev.map((inq) => (inq._id === updated._id ? updated : inq)));
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'মেসেজ পাঠাতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleToggleBlock = async () => {
    if (!activeChat) return;
    const isSeller = checkIsSeller(activeChat);
    const myRole: 'seller' | 'buyer' = isSeller ? 'seller' : 'buyer';
    const myName = user?.name || (myRole === 'seller' ? 'গাড়ির মালিক' : activeChat.senderName);
    const nextBlockState = !activeChat.isBlocked;

    if (nextBlockState) {
      const confirmed = await confirmDialog({
        title: 'ইউজারকে ব্লক করবেন?',
        text: 'ব্লক করলে এই চ্যাটে কেউ আর মেসেজ পাঠাতে পারবে না। পরে যেকোনো সময় আনব্লক করতে পারবেন।',
        confirmButtonText: 'ব্লক করুন',
        cancelButtonText: 'বাতিল',
        icon: 'warning',
        isDestructive: true,
      });
      if (!confirmed) return;
    }

    try {
      const updated = await inquiryService.toggleBlock(activeChat._id, {
        isBlocked: nextBlockState,
        actorRole: myRole,
        actorName: myName,
      });
      setInquiries((prev) => prev.map((inq) => (inq._id === updated._id ? updated : inq)));
      showToast(
        nextBlockState ? 'ইউজারকে ব্লক করা হয়েছে' : 'ইউজারকে আনব্লক করা হয়েছে',
        'success'
      );
    } catch {
      showToast('ব্লক স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat) return;
    if (!reportReason.trim()) {
      showToast('অনুগ্রহ করে রিপোর্টের কারণ লিখুন', 'error');
      return;
    }

    const isSeller = checkIsSeller(activeChat);
    const myRole: 'seller' | 'buyer' = isSeller ? 'seller' : 'buyer';
    const myName = user?.name || (myRole === 'seller' ? 'গাড়ির মালিক' : activeChat.senderName);

    setIsSubmittingReport(true);
    try {
      const updated = await inquiryService.reportUser(activeChat._id, {
        category: reportCategory,
        reason: reportReason.trim(),
        alsoBlock: reportAlsoBlock,
        reporterRole: myRole,
        reporterName: myName,
        reporterPhone: (user as any)?.phone || activeChat.senderPhone,
      });
      setInquiries((prev) => prev.map((inq) => (inq._id === updated._id ? updated : inq)));
      setShowReportModal(false);
      setReportReason('');
      showToast('রিপোর্টটি সফলভাবে অ্যাডমিনের কাছে পাঠানো হয়েছে', 'success');
    } catch {
      showToast('রিপোর্ট জমা দিতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleDelete = async (inquiryId: string) => {
    const isConfirmed = await confirmDialog({
      title: 'কথোপকথন মুছে ফেলবেন?',
      text: 'আপনি কি নিশ্চিত যে এই চ্যাটটি মুছে ফেলতে চান?',
      confirmButtonText: 'হ্যাঁ, মুছুন',
      cancelButtonText: 'বাতিল',
      icon: 'warning',
      isDestructive: true,
    });
    if (!isConfirmed) return;

    try {
      await inquiryService.deleteInquiry(inquiryId);
      const remaining = inquiries.filter((inq) => inq._id !== inquiryId);
      setInquiries(remaining);
      if (activeChatId === inquiryId) {
        setActiveChatId(remaining.length > 0 ? remaining[0]._id : null);
        setMobileShowChat(false);
      }
      showToast('কথোপকথন মুছে ফেলা হয়েছে', 'success');
    } catch {
      showToast('মুছে ফেলতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const carTitle = (inq.carId || inq.carSnapshot)?.title?.toLowerCase() || '';
    const senderName = inq.senderName?.toLowerCase() || '';
    const sellerName =
      typeof inq.sellerId === 'object' ? inq.sellerId?.name?.toLowerCase() || '' : '';
    return senderName.includes(q) || sellerName.includes(q) || carTitle.includes(q);
  });

  const formatShortTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-zinc-100/70 py-3 sm:py-5 px-2 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Compact Top Bar */}
        <div className="flex items-center justify-between gap-3 mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="h-8 w-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-black hover:text-white transition-all"
              title="ড্যাশবোর্ডে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-lg sm:text-xl font-black text-black">মেসেঞ্জার</h1>
            <span className="h-5 px-2 rounded-full bg-black text-white text-[11px] font-bold flex items-center">
              {inquiries.length}
            </span>
          </div>
        </div>

        {/* CLEAN MESSENGER SPLIT BOX */}
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-8.5rem)] min-h-[540px] max-h-[720px]">
          {/* ================= LEFT PANE: SIMPLE USER LIST ================= */}
          <div
            className={`lg:col-span-4 border-r border-zinc-100 flex flex-col h-full bg-white ${
              mobileShowChat ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Simple Search Bar */}
            <div className="p-3.5 border-b border-zinc-100">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম বা গাড়ি খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-zinc-100 text-xs font-semibold text-black placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Clean User List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {isLoading ? (
                <div className="p-10 text-center space-y-2">
                  <div className="h-7 w-7 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-zinc-400">লোড হচ্ছে...</p>
                </div>
              ) : filteredInquiries.length > 0 ? (
                filteredInquiries.map((inq) => {
                  const isSelected = activeChat?._id === inq._id;
                  const isSeller = checkIsSeller(inq);
                  const counterpartName = isSeller
                    ? inq.senderName
                    : (typeof inq.sellerId === 'object' && inq.sellerId?.name) || 'গাড়ির মালিক';
                  const carInfo = inq.carId || inq.carSnapshot;
                  const lastMsg =
                    inq.messages && inq.messages.length > 0
                      ? inq.messages[inq.messages.length - 1]
                      : null;
                  const lastMsgText = lastMsg ? lastMsg.text : inq.message;
                  const isLastFromMe = lastMsg
                    ? isSeller
                      ? lastMsg.senderRole === 'seller'
                      : lastMsg.senderRole === 'buyer'
                    : false;

                  return (
                    <button
                      key={inq._id}
                      type="button"
                      onClick={() => handleSelectConversation(inq)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className={`h-11 w-11 rounded-full flex items-center justify-center font-black text-sm ${
                            inq.isBlocked
                              ? 'bg-rose-600 text-white'
                              : 'bg-black text-white'
                          }`}
                        >
                          {counterpartName.charAt(0).toUpperCase()}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            inq.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>

                      {/* Minimal Info: Name + Last Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-black text-black truncate">
                            {counterpartName}
                          </h3>
                          <span className="text-[10px] font-semibold text-zinc-400 shrink-0">
                            {formatShortTime(inq.updatedAt || inq.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-500 truncate mt-0.5">
                          {isLastFromMe ? 'আপনি: ' : ''}
                          {lastMsgText}
                        </p>

                        {carInfo?.title && (
                          <p className="text-[10px] font-semibold text-zinc-400 truncate mt-0.5">
                            {carInfo.title}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-10 text-center space-y-2">
                  <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-xs font-bold text-zinc-400">কোনো চ্যাট পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT PANE: CLEAN CONVERSATION ================= */}
          <div
            className={`lg:col-span-8 flex flex-col h-full bg-white ${
              mobileShowChat ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {activeChat ? (
              (() => {
                const isSeller = checkIsSeller(activeChat);
                const counterpartName = isSeller
                  ? activeChat.senderName
                  : (typeof activeChat.sellerId === 'object' && activeChat.sellerId?.name) ||
                    'গাড়ির মালিক';
                const carInfo = activeChat.carId || activeChat.carSnapshot;
                const counterpartPhone = isSeller
                  ? activeChat.senderPhone
                  : carInfo?.contactPhone || activeChat.senderPhone;

                return (
                  <>
                    {/* 1. Minimal Messenger Header with Icon-Only Action Buttons */}
                    <div className="px-4 py-3 bg-white border-b border-zinc-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => setMobileShowChat(false)}
                          className="lg:hidden p-2 rounded-full bg-zinc-100 text-zinc-700 hover:bg-black hover:text-white transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>

                        <div className="relative shrink-0">
                          <div
                            className={`h-10 w-10 rounded-full text-white flex items-center justify-center font-black text-sm ${
                              activeChat.isBlocked ? 'bg-rose-600' : 'bg-black'
                            }`}
                          >
                            {counterpartName.charAt(0).toUpperCase()}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                              activeChat.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-sm font-black text-black truncate">
                            {counterpartName}
                          </h2>
                          <p className="text-[11px] font-semibold text-zinc-400 truncate">
                            {activeChat.isBlocked ? (
                              <span className="text-rose-500">চ্যাট ব্লক করা হয়েছে</span>
                            ) : (
                              <span>সক্রিয় আছেন</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Clean Icon-Only Action Bar */}
                      <div className="flex items-center gap-1.5">
                        {counterpartPhone && (
                          <>
                            <a
                              href={`tel:${counterpartPhone}`}
                              title={`কল করুন (${counterpartPhone})`}
                              className="h-9 w-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            <a
                              href={`https://wa.me/${counterpartPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="হোয়াটসঅ্যাপ"
                              className="h-9 w-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={handleToggleBlock}
                          title={activeChat.isBlocked ? 'আনব্লক করুন' : 'ব্লক করুন'}
                          className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            activeChat.isBlocked
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                        >
                          {activeChat.isBlocked ? (
                            <Unlock className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowReportModal(true)}
                          title="ইউজার রিপোর্ট করুন"
                          className="h-9 w-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Flag className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(activeChat._id)}
                          title="চ্যাট মুছুন"
                          className="h-9 w-9 rounded-full bg-zinc-100 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 2. Slim Car Context Strip */}
                    {carInfo && (
                      <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {carInfo.coverImage && (
                            <img
                              src={carInfo.coverImage}
                              alt={carInfo.title}
                              className="w-9 h-7 rounded-lg object-cover border border-zinc-200 shrink-0"
                            />
                          )}
                          <p className="text-xs font-bold text-zinc-800 truncate">
                            {carInfo.title}
                          </p>
                        </div>

                        {carInfo.slug && (
                          <Link
                            href={`/cars/${carInfo.slug}`}
                            target="_blank"
                            title="গাড়িটি দেখুন"
                            className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-black transition-colors"
                          >
                            <span>দেখুন</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Blocked Warning Banner */}
                    {activeChat.isBlocked && (
                      <div className="px-4 py-2 bg-rose-50 border-b border-rose-100 flex items-center justify-between gap-2 text-xs text-rose-700">
                        <span className="font-bold">এই কথোপকথনটি ব্লক করা রয়েছে।</span>
                        <button
                          type="button"
                          onClick={handleToggleBlock}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                        >
                          আনব্লক
                        </button>
                      </div>
                    )}

                    {/* 3. Clean Messenger Bubbles Stream */}
                    <div
                      ref={messagesContainerRef}
                      className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-white"
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
                        const isMe = isSeller
                          ? msg.senderRole === 'seller'
                          : msg.senderRole === 'buyer';

                        return (
                          <div
                            key={msg._id || idx}
                            className={`flex items-end gap-2 ${
                              isMe ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {!isMe && (
                              <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center font-black text-[11px] shrink-0 mb-4">
                                {(msg.senderName || counterpartName).charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div
                              className={`flex flex-col max-w-[75%] ${
                                isMe ? 'items-end' : 'items-start'
                              }`}
                            >
                              <div
                                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                  isMe
                                    ? 'bg-black text-white rounded-br-xs'
                                    : 'bg-zinc-100 text-zinc-900 rounded-bl-xs'
                                }`}
                              >
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                              </div>

                              <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1 px-1">
                                <span>{formatShortTime(msg.createdAt)}</span>
                                {isMe && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 4. Clean Messenger Input Bar */}
                    <form
                      onSubmit={handleSendReply}
                      className="p-3 bg-white border-t border-zinc-100 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        disabled={Boolean(activeChat.isBlocked)}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={
                          activeChat.isBlocked
                            ? 'চ্যাটটি ব্লক করা রয়েছে...'
                            : 'মেসেজ লিখুন...'
                        }
                        className="flex-1 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full bg-zinc-100 focus:bg-white border border-transparent focus:border-zinc-300 focus:outline-none disabled:opacity-60 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim() || isSendingReply || Boolean(activeChat.isBlocked)}
                        title="পাঠান"
                        className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800 disabled:opacity-40 transition-all shrink-0 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                );
              })()
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <MessageSquare className="w-10 h-10 text-zinc-300 mb-2" />
                <p className="text-sm font-bold text-zinc-500">
                  বাম পাশ থেকে একজন ইউজার নির্বাচন করুন
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= REPORT & BLOCK USER MODAL ================= */}
      {showReportModal && activeChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-zinc-200 shadow-2xl overflow-hidden">
            <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5" />
                <div>
                  <h3 className="text-base font-black">ইউজার রিপোর্ট ও ব্লক করুন</h3>
                  <p className="text-[11px] text-rose-100">
                    অভিযোগটি সরাসরি অ্যাডমিন প্যানেলে প্রেরণ করা হবে
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-2">
                  অভিযোগের ধরন
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REPORT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setReportCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        reportCategory === cat
                          ? 'bg-black text-white border-black'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-black'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  রিপোর্টের কারণ লিখুন <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="কেন আপনি এই ইউজারকে রিপোর্ট করতে চাচ্ছেন তা লিখুন..."
                  className="w-full p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white text-xs sm:text-sm font-medium text-black focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportAlsoBlock}
                  onChange={(e) => setReportAlsoBlock(e.target.checked)}
                  className="h-4 w-4 accent-rose-600 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-rose-900">
                  এই ইউজারকে চ্যাটে ব্লকও করুন
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:text-black transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport || !reportReason.trim()}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  {isSubmittingReport ? 'জমা হচ্ছে...' : 'রিপোর্ট জমা দিন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
