'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[85vh] w-full bg-white text-black flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-2xl w-full mx-auto flex flex-col items-center text-center">
        {/* ── MINIMAL LINE-ART CAR ILLUSTRATION (WRONG TURN) ───────── */}
        <div className="w-full max-w-md sm:max-w-lg mb-8 sm:mb-10 select-none">
          <svg
            viewBox="0 0 540 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto text-black"
            aria-label="Minimalist line art illustration of a modern car taking a wrong turn"
          >
            {/* Road trajectory: straight road that suddenly curves into dead end */}
            <path
              d="M 20 190 L 220 190 C 290 190 350 180 410 140 C 450 115 480 80 510 50"
              stroke="#E4E4E7"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            {/* Diverging wrong-turn dotted track mark */}
            <path
              d="M 220 190 L 520 190"
              stroke="#F4F4F5"
              strokeWidth="2"
              strokeDasharray="4 8"
            />

            {/* Slightly tilted car group representing the off-track turn (-4 deg) */}
            <g transform="translate(140, 60) rotate(-4, 150, 60)">
              {/* Car Body Silhouette */}
              <path
                d="M 30 110 
                   C 45 85, 75 75, 110 75 
                   L 155 75 
                   C 185 50, 215 35, 260 35 
                   L 330 35 
                   C 365 35, 395 55, 415 80 
                   L 440 90 
                   C 460 93, 470 100, 472 112 
                   C 474 122, 465 128, 445 130 
                   L 420 130
                   C 415 110, 395 95, 370 95 
                   C 345 95, 325 110, 320 130
                   L 170 130
                   C 165 110, 145 95, 120 95
                   C 95 95, 75 110, 70 130
                   L 30 130
                   C 20 130, 15 120, 20 115
                   Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Roofline & Window Outline */}
              <path
                d="M 160 75 
                   L 255 42 
                   L 325 42 
                   C 355 42, 380 58, 398 80
                   L 175 80
                   Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* B-Pillar divider */}
              <line
                x1="265"
                y1="42"
                x2="265"
                y2="80"
                stroke="currentColor"
                strokeWidth="2"
              />

              {/* Minimal Door Crease Line */}
              <path
                d="M 175 88 L 335 88"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Rear Door handle tick */}
              <line
                x1="240"
                y1="94"
                x2="255"
                y2="94"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Front Door handle tick */}
              <line
                x1="310"
                y1="94"
                x2="325"
                y2="94"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Front Wheel Assembly */}
              <g transform="translate(370, 130)">
                {/* Outer Tire */}
                <circle cx="0" cy="0" r="28" stroke="currentColor" strokeWidth="2.5" fill="white" />
                {/* Rim Inner Circle */}
                <circle cx="0" cy="0" r="18" stroke="currentColor" strokeWidth="1.5" />
                {/* Center Hub */}
                <circle cx="0" cy="0" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                {/* Geometric Spokes */}
                <line x1="0" y1="-18" x2="0" y2="18" stroke="currentColor" strokeWidth="1.5" />
                <line x1="-18" y1="0" x2="18" y2="0" stroke="currentColor" strokeWidth="1.5" />
              </g>

              {/* Rear Wheel Assembly */}
              <g transform="translate(120, 130)">
                {/* Outer Tire */}
                <circle cx="0" cy="0" r="28" stroke="currentColor" strokeWidth="2.5" fill="white" />
                {/* Rim Inner Circle */}
                <circle cx="0" cy="0" r="18" stroke="currentColor" strokeWidth="1.5" />
                {/* Center Hub */}
                <circle cx="0" cy="0" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                {/* Geometric Spokes */}
                <line x1="0" y1="-18" x2="0" y2="18" stroke="currentColor" strokeWidth="1.5" />
                <line x1="-18" y1="0" x2="18" y2="0" stroke="currentColor" strokeWidth="1.5" />
              </g>

              {/* Headlight outline detail */}
              <path
                d="M 445 95 L 465 100"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Taillight outline detail */}
              <path
                d="M 32 108 L 48 112"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Minimal ground shadow line */}
            <line
              x1="90"
              y1="200"
              x2="490"
              y2="200"
              stroke="#D4D4D8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ── LARGE 404 NUMBER ─────────────────────────────────────── */}
        <p className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-black select-none leading-none">
          ৪০৪
        </p>

        {/* ── HEADLINE & SUPPORTING TEXT ───────────────────────────── */}
        <div className="space-y-3 mt-4 mb-8 sm:mb-10 max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
            ৪০৪ — ভুল পথে চলে এসেছেন
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            মনে হচ্ছে এই রাস্তাটির কোনো অস্তিত্ব নেই। চলুন আপনাকে সঠিক ট্র্যাকে ফিরিয়ে নিয়ে আপনার পছন্দের গাড়িটি খুঁজে পেতে সাহায্য করি।
          </p>
        </div>

        {/* ── CALL TO ACTION BUTTONS ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-10">
          {/* Primary CTA */}
          <Link
            href="/cars"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-black text-white hover:bg-zinc-800 font-bold text-sm tracking-wide transition-colors"
          >
            <span>গাড়িগুলো দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black hover:bg-zinc-100 border border-zinc-300 font-bold text-sm tracking-wide transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>

        {/* ── SMALL NAVIGATION OPTIONS ─────────────────────────────── */}
        <nav aria-label="দ্রুত লিংকসমূহ" className="pt-6 border-t border-zinc-200 w-full max-w-xs sm:max-w-sm">
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-zinc-500">
            <Link
              href="/buy"
              className="hover:text-black transition-colors underline-offset-4 hover:underline"
            >
              গাড়ি কিনুন
            </Link>

            <span className="text-zinc-300 select-none">•</span>

            <Link
              href="/rent"
              className="hover:text-black transition-colors underline-offset-4 hover:underline"
            >
              গাড়ি ভাড়া নিন
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
