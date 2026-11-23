'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sprout,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { locale, t } = useLanguage();
  const isUrdu = locale === 'ur';

  return (
    <footer className="bg-white border-t border-km-green-200/80 mt-20">
      <div className="km-container py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-km-green-100">
          {/* Brand Summary */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-km-green-700 flex items-center justify-center shadow-km-sm">
                <Sprout className="w-5 h-5 text-km-green-200" />
              </div>
              <span className="font-extrabold text-xl text-km-ink tracking-tight">
                {t('appName')}
              </span>
            </Link>

            <p className="text-sm text-km-ink-muted leading-relaxed max-w-sm">
              {isUrdu
                ? 'پاکستان کی پہلی براہِ راست زرعی نیلامی منڈی جہاں کسان آڑھتی کمیشن کے بغیر اپنی فصل شفاف قیمت پر فروخت کرتے ہیں۔'
                : 'Pakistan’s direct agricultural bidding marketplace. Connecting farmers and verified commercial buyers directly to eliminate middleman commissions.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-km-green-50 border border-km-green-200 text-xs font-bold text-km-green-800">
              <ShieldCheck className="w-4 h-4 text-km-green-700" />
              <span>
                {isUrdu ? 'زیرو کمیشن • شفاف تجارت' : 'Zero Commission • Transparent Trade'}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="KissanMandi on Facebook"
                className="w-9 h-9 rounded-xl border border-km-green-200 bg-km-cream-50 hover:bg-km-green-100 text-km-green-800 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="KissanMandi on X"
                className="w-9 h-9 rounded-xl border border-km-green-200 bg-km-cream-50 hover:bg-km-green-100 text-km-green-800 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="KissanMandi on LinkedIn"
                className="w-9 h-9 rounded-xl border border-km-green-200 bg-km-cream-50 hover:bg-km-green-100 text-km-green-800 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="KissanMandi on Instagram"
                className="w-9 h-9 rounded-xl border border-km-green-200 bg-km-cream-50 hover:bg-km-green-100 text-km-green-800 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-extrabold text-km-ink uppercase tracking-wider">
              {isUrdu ? 'پلیٹ فارم' : 'Platform'}
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/marketplace" className="text-km-ink-muted hover:text-km-green-700 transition-colors">
                  {isUrdu ? 'مارکیٹ پلیس' : 'Marketplace'}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-km-ink-muted hover:text-km-green-700 transition-colors">
                  {isUrdu ? 'طریقہ کار' : 'How It Works'}
                </Link>
              </li>
              <li>
                <Link href="/farmers" className="text-km-ink-muted hover:text-km-green-700 transition-colors">
                  {isUrdu ? 'کسانوں کے لیے' : 'For Farmers'}
                </Link>
              </li>
              <li>
                <Link href="/buyers" className="text-km-ink-muted hover:text-km-green-700 transition-colors">
                  {isUrdu ? 'خریداروں کے لیے' : 'For Buyers'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-extrabold text-km-ink uppercase tracking-wider">
              {isUrdu ? 'کمپنی' : 'Company'}
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/about" className="text-km-ink-muted hover:text-km-green-700 transition-colors">
                  {isUrdu ? 'ہمارے بارے میں' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-km-ink-muted hover:text-km-green-700 transition-colors">
                  {isUrdu ? 'مشن اور ویژن' : 'Mission & Vision'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-km-ink-muted hover:text-km-green-700 transition-colors">
                  {isUrdu ? 'رابطہ کریں' : 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-km-ink-muted hover:text-km-green-700 transition-colors">
                  {isUrdu ? 'لاگ اِن' : 'Sign In'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-extrabold text-km-ink uppercase tracking-wider">
              {isUrdu ? 'کسان ہیلپ لائن اور دفاتر' : 'Support & Regional Hubs'}
            </h3>
            <div className="bg-km-cream-100 rounded-2xl p-5 border border-km-cream-300/70 space-y-3 text-sm text-km-ink-muted font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-km-green-700 flex-shrink-0 mt-0.5" />
                <span>
                  {isUrdu
                    ? 'زرعی تجارتی مرکز، لاہور، ملتان اور مردان، پاکستان'
                    : 'Agricultural Trade Corridor, Lahore, Multan & Mardan, Pakistan'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                <span className="font-bold text-km-ink">0800-KISSAN (0800-547726)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                <span>support@kissanmandi.pk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-km-ink-subtle font-medium">
          <p>
            © {new Date().getFullYear()} KissanMandi.{' '}
            {isUrdu ? 'جملہ حقوق محفوظ ہیں۔' : 'All rights reserved.'}
          </p>
          <p>
            {isUrdu
              ? 'کیش آن ڈیلیوری (COD) اور براہِ راست کسان تا خریدار ادائیگی۔'
              : 'Direct Producer-to-Buyer Settlement & Cash on Delivery (COD).'}
          </p>
        </div>
      </div>
    </footer>
  );
}
