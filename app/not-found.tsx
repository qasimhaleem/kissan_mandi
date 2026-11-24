import React from 'react';
import Link from 'next/link';
import { Sprout, Home, ShoppingCart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-8 sm:p-10 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-km-green-50 border border-km-green-200 text-km-green-800 flex items-center justify-center mx-auto shadow-sm">
          <Sprout className="w-7 h-7 text-km-green-700" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Error 404 · Page Not Found
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-km-ink tracking-tight">
            Harvest Batch Not Found
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            The agricultural page or marketplace listing you are looking for may have concluded, been moved, or does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-km-ink text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/marketplace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-neutral-200 bg-white text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-km-green-700" />
            <span>Browse Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
