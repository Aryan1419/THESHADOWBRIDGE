'use client';

import { useEffect } from 'react';

/**
 * Admin layout — forces light mode on all /admin/* routes by setting
 * data-admin="true" on <html>. The dark mode CSS selectors are scoped
 * to html.dark:not([data-admin]), so they won't apply here.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-admin', 'true');

    // Also remove .dark class if present to ensure pure light mode
    const wasDark = html.classList.contains('dark');
    if (wasDark) {
      html.classList.remove('dark');
    }

    return () => {
      html.removeAttribute('data-admin');
      // Restore dark mode if the user had it enabled
      if (wasDark || localStorage.getItem('theme') === 'dark') {
        html.classList.add('dark');
      }
    };
  }, []);

  return <>{children}</>;
}
