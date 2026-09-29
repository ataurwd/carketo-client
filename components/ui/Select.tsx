'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  id,
  label,
  placeholder = 'Select one',
  value,
  onChange,
  options,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  leftIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { value, label } format
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
          const nextIndex = currentIndex < normalizedOptions.length - 1 ? currentIndex + 1 : 0;
          onChange(normalizedOptions[nextIndex].value);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : normalizedOptions.length - 1;
          onChange(normalizedOptions[prevIndex].value);
        }
      }
    },
    [disabled, isOpen, normalizedOptions, value, onChange]
  );

  const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className={cn('w-full space-y-1.5', className)} ref={containerRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
          {required && !label.includes('*') && ' *'}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        {/* Trigger Button */}
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            'w-full h-11 flex items-center justify-between rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-left transition-all duration-150',
            'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
            leftIcon && 'pl-10',
            'pr-10',
            disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200',
            !disabled && 'cursor-pointer hover:border-slate-300',
            isOpen && 'border-black ring-2 ring-black/10',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-200'
          )}
        >
          <span
            className={cn(
              'truncate block',
              selectedOption ? 'font-medium text-slate-900' : 'text-slate-400 font-normal'
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </button>

        {/* Custom Chevron Indicator - Aligned at right-3.5 */}
        <div className="pointer-events-none absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-200 text-slate-400',
              isOpen && 'rotate-180 text-slate-900',
              disabled && 'opacity-40'
            )}
          />
        </div>

        {/* Floating Dropdown Menu */}
        {isOpen && (
          <div
            role="listbox"
            tabIndex={-1}
            className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150"
          >
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-100 text-left',
                    isSelected
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-black'
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-black shrink-0 stroke-[2.5] ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
