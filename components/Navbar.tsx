'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Globe,
  LogOut,
  Sprout,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isUrdu = locale === 'ur';

  const toggleLanguage = () => {
    setLocale(isUrdu ? 'en' : 'ur');
  };

  const navLinks = [
    { href: '/', label: isUrdu ? 'ہوم' : 'Home' },
    { href: '/how-it-works', label: isUrdu ? 'طریقہ کار' : 'How It Works' },
    { href: '/marketplace', label: isUrdu ? 'مارکیٹ پلیس' : 'Marketplace' },
    { href: '/about', label: isUrdu ? 'ہمارے بارے میں' : 'About' },
    { href: '/contact', label: isUrdu ? 'رابطہ کریں' : 'Contact' },
  ];

  const getPortalHref = () => {
    if (!user) return '/login';
    if (user.role === 'farmer') return '/farmer';
    if (user.role === 'buyer') return '/buyer';
    if (user.role === 'admin') return '/admin';
    return '/';
  };

  const getPortalLabel = () => {
    if (!user) return '';
    if (user.role === 'farmer') return isUrdu ? 'کسان پورٹل' : 'Farmer Portal';
    if (user.role === 'buyer') return isUrdu ? 'خریدار پورٹل' : 'Buyer Portal';
    return isUrdu ? 'ایڈمن پورٹل' : 'Admin Portal';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-km-green-200/80 shadow-km-sm">
      <div className="km-container h-16 sm:h-[72px] flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 group"
          aria-label="KissanMandi Home"
        >
          <div className="w-10 h-10 rounded-xl bg-km-green-700 group-hover:bg-km-green-800 transition-colors flex items-center justify-center shadow-km-sm">
            <Sprout className="w-5 h-5 text-km-green-200" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-lg sm:text-xl text-km-ink tracking-tight">
              {t('appName')}
            </span>
            <span className="text-[11px] font-semibold text-km-green-700 hidden sm:block">
              {isUrdu ? 'براہِ راست زرعی منڈی' : 'Direct Agri Marketplace'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-1"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-km-green-100 text-km-green-800 font-bold'
                    : 'text-km-ink-muted hover:text-km-green-800 hover:bg-km-green-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={isUrdu ? 'Switch to English' : 'Switch to Urdu'}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-km-green-200 bg-km-cream-100 hover:bg-km-green-50 hover:border-km-green-400 text-km-ink font-bold text-xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-km-green-700" />
            <span>{isUrdu ? 'English' : 'اردو'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={getPortalHref()}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-km-green-700 hover:bg-km-green-800 text-white text-xs font-bold shadow-km-sm transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{getPortalLabel()}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label={t('logout')}
                title={t('logout')}
                className="p-2 rounded-xl border border-km-green-200 text-km-ink-muted hover:text-km-green-800 hover:bg-km-green-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold text-km-green-800 hover:bg-km-green-50 transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-km-green-700 hover:bg-km-green-800 text-white text-sm font-bold shadow-km-sm transition-colors"
              >
                {t('signup')}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 rounded-xl border border-km-green-200 text-km-ink hover:bg-km-green-50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-km-green-200/80 shadow-km-md">
          <div className="km-container py-4 space-y-2">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname?.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-km-green-100 text-km-green-800'
                        : 'text-km-ink-muted hover:bg-km-cream-100 hover:text-km-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-km-green-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href={getPortalHref()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full km-btn-primary py-3"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{getPortalLabel()}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full km-btn-outline py-2.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="km-btn-outline py-2.5 text-center"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="km-btn-primary py-2.5 text-center"
                  >
                    {t('signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
