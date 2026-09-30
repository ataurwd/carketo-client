'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  Car,
  Star,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Compass,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { aiService, ChatMessage, RecommendedCarCard, SuggestedPrompt } from '@/services/ai.service';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

export function CarAssistantChatbot() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<SuggestedPrompt[]>([]);
  const [showTeaser, setShowTeaser] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  const initialGreeting: ChatMessage = {
    role: 'assistant',
    content: `হ্যালো! 👋 আমি আপনার **কারকেটো এআই** অ্যাসিস্ট্যান্ট।\n\nআপনি কি গাড়ি **ভাড়া** নিতে চাচ্ছেন নাকি **কিনতে** চাচ্ছেন? আপনার চাহিদা আমাকে জানান, আমি আমাদের রিয়েল ইনভেন্টরি থেকে সেরা গাড়িগুলো খুঁজে দেব!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  useEffect(() => {
    // Load initial welcome message
    setMessages([initialGreeting]);

    // Fetch suggested prompts only when authenticated
    if (isAuthenticated) {
      aiService.getPrompts().then((prompts) => {
        setSuggestedPrompts(prompts);
      });
    } else {
      setSuggestedPrompts([]);
    }
  }, [isAuthenticated]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    if (!isAuthenticated) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '🔒 **লগইন আবশ্যক / Authentication Required**\n\nকারকেটো এআই অ্যাসিস্ট্যান্ট ব্যবহার করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }

    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message history to backend (transform assistant -> model for Gemini API)
      const payload = newHistory.map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : m.role,
        content: m.content,
      }));

      const res = await aiService.chat(payload);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: res.reply,
        recommendedCars: res.recommendedCars,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const isAuthErr =
        err?.statusCode === 401 ||
        err?.response?.status === 401 ||
        err?.message?.toLowerCase().includes('authentication') ||
        err?.message?.toLowerCase().includes('unauthorized');

      const fallbackReply = isAuthErr
        ? '🔒 **সেশন শেষ হয়েছে / লগইন প্রয়োজন**\n\nএআই অ্যাসিস্ট্যান্ট ব্যবহারের অনুমতি পেতে অনুগ্রহ করে লগইন করুন।'
        : 'Sorry, I encountered a brief issue connecting to our vehicle database. Please try asking again!';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([initialGreeting]);
    setInputValue('');
  };

  const handlePromptClick = (promptText: string) => {
    handleSendMessage(promptText);
  };

  // Helper to format basic markdown-style text into pleasant HTML/React nodes
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 text-[13.5px] leading-relaxed text-slate-800">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-extrabold text-slate-950 text-sm mt-2 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-900 inline" />
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ') || /^\d+\.\s/.test(trimmed)) {
            const bulletText = trimmed.replace(/^(\*|-|•|\d+\.)\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-zinc-900 mt-1 font-bold text-xs">▪</span>
                <span className="text-slate-800">{renderInlineFormatting(bulletText)}</span>
              </div>
            );
          }

          // Checkmarks
          if (trimmed.startsWith('✓') || trimmed.startsWith('✔')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 text-zinc-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-zinc-900" />
                <span>{renderInlineFormatting(trimmed.replace(/^[✓✔]\s*/, ''))}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-800">
              {renderInlineFormatting(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Inline formatting helper for bold, highlights, and markdown links
  const renderInlineFormatting = (text: string) => {
    // Split by bold (**text**) and markdown links ([text](url))
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        return (
          <Link
            key={i}
            href={href}
            className="inline-flex items-center gap-0.5 font-bold text-zinc-950 underline underline-offset-2 hover:text-zinc-600 transition-colors"
          >
            {label}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Teaser Prompt on Desktop (Black & White Light Theme) */}
      {!isOpen && showTeaser && (
        <div className="fixed bottom-20 right-6 z-50 hidden sm:flex items-center gap-2.5 bg-white text-slate-900 border border-slate-200/90 px-3.5 py-2.5 rounded-2xl shadow-xl shadow-slate-900/10 backdrop-blur-md animate-bounce-subtle max-w-xs">
          <div className="w-7 h-7 rounded-full bg-zinc-950 flex items-center justify-center shrink-0 shadow-sm text-white">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 text-[11px] leading-tight">
            <p className="font-bold text-slate-900">গাড়ি বিষয়ক পরামর্শ প্রয়োজন?</p>
            <p className="text-slate-500">ভাড়া বা কেনার জন্য আমাদের এআই-কে জিজ্ঞাসা করুন!</p>
          </div>
          <button
            onClick={() => setShowTeaser(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            title="বন্ধ করুন"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Launcher Button (Black & White - Sleek & Compact) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Car Assistant"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center sm:gap-2 group p-3 sm:px-3.5 sm:py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white shadow-xl shadow-zinc-950/25 hover:scale-105 active:scale-95 transition-all duration-200 border border-zinc-800"
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-950 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <span className="hidden sm:inline font-semibold text-xs tracking-wide">এআই অ্যাসিস্ট্যান্ট</span>
          <Sparkles className="hidden sm:inline w-3.5 h-3.5 text-zinc-300 animate-spin-slow" />
        </button>
      )}

      {/* Chat Window (BLACK & WHITE LIGHT THEME) */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[640px] max-h-[88vh] bg-white border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-900/15 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-md shadow-zinc-950/20 text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-wide">কারকেটো এআই</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-zinc-100 text-zinc-900 border border-zinc-300 rounded">
                    পরামর্শক
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  {isAuthenticated ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      লাইভ গাড়ি অনুসন্ধান • সঠিক তথ্য
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>এআই আনলক করতে লগ ইন করুন</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-300">
            {/* If not authenticated, show a prominent and sleek Login Required card */}
            {!isAuthenticated && isInitialized && (
              <div className="mx-0.5 my-2 p-4 rounded-2xl bg-zinc-950 text-white shadow-md border border-zinc-800 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white mb-2.5">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-sm text-white">লগইন আবশ্যক / Sign In Required</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-[280px] leading-relaxed">
                  কারকেটো এআই অ্যাসিস্ট্যান্টের সাথে কথা বলতে এবং লাইভ ইনভেন্টরি ব্রাউজ করতে অনুগ্রহ করে লগইন করুন।
                </p>
                <div className="flex items-center gap-2 w-full mt-3.5">
                  <Link
                    href="/login"
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    লগইন করুন (Log In)
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    রেজিস্টার (Register)
                  </Link>
                </div>
              </div>
            )}
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
                      isUser
                        ? 'bg-zinc-950 text-white rounded-br-none shadow-zinc-950/10'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {!isUser ? (
                      renderFormattedText(msg.content)
                    ) : (
                      <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                    )}

                    {/* Interactive Recommended Car Cards */}
                    {msg.recommendedCars && msg.recommendedCars.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-zinc-950" />
                            Inventory Matches ({msg.recommendedCars.length})
                          </span>
                          <span className="text-[10px] text-slate-400">Click to view details</span>
                        </div>

                        <div className="space-y-2.5">
                          {msg.recommendedCars.map((car) => {
                            const isRent = car.listingType === 'rent' || !!car.rentalPrice;
                            const priceDisplay = isRent
                              ? `${formatPrice(car.rentalPrice || car.price || 0)} / day`
                              : formatPrice(car.salePrice || car.price || 0);

                            return (
                              <div
                                key={car.id || car.slug}
                                className="bg-white border border-slate-200 hover:border-zinc-900 rounded-xl overflow-hidden transition-all duration-200 group shadow-xs hover:shadow-sm"
                              >
                                <div className="flex p-2.5 gap-3">
                                  {/* Thumbnail */}
                                  <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                                    <Image
                                      src={car.coverImage}
                                      alt={car.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                      unoptimized
                                    />
                                    <span
                                      className="absolute top-1 left-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded leading-none bg-zinc-900 text-white"
                                    >
                                      {isRent ? 'Rent' : 'Buy'}
                                    </span>
                                  </div>

                                  {/* Details */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <h5 className="font-bold text-slate-900 text-xs truncate group-hover:text-zinc-950 transition-colors" title={car.title}>
                                        {car.title}
                                      </h5>
                                      {car.rating && (
                                        <span className="flex items-center text-[10px] text-zinc-900 font-bold shrink-0">
                                          <Star className="w-2.5 h-2.5 fill-current mr-0.5 text-amber-500" />
                                          {car.rating}
                                        </span>
                                      )}
                                    </div>

                                    {/* Price */}
                                    <div className="text-zinc-950 font-black text-sm mt-0.5">
                                      {priceDisplay}
                                    </div>

                                    {/* Specs Pills */}
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mt-1">
                                      <span className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/80">
                                        <Users className="w-2.5 h-2.5 text-slate-500" /> {car.seats} seats
                                      </span>
                                      <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/80">{car.transmission}</span>
                                      <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/80">{car.bodyType}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Match / Alternative Status & Reasons */}
                                <div className="px-2.5 pb-2 pt-1 border-t border-slate-100 bg-slate-50/50 text-[11px]">
                                  {car.isAlternative ? (
                                    <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 border border-slate-200 rounded px-2 py-1 font-medium">
                                      <AlertTriangle className="w-3 h-3 shrink-0 text-zinc-900" />
                                      <span className="truncate">{car.differenceNote || 'Close alternative'}</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-0.5">
                                      {car.matchReasons.slice(0, 2).map((reason, rIdx) => (
                                        <div key={rIdx} className="flex items-center gap-1 text-slate-800 font-medium">
                                          <CheckCircle2 className="w-2.5 h-2.5 shrink-0 text-zinc-900" />
                                          <span className="truncate">{reason}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* CTA Link (Black and White) */}
                                  <Link
                                    href={`/cars/${car.slug}`}
                                    className="mt-2 flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all duration-200 shadow-xs"
                                  >
                                    <span>View Listing & Reserve</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-xs flex items-center gap-2.5">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">লাইভ গাড়ি ও তথ্য খোঁজা হচ্ছে...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips (Black & White Light Theme) */}
          {isAuthenticated && messages.length <= 2 && suggestedPrompts.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-200 bg-white">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Compass className="w-3 h-3 text-zinc-900" />
                পরামর্শকৃত প্রশ্নসমূহ
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePromptClick(p.prompt)}
                    disabled={isLoading}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 hover:border-zinc-900 hover:text-zinc-950 hover:bg-zinc-200/60 text-slate-700 transition-colors shrink-0 disabled:opacity-50"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box / Authentication Banner (Black & White Light Theme) */}
          {!isAuthenticated ? (
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Lock className="w-4 h-4 text-zinc-900 shrink-0" />
                  <span>লগইন করে এআই চ্যাট শুরু করুন</span>
                </div>
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  লগ ইন
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="ভাড়া, কেনা বা বাজেট সম্পর্কে জিজ্ঞাসা করুন..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 shadow-inner-xs"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                  className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold transition-all duration-200 shrink-0 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1 font-medium">
                <span>গুগল জেমিনি দ্বারা চালিত</span>
                <span>লাইভ ডাটাবেস • আসল ইনভেন্টরি</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
