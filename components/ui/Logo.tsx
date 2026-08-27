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
  const fillColor = isWhite ? '#FFFFFF' : '#000000';

  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  };

  return (
    <div className={cn('inline-flex items-center select-none', className)} {...props}>
      <svg
        className={cn('w-auto transition-all', heights[size])}
        viewBox="0 0 460 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="78"
          fill={fillColor}
          style={{
            fontFamily:
              "'Plus Jakarta Sans', 'Inter', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontWeight: 900,
            fontSize: '84px',
            letterSpacing: '-0.04em',
          }}
        >
          carketo
        </text>
      </svg>
    </div>
  );
};
