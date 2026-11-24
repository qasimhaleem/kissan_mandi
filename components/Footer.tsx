'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  Truck,
  Scale,
  Camera,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const isUrdu = locale === 'ur';

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSwitchLanguage = (lang: 'en' | 'ur') => {
    setLocale(lang);
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    if (lang === 'en') {
      document.cookie = 'googtrans=/en/en; path=/;';
      document.cookie = `googtrans=/en/en; path=/; domain=${hostname};`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${hostname};`;
    }
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const isDashboardRoute =
    pathname?.startsWith('/farmer') ||
    (pathname?.startsWith('/buyer') && !pathname?.startsWith('/buyers')) ||
    pathname?.startsWith('/admin');

  if (isDashboardRoute) {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="mt-24 bg-[#0A160E] text-neutral-300 border-t border-[#162D1F]">
      {/* Top Value Assurance Ribbon (Duffel-style crisp architectural strip) */}
      <div className="border-b border-[#162D1F] bg-[#0E2015]/60">
        <div className="km-container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#163321] border border-[#235034] text-km-green-300 flex items-center justify-center flex-shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-tight">
                  {isUrdu ? '۰٪ آڑھتی کمیشن' : '0% Broker Fee Guarantee'}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                  {isUrdu
                    ? 'کسان بولی کی ۱۰۰٪ رقم خود رکھتے ہیں'
                    : 'Growers retain 100% of the winning auction price.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#163321] border border-[#235034] text-km-green-300 flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-tight">
                  {isUrdu ? 'تصدیق شدہ کھیت کی تصاویر' : 'Photo-Verified Batches'}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                  {isUrdu
                    ? 'ہر لسٹنگ اصلی کھیت اور فصل کے نمونوں کے ساتھ'
                    : 'Every harvest listing is verified with clear field photography.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#163321] border border-[#235034] text-km-green-300 flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-tight">
                  {isUrdu ? 'کیش آن ڈیلیوری اور حفاظت' : 'Cash on Delivery Settlement'}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                  {isUrdu
                    ? 'فصل کے معائنہ اور لوڈنگ پر فوری نقد یا بینک ٹرانسفر'
                    : 'Direct payment upon batch inspection and transport loading.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Duffel-Style Newsletter Strip */}
      <div className="border-b border-[#162D1F]">
        <div className="km-container py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h4 className="text-lg font-bold text-white tracking-tight">
                {isUrdu
                  ? 'منڈی کے تازہ ترین ریٹس اور مارکیٹ انڈیکس'
                  : 'Stay updated with live commodity market rates and harvest alerts.'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {isUrdu
                  ? 'پنجاب، سندھ اور خیبر پختونخوا کی منڈیوں کا ہفتہ وار تجزیہ براہِ راست موصول کریں۔'
                  : 'Weekly market insights, verified crop listings, and agricultural trends across Pakistan.'}
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-md"
            >
              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#163321] text-km-green-300 text-xs font-semibold border border-[#235034]">
                  <Check className="w-4 h-4" />
                  <span>
                    {isUrdu
                      ? 'شکریہ! آپ منڈی اپڈیٹس سبسکرائب کر چکے ہیں۔'
                      : 'Subscribed! You will receive weekly market updates.'}
                  </span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={isUrdu ? 'اپنا ای میل درج کریں' : 'Enter your email address'}
                    required
                    className="px-4 py-2.5 rounded-full bg-[#122619] border border-[#1E432C] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-km-green-400 transition-colors sm:w-72"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-km-green-300 hover:bg-km-green-400 text-[#0A160E] text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                  >
                    <span>{isUrdu ? 'سبسکرائب' : 'Subscribe'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Architectural Grid */}
      <div className="km-container py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & System Status */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center group">
              <Image
                src="/logo-white.png"
                alt="KissanMandi — Farmers Marketplace"
                width={195}
                height={38}
                className="h-8 sm:h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
            </Link>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              {isUrdu
                ? 'پاکستان کا پہلا شفاف ایگری کموڈٹی نیٹ ورک جو کسانوں کو براہِ راست ملز، ایکسپورٹرز اور ہول سیل خریداروں سے جوڑتا ہے۔'
                : 'Pakistan’s direct agricultural trading exchange. Connecting growers with institutional buyers, flour mills, and exporters with 0% middleman fees.'}
            </p>

            {/* Duffel-Style Live System Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#122619] border border-[#1E432C] text-xs font-medium text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {isUrdu ? 'تمام سسٹمز فعال اور محفوظ ہیں' : 'All Systems Operational'}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {[
                {
                  href: 'https://facebook.com',
                  label: 'KissanMandi Facebook',
                  icon: (
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  ),
                },
                {
                  href: 'https://x.com',
                  label: 'KissanMandi X',
                  icon: (
                    <>
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                    </>
                  ),
                },
                {
                  href: 'https://linkedin.com',
                  label: 'KissanMandi LinkedIn',
                  icon: (
                    <>
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </>
                  ),
                },
                {
                  href: 'https://instagram.com',
                  label: 'KissanMandi Instagram',
                  icon: (
                    <>
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full border border-[#1E432C] bg-[#122619] hover:bg-km-green-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace Commodities */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isUrdu ? 'مارکیٹ پلیس' : 'Marketplace'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/marketplace"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'تمام فصلیں' : 'Browse All Produce'}
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace/grains"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'چاول اور گندم' : 'Grains & Basmati'}
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace/fruits"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'آم اور کنو کے باغات' : 'Mangoes & Citrus'}
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace/vegetables"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'تازہ سبزیاں' : 'Fresh Vegetables'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions & How It Works */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isUrdu ? 'پلیٹ فارم' : 'Platform'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'طریقہ کار' : 'How It Works'}
                </Link>
              </li>
              <li>
                <Link
                  href="/farmers"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'کسانوں کے لیے گائیڈ' : 'For Farmers'}
                </Link>
              </li>
              <li>
                <Link
                  href="/buyers"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'تجارتی خریدار' : 'For Commercial Buyers'}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'اکاؤنٹ بنائیں' : 'Create Free Account'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isUrdu ? 'کمپنی' : 'Company'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'ہمارے بارے میں' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link
                  href="/mission"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'مشن اور ویژن' : 'Mission & Impact'}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'رابطہ کریں' : 'Contact Support'}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isUrdu ? 'لاگ اِن' : 'Sign In'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Dedicated Regional Helpline */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isUrdu ? 'کسان ہیلپ لائن' : 'Farmer Support'}
            </h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-km-green-300 flex-shrink-0 mt-0.5" />
                <span>
                  {isUrdu
                    ? 'لاہور، ملتان، فیصل آباد، مردان'
                    : 'Lahore, Multan, Faisalabad & Mardan'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-km-green-300 flex-shrink-0" />
                <a
                  href="tel:0800547726"
                  className="font-bold text-white tabular-nums hover:text-km-green-300 transition-colors"
                >
                  0800-KISSAN
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-km-green-300 flex-shrink-0" />
                <a
                  href="mailto:support@kissanmandi.pk"
                  className="hover:text-white transition-colors text-xs"
                >
                  support@kissanmandi.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Duffel-Style Bottom Legal & Language Bar */}
      <div className="border-t border-[#162D1F] bg-[#07100A]">
        <div className="km-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
            <p className="text-neutral-400">
              © {new Date().getFullYear()} KissanMandi Pakistan Technologies Ltd.{' '}
              {isUrdu ? 'جملہ حقوق محفوظ ہیں۔' : 'All rights reserved.'}
            </p>
            <span className="hidden sm:inline text-neutral-700" aria-hidden="true">
              •
            </span>
            <p className="text-neutral-500">
              {isUrdu
                ? 'براہِ راست کسان تا خریدار کیش آن ڈیلیوری شفاف تجارت'
                : 'Direct Producer-to-Buyer Cash on Delivery Trading Network'}
            </p>
          </div>

          <div className="inline-flex items-center p-0.5 rounded-full bg-[#122619] border border-[#1E432C]">
            <button
              type="button"
              onClick={() => handleSwitchLanguage('en')}
              aria-pressed={!isUrdu}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                !isUrdu
                  ? 'bg-km-green-300 text-[#0A160E] shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLanguage('ur')}
              aria-pressed={isUrdu}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                isUrdu
                  ? 'bg-km-green-300 text-[#0A160E] shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              اردو
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
