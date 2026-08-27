import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-300',
        hoverEffect && 'hover:-translate-y-1 hover:shadow-card-hover hover:border-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
