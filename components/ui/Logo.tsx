import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dark' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  className,
  size = 'md',
  ...props
}) => {
  const isWhite = variant === 'white';
  const logoSrc = isWhite ? '/logo-white.png' : '/logo-black.png';

  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  };

  return (
    <div className={cn('inline-flex items-center select-none', className)} {...props}>
      <img
        src={logoSrc}
        alt="Carketo"
        className={cn('w-auto object-contain transition-all', heights[size])}
      />
    </div>
  );
};
