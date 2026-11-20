'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Vision */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#8FD19E] flex items-center justify-center font-bold text-[#2B2B2B] shadow-sm">
                <Sprout className="w-5 h-5 text-[#2B2B2B]" />
              </div>
              <span className="font-black text-xl text-[#2B2B2B] tracking-tight">
                {t('appName')}
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Pakistan's direct agricultural bidding marketplace. Eliminating traditional commission agents (arhtis) to ensure farmers earn fair prices and buyers obtain fresh harvest transparently.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6DBE82]">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Trade & Fair Pricing</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-[#2B2B2B] uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/" className="text-gray-600 hover:text-[#6DBE82] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-[#6DBE82] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/farmers" className="text-gray-600 hover:text-[#6DBE82] transition-colors">
                  For Farmers
                </Link>
              </li>
              <li>
                <Link href="/buyers" className="text-gray-600 hover:text-[#6DBE82] transition-colors">
                  For Buyers
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Mission */}
          <div>
            <h4 className="text-sm font-black text-[#2B2B2B] uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#6DBE82] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-gray-600 hover:text-[#6DBE82] transition-colors">
                  Mission & Vision
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#6DBE82] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 hover:text-[#6DBE82] transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-sm font-black text-[#2B2B2B] uppercase tracking-wider mb-4">
              Support & Mandi Hub
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6DBE82] flex-shrink-0" />
                <span>Agricultural Trade Corridor, Lahore & Multan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#6DBE82] flex-shrink-0" />
                <span>Helpline: 0800-KISSAN (0800-547726)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6DBE82] flex-shrink-0" />
                <span>support@kissanmandi.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} KissanMandi. All rights reserved.</p>
          <p>Strict Cash on Delivery (COD) & Direct Producer-to-Purchaser Settlement.</p>
        </div>
      </div>
    </footer>
  );
}
