'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Globe, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();

  const toggleLanguage = () => {
    setLocale(locale === 'ur' ? 'en' : 'ur');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#FAF6EA] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#8FD19E] flex items-center justify-center font-bold text-white text-xl">
            🌾
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-[#2B2B2B] tracking-tight">
              {t('appName')}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {t('tagline')}
            </span>
          </div>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Visible Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#8FD19E] bg-[#FAF6EA] text-[#2B2B2B] font-bold text-sm hover:bg-[#8FD19E] transition-colors"
            title="Switch Language"
          >
            <Globe className="w-4 h-4 text-[#2B2B2B]" />
            <span>{locale === 'ur' ? 'English' : 'اردو'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-sm font-semibold text-[#2B2B2B]">
                {user.name} ({user.role === 'farmer' ? t('farmer') : t('buyer')})
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-colors"
                title={t('logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-bold text-[#2B2B2B] hover:text-[#6DBE82]"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-bold bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] rounded-lg shadow-sm transition-colors"
              >
                {t('signup')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

