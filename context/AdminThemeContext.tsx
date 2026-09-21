'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AdminTheme = 'light' | 'dark';

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
  setTheme: (theme: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to 'light' mode as explicitly requested
  const [theme, setThemeState] = useState<AdminTheme>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('karketo_admin_theme') as AdminTheme | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
      } else {
        // Default is explicitly light mode
        setThemeState('light');
      }
    } catch {
      // LocalStorage unavailable
    }
    setIsReady(true);
  }, []);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('karketo_admin_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const nextTheme: AdminTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div
        className={`admin-root min-h-screen transition-colors duration-200 ${
          theme === 'light' ? 'admin-light' : 'admin-dark'
        }`}
        data-theme={theme}
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
