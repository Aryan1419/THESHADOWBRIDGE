'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-light border border-brand-border ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-center shadow-xs ${
        theme === 'dark'
          ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 hover:bg-amber-400/20'
          : 'bg-purple-900/10 text-primary border-brand-border hover:bg-brand-light'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-amber-300 sm:w-5 sm:h-5" />
      ) : (
        <Moon size={18} className="text-primary sm:w-5 sm:h-5" />
      )}
    </button>
  );
}
