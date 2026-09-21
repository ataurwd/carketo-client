'use client';

import React from 'react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Sun, Moon } from 'lucide-react';

interface AdminThemeToggleProps {
  className?: string;
}

export const AdminThemeToggle: React.FC<AdminThemeToggleProps> = ({
  className = '',
}) => {
  const { theme, toggleTheme } = useAdminTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label="Toggle admin color scheme"
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border shadow-sm select-none ${
        isLight
          ? 'bg-slate-100 hover:bg-slate-200/80 text-amber-600 border-slate-200 hover:border-slate-300 shadow-slate-200/50'
          : 'bg-zinc-800/90 hover:bg-zinc-700 text-orange-400 border-zinc-700/80 hover:border-zinc-600 shadow-black/20'
      } ${className}`}
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-orange-400 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
