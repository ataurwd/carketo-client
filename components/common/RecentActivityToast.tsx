'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, CheckCircle2, KeyRound, ShoppingBag } from 'lucide-react';

interface ActivityItem {
  id: string;
  userName: string;
  action: string;
  actionType: 'rent' | 'sale';
  carTitle: string;
  carImage: string;
  location: string;
  timeAgo: string;
}

// 100% Demo / Mock cars with reliable high-quality car photos
const DEMO_CARS: Array<{
  title: string;
  image: string;
  type: 'rent' | 'sale';
}> = [
  {
    title: 'Toyota Land Cruiser Prado TX-L',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80',
    type: 'rent',
  },
  {
    title: 'Mercedes-Benz GLE 450 4MATIC',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=400&q=80',
    type: 'sale',
  },
  {
    title: 'BMW 530i M-Sport Edition',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80',
    type: 'sale',
  },
  {
    title: 'Toyota HiAce Super GL VIP',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
    type: 'rent',
  },
  {
    title: 'Audi A6 S-Line Matrix LED',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=400&q=80',
    type: 'rent',
  },
  {
    title: 'Lexus RX 350 F-Sport AWD',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
    type: 'sale',
  },
  {
    title: 'Porsche Cayenne Turbo GT',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80',
    type: 'sale',
  },
  {
    title: 'Toyota Noah Hybrid Luxury Van',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=400&q=80',
    type: 'rent',
  },
  {
    title: 'Range Rover Velar R-Dynamic',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80',
    type: 'rent',
  },
  {
    title: 'Tesla Model 3 Long Range AWD',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80',
    type: 'sale',
  },
];

// Diverse realistic demo customer names
const DEMO_NAMES = [
  'Sally Jenkins',
  'Kamrul Hasan',
  'Alex Rivera',
  'Nusrat Jahan',
  'Michael Brown',
  'Farhana Islam',
  'David Chen',
  'Tanvir Ahmed',
  'Sarah Connor',
  'Zubayer Hossain',
  'Jessica Taylor',
  'Arifur Rahman',
  'Emily Watson',
  'Mahmudul Hasan',
  'Sofia Martinez',
  'Sadia Rahman',
  'Adnan Sami',
  'Nazia Sultana',
];

const RENT_ACTIONS = [
  'just booked for rent',
  'just rented this car',
  'rented for 3 days',
  'booked for weekend trip',
  'confirmed rental booking',
];

const SALE_ACTIONS = [
  'just purchased',
  'bought this car',
  'confirmed car purchase',
  'placed booking order',
  'purchased this vehicle',
];

const TIME_AGOS = [
  'Just now',
  '2 minutes ago',
  '4 minutes ago',
  '7 minutes ago',
  '12 minutes ago',
  '25 minutes ago',
  '38 minutes ago',
  '1 hour ago',
  '2 hours ago',
];

const DEMO_LOCATIONS = [
  'Gulshan, Dhaka',
  'Banani, Dhaka',
  'Uttara, Dhaka',
  'Dhanmondi, Dhaka',
  'Chittagong',
  'Sylhet',
  'Mirpur, Dhaka',
  'Bashundhara, Dhaka',
];

