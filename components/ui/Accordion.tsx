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
              'rounded-2xl border transition-all duration-200 overflow-hidden',
              isOpen
                ? 'bg-black text-white border-black shadow-lg'
                : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
            )}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left font-bold text-sm transition-colors"
            >
              <span>{item.title}</span>
              <span
                className={cn(
                  'ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform',
                  isOpen ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-700'
                )}
              >
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-zinc-800 px-6 py-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
