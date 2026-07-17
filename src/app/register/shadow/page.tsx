'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToShadowTeacher() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/register/shadow-teacher');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-light">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-brand-dark">Redirecting to Shadow Teacher Registration...</p>
      </div>
    </div>
  );
}
