'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  LogOut,
  Sprout,
  Menu,
  X,
  LayoutDashboard,
  Phone,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isUrdu = locale === 'ur';

  const navLinks = [
    { href: '/', label: isUrdu ? 'ہوم' : 'Home' },
    { href: '/marketplace', label: isUrdu ? 'مارکیٹ پلیس' : 'Marketplace' },
    { href: '/how-it-works', label: isUrdu ? 'طریقہ کار' : 'How It Works' },
    { href: '/farmers', label: isUrdu ? 'کسان' : 'Farmers' },
    { href: '/buyers', label: isUrdu ? 'خریدار' : 'Buyers' },
    { href: '/about', label: isUrdu ? 'ہمارے بارے میں' : 'About' },
    { href: '/contact', label: isUrdu ? 'رابطہ' : 'Contact' },
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
    <header className="sticky top-0 z-50 w-full">
      {/* Slim Top Institutional Trust Bar */}
      <div className="bg-km-green-800 text-km-green-50 border-b border-km-green-700/80 hidden sm:block">
        <div className="km-container h-9 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-km-green-300 flex-shrink-0" />
            <span>
              {isUrdu
                ? 'زیرو کمیشن براہِ راست زرعی تجارت — پاکستان بھر کے کسانوں اور خریداروں کے لیے'
                : '0% Middleman Commission — Direct Farm-to-Buyer Agricultural Trade Across Pakistan'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:0800547726"
              className="inline-flex items-center gap-1.5 text-km-green-100 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-km-green-300" />
              <span className="tabular-nums font-semibold">0800-KISSAN</span>
            </a>
            <span className="text-km-green-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/contact"
              className="text-km-green-100 hover:text-white transition-colors"
            >
              {isUrdu ? 'مدد و رابطہ' : 'Support'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-km-green-200/80 shadow-km-sm">
        <div className="km-container h-[72px] flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 group"
            aria-label="KissanMandi Home"
          >
            <div className="w-10 h-10 rounded-xl bg-km-green-800 group-hover:bg-km-green-700 transition-colors flex items-center justify-center shadow-km-sm ring-1 ring-km-green-300/30">
              <Sprout className="w-5 h-5 text-km-green-300" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-extrabold text-[19px] sm:text-[21px] text-km-ink tracking-tight">
                {t('appName')}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-km-green-700 mt-1 hidden sm:block">
                {isUrdu ? 'براہِ راست زرعی منڈی' : 'Pakistan Agri-Exchange'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden xl:flex items-center gap-1"
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
                  className={`relative px-3.5 py-2 text-[14px] font-semibold transition-colors rounded-lg ${
                    isActive
                      ? 'text-km-green-800 font-bold'
                      : 'text-km-ink-muted hover:text-km-green-800 hover:bg-km-green-50/70'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 inset-x-3.5 h-[2.5px] rounded-full bg-km-green-700"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Segmented Language Switcher */}
            <div
              role="group"
              aria-label="Language switcher"
              className="inline-flex items-center p-0.5 rounded-xl bg-km-cream-100 border border-km-green-200"
            >
              <button
                type="button"
                onClick={() => setLocale('en')}
                aria-pressed={!isUrdu}
                className={`px-2.5 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                  !isUrdu
                    ? 'bg-white text-km-green-800 shadow-km-sm'
                    : 'text-km-ink-muted hover:text-km-ink'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale('ur')}
                aria-pressed={isUrdu}
                className={`px-2.5 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                  isUrdu
                    ? 'bg-white text-km-green-800 shadow-km-sm'
                    : 'text-km-ink-muted hover:text-km-ink'
                }`}
              >
                اردو
              </button>
            </div>

            <span
              className="hidden sm:block h-5 w-px bg-km-green-200"
              aria-hidden="true"
            />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getPortalHref()}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-km-green-700 hover:bg-km-green-800 text-white text-sm font-semibold shadow-km-sm transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{getPortalLabel()}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  aria-label={t('logout')}
                  title={t('logout')}
                  className="p-2.5 rounded-xl border border-km-green-200 bg-white hover:bg-km-cream-100 text-km-ink-muted hover:text-km-ink transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-km-ink hover:text-km-green-800 hover:bg-km-green-50 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-km-green-700 hover:bg-km-green-800 text-white text-sm font-semibold shadow-km-sm transition-all"
                >
                  <span>{t('signup')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            )}

            {/* Mobile & Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={
                mobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              className="xl:hidden p-2.5 rounded-xl border border-km-green-200 bg-white text-km-ink hover:bg-km-green-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-km-green-200 shadow-km-lg">
          <div className="km-container py-5 space-y-4">
            <nav
              aria-label="Mobile navigation"
              className="grid grid-cols-1 sm:grid-cols-2 gap-1.5"
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
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-km-green-100 text-km-green-800 font-bold'
                        : 'text-km-ink-muted hover:bg-km-cream-100 hover:text-km-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-km-green-100 flex flex-col gap-2.5">
              {user ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                    className="w-full km-btn-outline py-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="km-btn-outline py-3 text-center"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="km-btn-primary py-3 text-center"
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
