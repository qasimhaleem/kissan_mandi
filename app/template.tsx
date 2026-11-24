'use client';

import React from 'react';

/**
 * Next.js App Router Template
 * Unlike layout.tsx which persists across navigations, template.tsx
 * remounts on every route change, triggering a hardware-accelerated
 * smooth entrance transition for every page navigation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-page-enter w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