export function RecentActivityToast() {
  const pathname = usePathname();
  const [currentActivity, setCurrentActivity] = useState<ActivityItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const lastShownIndexRef = useRef<number>(-1);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Exclude toast on admin or checkout pages
  const isExcludedRoute =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/checkout') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register');

  // Random demo activity generator
  const generateRandomActivity = useCallback((): ActivityItem => {
    let carIndex = Math.floor(Math.random() * DEMO_CARS.length);
    if (DEMO_CARS.length > 1 && carIndex === lastShownIndexRef.current) {
      carIndex = (carIndex + 1) % DEMO_CARS.length;
    }
    lastShownIndexRef.current = carIndex;

    const car = DEMO_CARS[carIndex];
    const isRent = car.type === 'rent';
    const actionsPool = isRent ? RENT_ACTIONS : SALE_ACTIONS;
    const action = actionsPool[Math.floor(Math.random() * actionsPool.length)];
    const userName = DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)];
    const timeAgo = TIME_AGOS[Math.floor(Math.random() * TIME_AGOS.length)];
    const location = DEMO_LOCATIONS[Math.floor(Math.random() * DEMO_LOCATIONS.length)];

    return {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userName,
      action,
      actionType: car.type,
      carTitle: car.title,
      carImage: car.image,
      location,
      timeAgo,
    };
  }, []);

  // Main lifecycle controller
  useEffect(() => {
    if (isExcludedRoute) {
      setIsVisible(false);
      return;
    }

    let isSubscribed = true;

    const scheduleNextShow = (delayMs: number) => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = setTimeout(() => {
        if (!isSubscribed) return;

        const newItem = generateRandomActivity();
        setCurrentActivity(newItem);
        setIsVisible(true);

        // Stay visible for 5.5 seconds, then hide
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          if (!isSubscribed) return;
          setIsVisible(false);

          // Random interval between 8 and 14 seconds before showing the next demo activity
          const nextInterval = 8000 + Math.random() * 6000;
          scheduleNextShow(nextInterval);
        }, 5500);
      }, delayMs);
    };

    // First appearance after 3.5 seconds
    scheduleNextShow(3500);

    return () => {
      isSubscribed = false;
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isExcludedRoute, generateRandomActivity]);

  // Pause timer when mouse hovers over the notification
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (isVisible) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        const nextInterval = 8000 + Math.random() * 6000;
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = setTimeout(() => {
          const newItem = generateRandomActivity();
          setCurrentActivity(newItem);
          setIsVisible(true);
        }, nextInterval);
      }, 3000);
    }
  };

  // Close manually
  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);

    // After manual close, wait 25 seconds before next demo popup
    showTimeoutRef.current = setTimeout(() => {
      const newItem = generateRandomActivity();
      setCurrentActivity(newItem);
      setIsVisible(true);
    }, 25000);
  };

  if (isExcludedRoute || !currentActivity) {
    return null;
  }

  const isRent = currentActivity.actionType === 'rent';

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 max-w-[340px] sm:max-w-[370px] w-[calc(100vw-2rem)] sm:w-auto transition-all duration-500 ease-out transform select-none ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-8 -translate-x-3 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 hover:border-slate-300 p-3 sm:p-3.5 transition-all duration-200">
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-3 pr-4">
          {/* Demo Car Thumbnail (NO LINK - purely visual) */}
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-inner">
            <Image
              src={currentActivity.carImage}
              alt={currentActivity.carTitle}
              fill
              sizes="60px"
              className="object-cover"
              unoptimized
            />
            {/* Small icon badge */}
            <span
              className={`absolute bottom-1 right-1 p-0.5 rounded-md shadow-xs text-white ${
                isRent ? 'bg-amber-600' : 'bg-orange-600'
              }`}
            >
              {isRent ? (
                <KeyRound className="w-2.5 h-2.5" />
              ) : (
                <ShoppingBag className="w-2.5 h-2.5" />
              )}
            </span>
          </div>

          {/* Activity Text Content (NO LINKS - completely non-clickable) */}
          <div className="flex-1 min-w-0">
            {/* Line 1: Customer Name + Action */}
            <p className="text-xs text-slate-800 leading-tight">
              <span className="font-bold text-slate-950">
                {currentActivity.userName}
              </span>{' '}
              <span className="text-slate-500 font-normal">{currentActivity.action}</span>
            </p>

            {/* Line 2: Demo Car Title (Plain text, no link) */}
            <p className="font-bold text-xs sm:text-[13px] text-slate-900 truncate mt-0.5">
              {currentActivity.carTitle}
            </p>

            {/* Line 3: Time ago + Location + Verified badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              <span>{currentActivity.timeAgo}</span>
              <span className="text-slate-300">•</span>
              <span className="truncate max-w-[110px] text-slate-600 font-medium">
                {currentActivity.location}
              </span>
              <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium text-[10px] ml-auto shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* Subtle Live Countdown Line */}
        <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all ${
              isVisible && !isPaused ? 'w-full animate-activity-progress' : 'w-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
