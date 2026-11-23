'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sprout,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Truck,
  Scale,
  Camera,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { locale, setLocale, t } = useLanguage();
  const isUrdu = locale === 'ur';

  return (
    <footer className="mt-20 border-t border-km-green-200/80 bg-white">
      {/* Top Trust Strip */}
      <div className="bg-km-cream-100 border-b border-km-cream-300/70">
        <div className="km-container py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-km-green-100 border border-km-green-200 text-km-green-800 flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-km-ink">
                  {isUrdu ? '۰٪ آڑھتی کمیشن' : '0% Commission Guarantee'}
                </p>
                <p className="text-xs text-km-ink-muted">
                  {isUrdu
                    ? 'کسان پوری قیمت خود رکھتے ہیں'
                    : 'Farmers retain 100% of negotiated value'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-km-green-100 border border-km-green-200 text-km-green-800 flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-km-ink">
                  {isUrdu ? 'تصدیق شدہ فصل کی تصاویر' : 'Photo-Verified Harvests'}
                </p>
                <p className="text-xs text-km-ink-muted">
                  {isUrdu
                    ? 'ہر لسٹنگ حقیقی کھیت کی تصاویر کے ساتھ'
                    : 'Every listing backed by real farm batches'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-km-green-100 border border-km-green-200 text-km-green-800 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-km-ink">
                  {isUrdu ? 'کیش آن ڈیلیوری (COD)' : 'Direct Cash on Delivery'}
                </p>
                <p className="text-xs text-km-ink-muted">
                  {isUrdu
                    ? 'معائنہ اور لوڈنگ پر فوری نقد ادائیگی'
                    : 'Direct handover and settlement at loading'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Architectural Footer Columns */}
      <div className="km-container py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Contact Overview */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-km-green-800 flex items-center justify-center shadow-km-sm">
                <Sprout className="w-5 h-5 text-km-green-300" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-extrabold text-xl text-km-ink tracking-tight">
                  {t('appName')}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-km-green-700 mt-1">
                  {isUrdu ? 'براہِ راست زرعی منڈی' : 'Pakistan Agri-Exchange'}
                </span>
              </div>
            </Link>

            <p className="text-sm text-km-ink-muted leading-relaxed max-w-sm">
              {isUrdu
                ? 'پاکستان کی جدید براہِ راست زرعی منڈی جو کسانوں کو ملک بھر کے تصدیق شدہ خریداروں، ملز اور ایکسپورٹرز سے شفاف بولی کے ذریعے جوڑتی ہے۔'
                : 'Pakistan’s direct agricultural marketplace connecting growers with verified wholesalers, flour mills, and exporters through transparent competitive bidding.'}
            </p>

            {/* Helpline Highlight */}
            <div className="bg-km-cream-100 rounded-2xl p-4 border border-km-cream-300/70 space-y-2 max-w-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-km-green-800">
                <ShieldCheck className="w-4 h-4 text-km-green-700" />
                <span>{isUrdu ? 'کسان ہیلپ لائن' : 'Dedicated Farmer Helpline'}</span>
              </div>
              <a
                href="tel:0800547726"
                className="font-heading text-lg font-extrabold text-km-ink hover:text-km-green-700 transition-colors tabular-nums block"
              >
                0800-KISSAN (0800-547726)
              </a>
              <p className="text-xs text-km-ink-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-km-green-700" />
                <span>Mon–Sat, 7:00 AM – 9:00 PM PKT</span>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              {[
                {
                  href: 'https://facebook.com',
                  label: 'KissanMandi on Facebook',
                  icon: (
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  ),
                },
                {
                  href: 'https://x.com',
                  label: 'KissanMandi on X',
                  icon: (
                    <>
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                    </>
                  ),
                },
                {
                  href: 'https://linkedin.com',
                  label: 'KissanMandi on LinkedIn',
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
                  label: 'KissanMandi on Instagram',
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
                  className="w-9 h-9 rounded-xl border border-km-green-200 bg-white hover:bg-km-green-100 hover:border-km-green-400 text-km-green-800 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4"
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

          {/* Marketplace Column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-extrabold text-km-ink uppercase tracking-[0.12em]">
              {isUrdu ? 'مارکیٹ پلیس' : 'Marketplace'}
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link
                  href="/marketplace"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'تمام فصلیں' : 'Browse All Produce'}
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace/vegetables"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'تازہ سبزیاں' : 'Vegetables'}
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace/fruits"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'باغات کے پھل' : 'Orchard Fruits'}
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace/grains"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'اناج اور چاول' : 'Grains & Rice'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-extrabold text-km-ink uppercase tracking-[0.12em]">
              {isUrdu ? 'پلیٹ فارم' : 'Platform'}
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'طریقہ کار' : 'How It Works'}
                </Link>
              </li>
              <li>
                <Link
                  href="/farmers"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'کسانوں کے لیے' : 'For Farmers'}
                </Link>
              </li>
              <li>
                <Link
                  href="/buyers"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'خریداروں کے لیے' : 'For Buyers'}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'نیا اکاؤنٹ بنائیں' : 'Create Free Account'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-extrabold text-km-ink uppercase tracking-[0.12em]">
              {isUrdu ? 'کمپنی' : 'Company'}
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link
                  href="/about"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'ہمارے بارے میں' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link
                  href="/mission"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'مشن اور ویژن' : 'Mission & Vision'}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'رابطہ کریں' : 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-km-ink-muted hover:text-km-green-800 transition-colors"
                >
                  {isUrdu ? 'لاگ اِن' : 'Sign In'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Hubs Column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-extrabold text-km-ink uppercase tracking-[0.12em]">
              {isUrdu ? 'علاقائی دفاتر' : 'Regional Hubs'}
            </h3>
            <ul className="space-y-3 text-sm text-km-ink-muted font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-km-green-700 flex-shrink-0 mt-0.5" />
                <span>
                  {isUrdu
                    ? 'لاہور، ملتان، فیصل آباد اور مردان'
                    : 'Lahore, Multan, Faisalabad & Mardan'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                <a
                  href="mailto:support@kissanmandi.pk"
                  className="hover:text-km-green-800 transition-colors break-all"
                >
                  support@kissanmandi.pk
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                <span className="tabular-nums">0800-547726</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Language Bar */}
      <div className="bg-km-cream-100 border-t border-km-green-200/70">
        <div className="km-container py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-km-ink-muted font-medium">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
            <p className="text-km-ink font-semibold">
              © {new Date().getFullYear()} KissanMandi Pakistan.{' '}
              {isUrdu ? 'جملہ حقوق محفوظ ہیں۔' : 'All rights reserved.'}
            </p>
            <span className="hidden sm:inline text-km-green-300" aria-hidden="true">
              •
            </span>
            <p>
              {isUrdu
                ? 'براہِ راست کسان تا خریدار کیش آن ڈیلیوری تجارت'
                : 'Direct Producer-to-Buyer Cash on Delivery Trade'}
            </p>
          </div>

          <div className="inline-flex items-center p-0.5 rounded-xl bg-white border border-km-green-200">
            <button
              type="button"
              onClick={() => setLocale('en')}
              aria-pressed={!isUrdu}
              className={`px-2.5 py-1 rounded-[10px] text-[11px] font-bold transition-colors ${
                !isUrdu
                  ? 'bg-km-green-700 text-white'
                  : 'text-km-ink-muted hover:text-km-ink'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLocale('ur')}
              aria-pressed={isUrdu}
              className={`px-2.5 py-1 rounded-[10px] text-[11px] font-bold transition-colors ${
                isUrdu
                  ? 'bg-km-green-700 text-white'
                  : 'text-km-ink-muted hover:text-km-ink'
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
