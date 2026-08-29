'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  value: Date | string | null;
  onChange: (date: Date) => void;
  maxMonthsAhead?: number; // default 2
  className?: string;
  helperText?: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePicker: React.FC<DatePickerProps> = ({
  label = 'Visibility Expiration Date',
  value,
  onChange,
  maxMonthsAhead = 2,
  className = '',
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize selected date
  const selectedDate = value ? new Date(value) : null;

  // Date boundaries
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + maxMonthsAhead);
  maxDate.setHours(23, 59, 59, 999);

  // Current calendar view month & year
  const [viewYear, setViewYear] = useState<number>(
    selectedDate ? selectedDate.getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    selectedDate ? selectedDate.getMonth() : today.getMonth()
  );

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick Preset Helper
  const handlePresetSelect = (days: number) => {
    const newDate = new Date(today);
    newDate.setDate(newDate.getDate() + days);
    if (newDate > maxDate) {
      onChange(maxDate);
    } else {
      onChange(newDate);
    }
    setViewYear(newDate.getFullYear());
    setViewMonth(newDate.getMonth());
    setIsOpen(false);
  };

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Calendar matrix calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  // Days remaining calculation
  const getDaysRemaining = () => {
    if (!selectedDate) return null;
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className={`relative space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-zinc-800 tracking-tight">
            {label}
          </label>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Max 2 Months (60 Days)
          </span>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-150 ${
          isOpen
            ? 'border-black ring-2 ring-black/5 bg-white shadow-md'
            : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/50'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center text-black shrink-0">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div className="truncate">
            {selectedDate ? (
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-black truncate">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {daysRemaining !== null && (
                  <span className="shrink-0 px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-black">
                    {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} active
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs sm:text-sm font-semibold text-zinc-400">
                Choose visibility expiry date...
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold shrink-0 ml-2">
          <span>Change</span>
        </div>
      </button>

      {helperText && <p className="text-[11px] text-zinc-400 font-medium">{helperText}</p>}

      {/* Modern Popover Calendar */}
      {isOpen && (
        <div className="absolute left-0 sm:right-auto mt-2 w-full sm:w-84 rounded-3xl bg-white border border-zinc-200 shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Quick Visibility Presets</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '7 Days', days: 7 },
                { label: '15 Days', days: 15 },
                { label: '30 Days', days: 30 },
                { label: '60 Days', days: 60 },
              ].map((preset) => {
                const presetTarget = new Date(today);
                presetTarget.setDate(presetTarget.getDate() + preset.days);
                const isSelected =
                  selectedDate &&
                  selectedDate.toDateString() === presetTarget.toDateString();

                return (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => handlePresetSelect(preset.days)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-3">
            {/* Header: Month & Year Nav */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-black">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 transition-colors"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {WEEKDAY_NAMES.map((w) => (
                <span key={w} className="text-[10px] font-bold text-zinc-400 uppercase">
                  {w}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty placeholder cells for previous month padding */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8 w-8" />
              ))}

              {/* Days of current month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNumber = i + 1;
                const cellDate = new Date(viewYear, viewMonth, dayNumber);
                cellDate.setHours(0, 0, 0, 0);

                const isPast = cellDate < today;
                const isTooFar = cellDate > maxDate;
                const isDisabled = isPast || isTooFar;

                const isSelected =
                  selectedDate &&
                  cellDate.getFullYear() === selectedDate.getFullYear() &&
                  cellDate.getMonth() === selectedDate.getMonth() &&
                  cellDate.getDate() === selectedDate.getDate();

                const isToday = cellDate.getTime() === today.getTime();

                return (
                  <button
                    key={dayNumber}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      onChange(cellDate);
                      setIsOpen(false);
                    }}
                    className={`h-8 w-8 mx-auto rounded-xl flex items-center justify-center text-xs font-bold transition-all relative ${
                      isDisabled
                        ? 'text-zinc-300 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-black text-white shadow-md scale-105'
                        : isToday
                        ? 'bg-zinc-100 text-black font-black hover:bg-zinc-200'
                        : 'text-zinc-800 hover:bg-zinc-100'
                    }`}
                  >
                    {dayNumber}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-black" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-zinc-100 flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold">
            <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
            <span>Listing automatically hides after expiry. Max 2 months.</span>
          </div>
        </div>
      )}
    </div>
  );
};
