'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Globe, LogOut, Sprout, Menu, X, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLocale(locale === 'ur' ? 'en' : 'ur');
  };

  const navLinks = [
    { href: '/', label: locale === 'ur' ? 'ہوم' : 'Home' },
    { href: '/marketplace', label: locale === 'ur' ? 'مارکیٹ پلیس' : 'Marketplace' },
    { href: '/how-it-works', label: locale === 'ur' ? 'کیسے کام کرتا ہے' : 'How It Works' },
    { href: '/farmers', label: locale === 'ur' ? 'کسانوں کے لیے' : 'For Farmers' },
    { href: '/buyers', label: locale === 'ur' ? 'خریداروں کے لیے' : 'For Buyers' },
    { href: '/about', label: locale === 'ur' ? 'ہمارے بارے میں' : 'About Us' },
    { href: '/mission', label: locale === 'ur' ? 'مشن و ویژن' : 'Mission' },
    { href: '/contact', label: locale === 'ur' ? 'رابطہ کریں' : 'Contact' },
  ];

  const getPortalHref = () => {
    if (!user) return '/login';
    if (user.role === 'farmer') return '/farmer';
    if (user.role === 'buyer') return '/buyer';
    if (user.role === 'admin') return '/admin';
    return '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#8FD19E] flex items-center justify-center font-bold text-[#2B2B2B] shadow-sm">
            <Sprout className="w-5 h-5 text-[#2B2B2B]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-[#2B2B2B] tracking-tight">
              {t('appName')}
            </span>
            <span className="text-xs text-gray-500 font-semibold hidden sm:inline-block">
              {t('tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-[#2B2B2B] border-b-2 border-[#8FD19E] pb-0.5'
                    : 'text-gray-600 hover:text-[#6DBE82]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Visible Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-[#FAF6EA] text-[#2B2B2B] font-bold text-xs hover:border-[#8FD19E] transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#2B2B2B]" />
            <span>{locale === 'ur' ? 'English' : 'اردو'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={getPortalHref()}
                className="px-3 py-1.5 rounded-lg bg-[#FAF6EA] border border-[#8FD19E] text-xs font-bold text-[#2B2B2B] hover:bg-[#8FD19E]/20 transition-colors hidden sm:inline-block"
              >
                {user.role === 'farmer' ? 'Farmer Portal' : user.role === 'buyer' ? 'Buyer Portal' : 'Admin Portal'}
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-colors"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-bold text-[#2B2B2B] hover:text-[#6DBE82]"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-bold bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] rounded-lg shadow-sm transition-colors"
              >
                {t('signup')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-base font-bold ${
                  pathname === link.href
                    ? 'bg-[#8FD19E]/20 text-[#2B2B2B]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <Link
                href={getPortalHref()}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center font-bold text-sm bg-[#8FD19E] text-[#2B2B2B] rounded-xl shadow-sm"
              >
                Go to Portal ({user.name})
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center font-bold text-sm border border-gray-200 rounded-xl"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center font-bold text-sm bg-[#8FD19E] text-[#2B2B2B] rounded-xl shadow-sm"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
