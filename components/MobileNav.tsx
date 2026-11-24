'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  PlusCircle,
  List,
  ArrowDownToLine,
  ShoppingCart,
  LayoutDashboard,
} from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav
      aria-label="Mobile quick actions"
      className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-km-green-200 shadow-km-lg z-50 h-16 flex items-center justify-around px-2"
    >
      {user.role === 'farmer' ? (
        <>
          <Link
            href="/farmer"
            className={`flex flex-col items-center justify-center w-full py-1.5 rounded-xl transition-colors ${
              pathname === '/farmer'
                ? 'text-km-green-800 font-extrabold bg-km-green-50'
                : 'text-km-ink-muted'
            }`}
          >
            <List className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">{t('myListings')}</span>
          </Link>
          <Link
            href="/farmer/post"
            className={`flex flex-col items-center justify-center w-full py-1.5 rounded-xl transition-colors ${
              pathname === '/farmer/post'
                ? 'text-km-green-800 font-extrabold bg-km-green-50'
                : 'text-km-ink-muted'
            }`}
          >
            <PlusCircle className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">{t('postProduce')}</span>
          </Link>
          <Link
            href="/farmer/bids"
            className={`flex flex-col items-center justify-center w-full py-1.5 rounded-xl transition-colors ${
              pathname === '/farmer/bids'
                ? 'text-km-green-800 font-extrabold bg-km-green-50'
                : 'text-km-ink-muted'
            }`}
          >
            <ArrowDownToLine className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">{t('bidsReceived')}</span>
          </Link>
        </>
      ) : user.role === 'admin' ? (
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center w-full py-1.5 rounded-xl transition-colors ${
            pathname === '/admin'
              ? 'text-km-green-800 font-extrabold bg-km-green-50'
              : 'text-km-ink-muted'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Admin</span>
        </Link>
      ) : (
        <>
          <Link
            href="/buyer"
            className={`flex flex-col items-center justify-center w-full py-1.5 rounded-xl transition-colors ${
              pathname === '/buyer'
                ? 'text-km-green-800 font-extrabold bg-km-green-50'
                : 'text-km-ink-muted'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">{t('browseProduce')}</span>
          </Link>
        </>
      )}
    </nav>
  );
}
