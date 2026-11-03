'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, List, ArrowDownToLine, ShoppingCart, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 h-16 flex items-center justify-around px-2">
      {user.role === 'farmer' ? (
        <>
          <Link
            href="/farmer"
            className={`flex flex-col items-center justify-center w-full py-1 ${
              pathname === '/farmer' ? 'text-[#6DBE82] font-bold' : 'text-[#2B2B2B]'
            }`}
          >
            <List className="w-6 h-6 mb-0.5" />
            <span className="text-xs">{t('myListings')}</span>
          </Link>
          <Link
            href="/farmer/post"
            className={`flex flex-col items-center justify-center w-full py-1 ${
              pathname === '/farmer/post' ? 'text-[#6DBE82] font-bold' : 'text-[#2B2B2B]'
            }`}
          >
            <PlusCircle className="w-6 h-6 mb-0.5" />
            <span className="text-xs">{t('postProduce')}</span>
          </Link>
          <Link
            href="/farmer/bids"
            className={`flex flex-col items-center justify-center w-full py-1 ${
              pathname === '/farmer/bids' ? 'text-[#6DBE82] font-bold' : 'text-[#2B2B2B]'
            }`}
          >
            <ArrowDownToLine className="w-6 h-6 mb-0.5" />
            <span className="text-xs">{t('bidsReceived')}</span>
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/buyer"
            className={`flex flex-col items-center justify-center w-full py-1 ${
              pathname === '/buyer' ? 'text-[#6DBE82] font-bold' : 'text-[#2B2B2B]'
            }`}
          >
            <ShoppingCart className="w-6 h-6 mb-0.5" />
            <span className="text-xs">{t('browseProduce')}</span>
          </Link>
          <Link
            href="/buyer/bids"
            className={`flex flex-col items-center justify-center w-full py-1 ${
              pathname === '/buyer/bids' ? 'text-[#6DBE82] font-bold' : 'text-[#2B2B2B]'
            }`}
          >
            <ArrowDownToLine className="w-6 h-6 mb-0.5" />
            <span className="text-xs">{t('myBids')}</span>
          </Link>
        </>
      )}
    </nav>
  );
}

