'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: string | React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              'rounded-xl border transition-all duration-200 overflow-hidden',
              isOpen
                ? 'bg-brand text-white border-brand shadow-md'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            )}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-sm transition-colors"
            >
              <span>{item.title}</span>
              <span
                className={cn(
                  'ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform',
                  isOpen ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                )}
              >
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-white/10 px-6 py-4 text-xs sm:text-sm text-white/90 leading-relaxed">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
