import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark' | 'white' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-black hover:bg-zinc-800 text-white shadow-glow focus:ring-zinc-700 border border-black rounded-full',
      dark:
        'bg-zinc-900 hover:bg-black text-white focus:ring-zinc-800 rounded-full border border-zinc-800',
      white:
        'bg-white hover:bg-zinc-100 text-black focus:ring-zinc-300 rounded-full border border-zinc-200 shadow-sm',
      secondary:
        'bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200 hover:border-zinc-300 focus:ring-zinc-300 rounded-full shadow-sm',
      outline:
        'bg-transparent border border-black text-black hover:bg-black hover:text-white focus:ring-zinc-400 rounded-full',
      ghost:
        'bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-black rounded-full',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 rounded-full',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2 font-semibold',
      lg: 'text-base px-7 py-3.5 gap-2.5 font-bold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
