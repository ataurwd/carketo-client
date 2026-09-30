'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { inquiryService, IInquiry, IChatMessage } from '@/services/inquiry.service';
import { useAuthStore } from '@/store/auth.store';
import { confirmDialog, showToast } from '@/lib/alert';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  Mail,
  Trash2,
  MessageCircle,
  ExternalLink,
  Send,
  Search,
  CarFront,
  CheckCheck,
  Sparkles,
} from 'lucide-react';

export default function UserInquiriesPage() {
  const { user } = useAuthStore();
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'replied' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Selected Conversation (Messenger right pane)
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
    } catch {
      showToast('মেসেজ পাঠাতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleStatusChange = async (inquiryId: string, status: 'new' | 'replied' | 'closed') => {
    try {
      await inquiryService.updateStatus(inquiryId, status);
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === inquiryId ? { ...inq, status } : inq))
      );
      showToast('চ্যাটের স্ট্যাটাস আপডেট করা হয়েছে', 'success');
    } catch {
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === inquiryId ? { ...inq, status } : inq))
      );
    }
  };

  const handleDelete = async (inquiryId: string) => {
    const isConfirmed = await confirmDialog({
      title: 'কথোপকথন মুছে ফেলবেন?',
      text: 'আপনি কি নিশ্চিত যে এই লাইভ চ্যাটটি আপনার মেসেঞ্জার ইনবক্স থেকে মুছে ফেলতে চান?',
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
      showToast('কথোপকথন সফলভাবে মুছে ফেলা হয়েছে', 'success');
    } catch {
      showToast('মুছে ফেলতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    if (!matchesStatus) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const carTitle = (inq.carId || inq.carSnapshot)?.title?.toLowerCase() || '';
    const senderName = inq.senderName?.toLowerCase() || '';
    const sellerName =
      typeof inq.sellerId === 'object' ? inq.sellerId?.name?.toLowerCase() || '' : '';
    const phone = inq.senderPhone?.toLowerCase() || '';

    return (
      senderName.includes(q) ||
      sellerName.includes(q) ||
      carTitle.includes(q) ||
      phone.includes(q)
    );
  });

  const statusLabels: Record<'all' | 'new' | 'replied' | 'closed', string> = {
    all: 'সব',
    new: 'নতুন',
    replied: 'উত্তর দেওয়া',
    closed: 'বন্ধ',
  };

  const formatShortTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-100/70 py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4 mb-4 px-2 sm:px-0">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="h-9 w-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-black hover:text-white hover:border-black transition-all shadow-xs"
              title="ড্যাশবোর্ডে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-2xl font-black text-black">
                  লাইভ মেসেঞ্জার ও চ্যাট ইনবক্স
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 text-[11px] font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  লাইভ
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 hidden sm:block">
                বাম পাশ থেকে যেকোনো ইউজারের নামের ওপর ক্লিক করে ডান পাশে সরাসরি কথোপকথন চালিয়ে যান
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-zinc-600 bg-white px-3.5 py-2 rounded-xl border border-zinc-200 shadow-xs">
            মোট কথোপকথন: <span className="font-black text-black">{inquiries.length}</span>
          </div>
        </div>

        {/* MESSENGER SPLIT LAYOUT */}
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-10.5rem)] min-h-[600px] max-h-[820px]">
          {/* ================= LEFT PANE: USER / CONVERSATION LIST ================= */}
          <div
            className={`lg:col-span-4 border-r border-zinc-200 flex flex-col h-full bg-white ${
              mobileShowChat ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Left Sidebar Header: Search + Filter Tabs */}
            <div className="p-4 border-b border-zinc-100 space-y-3 bg-zinc-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ইউজার বা গাড়ির নাম খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-zinc-200 text-xs font-semibold text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Filter Pills */}
              <div className="grid grid-cols-4 gap-1 bg-zinc-200/70 p-1 rounded-xl text-[11px] font-bold">
                {(['all', 'new', 'replied', 'closed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`py-1.5 rounded-lg transition-all text-center truncate ${
                      statusFilter === st
                        ? 'bg-black text-white shadow-xs'
                        : 'text-zinc-600 hover:text-black'
                    }`}
                  >
                    {statusLabels[st]}
                  </button>
                ))}
              </div>
            </div>

            {/* User / Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
              {isLoading ? (
                <div className="p-10 text-center space-y-3">
                  <div className="h-8 w-8 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-zinc-500">চ্যাট তালিকা লোড হচ্ছে...</p>
                </div>
              ) : filteredInquiries.length > 0 ? (
                filteredInquiries.map((inq) => {
                  const isSelected = activeChat?._id === inq._id;
                  const isSeller = checkIsSeller(inq);
                  const counterpartName = isSeller
                    ? inq.senderName
                    : (typeof inq.sellerId === 'object' && inq.sellerId?.name) || 'গাড়ির মালিক';
                  const counterpartRole = isSeller ? 'ক্রেতা' : 'গাড়ির মালিক';
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
                      className={`w-full text-left p-3.5 sm:p-4 transition-all flex items-start gap-3.5 hover:bg-zinc-50 ${
                        isSelected
                          ? 'bg-zinc-900/5 border-l-4 border-l-black'
                          : 'border-l-4 border-l-transparent'
                      }`}
                    >
                      {/* User Avatar with Online Indicator */}
                      <div className="relative shrink-0">
                        <div
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-base shadow-xs ${
                            isSelected ? 'bg-black text-white' : 'bg-zinc-900 text-white'
                          }`}
                        >
                          {counterpartName.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>

                      {/* User Name, Car Tag, and Last Message Preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="text-sm font-black text-black truncate">
                              {counterpartName}
                            </h3>
                            <span
                              className={`shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                                isSeller
                                  ? 'bg-amber-500/15 text-amber-800'
                                  : 'bg-sky-500/15 text-sky-800'
                              }`}
                            >
                              {counterpartRole}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400 shrink-0">
                            {formatShortTime(inq.updatedAt || inq.createdAt)}
                          </span>
                        </div>

                        {/* Car Title Subtitle */}
                        {carInfo?.title && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 truncate mt-0.5">
                            <CarFront className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span className="truncate">{carInfo.title}</span>
                          </div>
                        )}

                        {/* Last Message + Unread / Status Badge */}
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p
                            className={`text-xs truncate ${
                              inq.status === 'new' && isSeller
                                ? 'font-black text-black'
                                : 'font-medium text-zinc-500'
                            }`}
                          >
                            {isLastFromMe ? 'আপনি: ' : ''}
                            {lastMsgText}
                          </p>

                          <div className="flex items-center gap-1 shrink-0">
                            {inq.status === 'new' && (
                              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                            )}
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                              {inq.messages?.length || 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-10 text-center space-y-2">
                  <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto" />
                  <p className="text-sm font-black text-black">কোনো কথোপকথন পাওয়া যায়নি</p>
                  <p className="text-xs text-zinc-400">
                    যেকোনো গাড়ির পেজ থেকে চ্যাট শুরু করলে এখানে ইউজারের তালিকা দেখতে পাবেন।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT PANE: ACTIVE CONVERSATION ================= */}
          <div
            className={`lg:col-span-8 flex flex-col h-full bg-zinc-50/60 ${
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
                const counterpartRole = isSeller ? 'ক্রেতা' : 'গাড়ির মালিক';
                const carInfo = activeChat.carId || activeChat.carSnapshot;
                const counterpartPhone = isSeller
                  ? activeChat.senderPhone
                  : carInfo?.contactPhone || activeChat.senderPhone;

                const quickChips = isSeller
                  ? [
                      'হ্যাঁ, গাড়িটি এখনো এভেইলেবল আছে।',
                      'আপনি চাইলে সরাসরি এসে গাড়িটি দেখতে পারেন।',
                      'গাড়ির সব কাগজপত্র সম্পূর্ণ আপ-টু-ডেট আছে।',
                      'অনুগ্রহ করে আমাকে এই নম্বরে কল দিন।',
                    ]
                  : [
                      'গাড়িটি কি এখনো এভেইলেবল আছে?',
                      'গাড়িটির সর্বশেষ দাম কত রাখা যাবে?',
                      'আজ কি গাড়িটি সরাসরি দেখা সম্ভব?',
                      'গাড়ির কাগজপত্র ও কন্ডিশন কেমন?',
                    ];

                return (
                  <>
                    {/* 1. Messenger Top User Header */}
                    <div className="p-3.5 sm:p-4 bg-white border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Back button on mobile */}
                        <button
                          type="button"
                          onClick={() => setMobileShowChat(false)}
                          className="lg:hidden p-2 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-black hover:text-white transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>

                        <div className="relative shrink-0">
                          <div className="h-11 w-11 rounded-2xl bg-black text-white flex items-center justify-center font-black text-base">
                            {counterpartName.charAt(0).toUpperCase()}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-sm sm:text-base font-black text-black truncate">
                              {counterpartName}
                            </h2>
                            <Badge
                              variant={isSeller ? 'brand' : 'dark'}
                              size="sm"
                            >
                              {counterpartRole}
                            </Badge>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              সক্রিয় চ্যাট
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-zinc-500 mt-0.5">
                            {counterpartPhone && (
                              <span className="inline-flex items-center gap-1 font-semibold text-zinc-700">
                                <Phone className="w-3 h-3 text-black" />
                                {counterpartPhone}
                              </span>
                            )}
                            {activeChat.senderEmail && (
                              <span className="hidden sm:inline-flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3" />
                                {activeChat.senderEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Header Action Controls */}
                      <div className="flex items-center gap-2 ml-auto">
                        {counterpartPhone && (
                          <>
                            <a
                              href={`tel:${counterpartPhone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors"
                              title="সরাসরি কল করুন"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">কল</span>
                            </a>
                            <a
                              href={`https://wa.me/${counterpartPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                              title="হোয়াটসঅ্যাপে চ্যাট"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">হোয়াটসঅ্যাপ</span>
                            </a>
                          </>
                        )}

                        <select
                          value={activeChat.status}
                          onChange={(e) =>
                            handleStatusChange(activeChat._id, e.target.value as any)
                          }
                          className="px-2.5 py-2 rounded-xl border border-zinc-200 bg-white text-[11px] font-bold text-zinc-700 focus:outline-none focus:border-black cursor-pointer"
                        >
                          <option value="new">নতুন</option>
                          <option value="replied">উত্তর দেওয়া হয়েছে</option>
                          <option value="closed">বন্ধ</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDelete(activeChat._id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
                          title="কথোপকথন মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 2. Pinned Car Context Banner */}
                    {carInfo && (
                      <div className="px-4 py-2.5 bg-zinc-900 text-white flex items-center justify-between gap-3 border-b border-zinc-800">
                        <div className="flex items-center gap-3 min-w-0">
                          {carInfo.coverImage && (
                            <img
                              src={carInfo.coverImage}
                              alt={carInfo.title}
                              className="w-11 h-9 rounded-lg object-cover border border-zinc-700 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-black text-white truncate">
                              {carInfo.title}
                            </p>
                            <p className="text-[10px] text-zinc-400 font-semibold">
                              {carInfo.listingType === 'rent' ? 'ভাড়ার গাড়ি' : 'বিক্রয়ের গাড়ি'}
                              {carInfo.salePrice
                                ? ` • ৳${Number(carInfo.salePrice).toLocaleString('bn-BD')}`
                                : (carInfo as any).rentalPrice?.pricePerDay
                                ? ` • ৳${Number((carInfo as any).rentalPrice.pricePerDay).toLocaleString('bn-BD')}/দিন`
                                : typeof carInfo.rentalPrice === 'number'
                                ? ` • ৳${Number(carInfo.rentalPrice).toLocaleString('bn-BD')}/দিন`
                                : ''}
                            </p>
                          </div>
                        </div>

                        {carInfo.slug && (
                          <Link
                            href={`/cars/${carInfo.slug}`}
                            target="_blank"
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white transition-colors"
                          >
                            <span>গাড়ি দেখুন</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* 3. Scrollable Messenger Conversation Area */}
                    <div
                      ref={messagesContainerRef}
                      className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
                    >
                      {/* Conversation Intro Pill */}
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 text-[11px] font-semibold text-zinc-500 shadow-2xs">
                          <Sparkles className="w-3.5 h-3.5 text-black" />
                          <span>
                            {counterpartName}-এর সাথে গাড়ি বিষয়ক লাইভ কথোপকথন শুরু হয়েছে
                          </span>
                        </div>
                      </div>

                      {/* Message Bubbles */}
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
                            className={`flex items-end gap-2.5 ${
                              isMe ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {/* Counterpart Small Avatar on Left */}
                            {!isMe && (
                              <div className="h-8 w-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black text-xs shrink-0 mb-4">
                                {(msg.senderName || counterpartName).charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div
                              className={`flex flex-col max-w-[78%] sm:max-w-[70%] ${
                                isMe ? 'items-end' : 'items-start'
                              }`}
                            >
                              <span className="text-[10px] font-bold text-zinc-400 mb-1 px-1">
                                {isMe
                                  ? 'আপনি'
                                  : `${msg.senderName} (${
                                      msg.senderRole === 'seller' ? 'গাড়ির মালিক' : 'ক্রেতা'
                                    })`}
                              </span>

                              <div
                                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                                  isMe
                                    ? 'bg-black text-white rounded-br-xs'
                                    : 'bg-white text-zinc-900 border border-zinc-200 rounded-bl-xs'
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

                    {/* 4. Quick Reply Chips */}
                    <div className="px-4 py-2 bg-white border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {quickChips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setReplyText(chip)}
                          className="shrink-0 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-black hover:text-white text-[11px] font-bold text-zinc-700 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* 5. Messenger Composer Input Bar */}
                    <form
                      onSubmit={handleSendReply}
                      className="p-3 sm:p-4 bg-white border-t border-zinc-200 flex items-center gap-2.5"
                    >
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`${counterpartName}-কে মেসেজ লিখুন...`}
                        className="flex-1 text-xs sm:text-sm font-semibold px-4 py-3 rounded-full border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:border-black transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim() || isSendingReply}
                        className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white text-xs sm:text-sm font-bold hover:bg-zinc-800 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
                      >
                        <span>পাঠান</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                );
              })()
            ) : (
              /* Empty State on Right Pane when no chat is selected */
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div className="h-16 w-16 rounded-3xl bg-zinc-200/70 flex items-center justify-center text-zinc-500 mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-black">
                  কথোপকথন দেখতে বাম পাশ থেকে একজন ইউজার নির্বাচন করুন
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  বাম পাশের তালিকায় থাকা যেকোনো ক্রেতা বা গাড়ির মালিকের নামের ওপর ক্লিক করলে এখানে সম্পূর্ণ চ্যাট হিস্ট্রি ও মেসেজ বক্স খুলে যাবে।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
