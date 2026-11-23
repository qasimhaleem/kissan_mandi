'use client';

import React from 'react';

export default function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-2xl border border-km-green-200/60 overflow-hidden shadow-km-sm animate-pulse"
      aria-hidden="true"
    >
      <div className="aspect-[4/3] w-full bg-km-cream-200" />
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-km-cream-200 rounded-lg" />
          <div className="h-3.5 w-1/2 bg-km-cream-200 rounded-lg" />
        </div>
        <div className="h-16 w-full bg-km-cream-100 rounded-xl" />
        <div className="flex justify-between">
          <div className="h-3.5 w-1/3 bg-km-cream-200 rounded-lg" />
          <div className="h-3.5 w-1/3 bg-km-cream-200 rounded-lg" />
        </div>
        <div className="h-10 w-full bg-km-green-100 rounded-xl" />
      </div>
    </div>
  );
}
