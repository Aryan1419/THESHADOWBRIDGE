'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read current state from <html> class (set by the inline FOUC script)
    const htmlEl = document.documentElement;
    setIsDark(htmlEl.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const htmlEl = document.documentElement;
    const willBeDark = !isDark;

    if (willBeDark) {
      htmlEl.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlEl.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setIsDark(willBeDark);
  };

  // Prevent hydration mismatch — render a neutral placeholder before mount
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="p-2 rounded-xl border border-brand-border bg-brand-light/60 text-primary transition-all cursor-pointer shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
      >
        <Sun size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-xs ${
        isDark
          ? 'bg-[#2A2440] border-[#3D3258] text-amber-300 hover:bg-[#342852] hover:border-amber-400/40'
          : 'bg-brand-light/60 border-brand-border text-primary hover:bg-brand-light hover:border-primary/40'
      }`}
    >
      <span className="relative flex items-center justify-center w-4 h-4 sm:w-[18px] sm:h-[18px]">
        <Sun
          size={16}
          className={`absolute inset-0 m-auto sm:w-[18px] sm:h-[18px] transition-all duration-300 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          size={16}
          className={`absolute inset-0 m-auto sm:w-[18px] sm:h-[18px] transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </span>
    </button>
  );
}
