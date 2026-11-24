'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import GoogleTranslate from './GoogleTranslate';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Phone,
  ArrowRight,
  PlusCircle,
  List,
  ArrowDownToLine,
  ShoppingCart,
  User as UserIcon,
} from 'lucide-react';

export default function Navbar() {
  const { locale, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isUrdu = locale === 'ur';

  const isFarmerDashboard = pathname?.startsWith('/farmer');
  const isBuyerDashboard = pathname?.startsWith('/buyer') && !pathname?.startsWith('/buyers');
  const isAdminDashboard = pathname?.startsWith('/admin');
  const isDashboardRoute = isFarmerDashboard || isBuyerDashboard || isAdminDashboard;

  // Dedicated Dashboard Workspace Header (Duffel-style minimalist console topbar)
  if (isDashboardRoute) {
    const dashboardHome = isFarmerDashboard
      ? '/farmer'
      : isBuyerDashboard
      ? '/buyer'
      : '/admin';

    const dashboardRoleBadge = isFarmerDashboard
      ? isUrdu
        ? 'کسان ڈیش بورڈ'
        : 'Farmer Dashboard'
      : isBuyerDashboard
      ? isUrdu
        ? 'خریدار ڈیش بورڈ'
        : 'Buyer Dashboard'
      : isUrdu
      ? 'ایڈمن ڈیش بورڈ'
      : 'Admin Dashboard';

    const dashboardTabs = isFarmerDashboard
      ? [
          {
            href: '/farmer',
            label: isUrdu ? 'میری فصلیں' : 'My Listings',
            icon: List,
            exact: true,
          },
          {
            href: '/farmer/post',
            label: isUrdu ? 'فصل پوسٹ کریں' : 'Post Produce',
            icon: PlusCircle,
            exact: false,
          },
          {
            href: '/farmer/bids',
            label: isUrdu ? 'موصولہ بولیاں' : 'Bids Received',
            icon: ArrowDownToLine,
            exact: false,
          },
        ]
      : isBuyerDashboard
      ? [
          {
            href: '/buyer',
            label: isUrdu ? 'فصلیں اور بولیاں' : 'Browse & Bid',
            icon: ShoppingCart,
            exact: true,
          },
        ]
      : [];

    return (
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-sm">
        <div className="km-container h-16 flex items-center justify-between gap-4">
          {/* Dashboard Brand & Workspace Badge */}
          <div className="flex items-center gap-5">
            <Link
              href={dashboardHome}
              className="flex items-center gap-2.5 flex-shrink-0 group"
            >
              <Image
                src="/logo-mark.png"
                alt="KissanMandi"
                width={34}
                height={34}
                className="w-8 h-8 object-contain"
                priority
              />
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-[17px] text-km-ink tracking-tight">
                  KISSAN <span className="text-[#C48C2B]">MANDI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200/70">
                  {dashboardRoleBadge}
                </span>
              </div>
            </Link>

            {/* Dashboard Workspace Sub-Tabs */}
            {dashboardTabs.length > 0 && (
              <nav
                aria-label="Dashboard views"
                className="hidden md:flex items-center gap-1 pl-3 border-l rtl:border-l-0 rtl:border-r border-neutral-200"
              >
                {dashboardTabs.map((tab) => {
                  const isActive = tab.exact
                    ? pathname === tab.href
                    : pathname?.startsWith(tab.href);
                  const Icon = tab.icon;

                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-neutral-900 text-white shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Google Translate Integration */}
            <GoogleTranslate />

            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/80 text-xs font-medium text-neutral-700">
                <UserIcon className="w-3.5 h-3.5 text-km-green-700" />
                <span className="truncate max-w-[130px]">{user.name}</span>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              aria-label={t('logout')}
              title={t('logout')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  const navLinks = [
    { href: '/', label: isUrdu ? 'ہوم' : 'Home' },
    { href: '/marketplace', label: isUrdu ? 'مارکیٹ پلیس' : 'Marketplace' },
    { href: '/how-it-works', label: isUrdu ? 'طریقہ کار' : 'How It Works' },
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
    if (user.role === 'farmer') return isUrdu ? 'کسان پورٹل' : 'Farmer Dashboard';
    if (user.role === 'buyer') return isUrdu ? 'خریدار پورٹل' : 'Buyer Dashboard';
    return isUrdu ? 'ایڈمن پورٹل' : 'Admin Console';
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Duffel-style Trust Strip */}
      <div className="bg-[#0F2618] text-white/90 border-b border-[#1A3D27] hidden sm:block">
        <div className="km-container h-8 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-100/90">
              {isUrdu
                ? 'زیرو کمیشن براہِ راست زرعی تجارت — پاکستان بھر کے کسانوں اور خریداروں کے لیے'
                : 'Direct Agri-Trade with 0% Middleman Fees — Pakistan’s Verified Bidding Exchange'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200/80">
            <a
              href="tel:0800547726"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span className="tabular-nums font-semibold tracking-wide">0800-KISSAN</span>
            </a>
            <span className="text-emerald-800" aria-hidden="true">
              |
            </span>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              {isUrdu ? 'سپورٹ ڈیسک' : 'Support Desk'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Duffel-Style Navbar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-km-sm border-b border-neutral-200/90'
            : 'bg-white/85 backdrop-blur-md border-b border-black/[0.06]'
        }`}
      >
        <div className="km-container h-[68px] flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="KissanMandi Home"
          >
            <Image
              src="/logo.png"
              alt="KissanMandi — Farmers Marketplace"
              width={190}
              height={38}
              className="h-8 sm:h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Navigation Links (Duffel Smooth Pill Hover) */}
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
                  className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-950 font-semibold'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Google Translate Integration */}
            <GoogleTranslate />

            <span
              className="hidden sm:block h-4 w-px bg-neutral-200"
              aria-hidden="true"
            />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getPortalHref()}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{getPortalLabel()}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  aria-label={t('logout')}
                  title={t('logout')}
                  className="p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-full text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/70 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-km-ink hover:bg-km-green-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all active:scale-[0.98]"
                >
                  <span>{isUrdu ? 'شروع کریں' : 'Get Started'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
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
              className="xl:hidden p-2 rounded-full border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 transition-colors"
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

      {/* Mobile / Tablet Slide-Down Drawer (Duffel-Style) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-xl transition-all">
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
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-neutral-200/80 flex flex-col gap-2.5">
              {user ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Link
                    href={getPortalHref()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-semibold shadow-sm"
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
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full border border-neutral-200 bg-white text-neutral-800 text-sm font-semibold"
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
                    className="py-2.5 text-center rounded-full border border-neutral-200 bg-white text-neutral-800 text-sm font-medium"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center rounded-full bg-neutral-900 text-white text-sm font-semibold shadow-sm"
                  >
                    {isUrdu ? 'شروع کریں' : 'Get Started'}
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
