'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error in KissanMandi:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-8 sm:p-10 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-red-600">
            System Operational Error
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-km-ink tracking-tight">
            Unexpected Exception
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            An unexpected error occurred while loading this page. Our technical team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-km-ink text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-neutral-200 bg-white text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-km-green-700" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
