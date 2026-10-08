'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { carService } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { wishlistService } from '@/services/wishlist.service';
import { inquiryService, IInquiry, IChatMessage } from '@/services/inquiry.service';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Accordion } from '@/components/ui/Accordion';
import { CarCard } from '@/components/common/CarCard';
import { RAW_CARS, FALLBACK_20_CARS } from '@/lib/fallbackCars';
import {
  DoorClosed,
  Users,
  Gauge,
  Calendar,
  Briefcase,
  Wind,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Milestone,
  Heart,
  X,
  ShieldCheck,
  Star,
  Send,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Lock,
  MapPin,
  Car as CarIcon,
  ShoppingBag,
  Flag,
  Ban,
  UserCheck,
  ExternalLink,
  ArrowRight,
  Edit,
} from 'lucide-react';
import { showToast } from '@/lib/alert';

/** Auto-sliding image carousel with touch/mouse swipe and arrow navigation */
function ImageSlider({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + total) % total);
  }, [total]);

  const startAutoSlide = useCallback(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % total);
    }, 4000);
  }, [total]);

  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide, stopAutoSlide]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoSlide();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
    startAutoSlide();
  };

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = true;
    stopAutoSlide();
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    mouseStartX.current = null;
    isDragging.current = false;
    startAutoSlide();
  };
  const onMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      mouseStartX.current = null;
    }
    startAutoSlide();
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main Slide */}
      <div
        className="relative overflow-hidden rounded-3xl bg-zinc-900 aspect-[16/10] shadow-xl border border-zinc-200 cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        {/* Images */}
        {images.map((src, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={src}
              alt={`${title} — image ${idx + 1}`}
              draggable={false}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Left Arrow */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(current - 1); stopAutoSlide(); startAutoSlide(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm"
            aria-label="Previous image"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}

        {/* Right Arrow */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(current + 1); stopAutoSlide(); startAutoSlide(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm"
            aria-label="Next image"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}

        {/* Image counter badge */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/50 text-white text-[10px] font-bold backdrop-blur-sm">
            {current + 1} / {total}
          </div>
        )}
      </div>

      {/* Dot Indicators */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { goTo(idx); stopAutoSlide(); startAutoSlide(); }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === idx ? 'w-8 bg-black' : 'w-2.5 bg-zinc-300 hover:bg-zinc-500'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Renders the seller's description with a Read more / Read less toggle for long text */
function DescriptionBlock({ description }: { description: string }) {
  const LIMIT = 280;
  const isLong = description.length > LIMIT;
  const [expanded, setExpanded] = useState(false);

  const displayText = isLong && !expanded
    ? description.slice(0, LIMIT).trimEnd() + '…'
    : description;

  return (
    <div className="space-y-1.5">
      <p
        style={{ whiteSpace: 'pre-wrap' }}
        className="text-zinc-600 text-xs sm:text-sm leading-relaxed"
      >
        {displayText}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="text-xs font-bold text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          {expanded ? 'সংক্ষিপ্ত করুন ↑' : 'আরও পড়ুন ↓'}
        </button>
      )}
    </div>
  );
}

export default function CarDetailClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user } = useAuthStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Phone number reveal and copy state
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [loginPromptReason, setLoginPromptReason] = useState<'phone' | 'chat' | 'wishlist'>('phone');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [activeThread, setActiveThread] = useState<IInquiry | null>(null);
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isChatProfileSet, setIsChatProfileSet] = useState(false);
  const [showChatReportPanel, setShowChatReportPanel] = useState(false);
  const [chatReportReason, setChatReportReason] = useState('');
  const [chatReportCategory, setChatReportCategory] = useState('প্রতারণা বা স্ক্যাম সন্দেহ');
  const [chatReportAlsoBlock, setChatReportAlsoBlock] = useState(true);
  const [isSubmittingChatReport, setIsSubmittingChatReport] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [clientSlug, setClientSlug] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const extractedSlug = parts[parts.length - 1];
      if (extractedSlug && extractedSlug !== 'car') {
        setClientSlug(extractedSlug);
      } else if (slug) {
        setClientSlug(slug);
      }
    } else if (slug) {
      setClientSlug(slug);
    }
  }, [slug]);

  // Live Car state from MongoDB
  const [car, setCar] = useState<ICar | null>(null);
  const [isLoadingCar, setIsLoadingCar] = useState(true);
  const [relatedCars, setRelatedCars] = useState<ICar[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);

  useEffect(() => {
    const targetSlug = clientSlug || slug;
    if (targetSlug && targetSlug !== 'car') {
      setIsLoadingCar(true);
      carService
        .getCarBySlug(targetSlug)
        .then((res) => {
          if (res) {
            setCar(res);
          } else {
            const fallback =
              RAW_CARS.find((c: any) => c.slug === targetSlug) ||
              FALLBACK_20_CARS.find((c: any) => c.slug === targetSlug);
            if (fallback) setCar(fallback);
          }
          setIsLoadingCar(false);
        })
        .catch(() => {
          const fallback =
            RAW_CARS.find((c: any) => c.slug === targetSlug) ||
            FALLBACK_20_CARS.find((c: any) => c.slug === targetSlug);
          if (fallback) setCar(fallback);
          setIsLoadingCar(false);
        });
    }
  }, [clientSlug, slug]);

  // Fetch related cars with same listingType (Sale or Rent)
  useEffect(() => {
    if (car?._id) {
      setIsLoadingRelated(true);
      carService
        .getCars({ listingType: car.listingType })
        .then((res) => {
          const filtered = (res || []).filter((c) => c._id !== car._id);
          setRelatedCars(filtered.slice(0, 6));
        })
        .catch(() => {
          setRelatedCars([]);
        })
        .finally(() => {
          setIsLoadingRelated(false);
        });
    }
  }, [car?._id, car?.listingType]);

  const isRental = car?.listingType === 'rent';
  const rawPhone = car?.contactPhone || '01712-345678';
  const maskedPhone = '017 ••••••••';

  // Seller / Provider details
  const sellerDetails = useMemo(() => {
    if (!car) return null;

    const providerObj =
      typeof car.providerId === 'object' && car.providerId !== null
        ? car.providerId
        : null;

    const sellerId =
      providerObj?._id ||
      providerObj?.id ||
      (typeof car.providerId === 'string' ? car.providerId : null) ||
      car.provider?.id ||
      (car.provider as any)?._id ||
      '';

    const displayName =
      providerObj?.providerProfile?.businessName ||
      providerObj?.name ||
      car.provider?.name ||
      'বিজ্ঞাপনদাতা / গাড়ির মালিক';

    const avatar = providerObj?.avatar || car.provider?.avatar || '';

    const isVerified =
      Boolean(providerObj?.providerProfile?.isVerified) ||
      providerObj?.role === 'admin' ||
      providerObj?.role === 'provider' ||
      false;

    const roleBadge = providerObj?.providerProfile?.businessName
      ? 'ভেরিফাইড ডিলার'
      : providerObj?.role === 'provider'
      ? 'ভেরিফাইড প্রোভাইডার'
      : providerObj?.role === 'admin'
      ? 'অথরাইজড ডিলার'
      : 'বিজ্ঞাপনদাতা (ব্যক্তিগত)';

    const memberSince = providerObj?.createdAt
      ? new Date(providerObj.createdAt).toLocaleDateString('bn-BD', {
          year: 'numeric',
          month: 'long',
        })
      : '';

    const profileUrl = sellerId ? `/dealers/${sellerId}` : '#';

    return {
      id: sellerId,
      name: displayName,
      avatar,
      isVerified,
      roleBadge,
      memberSince,
      profileUrl,
      raw: providerObj,
    };
  }, [car]);

  // Check if current user is the owner/creator of this car
  const isOwner = useMemo(() => {
    if (!user || !car) return false;
    const userId = user.id || (user as any)._id;
    if (!userId) return false;

    const carProviderId =
      typeof car.providerId === 'object' && car.providerId !== null
        ? car.providerId._id || car.providerId.id
        : car.providerId;

    if (carProviderId && String(carProviderId) === String(userId)) {
      return true;
    }

    if (car.provider?.id && String(car.provider.id) === String(userId)) {
      return true;
    }

    if (user.phone && car.contactPhone) {
      const cleanUserPhone = user.phone.replace(/\D/g, '');
      const cleanCarPhone = car.contactPhone.replace(/\D/g, '');
      if (cleanUserPhone && cleanUserPhone === cleanCarPhone) {
        return true;
      }
    }

    return false;
  }, [user, car]);

  useEffect(() => {
    if (car?._id && user) {
      wishlistService
        .checkWishlist(car._id)
        .then((res) => {
          setIsWishlisted(Boolean(res?.isWishlisted));
        })
        .catch(() => {});
    } else {
      setIsWishlisted(false);
    }
  }, [car?._id, user]);

  const handlePhoneClick = () => {
    if (!user) {
      setLoginPromptReason('phone');
      setLoginPromptOpen(true);
      return;
    }

    setIsPhoneRevealed(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawPhone);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      setLoginPromptReason('wishlist');
      setLoginPromptOpen(true);
      return;
    }
    if (!car?._id) return;
    const previous = isWishlisted;
    setIsWishlisted(!previous);
    try {
      const res = await wishlistService.toggle(car._id);
      setIsWishlisted(res.isWishlisted);
    } catch {
      setIsWishlisted(previous);
    }
  };

  const handleChatButtonClick = () => {
    if (isOwner) return;
    if (!user) {
      setLoginPromptReason('chat');
      setLoginPromptOpen(true);
      return;
    }
    setInquiryModalOpen(true);
  };

  // Load user chat identity
  useEffect(() => {
    if (user) {
      setInquiryName(user.name || '');
      const uPhone = (user as any).phone || '';
      if (uPhone) setInquiryPhone(uPhone);
      setIsChatProfileSet(true);
    } else {
      setIsChatProfileSet(false);
    }
  }, [user]);

  // Fetch & poll live chat thread when modal is open
  useEffect(() => {
    if (!inquiryModalOpen || !car?._id || !user) return;

    let isMounted = true;

    const fetchThread = async () => {
      try {
        if (activeThread?._id) {
          const updated = await inquiryService.getInquiryById(activeThread._id);
          if (isMounted && updated) {
            setActiveThread(updated);
            setChatMessages(updated.messages || []);
          }
        } else {
          const thread = await inquiryService.getCarThread(
            car._id,
            inquiryPhone || (user as any)?.phone
          );
          if (isMounted && thread) {
            setActiveThread(thread);
            setChatMessages(thread.messages || []);
          }
        }
      } catch {
        // ignore polling error
      }
    };

    fetchThread();
    const interval = setInterval(fetchThread, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [inquiryModalOpen, car?._id, user, isChatProfileSet, activeThread?._id, inquiryPhone]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (inquiryModalOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages.length, inquiryModalOpen]);

  const sendChatMessageText = async (textToSend: string) => {
    if (!user) {
      setInquiryModalOpen(false);
      setLoginPromptReason('chat');
      setLoginPromptOpen(true);
      return;
    }

    const trimmed = textToSend.trim();
    if (!car?._id || !trimmed || isSendingChat) return;

    const effectiveName = (user.name || 'ক্রেতা').trim();
    const effectivePhone = ((user as any)?.phone || inquiryPhone || '01700000000').trim();

    const optimisticMsg: IChatMessage = {
      _id: `temp-${Date.now()}`,
      senderRole: 'buyer',
      senderName: effectiveName,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, optimisticMsg]);
    setInquiryMessage('');
    setIsSendingChat(true);

    try {
      if (activeThread?._id) {
        const updated = await inquiryService.sendMessage(activeThread._id, {
          text: trimmed,
          senderName: effectiveName,
          senderRole: 'buyer',
        });
        setActiveThread(updated);
        if (updated.messages) setChatMessages(updated.messages);
      } else {
        const created = await inquiryService.createInquiry({
          carId: car._id,
          carSnapshot: {
            _id: car._id,
            title: car.title,
            slug: car.slug,
            coverImage: car.coverImage,
            brand: car.brand,
            model: car.model,
            listingType: car.listingType,
            salePrice: car.salePrice || car.price,
            rentalPrice: car.rentalPrice,
            contactPhone: car.contactPhone,
          },
          senderName: effectiveName,
          senderEmail: user?.email || 'guest@carketo.com',
          senderPhone: effectivePhone,
          message: trimmed,
        });
        setActiveThread(created);
        if (created.messages) setChatMessages(created.messages);
      }
    } catch {
      // Keep optimistic message visible even if offline
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setInquiryModalOpen(false);
      setLoginPromptReason('chat');
      setLoginPromptOpen(true);
      return;
    }
    if (activeThread?.isBlocked) {
      showToast('এই কথোপকথনটি ব্লক করা রয়েছে।', 'error');
      return;
    }
    await sendChatMessageText(inquiryMessage);
  };

  const handleToggleBlockInCarModal = async () => {
    if (!activeThread?._id) {
      showToast('প্রথমে অন্তত একটি মেসেজ পাঠিয়ে চ্যাট শুরু করুন', 'info');
      return;
    }
    try {
      const nextBlock = !activeThread.isBlocked;
      const updated = await inquiryService.toggleBlock(activeThread._id, {
        isBlocked: nextBlock,
        actorRole: 'buyer',
        actorName: user?.name || inquiryName || 'ক্রেতা',
      });
      setActiveThread(updated);
      showToast(
        nextBlock ? 'চ্যাটটি সফলভাবে ব্লক করা হয়েছে' : 'চ্যাটটি আনব্লক করা হয়েছে',
        'success'
      );
    } catch {
      showToast('ব্লক স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleSubmitChatReportInCarModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatReportReason.trim()) {
      showToast('অনুগ্রহ করে রিপোর্টের কারণ লিখুন', 'error');
      return;
    }
    setIsSubmittingChatReport(true);
    try {
      let threadId = activeThread?._id;
      if (!threadId && car?._id) {
        const effectiveName = (user?.name || inquiryName || 'ক্রেতা').trim();
        const effectivePhone = ((user as any)?.phone || inquiryPhone || '01700000000').trim();
        const created = await inquiryService.createInquiry({
          carId: car._id,
          carSnapshot: {
            _id: car._id,
            title: car.title,
            slug: car.slug,
            coverImage: car.coverImage,
            brand: car.brand,
            model: car.model,
            listingType: car.listingType,
            salePrice: car.salePrice || car.price,
            rentalPrice: car.rentalPrice,
            contactPhone: car.contactPhone,
          },
          senderName: effectiveName,
          senderEmail: user?.email || 'guest@carketo.com',
          senderPhone: effectivePhone,
          message: `[রিপোর্ট ও অভিযোগ]: ${chatReportReason.trim()}`,
        });
        setActiveThread(created);
        threadId = created._id;
      }

      if (threadId) {
        const updated = await inquiryService.reportUser(threadId, {
          category: chatReportCategory,
          reason: chatReportReason.trim(),
          alsoBlock: chatReportAlsoBlock,
          reporterRole: 'buyer',
          reporterName: (user?.name || inquiryName || 'ক্রেতা').trim(),
          reporterPhone: ((user as any)?.phone || inquiryPhone || '01700000000').trim(),
        });
        setActiveThread(updated);
      }

      setShowChatReportPanel(false);
      setChatReportReason('');
      showToast('আপনার রিপোর্টটি সফলভাবে অ্যাডমিনের কাছে পাঠানো হয়েছে', 'success');
    } catch {
      showToast('রিপোর্ট জমা দিতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsSubmittingChatReport(false);
    }
  };

  const policyItems = [
    {
      id: 'contact',
      title: 'বিক্রেতার সাথে কীভাবে যোগাযোগ ও লেনদেন করবেন?',
      content:
        'উপরের ফোন নম্বর ব্যবহার করে আপনি সরাসরি গাড়ির মালিককে কল বা হোয়াটসঅ্যাপ করতে পারেন। চূড়ান্ত পেমেন্টের আগে সরাসরি গাড়িটি পরিদর্শন করে নিন।',
    },
    {
      id: 'inspection',
      title: 'গাড়ির কন্ডিশন ও পরিদর্শন গ্যারান্টি',
      content:
        'কারকেটো-এর সব সার্টিফায়েড গাড়ি ইঞ্জিনের স্বাস্থ্য, ব্রেক, ট্রান্সমিশন এবং কাগজপত্রের সত্যতা সহ ১৫০-পয়েন্ট ডায়াগনস্টিক চেকের মাধ্যমে যাচাই করা হয়।',
    },
    {
      id: 'documents',
      title: 'ভাড়া বা কেনার জন্য প্রয়োজনীয় কাগজপত্র',
      content:
        'গাড়ি গ্রহণ বা মালিকানা হস্তান্তরের সময় গাড়ির মালিকের সাথে সাক্ষাতের জন্য একটি বৈধ জাতীয় পরিচয়পত্র (NID) বা পাসপোর্ট এবং সক্রিয় ড্রাইভিং লাইসেন্স সাথে রাখুন।',
    },
  ];

  if (isLoadingCar) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-zinc-50">
        <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-500">গাড়ির বিস্তারিত তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-zinc-50 px-4 text-center">
        <CarIcon className="w-12 h-12 text-zinc-300 mx-auto" />
        <h2 className="text-xl font-black text-black">গাড়িটি পাওয়া যায়নি</h2>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          আপনি যে গাড়ির বিজ্ঞাপনটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা ডাটাবেসে বিদ্যমান নেই।
        </p>
        <Link href="/buy">
          <Button variant="dark" size="sm">
            অন্যান্য গাড়ি দেখুন
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* 1. CENTERED BLACK HERO HEADER (Without the pill badge) */}
      <section className="relative bg-black text-white py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src={car.coverImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {car.title}
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              হোম
            </Link>
            <span>/</span>
            <Link href={isRental ? '/rent' : '/buy'} className="hover:text-white transition-colors">
              {isRental ? 'গাড়ি ভাড়া' : 'গাড়ি কিনুন'}
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{car.brand} {car.model}</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* MOBILE ONLY: Image Slider shown FIRST at top on mobile */}
        <div className="block lg:hidden mb-6">
          <ImageSlider
            images={car.images.length > 0 ? car.images : [car.coverImage].filter(Boolean)}
            title={car.title}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Pricing, Contact Owner & Specs (4 Cols) - appears 2nd on mobile, left sidebar on desktop */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-card space-y-6">
              {/* Pricing Header */}
              <div className="border-b border-zinc-100 pb-4 flex items-center justify-between">
                <div>
                  {isRental ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-black">
                        {formatPrice(car.rentalPrice || 289)}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        / দিন
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        সরাসরি ক্রয় মূল্য
                      </span>
                      <span className="text-3xl sm:text-4xl font-black text-black">
                        {formatPrice(car.salePrice || car.price || 89000)}
                      </span>
                    </div>
                  )}
                  <p className="text-xs font-bold text-zinc-500 mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{car.location}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm ring-4 ring-rose-50'
                      : 'bg-white border-zinc-200 text-zinc-400 hover:text-rose-600 hover:border-rose-200'
                  }`}
                  title={isWishlisted ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় যুক্ত করুন'}
                >
                  <Heart
                    className={`w-5 h-5 transition-all duration-200 ${
                      isWishlisted
                        ? 'fill-rose-600 text-rose-600 stroke-rose-600'
                        : 'text-zinc-400 stroke-[2]'
                    }`}
                  />
                </button>
              </div>

              {/* DIRECT SELLER CONTACT & PROFILE BOX */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3.5">
                {/* Seller Profile Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-black" />
                    <span>বিজ্ঞাপনদাতা / বিক্রেতা</span>
                  </span>
                  {sellerDetails?.isVerified && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>ভেরিফাইড</span>
                    </span>
                  )}
                </div>

                {/* Seller Identity Card with Clickable Profile Link */}
                <div className="p-3 rounded-xl bg-white border border-zinc-200 flex items-center gap-3 shadow-xs">
                  <Link
                    href={sellerDetails?.profileUrl || '#'}
                    className="relative shrink-0 group block"
                    title="বিক্রেতার প্রোফাইল দেখুন"
                  >
                    {sellerDetails?.avatar ? (
                      <img
                        src={sellerDetails.avatar}
                        alt={sellerDetails.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-zinc-200 group-hover:border-black transition-colors"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-base font-black group-hover:bg-zinc-800 transition-colors">
                        {(sellerDetails?.name || 'গ').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={sellerDetails?.profileUrl || '#'}
                      className="group flex items-center gap-1 hover:text-black transition-colors"
                    >
                      <h4 className="text-sm font-black text-black group-hover:underline truncate">
                        {sellerDetails?.name || 'গাড়ির মালিক / বিক্রেতা'}
                      </h4>
                      <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-black shrink-0 transition-colors" />
                    </Link>
                    <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">
                      {sellerDetails?.roleBadge}
                      {sellerDetails?.memberSince ? ` • ${sellerDetails.memberSince}` : ''}
                    </p>
                    <Link
                      href={sellerDetails?.profileUrl || '#'}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline mt-0.5"
                    >
                      <span>প্রোফাইল ও সকল গাড়ি দেখুন</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-black" />
                    <span>সরাসরি যোগাযোগ</span>
                  </span>
                  {isCopied && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <Check className="w-3 h-3" />
                      <span>কপি হয়েছে!</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handlePhoneClick}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-white border border-zinc-200 hover:border-black transition-all group shadow-sm text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-black">
                        {isPhoneRevealed ? rawPhone : maskedPhone}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-semibold">
                        {isPhoneRevealed ? 'নম্বর কপি করতে ক্লিক করুন' : 'নম্বর দেখতে ও কপি করতে ক্লিক করুন'}
                      </p>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-zinc-100 group-hover:bg-black group-hover:text-white transition-colors text-zinc-700">
                    <Copy className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isPhoneRevealed && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${rawPhone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>কল করুন</span>
                    </a>
                    <a
                      href={`https://wa.me/${rawPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
                  </div>
                )}

                {isOwner ? (
                  <div className="p-3.5 rounded-2xl bg-zinc-100 border border-zinc-200 text-center space-y-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      এটি আপনার নিজের গাড়ির বিজ্ঞাপন
                    </span>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      বিজ্ঞাপনের তথ্য বা ছবি পরিবর্তন করতে নিচের বাটনে চাপ দিন।
                    </p>
                    <Link
                      href={`/provider/cars/edit/${car._id}`}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>গাড়ি সম্পাদনা করুন</span>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="dark"
                    size="md"
                    onClick={handleChatButtonClick}
                    className="w-full text-xs font-bold shadow-sm"
                    leftIcon={<MessageCircle className="w-4 h-4" />}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>মালিকের সাথে লাইভ চ্যাট করুন</span>
                    </span>
                  </Button>
                )}
              </div>

              {/* Specs Table */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <span className="text-zinc-500 font-semibold">ব্র্যান্ড / মেক</span>
                  <span className="font-extrabold text-black text-sm">{car.brand}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <span className="text-zinc-500 font-semibold">গাড়ির মডেল</span>
                  <span className="font-extrabold text-black text-sm">{car.model}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <span className="text-zinc-500 font-semibold">মডেল সাল</span>
                  <span className="font-bold text-black">{car.year}</span>
                </div>

                {car.condition && (
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                    <span className="text-zinc-500">কন্ডিশন</span>
                    <span className="font-bold text-black capitalize">
                      {car.condition === 'new' ? 'ব্র্যান্ড নিউ (০ কি.মি.)' : car.condition === 'certified' ? 'সার্টিফায়েড প্রি-ওনড' : 'ব্যবহৃত / প্রি-ওনড'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <span className="text-zinc-500">মাইলেজ</span>
                  <span className="font-bold text-black">
                    {car.condition === 'new' ? '০ কি.মি.' : `${(car.mileage || car.specs?.mileage || 0).toLocaleString()} কি.মি.`}
                  </span>
                </div>

                {car.engineCapacity && (
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                    <span className="text-zinc-500">ইঞ্জিন ক্ষমতা</span>
                    <span className="font-bold text-black">{car.engineCapacity}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <span className="text-zinc-500">ট্রান্সমিশন</span>
                  <span className="font-bold text-black">{car.specs?.transmission || car.transmission || 'Automatic'}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <span className="text-zinc-500">জ্বালানির ধরন</span>
                  <span className="font-bold text-black">{car.specs?.fuelType || car.fuelType || 'Petrol'}</span>
                </div>

                {car.color && (
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                    <span className="text-zinc-500">বাহ্যিক রঙ</span>
                    <span className="font-bold text-black">{car.color}</span>
                  </div>
                )}

                {car.registrationYear && (
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                    <span className="text-zinc-500">রেজিস্ট্রেশন সাল</span>
                    <span className="font-bold text-black">{car.registrationYear}</span>
                  </div>
                )}

                {car.vin && (
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                    <span className="text-zinc-500">ভিআইএন / চ্যাসিস</span>
                    <span className="font-bold text-black font-mono tracking-wider">
                      {car.vin.length > 8 ? `${car.vin.slice(0, 4)}•••••••${car.vin.slice(-3)}` : '••••••••'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <span className="text-zinc-500">আসন / যাত্রী সংখ্যা</span>
                  <span className="font-bold text-black">{car.specs?.passengers || car.seats || 4} সিট</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <span className="text-zinc-500">দরজা</span>
                  <span className="font-bold text-black">{car.specs?.doors || car.doors || 4}টি দরজা</span>
                </div>

                <div className="flex items-center justify-between py-1.5 text-zinc-600">
                  <span className="text-zinc-500">এয়ার কন্ডিশন (A/C)</span>
                  <span className="font-bold text-black">
                    {car.specs?.airCondition !== undefined ? (car.specs.airCondition ? 'হ্যাঁ' : 'না') : 'হ্যাঁ'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Gallery, Features, Amenities & Reviews (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* DESKTOP ONLY: Image Slider */}
            <div className="hidden lg:block">
              <ImageSlider
                images={car.images.length > 0 ? car.images : [car.coverImage].filter(Boolean)}
                title={car.title}
              />
            </div>

            {/* Quick Spec Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">ব্র্যান্ড</span>
                <p className="text-sm font-black text-black truncate">{car.brand}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">মডেল</span>
                <p className="text-sm font-black text-black truncate">{car.model}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">সাল</span>
                <p className="text-sm font-black text-black">{car.year}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">ট্রান্সমিশন</span>
                <p className="text-sm font-black text-black truncate">{car.specs?.transmission || car.transmission || 'Automatic'}</p>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <Milestone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">সরাসরি মালিকের সাথে যোগাযোগ</h4>
                  <p className="text-xs text-zinc-500">কোনো মধ্যস্বত্বভোগী কমিশন বা অতিরিক্ত ফি নেই</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">১৫০-পয়েন্ট সার্টিফায়েড</h4>
                  <p className="text-xs text-zinc-500">সম্পূর্ণ ডায়াগনস্টিক ও কাগজপত্র যাচাইকৃত</p>
                </div>
              </div>
            </div>

            {/* General Information Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>গাড়ির সংক্ষিপ্ত বিবরণ</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                এই গাড়িটি সম্পর্কে বিস্তারিত
              </h2>

              {/* Seller Description */}
              {car.description && (
                <DescriptionBlock description={car.description} />
              )}
            </div>


            {/* Technical Specifications Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>টেকনিক্যাল স্পেসিফিকেশন</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                {isRental ? 'ভাড়ার গাড়ির মূল স্পেসিফিকেশন' : 'গাড়ির বিস্তারিত স্পেসিফিকেশন'}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">কন্ডিশন</span>
                  <span className="text-xs sm:text-sm font-black text-black capitalize">
                    {car.condition === 'new' ? 'ব্র্যান্ড নিউ' : car.condition === 'certified' ? 'সার্টিফায়েড' : 'ব্যবহৃত'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">মাইলেজ</span>
                  <span className="text-xs sm:text-sm font-black text-black">
                    {car.condition === 'new' ? '০ কি.মি.' : `${(car.mileage || car.specs?.mileage || 0).toLocaleString()} কি.মি.`}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">জ্বালানির ধরন</span>
                  <span className="text-xs sm:text-sm font-black text-black">
                    {car.specs?.fuelType || car.fuelType || 'Petrol'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">ট্রান্সমিশন</span>
                  <span className="text-xs sm:text-sm font-black text-black">
                    {car.specs?.transmission || car.transmission || 'Automatic'}
                  </span>
                </div>

                {car.engineCapacity && (
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">ইঞ্জিন</span>
                    <span className="text-xs sm:text-sm font-black text-black">{car.engineCapacity}</span>
                  </div>
                )}

                {car.color && (
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">বাহ্যিক রঙ</span>
                    <span className="text-xs sm:text-sm font-black text-black">{car.color}</span>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">আসন সংখ্যা</span>
                  <span className="text-xs sm:text-sm font-black text-black">
                    {car.specs?.passengers || car.seats || 4} জন যাত্রী
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">মডেল সাল</span>
                  <span className="text-xs sm:text-sm font-black text-black">{car.year}</span>
                </div>

                {car.registrationYear && (
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">রেজিস্ট্রেশন</span>
                    <span className="text-xs sm:text-sm font-black text-black">{car.registrationYear}</span>
                  </div>
                )}

                {car.vin && (
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">ভিআইএন (সুরক্ষিত)</span>
                    <span className="text-xs sm:text-sm font-black text-black font-mono">
                      {car.vin.length > 8 ? `${car.vin.slice(0, 4)}•••••••${car.vin.slice(-3)}` : '••••••••'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities Section (If available) */}
            {car.amenities && car.amenities.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>সুবিধা ও ফিচারসমূহ</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-black">
                  গাড়ির ফিচার ও সরঞ্জামাদি
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {car.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ / Policies */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ক্রেতা ও ভাড়াগ্রহীতা নির্দেশিকা</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                গুরুত্বপূর্ণ তথ্য ও নিরাপত্তা নির্দেশিকা
              </h2>

              <Accordion items={policyItems} defaultOpenId="contact" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIMILAR / RELATED VEHICLES SECTION (3 or 6 in 3-Column Grid) */}
      {relatedCars.length > 0 && (
        <section className="py-16 bg-white border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isRental ? 'আরও ভাড়ার গাড়ি' : 'সমজাতীয় বিক্রয়যোগ্য গাড়ি'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-black">
                  {isRental ? 'সমজাতীয় ভাড়ার গাড়িসমূহ' : 'আপনার আরও পছন্দ হতে পারে'}
                </h2>
                <p className="text-zinc-500 text-xs sm:text-sm max-w-xl">
                  {isRental
                    ? 'স্বচ্ছ মূল্যে এবং সাশ্রয়ী রেটে ভাড়ার জন্য অন্যান্য যাচাইকৃত গাড়িগুলো দেখুন।'
                    : 'সরাসরি মালিকের যোগাযোগ এবং যাচাইকৃত কাগজপত্র সহ বিক্রয়ের জন্য অন্যান্য গাড়িগুলো দেখুন।'}
                </p>
              </div>

              <Link href={isRental ? '/rent' : '/buy'}>
                <Button
                  variant="outline"
                  size="md"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  {isRental ? 'সব ভাড়ার গাড়ি দেখুন' : 'বিক্রয়ের সব গাড়ি দেখুন'}
                </Button>
              </Link>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedCars.map((relatedCar) => (
                <CarCard key={relatedCar._id} car={relatedCar} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOGIN REQUIRED MODAL PROMPT */}
      {loginPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-zinc-200 shadow-2xl text-center space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-zinc-100 text-black flex items-center justify-center mx-auto border border-zinc-200 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-black">
                {loginPromptReason === 'chat'
                  ? 'মালিকের সাথে লাইভ চ্যাট করতে লগ ইন করুন'
                  : loginPromptReason === 'wishlist'
                  ? 'গাড়িটি সেভ করতে লগ ইন করুন'
                  : 'যোগাযোগের তথ্য দেখতে লগ ইন করুন'}
              </h3>
              <p className="text-xs text-zinc-500">
                {loginPromptReason === 'chat'
                  ? 'গাড়ির মালিকের সাথে রিয়েল-টাইম মেসেজিং করতে এবং আপনার কথোপকথন সুরক্ষিত রাখতে সাইন ইন বা রেজিস্টার করুন।'
                  : loginPromptReason === 'wishlist'
                  ? 'আপনার পছন্দের তালিকায় গাড়িটি যুক্ত রাখতে অনুগ্রহ করে সাইন ইন বা রেজিস্টার করুন।'
                  : 'গাড়ির মালিকদের স্প্যাম থেকে সুরক্ষিত রাখতে ফোন নম্বর দেখার জন্য অনুগ্রহ করে সাইন ইন বা রেজিস্টার করুন।'}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="dark"
                size="md"
                onClick={() => router.push(`/login?redirect=/cars/${slug}`)}
                className="w-full font-bold shadow-md hover:bg-black"
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                {loginPromptReason === 'chat' ? 'চ্যাট করতে লগ ইন করুন' : 'লগ ইন করুন'}
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => router.push(`/register?redirect=/cars/${slug}`)}
                className="w-full font-bold"
              >
                ফ্রি অ্যাকাউন্ট খুলুন
              </Button>

              <button
                type="button"
                onClick={() => setLoginPromptOpen(false)}
                className="text-xs font-semibold text-zinc-400 hover:text-black transition-colors pt-2 block mx-auto"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE REAL-TIME CHAT WITH VEHICLE OWNER MODAL */}
      {inquiryModalOpen && !isOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
            {/* Chat Header */}
            <div className="bg-black text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={car.coverImage}
                    alt={car.title}
                    className="w-12 h-12 rounded-2xl object-cover border border-zinc-700"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-black" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={sellerDetails?.profileUrl || '#'}
                      className="text-sm sm:text-base font-black text-white hover:underline truncate"
                      title="বিক্রেতার প্রোফাইল দেখুন"
                    >
                      {sellerDetails?.name || (car as any).providerId?.name || 'গাড়ির মালিক / বিক্রেতা'}
                    </Link>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold shrink-0">
                      লাইভ চ্যাট
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {car.title} •{' '}
                    {isRental
                      ? `${formatPrice(car.rentalPrice || 289)}/দিন`
                      : formatPrice(car.salePrice || car.price || 89000)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowChatReportPanel((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold transition-colors cursor-pointer"
                  title="রিপোর্ট বা ব্লক করুন"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>রিপোর্ট / ব্লক</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(false)}
                  className="p-2 rounded-full bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inline Report & Block Drawer inside Chat Modal */}
            {showChatReportPanel && (
              <form
                onSubmit={handleSubmitChatReportInCarModal}
                className="p-4 bg-rose-50 border-b border-rose-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    বিক্রেতা বা চ্যাট রিপোর্ট / ব্লক করুন
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowChatReportPanel(false)}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    বন্ধ করুন
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'প্রতারণা বা স্ক্যাম সন্দেহ',
                    'অশালীন ভাষা বা আচরণ',
                    'ভুয়া তথ্য বা দাম',
                    'স্প্যাম মেসেজ',
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setChatReportCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        chatReportCategory === cat
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  required
                  value={chatReportReason}
                  onChange={(e) => setChatReportReason(e.target.value)}
                  placeholder="রিপোর্টের কারণ বিস্তারিত লিখুন..."
                  className="w-full p-2.5 rounded-xl border border-rose-200 bg-white text-xs font-medium text-black focus:outline-none focus:border-rose-500"
                />

                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-rose-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chatReportAlsoBlock}
                      onChange={(e) => setChatReportAlsoBlock(e.target.checked)}
                      className="accent-rose-600 rounded"
                    />
                    <span>চ্যাটটি ব্লকও করুন</span>
                  </label>

                  <div className="flex items-center gap-2">
                    {activeThread?._id &&
                      (!activeThread.isBlocked || activeThread.blockedByRole === 'buyer') && (
                        <button
                          type="button"
                          onClick={handleToggleBlockInCarModal}
                          className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-[11px] font-bold hover:bg-black cursor-pointer"
                        >
                          {activeThread.isBlocked ? 'আনব্লক করুন' : 'শুধু ব্লক করুন'}
                        </button>
                      )}
                    <button
                      type="submit"
                      disabled={isSubmittingChatReport || !chatReportReason.trim()}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-[11px] font-bold cursor-pointer"
                    >
                      {isSubmittingChatReport ? 'পাঠানো হচ্ছে...' : 'রিপোর্ট জমা দিন'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Enforce Login: If user is not authenticated, show login CTA */}
            {!user ? (
              <div className="p-6 sm:p-8 text-center space-y-5">
                <div className="h-14 w-14 rounded-2xl bg-zinc-100 text-black flex items-center justify-center mx-auto border border-zinc-200 shadow-sm">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-black">
                    মালিকের সাথে লাইভ চ্যাট করতে লগ ইন করুন
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    গাড়ির মালিকের সাথে সরাসরি কথা বলতে এবং আপনার মেসেজ সংরক্ষণ রাখতে অ্যাকাউন্টে সাইন ইন বা রেজিস্টার করুন।
                  </p>
                </div>
                <div className="space-y-2 pt-1 max-w-xs mx-auto">
                  <Button
                    variant="dark"
                    size="md"
                    onClick={() => router.push(`/login?redirect=/cars/${slug}`)}
                    className="w-full font-bold shadow-md hover:bg-black"
                    rightIcon={<ArrowUpRight className="w-4 h-4" />}
                  >
                    লগ ইন করুন
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => router.push(`/register?redirect=/cars/${slug}`)}
                    className="w-full font-bold"
                  >
                    নতুন অ্যাকাউন্ট খুলুন
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-zinc-50 min-h-[290px] max-h-[420px]">
                  {/* Welcome / Car Context Banner */}
                  <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-sm text-xs text-zinc-600 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-black">
                        {car.title} নিয়ে লাইভ কথোপকথন
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        আপনার মেসেজ সরাসরি গাড়ির মালিকের কাছে পৌঁছাবে এবং মালিক উত্তর দিলে এখানেই তাৎক্ষণিক দেখতে পাবেন।
                      </p>
                    </div>
                  </div>

                  {chatMessages.length === 0 ? (
                    <div className="py-6 text-center space-y-3">
                      <p className="text-xs font-bold text-zinc-400">
                        নিচের যেকোনো একটি প্রশ্নে ক্লিক করুন অথবা আপনার মেসেজ লিখুন:
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {[
                          'গাড়িটি কি এখনো এভেইলেবল আছে?',
                          isRental
                            ? 'ভাড়ার শর্তাবলী ও ডিসকাউন্ট সম্পর্কে জানতে চাই।'
                            : 'এই গাড়িটির সর্বশেষ দাম কত রাখা যাবে?',
                          'আমি গাড়িটি সরাসরি দেখতে ও টেস্ট ড্রাইভ দিতে চাই।',
                          'গাড়ির সব কাগজপত্র কি আপ-টু-ডেট আছে?',
                        ].map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => sendChatMessageText(q)}
                            className="px-3 py-2 rounded-xl bg-white border border-zinc-200 hover:border-black text-xs font-bold text-zinc-800 transition-all shadow-sm text-left"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => {
                      const isBuyer = msg.senderRole === 'buyer';
                      return (
                        <div
                          key={msg._id || idx}
                          className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[10px] font-bold text-zinc-400 mb-1 px-1">
                            {isBuyer ? 'আপনি' : `${msg.senderName || 'গাড়ির মালিক'} (মালিক)`}
                          </span>
                          <div
                            className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                              isBuyer
                                ? 'bg-black text-white rounded-br-none'
                                : 'bg-white text-zinc-900 border border-zinc-200 rounded-bl-none'
                            }`}
                          >
                            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                          </div>
                          <span className="text-[10px] text-zinc-400 mt-1 px-1">
                            {new Date(msg.createdAt).toLocaleTimeString('bn-BD', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Chips Bar when conversation already started */}
                {chatMessages.length > 0 && (
                  <div className="px-4 py-2 bg-zinc-100/80 border-t border-zinc-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {[
                      'সর্বশেষ দাম কত?',
                      'গাড়িটি কোথায় দেখা যাবে?',
                      'কাগজপত্র কি আপ-টু-ডেট?',
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => sendChatMessageText(chip)}
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:border-black text-[11px] font-bold text-zinc-700 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendInquiry}
                  className="p-3.5 sm:p-4 bg-white border-t border-zinc-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="গাড়িটি সম্পর্কে আপনার মেসেজ লিখুন..."
                    className="flex-1 text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:border-black transition-colors"
                  />
                  <Button
                    type="submit"
                    variant="dark"
                    size="md"
                    disabled={!inquiryMessage.trim() || isSendingChat}
                    className="shrink-0 rounded-2xl px-4 py-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
