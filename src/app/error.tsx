'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-light/40 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white border border-brand-border rounded-3xl p-8 sm:p-10 text-center shadow-sm space-y-5">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary">
          Something went wrong
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-primary">
          Unable to load this page right now
        </h1>
        <p className="text-sm text-brand-muted leading-relaxed">
          An unexpected error occurred. Please retry, or return to the homepage to continue exploring The Shadow Bridge.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-gradient px-6 py-3 rounded-full text-sm font-bold text-white shadow cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-sm font-bold border border-brand-border text-primary hover:bg-brand-light transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
