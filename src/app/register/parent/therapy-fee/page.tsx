'use client';

import React, { Suspense } from 'react';
import PlacementFeePage from '../placement-fee/page';

export default function TherapyFeePage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-sm font-bold text-primary">Loading Therapy Booking Fee Page...</div>}>
      <PlacementFeePage />
    </Suspense>
  );
}

